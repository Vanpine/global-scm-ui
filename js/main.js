/* ============================================================
   Global SCM 官网 — 共享脚本
   导航高亮 / 移动端菜单 / 自动轮播 / 滚动入场 / 数字 count-up
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. 导航栏高亮当前页 ---------- */
  function highlightNav() {
    var path = location.pathname.split('/').pop() || 'index.html';
    // 情报详情页（news-*.html）归属到「全球情报」导航项
    if (/^news-/.test(path)) path = 'intel.html';
    // 痛点与方案已并入「解决方案」，访问时高亮解决方案
    if (path === 'pain-points.html') path = 'solutions.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  /* ---------- 2. 移动端汉堡菜单 ---------- */
  function initMobileMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var navbar = document.querySelector('.navbar');
    if (!toggle || !navbar) return;
    toggle.addEventListener('click', function () {
      navbar.classList.toggle('open');
    });
    navbar.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { navbar.classList.remove('open'); });
    });
  }

  /* ---------- 3. 滚动入场动画 ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- 4. 数字 count-up ---------- */
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';
    var decimals = (el.dataset.count.split('.')[1] || '').length;
    var dur = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(decimals);
      el.textContent = prefix + Number(val).toLocaleString('en-US', {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals
      }) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function initCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    if (!('IntersectionObserver' in window)) { nums.forEach(animateCount); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---------- 5. 自动轮播（支持多个实例） ---------- */
  function initCarousel() {
    document.querySelectorAll('.carousel').forEach(initOneCarousel);
  }
  function initOneCarousel(carousel) {
    if (!carousel) return;
    var track = carousel.querySelector('.carousel-track');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var dotsWrap = carousel.querySelector('.carousel-dots');
    var total = slides.length;
    var current = 0, timer = null;

    // 生成圆点
    for (var i = 0; i < total; i++) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'slide ' + (i + 1));
      (function (idx) { b.addEventListener('click', function () { go(idx); reset(); }); })(i);
      dotsWrap.appendChild(b);
    }
    var dots = dotsWrap.querySelectorAll('button');

    function go(idx) {
      current = (idx + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, di) { d.classList.toggle('active', di === current); });
    }
    function next() { go(current + 1); }
    function prev() { go(current - 1); }
    function reset() { clearInterval(timer); timer = setInterval(next, 5000); }

    var nextBtn = carousel.querySelector('.carousel-arrow.next');
    var prevBtn = carousel.querySelector('.carousel-arrow.prev');
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); reset(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); reset(); });

    carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
    carousel.addEventListener('mouseleave', reset);

    go(0);
    reset();
  }

  /* ---------- 6. Hero 动态供应链网络背景 ---------- */
  function initHeroNetwork() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas || !canvas.getContext) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, nodes = [], raf = null;
    var mouse = { x: null, y: null };
    var hero = canvas.closest('.hero') || canvas;

    function build() {
      var rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(48, Math.min(150, Math.floor((W * H) / 11000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.32, vy: (Math.random() - 0.5) * 0.32,
          r: Math.random() * 1.6 + 0.8
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      var i, j;
      for (i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }
      for (i = 0; i < nodes.length; i++) {
        for (j = i + 1; j < nodes.length; j++) {
          var a = nodes[i], b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 175) {
            ctx.strokeStyle = 'rgba(46,151,255,' + (1 - d / 175) * 0.55 + ')';
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        if (mouse.x != null) {
          var mdx = nodes[i].x - mouse.x, mdy = nodes[i].y - mouse.y;
          var md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < 180) {
            ctx.strokeStyle = 'rgba(94,92,230,' + (1 - md / 180) * 0.6 + ')';
            ctx.lineWidth = 0.9;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
        }
      }
      for (i = 0; i < nodes.length; i++) {
        var p = nodes[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(125,182,255,0.9)';
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    function start() { if (!raf) frame(); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    build();
    start();

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { stop(); build(); start(); }, 200);
    });
    window.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
      } else { mouse.x = null; mouse.y = null; }
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) start(); else stop(); });
      }, { threshold: 0 }).observe(canvas);
    }
  }

  /* ---------- 7. 简易表单提交反馈 ---------- */
  function initForm() {
    var form = document.querySelector('#contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var enLang = (window.GSCM_LANG === 'en');
      btn.textContent = enLang ? "✓ Submitted! We'll reach out within 24 hours." : '✓ 已提交，我们将在 24 小时内与您联系';
      btn.style.background = '#34c759';
      btn.disabled = true;
      form.querySelectorAll('input, textarea, select').forEach(function (f) { f.disabled = true; });
    });
  }

  /* ---------- 8. 新闻卡片点赞 ---------- */
  function initNewsInteract() {
    var cards = document.querySelectorAll('.news-card[data-href]');
    if (!cards.length) return;

    var STORAGE_KEY = 'gscm_news_likes';
    var likes = {};
    try {
      likes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) { likes = {}; }

    function save() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(likes)); } catch (e) {}
    }

    cards.forEach(function (card) {
      var id = card.getAttribute('data-href');
      if (!likes[id]) likes[id] = { count: 0, liked: false };

      // Card click → navigate (skip if clicking buttons)
      card.addEventListener('click', function (e) {
        if (e.target.closest('button')) return;
        window.location.href = id;
      });

      // Like button
      var btn = card.querySelector('.act-btn');
      var countEl = btn ? btn.querySelector('.act-count') : null;
      if (!btn || !countEl) return;

      // Restore
      if (likes[id].liked) btn.classList.add('liked');
      countEl.textContent = likes[id].count;

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (likes[id].liked) {
          likes[id].liked = false;
          likes[id].count = Math.max(0, likes[id].count - 1);
          btn.classList.remove('liked');
        } else {
          likes[id].liked = true;
          likes[id].count += 1;
          btn.classList.add('liked');
        }
        countEl.textContent = likes[id].count;
        save();
      });
    });
  }

  /* ---------- 9. 文章详情页：阅读量 + 点赞 ---------- */
  function initArticleStats() {
    var statsBar = document.querySelector('.article-stats');
    if (!statsBar) return;

    var path = location.pathname.split('/').pop();
    var VIEW_KEY = 'gscm_article_views';
    var LIKE_KEY = 'gscm_article_likes';

    // --- 阅读量 ---
    var views = {};
    try { views = JSON.parse(localStorage.getItem(VIEW_KEY)) || {}; } catch (e) { views = {}; }
    if (!views[path]) {
      // Seed: hash filename to get a realistic starting count (100–2000)
      var seed = 0;
      for (var i = 0; i < path.length; i++) seed = ((seed << 5) - seed) + path.charCodeAt(i);
      views[path] = Math.abs(seed % 1900) + 100;
    }
    views[path] += 1;
    try { localStorage.setItem(VIEW_KEY, JSON.stringify(views)); } catch (e) {}

    var viewEl = statsBar.querySelector('.view-count');
    if (viewEl) viewEl.textContent = views[path];

    // --- 点赞 ---
    var likes = {};
    try { likes = JSON.parse(localStorage.getItem(LIKE_KEY)) || {}; } catch (e) { likes = {}; }
    if (!likes[path]) likes[path] = { count: Math.floor(Math.random() * 15) + 2, liked: false };

    var likeBtn = statsBar.querySelector('.act-like-article');
    var likeCount = likeBtn ? likeBtn.querySelector('.like-num') : null;
    if (!likeBtn || !likeCount) return;

    if (likes[path].liked) likeBtn.classList.add('liked');
    likeCount.textContent = likes[path].count;

    likeBtn.addEventListener('click', function () {
      if (likes[path].liked) {
        likes[path].liked = false;
        likes[path].count = Math.max(0, likes[path].count - 1);
        likeBtn.classList.remove('liked');
      } else {
        likes[path].liked = true;
        likes[path].count += 1;
        likeBtn.classList.add('liked');
      }
      likeCount.textContent = likes[path].count;
      try { localStorage.setItem(LIKE_KEY, JSON.stringify(likes)); } catch (e) {}
    });
  }

  /* ---------- 10. 订阅表单反馈（纯前端，无网络） ---------- */
  function initNewsletter() {
    var form = document.querySelector('#newsletterForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var enLang = (window.GSCM_LANG === 'en');
      btn.textContent = enLang ? '✓ Subscribed!' : '✓ 订阅成功！';
      btn.style.background = '#34c759';
      btn.disabled = true;
      form.querySelectorAll('input').forEach(function (f) { f.disabled = true; });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    highlightNav();
    initMobileMenu();
    initReveal();
    initCounters();
    initCarousel();
    initHeroNetwork();
    initForm();
    initNewsletter();
    initNewsInteract();
    initArticleStats();
  });
})();
