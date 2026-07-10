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

// 今日の日付をYYYY-MM-DD形式で取得（ローカルタイム基準）
function getTodayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

// お知らせを「開催予定（今日以降・日付が近い順）」と「終了分（新しい順）」に振り分ける
// dateは YYYY-MM-DD 固定なので文字列比較でそのまま日付順になる
function splitByDate(newsList) {
  const today = getTodayStr();
  const upcoming = newsList
    .filter(function(news) { return news.date >= today; })
    .sort(function(a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
  const past = newsList
    .filter(function(news) { return news.date < today; })
    .sort(function(a, b) { return a.date > b.date ? -1 : a.date < b.date ? 1 : 0; });
  return { upcoming: upcoming, past: past };
}

// トップページ用：お知らせカードを生成（開催が近い順に3件）
// 開催予定が3件に満たない場合は、終了分を新しい順で埋めてお知らせ欄が空にならないようにする
async function renderNewsCards(containerId, limit = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const newsList = await fetchNews();
  const split = splitByDate(newsList);
  const latestNews = split.upcoming.concat(split.past).slice(0, limit);

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
    // リンクがある場合はaタグ、ない場合はdivタグ
    var card;
    if (news.link) {
      card = document.createElement('a');
      card.href = news.link;
      card.className = 'news-card news-card--link';
      // 外部サイトへのリンクは別タブで開く
      if (/^https?:\/\//.test(news.link)) {
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
      }
    } else {
      card = document.createElement('div');
      card.className = 'news-card';
    }

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

    // 時間（未設定のお知らせでは行ごと省略）
    if (news.time) {
      const timeSpan = document.createElement('span');
      timeSpan.className = 'news-card__time';
      const timeIcon = document.createElement('span');
      timeIcon.className = 'news-card__icon';
      timeIcon.textContent = '🕐';
      timeSpan.appendChild(timeIcon);
      timeSpan.appendChild(document.createTextNode(news.time));
      metaDiv.appendChild(timeSpan);
    }

    // 場所（未設定のお知らせでは行ごと省略）
    if (news.location) {
      const locationSpan = document.createElement('span');
      locationSpan.className = 'news-card__location';
      const locationIcon = document.createElement('span');
      locationIcon.className = 'news-card__icon';
      locationIcon.textContent = '📍';
      locationSpan.appendChild(locationIcon);
      locationSpan.appendChild(document.createTextNode(news.location));
      metaDiv.appendChild(locationSpan);
    }

    bodyDiv.appendChild(contentP);
    bodyDiv.appendChild(metaDiv);

    // リンクカードの場合は「詳しく見る」を追加
    if (news.link) {
      const linkHint = document.createElement('span');
      linkHint.className = 'news-card__link-hint';
      linkHint.textContent = '詳しく見る →';
      bodyDiv.appendChild(linkHint);
    }

    card.appendChild(dateDiv);
    card.appendChild(bodyDiv);
    container.appendChild(card);
  });
}

// 一覧ページ用：お知らせ1件分の項目を生成
function createNewsItem(news) {
  const item = document.createElement('article');
  item.className = 'news-item';

  const dateDiv = document.createElement('div');
  dateDiv.className = 'news-item__date';
  const dateText = document.createElement('span');
  dateText.className = 'news-item__date-text';
  dateText.textContent = formatDate(news.date);
  dateDiv.appendChild(dateText);

  // XSS対策: textContentで本文を設定
  const contentP = document.createElement('p');
  contentP.className = 'news-item__content';
  contentP.textContent = news.content;

  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'news-item__details';

  if (news.time) {
    detailsDiv.appendChild(createNewsDetail('時間', news.time));
  }
  if (news.location) {
    detailsDiv.appendChild(createNewsDetail('場所', news.location));
  }

  item.appendChild(dateDiv);
  item.appendChild(contentP);
  item.appendChild(detailsDiv);

  if (news.link) {
    const link = document.createElement('a');
    link.href = news.link;
    link.className = 'news-card__link-hint';
    link.textContent = '詳しく見る →';
    // 外部サイトへのリンクは別タブで開く
    if (/^https?:\/\//.test(news.link)) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    item.appendChild(link);
  }

  return item;
}

// 一覧ページ用：ラベル付きの詳細行（時間・場所）を生成
function createNewsDetail(label, value) {
  const detail = document.createElement('div');
  detail.className = 'news-item__detail';
  const labelSpan = document.createElement('span');
  labelSpan.className = 'news-item__label';
  labelSpan.textContent = label;
  const valueSpan = document.createElement('span');
  valueSpan.className = 'news-item__value';
  valueSpan.textContent = value;
  detail.appendChild(labelSpan);
  detail.appendChild(valueSpan);
  return detail;
}

// 一覧ページ用：開催予定と終了分をそれぞれの枠に描画
async function renderNewsList() {
  const upcomingEl = document.getElementById('news-list-upcoming');
  const pastEl = document.getElementById('news-list-past');
  if (!upcomingEl || !pastEl) return;

  const newsList = await fetchNews();
  const split = splitByDate(newsList);

  upcomingEl.textContent = '';
  pastEl.textContent = '';

  if (split.upcoming.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'news-empty';
    emptyMsg.textContent = '現在、開催予定のお知らせはありません';
    upcomingEl.appendChild(emptyMsg);
  } else {
    split.upcoming.forEach(function(news) {
      upcomingEl.appendChild(createNewsItem(news));
    });
  }

  // 終了分が無ければセクションごと隠す
  const pastSection = document.getElementById('news-past-section');
  if (split.past.length === 0) {
    if (pastSection) pastSection.hidden = true;
  } else {
    if (pastSection) pastSection.hidden = false;
    split.past.forEach(function(news) {
      pastEl.appendChild(createNewsItem(news));
    });
  }
}

// 初期化関数
function initNews() {
  renderNewsCards('news-cards', 3);
  renderNewsList();
}

// ページ読み込み完了時に実行（複数の方法で確実に実行）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNews);
} else {
  // DOMContentLoadedは既に発火済み
  initNews();
}
