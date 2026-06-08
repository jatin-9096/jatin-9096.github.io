// ==========================================
// DIVYA DRISHTI MASTER SCRIPT
// ==========================================

const navButtons = document.querySelectorAll('.nav-btn');
const viewSections = document.querySelectorAll('.view-section');

// Navigation Logic
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        viewSections.forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
        const grid = document.getElementById(targetId.replace('section', 'grid'));
        if(grid.children.length === 0) loadRealNews(targetId.replace('-section', '')); 
    });
});

// API CONFIGURATION
const API_KEY = '41f9ca60c9c4feea049876ff25827052'; // YAHAN APNI API KEY DALNA

const pageTracker = {'home': 1, 'govt': 1, 'cbse': 1};
const isFetching = {'home': false, 'govt': false, 'cbse': false};

async function loadRealNews(category) {
    if (isFetching[category]) return;
    isFetching[category] = true;
    const gridElement = document.getElementById(`${category}-grid`);
    const loader = document.getElementById(`${category}-loader`);
    
    let query = category === 'govt' ? "government exams jobs india" : (category === 'cbse' ? "CBSE board exam india" : "education india");
    const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&country=in&max=10&page=${pageTracker[category]}&apikey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.articles) {
            data.articles.forEach(article => {
                const card = document.createElement('div');
                card.classList.add('news-card');
                const imageUrl = article.image || 'https://via.placeholder.com/300x150?text=No+Image';
                card.innerHTML = `
                    <img src="${imageUrl}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                        <span class="badge verified">Verified</span>
                        <div>
                            <i class="fa-regular fa-bookmark" onclick="alert('Saved!')"></i>
                            <i class="fa-solid fa-share-nodes" onclick="shareNews('${article.title.replace(/'/g, "")}', '${article.url}')"></i>
                        </div>
                    </div>
                    <h3>${article.title}</h3>
                    <p>${article.description.substring(0, 100)}...</p>
                    <a href="${article.url}" target="_blank" class="read-btn">Read Official News</a>
                    <button class="read-btn" style="background:#333" onclick="openAITutor('Analyze: ${article.title.replace(/'/g, "")}')">Ask AI Tutor</button>
                `;
                gridElement.appendChild(card);
            });
            pageTracker[category]++;
        }
    } catch (e) { loader.innerHTML = "Error loading news."; }
    finally { isFetching[category] = false; }
}

// SHARE FUNCTION
window.shareNews = (title, url) => {
    if (navigator.share) navigator.share({title: 'Divya Drishti', text: title, url: url});
    else { navigator.clipboard.writeText(url); alert("Link copied!"); }
};

// AI TUTOR LOGIC
function openAITutor(msg) {
    document.getElementById('ai-tutor-window').classList.remove('hidden');
    document.getElementById('tutor-response').innerHTML = `<strong>Divya Drishti AI:</strong><br>${msg}`;
}

// Initial Load
loadRealNews('home');
