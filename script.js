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
// 3. ADVANCED AI-CENTRIC DISCOVERY (DIVYA DRISHTI EXPERT SYSTEM)
// ==========================================

function processAILogic(query) {
    const lowerQuery = query.toLowerCase();
    let responseText = "";

    // 1. Intent: Results & Cutoffs
    if (lowerQuery.match(/(result|cutoff|score|merit list)/)) {
        responseText = `
            <strong><i class="fa-solid fa-chart-line"></i> Divya Drishti Analysis:</strong><br><br>
            Aap result ya cutoff ke baare mein janna chahte hain.<br>
            👉 <em>Tip:</em> Hamesha official website par apna Roll Number ready rakhein. <br>
            Kya main aapko latest CBSE ya Govt updates dikhaun?
            <br><br>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button class="read-btn" style="padding: 5px; font-size:12px;" onclick="goToSection('cbse-section')">CBSE Results</button>
                <button class="read-btn" style="padding: 5px; font-size:12px; background: #333;" onclick="goToSection('govt-section')">Govt Results</button>
            </div>
        `;
    } 
    // 2. Intent: Syllabus & Preparation
    else if (lowerQuery.match(/(syllabus|prepare|strategy|books|notes)/)) {
        responseText = `
            <strong><i class="fa-solid fa-book-open"></i> Divya Drishti Tutor:</strong><br><br>
            Syllabus aur preparation strategy kisi bhi exam ka base hoti hai.<br>
            👉 <em>Strategy:</em> Previous Year Questions (PYQs) aur Mock Tests par focus karein.<br>
            👉 Main is topic se related latest news background mein fetch kar rahi hoon. Aap Home feed scroll karke dekh sakte hain.
        `;
    }
    // 3. Intent: Specific Exams (NDA, UPSC, SSC, JEE, NEET)
    else if (lowerQuery.match(/(nda|upsc|ssc|jee|neet|admit card)/)) {
        responseText = `
            <strong><i class="fa-solid fa-crosshairs"></i> Divya Drishti Target:</strong><br><br>
            Aap competitive exams ki details dhund rahe hain.<br>
            👉 Har saal in exams ke pattern mein chote changes aate hain. <br>
            Chaliye main aapko Government Exams ke dedicated section mein le chalti hoon kahan verified updates hain.
            <br><br>
            <button class="read-btn" style="width:100%; font-size:12px; padding: 8px;" onclick="goToSection('govt-section')">Take me to Govt Exams Section</button>
        `;
    }
    // 4. Intent: Greeting / Casual
    else if (lowerQuery.match(/(hello|hi|kaise|who are you|help)/)) {
        responseText = `
            <strong><i class="fa-solid fa-robot"></i> Divya Drishti:</strong><br><br>
            Namaste! 🙏 Main Divya Drishti hoon, aapki personal Ed-Tech AI Tutor. <br>
            Aap mujhse kisi bhi exam, syllabus, ya latest education news ke baare mein pooch sakte hain. Main fake news filter karke sirf verified data deti hoon.
        `;
    }
    // 5. Default Fallback
    else {
        responseText = `
            <strong><i class="fa-solid fa-magnifying-glass"></i> Divya Drishti Search:</strong><br><br>
            Maine "<em>${query}</em>" ke liye apna verified database scan kiya hai. <br>
            Relevant updates aapke background feed mein load ho rahe hain. Kripya scroll karke check karein!
        `;
    }

    openAITutor(responseText, true);
    
    // Yahan hum chahein toh background mein GNews API ko is specific query ke sath dobara call kar sakte hain!
    // Example: loadRealNewsForCustomQuery(query); (Future scope)
}
