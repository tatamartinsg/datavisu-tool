import bibtexparser
import uuid
import pandas as pd
from src.utils.file import getDataFromBibFile, convertDFToJson

def getSuccess():
    return "success"

def uploadBibFile(request):
    df = getDataFromBibFile(request)

    if df is None:
        return {
            "status": 500,
            "message": "An error occurred while processing the file.",
            "data": None
        }
    
    data = convertDFToJson(df)
    return {
        "status": 200,
        "message": "File processed successfully.",
        "data": data
    }
    
    
    
