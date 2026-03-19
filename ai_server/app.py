from fastapi import FastAPI
from pydantic import BaseModel
from chatbot import parse_command
from nlp_search import extract_keywords
from recommendation import recommend_products

app = FastAPI()

class ChatRequest(BaseModel):
    text: str

@app.post("/chat")
def chat(data: ChatRequest):
    return parse_command(data.text)

@app.post("/search")
def search(data: ChatRequest):
    return extract_keywords(data.text)

@app.post("/recommend")
def recommend(data: dict):
    return recommend_products(data)