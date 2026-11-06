# SDR_LAB

Многостраничный сайт про Software Defined Radio (SDR), RTL-SDR и HackRF One.

## Страницы

| Файл | Содержимое |
|------|------------|
| `index.html` | Hero, «Что такое SDR?», «С чего начать» |
| `antennas.html` | Антенны (аккордеон) + галерея |
| `software.html` | Приёмники, софт, антенны в магазинах (Ozon, AliExpress) |
| `calculator.html` | Калькулятор λ/4 |
| `map.html` | Яндекс.Карты 2.1 + OSM-вышки (`towers-kazan.geojson`) |

Общие: `style.css`, `script.js`. Дополнительно: `antennas.js`, `calculator.js`, `map.js` (только `map.html`).

**Ключ Яндекс.Карт:** в `map.html` замените `YOUR_YANDEX_API_KEY` в URL API на свой ключ (`lang=ru_RU`).

**Вышки OSM (Казань):** `npm run towers:kazan` → `towers-kazan.geojson` + `towers-kazan-data.js` (491+ точек из OpenStreetMap).

## Порядок создания / обновления

1. `style.css` — общие стили (шапка, логотип `#00ff41`, `.nav-active`).
2. `script.js`, `calculator.js`, `antennas.js`, `map.js`.
3. `_legacy-single-page.html` — исходник секций (если правите контент).
4. `node scripts/build-multipage.js` — генерирует пять HTML-файлов.
5. `assets/`, `towers.geojson`, `towers-data.js` — медиа и карта.

## Запуск

```powershell
cd C:\Users\User\Projects\sdr-lab
npm run serve
```

Откройте `http://localhost:…/index.html`. Карта и большой GeoJSON надёжнее через сервер.

## Тестовые вышки

```powershell
npm run towers
npm run towers:1k
```

См. также `scripts/generate-towers.js`.
