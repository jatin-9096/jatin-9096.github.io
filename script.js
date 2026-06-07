document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. SPA ROUTING (Single Page Application Logic) ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.spa-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and sections
            navButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked button and corresponding section
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            // Reset window scroll to top on tab change
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // --- 2. INFINITE SCROLL & DYNAMIC DOM INJECTION ---
    const newsFeed = document.getElementById('newsFeed');
    let isLoading = false;

    // Database of dummy content variations to simulate real API data
    const contentDatabase = [
        { title: "NDA 2026 Examination Tips", desc: "Advanced strategies for Mathematics and General Ability Test.", badge: "Govt", class: "govt" },
        { title: "PCM Board Exam Analysis", desc: "A deep dive into Physics, Chemistry, and Mathematics scoring patterns.", badge: "CBSE", class: "cbse" },
        { title: "Agniveer Recruitment Cycle", desc: "Latest age limits and eligibility criteria for the Indian Air Force.", badge: "Trending", class: "trending" },
        { title: "Coordinate Geometry Tricks", desc: "Solve complex questions in under 30 seconds for competitive exams.", badge: "CBSE", class: "cbse" },
        { title: "New Surya Batch Announced", desc: "Comprehensive syllabus coverage starting this month.", badge: "Trending", class: "trending" }
    ];

    function createCard(data) {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <span class="badge ${data.class}">${data.badge}</span>
            <h3>${data.title}</h3>
            <p>${data.desc}</p>
            <button class="read-btn">Read Detailed Guide</button>
        `;
        return card;
    }

    function loadMoreContent(count = 6) {
        if (isLoading) return;
        isLoading = true;
        document.getElementById('loader').style.display = 'block';

        // Simulating network delay (like fetching from an API)
        setTimeout(() => {
            for (let i = 0; i < count; i++) {
                const randomData = contentDatabase[Math.floor(Math.random() * contentDatabase.length)];
                newsFeed.appendChild(createCard(randomData));
            }
            isLoading = false;
            document.getElementById('loader').style.display = 'none';
        }, 800);
    }

    // Initial load for Home page
    loadMoreContent(9);

    // YouTube-style Infinite Scroll Logic
    window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
        // If user scrolls near the bottom of the page (100px threshold)
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            // Only trigger infinite scroll if Home section is active
            if(document.getElementById('home').classList.contains('active')) {
                loadMoreContent();
            }
        }
    });


    // --- 3. AI-CENTRIC SEARCH (Smart Routing Simulation) ---
    const searchInput = document.getElementById('aiSearch');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const activeFeed = document.querySelector('.spa-section.active .feed-grid');
        const cards = activeFeed.querySelectorAll('.news-card');

        cards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            const desc = card.querySelector('p').innerText.toLowerCase();
            
            if (title.includes(query) || desc.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // --- 4. AI TUTOR FAB CLICK ---
    document.getElementById('tutorBtn').addEventListener('click', () => {
        alert("Divya Drishti AI Tutor Initializing... (In future, this will open a chat interface to solve doubts instantly!)");
    });

});
