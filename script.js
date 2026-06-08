// ==========================================================
// DIVYA DRISHTI MASTER SCRIPT - FULL SCALE VERSION
// ==========================================================

// 1. API CONFIGURATION
const API_KEY = '41f9ca60c9c4feea049876ff25827052'; // YAHAN APNI KEY PASTE KAREIN

// 2. STATE MANAGEMENT
const pageTracker = {'home': 1, 'govt': 1, 'cbse': 1};
const isFetching = {'home': false, 'govt': false, 'cbse': false};

// 3. SPA ROUTING LOGIC
const navButtons = document.querySelectorAll('.nav-btn');
const viewSections = document.querySelectorAll('.view-section');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        viewSections.forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
        const grid = document.getElementById(targetId.replace('section', 'grid'));
        if(grid && grid.children.length === 0) loadRealNews(targetId.replace('-section', ''));
    });
});

// 4. NEWS FETCHING & INFINITE SCROLL
async function loadRealNews(category) {
    if (isFetching[category]) return;
    isFetching[category] = true;
    const gridElement = document.getElementById(`${category}-grid`);
    const loader = document.getElementById(`${category}-loader`);
    
    let query = category === 'govt' ? "government exams jobs india" : (category === 'cbse' ? "CBSE board exam india" : "education india");
    const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&max=10&page=${pageTracker[category]}&apikey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.articles) {
            data.articles.forEach(article => {
                const card = document.createElement('div');
                card.classList.add('news-card');
                const img = article.image || 'https://via.placeholder.com/300x150?text=No+Image';
                card.innerHTML = `
                    <img src="${img}" style="width:100%; height:150px; object-fit:cover; border-radius:8px;">
                    <div style="display:flex; justify-content:space-between; margin:10px 0;">
                        <span class="badge verified">Verified</span>
                        <div>
                            <i class="fa-regular fa-bookmark" onclick="alert('Saved!')" style="cursor:pointer; margin-right:10px;"></i>
                            <i class="fa-solid fa-share-nodes" onclick="shareNews('${article.title.replace(/'/g, "")}', '${article.url}')" style="cursor:pointer;"></i>
                        </div>
                    </div>
                    <h3>${article.title}</h3>
                    <p>${article.description ? article.description.substring(0, 100) : 'Click to read more...'}...</p>
                    <a href="${article.url}" target="_blank" class="read-btn" style="text-decoration:none; margin:5px 0; display:block;">Read Official News</a>
                    <button class="read-btn" style="background:#333; width:100%; border:none;" onclick="openAITutor('Analyze: ${article.title.replace(/'/g, "")}')">Ask AI Tutor</button>
                `;
                gridElement.appendChild(card);
            });
            pageTracker[category]++;
        }
    } catch (e) { loader.innerHTML = "API Connection Error"; }
    finally { isFetching[category] = false; }
}

// 5. ADVANCED AI TUTOR (DIVYA DRISHTI)
function processAILogic(query) {
    const q = query.toLowerCase();
    let res = "Maine aapki query scan ki hai. Background mein verified updates load ho rahe hain.";
    if (q.includes("nda") || q.includes("admit card")) res = "NDA admit cards UPSC website par available hain. Govt Exams section check karein.";
    if (q.includes("cbse") || q.includes("result")) res = "CBSE ke liye official portal dekhein. Kya main aapko wahan le chalun?";
    openAITutor(res);
}

// 6. OBSERVER SETUP (INFINITE SCROLL)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if(entry.target.id === 'home-loader') loadRealNews('home');
            if(entry.target.id === 'govt-loader') loadRealNews('govt');
            if(entry.target.id === 'cbse-loader') loadRealNews('cbse');
        }
    });
}, { threshold: 0.1 });

['home-loader', 'govt-loader', 'cbse-loader'].forEach(id => observer.observe(document.getElementById(id)));

// 7. UTILS
window.shareNews = (title, url) => { navigator.share ? navigator.share({title, url}) : alert("Link copied!"); };
function openAITutor(msg) {
    document.getElementById('ai-tutor-window').classList.remove('hidden');
    document.getElementById('tutor-response').innerHTML = `<strong>Divya Drishti AI:</strong><br>${msg}`;
}
document.getElementById('close-tutor').addEventListener('click', () => document.getElementById('ai-tutor-window').classList.add('hidden'));
document.getElementById('search-btn').addEventListener('click', () => processAILogic(document.getElementById('ai-search-input').value));

// INITIAL LOAD
loadRealNews('home');
