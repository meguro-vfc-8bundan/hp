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
// タイムゾーン問題を回避するため、文字列を直接パース
function formatDate(dateStr) {
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  return year + '年' + month + '月' + day + '日';
}

// 日付を短縮フォーマット（YYYY-MM-DD → MM/DD）
function formatDateShort(dateStr) {
  const parts = dateStr.split('-');
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  return month + '/' + day;
}

// トップページ用：お知らせカードを生成（最新3件）
async function renderNewsCards(containerId, limit = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const newsList = await fetchNews();
  const latestNews = newsList.slice(0, limit);

  // 既存の内容をクリア
  container.textContent = '';

  if (latestNews.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'news-empty';
    emptyMsg.textContent = '現在お知らせはありません';
    container.appendChild(emptyMsg);
    return;
  }

  // XSS対策: DOM操作でカードを生成（textContentを使用）
  latestNews.forEach(function(news) {
    const card = document.createElement('div');
    card.className = 'news-card';

    // 日付部分
    const dateDiv = document.createElement('div');
    dateDiv.className = 'news-card__date';
    const dateSpan = document.createElement('span');
    dateSpan.className = 'news-card__date-day';
    dateSpan.textContent = formatDateShort(news.date);
    dateDiv.appendChild(dateSpan);

    // 本文部分
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'news-card__body';

    const contentP = document.createElement('p');
    contentP.className = 'news-card__content';
    contentP.textContent = news.content;

    const metaDiv = document.createElement('div');
    metaDiv.className = 'news-card__meta';

    // 時間
    const timeSpan = document.createElement('span');
    timeSpan.className = 'news-card__time';
    const timeIcon = document.createElement('span');
    timeIcon.className = 'news-card__icon';
    timeIcon.textContent = '🕐';
    timeSpan.appendChild(timeIcon);
    timeSpan.appendChild(document.createTextNode(news.time));

    // 場所
    const locationSpan = document.createElement('span');
    locationSpan.className = 'news-card__location';
    const locationIcon = document.createElement('span');
    locationIcon.className = 'news-card__icon';
    locationIcon.textContent = '📍';
    locationSpan.appendChild(locationIcon);
    locationSpan.appendChild(document.createTextNode(news.location));

    metaDiv.appendChild(timeSpan);
    metaDiv.appendChild(locationSpan);
    bodyDiv.appendChild(contentP);
    bodyDiv.appendChild(metaDiv);

    card.appendChild(dateDiv);
    card.appendChild(bodyDiv);
    container.appendChild(card);
  });
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
