import datetime

from flask import  Blueprint, abort

from flask.ext.restful import (Resource, Api, reqparse,
                               inputs, fields, marshal,
                               marshal_with, url_for)

import models
import custom_types

bin_fields = {
    'id': fields.Integer,
    'type': fields.String(attribute='bin_type'),
    'percentage': fields.Integer,
    'lat': fields.Float(attribute='latitude'),
    'lon': fields.Float(attribute='longitude'),
    'last_update': fields.DateTime(dt_format='iso8601')
}


class BinList(Resource):
    def __init__(self):
      self.reqparse = reqparse.RequestParser()
      self.reqparse.add_argument(
          'type',
          required=True,
          help='No bin type provided',
          location=['form', 'json'],
          type=str
      )
      self.reqparse.add_argument(
          'lat',
          required=True,
          help='No latitude provided',
          location=['form', 'json'],
          type=float
      )
      self.reqparse.add_argument(
          'lon',
          required=True,
          help='No longitude provided',
          location=['form', 'json'],
          type=float
      )
  
    def get(self):
        bins = [marshal(bin, bin_fields)
                   for bin in models.SmartBin.select()]
        return {'bins': bins}
      
    @marshal_with(bin_fields)  
    def post(self):
        args = self.reqparse.parse_args()
        try:
          bin = models.SmartBin.create_bin(
            bin_type=args['type'], 
            latitude=args['lat'], 
            longitude=args['lon']
          )
        except Exception as e:
          abort(400, str(e))
        return (bin, 201, {'Location': url_for('resources.bins.bin', id=bin.id)})


class Bin(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument(
            'percentage',
            required=True,
            help='No percentage provided',
            location=['form', 'json'],
            type=custom_types.percentage
        )
        
        super().__init__()

    @marshal_with(bin_fields)
    def get(self, id):        
        try:
          bin = models.SmartBin.get(models.SmartBin.id==id)
        except models.SmartBin.DoesNotExist:
          abort(404, 'Bin does not exist')
        else:
          return bin
      
    @marshal_with(bin_fields)
    def put(self, id):
        args = self.reqparse.parse_args()
        args['last_update'] = datetime.datetime.now()
        query = models.SmartBin.update(**args).where(models.SmartBin.id==id)
        if query.execute():
            return ( models.SmartBin.get(models.SmartBin.id==id), 200,
                    {'Location': url_for('resources.bins.bin', id=id)} )
        else:
            abort(404, 'Bin does not exist')
    
    def delete(self, id):
        query = models.SmartBin.delete().where(models.SmartBin.id==id)
        if query.execute():
            return '', 204, {'Location': url_for('resources.bins.bins')}
        else:
            abort(404, 'Bin does not exist')
        

      
      
bins_api = Blueprint('resources.bins', __name__)
api = Api(bins_api)
api.add_resource(
    BinList,
    '/bins',
    endpoint='bins'
)
api.add_resource(
    Bin,
    '/bins/<int:id>',
    endpoint='bin'
)
