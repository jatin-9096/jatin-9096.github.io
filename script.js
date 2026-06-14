/* ============================================
   NEWSSYNC – script.js
   Production-ready JS for GitHub Pages
   ============================================ */

// ── CONFIG ──────────────────────────────────────────────────────────────────

const CONFIG = {
  // 🔑 REPLACE WITH YOUR GNEWS API KEY FROM https://gnews.io
  API_KEY: 'YOUR_GNEWS_API_KEY_HERE',

  BASE_URL: 'https://gnews.io/api/v4',
  REFRESH_INTERVAL: 300_000, // 5 minutes in ms

  ENDPOINTS: {
    headlines: (key) =>
      `${CONFIG.BASE_URL}/top-headlines?country=in&lang=en&category=general&max=8&apikey=${key}`,
    exams: (key) =>
      `${CONFIG.BASE_URL}/search?q=%22CBSE%22+OR+%22NDA%22+OR+%22CUET+UG%22+OR+%22UPSC%22&lang=en&country=in&sortby=publishedAt&max=8&apikey=${key}`,
  },

  PLACEHOLDER_IMG: 'https://placehold.co/640x360/EEF0FF/635BFF?text=NewsSync',

  BADGE_RULES: [
    { keywords: ['NDA', 'navy', 'defence', 'defense', 'army', 'air force'], cls: 'badge-exam', label: '🎖️ Defence' },
    { keywords: ['CUET', 'CET', 'entrance', 'admission'],                   cls: 'badge-exam', label: '📝 Exam Alert' },
    { keywords: ['CBSE', 'board', 'class 10', 'class 12', 'result'],        cls: 'badge-board', label: '📋 Board News' },
    { keywords: ['UPSC', 'civil services', 'IAS', 'IPS', 'IFS'],           cls: 'badge-upsc', label: '🏛️ UPSC' },
    { keywords: ['CUET UG'],                                                 cls: 'badge-cuet', label: '🎓 CUET UG' },
  ],
};

// ── STATE ────────────────────────────────────────────────────────────────────

const state = {
  headlineUrls: new Set(),
  examUrls:     new Set(),
};

// ── DOM REFS ─────────────────────────────────────────────────────────────────

const DOM = {
  headlinesGrid: document.getElementById('headlines-grid'),
  examsGrid:     document.getElementById('exams-grid'),
  lastUpdated:   document.getElementById('last-updated'),
  toast:         document.getElementById('toast'),
};

// ── HELPERS ──────────────────────────────────────────────────────────────────

/** Show a toast notification */
let toastTimer;
function showToast(message, type = '') {
  clearTimeout(toastTimer);
  DOM.toast.textContent = message;
  DOM.toast.className = `toast${type ? ' ' + type : ''}`;
  void DOM.toast.offsetWidth; // force reflow
  DOM.toast.classList.add('show');
  toastTimer = setTimeout(() => DOM.toast.classList.remove('show'), 4500);
}

