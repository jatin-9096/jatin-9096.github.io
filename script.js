// script.js - Complete Code
const newsContainer = document.getElementById('news-container');
let page = 1;

// Function to load news
function loadNews() {
    for (let i = 0; i < 6; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-content">
                <h4>Divya Drishti News #${(page - 1) * 6 + i + 1}</h4>
                <p>Yeh news automatically update ho rahi hai, scroll karte rahein...</p>
                <a href="#">Read More</a>
            </div>
        `;
        newsContainer.appendChild(card);
    }
    page++;
}

// Infinite Scroll Detection
window.onscroll = function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        loadNews();
    }
};

// AI Search Functionality
function runAISearch() {
    const query = document.getElementById('aiSearch').value;
    if (query) {
        alert("Divya Drishti AI searching for: " + query);
        // Yahan future mein hum API call karenge
    } else {
        alert("Please enter something to search!");
    }
}

// Section Switching
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Initial Load
loadNews();

