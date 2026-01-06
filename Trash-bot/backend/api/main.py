
# from fastapi import FastAPI, File, UploadFile
# from fastapi.middleware.cors import CORSMiddleware
# import uvicorn
# import numpy as np
# from io import BytesIO
# from PIL import Image
# import tensorflow as tf

# app = FastAPI()

# origins = [
#     "http://localhost",
#     "http://localhost:3000",
# ]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# MODEL = tf.keras.models.load_model("../saved_models/1/trash.keras")


# CLASS_NAMES = ["e-waste","food","paper", "plastic"]


# @app.get("/ping")
# async def ping():
#     return "Hello, I am alive"


# def read_file_as_image(data) -> np.ndarray:
#     image = np.array(Image.open(BytesIO(data)))
#     return image


# @app.post("/predict")
# async def predict(file: UploadFile = File(...)):
#     image = read_file_as_image(await file.read())
#     img_batch = np.expand_dims(image, axis=0)

#     predictions = MODEL.predict(img_batch)
#     print("Raw predictions:", predictions)  # Debugging line

#     predicted_class_index = np.argmax(predictions[0])
#     predicted_class = CLASS_NAMES[predicted_class_index]
#     confidence = np.max(predictions[0])

#     # Print the class probabilities
#     for idx, class_name in enumerate(CLASS_NAMES):
#         print(f"{class_name}: {predictions[0][idx]:.4f}")

#     return {
#         'class': predicted_class,
#         'confidence': float(confidence)
#     }


# if __name__ == "__main__":
#     uvicorn.run(app, host='localhost', port=8000)


from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import os

# Suppress TensorFlow info/warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

app = FastAPI()

# Allow CORS from frontend
origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://trash-classification-iota.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model path (relative to this file)
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "trash.keras")

# Load model
print(f"Loading model from: {MODEL_PATH}")
MODEL = tf.keras.models.load_model(MODEL_PATH)

CLASS_NAMES = ["e-waste", "food", "paper", "plastic"]

@app.get("/ping")
async def ping():
    return {"message": "Hello, I am alive"}

def read_file_as_image(data) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert("RGB")
    return np.array(image)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, axis=0)

    predictions = MODEL.predict(img_batch)
    predicted_class_index = int(np.argmax(predictions[0]))
    predicted_class = CLASS_NAMES[predicted_class_index]
    confidence = float(np.max(predictions[0]))

    return {
        "class": predicted_class,
        "confidence": confidence
    }

# Use this for local testing only
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
