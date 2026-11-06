(function () {
  "use strict";

  function initActiveNav() {
    var page = document.body.getAttribute("data-page");
    if (!page) {
      var path = window.location.pathname.split("/").pop();
      page = path || "index.html";
    }
    document.querySelectorAll(".nav-list a[data-nav]").forEach(function (link) {
      var match = link.getAttribute("data-nav") === page;
      link.classList.toggle("nav-active", match);
      if (match) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function initMobileNav() {
    var headerEl = document.getElementById("siteHeader");
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("navMenu");
    if (!headerEl || !toggle || !menu) {
      return;
    }

    function closeMobileNav() {
      headerEl.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var open = headerEl.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMobileNav();
      });
    });
  }

  function initTypewriter() {
    var titleEl = document.getElementById("heroTitle");
    if (!titleEl) {
      return;
    }
    var fullTitle = "Исследуй невидимый эфир";
    titleEl.innerHTML =
      '<span class="typewriter" data-hero-type-text></span><span class="hero-cursor" aria-hidden="true">▌</span>';
    var textEl = titleEl.querySelector("[data-hero-type-text]");
    if (!textEl) {
      return;
    }
    var index = 0;
    var typing = true;

    function typeWriter() {
      if (!typing) {
        return;
      }
      if (index <= fullTitle.length) {
        textEl.textContent = fullTitle.slice(0, index);
        index += 1;
        setTimeout(typeWriter, index === fullTitle.length + 1 ? 2200 : 68);
      } else {
        typing = false;
        index = fullTitle.length;
        setTimeout(function () {
          typing = true;
          index = 0;
          typeWriter();
        }, 3200);
      }
    }

    typeWriter();
  }

  function initReveal() {
    document
      .querySelectorAll(".shop-page.reveal, .shop-page .reveal")
      .forEach(function (el) {
        el.classList.add("is-visible");
      });
    var blocks = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!blocks.length) {
      return;
    }
    if (!("IntersectionObserver" in window)) {
      blocks.forEach(function (el) {
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
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    blocks.forEach(function (el) {
      el.style.willChange = "transform, opacity";
      observer.observe(el);
    });
  }

  window.SDR_LAB_initReveal = initReveal;

  function initTiltCards() {
    document.querySelectorAll(".tilt-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          "perspective(700px) rotateX(" +
          -py * 14 +
          "deg) rotateY(" +
          px * 14 +
          "deg) scale(1.04)";
        card.style.boxShadow =
          "0 0 22px rgba(0, 255, 65, 0.22), 0 14px 32px rgba(0, 0, 0, 0.45)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
        card.style.boxShadow = "";
      });
    });
  }

  function initScannerTerminal() {
    var terminal = document.getElementById("scannerTerminal");
    var runBtn = document.getElementById("runScanBtn");
    if (!terminal || !runBtn) {
      return;
    }
    var scanLines = [
      "> Initializing HackRF...",
      "> Scanning 433.000 MHz...",
      "> Signal found! RSSI: -75 dBm",
    ];
    var typing = false;

    function typeLine(line, done) {
      var i = 0;
      var span = document.createElement("span");
      terminal.appendChild(span);
      terminal.appendChild(document.createElement("br"));
      function tick() {
        if (i <= line.length) {
          span.textContent = line.slice(0, i);
          i += 1;
          setTimeout(tick, 28);
        } else if (done) {
          done();
        }
      }
      tick();
    }

    runBtn.addEventListener("click", function () {
      if (typing) {
        return;
      }
      typing = true;
      terminal.textContent = "";
      var idx = 0;
      function nextLine() {
        if (idx >= scanLines.length) {
          var cur = document.createElement("span");
          cur.className = "cursor-blink";
          cur.textContent = "_";
          terminal.appendChild(cur);
          typing = false;
          return;
        }
        typeLine(scanLines[idx], function () {
          idx += 1;
          setTimeout(nextLine, 350);
        });
      }
      nextLine();
    });
  }

  function initGalleryLightbox() {
    var lightbox = document.getElementById("galleryLightbox");
    if (!lightbox) {
      return;
    }
    var lightboxImg = document.getElementById("lightboxImg");
    var lightboxCaption = document.getElementById("lightboxCaption");
    var closeBtn = document.getElementById("lightboxClose");
    var backdrop = document.getElementById("lightboxBackdrop");
    var lightboxDialog = lightbox.querySelector(".lightbox-dialog");
    var items = document.querySelectorAll("#projectGallery [data-lightbox]");
    if (!items.length) {
      return;
    }

    function openLightbox(figure) {
      var img = figure.querySelector("img");
      var cap = figure.querySelector("figcaption");
      if (!img) {
        return;
      }
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || "";
      lightboxCaption.textContent = cap ? cap.textContent : "";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
    }

    items.forEach(function (figure) {
      figure.addEventListener("click", function (e) {
        e.preventDefault();
        openLightbox(figure);
      });
      figure.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(figure);
        }
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    backdrop.addEventListener("click", closeLightbox);
    if (lightboxDialog) {
      lightboxDialog.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  var WEATHER_STORAGE_KEY = "sdr_lab_weather_city";
  var DEFAULT_WEATHER_CITY = {
    query: "Казань",
    name: "Казань",
    latitude: 55.7887,
    longitude: 49.1221,
    timezone: "Europe/Moscow",
  };

  var weatherRuntime = {
    query: DEFAULT_WEATHER_CITY.query,
    name: DEFAULT_WEATHER_CITY.name,
    latitude: DEFAULT_WEATHER_CITY.latitude,
    longitude: DEFAULT_WEATHER_CITY.longitude,
    timezone: DEFAULT_WEATHER_CITY.timezone,
    temperature: null,
    weatherCode: null,
    loading: false,
    forecast: [],
  };

  var WEATHER_DOCK_COLLAPSED_KEY = "sdr_lab_weather_dock_collapsed";

  function loadSavedWeatherCity() {
    try {
      var raw = localStorage.getItem(WEATHER_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      var data = JSON.parse(raw);
      if (
        data &&
        typeof data.latitude === "number" &&
        typeof data.longitude === "number" &&
        data.timezone
      ) {
        return data;
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  function saveWeatherCity(data) {
    localStorage.setItem(
      WEATHER_STORAGE_KEY,
      JSON.stringify({
        query: data.query || data.name,
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
      })
    );
  }

  function weatherIconFromCode(code) {
    if (code === 0) {
      return "☀";
    }
    if (code === 1 || code === 2) {
      return "🌤";
    }
    if (code === 3) {
      return "☁";
    }
    if (code === 45 || code === 48) {
      return "🌫";
    }
    if (code >= 51 && code <= 67) {
      return "🌧";
    }
    if (code >= 71 && code <= 77) {
      return "❄";
    }
    if (code >= 80 && code <= 82) {
      return "🌦";
    }
    if (code >= 95) {
      return "⛈";
    }
    return "🌡";
  }

  function formatCityTime(date, timeZone) {
    return new Intl.DateTimeFormat("ru-RU", {
      timeZone: timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  function formatTempValue(temp) {
    if (typeof temp !== "number" || Number.isNaN(temp)) {
      return "—";
    }
    var rounded = Math.round(temp);
    return (rounded > 0 ? "+" : "") + rounded + "°C";
  }

  function setWeatherError(message) {
    document.querySelectorAll("[data-weather-error]").forEach(function (el) {
      if (message) {
        el.textContent = message;
        el.classList.remove("is-hidden");
      } else {
        el.textContent = "";
        el.classList.add("is-hidden");
      }
    });
  }

  function syncWeatherSelects(query) {
    document.querySelectorAll("[data-weather-select]").forEach(function (sel) {
      var found = false;
      Array.prototype.forEach.call(sel.options, function (opt) {
        if (opt.value === query) {
          sel.value = query;
          found = true;
        }
      });
      if (!found) {
        sel.selectedIndex = -1;
      }
    });
  }

  function updateWeatherDisplay() {
    var icon = weatherIconFromCode(weatherRuntime.weatherCode);
    var city = weatherRuntime.name || weatherRuntime.query || "—";
    var timeText = formatCityTime(new Date(), weatherRuntime.timezone);
    var tempText =
      weatherRuntime.loading && weatherRuntime.temperature === null
        ? "…"
        : formatTempValue(weatherRuntime.temperature);

    document.querySelectorAll('[data-weather-part="icon"]').forEach(function (el) {
      el.textContent = icon;
    });
    document.querySelectorAll('[data-weather-part="city"]').forEach(function (el) {
      el.textContent = city;
    });
    document.querySelectorAll('[data-weather-part="time"]').forEach(function (el) {
      el.textContent = timeText;
    });
    document.querySelectorAll('[data-weather-part="temp"]').forEach(function (el) {
      el.textContent = tempText;
    });
  }

  function fetchGeocodeCity(cityName) {
    var url =
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
      encodeURIComponent(cityName) +
      "&count=1&language=ru&format=json";
    return fetch(url).then(function (res) {
      if (!res.ok) {
        throw new Error("network");
      }
      return res.json();
    });
  }

  function fetchCurrentWeather(lat, lon) {
    var url =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      encodeURIComponent(lat) +
      "&longitude=" +
      encodeURIComponent(lon) +
      "&current_weather=true";
    return fetch(url).then(function (res) {
      if (!res.ok) {
        throw new Error("network");
      }
      return res.json();
    });
  }

  function fetchWeatherForecast(lat, lon, timezone) {
    var url =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      encodeURIComponent(lat) +
      "&longitude=" +
      encodeURIComponent(lon) +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=" +
      encodeURIComponent(timezone || "auto");
    return fetch(url).then(function (res) {
      if (!res.ok) {
        throw new Error("network");
      }
      return res.json();
    });
  }

  function parseForecastDays(data) {
    var daily = data && data.daily;
    if (!daily || !daily.time || !daily.time.length) {
      return [];
    }
    var days = [];
    for (var i = 0; i < Math.min(3, daily.time.length); i++) {
      days.push({
        date: daily.time[i],
        code:
          daily.weather_code && typeof daily.weather_code[i] === "number"
            ? daily.weather_code[i]
            : daily.weathercode && typeof daily.weathercode[i] === "number"
              ? daily.weathercode[i]
              : null,
        tMax:
          daily.temperature_2m_max &&
          typeof daily.temperature_2m_max[i] === "number"
            ? daily.temperature_2m_max[i]
            : null,
        tMin:
          daily.temperature_2m_min &&
          typeof daily.temperature_2m_min[i] === "number"
            ? daily.temperature_2m_min[i]
            : null,
      });
    }
    return days;
  }

  function formatForecastDayLabel(isoDate, timeZone) {
    try {
      var d = new Date(isoDate + "T12:00:00");
      return new Intl.DateTimeFormat("ru-RU", {
        timeZone: timeZone,
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(d);
    } catch (e) {
      return isoDate;
    }
  }

  function ensureFixedWeatherDock() {
    if (document.getElementById("weatherDock")) {
      return document.getElementById("weatherDock");
    }
    var dock = document.createElement("aside");
    dock.id = "weatherDock";
    dock.className = "weather-dock";
    dock.setAttribute("aria-label", "Прогноз погоды");
    dock.innerHTML =
      '<button type="button" class="weather-dock-toggle" aria-expanded="true" aria-controls="weatherDockPanel" title="Свернуть прогноз">' +
      '<span class="weather-dock-toggle-icon" aria-hidden="true">◀</span>' +
      "</button>" +
      '<div id="weatherDockPanel" class="weather-dock-panel">' +
      '<div class="weather-dock-head">' +
      '<span class="weather-dock-head-icon" data-dock-part="icon">🌡</span>' +
      '<div class="weather-dock-head-text">' +
      '<span class="weather-dock-city" data-dock-part="city">—</span>' +
      '<span class="weather-dock-now" data-dock-part="now">…</span>' +
      "</div></div>" +
      '<ul class="weather-dock-days" data-dock-part="days"></ul>' +
      "</div>" +
      '<button type="button" class="weather-dock-fab" hidden aria-label="Развернуть прогноз">' +
      '<span data-dock-part="fab-icon">🌡</span>' +
      "</button>";
    document.body.appendChild(dock);
    return dock;
  }

  function setWeatherDockCollapsed(collapsed) {
    var dock = ensureFixedWeatherDock();
    dock.classList.toggle("is-collapsed", collapsed);
    var toggle = dock.querySelector(".weather-dock-toggle");
    var fab = dock.querySelector(".weather-dock-fab");
    if (toggle) {
      toggle.hidden = collapsed;
      toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
      toggle.title = collapsed ? "Развернуть прогноз" : "Свернуть прогноз";
    }
    if (fab) {
      fab.hidden = !collapsed;
    }
    try {
      localStorage.setItem(
        WEATHER_DOCK_COLLAPSED_KEY,
        collapsed ? "1" : "0"
      );
    } catch (e) {
      /* ignore */
    }
  }

  function updateFixedWeatherDock() {
    var dock = ensureFixedWeatherDock();
    var icon = weatherIconFromCode(weatherRuntime.weatherCode);
    var city = weatherRuntime.name || weatherRuntime.query || "—";
    var nowText =
      weatherRuntime.loading && weatherRuntime.temperature === null
        ? "Загрузка…"
        : formatTempValue(weatherRuntime.temperature);

    var iconEl = dock.querySelector('[data-dock-part="icon"]');
    var fabIcon = dock.querySelector('[data-dock-part="fab-icon"]');
    var cityEl = dock.querySelector('[data-dock-part="city"]');
    var nowEl = dock.querySelector('[data-dock-part="now"]');
    var daysEl = dock.querySelector('[data-dock-part="days"]');
    if (iconEl) {
      iconEl.textContent = icon;
    }
    if (fabIcon) {
      fabIcon.textContent = icon;
    }
    if (cityEl) {
      cityEl.textContent = city;
    }
    if (nowEl) {
      nowEl.textContent = nowText;
    }
    if (!daysEl) {
      return;
    }
    daysEl.innerHTML = "";
    var list = weatherRuntime.forecast || [];
    if (!list.length) {
      var li = document.createElement("li");
      li.className = "weather-dock-day weather-dock-day--muted";
      li.textContent = weatherRuntime.loading ? "Прогноз…" : "Нет данных";
      daysEl.appendChild(li);
      return;
    }
    list.forEach(function (day) {
      var row = document.createElement("li");
      row.className = "weather-dock-day";
      row.innerHTML =
        '<span class="weather-dock-day-label">' +
        formatForecastDayLabel(day.date, weatherRuntime.timezone) +
        "</span>" +
        '<span class="weather-dock-day-icon">' +
        weatherIconFromCode(day.code) +
        "</span>" +
        '<span class="weather-dock-day-temps">' +
        formatTempValue(day.tMax) +
        " / " +
        formatTempValue(day.tMin) +
        "</span>";
      daysEl.appendChild(row);
    });
  }

  function initFixedWeatherDock() {
    var dock = ensureFixedWeatherDock();
    var collapsed = false;
    try {
      collapsed = localStorage.getItem(WEATHER_DOCK_COLLAPSED_KEY) === "1";
    } catch (e) {
      collapsed = false;
    }
    setWeatherDockCollapsed(collapsed);

    var toggle = dock.querySelector(".weather-dock-toggle");
    var fab = dock.querySelector(".weather-dock-fab");
    if (toggle) {
      toggle.addEventListener("click", function () {
        setWeatherDockCollapsed(!dock.classList.contains("is-collapsed"));
      });
    }
    if (fab) {
      fab.addEventListener("click", function () {
        setWeatherDockCollapsed(false);
      });
    }
    updateFixedWeatherDock();
  }

  function refreshWeatherForecast() {
    if (
      typeof weatherRuntime.latitude !== "number" ||
      typeof weatherRuntime.longitude !== "number"
    ) {
      return Promise.resolve();
    }
    weatherRuntime.forecast = [];
    updateFixedWeatherDock();
    return fetchWeatherForecast(
      weatherRuntime.latitude,
      weatherRuntime.longitude,
      weatherRuntime.timezone
    )
      .then(function (data) {
        weatherRuntime.forecast = parseForecastDays(data);
        updateFixedWeatherDock();
      })
      .catch(function () {
        weatherRuntime.forecast = [];
        updateFixedWeatherDock();
      });
  }

  function applyWeatherLocation(loc, options) {
    options = options || {};
    weatherRuntime.query = loc.query || loc.name;
    weatherRuntime.name = loc.name;
    weatherRuntime.latitude = loc.latitude;
    weatherRuntime.longitude = loc.longitude;
    weatherRuntime.timezone = loc.timezone;
    weatherRuntime.loading = true;
    if (!options.keepError) {
      setWeatherError("");
    }
    syncWeatherSelects(weatherRuntime.query);
    updateWeatherDisplay();
    updateFixedWeatherDock();
    refreshWeatherForecast();

    return fetchCurrentWeather(loc.latitude, loc.longitude)
      .then(function (data) {
        var cw = data && data.current_weather;
        if (!cw || typeof cw.temperature !== "number") {
          throw new Error("nodata");
        }
        weatherRuntime.temperature = cw.temperature;
        weatherRuntime.weatherCode =
          typeof cw.weathercode === "number" ? cw.weathercode : null;
        weatherRuntime.loading = false;
        saveWeatherCity({
          query: weatherRuntime.query,
          name: weatherRuntime.name,
          latitude: weatherRuntime.latitude,
          longitude: weatherRuntime.longitude,
          timezone: weatherRuntime.timezone,
        });
        setWeatherError("");
        updateWeatherDisplay();
        updateFixedWeatherDock();
      })
      .catch(function () {
        weatherRuntime.loading = false;
        weatherRuntime.temperature = null;
        updateWeatherDisplay();
        updateFixedWeatherDock();
        setWeatherError("Нет связи с погодой. Проверьте интернет.");
      });
  }

  function resolveCitySearch(form) {
    var input = form.querySelector("[data-weather-input]");
    var select = form.querySelector("[data-weather-select]");
    var typed = input ? input.value.trim() : "";
    if (typed) {
      return typed;
    }
    if (select && select.value) {
      return select.value;
    }
    return DEFAULT_WEATHER_CITY.query;
  }

  function searchWeatherCity(cityName) {
    var query = String(cityName || "").trim();
    if (!query) {
      setWeatherError("Введите название города.");
      return Promise.resolve();
    }
    weatherRuntime.loading = true;
    setWeatherError("");
    updateWeatherDisplay();

    return fetchGeocodeCity(query)
      .then(function (data) {
        var hit = data && data.results && data.results[0];
        if (!hit) {
          weatherRuntime.loading = false;
          updateWeatherDisplay();
          setWeatherError("Город не найден");
          return;
        }
        return applyWeatherLocation({
          query: query,
          name: hit.name || query,
          latitude: hit.latitude,
          longitude: hit.longitude,
          timezone: hit.timezone || "UTC",
        });
      })
      .catch(function () {
        weatherRuntime.loading = false;
        updateWeatherDisplay();
        setWeatherError("Нет связи с погодой. Проверьте интернет.");
      });
  }

  function initClockAndWeather() {
    initFixedWeatherDock();

    document.querySelectorAll("[data-weather-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        searchWeatherCity(resolveCitySearch(form));
      });
      var select = form.querySelector("[data-weather-select]");
      if (select) {
        select.addEventListener("change", function () {
          var input = form.querySelector("[data-weather-input]");
          if (input) {
            input.value = "";
          }
          searchWeatherCity(select.value);
        });
      }
    });

    var saved = loadSavedWeatherCity();
    var bootstrap = saved || DEFAULT_WEATHER_CITY;
    weatherRuntime.query = bootstrap.query || bootstrap.name;
    weatherRuntime.name = bootstrap.name;
    weatherRuntime.latitude = bootstrap.latitude;
    weatherRuntime.longitude = bootstrap.longitude;
    weatherRuntime.timezone = bootstrap.timezone;
    syncWeatherSelects(weatherRuntime.query);
    applyWeatherLocation(bootstrap, { keepError: true });

    setInterval(function () {
      updateWeatherDisplay();
    }, 1000);
  }

  var USERS_KEY = "sdr_lab_users";
  var SESSION_KEY = "sdr_lab_session";

  function getUsers() {
    try {
      var raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setSession(session) {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  function normalizeLogin(value) {
    return String(value || "").trim().toLowerCase();
  }

  function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getUserAvatar(userOrSession) {
    return (userOrSession && userOrSession.avatar) || "📻";
  }

  /** Каталог: shop-products.js (генерируется npm run build:site) */
  var SHOP_PRODUCTS = {};

  function ensureShopProductsLoaded() {
    if (typeof window !== "undefined" && window.SDR_LAB_SHOP_PRODUCTS) {
      SHOP_PRODUCTS = window.SDR_LAB_SHOP_PRODUCTS;
    }
    return SHOP_PRODUCTS;
  }

  ensureShopProductsLoaded();

  var CART_PRODUCT_ALIASES = {
    "rtl-sdr": "rtl-sdr-v4",
    mla30: "mla-30",
  };

  var CART_KEY = "sdr_lab_cart";

  function normalizeCartProductId(id) {
    return CART_PRODUCT_ALIASES[id] || id;
  }

  function normalizeCartLines(items) {
    var merged = {};
    items.forEach(function (line) {
      var id = normalizeCartProductId(line.id);
      if (!SHOP_PRODUCTS[id]) {
        return;
      }
      merged[id] = (merged[id] || 0) + (line.qty || 1);
    });
    return Object.keys(merged).map(function (id) {
      return { id: id, qty: merged[id] };
    });
  }

  function getCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      var items = raw ? JSON.parse(raw) : [];
      return normalizeCartLines(items);
    } catch (e) {
      return [];
    }
  }

  function saveCart(items) {
    var normalized = normalizeCartLines(items);
    localStorage.setItem(CART_KEY, JSON.stringify(normalized));
    updateCartCountUI();
    updateShopCardsUI();
  }

  function getCartQty(productId) {
    var cart = getCart();
    var line = cart.find(function (item) {
      return item.id === productId;
    });
    return line ? line.qty || 1 : 0;
  }

  var shopModalOpenProductId = null;

  function shopImageFallback(img) {
    if (!img) {
      return;
    }
    img.onerror = null;
    img.classList.add("is-fallback");
    img.removeAttribute("src");
    img.hidden = true;
    var parent = img.parentElement;
    var fallback =
      parent &&
      parent.querySelector("[data-shop-img-fallback]");
    if (fallback) {
      fallback.hidden = false;
    }
  }

  function setShopProductImage(img, fallback, product) {
    if (!product) {
      return;
    }
    if (fallback) {
      var icon = fallback.querySelector(".shop-photo-placeholder-icon");
      if (icon) {
        icon.textContent = product.emoji || "📻";
      } else {
        fallback.textContent = product.emoji || "📻";
      }
      fallback.hidden = true;
    }
    if (!img) {
      if (fallback) {
        fallback.hidden = false;
      }
      return;
    }
    img.classList.remove("is-fallback");
    img.hidden = false;
    img.alt = product.name;
    img.onerror = function () {
      shopImageFallback(img);
    };
    if (product.image) {
      img.src = product.image;
    } else {
      shopImageFallback(img);
    }
  }

  function updateShopCardsUI() {
    document.querySelectorAll(".shop-card-actions").forEach(function (wrap) {
      var productId = wrap.getAttribute("data-product-id");
      if (!productId) {
        return;
      }
      var qty = getCartQty(productId);
      var addBtn = wrap.querySelector(".shop-add-btn");
      var stepper = wrap.querySelector(".shop-qty-stepper");
      var label = wrap.querySelector(".shop-qty-label");
      if (!addBtn || !stepper) {
        return;
      }
      if (qty > 0) {
        addBtn.hidden = true;
        addBtn.classList.add("is-hidden");
        stepper.hidden = false;
        stepper.classList.remove("is-hidden");
        if (label) {
          label.textContent = qty + " шт.";
        }
      } else {
        addBtn.hidden = false;
        addBtn.classList.remove("is-hidden");
        stepper.hidden = true;
        stepper.classList.add("is-hidden");
      }
    });
    renderShopProductModalActions();
  }

  function renderShopProductModalActions() {
    var actions = document.getElementById("shopProductActions");
    if (!actions || !shopModalOpenProductId) {
      return;
    }
    var productId = shopModalOpenProductId;
    var product = SHOP_PRODUCTS[productId];
    if (!product) {
      return;
    }
    actions.innerHTML = "";
    var qty = getCartQty(productId);

    function bindStepper(wrap) {
      wrap.querySelectorAll(".shop-qty-btn").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var action = btn.getAttribute("data-action");
          if (action === "inc") {
            pulseCartIcon();
          }
          setCartLineQty(productId, action === "inc" ? 1 : -1);
        });
      });
    }

    if (qty > 0) {
      var stepper = document.createElement("div");
      stepper.className = "shop-qty-stepper shop-qty-stepper--modal";
      stepper.innerHTML =
        '<button type="button" class="shop-qty-btn" data-action="dec" aria-label="Уменьшить">−</button>' +
        '<span class="shop-qty-label">' +
        qty +
        " шт.</span>" +
        '<button type="button" class="shop-qty-btn" data-action="inc" aria-label="Увеличить">+</button>';
      bindStepper(stepper);
      actions.appendChild(stepper);
      return;
    }

    var addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "btn-auth-submit shop-modal-add-btn";
    addBtn.textContent = "Добавить в корзину";
    addBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var visual = document.getElementById("shopProductVisual");
      addProductToCart(productId, { pulse: false });
      flyToCart(visual || addBtn, product.emoji);
      pulseCartIcon();
      renderShopProductModalActions();
    });
    actions.appendChild(addBtn);
  }

  function openShopProductModal(productId) {
    var modal = document.getElementById("shopProductModal");
    var product = SHOP_PRODUCTS[productId];
    if (!modal || !product) {
      return;
    }
    shopModalOpenProductId = productId;
    var imgEl = document.getElementById("shopProductImg");
    var fallbackEl = document.getElementById("shopProductEmojiFallback");
    var titleEl = document.getElementById("shopProductTitle");
    var priceEl = document.getElementById("shopProductPrice");
    var specsEl = document.getElementById("shopProductSpecs");
    var descEl = document.getElementById("shopProductDesc");
    setShopProductImage(imgEl, fallbackEl, product);
    if (titleEl) {
      titleEl.textContent = product.name;
    }
    if (priceEl) {
      priceEl.textContent = product.price.toLocaleString("ru-RU") + " ₽";
    }
    if (specsEl) {
      specsEl.innerHTML = "";
      (product.specs || []).forEach(function (line) {
        var li = document.createElement("li");
        li.textContent = line;
        specsEl.appendChild(li);
      });
    }
    if (descEl) {
      descEl.textContent = product.longDescription || product.description || "";
    }
    renderShopProductModalActions();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("shop-product-modal-open");
  }

  function closeShopProductModal() {
    var modal = document.getElementById("shopProductModal");
    if (!modal) {
      return;
    }
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("shop-product-modal-open");
    shopModalOpenProductId = null;
  }

  function initShopProductModal() {
    var modal = document.getElementById("shopProductModal");
    if (!modal) {
      return;
    }
    var closeBtn = document.getElementById("shopProductClose");
    var backdrop = document.getElementById("shopProductBackdrop");

    document.querySelectorAll("#shop .shop-card--premium").forEach(function (card) {
      var productId = card.getAttribute("data-product-id");
      if (productId && !SHOP_PRODUCTS[productId]) {
        card.classList.add("shop-card--invalid");
        return;
      }
      card.addEventListener("click", function (e) {
        if (e.target.closest(".shop-card-actions")) {
          return;
        }
        if (productId) {
          openShopProductModal(productId);
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeShopProductModal);
    }
    if (backdrop) {
      backdrop.addEventListener("click", closeShopProductModal);
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeShopProductModal();
      }
    });
  }

  function cartItemsCount(items) {
    items = items || getCart();
    return items.reduce(function (sum, line) {
      return sum + (line.qty || 1);
    }, 0);
  }

  function cartTotalPrice(items) {
    items = items || getCart();
    return items.reduce(function (sum, line) {
      var product = SHOP_PRODUCTS[line.id];
      if (!product) {
        return sum;
      }
      return sum + product.price * (line.qty || 1);
    }, 0);
  }

  function addProductToCart(productId, options) {
    options = options || {};
    var product = SHOP_PRODUCTS[productId];
    if (!product) {
      return;
    }
    var cart = getCart();
    var existing = cart.find(function (line) {
      return line.id === productId;
    });
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ id: productId, qty: 1 });
    }
    saveCart(cart);
    if (options.pulse !== false) {
      pulseCartIcon();
    }
    if (options.silent !== true) {
      showAuthToast("Добавлено в корзину: " + product.name);
    }
  }

  function pulseCartIcon() {
    var cartBtn = document.getElementById("btnCartOpen");
    if (!cartBtn) {
      return;
    }
    cartBtn.classList.remove("cart-pulse");
    void cartBtn.offsetWidth;
    cartBtn.classList.add("cart-pulse");
  }

  function flyToCart(sourceEl, emoji) {
    var cartBtn = document.getElementById("btnCartOpen");
    if (!sourceEl || !cartBtn || !("animate" in document.documentElement)) {
      return;
    }
    var start = sourceEl.getBoundingClientRect();
    var end = cartBtn.getBoundingClientRect();
    var fly = document.createElement("span");
    fly.className = "shop-fly-particle";
    fly.textContent = emoji || "●";
    fly.style.left = start.left + start.width / 2 + "px";
    fly.style.top = start.top + start.height / 2 + "px";
    document.body.appendChild(fly);
    var dx = end.left + end.width / 2 - (start.left + start.width / 2);
    var dy = end.top + end.height / 2 - (start.top + start.height / 2);
    var midX = dx * 0.45;
    var midY = dy - Math.min(120, Math.abs(dy) + 70);
    fly
      .animate(
        [
          {
            transform: "translate(-50%, -50%) scale(1)",
            opacity: 1,
          },
          {
            transform:
              "translate(calc(-50% + " +
              midX +
              "px), calc(-50% + " +
              midY +
              "px)) scale(1.2)",
            opacity: 1,
            offset: 0.55,
          },
          {
            transform:
              "translate(calc(-50% + " +
              dx +
              "px), calc(-50% + " +
              dy +
              "px)) scale(0.35)",
            opacity: 0.15,
          },
        ],
        {
          duration: 680,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        }
      )
      .addEventListener("finish", function () {
        fly.remove();
      });
  }

  function updateCartCountUI() {
    var el = document.getElementById("cartCount");
    if (!el) {
      return;
    }
    var count = cartItemsCount();
    el.textContent = String(count);
    el.classList.toggle("is-empty", count === 0);
  }

  function openOrderContactModal() {
    var modal = document.getElementById("orderContactModal");
    if (!modal) {
      return;
    }
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeOrderContactModal() {
    var modal = document.getElementById("orderContactModal");
    if (!modal) {
      return;
    }
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  function setCartLineQty(productId, delta) {
    if (delta > 0 && !SHOP_PRODUCTS[productId]) {
      return;
    }
    var cart = getCart();
    var line = cart.find(function (item) {
      return item.id === productId;
    });
    if (!line) {
      if (delta > 0 && SHOP_PRODUCTS[productId]) {
        cart.push({ id: productId, qty: delta });
        saveCart(cart);
        renderCartModalIfOpen();
      }
      return;
    }
    line.qty = (line.qty || 1) + delta;
    if (line.qty <= 0) {
      cart = cart.filter(function (item) {
        return item.id !== productId;
      });
    }
    saveCart(cart);
    renderCartModalIfOpen();
  }

  function renderCartModalIfOpen() {
    var modal = document.getElementById("cartModal");
    if (modal && modal.classList.contains("is-open")) {
      renderCartModal();
    }
  }

  function renderCartModal() {
    var list = document.getElementById("cartList");
    var totalEl = document.getElementById("cartTotal");
    if (!list || !totalEl) {
      return;
    }
    var cart = getCart();
    list.innerHTML = "";
    if (!cart.length) {
      var empty = document.createElement("li");
      empty.className = "cart-empty";
      empty.textContent = "Корзина пуста";
      list.appendChild(empty);
    } else {
      cart.forEach(function (line) {
        var product = SHOP_PRODUCTS[line.id];
        if (!product) {
          return;
        }
        var qty = line.qty || 1;
        var lineSum = product.price * qty;

        var li = document.createElement("li");
        li.className = "cart-line";

        var info = document.createElement("div");
        info.className = "cart-line-info";
        var nameEl = document.createElement("span");
        nameEl.className = "cart-line-name";
        nameEl.textContent =
          (product.emoji ? product.emoji + " " : "") + product.name;
        var sumEl = document.createElement("span");
        sumEl.className = "cart-line-sum";
        sumEl.textContent =
          product.price.toLocaleString("ru-RU") +
          " ₽ × " +
          qty +
          " = " +
          lineSum.toLocaleString("ru-RU") +
          " ₽";
        info.appendChild(nameEl);
        info.appendChild(sumEl);

        var qtyWrap = document.createElement("div");
        qtyWrap.className = "cart-qty";
        var decBtn = document.createElement("button");
        decBtn.type = "button";
        decBtn.className = "cart-qty-btn";
        decBtn.textContent = "−";
        decBtn.setAttribute("aria-label", "Уменьшить количество");
        decBtn.addEventListener("click", function () {
          setCartLineQty(line.id, -1);
        });
        var qtyLabel = document.createElement("span");
        qtyLabel.className = "cart-qty-value";
        qtyLabel.textContent = qty + " шт.";
        var incBtn = document.createElement("button");
        incBtn.type = "button";
        incBtn.className = "cart-qty-btn";
        incBtn.textContent = "+";
        incBtn.setAttribute("aria-label", "Увеличить количество");
        incBtn.addEventListener("click", function () {
          setCartLineQty(line.id, 1);
        });
        qtyWrap.appendChild(decBtn);
        qtyWrap.appendChild(qtyLabel);
        qtyWrap.appendChild(incBtn);

        li.appendChild(info);
        li.appendChild(qtyWrap);
        list.appendChild(li);
      });
    }
    totalEl.textContent =
      "Итого: " + cartTotalPrice(cart).toLocaleString("ru-RU") + " ₽";
  }

  function showShopCardsNow(cards) {
    cards.forEach(function (card, index) {
      card.style.setProperty("--shop-stagger", String(index % 6));
      card.classList.add("is-visible");
    });
  }

  function initShopScrollReveal() {
    var shopSection = document.getElementById("shop");
    if (!shopSection) {
      return;
    }
    var shopHero = shopSection.querySelector(".shop-hero-panel.reveal");
    if (shopHero) {
      shopHero.classList.add("is-visible");
    }
    var cards = shopSection.querySelectorAll(".shop-card--premium");
    if (!cards.length) {
      return;
    }
    if (!("IntersectionObserver" in window)) {
      showShopCardsNow(cards);
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
      { threshold: 0.08, rootMargin: "0px 0px 0px 0px" }
    );
    cards.forEach(function (card, index) {
      card.style.setProperty("--shop-stagger", String(index % 6));
      observer.observe(card);
    });
    window.requestAnimationFrame(function () {
      var anyVisible = false;
      cards.forEach(function (card) {
        if (card.classList.contains("is-visible")) {
          anyVisible = true;
        }
      });
      if (!anyVisible) {
        showShopCardsNow(cards);
      }
    });
    window.setTimeout(function () {
      cards.forEach(function (card) {
        if (!card.classList.contains("is-visible")) {
          card.classList.add("is-visible");
        }
      });
    }, 900);
  }

  function initShopCardActions() {
    ensureShopProductsLoaded();
    updateShopCardsUI();
    initShopScrollReveal();

    document.querySelectorAll(".shop-card-actions").forEach(function (wrap) {
      var productId = wrap.getAttribute("data-product-id");
      if (!productId || wrap.dataset.shopBound === "1") {
        return;
      }
      if (!SHOP_PRODUCTS[productId]) {
        wrap.classList.add("shop-card-actions--invalid");
        var badBtn = wrap.querySelector(".shop-add-btn");
        if (badBtn) {
          badBtn.disabled = true;
          badBtn.textContent = "Недоступно";
        }
        return;
      }
      wrap.dataset.shopBound = "1";

      var addBtn = wrap.querySelector(".shop-add-btn");
      if (addBtn) {
        addBtn.addEventListener("click", function (e) {
          e.preventDefault();
          if (!SHOP_PRODUCTS[productId]) {
            return;
          }
          if (getCartQty(productId) === 0) {
            var card = wrap.closest(".shop-card");
            var product = SHOP_PRODUCTS[productId];
            var media = card && card.querySelector(".shop-card-media");
            var emoji =
              (card && card.getAttribute("data-shop-emoji")) ||
              (product && product.emoji);
            addProductToCart(productId, { pulse: false });
            flyToCart(media || addBtn, emoji);
            pulseCartIcon();
          }
        });
      }

      wrap.querySelectorAll(".shop-qty-btn").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          var action = btn.getAttribute("data-action");
          var delta = action === "inc" ? 1 : -1;
          if (action === "inc") {
            pulseCartIcon();
          }
          setCartLineQty(productId, delta);
        });
      });
    });
  }

  function initCart() {
    ensureShopProductsLoaded();
    var openBtn = document.getElementById("btnCartOpen");
    var modal = document.getElementById("cartModal");
    var closeBtn = document.getElementById("cartModalClose");
    var backdrop = document.getElementById("cartModalBackdrop");
    var checkout = document.getElementById("cartCheckoutBtn");
    var orderClose = document.getElementById("orderContactClose");
    var orderBackdrop = document.getElementById("orderContactBackdrop");
    var orderOk = document.getElementById("orderContactOk");

    updateCartCountUI();
    initShopCardActions();
    initShopProductModal();

    function openCart() {
      if (!modal) {
        return;
      }
      renderCartModal();
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    }

    function closeCart() {
      if (!modal) {
        return;
      }
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }

    if (openBtn) {
      openBtn.addEventListener("click", openCart);
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", closeCart);
    }
    if (backdrop) {
      backdrop.addEventListener("click", closeCart);
    }
    if (checkout) {
      checkout.addEventListener("click", function () {
        closeCart();
        openOrderContactModal();
      });
    }
    if (orderClose) {
      orderClose.addEventListener("click", closeOrderContactModal);
    }
    if (orderBackdrop) {
      orderBackdrop.addEventListener("click", closeOrderContactModal);
    }
    if (orderOk) {
      orderOk.addEventListener("click", closeOrderContactModal);
    }
  }

  function initAirPlayer() {
    var airAudio = document.getElementById("airGlobalAudio");
    if (!airAudio) {
      airAudio = document.createElement("audio");
      airAudio.id = "airGlobalAudio";
      airAudio.preload = "metadata";
      document.body.appendChild(airAudio);
    }
    var activeBtn = null;

    document.querySelectorAll(".air-play-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var src = btn.getAttribute("data-src");
        if (!src) {
          return;
        }
        if (activeBtn && activeBtn !== btn) {
          activeBtn.classList.remove("is-playing");
          activeBtn.textContent = "▶ Play";
        }
        if (btn.classList.contains("is-playing")) {
          airAudio.pause();
          btn.classList.remove("is-playing");
          btn.textContent = "▶ Play";
          activeBtn = null;
          return;
        }
        airAudio.src = src;
        airAudio
          .play()
          .then(function () {
            btn.classList.add("is-playing");
            btn.textContent = "⏸ Pause";
            activeBtn = btn;
            unlockAchievement("listener");
          })
          .catch(function () {
            showAuthToast("Не удалось воспроизвести аудио", true);
          });
      });
    });

    airAudio.addEventListener("ended", function () {
      if (activeBtn) {
        activeBtn.classList.remove("is-playing");
        activeBtn.textContent = "▶ Play";
        activeBtn = null;
      }
    });
  }

  function showAuthToast(message, isError) {
    var toast = document.getElementById("authToast");
    if (!toast) {
      return;
    }
    toast.textContent = message;
    toast.classList.toggle("auth-toast--error", Boolean(isError));
    toast.classList.add("is-visible");
    setTimeout(function () {
      toast.classList.remove("is-visible");
      toast.classList.remove("auth-toast--error");
    }, 2800);
  }

  function updateAuthHeader() {
    var btnOpen = document.getElementById("btnAuthOpen");
    var userBlock = document.getElementById("headerAuthUser");
    var greeting = document.getElementById("headerAuthGreeting");
    if (!btnOpen || !userBlock || !greeting) {
      return;
    }
    var session = getSession();
    if (session && session.name) {
      btnOpen.hidden = true;
      btnOpen.style.display = "none";
      userBlock.hidden = false;
      userBlock.classList.remove("is-hidden");
      greeting.textContent =
        "Привет, " + session.name + " " + getUserAvatar(session);
    } else {
      btnOpen.hidden = false;
      btnOpen.style.display = "";
      userBlock.hidden = true;
      userBlock.classList.add("is-hidden");
    }
  }

  function initAuth() {
    var modal = document.getElementById("authModal");
    var btnOpen = document.getElementById("btnAuthOpen");
    var btnLogout = document.getElementById("btnAuthLogout");
    var btnClose = document.getElementById("authModalClose");
    var backdrop = document.getElementById("authModalBackdrop");
    var loginForm = document.getElementById("authLoginForm");
    var registerForm = document.getElementById("authRegisterForm");
    if (!modal || !btnOpen) {
      return;
    }

    function openModal() {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("auth-modal-open");
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("auth-modal-open");
    }

    btnOpen.addEventListener("click", openModal);
    if (btnClose) {
      btnClose.addEventListener("click", closeModal);
    }
    if (backdrop) {
      backdrop.addEventListener("click", closeModal);
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });

    modal.querySelectorAll(".auth-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-auth-tab");
        modal.querySelectorAll(".auth-tab").forEach(function (t) {
          var active = t.getAttribute("data-auth-tab") === target;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", active ? "true" : "false");
        });
        modal.querySelectorAll(".auth-panel").forEach(function (panel) {
          var show = panel.getAttribute("data-auth-panel") === target;
          panel.classList.toggle("is-active", show);
          panel.hidden = !show;
        });
      });
    });

    function bindInputClearErrors(form) {
      if (!form) {
        return;
      }
      form.querySelectorAll(".auth-input").forEach(function (input) {
        input.addEventListener("input", function () {
          input.classList.remove("auth-input--error");
        });
      });
    }

    bindInputClearErrors(loginForm);
    bindInputClearErrors(registerForm);

    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var emailInput = document.getElementById("loginEmail");
        var passInput = document.getElementById("loginPass");
        var email = normalizeEmail(emailInput && emailInput.value);
        var password = passInput ? passInput.value : "";
        var users = getUsers();
        var user = users.find(function (u) {
          return normalizeEmail(u.email || u.login) === email;
        });
        if (!user) {
          user = users.find(function (u) {
            return (
              !u.email &&
              normalizeLogin(u.login || u.name) === normalizeLogin(email)
            );
          });
        }
        if (!user || user.password !== password) {
          if (emailInput) {
            emailInput.classList.add("auth-input--error");
          }
          if (passInput) {
            passInput.classList.add("auth-input--error");
          }
          showAuthToast("Неверный email или пароль", true);
          return;
        }
        setSession({
          name: user.name,
          login: user.login || normalizeLogin(user.email || email),
          email: user.email || email,
          avatar: getUserAvatar(user),
        });
        closeModal();
        updateAuthHeader();
        showAuthToast("Успешный вход!");
        loginForm.reset();
      });
    }

    if (registerForm) {
      registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var nameEl = document.getElementById("regName");
        var emailEl = document.getElementById("regEmail");
        var passEl = document.getElementById("regPass");
        var name = nameEl ? String(nameEl.value).trim() : "";
        var email = normalizeEmail(emailEl && emailEl.value);
        var password = passEl ? passEl.value : "";
        var avatarInput = document.querySelector('input[name="regAvatar"]:checked');
        var avatar = avatarInput ? avatarInput.value : "📻";
        if (!name || !email || password.length < 4) {
          showAuthToast("Заполните имя, email и пароль (от 4 символов)", true);
          return;
        }
        var users = getUsers();
        if (
          users.some(function (u) {
            return normalizeEmail(u.email || u.login) === email;
          })
        ) {
          showAuthToast("Пользователь с таким email уже есть", true);
          if (emailEl) {
            emailEl.classList.add("auth-input--error");
          }
          return;
        }
        var login = email;
        users.push({
          name: name,
          email: email,
          login: login,
          password: password,
          avatar: avatar,
          registeredAt: new Date().toISOString(),
        });
        saveUsers(users);
        setSession({ name: name, login: login, email: email, avatar: avatar });
        closeModal();
        updateAuthHeader();
        showAuthToast("Регистрация успешна! Вы вошли в систему.");
        registerForm.reset();
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener("click", function () {
        setSession(null);
        updateAuthHeader();
        showAuthToast("Вы вышли из аккаунта");
      });
    }

    updateAuthHeader();
  }

  function profileDataKey(login) {
    return "sdr_lab_profile_" + login;
  }

  function achievementsKey(login) {
    return "sdr_lab_achievements_" + login;
  }

  function getProfileData(login) {
    var defaults = {
      equipment: { hackrf: false, spider: false, magloop: false },
      favorites: ["120.3 МГц — Авиация", "145.5 МГц — Любительский диапазон"],
    };
    try {
      var raw = localStorage.getItem(profileDataKey(login));
      if (!raw) {
        return defaults;
      }
      var data = JSON.parse(raw);
      return {
        equipment: Object.assign({}, defaults.equipment, data.equipment || {}),
        favorites: Array.isArray(data.favorites) ? data.favorites : defaults.favorites,
      };
    } catch (e) {
      return defaults;
    }
  }

  function saveProfileData(login, data) {
    localStorage.setItem(profileDataKey(login), JSON.stringify(data));
  }

  function getAchievements(login) {
    try {
      var raw = localStorage.getItem(achievementsKey(login));
      var ach = raw ? JSON.parse(raw) : {};
      return {
        listener: Boolean(ach.listener || ach.player),
        engineer: Boolean(ach.engineer || ach.calculator),
        cartographer: Boolean(ach.cartographer || ach.scanner),
      };
    } catch (e) {
      return {};
    }
  }

  function saveAchievements(login, ach) {
    localStorage.setItem(achievementsKey(login), JSON.stringify(ach));
  }

  function getUserRegisteredAt(login) {
    var users = getUsers();
    var user = users.find(function (u) {
      return normalizeLogin(u.login || u.name) === normalizeLogin(login);
    });
    return user && user.registeredAt ? user.registeredAt : null;
  }

  function formatRegisterDate(iso) {
    if (!iso) {
      return "—";
    }
    try {
      return new Date(iso).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return "—";
    }
  }

  function avatarInitials(name) {
    var parts = String(name || "SDR")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) {
      return "SDR";
    }
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function unlockAchievement(id) {
    var session = getSession();
    if (!session || !session.login) {
      return;
    }
    var ach = getAchievements(session.login);
    if (ach[id]) {
      return;
    }
    ach[id] = true;
    saveAchievements(session.login, ach);
    if (typeof window.SDR_LAB_onAchievementUnlocked === "function") {
      window.SDR_LAB_onAchievementUnlocked(id);
    }
    refreshProfileCabinetUI();
  }

  window.SDR_LAB = {
    unlockAchievement: unlockAchievement,
    shopImageFallback: shopImageFallback,
    refreshProfileCabinetUI: function () {
      refreshProfileCabinetUI();
    },
  };

  function refreshProfileCabinetUI() {
    var cabinet = document.getElementById("profileCabinet");
    if (!cabinet || !cabinet.classList.contains("is-open")) {
      updateAchievementBadgesInDom();
      return;
    }
    renderProfileCabinet();
  }

  function updateAchievementBadgesInDom() {
    var session = getSession();
    if (!session || !session.login) {
      return;
    }
    var ach = getAchievements(session.login);
    document.querySelectorAll(".profile-achievement[data-achievement]").forEach(function (el) {
      var id = el.getAttribute("data-achievement");
      el.classList.toggle("is-unlocked", Boolean(ach[id]));
    });
  }

  function renderProfileCabinet() {
    var session = getSession();
    if (!session || !session.login) {
      return;
    }
    var data = getProfileData(session.login);
    var nameEl = document.getElementById("profileName");
    var sinceEl = document.getElementById("profileSince");
    var avatarEl = document.getElementById("profileAvatar");
    if (nameEl) {
      nameEl.textContent = session.name || session.login;
    }
    if (sinceEl) {
      sinceEl.textContent =
        "В эфире с: " + formatRegisterDate(getUserRegisteredAt(session.login));
    }
    if (avatarEl) {
      avatarEl.textContent = getUserAvatar(session);
      avatarEl.classList.add("profile-avatar--emoji");
    }

    ["hackrf", "spider", "magloop"].forEach(function (key) {
      var idMap = { hackrf: "equipHackrf", spider: "equipSpider", magloop: "equipMagloop" };
      var input = document.getElementById(idMap[key]);
      if (input) {
        input.checked = Boolean(data.equipment[key]);
      }
    });

    var list = document.getElementById("profileFreqList");
    if (list) {
      list.innerHTML = "";
      data.favorites.forEach(function (item, index) {
        var li = document.createElement("li");
        li.className = "profile-freq-item";
        li.textContent = item;
        var rm = document.createElement("button");
        rm.type = "button";
        rm.className = "profile-freq-remove";
        rm.setAttribute("aria-label", "Удалить");
        rm.textContent = "×";
        rm.addEventListener("click", function () {
          var sessionNow = getSession();
          if (!sessionNow) {
            return;
          }
          var d = getProfileData(sessionNow.login);
          d.favorites.splice(index, 1);
          saveProfileData(sessionNow.login, d);
          renderProfileCabinet();
        });
        li.appendChild(rm);
        list.appendChild(li);
      });
    }

    updateAchievementBadgesInDom();
  }

  function openProfileCabinet() {
    var session = getSession();
    if (!session) {
      showAuthToast("Сначала войдите в аккаунт", true);
      return;
    }
    var cabinet = document.getElementById("profileCabinet");
    if (!cabinet) {
      return;
    }
    renderProfileCabinet();
    cabinet.classList.add("is-open");
    cabinet.setAttribute("aria-hidden", "false");
    document.body.classList.add("profile-cabinet-open");
  }

  function closeProfileCabinet() {
    var cabinet = document.getElementById("profileCabinet");
    if (!cabinet) {
      return;
    }
    cabinet.classList.remove("is-open");
    cabinet.setAttribute("aria-hidden", "true");
    document.body.classList.remove("profile-cabinet-open");
  }

  function initProfileCabinet() {
    var greeting = document.getElementById("headerAuthGreeting");
    var closeBtn = document.getElementById("profileCabinetClose");
    var backdrop = document.getElementById("profileCabinetBackdrop");
    var freqForm = document.getElementById("profileFreqForm");
    var profileLogout = document.getElementById("profileLogout");
    if (greeting) {
      greeting.addEventListener("click", openProfileCabinet);
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", closeProfileCabinet);
    }
    if (backdrop) {
      backdrop.addEventListener("click", closeProfileCabinet);
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("profile-cabinet-open")) {
        closeProfileCabinet();
      }
    });

    document.querySelectorAll(".profile-equipment input[type=checkbox]").forEach(function (input) {
      input.addEventListener("change", function () {
        var session = getSession();
        if (!session) {
          return;
        }
        var data = getProfileData(session.login);
        var key = input.getAttribute("data-equip");
        if (key) {
          data.equipment[key] = input.checked;
          saveProfileData(session.login, data);
        }
      });
    });

    if (freqForm) {
      freqForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var session = getSession();
        var input = document.getElementById("profileFreqInput");
        if (!session || !input) {
          return;
        }
        var text = String(input.value).trim();
        if (!text) {
          return;
        }
        var data = getProfileData(session.login);
        if (data.favorites.indexOf(text) === -1) {
          data.favorites.push(text);
          saveProfileData(session.login, data);
        }
        input.value = "";
        renderProfileCabinet();
        showAuthToast("Частота добавлена в избранное");
      });
    }

    if (profileLogout) {
      profileLogout.addEventListener("click", function () {
        setSession(null);
        closeProfileCabinet();
        updateAuthHeader();
        showAuthToast("Вы вышли из аккаунта");
      });
    }

    window.SDR_LAB_onAchievementUnlocked = updateAchievementBadgesInDom;
    updateAchievementBadgesInDom();
  }

  initActiveNav();
  initMobileNav();
  initTypewriter();
  initReveal();
  initTiltCards();
  initScannerTerminal();
  initGalleryLightbox();
  initClockAndWeather();
  initAuth();
  initProfileCabinet();
  var CHAT_INBOX_KEY = "sdr_lab_chat_inbox";

  function initMiniChat() {
    var fab = document.getElementById("miniChatFab");
    var panel = document.getElementById("miniChatPanel");
    var closeBtn = document.getElementById("miniChatClose");
    var form = document.getElementById("miniChatForm");
    if (!fab || !panel || !form) {
      return;
    }

    function setOpen(open) {
      panel.classList.toggle("is-open", open);
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      fab.setAttribute("aria-expanded", open ? "true" : "false");
    }

    fab.addEventListener("click", function () {
      setOpen(!panel.classList.contains("is-open"));
    });
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        setOpen(false);
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameInput = document.getElementById("miniChatName");
      var msgInput = document.getElementById("miniChatMsg");
      if (!nameInput || !msgInput) {
        return;
      }
      var name = nameInput.value.trim();
      var message = msgInput.value.trim();
      if (!name || !message) {
        return;
      }
      var inbox = [];
      try {
        var raw = localStorage.getItem(CHAT_INBOX_KEY);
        inbox = raw ? JSON.parse(raw) : [];
      } catch (err) {
        inbox = [];
      }
      inbox.push({
        name: name,
        message: message,
        at: new Date().toISOString(),
      });
      localStorage.setItem(CHAT_INBOX_KEY, JSON.stringify(inbox));
      form.reset();
      setOpen(false);
      showAuthToast("Отправлено!");
    });
  }

  function initMorseGenerator() {
    var input = document.getElementById("morseInput");
    var btn = document.getElementById("morseTransmitBtn");
    var lamp = document.getElementById("morseLamp");
    var preview = document.getElementById("morsePreview");
    if (!input || !btn || !lamp) {
      return;
    }

    var MORSE_MAP = {
      A: ".-",
      B: "-...",
      C: "-.-.",
      D: "-..",
      E: ".",
      F: "..-.",
      G: "--.",
      H: "....",
      I: "..",
      J: ".---",
      K: "-.-",
      L: ".-..",
      M: "--",
      N: "-.",
      O: "---",
      P: ".--.",
      Q: "--.-",
      R: ".-.",
      S: "...",
      T: "-",
      U: "..-",
      V: "...-",
      W: ".--",
      X: "-..-",
      Y: "-.--",
      Z: "--..",
      "0": "-----",
      "1": ".----",
      "2": "..---",
      "3": "...--",
      "4": "....-",
      "5": ".....",
      "6": "-....",
      "7": "--...",
      "8": "---..",
      "9": "----.",
    };

    var TX = {
      dit: 1000,
      dah: 3000,
      letterGap: 1000,
      wordGap: 3000,
      symbolGap: 1000,
    };

    var audioCtx = null;
    var txState = { cancelled: false, timer: null, activeOsc: null };

    function stopActiveOsc() {
      if (txState.activeOsc) {
        try {
          txState.activeOsc.stop();
          txState.activeOsc.disconnect();
        } catch (e) {
          /* already stopped */
        }
        txState.activeOsc = null;
      }
    }

    function clearTxTimer() {
      if (txState.timer) {
        clearTimeout(txState.timer);
        txState.timer = null;
      }
    }

    function cancelTransmission() {
      txState.cancelled = true;
      clearTxTimer();
      stopActiveOsc();
      lamp.classList.remove("is-on");
    }

    function setLamp(on) {
      lamp.classList.toggle("is-on", on);
    }

    function ensureAudioContext() {
      if (!audioCtx) {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) {
          return null;
        }
        audioCtx = new Ctx();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function startTone(durationMs) {
      var ctx = ensureAudioContext();
      if (!ctx || txState.cancelled) {
        return;
      }
      stopActiveOsc();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 600;
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      var start = ctx.currentTime;
      var end = start + durationMs / 1000;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.22, start + 0.02);
      gain.gain.setValueAtTime(0.22, end - 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.start(start);
      osc.stop(end + 0.01);
      txState.activeOsc = osc;
    }

    function waitMs(ms) {
      return new Promise(function (resolve) {
        if (txState.cancelled) {
          resolve();
          return;
        }
        clearTxTimer();
        txState.timer = setTimeout(function () {
          txState.timer = null;
          resolve();
        }, ms);
      });
    }

    function encodeTextToMorse(text) {
      var words = String(text || "")
        .toUpperCase()
        .trim()
        .split(/\s+/);
      var morseWords = [];
      words.forEach(function (word) {
        if (!word) {
          return;
        }
        var letters = [];
        for (var i = 0; i < word.length; i++) {
          var code = MORSE_MAP[word.charAt(i)];
          if (code) {
            letters.push(code);
          }
        }
        if (letters.length) {
          morseWords.push(letters.join(" "));
        }
      });
      return morseWords.join("   ");
    }

    function buildTimeline(text) {
      var timeline = [];
      var words = String(text || "")
        .toUpperCase()
        .trim()
        .split(/\s+/)
        .filter(function (w) {
          return w.length > 0;
        });
      words.forEach(function (word, wordIndex) {
        var codes = [];
        for (var i = 0; i < word.length; i++) {
          var code = MORSE_MAP[word.charAt(i)];
          if (code) {
            codes.push(code);
          }
        }
        codes.forEach(function (code, letterIndex) {
          for (var s = 0; s < code.length; s++) {
            timeline.push({
              type: code.charAt(s) === "." ? "dit" : "dah",
            });
            if (s < code.length - 1) {
              timeline.push({ type: "symbolGap" });
            }
          }
          if (letterIndex < codes.length - 1) {
            timeline.push({ type: "letterGap" });
          }
        });
        if (wordIndex < words.length - 1) {
          timeline.push({ type: "wordGap" });
        }
      });
      return timeline;
    }

    function updatePreview() {
      if (!preview) {
        return;
      }
      var encoded = encodeTextToMorse(input.value);
      preview.textContent = encoded
        ? "Код: " + encoded
        : "Введите латинские буквы или цифры (A–Z, 0–9).";
    }

    function runTimeline(timeline) {
      var index = 0;
      function step() {
        if (txState.cancelled) {
          btn.classList.remove("is-transmitting");
          btn.textContent = "Передать сигнал";
          setLamp(false);
          stopActiveOsc();
          return;
        }
        if (index >= timeline.length) {
          btn.classList.remove("is-transmitting");
          btn.textContent = "Передать сигнал";
          setLamp(false);
          stopActiveOsc();
          return;
        }
        var item = timeline[index];
        index += 1;
        if (item.type === "dit") {
          setLamp(true);
          startTone(TX.dit);
          waitMs(TX.dit).then(step);
          return;
        }
        if (item.type === "dah") {
          setLamp(true);
          startTone(TX.dah);
          waitMs(TX.dah).then(step);
          return;
        }
        setLamp(false);
        stopActiveOsc();
        if (item.type === "symbolGap") {
          waitMs(TX.symbolGap).then(step);
          return;
        }
        if (item.type === "letterGap") {
          waitMs(TX.letterGap).then(step);
          return;
        }
        if (item.type === "wordGap") {
          waitMs(TX.wordGap).then(step);
          return;
        }
        step();
      }
      step();
    }

    input.addEventListener("input", updatePreview);
    updatePreview();

    btn.addEventListener("click", function () {
      if (btn.classList.contains("is-transmitting")) {
        cancelTransmission();
        btn.classList.remove("is-transmitting");
        btn.textContent = "Передать сигнал";
        return;
      }
      var timeline = buildTimeline(input.value);
      if (!timeline.length) {
        showAuthToast("Нет символов для передачи (A–Z, 0–9).");
        updatePreview();
        return;
      }
      cancelTransmission();
      txState.cancelled = false;
      btn.classList.add("is-transmitting");
      btn.textContent = "Стоп";
      updatePreview();
      runTimeline(timeline);
    });
  }

  function initShopGotoLinks() {
    document.querySelectorAll(".btn-shop-goto").forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href") || "";
        var hashIndex = href.indexOf("#");
        if (hashIndex === -1) {
          return;
        }
        var path = href.slice(0, hashIndex) || "shop.html";
        var hash = href.slice(hashIndex + 1);
        var onShopPage =
          /shop\.html$/i.test(location.pathname) ||
          location.pathname.endsWith("/shop.html");
        var targetPath = path.replace(/^\.\//, "");
        var navigatingAway =
          targetPath &&
          !location.pathname.endsWith(targetPath) &&
          !location.pathname.endsWith("/" + targetPath);
        if (navigatingAway) {
          return;
        }
        var target = document.getElementById(hash);
        if (!target) {
          return;
        }
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    if (location.hash === "#shop") {
      var shopSection = document.getElementById("shop");
      if (shopSection) {
        window.requestAnimationFrame(function () {
          shopSection.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }
  }

  initCart();
  initAirPlayer();
  initMiniChat();
  initMorseGenerator();
  initShopGotoLinks();
})();
