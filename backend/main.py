from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv
import asyncio
import re

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class QueryRequest(BaseModel):
    query: str
    product: str

SYSTEM_PROMPT = """You are a helpful shopping assistant.
When asked about products, recommend the top 5 specific brands or products.
Format your response EXACTLY like this numbered list:
1. Brand Name One
2. Brand Name Two
3. Brand Name Three
4. Brand Name Four
5. Brand Name Five
Only output the numbered list. No intro, no explanation, no extra text."""

def extract_brands(text: str) -> list:
    # Remove <think>...</think> blocks from Qwen
    text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)
    lines = text.strip().split('\n')
    brands = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        cleaned = re.sub(r'^[\d]+[\.\)]\s*', '', line)
        cleaned = re.sub(r'^[\-\•\*]\s*', '', cleaned)
        cleaned = re.sub(r'\*\*(.*?)\*\*', r'\1', cleaned)
        cleaned = re.split(r'[:\-–]', cleaned)[0]
        cleaned = cleaned.strip()
        if cleaned and len(cleaned) > 2:
            brands.append(cleaned)
    return brands[:5]

def get_rank(product: str, brands: list) -> int:
    product_lower = product.lower()
    product_words = [w for w in product_lower.split() if len(w) > 2]
    for i, brand in enumerate(brands):
        brand_lower = brand.lower()
        if product_lower in brand_lower:
            return i + 1
        for word in product_words:
            if word in brand_lower:
                return i + 1
    return 0

async def query_gemini_flash(query: str, product: str) -> dict:
    try:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": query}
                ]
            )
        )
        text = response.choices[0].message.content
        brands = extract_brands(text)
        rank = get_rank(product, brands)
        return {
            "model": "Llama 3.1 (Groq)",
            "response": text,
            "brands": brands,
            "rank": rank,
            "ranked": rank > 0
        }
    except Exception as e:
        return {
            "model": "Llama 3.1 (Groq)",
            "response": str(e),
            "brands": [],
            "rank": 0,
            "ranked": False
        }

async def query_gemini_pro(query: str, product: str) -> dict:
    try:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: groq_client.chat.completions.create(
                model="qwen/qwen3-32b",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": query}
                ]
            )
        )
        text = response.choices[0].message.content
        brands = extract_brands(text)
        rank = get_rank(product, brands)
        return {
            "model": "Qwen 3 (Alibaba)",
            "response": text,
            "brands": brands,
            "rank": rank,
            "ranked": rank > 0
        }
    except Exception as e:
        return {
            "model": "Qwen 3 (Alibaba)",
            "response": str(e),
            "brands": [],
            "rank": 0,
            "ranked": False
        }

async def query_llama(query: str, product: str) -> dict:
    try:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": query}
                ]
            )
        )
        text = response.choices[0].message.content
        brands = extract_brands(text)
        rank = get_rank(product, brands)
        return {
            "model": "Llama 3 (Groq)",
            "response": text,
            "brands": brands,
            "rank": rank,
            "ranked": rank > 0
        }
    except Exception as e:
        return {
            "model": "Llama 3 (Groq)",
            "response": str(e),
            "brands": [],
            "rank": 0,
            "ranked": False
        }

@app.post("/api/analyze")
async def analyze(request: QueryRequest):
    results = await asyncio.gather(
        query_gemini_flash(request.query, request.product),
        query_gemini_pro(request.query, request.product),
        query_llama(request.query, request.product)
    )

    results_list = list(results)
    ranked_count = sum(1 for r in results_list if r["ranked"])

    if ranked_count == 3:
        grade = "A"
        grade_color = "#22c55e"
        message = "Excellent! All 3 AIs recommend your product."
    elif ranked_count == 2:
        grade = "B"
        grade_color = "#3b82f6"
        message = "Good. 2 out of 3 AIs recommend your product."
    elif ranked_count == 1:
        grade = "C"
        grade_color = "#f59e0b"
        message = "Needs work. Only 1 AI recommends your product."
    else:
        grade = "F"
        grade_color = "#ef4444"
        message = "Critical. No AI recommends your product."

    return {
        "query": request.query,
        "product": request.product,
        "grade": grade,
        "grade_color": grade_color,
        "message": message,
        "ranked_count": ranked_count,
        "results": results_list
    }

@app.get("/")
def root():
    return {"status": "AEO Diagnostic API running"}