import os
from flask import Flask


app = Flask(__name__)
folder_path = '../public/assets/'

@app.route('/api/images')
def get_file_names():
    for _, _, files in os.walk(folder_path):
        return files
