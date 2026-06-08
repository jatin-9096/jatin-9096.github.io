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
// 2. INFINITE SCROLL & CONTENT GENERATION
// ==========================================
let articleCount = 0; // Keeping track of loaded items

// Function to generate a mock News Card (HTML structure)
function createCardElement(category) {
    articleCount++;
    const card = document.createElement('div');
    card.classList.add('news-card');

    // Category specific content
    let title = "Default Title";
    let badgeTxt = "Trending";
    
    if(category === 'home') {
        title = `Top Breaking Education News #${articleCount}`;
        badgeTxt = "Trending";
    } else if (category === 'govt') {
        title = `New Government Vacancy Announced #${articleCount}`;
        badgeTxt = "Govt Alert";
    } else if (category === 'cbse') {
        title = `CBSE Board Important Notification #${articleCount}`;
        badgeTxt = "CBSE Update";
    }

    // HTML Injection (Professional Content Hierarchy)
    card.innerHTML = `
        <div class="badges">
            <span class="badge verified"><i class="fa-solid fa-check-circle"></i> Verified</span>
            <span class="badge trending">${badgeTxt}</span>
        </div>
        <h3>${title}</h3>
        <p>This is a detailed, structured news excerpt. Our logic ensures that even on the 1000th scroll, the UI remains highly responsive and fast.</p>
        <button class="read-btn" onclick="openAITutor('Read more about ${title}')">Read Detailed News</button>
    `;
    return card;
}

// Function to load cards into a specific grid
function loadCards(category, amount = 6) {
    const gridId = `${category}-grid`;
    const gridElement = document.getElementById(gridId);
    
    for(let i = 0; i < amount; i++) {
        const newCard = createCardElement(category);
        gridElement.appendChild(newCard);
    }
}

// Initial Load for Home Section
loadCards('home', 9);

// Intersection Observer for Infinite Scrolling (The YouTube Feel)
// Deep Logic: Ye check karta hai ki user screen ke end par pahuncha ya nahi
const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Find which loader is visible, and load respective content
            if(entry.target.id === 'home-loader') loadCards('home', 6);
            if(entry.target.id === 'govt-loader') loadCards('govt', 6);
            if(entry.target.id === 'cbse-loader') loadCards('cbse', 6);
        }
    });
}, observerOptions);

// Observe all loaders
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
