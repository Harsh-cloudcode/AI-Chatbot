# from fastapi import FastAPI

# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app = FastAPI()

# @app.get("/")
# def home():
#     return {"message": "Backend is working"}

# @app.get("/health")
# def health():
#     return {"status": "ok"}




# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def home():
#     return {"message": "FastAPI is working"}

# @app.post("/chat")
# async def chat(data: dict):
#     message = data.get("message", "")

#     return {
#         "response": f"Backend received: {message}"
#     }


import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gemini_api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=gemini_api_key)


@app.get("/")
def home():
    return {"message": "FastAPI is working"}


@app.post("/chat")
async def chat(data: dict):
    message = data.get("message", "")

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=message,
    )

    return {
        "response": response.text
    }