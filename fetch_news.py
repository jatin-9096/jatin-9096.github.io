import feedparser
import urllib.parse

# Google News RSS Feed (Top Indian Education & National Breaking News)
RSS_URL = "https://news.google.com/rss/headlines/section/topic/EDUCATION?hl=hi&gl=IN&ceid=IN:hi"
TRENDING_URL = "https://news.google.com/rss/headlines?hl=hi&gl=IN&ceid=IN:hi"

def fetch_news_data(url, limit):
    feed = feedparser.parse(url)
    articles = []
    for entry in feed.entries[:limit]:
        clean_title = entry.title.split(" - ")[0]
        articles.append(clean_title)
    return articles

def update_html(latest_news, trending_news):
    html_start = """<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduNews - 100% Secure News Portal</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="logo">EduNews Portal</div>
        <nav>
            <a href="index.html">Home</a>
            <a href="#trending-section">🔥 Trending Topics</a>
            <a href="#latest-section">🎓 Top 100 Education</a>
        </nav>
    </header>

    <section class="hero" id="trending-section">
        <h2 style="color: #ef4444;">⚡ Today's Top Trending News</h2>
        <p>Real-time updates directly synced via Cloudflare & Python every 5 minutes.</p>
        <div style="margin-top: 15px;">"""

    # Adding Top 3 Trending news right inside the Hero Section
    for trend in trending_news[:3]:
        safe_trend = urllib.parse.quote(trend)
        html_start += f"""
            <div class="trending-box" style="margin-bottom: 10px;">
                <h3 style="font-size: 16px;"><span style="background:#ef4444; color:white; padding:2px 6px; border-radius:3px; margin-right:5px;">TRENDING</span> {trend}</h3>
                <a href="news.html?title={safe_trend}" style="color:#0284c7; font-weight:bold; text-decoration:none; font-size:14px;">Open Inside EduNews →</a>
            </div>"""

    html_start += """
        </div>
    </section>

    <main class="container">
        <section class="main-news" id="latest-section">
            <h2>🎓 Latest Education Updates (Top 100 Feed)</h2>"""

    html_dynamic = ""
    for title in latest_news:
        safe_title = urllib.parse.quote(title)
        internal_link = f"news.html?title={safe_title}"
        
        html_dynamic += f"""
            <div class="card">
                <h4>{title}</h4>
                <p>Is khabar ki poori report, student forum discussion aur feedback form hamari website ke andar hi avilable hai.</p>
                <a href="{internal_link}" style="color:#0284c7; font-weight:bold; text-decoration:none;">Read Full Report (Secure Page) →</a>
            </div>"""

    html_end = """
        </section>
        
        <aside class="sidebar">
            <h2>🔥 Trending Section</h2>
            <p style="font-size: 13px; color: #64748b; margin-bottom: 10px;">Log sabse zyada kya padh rahe hain:</p>
            <ul>"""

    for trend in trending_news:
        safe_trend = urllib.parse.quote(trend)
        html_end += f'<li><a href="news.html?title={safe_trend}">👉 {trend}</a></li>'

    html_end += """
            </ul>
        </aside>
    </main>
    <footer>
        <p>&copy; 2026 EduNews. All Data Secured. User Privacy Ensured with Cloudflare. | Auto-Synced Every 5 Minutes</p>
    </footer>
</body>
</html>"""

    full_html = html_start + html_dynamic + html_end
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(full_html)

if __name__ == "__main__":
    # Fetching up to 100 Educational Articles and 10 Trending Topics
    education_feed = fetch_news_data(RSS_URL, 100)
    trending_feed = fetch_news_data(TRENDING_URL, 10)
    
    if education_feed:
        update_html(education_feed, trending_feed)
        print("100 News items & Trending section synced successfully inside the website!")
        
