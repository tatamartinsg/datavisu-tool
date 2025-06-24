import uuid
import pandas as pd
from src.utils.file import getDataFromMultipleBibFiles, convertDFToJson
from src.services.year_graphs_services import getDataToCreateGraphs

import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from collections import Counter

def getSuccess():
    return "success"

def clean_and_lemmatize(keyword):
    """
    Lowercase, strip whitespace, remove generic stopwords,
    and lemmatize nouns to singular form.
    """
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))

    # Add custom generic words to remove
    custom_stop = {'thing', 'things', 'study', 'studies', 'article', 'paper'}
    kw = keyword.lower().strip()
    if kw in stop_words or kw in custom_stop or len(kw) < 3:
        return None
    # Lemmatize as noun
    return lemmatizer.lemmatize(kw, pos='n')

def getDataToCreateAWordCloud(request):
    nltk.download('stopwords')
    nltk.download('wordnet')

    print("request", request.form)

    df = getDataFromMultipleBibFiles(request)

    if df is None:
        return {
            "status": 500,
            "message": "An error occurred while processing the file.",
            "data": None
        }

    # 1) Build a flattened list of all cleaned keywords
    all_cleaned = []
    keyWordsWithDropna = df['keywords'].dropna().str.split(',')
    for kws in keyWordsWithDropna:
        for kw in kws:
            cleaned = clean_and_lemmatize(kw)
            if cleaned:
                all_cleaned.append(cleaned)

    # 2) Count frequencies of cleaned keywords
    cleaned_counts = Counter(all_cleaned)

    mostCommonParam = int(request.form.get('quantity', 200))

    print("Cleaned Keywords Frequency:")
    for keyword, count in cleaned_counts.most_common(mostCommonParam):
        print(f"{keyword}: {count}")

    word_cloud_data = [
        {"text": keyword, "value": count}
        for keyword, count in cleaned_counts.most_common(mostCommonParam)
    ]

    firstYear = int(request.form.get('first_year'))
    lastYear = int(request.form.get('last_year'))
    year_data = getDataToCreateGraphs(df, firstYear, lastYear)
    
    return {
        "status": 200,
        "message": "File processed successfully.",
        "data": word_cloud_data,
        "year_data": year_data
    }