from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from database import *
app = FastAPI()

origins = [
    "http://localhost:3000",  # Assuming your React app runs on 127.0.0.1:8000:3000
]

# Add CORSMiddleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow credentials, methods, and headers for these origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class LoginInfo(BaseModel):
    email: str
    password: str

class RegisterInfo(BaseModel):
    displayName: str
    email: str
    password: str

class User(BaseModel):
    UserID: int
    DisplayName: int
    Email: str

class MessageInfo(BaseModel):
    SenderID: int
    ReceiverID: int
    TextMessage: str

@app.post("/login")
async def login(login_info: LoginInfo):
    present, user = verify_user(login_info.email, login_info.password)
    # authenticate the details here from db
    if present:
        return {
            "status": "success",
            "message": "Login successful",
            "data": {
                "token": "generated_token_here",  # This should be a real token generated for the session or user
                "user": user
            }
        }
    else:
        return {
            "status": "error",
            "message": "Error description here.",
            "error": "bad error"
        }
    
@app.post("/register")
async def register(register_info: RegisterInfo):
    # register the details here in db
    if add_user_to_database(register_info.displayName, register_info.email, register_info.password):
        return {
            "status": "success",
            "message": "Registration successful",
            "data": {
                "token": "generated_token_here",  # This should be a real token generated for the session or user
                "user": {
                    "email": register_info.email,
                    "displayName": register_info.displayName,
                    "role": "User"
                }
            }
        }
    else:
        return {
            "status": "error",
            "message": "Error description here.",
            "error": "bad error"
        }
    
@app.post("/get-friends/{userId}")
async def get_friends(userId):
    # Get users from database
    friends = get_user_friends(userId)
    return {
        "status": "success",
        "message": "Friends retrieved successfully",
        "data": {
            "token": "generated_token_here",  # This should be a real token generated for the session or user
            "friends": friends
        }
    }
    
    
@app.post("/chat-history/{senderId}/{receiverId}")
async def chat_history(senderId, receiverId):
    messages = get_messages_and_extract_text(senderId, receiverId)
    return {
        "status": "success",
        "message": "Friends retrieved successfully",
        "data": {
            "token": "generated_token_here",  # This should be a real token generated for the session or user
            "messages": messages
        }
    }

@app.get("/add-friend/{senderId}/{friendEmail}")
async def add_friend(senderId, friendEmail):
    print(senderId, friendEmail)
    if add_friend_by_email(senderId, friendEmail):
        return {
            "status": "success",
            "message": "Friends retrieved successfully",
        }
    else:
        return {
            "status": "error",
            "message": "Error description here.",
            "error": "bad error"
        }

@app.post("/message")
async def send_message(messageBody: MessageInfo):
    if insert_message_into_audio_image(messageBody.SenderID, messageBody.ReceiverID, messageBody.TextMessage):
        return {
            "status": "success",
            "message": "Message stored successfully",
        }
    else:
        return {
            "status": "error",
            "message": "Error description here.",
            "error": "bad error"
        }

@app.post("/delete-friend/{userId}/{friendId}")
async def remove_friend(userId, friendId):
    print("Removing Friend with Id:", friendId)
    delete_friend(userId, friendId)
    return {
            "status": "success",
            "message": "Friend Removed Successfully",
        }