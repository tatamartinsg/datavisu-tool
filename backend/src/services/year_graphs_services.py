
import re
import pandas as pd


def getDataToCreateGraphs(df, firstYear, lastYear):
    df_exploded = df.explode('sources').dropna(subset=['year'])

    counts = (
        df_exploded
        .groupby(['sources', 'year'])
        .size()
        .unstack(fill_value=0)
    )

    years = list(range(firstYear, lastYear))  
    counts = counts.reindex(columns=years, fill_value=0)

    print("Year Counts:")
    for year, count in counts.sum(axis=0).items():
        print(f"{year}: {count}")

    year_data = [
        {"year": str(year), "count": int(count)}
        for year, count in counts.sum(axis=0).items()
    ]

    return year_data

def getDataByAuthors(df):
    # Remove valores ausentes na coluna 'authors'
    df_clean = df.dropna(subset=["authors"]).copy()

    print("DataFrame after dropping NaN authors:"
          )
    print("authos", df_clean["authors"])

    # Divide autores separados por ";" e remove espaços em branco
    df_clean["authors"] = df_clean["authors"].apply(lambda x: [a.strip() for a in x.split(",")])

    # Explode para que cada autor fique em uma linha
    df_exploded = df_clean.explode("authors")

    def is_valid_author(name: str) -> bool:
        name = name.strip()
        if len(name) <= 2:
            return False  # descarta nomes muito curtos, tipo "J."
        if re.match(r"^[A-Z]\.$", name):  # uma letra seguida de ponto
            return False
        if name.lower() in ["et al.", "et al", "anon.", "anonymous"]:
            return False
        return True
    
    df_filtered = df_exploded[df_exploded["authors"].apply(is_valid_author)]    

    # Conta quantas vezes cada autor aparece
    author_counts = (
        df_filtered["authors"]
        .value_counts()
        .head(20)
        .reset_index()
    )

    print("Author Counts:")
    print(author_counts)

    # Transforma em lista de dicionários para gerar gráficos
    author_data = author_counts.to_dict(orient="records")

    # Exemplo de debug
    print("Autores mais frequentes:")
    print(author_data)

    return author_data