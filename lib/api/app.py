import os
from PIL import ImageDraw, ImageFont, Image
from transformers import AutoProcessor, AutoModelForCausalLM
from unittest.mock import patch
from transformers.dynamic_module_utils import get_imports
import random
import numpy as np
import copy
from typing import Union

def fixed_get_imports(filename: Union[str, os.PathLike]) -> list[str]:
    if not str(filename).endswith("modeling_florence2.py"):
        return get_imports(filename)
    imports = get_imports(filename)
    if "flash_attn" in imports:
        imports.remove("flash_attn")
    return imports

def load_model_and_processor(model_path):
    with patch("transformers.dynamic_module_utils.get_imports", fixed_get_imports):  # workaround for unnecessary flash_attn requirement
        model = AutoModelForCausalLM.from_pretrained(model_path, attn_implementation="sdpa", trust_remote_code=True)
    processor = AutoProcessor.from_pretrained(model_path, trust_remote_code=True)
    model.to("cpu")
    return model, processor

def run_example(task_prompt, image, text_input=None):
    model, processor = load_model_and_processor("microsoft/Florence-2-large")

    if text_input is None:
        prompt = task_prompt
    else:
        prompt = task_prompt + text_input
    inputs = processor(text=prompt, images=image, return_tensors="pt")
    generated_ids = model.generate(
        input_ids=inputs["input_ids"],
        pixel_values=inputs["pixel_values"],
        max_new_tokens=1024,
        early_stopping=False,
        do_sample=False,
        num_beams=3,
    )
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=False)[0]
    parsed_answer = processor.post_process_generation(
        generated_text,
        task=task_prompt,
        image_size=(image.width, image.height)
    )

    return parsed_answer

colormap = ['blue', 'orange', 'green', 'purple', 'brown', 'pink', 'gray', 'olive', 'cyan', 'red',
            'lime', 'indigo', 'violet', 'aqua', 'magenta', 'coral', 'gold', 'tan', 'skyblue']

def draw_ocr_bboxes(image, prediction):
    scale = 1
    draw = ImageDraw.Draw(image)
    bboxes, labels = prediction['quad_boxes'], prediction['labels']
    for box, label in zip(bboxes, labels):
        color = random.choice(colormap)
        new_box = (np.array(box) * scale).tolist()
        draw.polygon(new_box, width=3, outline=color)
        draw.text((new_box[0] + 8, new_box[1] + 2),
                  "{}".format(label),
                  align="right",
                  fill=color)

def detect_objects(image, task, text_input=None):
    if not task:
        return image, None

    task_prompt = f"<{task.upper()}>"
    results = run_example(task_prompt, image, text_input)

    # draw = ImageDraw.Draw(image)
    # # Load a font
    # try:
    #     font = ImageFont.truetype(font="arial.ttf", size=100)
    # except IOError:
    #     font = ImageFont.load_default(size=50)

    if task == "ocr":
        return image, results[f"<{task.upper()}>"]
    elif task == "ocr_with_region":
        output_image = copy.deepcopy(image)
        draw_ocr_bboxes(output_image, results[f"<{task.upper()}>"])
        return output_image, None
    else:
        return image, results[f"<{task.upper()}>"]


'''
before use, navigate to api dir, create a virtual env: python3 -m venv venv
then run this to start the virtual environment: source venv/bin/activate

install package list in requirements.txt under your venv

start the server alongside pnpm dev:
python3 lib/api/server.py
'''
import io
import re
import uuid
import base64
import time
import asyncio
from flask import Flask, request, jsonify
from flask_cors import CORS

# PERFORMANCE TESTING
# from datetime import datetime

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

# Routes
@app.route('/')
def hello_world():
   return "Hello, World!"

@app.route("/ping", methods=['GET'])
def ping():
    return "Pong!"

@app.route("/process", methods=['POST'])
def process():
    try:
        data = request.json
        image_data = data.get('image')
        dev_env = data.get('dev_env')

        if dev_env and dev_env == True:
            return jsonify({"result": "#include <iostream> \nint main() { std::cout << \"Hello, World!\" << std::endl; return 0; }"})
        
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
    sol_without_ext = f'temp/{UUID_DIR}/index'

    try:
        data = request.json
        code = data.get('code')
        language = data.get('language') # py, cpp

        input_data = data.get('input')
        expected_output = data.get('expected') 

        if not code:
            return jsonify({"error": "No code provided"}), 400
        if not input_data:
            return jsonify({"error": "No input data provided"}), 400
        if not expected_output:
            return jsonify({"error": "No expected output provided"}), 400
        if not language:
            return jsonify({"error": "No language provided"}), 400
        if language not in ['cpp', 'c', 'py']:
            return jsonify({"error": "Invalid language provided, only cpp and py are supported"}), 400

        else:
            # 0. if temp folder doesn't exist, create it
            if not os.path.exists('temp'):
                os.makedirs('temp')
                
            # 1. create a temp file with the code: index.lang for file name, but store in a new directory with a uuid name
            os.makedirs(f'temp/{UUID_DIR}', exist_ok=True)
            with open(f'{sol_without_ext}.{language}', 'w') as f:
                f.write(code)
            
            match language:
                case 'cpp':
                    # 2. compile the code using the g++ compiler - interpolate the filename and the output filename
                    comp, stdout, stderr = await run(f'g++ {sol_without_ext}.{language} -o {sol_without_ext} -O2 -lm -std=c++17')

                    # 3. if the compilation fails, return the stderr
                    if comp != 0:
                        return jsonify({"result": "Compile error", "stderr": stderr}), 400
                     # 4. if the compilation is successful, run the executable with the input data
                    else:
                        # 5. return the output of the executable
                        executable_path = os.path.abspath(f'{sol_without_ext}')
                        run_exec, stdout, stderr = await run(f'"{executable_path}"', stdin=input_data)

                        if run_exec != 0:
                            return jsonify({"result": "Runtime error", "stderr": stderr}), 400
                        else:
                            return jsonify({"result": stdout})
                case 'py':
                    # 2. run the python code
                    run_exec, stdout, stderr = await run(f'python3 {sol_without_ext}.{language}', stdin=input_data)

                    if run_exec != 0:
                        return jsonify({"result": "Runtime error", "stderr": stderr}), 0
                    else:
                        return jsonify({"result": stdout})
                case _:
                    return jsonify({"error": "Invalid language provided, only cpp and py are supported"}), 400

    except Exception as e:
        return jsonify({"error": f"Error processing file: {e}"}), 500
    finally:
        try:
            # 6. remove the temp folder and files
            if os.path.exists(f'{sol_without_ext}.{language}'):
                os.remove(f'{sol_without_ext}.{language}')
                if language in ['cpp']:
                    os.remove(f'{sol_without_ext}')

            if os.path.exists(f'temp/{UUID_DIR}'):
                os.rmdir(f'temp/{UUID_DIR}')
        except Exception as e:
            print(f"Error deleting temp files in {UUID_DIR}: {e}")

if __name__ == "__main__":
    cert_path = os.path.join(os.path.dirname(__file__), 'cert.pem')
    key_path = os.path.join(os.path.dirname(__file__), 'key.pem')
    
    if not os.path.exists(cert_path):
        raise FileNotFoundError(f"Certificate file not found: {cert_path}")
    if not os.path.exists(key_path):
        raise FileNotFoundError(f"Key file not found: {key_path}")
    
    app.run(host='0.0.0.0', port=443, ssl_context=(cert_path, key_path))
