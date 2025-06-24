from keyphrase_vectorizers import KeyphraseCountVectorizer
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer, util
from sklearn.decomposition import NMF
import pandas as pd
import torch

def getDataToClassify(df):
    print("\n=== DADOS PARA CLASSIFICAÇÃO ===\n")

    missing_year_df = df[df['year'].isna()]

    for key, row in missing_year_df.iterrows():
        print(f"{key} → sources: {row['sources']}")

    df_selected = df

    df_selected["text"] = (
        df_selected["title"].fillna("") + " " +
        df_selected["abstract"].fillna("") + " " +
        df_selected["keywords"].fillna("")
    )

    # === VETORIZAÇÃO E TOPIC MODELING ===
    vectorizer = KeyphraseCountVectorizer()
    X_keywords = vectorizer.fit_transform(df_selected["text"])

    num_topics = 10
    nmf = NMF(n_components=num_topics, random_state=42)
    W = nmf.fit_transform(X_keywords)
    df_selected["category_id"] = W.argmax(axis=1)

    # === NOMEAÇÃO INICIAL DAS CATEGORIAS COM KEYBERT ===
    kw_model = KeyBERT()
    initial_category_names = []

    for i in range(num_topics):
        textos = df_selected[df_selected["category_id"] == i]["text"].tolist()
        if not textos:
            initial_category_names.append(f"Topic {i}")
            continue

        cluster_text = " ".join(textos)
        keywords = kw_model.extract_keywords(
            cluster_text,
            keyphrase_ngram_range=(2, 3),
            stop_words="english",
            top_n=3
        )

        # Remoção de duplicatas (mesmo conteúdo, ordem diferente)
        seen = set()
        clean_keywords = []
        for kw, _ in keywords:
            parts = frozenset(kw.lower().split())
            if parts not in seen:
                seen.add(parts)
                clean_keywords.append(kw.capitalize())

        if clean_keywords:
            initial_category_names.append(clean_keywords[0])
        else:
            initial_category_names.append(f"Topic {i}")

    # === AGRUPAMENTO SEMÂNTICO DE CATEGORIAS ===
    semantic_model = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = semantic_model.encode(initial_category_names, convert_to_tensor=True)
    cos_sim_matrix = util.cos_sim(embeddings, embeddings).cpu().numpy()

    threshold = 0.8
    clusters = []
    used = set()

    for i, name in enumerate(initial_category_names):
        if i in used:
            continue
        cluster = [name]
        used.add(i)
        for j in range(i + 1, len(initial_category_names)):
            if j not in used and cos_sim_matrix[i][j] >= threshold:
                cluster.append(initial_category_names[j])
                used.add(j)
        clusters.append(cluster)

    final_categories = [cluster[0] for cluster in clusters]

    # Mapeia categorias semelhantes para um único rótulo
    category_mapping = dict()
    for i, cluster in enumerate(clusters):
        for label in cluster:
            category_mapping[label] = final_categories[i]

    # Aplica o nome final da categoria ao DataFrame
    df_selected["category_name"] = df_selected["category_id"].apply(
        lambda cid: category_mapping.get(initial_category_names[cid], f"Topic {cid}")
    )

    # === RESULTADO ===
    # print("\nCategorias finais únicas:\n")
    # for i, label in enumerate(sorted(set(df_selected["category_name"]))):
    #     print(f"{i+1:02d}. {label}")

    # print("\nDataFrame final:\n")
    # print(df_selected[["title", "category_name"]].to_string(index=False))
    # === JSON com categorias ===
    unique_categories = sorted(set(df_selected["category_name"]))

    # === JSON com os dados do DataFrame ===
    data_json = df_selected[["title", "category_name"]].to_dict(orient="records")

    new_df = df_selected.groupby("category_name")["title"].apply(list).to_dict()

    return new_df
