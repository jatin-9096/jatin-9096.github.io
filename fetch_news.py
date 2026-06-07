import feedparser

# Google News RSS Feed (Education Section)
RSS_URL = "https://news.google.com/rss/headlines/section/topic/EDUCATION?hl=hi&gl=IN&ceid=IN:hi"

def fetch_latest_news():
    feed = feedparser.parse(RSS_URL)
    articles = []
    
    # Sirf top 5 latest news nikalne ke liye
    for entry in feed.entries[:5]:
        title = entry.title
        link = entry.link
        # Google news ke title mein se source name hatane ke liye
        clean_title = title.split(" - ")[0]
        articles.append((clean_title, link))
    return articles

def update_html(articles):
    # HTML ka shuruat ka hissa
    html_start = """<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduNews - Education & News Portal</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="logo">EduNews</div>
        <nav>
            <a href="#">Home</a>
            <a href="#">Latest News</a>
            <a href="#">Education</a>
        </nav>
    </header>

    <section class="hero">
        <h2>Trending Educational News</h2>
        <p>Trusted sources se automatic up-to-date khabar.</p>
    </section>

    <main class="container">
        <section class="main-news">
            <h2>Latest Updates</h2>"""

    # Dynamic News Cards jo Python add karega
    html_dynamic = ""
    for title, link in articles:
        html_dynamic += f"""
            <div class="card">
                <h4>{title}</h4>
                <p>Education sector ki badi taza khabar poori detail mein padhne ke liye niche link par click karein.</p>
                <a href="{link}" target="_blank">Read Full News on Google News →</a>
            </div>"""

    # HTML ka aakhri hissa
    html_end = """
        </section>
        <aside class="sidebar">
            <h2>Quick Links</h2>
            <ul>
                <li><a href="#">Exam Notifications</a></li>
                <li><a href="#">Syllabus & Notes</a></li>
            </ul>
        </aside>
    </main>
    <footer>
        <p>&copy; 2026 EduNews. All Rights Reserved. | Auto-Aggregated Content</p>
    </footer>
</body>
</html>"""

    # Poore code ko jodh kar index.html mein overwrite karna
    full_html = html_start + html_dynamic + html_end
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(full_html)

if __name__ == "__main__":
    news_data = fetch_latest_news()
    if news_data:
        update_html(news_data)
        print("Website successfully updated with latest news!")
    else:
        print("No news found.")
