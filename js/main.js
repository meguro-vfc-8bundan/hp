/**
 * 目黒消防団第８分団 入団促進サイト
 * メインJavaScript
 */

/**
 * スクロールマネージャー
 * 複数のスクロールハンドラーを統合管理し、パフォーマンスを最適化
 */
const scrollManager = {
  handlers: [],
  ticking: false,

  register: function(handler) {
    this.handlers.push(handler);
  },

  init: function() {
    const self = this;
    window.addEventListener('scroll', function() {
      if (!self.ticking) {
        window.requestAnimationFrame(function() {
          const scrollY = window.pageYOffset;
          self.handlers.forEach(function(handler) {
            handler(scrollY);
          });
          self.ticking = false;
        });
        self.ticking = true;
      }
    }, { passive: true });

    // 初期実行
    const initialScrollY = window.pageYOffset;
    this.handlers.forEach(function(handler) {
      handler(initialScrollY);
    });
  }
};

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

  // モバイル用フローティングCTAボタン
  initFloatingCta();

  // スクロールマネージャーを起動（全ハンドラー登録後）
  scrollManager.init();
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
 * アコーディオン共通初期化関数
 * @param {string} itemSelector - アコーディオンアイテムのセレクタ
 * @param {string} triggerSelector - クリックトリガーのセレクタ
 */
function initAccordion(itemSelector, triggerSelector) {
  var items = document.querySelectorAll(itemSelector);

  items.forEach(function(item) {
    var trigger = item.querySelector(triggerSelector);

    if (trigger) {
      trigger.addEventListener('click', function() {
        item.classList.toggle('is-open');
      });
    }
  });
}

/**
 * FAQアコーディオンの初期化
 */
