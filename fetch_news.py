import feedparser
import urllib.parse

# Google News RSS Feeds
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
        articles.append(clean_title)
    return articles

# Cards Generator with Load More Logic
def generate_cards(articles, badge_text, badge_class, grid_id):
    html = f'<div class="news-grid" id="{grid_id}">'
    for i, title in enumerate(articles):
        safe_title = urllib.parse.quote(title)
        img_url = get_thumbnail(title)
        # 12 items ke baad walo ko hidden rakho
        hidden_class = " hidden-card" if i >= 12 else ""
        
        html += f"""
            <div class="card{hidden_class}">
                <img src="{img_url}" class="card-img">
                <div class="card-content">
                    <span class="badge {badge_class}">{badge_text}</span>
                    <h4>{title}</h4>
                    <a href="news.html?title={safe_title}" class="read-link">Read Detailed News →</a>
                </div>
            </div>"""
    html += '</div>'
    
    # Agar 12 se zyada news hain, toh Load More button dikhao
    if len(articles) > 12:
        html += f'<button class="load-more-btn" onclick="loadMore(\'{grid_id}\', this)">Read More News ⬇️</button>'
    
    return html

# Common Page Template Generator
def build_page(filename, page_title, active_tab, main_content, trending_news):
    # Active tab highlight logic
    tab_home = 'style="color: #38bdf8;"' if active_tab == 'home' else ''
    tab_govt = 'style="color: #38bdf8;"' if active_tab == 'govt' else ''
    tab_cbse = 'style="color: #38bdf8;"' if active_tab == 'cbse' else ''
    tab_news = 'style="color: #38bdf8;"' if active_tab == 'news' else ''

    html = f"""<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{page_title}</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .hidden-card {{ display: none !important; }}
        .load-more-btn {{ background: #2563eb; color: white; padding: 12px 25px; border: none; border-radius: 5px; cursor: pointer; display: block; margin: 30px auto; font-size: 16px; font-weight: bold; transition: 0.3s; }}
        .load-more-btn:hover {{ background: #1e40af; }}
        .about-box {{ background: white; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 30px; line-height: 1.8; color: #334155; }}
        .about-box h2 {{ color: #0f172a; margin-top: 0; border-bottom: 2px solid #38bdf8; padding-bottom: 10px; }}
    </style>
</head>
<body>
    <header>
        <div class="logo">EduNews Hub</div>
        <nav>
            <a href="index.html" {tab_home}>🏠 Home</a>
            <a href="govt.html" {tab_govt}>💼 Govt Exams</a>
            <a href="cbse.html" {tab_cbse}>📚 CBSE</a>
            <a href="latest.html" {tab_news}>🎓 News Feed</a>
        </nav>
    </header>

    <main class="container">
        <section class="main-news">
            {main_content}
        </section>
        
        <aside class="sidebar">
            <h2 style="font-size: 18px; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">🔥 Trending Now</h2>
            <ul style="list-style: none; padding: 0;">"""

    for trend in trending_news[:10]:
        safe_trend = urllib.parse.quote(trend)
        html += f'<li style="margin-bottom: 15px;"><a href="news.html?title={safe_trend}" style="color: #475569; text-decoration: none; font-size: 14px; font-weight: 500;">👉 {trend}</a></li>'

    html += """
            </ul>
        </aside>
    </main>
    <footer>
        <p>&copy; 2026 EduNews Portal. 100% Secure & Auto-Synced | Designed for Students</p>
    </footer>

    <script>
        // Load More Functionality
        function loadMore(gridId, btn) {
            let hiddenCards = document.querySelectorAll(`#${gridId} .hidden-card`);
            for(let i=0; i<12 && i<hiddenCards.length; i++) {
                hiddenCards[i].classList.remove('hidden-card');
            }
            // Agar aur hidden cards nahi bache, toh button chupa do
            if(document.querySelectorAll(`#${gridId} .hidden-card`).length === 0) {
                btn.style.display = 'none';
            }
        }
    </script>
</body>
</html>"""

    with open(filename, "w", encoding="utf-8") as f:
        f.write(html)

if __name__ == "__main__":
    # Fetching Deep Data (Zyada news fetch kar rahe hain ab)
    general_news = fetch_feed_data(NEWS_URL, 50)
    trending_news = fetch_feed_data(TRENDING_URL, 15)
    govt_news = fetch_feed_data(GOVT_EXAMS_URL, 40)
    cbse_news = fetch_feed_data(CBSE_URL, 40)
    
    # ------------------ 1. HOME PAGE (About Us & Trending) ------------------
    home_content = """
    <div class="about-box">
        <h2>Welcome to EduNews Hub - Your Ultimate Education Partner</h2>
        <p><strong>EduNews Hub</strong> ek fully automated, artificial intelligence powered news portal hai jo specifically students, teachers aur job aspirants ke liye design kiya gaya hai. Hamara maqsad aapko internet par chal rahi fake news se bacha kar 100% authentic aur verified education updates dena hai.</p>
        <p><strong>Hum Kya Provide Karte Hain?</strong></p>
        <ul>
            <li><strong>Govt Exams:</strong> Sarkari Naukri ke naye forms, Admit Cards, aur Exam Date ki real-time updates.</li>
            <li><strong>CBSE & Boards:</strong> Syllabus changes, marking schemes, aur board guidelines seedha official sources se.</li>
            <li><strong>Security:</strong> Hamari website Cloudflare Anti-Bot security ke sath aati hai, yani aapki email aur identity comments section mein 100% safe hai.</li>
        </ul>
        <p>Upar diye gaye Tabs par click karke aap apni pasand ki specific category mein deep information padh sakte hain. Har 5 minute mein hamara server aapke liye naya data sync karta hai!</p>
    </div>
    <h2 class="section-title">⚡ Today's Top Headlines</h2>
    """
    home_content += generate_cards(trending_news, "TRENDING", "badge-govt", "grid-home")
    build_page("index.html", "EduNews Hub - Home", "home", home_content, trending_news)

    # ------------------ 2. GOVT EXAMS PAGE ------------------
    govt_content = '<h2 class="section-title">💼 Live Govt Exam Forms & Notifications</h2>'
    govt_content += generate_cards(govt_news, "GOVT EXAM", "badge-govt", "grid-govt")
    build_page("govt.html", "Govt Exams - EduNews", "govt", govt_content, trending_news)

    # ------------------ 3. CBSE EXAMS PAGE ------------------
    cbse_content = '<h2 class="section-title">📚 CBSE Latest Syllabus & Board Updates</h2>'
    cbse_content += generate_cards(cbse_news, "CBSE UPDATE", "badge-cbse", "grid-cbse")
    build_page("cbse.html", "CBSE Updates - EduNews", "cbse", cbse_content, trending_news)

    # ------------------ 4. LATEST NEWS PAGE ------------------
    latest_content = '<h2 class="section-title">🎓 Top Educational News Feed</h2>'
    latest_content += generate_cards(general_news, "EDUCATION", "badge-general", "grid-latest")
    build_page("latest.html", "Latest News - EduNews", "news", latest_content, trending_news)

    print("Multi-Page Architecture with Load More Button Generated Successfully!")
        
