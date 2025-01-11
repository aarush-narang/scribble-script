'''
before use, navigate to api dir, create a virtual env: python3 -m venv venv
then run this to start the virtual environment: source venv/bin/activate

install package list in requirements.txt under your venv

start the server alongside pnpm dev:
python3 lib/api/server.py
'''
import io
import os
import re
import uuid
import base64
import time
import asyncio
from flask import Flask, request, jsonify
from flask_cors import CORS

from PIL import Image
from imageprocess import detect_objects

# PERFORMANCE TESTING
from datetime import datetime

app = Flask(__name__)
# I'm using CORS here cuz flask is on port 5000 whereas app is on 3000 
CORS(app)

os.environ["TOKENIZERS_PARALLELISM"] = "false"

# Helpers
async def run(command, stdin=None):
    process = await asyncio.create_subprocess_shell(
        command,
        stdin=asyncio.subprocess.PIPE if stdin else None,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    stdout, stderr = await process.communicate(input=stdin.encode() if stdin else None)

    return process.returncode, stdout.decode(), stderr.decode()


@app.route("/process", methods=['POST'])
def process():
    try:
        data = request.json
        image_data = data.get('image')
        dev_env = data.get('dev_env')

        if dev_env and dev_env == True:
            print("Entereddd")
            return jsonify({"result": "#include <iostream> \n using namespace std;\n int main() {\ncout << \"Hello, World!\" << endl;\n return 0;\n }\n"})
        
        if not image_data:
            return jsonify({"error": "No image data provided"}), 400
        #removing the 'data:image' header in front of every base64
        image_data = re.sub(r"^data:image\/[a-zA-Z]+;base64,", "", image_data)

        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        # print("unwrapped b64, ready: ", datetime.now().strftime("%H:%M:%S"))
        output_image, result = detect_objects(image, "ocr", None)
        # print("ouput returned: ", datetime.now().time().strftime("%H:%M:%S"))
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": f"Error processing file: {e}"}), 500

@app.route("/compile", methods=['POST']) # only compiles c++ for now
async def compileAndRunCode():
    UUID_DIR = uuid.uuid4()
    sol_file = f'temp/{UUID_DIR}/index.cpp'
    sol_without_ext = f'temp/{UUID_DIR}/index'

    try:
        data = request.json
        code = data.get('code')

        input_data = data.get('input')
        expected_output = data.get('expected') 

        if not code:
            return jsonify({"error": "No code provided"}), 400
        if not input_data:
            return jsonify({"error": "No input data provided"}), 400
        if not expected_output:
            return jsonify({"error": "No expected output provided"}), 400

        else:
            # 0. if temp folder doesn't exist, create it
            if not os.path.exists('temp'):
                os.makedirs('temp')
                
            # 1. create a temp file with the code: index.cpp for file name, but store in a new directory with a uuid name
            os.makedirs(f'temp/{UUID_DIR}', exist_ok=True)
            with open(sol_file, 'w') as f:
                f.write(code)
            
            # 2. compile the code using the g++ compiler - interpolate the filename and the output filename
            comp, stdout, stderr = await run(f'g++ {sol_file} -o {sol_without_ext} -O2 -lm -std=c++17')

            # 3. if the compilation fails, return the stderr
            if comp != 0:
                return jsonify({"result": "Compile error", "stderr": stderr}), 0
            
            # 4. if the compilation is successful, run the executable with the input data
            else:
                # 5. return the output of the executable
                executable_path = os.path.abspath(f'{sol_without_ext}.exe')
                run_exec, stdout, stderr = await run(f'"{executable_path}"', stdin=input_data)

                if run_exec != 0:
                    return jsonify({"result": "Runtime error", "stderr": stderr}), 0
                else:
                    return jsonify({"result": stdout})

    except Exception as e:
        return jsonify({"error": f"Error processing file: {e}"}), 500
    finally:
        # 6. remove the temp folder and files
        if os.path.exists(sol_file):
            os.remove(sol_file)
            os.remove(f'{sol_without_ext}.exe')
        if os.path.exists(f'temp/{UUID_DIR}'):
            os.rmdir(f'temp/{UUID_DIR}')

if __name__ == "__main__":
    app.run(debug=True)