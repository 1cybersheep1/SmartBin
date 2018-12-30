from flask import jsonify, Blueprint

from flask.ext.restful import Resource, Api


class BinList(Resource):
    def get(self):
        return jsonify({'bins': [{'type':'interior','lat': 39.091562, 'lon': -9.259275, 'percentage': 50},{'type':'exterior','lat': 39.091800, 'lon': -9.259275, 'percentage': 50}]})


bins_api = Blueprint('resources.bins', __name__)
api = Api(bins_api)
api.add_resource(
    BinList,
    '/bins',
    endpoint='bins'
)
