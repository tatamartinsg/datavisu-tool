import bibtexparser
import uuid
import pandas as pd
from pathlib import Path


def getDataFromMultipleBibFiles(request):
    if 'files' not in request.files:
        return None

    files = request.files.getlist('files')
    sources = request.form.getlist('sources')  # Deve vir na mesma ordem dos arquivos

    if len(files) != len(sources):
        return {"error": "Número de arquivos e fontes não coincide."}, 400

    entries = {}

    for file, label in zip(files, sources):
        if file.filename == '':
            continue

        try:
            bib_data = file.read().decode('utf-8')
            bib_database = bibtexparser.loads(bib_data)

            random_id = str(uuid.uuid4())  # ID único para cada fonte

            for entry in bib_database.entries:
                key = entry.get("ID", str(uuid.uuid4()))
                if key not in entries:
                    entries[key] = {
                        "title": entry.get("title", ""),
                        "authors": entry.get("authors", ""),
                        "year": entry.get("year", ""),
                        "journal": entry.get("journal", ""),
                        "abstract": entry.get("abstract", ""),
                        "keywords": entry.get("keywords", ""),
                        "sources": set()
                    }
                entries[key]["sources"].add(label)

        except Exception as e:
            print(f"Erro ao processar o arquivo {file.filename}: {e}")
            continue

    if not entries:
        return {"error": "Nenhuma entrada válida encontrada."}, 400

    # Criar DataFrame
    df = pd.DataFrame(entries).T

    for col in ['title', 'authors', 'journal', 'keywords']:
        df[col] = df[col].astype(str).str.replace(r'[{}]', '', regex=True)

    df['year'] = pd.to_numeric(df['year'], errors='coerce').dropna().astype('Int64')

    # df['sources'] = df['sources'].apply(list)

    print(df)
    return df

# def getDataFromBibFiles2(request):
    files = request.files.getlist("files")
    sources = request.form.getlist("sources")

    if len(files) != len(sources):
        return {"error": "Número de arquivos e fontes não correspondem"}

    entries = {}

    for file, label in zip(files, sources):
        bib_data = file.read().decode("utf-8")
        bib_database = bibtexparser.loads(bib_data)

        random_id = str(uuid.uuid4())

        for entry in bib_database.entries:
            key = entry.get("ID", str(uuid.uuid4()))

            if key not in entries:
                entries[key] = {
                    "title": entry.get("title", ""),
                    "authors": entry.get("author", ""),
                    "year": entry.get("year", ""),
                    "journal": entry.get("journal", ""),
                    "abstract": entry.get("abstract", ""),
                    "keywords": entry.get("keywords", ""),
                    "sources": set()
                }

            entries[key]["sources"].add(label)

    # Transformar para DataFrame
    df = pd.DataFrame(entries).T

    # Limpar colunas
    for col in ['title', 'authors', 'journal', 'keywords']:
        df[col] = df[col].astype(str).str.replace(r'[{}]', '', regex=True)

    # Converter ano
    df['year'] = pd.to_numeric(df['year'], errors='coerce').dropna().astype('Int64')

    # Transformar set de sources em lista
    df['sources'] = df['sources'].apply(list)


    return df

def convertDFToJson(df):
    """
    Converte um DataFrame do Pandas para um dicionário JSON.
    """
    if df is None:
        return None

    df['sources'] = df['sources'].apply(list)
    # Converte o DataFrame para um dicionário
    data = df.reset_index().rename(columns={'index': 'id'}).to_dict(orient='records')

    return data