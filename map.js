/**
 * Яндекс.Карты 2.1 — map.html. Ключ: map-api-config.local.js или GitHub Secret (см. README).
 */
(function () {
  "use strict";

  var EXCLUDED_TOWER_BANDS = {
    minaret: true,
    lighting: true,
    cooling: true,
    observation: true,
    bell_tower: true,
    silo: true,
    defensive: true,
    aircraft_control: true,
  };

  function isTelecomTowerFeature(props) {
    props = props || {};
    if (props.manMade || props.towerType) {
      var mm = props.manMade;
      if (mm === "mast" || mm === "communications_tower") {
        return true;
      }
      if (mm !== "tower") {
        return false;
      }
      if (props.mobilePhone) {
        return true;
      }
      var tt = props.towerType;
      if (tt && EXCLUDED_TOWER_BANDS[tt]) {
        return false;
      }
      if (tt === "communication" || tt === "telecommunication") {
        return true;
      }
      if (props.telecom === "antenna" || props.telecom === "connection") {
        return true;
      }
      return false;
    }
    var band = String(props.band || "");
    if (EXCLUDED_TOWER_BANDS[band]) {
      return false;
    }
    if (/сотовая|mobile_phone|telecommunication/i.test(band)) {
      return true;
    }
    if (band === "communication" || band === "telecommunication") {
      return true;
    }
    if (band === "мачта (OSM)") {
      return true;
    }
    return false;
  }

  var KREMLIN_CENTER = { lat: 55.79813, lon: 49.105065 };
  var KREMLIN_EXCLUDE_RADIUS_M = 1000;

  function distanceMeters(lat1, lon1, lat2, lon2) {
    var R = 6371000;
    var toRad = function (d) {
      return (d * Math.PI) / 180;
    };
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  function isNearKremlin(lat, lon) {
    return (
      distanceMeters(KREMLIN_CENTER.lat, KREMLIN_CENTER.lon, lat, lon) <=
      KREMLIN_EXCLUDE_RADIUS_M
    );
  }

  /** Ориентиры (крупные метки); в зоне Кремля не показываем */
  var MAP_POINTS = [
    {
      title: "Международный аэропорт Казань",
      coords: [55.606389, 49.278611],
      description:
        "Авиационная ул., 21, пос. Аэропорт. Переговоры диспетчеров и бортов — диапазон ~118–136 МГц (AM).",
    },
  ];

  function bootMapApp() {
    if (typeof ymaps === "undefined") {
      return;
    }
    ymaps.ready(function () {
      initYandexMap();
    });
  }

  document.addEventListener("sdr-yandex-ready", bootMapApp);
  if (typeof ymaps !== "undefined") {
    bootMapApp();
  }

  function initYandexMap() {
    if (!document.getElementById("map")) {
      return;
    }

    if (window.SDR_LAB && window.SDR_LAB.unlockAchievement) {
      window.SDR_LAB.unlockAchievement("cartographer");
    }

    var map = new ymaps.Map(
      "map",
      {
        center: [55.796, 49.106],
        zoom: 11,
        controls: ["zoomControl", "fullscreenControl", "geolocationControl"],
      },
      {
        suppressMapOpenBlock: true,
      }
    );

    var visibleLandmarks = MAP_POINTS.filter(function (point) {
      return !isNearKremlin(point.coords[0], point.coords[1]);
    });

    visibleLandmarks.forEach(function (point) {
      var placemark = new ymaps.Placemark(
        point.coords,
        {
          balloonContentHeader: point.title,
          balloonContentBody: point.description,
          hintContent: point.title,
        },
        {
          preset: "islands#blueCircleDotIcon",
        }
      );
      placemark.events.add("click", function () {
        placemark.balloon.open();
      });
      map.geoObjects.add(placemark);
    });

    loadOsmTowers(map, visibleLandmarks.length);
  }

  function loadOsmTowers(map, landmarkCount) {
    var mapInfo = document.getElementById("mapInfo");
    if (mapInfo) {
      mapInfo.textContent = "Загрузка вышек OpenStreetMap…";
    }

    loadTowersGeoJSON()
      .then(function (payload) {
        var geojson = payload.geojson;
        var features = (geojson.features || []).filter(function (feature) {
          if (!isTelecomTowerFeature(feature.properties)) {
            return false;
          }
          var coords = feature.geometry && feature.geometry.coordinates;
          if (!coords || coords.length < 2) {
            return false;
          }
          return !isNearKremlin(coords[1], coords[0]);
        });
        if (!features.length) {
          if (mapInfo) {
            mapInfo.textContent = "Вышки OSM не найдены. Запустите: node scripts/fetch-osm-towers-kazan.js";
          }
          return;
        }

        var clusterer = new ymaps.Clusterer({
          preset: "islands#invertedDarkGreenClusterIcons",
          groupByCoordinates: false,
          clusterDisableClickZoom: false,
          clusterOpenBalloonOnClick: true,
          gridSize: 64,
        });

        var placemarks = features.map(function (feature) {
          var coords = feature.geometry && feature.geometry.coordinates;
          if (!coords || coords.length < 2) {
            return null;
          }
          var lon = coords[0];
          var lat = coords[1];
          var props = feature.properties || {};
          var title = props.name || props.id || "Мачта / вышка";
          var band = props.band || "данные OSM";
          var body =
            (props.city ? props.city + ". " : "") +
            band +
            (props.osmId ? " · OSM #" + props.osmId : "");

          return new ymaps.Placemark(
            [lat, lon],
            {
              balloonContentHeader: title,
              balloonContentBody: body,
              hintContent: title,
            },
            {
              preset: "islands#darkGreenDotIcon",
            }
          );
        }).filter(Boolean);

        clusterer.add(placemarks);
        map.geoObjects.add(clusterer);

        if (mapInfo) {
          mapInfo.textContent =
            "Вышки: " +
            features.length +
            " телеком-вышек из OpenStreetMap (район Казани)" +
            (landmarkCount ? " + " + landmarkCount + " ориентир." : ".") +
            " В радиусе 1 км от Кремля метки скрыты.";
        }
      })
      .catch(function (err) {
        console.warn("towers-kazan.geojson:", err);
        if (mapInfo) {
          mapInfo.textContent =
            "Не удалось загрузить вышки. Положите towers-kazan.geojson в корень или выполните npm run serve.";
        }
      });
  }

  function loadTowersGeoJSON() {
    var inline = window.SDR_LAB_TOWERS_KAZAN;
    var inlineOk =
      inline &&
      inline.type === "FeatureCollection" &&
      Array.isArray(inline.features) &&
      inline.features.length > 0;

    if (window.location.protocol === "file:" && inlineOk) {
      return Promise.resolve({ geojson: inline, source: "inline" });
    }

    var geoUrl = new URL("towers-kazan.geojson", window.location.href).href;
    return fetch(geoUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }
        return response.json();
      })
      .then(function (geojson) {
        return { geojson: geojson, source: "fetch" };
      })
      .catch(function (err) {
        if (inlineOk) {
          return { geojson: inline, source: "inline-fallback" };
        }
        throw err;
      });
  }
})();
