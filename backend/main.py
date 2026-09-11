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


# import os

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from dotenv import load_dotenv
# from google import genai

# load_dotenv()

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# gemini_api_key = os.getenv("GEMINI_API_KEY")

# client = genai.Client(api_key=gemini_api_key)


# @app.get("/")
# def home():
#     return {"message": "FastAPI is working"}


# @app.post("/chat")
# async def chat(data: dict):
#     message = data.get("message", "")

#     response = client.models.generate_content(
#         model="gemini-3.5-flash",
#         contents=message,
#     )

#     return {
#         "response": response.text
#     }


import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pymongo import MongoClient
from google import genai

load_dotenv()

app = FastAPI()

# -------------------------
# CORS
# -------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000" , https://ai-chatbot-one-orpin.vercel.app/],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Gemini
# -------------------------

gemini_api_key = os.getenv("GEMINI_API_KEY")

if not gemini_api_key:
    raise RuntimeError("GEMINI_API_KEY is missing")

gemini_client = genai.Client(
    api_key=gemini_api_key
)

# -------------------------
# MongoDB
# -------------------------

mongodb_uri = os.getenv("MONGODB_URI")
mongodb_db_name = os.getenv("MONGODB_DB_NAME")

if not mongodb_uri:
    raise RuntimeError("MONGODB_URI is missing")

if not mongodb_db_name:
    raise RuntimeError("MONGODB_DB_NAME is missing")

mongo_client = MongoClient(mongodb_uri)

db = mongo_client[mongodb_db_name]

chats_collection = db["chats"]

# -------------------------
# Routes
# -------------------------

@app.get("/")
def home():
    return {
        "message": "FastAPI is working"
    }


@app.get("/db-test")
def database_test():
    try:
        mongo_client.admin.command("ping")

        return {
            "success": True,
            "message": "MongoDB connected successfully",
            "database": mongodb_db_name
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }


# @app.post("/chat")
# async def chat(data: dict):

#     message = data.get("message", "").strip()

#     if not message:
#         return {
#             "response": "Please enter a message."
#         }

#     try:

#         # Gemini response
#         response = await gemini_client.aio.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=message,
#         )

#         ai_response = response.text

#         # Save chat in MongoDB
#         chat_document = {
#             "user_message": message,
#             "assistant_response": ai_response,
#         }

#         chats_collection.insert_one(chat_document)

#         return {
#             "response": ai_response
#         }

#     except Exception as e:

#         print("Error:", repr(e))

#         return {
#             "response": "Server error: " + str(e)
#         }

@app.post("/chat")
async def chat(data: dict):
    message = data.get("message", "").strip()

    if not message:
        return {
            "response": "Please enter a message.",
            "saved": False
        }

    try:
        # Generate Gemini response
        response = await gemini_client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=message,
        )

        ai_response = response.text

        # Save to MongoDB
        chat_document = {
            "user_message": message,
            "assistant_response": ai_response,
        }

        result = chats_collection.insert_one(chat_document)

        print("MongoDB SAVED:", result.inserted_id)

        return {
            "response": ai_response,
            "saved": True,
            "mongo_id": str(result.inserted_id)
        }

    except Exception as e:
        print("ERROR:", repr(e))

        return {
            "response": "Server error: " + str(e),
            "saved": False
        }
