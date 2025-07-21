
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import pytest
from app.services import find_anomalies, get_summary

# Sample data for testing
posts = [
    {"userId": 1, "id": 1, "title": "short", "body": "..."},
    {"userId": 1, "id": 2, "title": "A unique title for testing", "body": "..."},
    {"userId": 1, "id": 3, "title": "A unique title for testing", "body": "..."},
    {"userId": 2, "id": 4, "title": "Another title", "body": "..."},
    {"userId": 2, "id": 5, "title": "Another title", "body": "..."},
    {"userId": 2, "id": 6, "title": "Another title", "body": "..."},
    {"userId": 2, "id": 7, "title": "Another title", "body": "..."},
    {"userId": 2, "id": 8, "title": "Another title", "body": "..."},
    {"userId": 2, "id": 9, "title": "Another title", "body": "..."},
]

def test_find_anomalies():
    anomalies = find_anomalies(posts)
    # Should flag short title
    assert any(a.title == "short" and "shorter" in ",".join(a.reason) for a in anomalies)
    # Should flag duplicate title
    assert any(a.title == "A unique title for testing" and "Duplicate" in ",".join(a.reason) for a in anomalies)
    # Should flag user with >5 similar titles
    assert any(a.userId == 2 and "similar" in ",".join(a.reason).lower() for a in anomalies)

def test_get_summary():
    summary = get_summary(posts)
    assert hasattr(summary, "top_users")
    assert hasattr(summary, "common_words")
    assert len(summary.top_users) <= 3
    assert isinstance(summary.common_words, list)