function initFaqAccordion() {
  // トップページ用FAQ
  initAccordion('.faq-item', '.faq-item__question');

  // 詳細ページ用アコーディオン
  initAccordion('.accordion-item', '.accordion-header');
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

  // スクロールマネージャーにハンドラーを登録
  scrollManager.register(function(scrollY) {
    // スクロール位置に応じて背景を変更
    if (scrollY > 50) {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
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
  var existingError = field.parentElement.querySelector('.form__error');
  if (existingError) {
    existingError.remove();
  }

  // aria属性をクリア
  field.classList.remove('is-error');
  field.removeAttribute('aria-describedby');
  field.removeAttribute('aria-invalid');

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
 * アクセシビリティ対応: aria-describedby と role="alert" を設定
 */
function showError(field, message) {
  var errorId = field.id + '-error';

  var error = document.createElement('span');
  error.id = errorId;
  error.className = 'form__error';
  error.setAttribute('role', 'alert');
  error.textContent = message;
  error.style.color = '#E53935';
  error.style.fontSize = '0.85rem';
  error.style.marginTop = '4px';
  error.style.display = 'block';

  // aria-describedbyを設定してエラーメッセージと関連付け
  field.setAttribute('aria-describedby', errorId);
  field.setAttribute('aria-invalid', 'true');

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
 * XSS対策: DOM操作で要素を生成
 */
function showSuccessMessage() {
  const form = document.querySelector('.form');
  if (!form) return;

  // 既存の内容をクリア
  form.textContent = '';

  // 成功メッセージコンテナを作成
  const successDiv = document.createElement('div');
  successDiv.className = 'form__success';
  successDiv.style.cssText = 'text-align: center; padding: 2rem;';

  // タイトル
  const title = document.createElement('h3');
  title.style.cssText = 'color: #4CAF50; margin-bottom: 1rem;';
  title.textContent = 'ありがとうございます！';

  // メッセージ段落
  const msg1 = document.createElement('p');
  msg1.textContent = '入団申し込みを受け付けました。';

  const msg2 = document.createElement('p');
  msg2.textContent = '近日中に分団担当者からご連絡させていただきます。';

  const msg3 = document.createElement('p');
  msg3.textContent = 'ご不明な点がございましたら、お気軽に目黒消防署までお問い合わせください。';

  const msg4 = document.createElement('p');
  msg4.style.marginTop = '1rem';
  const strong = document.createElement('strong');
  strong.textContent = '一緒に地域を守る仲間として、お会いできることを楽しみにしています！';
  msg4.appendChild(strong);

  // 問い合わせ先
  const contactP = document.createElement('p');
  contactP.style.cssText = 'margin-top: 2rem; font-size: 0.9rem; color: #666;';
  contactP.appendChild(document.createTextNode('【お問い合わせ先】'));
  contactP.appendChild(document.createElement('br'));
  contactP.appendChild(document.createTextNode('目黒消防署：'));

  const telLink = document.createElement('a');
  telLink.href = 'tel:03-3710-0119';
  telLink.textContent = '03-3710-0119';
  contactP.appendChild(telLink);

  // 組み立て
  successDiv.appendChild(title);
  successDiv.appendChild(msg1);
  successDiv.appendChild(msg2);
  successDiv.appendChild(msg3);
  successDiv.appendChild(msg4);
  successDiv.appendChild(contactP);

  form.appendChild(successDiv);
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

  // スクロールマネージャーにハンドラーを登録
  scrollManager.register(function(scrollY) {
    const heroHeight = hero.offsetHeight;

    // ヒーローセクションが見えている間のみ効果を適用
    if (scrollY < heroHeight) {
      // 背景画像のパララックス（ゆっくり動く）
      if (heroBgImage) {
        heroBgImage.style.transform = 'scale(' + (1 + scrollY * 0.0002) + ') translateY(' + (scrollY * 0.3) + 'px)';
      }

      // コンテンツのパララックス（速く動いてフェードアウト）
      if (heroContent) {
        const opacity = 1 - (scrollY / heroHeight) * 1.5;
        const translateY = scrollY * 0.4;
        heroContent.style.transform = 'translateY(' + translateY + 'px)';
        heroContent.style.opacity = Math.max(0, opacity);
      }

      // パーティクルのパララックス
      if (heroParticles) {
        heroParticles.style.transform = 'translateY(' + (scrollY * 0.2) + 'px)';
      }

      // スクロールインジケーターのフェードアウト
      if (scrollIndicator) {
        const indicatorOpacity = 1 - (scrollY / 200);
        scrollIndicator.style.opacity = Math.max(0, indicatorOpacity);
      }
    }
  });

  // マウス移動による微妙なパララックス効果（デスクトップのみ）
  if (window.matchMedia('(min-width: 768px)').matches) {
    let mouseTicking = false;

    hero.addEventListener('mousemove', function(e) {
      if (!mouseTicking) {
        window.requestAnimationFrame(function() {
          const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
          const yPos = (e.clientY / window.innerHeight - 0.5) * 20;

          if (heroContent && window.pageYOffset < hero.offsetHeight * 0.5) {
            heroContent.style.transform = 'translate(' + (xPos * 0.3) + 'px, ' + (yPos * 0.3 + window.pageYOffset * 0.4) + 'px)';
          }

          mouseTicking = false;
        });

        mouseTicking = true;
      }
    });

    hero.addEventListener('mouseleave', function() {
      if (heroContent) {
        heroContent.style.transform = 'translateY(' + (window.pageYOffset * 0.4) + 'px)';
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
    { position: 0.15, color: [255, 245, 235] },   // 温かみのあるクリーム
    { position: 0.3, color: [255, 235, 220] },    // 淡いオレンジ
    { position: 0.5, color: [230, 240, 255] },    // 淡い青
    { position: 0.7, color: [220, 235, 255] },    // ライトブルー
    { position: 0.85, color: [235, 225, 250] },   // 淡いラベンダー
    { position: 1, color: [240, 238, 245] }       // グレーがかった紫
  ];

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

  // 初期背景色を設定
  document.body.style.transition = 'background-color 0.1s ease-out';

  // スクロールマネージャーにハンドラーを登録
  scrollManager.register(function(scrollY) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? scrollY / docHeight : 0;

    const color = getColorForPosition(scrollProgress);
    document.body.style.backgroundColor = 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')';
  });
}

/**
 * モバイル用フローティングCTAボタンの初期化
 * スクロールで表示、CTAセクションが見えたら非表示
 */
function initFloatingCta() {
  const floatingCta = document.querySelector('.floating-cta');
  // .cta または .cta-section またはフッターを検出
  const ctaSection = document.querySelector('.cta') || document.querySelector('.cta-section');
  const footer = document.querySelector('.footer');

  if (!floatingCta) return;

  let isCtaVisible = false;
  let isFooterVisible = false;
  const scrollThreshold = 300; // ボタンが表示されるスクロール量

  // CTAセクションの可視性を監視
  if (ctaSection) {
    const ctaObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        isCtaVisible = entry.isIntersecting;
        updateFloatingCtaVisibility(window.pageYOffset);
      });
    }, {
      threshold: 0.1
    });

    ctaObserver.observe(ctaSection);
  }

  // フッターの可視性を監視
  if (footer) {
    const footerObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        isFooterVisible = entry.isIntersecting;
        updateFloatingCtaVisibility(window.pageYOffset);
      });
    }, {
      threshold: 0.1
    });

    footerObserver.observe(footer);
  }

  function updateFloatingCtaVisibility(scrollY) {
    const shouldShow = scrollY > scrollThreshold && !isCtaVisible && !isFooterVisible;

    if (shouldShow) {
      floatingCta.classList.add('is-visible');
    } else {
      floatingCta.classList.remove('is-visible');
    }
  }

  // スクロールマネージャーにハンドラーを登録
  scrollManager.register(function(scrollY) {
    updateFloatingCtaVisibility(scrollY);
  });
}