/** Format ISO date to readable string */
function formatDate(isoStr) {
  if (!isoStr) return '';
  try {
    return new Date(isoStr).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch { return ''; }
}

/** Determine badges for an article title */
function getBadges(title = '') {
  const upper = title.toUpperCase();
  const badges = [];
  for (const rule of CONFIG.BADGE_RULES) {
    if (rule.keywords.some(kw => upper.includes(kw.toUpperCase()))) {
      // avoid duplicates
      if (!badges.find(b => b.cls === rule.cls)) {
        badges.push(rule);
      }
    }
  }
  return badges.slice(0, 2); // max 2 badges per card
}

/** Render badge HTML */
function renderBadges(badges) {
  if (!badges.length) return '';
  const items = badges.map(b => `<span class="badge ${b.cls}">${b.label}</span>`).join('');
  return `<div class="card-badge-row">${items}</div>`;
}

/** Build one news card HTML string */
function buildCardHTML(article) {
  const img  = article.image || CONFIG.PLACEHOLDER_IMG;
  const imgAlt = article.image ? `Thumbnail for: ${article.title}` : 'Placeholder news image';
  const desc = article.description || 'No description available for this article.';
  const src  = article.source?.name || 'Unknown Source';
  const date = formatDate(article.publishedAt);
  const badges = getBadges(article.title);

  return `
    <article class="news-card">
      <div class="card-img-wrap">
        <img
          src="${img}"
          alt="${imgAlt}"
          loading="lazy"
          onerror="this.src='${CONFIG.PLACEHOLDER_IMG}'; this.alt='Placeholder news image';"
        />
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span class="card-source">${src}</span>
          <time class="card-date" datetime="${article.publishedAt || ''}">${date}</time>
        </div>
        ${renderBadges(badges)}
        <h3 class="card-title">
          <a href="${article.url}" target="_blank" rel="noopener noreferrer">
            ${article.title}
          </a>
        </h3>
        <p class="card-desc">${desc}</p>
        <a class="card-link" href="${article.url}" target="_blank" rel="noopener noreferrer">
          Read more →
        </a>
      </div>
    </article>
  `.trim();
}

/** Build skeleton loader HTML (count cards) */
function buildSkeletons(count = 6) {
  return Array.from({ length: count }, () => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="sk skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-line w-30 sk"></div>
        <div class="skeleton-gap">
          <div class="skeleton-line h-20 w-80 sk"></div>
          <div class="skeleton-line h-20 w-60 sk"></div>
        </div>
        <div class="skeleton-gap">
          <div class="skeleton-line w-100 sk"></div>
          <div class="skeleton-line w-100 sk"></div>
          <div class="skeleton-line w-80 sk"></div>
        </div>
        <div class="skeleton-line w-30 sk"></div>
      </div>
    </div>
  `).join('');
}

/** Render fallback message inside a grid */
function renderFallback(gridEl, message, icon = '📡') {
  gridEl.innerHTML = `
    <div class="fallback-msg" role="status">
      <span class="fallback-icon">${icon}</span>
      <p class="fallback-title">${message}</p>
      <p class="fallback-sub">Updates will resume automatically. You can also refresh the page.</p>
    </div>
  `;
}

/** Update the "Last Updated" timestamp in the header */
function updateTimestamp() {
  const now = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  });
  DOM.lastUpdated.textContent = `Last synced: ${now}`;
}

// ── FETCH FUNCTIONS ───────────────────────────────────────────────────────────

/**
 * Generic fetch wrapper with timeout, JSON parsing, and error classification.
 */
async function fetchJSON(url, timeoutMs = 10_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (res.status === 429) {
      throw Object.assign(new Error('Rate limit exceeded'), { code: 'RATE_LIMIT' });
    }
    if (!res.ok) {
      throw Object.assign(
        new Error(`HTTP ${res.status}: ${res.statusText}`),
        { code: 'HTTP_ERROR', status: res.status }
      );
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw Object.assign(new Error('Request timed out'), { code: 'TIMEOUT' });
    }
    throw err;
  }
}

/**
 * Fetch and render top India headlines.
 * Uses state diffing: only re-renders if new articles found.
 */
async function fetchHeadlines() {
  try {
    const data = await fetchJSON(CONFIG.ENDPOINTS.headlines(CONFIG.API_KEY));
    const articles = data?.articles ?? [];

    if (!articles.length) {
      renderFallback(DOM.headlinesGrid, 'No headlines found at the moment.', '📰');
      return;
    }

    // State diff: check if any article is new
    const newUrls = articles.map(a => a.url);
    const hasNew  = newUrls.some(url => !state.headlineUrls.has(url));

    if (!hasNew && DOM.headlinesGrid.querySelector('.news-card')) return; // no change

    // Update state
    state.headlineUrls = new Set(newUrls);

    // Render
    DOM.headlinesGrid.innerHTML = articles.map(buildCardHTML).join('');
    updateTimestamp();

  } catch (err) {
    handleFetchError(err, DOM.headlinesGrid, 'headlines');
  }
}

/**
 * Fetch and render exam/board notifications.
 */
async function fetchExamUpdates() {
  try {
    const data = await fetchJSON(CONFIG.ENDPOINTS.exams(CONFIG.API_KEY));
    const articles = data?.articles ?? [];

    if (!articles.length) {
      renderFallback(DOM.examsGrid, 'No exam alerts found at the moment.', '📚');
      return;
    }

    const newUrls = articles.map(a => a.url);
    const hasNew  = newUrls.some(url => !state.examUrls.has(url));

    if (!hasNew && DOM.examsGrid.querySelector('.news-card')) return;

    state.examUrls = new Set(newUrls);
    DOM.examsGrid.innerHTML = articles.map(buildCardHTML).join('');
    updateTimestamp();

  } catch (err) {
    handleFetchError(err, DOM.examsGrid, 'exam alerts');
  }
}

/**
 * Centralised error handler for fetch failures.
 */
function handleFetchError(err, gridEl, context) {
  console.error(`[NewsSync] Error fetching ${context}:`, err);

  // Only replace skeleton/card UI on first failure (not on repeat timer hits if cards exist)
  const hasCards = gridEl.querySelector('.news-card');

  if (err.code === 'RATE_LIMIT') {
    showToast('⏳ API limit reached. Auto-retrying in 5 min.', 'warn');
    if (!hasCards) renderFallback(gridEl, 'Updates paused — rate limit reached.', '⏳');
    return;
  }

  if (!navigator.onLine || err.message?.includes('Failed to fetch') || err.code === 'TIMEOUT') {
    showToast('📶 You are offline. Showing older results.', 'warn');
    if (!hasCards) renderFallback(gridEl, 'No internet connection.', '📶');
    return;
  }

  // Generic API error
  showToast(`⚠️ Could not load ${context}. Retrying soon…`, 'error');
  if (!hasCards) renderFallback(gridEl, 'Updates temporarily unavailable.', '⚠️');
}

// ── SYNC ENGINE ───────────────────────────────────────────────────────────────

/**
 * Runs both fetch functions concurrently.
 * Called on init and every 5 minutes.
 */
async function syncAll() {
  await Promise.allSettled([
    fetchHeadlines(),
    fetchExamUpdates(),
  ]);
}

/**
 * Initialise the app: show skeletons → start sync → schedule interval.
 */
function init() {
  // Show skeleton placeholders immediately
  DOM.headlinesGrid.innerHTML = buildSkeletons(6);
  DOM.examsGrid.innerHTML     = buildSkeletons(6);

  // First data load
  syncAll();

  // Auto-refresh every 5 minutes
  setInterval(syncAll, CONFIG.REFRESH_INTERVAL);

  // Listen for connectivity changes
  window.addEventListener('online',  () => { showToast('✅ Back online! Syncing now…'); syncAll(); });
  window.addEventListener('offline', () => showToast('📶 You are offline. Showing cached data.', 'warn'));
}

// ── BOOT ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);
