from src.services.classification_services import getDataToClassify
from src.services.word_cloud_services import getDataToCreateAWordCloud
from src.services.year_graphs_services import getDataToCreateGraphs
from src.utils.file import getDataFromMultipleBibFiles
import nltk

def returnData(request):
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
    categories = getDataToClassify(df)

    print("categories", categories)
    
    newDf = df
    word_cloud_data = getDataToCreateAWordCloud(newDf, request)

    firstYear = int(request.form.get('first_year'))
    lastYear = int(request.form.get('last_year'))
    year_data = getDataToCreateGraphs(newDf, firstYear, lastYear)

    
    return {
        "status": 200,
        "message": "File processed successfully.",
        "data": word_cloud_data,
        "year_data": year_data,
        "categories": categories
    }