/**
 * お知らせ機能
 * data/news.json からデータを読み込んで表示
 */

// お知らせデータを取得
async function fetchNews() {
  try {
    const response = await fetch('data/news.json');
    if (!response.ok) throw new Error('データの取得に失敗しました');
    return await response.json();
  } catch (error) {
    console.error('お知らせの読み込みエラー:', error);
    return [];
  }
}

// 日付をフォーマット（YYYY-MM-DD → YYYY年MM月DD日）
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

// 日付を短縮フォーマット（YYYY-MM-DD → MM/DD）
function formatDateShort(dateStr) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}

// トップページ用：お知らせカードを生成（最新3件）
async function renderNewsCards(containerId, limit = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const newsList = await fetchNews();
  const latestNews = newsList.slice(0, limit);

  if (latestNews.length === 0) {
    container.innerHTML = '<p class="news-empty">現在お知らせはありません</p>';
    return;
  }

  const html = latestNews.map((news, index) => `
    <div class="news-card">
      <div class="news-card__date">
        <span class="news-card__date-day">${formatDateShort(news.date)}</span>
      </div>
      <div class="news-card__body">
        <p class="news-card__content">${news.content}</p>
        <div class="news-card__meta">
          <span class="news-card__time"><span class="news-card__icon">🕐</span>${news.time}</span>
          <span class="news-card__location"><span class="news-card__icon">📍</span>${news.location}</span>
        </div>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
}

// 初期化関数
function initNews() {
  renderNewsCards('news-cards', 3);
}

// ページ読み込み完了時に実行（複数の方法で確実に実行）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNews);
} else {
  // DOMContentLoadedは既に発火済み
  initNews();
}
