import httpx
from typing import List, Dict
from .models import Post, Anomaly, SummaryResponse, SummaryUser
from .utils import count_words_in_titles, get_user_title_words, similar_title

JSONPLACEHOLDER_URL = "https://jsonplaceholder.typicode.com/posts"

async def fetch_posts() -> List[Dict]:
    # Fetch posts 
    async with httpx.AsyncClient() as client:
        response = await client.get(JSONPLACEHOLDER_URL)
        response.raise_for_status()
        return response.json()
#First approach to find anomalies
# def find_anomalies(posts: List[Dict]) -> List[Anomaly]:
#     # Detect anomalies 
#     anomalies = []
#     seen_titles = {}
#     user_title_counts = {}
#     for post in posts:
#         reasons = []
        
#         if len(post['title']) < 15:
#             reasons.append("Title shorter than 15 characters")
        
#         key = (post['userId'], post['title'].lower())
#         if key in seen_titles:
#             reasons.append("Duplicate title by same user")
#         seen_titles[key] = seen_titles.get(key, 0) + 1
        
#         user_title_counts.setdefault(post['userId'], []).append(post['title'])
#         if reasons:
#             anomalies.append(Anomaly(userId=post['userId'], id=post['id'], title=post['title'], reason=reasons))
    
#     for user, titles in user_title_counts.items():
#         if len(titles) > 5:
#             # Count how many titles are similar to each other
#             similar_pairs = 0
#             for i in range(len(titles)):
#                 for j in range(i+1, len(titles)):
#                     if similar_title(titles[i], titles[j]):
#                         similar_pairs += 1
#             if similar_pairs > 0:
#                 # Flag all posts for this user if not already flagged for this reason
#                 for post in posts:
#                     if post['userId'] == user:
#                         already_flagged = any(
#                             a.id == post['id'] and a.userId == user and any("similar titles" in r.lower() for r in a.reason)
#                             for a in anomalies
#                         )
#                         if not already_flagged:
#                             anomalies.append(Anomaly(
#                                 userId=user,
#                                 id=post['id'],
#                                 title=post['title'],
#                                 reason=["User has >5 similar titles (possible bot)"]
#                             ))
#     return anomalies


#second approach to find anomalies with better efficiency and groupe by normalized titles
def find_anomalies(posts: List[Dict]) -> List[Anomaly]:
    # Detect anomalies 
    anomalies = []
    seen_titles = {}
    normalized_title_counts = {}
    # Helper to normalize a title: lowercase, sort words
    def normalize(title):
        return ' '.join(sorted(title.lower().split()))

    for post in posts:
        reasons = []
        if len(post['title']) < 15:
            reasons.append("Title shorter than 15 characters")
        key = (post['userId'], post['title'].lower())
        if key in seen_titles:
            reasons.append("Duplicate title by same user")
        seen_titles[key] = seen_titles.get(key, 0) + 1
        # Group by normalized title for each user
        norm = normalize(post['title'])
        normalized_title_counts.setdefault(post['userId'], {})
        normalized_title_counts[post['userId']].setdefault(norm, []).append(post)
        if reasons:
            anomalies.append(Anomaly(userId=post['userId'], id=post['id'], title=post['title'], reason=reasons))

    # Efficiently flag users with >5 similar (normalized) titles
    for user, norm_titles in normalized_title_counts.items():
        total_similar = sum(len(posts) for posts in norm_titles.values() if len(posts) > 1)
        if total_similar > 5:
            for posts_with_same_norm in norm_titles.values():
                if len(posts_with_same_norm) > 1:
                    for post in posts_with_same_norm:
                        already_flagged = any(
                            a.id == post['id'] and a.userId == user and any("similar titles" in r.lower() for r in a.reason)
                            for a in anomalies
                        )
                        if not already_flagged:
                            anomalies.append(Anomaly(
                                userId=user,
                                id=post['id'],
                                title=post['title'],
                                reason=["User has >5 similar titles (possible bot)"]
                            ))
    return anomalies

def get_summary(posts: List[Dict]) -> SummaryResponse:
    # Find users with most unique words in their titles
    user_words = get_user_title_words(posts)
    user_word_counts = [(user, len(words), words) for user, words in user_words.items()]
    user_word_counts.sort(key=lambda x: x[1], reverse=True)
    top_users = [SummaryUser(userId=u, unique_word_count=c, unique_words=sorted(list(words))) for u, c, words in user_word_counts[:3]]
    # Most frequent words overall
    word_counter = count_words_in_titles(posts)
    common_words = [w for w, _ in word_counter.most_common(10)]
    return SummaryResponse(top_users=top_users, common_words=common_words)
