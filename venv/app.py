import os
from plot import plot
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        encoded_img = plot(filepath)
        print(encoded_img)

        return jsonify({"img": encoded_img}), 200


if __name__ == '__main__':
    app.run(host="127.0.0.1", debug=True, use_reloader = False, port=5173)
