(function () {
  "use strict";

  function getKey() {
    var key = window.SDR_LAB_YANDEX_API_KEY;
    if (typeof key !== "string") {
      return "";
    }
    key = key.trim();
    if (!key || key === "YOUR_YANDEX_API_KEY" || key === "ВАШ_КЛЮЧ_ЯНДЕКС_КАРТ") {
      return "";
    }
    return key;
  }

  function fail(message) {
    var mapInfo = document.getElementById("mapInfo");
    if (mapInfo) {
      mapInfo.textContent = message;
    }
    document.dispatchEvent(
      new CustomEvent("sdr-yandex-failed", { detail: { message: message } })
    );
  }

  function loadYandex(key) {
    var url =
      "https://api-maps.yandex.ru/2.1/?apikey=" +
      encodeURIComponent(key) +
      "&lang=ru_RU";
    var script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = function () {
      document.dispatchEvent(new Event("sdr-yandex-ready"));
    };
    script.onerror = function () {
      fail(
        "Не удалось загрузить Яндекс.Карты. Проверьте ключ и ограничения домена."
      );
    };
    document.head.appendChild(script);
  }

  function afterConfigLoaded() {
    var key = getKey();
    if (!key) {
      fail(
        "Карта: ключ не задан. Локально создайте map-api-config.local.js; на GitHub — Secret YANDEX_MAP_API_KEY."
      );
      return;
    }
    loadYandex(key);
  }

  function loadOptionalLocalConfig(next) {
    var localScript = document.createElement("script");
    localScript.src = "map-api-config.local.js";
    localScript.async = false;
    localScript.onload = next;
    localScript.onerror = next;
    document.head.appendChild(localScript);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      loadOptionalLocalConfig(afterConfigLoaded);
    });
  } else {
    loadOptionalLocalConfig(afterConfigLoaded);
  }
})();
