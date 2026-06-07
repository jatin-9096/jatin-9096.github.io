import feedparser
import urllib.parse

# Multiple RSS Feeds for Education, CBSE & Govt Exams
NEWS_URL = "https://news.google.com/rss/headlines/section/topic/EDUCATION?hl=hi&gl=IN&ceid=IN:hi"
GOVT_EXAMS_URL = "https://news.google.com/rss/search?q=Sarkari+Result+Exams+Form+admit+card&hl=hi&gl=IN&ceid=IN:hi"
CBSE_URL = "https://news.google.com/rss/search?q=CBSE+Latest+Syllabus+Board+Exams&hl=hi&gl=IN&ceid=IN:hi"
TRENDING_URL = "https://news.google.com/rss/headlines?hl=hi&gl=IN&ceid=IN:hi"

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
    <title>EduNews - Education, CBSE & Govt Exam Portal</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .section-title { font-size: 22px; color: #1e293b; margin-top: 30px; border-left: 5px solid #2563eb; padding-left: 10px; margin-bottom: 15px; }
        .exam-badge { background: #f59e0b; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px; font-weight: bold; }
        .cbse-badge { background: #10b981; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px; font-weight: bold; }
    </style>
</head>
<body>
    <header>
        <div class="logo">EduNews Hub</div>
        <nav>
            <a href="index.html">Home</a>
            <a href="#govt-section">💼 Govt Exams</a>
            <a href="#cbse-section">📚 CBSE Updates</a>
            <a href="#latest-section">🎓 Top 100 News</a>
        </nav>
    </header>

    <section class="hero" id="trending-section">
        <h2 style="color: #ef4444;">⚡ Today's Top Trending Topics</h2>
        <p>Real-time automated education dashboard synced every 5 minutes.</p>
        <div style="margin-top: 15px;">"""

    for trend in trending_news[:3]:
        safe_trend = urllib.parse.quote(trend)
        html_start += f"""
            <div class="trending-box" style="margin-bottom: 10px; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px;">
                <h3 style="font-size: 15px; margin: 0;"><span style="background:#ef4444; color:white; padding:2px 6px; border-radius:3px; margin-right:5px; font-size:11px;">TRENDING</span> {trend}</h3>
                <a href="news.html?title={safe_trend}" style="color:#38bdf8; font-weight:bold; text-decoration:none; font-size:13px;">Open Inside EduNews →</a>
            </div>"""

    html_start += """
        </div>
    </section>

    <main class="container">
        <section class="main-news">
            
            <div id="govt-section">
                <h2 class="section-title">💼 Live Govt Exam Forms & Notifications (Sarkari Alerts)</h2>"""
    
    for exam in govt_exams[:8]:
        safe_exam = urllib.parse.quote(exam)
        html_start += f"""
            <div class="card" style="border-top: 3px solid #f59e0b;">
                <h4><span class="exam-badge">GOVT EXAM</span> {exam}</h4>
                <p>Naye sarkari forms, eligibility criteria, admit card aur exam date ki poori details deep way mein hamare page par check karein.</p>
                <a href="news.html?title={safe_exam}" style="color:#d97706; font-weight:bold; text-decoration:none;">Check Form & Eligibility →</a>
            </div>"""

    html_start += """
            </div>

            <div id="cbse-section" style="margin-top: 40px;">
                <h2 class="section-title">📚 CBSE Latest Syllabus & School Board Notifications</h2>"""
    
    for cbse in cbse_updates[:8]:
        safe_cbse = urllib.parse.quote(cbse)
        html_start += f"""
            <div class="card" style="border-top: 3px solid #10b981;">
                <h4><span class="cbse-badge">CBSE UPDATE</span> {cbse}</h4>
                <p>CBSE board ke naye pattern, change hua syllabus, aur exam guidelines ki deep report padhein.</p>
                <a href="news.html?title={safe_cbse}" style="color:#059669; font-weight:bold; text-decoration:none;">View Syllabus & Guidelines →</a>
            </div>"""

    html_start += """
            </div>

            <div id="latest-section" style="margin-top: 40px;">
                <h2 class="section-title">🎓 Educational News Feed (Top 100 Stories)</h2>"""

    html_dynamic = ""
    for title in latest_news:
        safe_title = urllib.parse.quote(title)
        internal_link = f"news.html?title={safe_title}"
        
        html_dynamic += f"""
            <div class="card">
                <h4>{title}</h4>
                <p>Is badi khabar ki poori detailed report, student discussions aur secure feedback form niche diye gaye button par click karke padhein.</p>
                <a href="{internal_link}" style="color:#0284c7; font-weight:bold; text-decoration:none;">Read Full Report (Secure Page) →</a>
            </div>"""

    html_end = """
            </div>
        </section>
        
        <aside class="sidebar">
            <h2>🔥 Trending Section</h2>
            <p style="font-size: 13px; color: #64748b; margin-bottom: 10px;">Log abse zyada kya padh rahe hain:</p>
            <ul>"""

    for trend in trending_news:
        safe_trend = urllib.parse.quote(trend)
        html_end += f'<li><a href="news.html?title={safe_trend}">👉 {trend}</a></li>'

    html_end += """
            </ul>
        </aside>
    </main>
    <footer>
        <p>&copy; 2026 EduNews. All Data Secured. User Privacy Ensured. | Auto-Synced Every 5 Minutes</p>
    </footer>
</body>
</html>"""

    full_html = html_start + html_dynamic + html_end
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(full_html)

if __name__ == "__main__":
    # Fetching fresh segmented data
    education_feed = fetch_feed_data(NEWS_URL, 80) # General Education News
    trending_feed = fetch_feed_data(TRENDING_URL, 10) # Trending Topics
    govt_feed = fetch_feed_data(GOVT_EXAMS_URL, 10) # Sarkari Exam Forms
    cbse_feed = fetch_feed_data(CBSE_URL, 10) # CBSE Board Data
    
    if education_feed:
        update_html(education_feed, trending_feed, govt_feed, cbse_feed)
        print("All sections compiled and updated inside website!")
        
