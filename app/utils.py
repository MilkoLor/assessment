from collections import Counter
from typing import List, Dict
import re

def tokenize(text: str) -> List[str]:
    # Simple word tokenizer, ignores punctuation
    return re.findall(r"\b\w+\b", text.lower())

def count_words_in_titles(posts: List[dict]) -> Counter:
    # Count all words in all post titles
    counter = Counter()
    for post in posts:
        counter.update(tokenize(post['title']))
    return counter

def get_user_title_words(posts: List[dict]) -> Dict[int, set]:
    # Map userId to set of unique words in their titles
    user_words = {}
    for post in posts:
        user_words.setdefault(post['userId'], set()).update(tokenize(post['title']))
    return user_words

def similar_title(title1: str, title2: str) -> bool:
    # Consider titles similar if they share more than 70% words
    words1 = set(tokenize(title1))
    words2 = set(tokenize(title2))
    if not words1 or not words2:
        return False
    overlap = words1 & words2
    return len(overlap) / max(len(words1), len(words2)) > 0.7
