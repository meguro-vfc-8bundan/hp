/**
 * 目黒消防団第８分団 入団促進サイト
 * メインJavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  // モバイルメニュー
  initMobileMenu();

  // FAQアコーディオン
  initFaqAccordion();

  // スクロールアニメーション
  initScrollAnimation();

  // スムーズスクロール
  initSmoothScroll();

  // ヘッダーのスクロール時の挙動
  initHeaderScroll();

  // フォームのバリデーション
  initFormValidation();

  // ヒーローパララックス効果
  initHeroParallax();

  // 背景色のスクロール変化（トップページのみ）
  initBackgroundColorScroll();
});

/**
 * モバイルメニューの初期化
 */
function initMobileMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.mobile-menu__close');
  const menuLinks = document.querySelectorAll('.mobile-menu__link');

  if (!menuBtn || !mobileMenu) return;

  // メニューを開く
  menuBtn.addEventListener('click', function() {
    mobileMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });

  // メニューを閉じる
  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // 背景クリックで閉じる
  mobileMenu.addEventListener('click', function(e) {
    if (e.target === mobileMenu) {
      closeMenu();
    }
  });

  // メニューリンククリックで閉じる
  menuLinks.forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });

  // ESCキーで閉じる
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

/**
 * FAQアコーディオンの初期化
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-item__question');

    if (question) {
      question.addEventListener('click', function() {
        // 他のアイテムを閉じる（オプション：同時に1つだけ開く場合）
        // faqItems.forEach(function(otherItem) {
        //   if (otherItem !== item) {
        //     otherItem.classList.remove('is-open');
        //   }
        // });

        // クリックしたアイテムをトグル
        item.classList.toggle('is-open');
      });
    }
  });

  // 詳細ページ用のアコーディオン
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(function(item) {
    const header = item.querySelector('.accordion-header');

    if (header) {
      header.addEventListener('click', function() {
        item.classList.toggle('is-open');
      });
    }
  });
}

/**
 * スクロールアニメーションの初期化
 */
function initScrollAnimation() {
  const animateElements = document.querySelectorAll('.scroll-animate');

  if (animateElements.length === 0) return;

  // Intersection Observerを使用
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // 一度表示されたら監視を解除（オプション）
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animateElements.forEach(function(element) {
    observer.observe(element);
  });
}

/**
 * スムーズスクロールの初期化
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // #のみの場合はスキップ
      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * ヘッダーのスクロール時の挙動
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');

  if (!header) return;

  let lastScrollY = 0;

  window.addEventListener('scroll', function() {
    const currentScrollY = window.pageYOffset;

    // スクロール方向を判定
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // 下スクロール時（非表示にする場合）
      // header.style.transform = 'translateY(-100%)';
    } else {
      // 上スクロール時
      // header.style.transform = 'translateY(0)';
    }

    // スクロール位置に応じて背景を変更
    if (currentScrollY > 50) {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }

    lastScrollY = currentScrollY;
  });
}

/**
 * フォームバリデーションの初期化
 */
function initFormValidation() {
  const form = document.querySelector('.form');

  if (!form) return;

  form.addEventListener('submit', function(e) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    // エラーメッセージをクリア
    const errorMessages = form.querySelectorAll('.form__error');
    errorMessages.forEach(function(msg) {
      msg.remove();
    });

    requiredFields.forEach(function(field) {
      field.classList.remove('is-error');

      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('is-error');
        showError(field, 'この項目は必須です');
      } else if (field.type === 'email' && !isValidEmail(field.value)) {
        isValid = false;
        field.classList.add('is-error');
        showError(field, '有効なメールアドレスを入力してください');
      } else if (field.type === 'tel' && !isValidPhone(field.value)) {
        isValid = false;
        field.classList.add('is-error');
        showError(field, '有効な電話番号を入力してください');
      }
    });

    // XSS対策：入力値のサニタイズ
    const textFields = form.querySelectorAll('input[type="text"], textarea');
    textFields.forEach(function(field) {
      field.value = sanitizeInput(field.value);
    });

    if (!isValid) {
      e.preventDefault();

      // 最初のエラーフィールドにフォーカス
      const firstError = form.querySelector('.is-error');
      if (firstError) {
        firstError.focus();
      }
    }
  });

  // リアルタイムバリデーション
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(function(input) {
    input.addEventListener('blur', function() {
      validateField(this);
    });

    input.addEventListener('input', function() {
      if (this.classList.contains('is-error')) {
        validateField(this);
      }
    });
  });
}

