(function () {
  "use strict";

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMobile = window.matchMedia("(max-width: 768px)").matches;

  function initPageEnter() {
    var main = document.querySelector("main");
    if (!main || prefersReduced) {
      return;
    }
    main.classList.add("page-fx-enter");
    requestAnimationFrame(function () {
      main.classList.add("is-ready");
    });
  }

  function initNavLinkFade() {
    if (prefersReduced) {
      return;
    }
    document.querySelectorAll(".nav-list a[href]").forEach(function (link) {
      if (link.getAttribute("href").charAt(0) === "#") {
        return;
      }
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        if (!href || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
          return;
        }
        var main = document.querySelector("main");
        if (!main) {
          return;
        }
        e.preventDefault();
        main.classList.remove("is-ready");
        main.classList.add("is-leaving");
        window.setTimeout(function () {
          window.location.href = href;
        }, 220);
      });
    });
  }

  function initContentReveal() {
    var nodes = document.querySelectorAll(
      ".content-section, .panel, .profile-panel"
    );
    nodes.forEach(function (el) {
      if (el.classList.contains("shop-page") || el.closest(".shop-page")) {
        return;
      }
      if (el.closest("#shop")) {
        return;
      }
      if (!el.classList.contains("reveal")) {
        el.classList.add("reveal", "reveal--fx");
      }
    });
    if (typeof window.SDR_LAB_initReveal === "function") {
      window.SDR_LAB_initReveal();
      return;
    }
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
      el.style.willChange = "transform, opacity";
      observer.observe(el);
    });
  }

  function initParallax() {
    if (prefersReduced || isMobile) {
      return;
    }
    var bg = document.querySelector(".page-bg");
    var waves = document.querySelector(".page-bg .waves");
    if (!bg) {
      return;
    }
    var ticking = false;
    function onScroll() {
      if (ticking) {
        return;
      }
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY || 0;
        bg.style.transform = "translate3d(0, " + y * 0.08 + "px, 0)";
        if (waves) {
          waves.style.transform = "translate3d(0, " + y * 0.14 + "px, 0)";
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initNeonCanvas() {
    var canvas = document.getElementById("neonParticlesCanvas");
    if (!canvas || prefersReduced) {
      if (canvas) {
        canvas.hidden = true;
      }
      return;
    }
    if (isMobile) {
      canvas.classList.add("neon-particles-canvas--lite");
    }
    var ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return;
    }
    var particles = [];
    var count = isMobile ? 28 : 52;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var last = 0;
    var frameGap = 1000 / 36;

    function resize() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.22,
          vy: 0.12 + Math.random() * 0.35,
          r: 0.6 + Math.random() * 1.4,
          a: 0.08 + Math.random() * 0.18,
        });
      }
    }

    function draw(now) {
      requestAnimationFrame(draw);
      if (now - last < frameGap) {
        return;
      }
      last = now;
      var w = window.innerWidth;
      var h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > h + 8) {
          p.y = -8;
          p.x = Math.random() * w;
        }
        if (p.x < -8) {
          p.x = w + 8;
        }
        if (p.x > w + 8) {
          p.x = -8;
        }
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 255, 65, " + p.a + ")";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    resize();
    seed();
    window.addEventListener("resize", function () {
      resize();
      seed();
    });
    requestAnimationFrame(draw);
  }

  function initHoverScale() {
    var selector =
      ".btn-auth-submit, .shop-card--premium, .shop-add-btn, .nav-list a, .btn-scan, .mini-chat-fab";
    document.querySelectorAll(selector).forEach(function (el) {
      if (!el.classList.contains("fx-hover")) {
        el.classList.add("fx-hover");
      }
    });
  }

  initPageEnter();
  initNavLinkFade();
  initContentReveal();
  initParallax();
  initNeonCanvas();
  initHoverScale();
})();
