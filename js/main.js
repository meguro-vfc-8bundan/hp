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
