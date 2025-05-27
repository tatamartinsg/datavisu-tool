from src import app
from flask import make_response, jsonify, request
from flask_cors import CORS
from src.services.word_cloud_services import getSuccess
from src.services.word_cloud_services import getDataToCreateAWordCloud

CORS(app, 
     origins=["http://localhost:3000"], 
     supports_credentials=True)
     
@app.route('/begin', methods=['GET'])
def get():
    # response = gameServices.getAllGamesServices()
    response = getSuccess()
    return make_response(
        jsonify(response)
    )

@app.route('/upload_file', methods=['POST'])
def postBibFile():
    print("Post Bib File", request)
    # response = gameServices.getAllGamesServices()
    response = getDataToCreateAWordCloud(request)
    return make_response(
        jsonify(response)
    )