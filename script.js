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

        // REPLACE KAREIN is pure block ko (try se lekar catch ke end tak)
try {
    console.log("Fetching for:", category);
    const response = await fetch(url);
    
    // Check agar connection sahi hai
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Data aaya:", data); // Isse console mein check karo
    
    if (data.articles && data.articles.length > 0) {
        data.articles.forEach(article => {
            // ... (Aapka baki card wala code yahan rahega)
        });
        pageTracker[category]++;
    } else {
        loader.innerHTML = "No Articles Found.";
    }
} catch (err) {
    console.error("Error:", err);
    loader.innerHTML = "Error: " + err.message; // Ab error screen par dikhega
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
// Test Request
fetch(`https://gnews.io/api/v4/top-headlines?category=general&apikey=41f9ca60c9c4feea049876ff25827052`)
.then(res => res.json())
.then(data => console.log("Test Result:", data))
.catch(err => console.log("Test Error:", err));
