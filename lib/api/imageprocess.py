import os
from PIL import ImageDraw, ImageFont, Image
from transformers import AutoProcessor, AutoModelForCausalLM
from unittest.mock import patch
from transformers.dynamic_module_utils import get_imports
import random
import numpy as np
import copy

def fixed_get_imports(filename: str | os.PathLike) -> list[str]:
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

# TESTING
# if __name__ == "__main__":
#     model_path = "microsoft/Florence-2-large"
#     model, processor = load_model_and_processor(model_path)

    # Example Usage:
    # image = Image.open("your_image_path.jpg")
    # result_image, result_data = detect_objects(image, task="ocr")
    # result_image.show()
