import bibtexparser
import uuid
import pandas as pd

def getDataFromBibFile(request):
    if 'file' not in request.files:
        return None

    file = request.files['file']
    # Verifica se o arquivo foi selecionado

    print("File received:", file)

    if file.filename == '':
        return None

    try:
        # Ler o conteúdo do arquivo .bib
        bib_data = file.read().decode('utf-8')

        # Parsear com bibtexparser
        bib_database = bibtexparser.loads(bib_data)

        source = request.form.get('source', 'X')
        fileName = file.filename
        sources = [(fileName, source)]

        print("Parsed Bib Database:", bib_database)

        titles = []
        for entry in bib_database.entries:
            title = entry.get('title', 'No Title')
            titles.append(title)

        fileName = file.filename

        randomId = str(uuid.uuid4()) 

        bib_files = {
            randomId : label
            for filename, label in sources
        }

        for id, label in bib_files.items():
            print(f"{label}: \"{id}\"")

        entries = {}

        for entry in bib_database.entries:
            key = entry["ID"]   # Chave de citação
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

        # Criar um DataFrame
         
        df = pd.DataFrame(entries).T

        for col in ['title', 'authors', 'journal', 'keywords']:
            df[col] = df[col].astype(str).str.replace('[{}]', '', regex=True)

        # Converte o ano para numero
        df['year'] = pd.to_numeric(df['year'], errors='coerce').dropna().astype('Int64')
        # df['sources'] = df['sources'].apply(list)
        
        return df

    except Exception as e:
        print("Error processing file:", str(e))
        return None

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