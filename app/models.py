from pydantic import BaseModel
from typing import List, Optional

class Post(BaseModel):
    userId: int
    id: int
    title: str
    body: str

class Anomaly(BaseModel):
    userId: int
    id: int
    title: str
    reason: List[str]

class SummaryUser(BaseModel):
    userId: int
    unique_word_count: int
    unique_words: List[str]

class SummaryResponse(BaseModel):
    top_users: List[SummaryUser]
    common_words: List[str]