/**
 * フィールドの個別バリデーション
 */
function validateField(field) {
  // 既存のエラーメッセージを削除
  const existingError = field.parentElement.querySelector('.form__error');
  if (existingError) {
    existingError.remove();
  }

  field.classList.remove('is-error');

  if (field.required && !field.value.trim()) {
    field.classList.add('is-error');
    showError(field, 'この項目は必須です');
    return false;
  }

  if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
    field.classList.add('is-error');
    showError(field, '有効なメールアドレスを入力してください');
    return false;
  }

  if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
    field.classList.add('is-error');
    showError(field, '有効な電話番号を入力してください');
    return false;
  }

  return true;
}

/**
 * エラーメッセージを表示
 */
function showError(field, message) {
  const error = document.createElement('span');
  error.className = 'form__error';
  error.textContent = message;
  error.style.color = '#E53935';
  error.style.fontSize = '0.85rem';
  error.style.marginTop = '4px';
  error.style.display = 'block';

  field.parentElement.appendChild(error);
}

/**
 * メールアドレスのバリデーション
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 電話番号のバリデーション
 */
function isValidPhone(phone) {
  // 日本の電話番号形式（ハイフンあり・なし両方OK）
  const phoneRegex = /^[0-9\-+()]{10,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * XSS対策：入力値のサニタイズ
 */
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * フォーム送信成功時の処理
 */
function showSuccessMessage() {
  const form = document.querySelector('.form');
  if (!form) return;

  const successHtml = `
    <div class="form__success" style="text-align: center; padding: 2rem;">
      <h3 style="color: #4CAF50; margin-bottom: 1rem;">ありがとうございます！</h3>
      <p>入団申し込みを受け付けました。</p>
      <p>近日中に分団担当者からご連絡させていただきます。</p>
      <p>ご不明な点がございましたら、お気軽に目黒消防署までお問い合わせください。</p>
      <p style="margin-top: 1rem;"><strong>一緒に地域を守る仲間として、お会いできることを楽しみにしています！</strong></p>
      <p style="margin-top: 2rem; font-size: 0.9rem; color: #666;">
        【お問い合わせ先】<br>
        目黒消防署：<a href="tel:03-3710-0119">03-3710-0119</a>
      </p>
    </div>
  `;

  form.innerHTML = successHtml;
}

/**
 * ユーティリティ：要素の表示切り替え
 */
function toggleElement(element, show) {
  if (show) {
    element.style.display = '';
  } else {
    element.style.display = 'none';
  }
}

/**
 * ユーティリティ：スクロール位置を取得
 */
function getScrollPosition() {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  };
}

/**
 * ヒーローセクションのパララックス効果
 */
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero__content');
  const heroBgImage = document.querySelector('.hero__bg-image');
  const heroParticles = document.querySelector('.hero__particles');
  const scrollIndicator = document.querySelector('.hero__scroll-indicator');

  if (!hero) return;

  let ticking = false;

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        const scrollY = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        // ヒーローセクションが見えている間のみ効果を適用
        if (scrollY < heroHeight) {
          // 背景画像のパララックス（ゆっくり動く）
          if (heroBgImage) {
            heroBgImage.style.transform = `scale(${1 + scrollY * 0.0002}) translateY(${scrollY * 0.3}px)`;
          }

          // コンテンツのパララックス（速く動いてフェードアウト）
          if (heroContent) {
            const opacity = 1 - (scrollY / heroHeight) * 1.5;
            const translateY = scrollY * 0.4;
            heroContent.style.transform = `translateY(${translateY}px)`;
            heroContent.style.opacity = Math.max(0, opacity);
          }

          // パーティクルのパララックス
          if (heroParticles) {
            heroParticles.style.transform = `translateY(${scrollY * 0.2}px)`;
          }

          // スクロールインジケーターのフェードアウト
          if (scrollIndicator) {
            const indicatorOpacity = 1 - (scrollY / 200);
            scrollIndicator.style.opacity = Math.max(0, indicatorOpacity);
          }
        }

        ticking = false;
      });

      ticking = true;
    }
  });

  // マウス移動による微妙なパララックス効果（デスクトップのみ）
  if (window.matchMedia('(min-width: 768px)').matches) {
    hero.addEventListener('mousemove', function(e) {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
          const yPos = (e.clientY / window.innerHeight - 0.5) * 20;

          if (heroContent && window.pageYOffset < hero.offsetHeight * 0.5) {
            heroContent.style.transform = `translate(${xPos * 0.3}px, ${yPos * 0.3 + window.pageYOffset * 0.4}px)`;
          }

          ticking = false;
        });

        ticking = true;
      }
    });

    hero.addEventListener('mouseleave', function() {
      if (heroContent) {
        heroContent.style.transform = `translateY(${window.pageYOffset * 0.4}px)`;
      }
    });
  }
}

