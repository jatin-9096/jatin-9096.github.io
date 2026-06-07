import feedparser
import urllib.parse

# Google News RSS Feeds
NEWS_URL = "https://news.google.com/rss/headlines/section/topic/EDUCATION?hl=hi&gl=IN&ceid=IN:hi"
GOVT_EXAMS_URL = "https://news.google.com/rss/search?q=Sarkari+Result+Exams+Form+admit+card&hl=hi&gl=IN&ceid=IN:hi"
CBSE_URL = "https://news.google.com/rss/search?q=CBSE+Latest+Syllabus+Board+Exams&hl=hi&gl=IN&ceid=IN:hi"
TRENDING_URL = "https://news.google.com/rss/headlines?hl=hi&gl=IN&ceid=IN:hi"

# Keywords ke hisab se automatic advanced images assign karne ka function (FIXED)
def get_thumbnail(title):
    t = title.lower()
    
    # 1. CBSE aur Board Exams ke liye (Hindi + English)
    if any(k in t for k in ["cbse", "board", "class", "10th", "12th", "syllabus", "कक्षा", "बोर्ड", "पाठ्यक्रम"]):
        return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=60" # Books/Classroom
        
    # 2. Results, Cutoff aur Merit list ke liye
    elif any(k in t for k in ["result", "score", "rank", "cutoff", "merit", "marks", "परिणाम", "नतीजे"]):
        return "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60" # Exam sheet
        
    # 3. Govt Job, Admit Card aur Entrance Exams (NDA, JEE, CUET, Agniveer)
    elif any(k in t for k in ["job", "govt", "recruitment", "vacancy", "admit", "exam", "entrance", "nda", "jee", "cuet", "agniveer", "परीक्षा", "भर्ती", "सरकारी", "नौकरी"]):
        return "https://images.unsplash.com/photo-1521791136368-1a46827d0515?w=500&auto=format&fit=crop&q=60" # Professional Setup
        
    # 4. Default image (General Education News)
    return "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&auto=format&fit=crop&q=60" # School board

def fetch_feed_data(url, limit):
    feed = feedparser.parse(url)
    articles = []
    for entry in feed.entries[:limit]:
        clean_title = entry.title.split(" - ")[0]
        articles.append(clean_title)
    return articles

def update_html(latest_news, trending_news, govt_exams, cbse_updates):
    html_start = """<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduNews Hub - Premium News & Education Portal</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="logo">EduNews Hub</div>
        <nav>
            <a href="index.html">🏠 Home</a>
            <a href="#govt-section">💼 Govt Exams</a>
            <a href="#cbse-section">📚 CBSE</a>
            <a href="#latest-section">🎓 News Feed</a>
        </nav>
    </header>

    <section class="hero" id="trending-section">
        <h2 style="color: #38bdf8; font-size: 28px;">⚡ Today's Top Trending Updates</h2>
        <p>Real-time automated education dashboard synced every 5 minutes.</p>
        <div class="trending-container" style="margin-top: 20px; display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">"""

    for trend in trending_news[:3]:
        safe_trend = urllib.parse.quote(trend)
        img_url = get_thumbnail(trend)
        html_start += f"""
            <div class="trending-card" style="background: #1e293b; border-radius: 8px; overflow: hidden; width: 300px; text-align: left; border: 1px solid #334155;">
                <img src="{img_url}" style="width: 100%; height: 120px; object-fit: cover;">
                <div style="padding: 12px;">
                    <span style="background:#ef4444; color:white; padding:2px 6px; border-radius:3px; font-size:11px; font-weight:bold;">TRENDING</span>
                    <h3 style="font-size: 14px; color: white; margin: 8px 0;">{trend}</h3>
                    <a href="news.html?title={safe_trend}" style="color:#38bdf8; text-decoration:none; font-size:13px; font-weight:bold;">Open Inside →</a>
                </div>
            </div>"""

    html_start += """
        </div>
    </section>

    <main class="container">
        <section class="main-news">
            
            <div id="govt-section">
                <h2 class="section-title">💼 Live Govt Exam Forms & Notifications</h2>
                <div class="news-grid">"""
    
    for exam in govt_exams[:6]:
        safe_exam = urllib.parse.quote(exam)
        img_url = get_thumbnail(exam)
        html_start += f"""
            <div class="card">
                <img src="{img_url}" class="card-img">
                <div class="card-content">
                    <span class="badge badge-govt">GOVT EXAM</span>
                    <h4>{exam}</h4>
                    <p>Naye sarkari forms, eligibility criteria aur exam date ki details deep way mein padhein.</p>
                    <a href="news.html?title={safe_exam}" class="read-link">Check Details →</a>
                </div>
            </div>"""

    html_start += """
                </div>
            </div>

            <div id="cbse-section" style="margin-top: 30px;">
                <h2 class="section-title">📚 CBSE Latest Syllabus & Board Updates</h2>
                <div class="news-grid">"""
    
    for cbse in cbse_updates[:6]:
        safe_cbse = urllib.parse.quote(cbse)
        img_url = get_thumbnail(cbse)
        html_start += f"""
            <div class="card">
                <img src="{img_url}" class="card-img">
                <div class="card-content">
                    <span class="badge badge-cbse">CBSE UPDATE</span>
                    <h4>{cbse}</h4>
                    <p>CBSE board ke naye pattern, change hua syllabus aur guidelines ki report padhein.</p>
                    <a href="news.html?title={safe_cbse}" class="read-link">View Syllabus →</a>
                </div>
            </div>"""

    html_start += """
                </div>
            </div>

            <div id="latest-section" style="margin-top: 30px;">
                <h2 class="section-title">🎓 Educational News Feed</h2>
                <div class="news-grid">"""

    html_dynamic = ""
    for title in latest_news[:20]:
        safe_title = urllib.parse.quote(title)
        img_url = get_thumbnail(title)
        
        html_dynamic += f"""
            <div class="card">
                <img src="{img_url}" class="card-img">
                <div class="card-content">
                    <span class="badge badge-general">EDUCATION</span>
                    <h4>{title}</h4>
                    <p>Is khabar ki poori report aur community discussions hamari website ke andar padhein.</p>
                    <a href="news.html?title={safe_title}" class="read-link">Read Full Report →</a>
                </div>
            </div>"""

    html_end = """
                </div>
            </div>
        </section>
        
        <aside class="sidebar">
            <h2 style="font-size: 18px; color: #1e293b; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">🔥 Trending Headlines</h2>
            <ul style="list-style: none; padding: 0; margin: 0;">"""

    for trend in trending_news:
        safe_trend = urllib.parse.quote(trend)
        html_end += f'<li style="margin-bottom: 12px; font-size: 14px; line-height: 1.4;"><a href="news.html?title={safe_trend}" style="color: #475569; text-decoration: none; font-weight: 500;">👉 {trend}</a></li>'

    html_end += """
            </ul>
        </aside>
    </main>
    <footer>
        <p>&copy; 2026 EduNews Portal. User Privacy Ensured via Cloudflare Secure Code. | Auto-Synced Every 5 Minutes</p>
    </footer>
</body>
</html>"""

    full_html = html_start + html_dynamic + html_end
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(full_html)

if __name__ == "__main__":
    education_feed = fetch_feed_data(NEWS_URL, 40)
    trending_feed = fetch_feed_data(TRENDING_URL, 10)
    govt_feed = fetch_feed_data(GOVT_EXAMS_URL, 6)
    cbse_feed = fetch_feed_data(CBSE_URL, 6)
    
    if education_feed:
        update_html(education_feed, trending_feed, govt_feed, cbse_feed)
        print("Success!")
        
