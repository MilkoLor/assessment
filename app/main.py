

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .services import fetch_posts, find_anomalies, get_summary
from .models import Anomaly, SummaryResponse
from typing import List
import os

app = FastAPI(title="Ad Insights Explorer Lite")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)






frontend_dir = os.path.join(os.path.dirname(__file__), "public")
if os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir, html=True), name="static")


@app.get("/posts")
async def get_posts():
    """Fetch and return raw posts from JSONPlaceholder."""
    return await fetch_posts()

@app.get("/anomalies", response_model=List[Anomaly])
async def anomalies():
    """Detect and return posts with anomalies."""
    posts = await fetch_posts()
    return find_anomalies(posts)

@app.get("/summary", response_model=SummaryResponse)
async def summary():
    """Return summary insights about users and common words."""
    posts = await fetch_posts()
    return get_summary(posts)



@app.get("/")
def root():
    index_path = os.path.join(frontend_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Frontend not built yet."}
