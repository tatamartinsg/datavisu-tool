from src import app
from flask import make_response, jsonify, request
from flask_cors import cross_origin
from src.services.begin_services import getSuccess
from src.services.begin_services import uploadBibFile

@app.route('/begin', methods=['GET'])
@cross_origin()

def get():
    # response = gameServices.getAllGamesServices()
    response = getSuccess()
    return make_response(
        jsonify(response)
    )

@app.route('/upload_file', methods=['POST'])
@cross_origin()
def postBibFile():
    print("Post Bib File", request)
    # response = gameServices.getAllGamesServices()
    response = uploadBibFile(request)
    return make_response(
        jsonify(response)
    )