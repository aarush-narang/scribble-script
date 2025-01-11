'''
before use, navigate to api dir, create a virtual env: python3 -m venv venv
then run this to start the virtual environment: source venv/bin/activate

install package list in requirements.txt under your venv

start the server alongside pnpm dev:
python3 lib/api/server.py
'''
import io
import re
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS

from PIL import Image
from imageprocess import detect_objects


app = Flask(__name__)
# I'm using CORS here cuz flask is on port 5000 whereas app is on 3000 
CORS(app)

@app.route("/process", methods=['POST'])
def process():
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({"error": "No image data provided"}), 400
        #removing the 'data:image' header in front of every base64
        image_data = re.sub(r"^data:image\/[a-zA-Z]+;base64,", "", image_data)

        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))


        output_image, result = detect_objects(image, "ocr", None)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": f"Error processing file: {e}"}), 500

if __name__ == "__main__":
    app.run(debug=True)