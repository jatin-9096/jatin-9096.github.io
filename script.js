// ==========================================
// 1. SINGLE PAGE APPLICATION (SPA) ROUTING
// ==========================================
const navButtons = document.querySelectorAll('.nav-btn');
const viewSections = document.querySelectorAll('.view-section');

// Navigation Logic: Bina page reload kiye views change karna
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove 'active' class from all buttons and sections
        navButtons.forEach(b => b.classList.remove('active'));
        viewSections.forEach(s => s.classList.remove('active'));

        // Add 'active' class to clicked button and target section
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
        
        // Initial load for the section if empty
        const grid = document.getElementById(targetId.replace('section', 'grid'));
        if(grid.children.length === 0) {
            loadCards(targetId.replace('-section', ''), 6); // Load 6 initial cards
        }
    });
});

// ==========================================
// 2. REAL NEWS API & INFINITE SCROLL (GNEWS API)
// ==========================================

// IMPORTANT: Replace 'YOUR_API_KEY' with your actual free API key from gnews.io
const API_KEY = ' 41f9ca60c9c4feea049876ff25827052'; 

// Pagination Trackers: Har section ke liye track karenge ki hum kis page par hain
const pageTracker = {
    'home': 1,
    'govt': 1,
    'cbse': 1
};

// Fetch Status Tracker: Ek sath multiple requests jane se rokne ke liye
const isFetching = {
    'home': false,
    'govt': false,
    'cbse': false
};

// Main Fetching Function
async function loadRealNews(category) {
    // Agar pehle se load ho raha hai, toh wahi ruk jao
    if (isFetching[category]) return;
    isFetching[category] = true;

    const gridId = `${category}-grid`;
    const gridElement = document.getElementById(gridId);
    const loader = document.getElementById(`${category}-loader`);
    
    // Category ke hisaab se Search Query set karna
    let query = "education india"; // Default for Home
    if (category === 'govt') query = "government exams jobs india";
    if (category === 'cbse') query = "CBSE board exam india";

    // Dynamic API Endpoint (10 news per fetch)
    const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&country=in&max=10&page=${pageTracker[category]}&apikey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            data.articles.forEach(article => {
                const card = document.createElement('div');
                card.classList.add('news-card');
                
                // Agar news mein image nahi hai, toh ek placeholder set karna
                const imageUrl = article.image || 'https://via.placeholder.com/300x150?text=No+Image';

                // Real Data ke sath Card Generate karna
                card.innerHTML = `
                    <img src="${imageUrl}" alt="News" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
                    <div class="badges">
                        <span class="badge verified"><i class="fa-solid fa-check-circle"></i> Verified Data</span>
                    </div>
                    <h3>${article.title}</h3>
                    <p>${article.description.substring(0, 100)}...</p>
                    
                    <a href="${article.url}" target="_blank" class="read-btn" style="text-decoration:none; margin-bottom: 5px; display: block;">Read Official News</a>
                    
                    <button class="read-btn" style="background-color: #333;" onclick="openAITutor('Analyze this update: ${article.title.replace(/'/g, "")}')">
                        <i class="fa-solid fa-robot"></i> Ask AI Tutor
                    </button>
                `;
                gridElement.appendChild(card);
            });
            
            // Success hone par page number badha do taaki agle scroll par nayi news aaye
            pageTracker[category]++; 
        } else {
            // Agar API ne koi data nahi diya
            loader.innerHTML = "No more updates available.";
        }
    } catch (error) {
        console.error("News fetch me error aaya:", error);
        loader.innerHTML = "Failed to load news. Please check your internet or API key.";
    } finally {
        isFetching[category] = false; // Fetching process khatam
    }
}

// Initial Load for Home Section
loadRealNews('home');

// ==========================================
// INFINITE SCROLL OBSERVER (The YouTube Feel)
// ==========================================
const observerOptions = {
    root: null,
    rootMargin: "0px", // Jab end element touch ho tabhi load karo
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Jab loader screen par dikhne lage
        if (entry.isIntersecting) {
            if(entry.target.id === 'home-loader') loadRealNews('home');
            if(entry.target.id === 'govt-loader') loadRealNews('govt');
            if(entry.target.id === 'cbse-loader') loadRealNews('cbse');
        }
    });
}, observerOptions);

// Observers ko activate karna
observer.observe(document.getElementById('home-loader'));
observer.observe(document.getElementById('govt-loader'));
observer.observe(document.getElementById('cbse-loader'));



// ==========================================
// 3. AI-CENTRIC DISCOVERY & SMART ROUTING
// ==========================================
const searchInput = document.getElementById('ai-search-input');
const searchBtn = document.getElementById('search-btn');
const aiTutorWindow = document.getElementById('ai-tutor-window');
const tutorResponse = document.getElementById('tutor-response');
const closeTutorBtn = document.getElementById('close-tutor');

// Mock AI Logic based on keywords
function processAILogic(query) {
    const lowerQuery = query.toLowerCase();
    let responseText = "";

    // Smart Routing Logic
    if (lowerQuery.includes("nda") || lowerQuery.includes("admit card")) {
        responseText = `
            <strong>Divya Drishti AI Analysis:</strong><br><br>
            You are searching for NDA admit cards.<br>
            👉 <em>Step 1:</em> The NDA admit cards are usually released on the official UPSC website.<br>
            👉 <em>Step 2:</em> Would you like me to redirect you to the 'Govt Exams' section to see the latest UPSC notifications?
            <br><br>
            <button class="read-btn" style="width:auto; font-size:12px; padding: 5px 10px;" onclick="goToSection('govt-section')">Go to Govt Exams</button>
        `;
    } else if (lowerQuery.includes("cbse") || lowerQuery.includes("result")) {
        responseText = `
            <strong>Divya Drishti AI Analysis:</strong><br><br>
            Looking for CBSE updates? Let me take you straight to our verified CBSE portal where you can check real-time updates.
            <br><br>
            <button class="read-btn" style="width:auto; font-size:12px; padding: 5px 10px;" onclick="goToSection('cbse-section')">Go to CBSE Section</button>
        `;
    } else {
        responseText = `
            <strong>Divya Drishti AI Tutor:</strong><br><br>
            I have searched our secure database for "<em>${query}</em>". I am fetching the verified updates for you. Please scroll down to read more!
        `;
    }

    openAITutor(responseText, true);
}

// Show AI Tutor Window
function openAITutor(message, isHtml = false) {
    aiTutorWindow.classList.remove('hidden');
    if(isHtml) {
        tutorResponse.innerHTML = message;
    } else {
        tutorResponse.innerHTML = `<strong>Divya Drishti AI:</strong><br><br>${message}`;
    }
}

// Close AI Tutor
closeTutorBtn.addEventListener('click', () => {
    aiTutorWindow.classList.add('hidden');
});

// Trigger Search
searchBtn.addEventListener('click', () => {
    if(searchInput.value.trim() !== "") {
        processAILogic(searchInput.value);
    }
});

// Trigger Search on Enter key
searchInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter' && searchInput.value.trim() !== "") {
        processAILogic(searchInput.value);
    }
});

// Helper function for AI to change SPA views
window.goToSection = function(sectionId) {
    const targetBtn = document.querySelector(`[data-target="${sectionId}"]`);
    if(targetBtn) targetBtn.click(); // Programmatically click the nav button
    aiTutorWindow.classList.add('hidden'); // hide tutor after routing
};