/**
 * 背景色のスクロール変化
 * トップページでスクロールに応じて背景色がグラデーション的に変化
 */
function initBackgroundColorScroll() {
  // トップページ（index.html）のみで動作
  const isTopPage = window.location.pathname === '/' ||
                    window.location.pathname.endsWith('index.html') ||
                    window.location.pathname.endsWith('/');

  if (!isTopPage) return;

  // 背景色の設定（上から下へのグラデーション）
  const colorStops = [
    { position: 0, color: [255, 255, 255] },      // 白（ヒーロー下部）
    { position: 0.15, color: [255, 250, 245] },   // 温かみのある白
    { position: 0.3, color: [255, 245, 238] },    // うっすらオレンジ
    { position: 0.5, color: [245, 248, 255] },    // うっすら青
    { position: 0.7, color: [240, 248, 255] },    // アリスブルー
    { position: 0.85, color: [248, 245, 255] },   // うっすら紫
    { position: 1, color: [245, 245, 250] }       // グレーがかった白
  ];

  let ticking = false;

  // 2色間を補間する関数
  function interpolateColor(color1, color2, factor) {
    return [
      Math.round(color1[0] + (color2[0] - color1[0]) * factor),
      Math.round(color1[1] + (color2[1] - color1[1]) * factor),
      Math.round(color1[2] + (color2[2] - color1[2]) * factor)
    ];
  }

  // スクロール位置に応じた背景色を取得
  function getColorForPosition(scrollProgress) {
    // 0-1の範囲に正規化
    scrollProgress = Math.max(0, Math.min(1, scrollProgress));

    // 該当する2つのカラーストップを見つける
    let lowerStop = colorStops[0];
    let upperStop = colorStops[colorStops.length - 1];

    for (let i = 0; i < colorStops.length - 1; i++) {
      if (scrollProgress >= colorStops[i].position && scrollProgress <= colorStops[i + 1].position) {
        lowerStop = colorStops[i];
        upperStop = colorStops[i + 1];
        break;
      }
    }

    // 2つのストップ間での位置を計算
    const range = upperStop.position - lowerStop.position;
    const factor = range === 0 ? 0 : (scrollProgress - lowerStop.position) / range;

    return interpolateColor(lowerStop.color, upperStop.color, factor);
  }

  // スクロールイベントハンドラー
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        const scrollY = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = docHeight > 0 ? scrollY / docHeight : 0;

        const color = getColorForPosition(scrollProgress);
        document.body.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

        ticking = false;
      });

      ticking = true;
    }
  }

  // 初期背景色を設定
  document.body.style.transition = 'background-color 0.1s ease-out';
  handleScroll();

  // スクロールイベントをリッスン
  window.addEventListener('scroll', handleScroll, { passive: true });
}
