import feedparser
import json

# URLs for Education and Exam News
NEWS_URL = "https://news.google.com/rss/headlines/section/topic/EDUCATION?hl=hi&gl=IN&ceid=IN:hi"
GOVT_EXAMS_URL = "https://news.google.com/rss/search?q=Sarkari+Result+Exams+Form+admit+card&hl=hi&gl=IN&ceid=IN:hi"
CBSE_URL = "https://news.google.com/rss/search?q=CBSE+Latest+Syllabus+Board+Exams&hl=hi&gl=IN&ceid=IN:hi"
TRENDING_URL = "https://news.google.com/rss/headlines?hl=hi&gl=IN&ceid=IN:hi"

def get_thumbnail(title):
    t = title.lower()
    if any(k in t for k in ["cbse", "board", "class", "10th", "12th", "syllabus", "कक्षा", "बोर्ड", "पाठ्यक्रम"]):
        return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=60"
    elif any(k in t for k in ["result", "score", "rank", "cutoff", "merit", "marks", "परिणाम", "नतीजे"]):
        return "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60"
    elif any(k in t for k in ["job", "govt", "recruitment", "vacancy", "admit", "exam", "entrance", "nda", "jee", "cuet", "agniveer", "परीक्षा", "भर्ती", "सरकारी", "नौकरी"]):
        return "https://images.unsplash.com/photo-1521791136368-1a46827d0515?w=500&auto=format&fit=crop&q=60"
    return "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&auto=format&fit=crop&q=60"

def fetch_feed_data(url, limit):
    feed = feedparser.parse(url)
    articles = []
    for entry in feed.entries[:limit]:
        clean_title = entry.title.split(" - ")[0]
        img_url = get_thumbnail(clean_title)
        # Fetch data and save link too
        articles.append({"title": clean_title, "image": img_url, "link": entry.link})
    return articles

if __name__ == "__main__":
    # Ab hum sirf Data fetch kar rahe hain, HTML nahi bana rahe
    data = {
        "trending": fetch_feed_data(TRENDING_URL, 30),
        "govt": fetch_feed_data(GOVT_EXAMS_URL, 30),
        "cbse": fetch_feed_data(CBSE_URL, 30)
    }

    # Data ko ek JSON file mein save kar diya
    with open("news_data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
        
    print("Mission Successful: Data saved to news_data.json")
    
