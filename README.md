# 🔍 AEO Diagnostic - Answer Engine Optimization

- **Does your content exist to an AI agent? Find out in seconds.

Built by Sunkara PurnaSekhar.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| 🎨 Frontend | https://aeo-diagnostic.vercel.app |
| 🔌 Backend API | https://aeo-diagnostic-api.onrender.com |
| 📡 Health Check | https://aeo-diagnostic-api.onrender.com/ |

---

## 🎯 What is AEO Diagnostic?

**AEO = Answer Engine Optimization - the emerging discipline of writing content that AI agents can actually parse, understand, and act on.

Most content teams optimize for Google. Almost none ask the harder question: when an AI agent reads this page, does it extract the right meaning? Does it recommend you, cite you, or ignore you entirely?

AEO Diagnostic makes that invisible problem visible.

### How it works:
1. 📝 Paste any query a user or agent might ask
2. 🏷️ Enter your brand, product, or content topic
3. ⚡ Queries 3 AI engines simultaneously - not sequentially
4. 📊 Returns a structured report showing exactly how each AI parsed, ranked, and cited your content

---

## 🏆 Why This Problem Matters

The audience for content is changing. More and more, what gets 
written is read by agents as much as by people - summarizing, 
routing, recommending, deciding.

Content that isn't structured for agent consumption gets ignored, 
misrepresented, or outranked by content that is.

AEO Diagnostic is an experiment in making that gap measurable.

Problem	Impact
AI ignores your content	No citations, no recommendations
Wrong content gets cited	Competitors get the attribution
You can't see the gap	You can't fix what you can't measure

---

## ✨ Features

- ⚡ **3 AI engines queried simultaneously** using `asyncio.gather` — not sequentially
- 🎯 **Intelligent brand matching** — detects partial matches, word matches, variant names
- 📊 **Report card grading** — A, B, C, F based on how many AIs recommend you
- 🔢 **Exact rank detection** — knows if you're #1 or #5
- 🧹 **Clean response parsing** — strips `<think>` tags, markdown, numbering automatically
- 📱 **Fully responsive** — works on mobile and desktop
- 🚀 **Production deployed** — live on Vercel + Render

---

## 🏗️ Architecture

```
┌─────────────────────┐     ┌──────────────────────┐
│   React 18 + Vite   │────▶│   FastAPI + Python    │
│   Tailwind CSS      │     │   Uvicorn ASGI        │
│   Vercel CDN        │     │   Render Free Tier    │
└─────────────────────┘     └──────────┬───────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                   ▼
           ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
           │  Llama 3.3   │  │  Llama 3.1   │  │   Qwen 3     │
           │  70B (Groq)  │  │  8B (Groq)   │  │  32B (Groq)  │
           └──────────────┘  └──────────────┘  └──────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| 🎨 Frontend | React 18 + Vite + Tailwind CSS | Live UI with instant results |
| 🔌 Backend | FastAPI + Python 3.11 | Async REST API |
| 🤖 AI Engine 1 | Llama 3.3 70B via Groq | Primary AI recommendation engine |
| 🤖 AI Engine 2 | Llama 3.1 8B via Groq | Secondary AI recommendation engine |
| 🤖 AI Engine 3 | Qwen 3 32B via Groq | Tertiary AI recommendation engine |
| 🚀 Frontend Host | Vercel | Global CDN deployment |
| ⚙️ Backend Host | Render | Production API hosting |

---

## 📡 API Reference

### Base URL
```
https://aeo-diagnostic-api.onrender.com
```

### Health Check
```
GET /
→ {"status": "AEO Diagnostic API running"}
```

### Analyze
```
POST /api/analyze
Content-Type: application/json

{
  "query": "best tool for building RAG pipelines in production",
  "product": "LangChain"
}
```

### Response
```json
{
  "query": "best tool for building RAG pipelines in production",
  "product": "LangChain",
  "grade": "A",
  "grade_color": "#22c55e",
  "message": "Excellent! All 3 AIs recommend your product.",
  "ranked_count": 3,
  "results": [
    {
      "model": "Llama 3.3 (Groq)",
      "brands": ["LangChain", "LlamaIndex", "..."],
      "rank": 1,
      "ranked": true
    }
  ]
}
```

### Grading System
| Grade | Meaning |
|---|---|
| 🟢 A | All 3 AIs recommend your product |
| 🔵 B | 2 out of 3 AIs recommend your product |
| 🟡 C | Only 1 AI recommends your product |
| 🔴 F | No AI recommends your product |

---

## 🔑 Key Engineering Decisions

### ⚡ Async Parallel Queries
All 3 AI engines are queried **simultaneously** using `asyncio.gather` — not one after another. This cuts response time by 3x.

```python
results = await asyncio.gather(
    query_llama_33(query, product),
    query_llama_31(query, product),
    query_qwen3(query, product)
)
```

### 🧹 Intelligent Response Parsing
AI responses come in many formats — numbered lists, markdown bold, `<think>` tags from reasoning models. The parser handles all of them:

```python
def extract_brands(text: str) -> list:
    # Remove <think>...</think> blocks from reasoning models
    text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)
    # Strip numbering, bullets, markdown
    # Extract clean brand names
```

### 🎯 Smart Brand Matching
Detects your product even when AI mentions variant names:

```python
def get_rank(product: str, brands: list) -> int:
    # "Nike" matches "Nike Air Zoom Pegasus"
    # "Nature Made" matches "Nature Made Magnesium Glycinate"
    # Word-level matching for partial brand names
```

---

## 📁 Project Structure

```
aeo-diagnostic/
├── 📂 backend/
│   ├── main.py              # FastAPI app + all 3 AI query functions
│   ├── requirements.txt     # Python dependencies
│   ├── Procfile             # Render deployment config
│   └── runtime.txt          # Python 3.11 pin
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── App.jsx          # Main component — form + results UI
│   │   └── main.jsx         # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API key (free at console.groq.com)

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
```

Create `backend/.env`:
```
GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here
```

```bash
uvicorn main:app --reload
# Runs on http://127.0.0.1:8000
```

### Frontend
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://127.0.0.1:8000
```

```bash
npm run dev
# Runs on http://localhost:5173
```

---

## 🧪 Example Queries
| Query | Brand / Topic | Expected |
|---|---|---|
| best tool for building RAG pipelines in production | LangChain | 🟢 A |
| how to reduce hallucinations in LLM outputs | Anthropic | 🟢 A |
| best framework for building AI agents | AutoGPT | 🔵 B/C |
| what is answer engine optimization | Manicule | 🔴 F |

---

## 🔮 What I'd Build Next

- 📈 **Weekly rank tracking** — monitor your AEO score over time
- 🔔 **Email alerts** — get notified when your rank drops
- 🏆 **Competitor comparison** — see exactly who's beating you and why
- 🔗🔗 **Content optimization suggestions** — auto-generate restructured content based on what agents actually cited
- 📊 **Dashboard** — historical trends, category benchmarks, actionable insights
- 🌍 **Multi-market** — query AI engines in different languages for global sellers

---

## 👨‍💻 Built By

**Sunkara PurnaSekhar**
- 💼 2+ years building production AI systems, agent workflows, and content pipelines
- 🔗 [GitHub](https://github.com/SekharSunkara6) | [LinkedIn](https://www.linkedin.com/in/sekhar-sunkara-1b869b1a8/) | [Portfolio](https://sekharsunkaraportfolio.netlify.app/)
