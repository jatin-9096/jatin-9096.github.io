document.addEventListener("DOMContentLoaded", () => {
    
    // --- SPA ROUTING ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.spa-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-target')).classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // --- REAL-TIME DATA FETCHING (The Brain) ---
    async function fetchRealNews() {
        try {
            // Yeh file apka Python script background mein banayega
            const response = await fetch('news_data.json');
            const data = await response.json();

            // Data ko alag-alag sections mein bhej do
            renderCards(data.trending, 'newsFeed', 'Trending', 'trending');
            renderCards(data.govt, 'govtFeed', 'Govt Exam', 'govt');
            renderCards(data.cbse, 'cbseFeed', 'CBSE', 'cbse');
            
            document.getElementById('loader').style.display = 'none';

        } catch (error) {
            console.error("News load hone mein error:", error);
            document.getElementById('newsFeed').innerHTML = "<p>Data Syncing... Please refresh in 2 minutes.</p>";
        }
    }

    function renderCards(articles, containerId, badgeText, badgeClass) {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; 
        
        articles.forEach(article => {
            const card = document.createElement('div');
            card.className = 'news-card';
            card.innerHTML = `
                <img src="${article.image}" style="width:100%; height:160px; object-fit:cover; border-radius:8px; margin-bottom:1rem;">
                <span class="badge ${badgeClass}">${badgeText}</span>
                <h3>${article.title}</h3>
                <a href="${article.link}" target="_blank" class="read-btn" style="display:block; text-align:center; text-decoration:none; margin-top:10px;">Read Detailed News</a>
            `;
            container.appendChild(card);
        });
    }

    // Call the function
    fetchRealNews();

    // --- AI SEARCH ---
    document.getElementById('aiSearch').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const activeFeed = document.querySelector('.spa-section.active .feed-grid');
        const cards = activeFeed.querySelectorAll('.news-card');

        cards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            if (title.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    document.getElementById('tutorBtn').addEventListener('click', () => {
        alert("Divya Drishti AI Active! Future updates will enable chat here.");
    });
});
