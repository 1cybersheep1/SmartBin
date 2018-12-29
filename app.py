from flask import Flask, render_template

import models
from resources.bins import bins_api

app = Flask(__name__)
app.register_blueprint(bins_api, url_prefix='/api/v1')


@app.route('/')
def hello_world():
    return render_template('map.html')
  
  

DEBUG = True
HOST = '0.0.0.0'
PORT = 8000
if __name__ == '__main__':
    models.initialize()
    app.run(debug=DEBUG, host=HOST, port=PORT)
    
    
    
    