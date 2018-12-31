from flask import Flask, render_template, jsonify

import models
from resources.bins import bins_api

app = Flask(__name__)
app.config['ERROR_404_HELP'] = False

app.register_blueprint(bins_api, url_prefix='/api/v1')


@app.errorhandler(404)
def custom400(error):
    response = jsonify({'message': error.description})



@app.route('/')
def hello_world():
    return render_template('map.html')
  
  
app.config['ERROR_404_HELP'] = False
DEBUG = True
HOST = '0.0.0.0'
PORT = 8000

if __name__ == '__main__':
    models.initialize()
    #models.SmartBin.create_bin(bin_type='interior', latitude= 39.091562, longitude= -9.259275)
    app.run(debug=DEBUG, host=HOST, port=PORT)
    
    
    
    