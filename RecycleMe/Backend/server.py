# Look at bottom, change ip address (ipv4, --> terminal ipconfig)

from flask import Flask, request
import os
import requests

# # Importing deps for image prediction
from tensorflow.keras.preprocessing import image
from PIL import Image
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model

app = Flask(__name__)

# model = load_model('./model/Xception.keras')
model = tf.keras.applications.Xception(weights='imagenet', include_top=True)

@app.route("/")
def home():
    return {"message": "Hello from backend"}


@app.route('/post', methods=['POST'])
def classify_image():
    
    # Saves image to Uploads Folder
    file = request.files['file']
    file.save('uploads/' + file.filename)

    # Image Processing
    img_path = f"./Uploads/{file.filename}"
    img = image.load_img(img_path, target_size=(299, 299))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = tf.keras.applications.xception.preprocess_input(x)

    # Prediction
    predictions = model.predict(x)
    _, nameOfObject, probablity = tf.keras.applications.xception.decode_predictions(predictions, top=1)[0][0]

    # Deletes image
    if os.path.exists(f"./uploads/{file.filename}"):
        os.remove(f"uploads/{file.filename}")

    return {"message": str(probablity) + " chance the object is a " + nameOfObject, "prompt" : "Is a " + nameOfObject + " recyclable? If so, where does it go? Otherwise, what other ways can I reduce or reuse it? limit your response to 50 words"}




if __name__ == '__main__':
    app.run(host = '143.215.85.237', port = 3000, debug=True)


