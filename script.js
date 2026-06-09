// ==========================================================
// DIVYA DRISHTI MASTER SCRIPT - THE BULLETPROOF VERSION
// ==========================================================

// 1. API CONFIGURATION
const API_KEY = '41f9ca60c9c4feea049876ff25827052'; 

// 2. STATE MANAGEMENT (Removed Pagination for Free Tier Safety)
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
        
        // Check if grid is empty, then load
        const grid = document.getElementById(targetId.replace('-section', '-grid'));
        if(grid && grid.children.length === 0) {
            loadRealNews(targetId.replace('-section', ''));
        }
    });
});

// 4. NEWS FETCHING (THE BRAIN - SPACES ENCODED)
async function loadRealNews(category) {
    if (isFetching[category]) return;
    isFetching[category] = true;
    
    const gridElement = document.getElementById(`${category}-grid`);
    const loader = document.getElementById(`${category}-loader`);
    
    // Deep targeted keywords
    let query = category === 'govt' ? "Sarkari Result OR NDA OR Exam" : (category === 'cbse' ? "CBSE board exam syllabus" : "education student india");
    
    // THE FIX: encodeURIComponent safely converts spaces for the server. 
    // Removed the 'page' parameter as Free GNews accounts block it.
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${API_KEY}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            // This will tell us EXACTLY what GNews is complaining about
            throw new Error(`GNews Server Rejected: Code ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            data.articles.forEach(article => {
                const card = document.createElement('div');
                card.className = 'news-card';
                
                // Fallback image if news doesn't provide one
                const imgUrl = article.image || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&auto=format&fit=crop&q=60';
                
                card.innerHTML = `
                    <img src="${imgUrl}" alt="News Image" style="width:100%; height:180px; object-fit:cover; border-radius:8px; margin-bottom:15px;">
                    <div class="badges">
                        <span class="badge verified"><i class="fa-solid fa-bolt"></i> Live Sync</span>
                    </div>
                    <h3>${article.title}</h3>
                    <p>${article.description ? article.description.substring(0, 80) + '...' : 'Click to read full detailed update.'}</p>
                    <a href="${article.url}" target="_blank" class="read-btn">Read Full Update</a>
                `;
                gridElement.appendChild(card);
            });
            
            // Hide the loader once cards are loaded
            loader.style.display = "none";
            isFetching[category] = false;
            
        } else {
            loader.innerHTML = "No more updates available today.";
            isFetching[category] = false;
        }
    } catch (err) {
        console.error("Error:", err);
        // Display exact error on screen for debugging
        loader.innerHTML = `<span style='color:red; font-weight:bold;'>System Alert: ${err.message}.</span>`;
        isFetching[category] = false;
    }
}

// 5. ADVANCED AI TUTOR (DIVYA DRISHTI)
function processAILogic(query) {
    const q = query.toLowerCase();
    let res = "Maine aapki query scan ki hai. Background mein verified updates load ho rahe hain.";
    if (q.includes("nda") || q.includes("admit card")) res = "NDA admit cards UPSC website par available hain. Govt Exams section check karein.";
    if (q.includes("cbse") || q.includes("result")) res = "CBSE ke liye official portal dekhein. Kya main aapko wahan le chalun?";
    openAITutor(res);
}

// 6. OBSERVER SETUP (Only trigger once now since pagination is off)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if(entry.target.id === 'home-loader') loadRealNews('home');
            if(entry.target.id === 'govt-loader') loadRealNews('govt');
            if(entry.target.id === 'cbse-loader') loadRealNews('cbse');
        }
    });
}, { threshold: 0.1 });

// Attaching observer to loaders
['home-loader', 'govt-loader', 'cbse-loader'].forEach(id => {
    const el = document.getElementById(id);
    if(el) observer.observe(el);
});

// 7. UTILS & UI CONTROLS
function openAITutor(msg) {
    document.getElementById('ai-tutor-window').classList.remove('hidden');
    document.getElementById('tutor-response').innerHTML = `<strong>Divya Drishti AI:</strong><br>${msg}`;
}

document.getElementById('close-tutor').addEventListener('click', () => {
    document.getElementById('ai-tutor-window').classList.add('hidden');
});

document.getElementById('search-btn').addEventListener('click', () => {
    processAILogic(document.getElementById('ai-search-input').value);
});

// INITIAL LOAD FOR HOME PAGE
loadRealNews('home');
