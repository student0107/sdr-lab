(function () {
  "use strict";

  var form = document.getElementById("antennaCalcForm");
  var input = document.getElementById("freqInput");
  var unitSelect = document.getElementById("freqUnit");
  var result = document.getElementById("calcResult");
  if (!form || !input || !unitSelect || !result) {
    return;
  }

  function parseFrequency(value) {
    return parseFloat(String(value).replace(",", ".").trim(), 10);
  }

  function toMhz(raw, unit) {
    if (unit === "ghz") {
      return raw * 1000;
    }
    if (unit === "khz") {
      return raw / 1000;
    }
    return raw;
  }

  function formatMhzValue(mhz) {
    if (Math.abs(mhz - Math.round(mhz)) < 0.0001) {
      return String(Math.round(mhz));
    }
    return mhz.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  }

  function formatFreqLine(mhz, raw, unit) {
    var mhzText = formatMhzValue(mhz) + " МГц";
    if (unit === "ghz") {
      return raw + " ГГц (" + mhzText + ")";
    }
    if (unit === "khz") {
      return raw + " кГц (" + mhzText + ")";
    }
    return mhzText;
  }

  function formatLength(lengthCm) {
    var lengthMm = lengthCm * 10;

    if (lengthCm > 100) {
      var lengthM = lengthCm / 100;
      return (
        "Длина штыря: " +
        lengthCm.toFixed(0) +
        " см (или " +
        lengthM.toFixed(2) +
        " м)"
      );
    }

    if (lengthCm < 10) {
      return (
        "Длина штыря: " +
        lengthMm.toFixed(1) +
        " мм (или " +
        lengthCm.toFixed(2) +
        " см)"
      );
    }

    return (
      "Длина штыря: " +
      lengthCm.toFixed(2) +
      " см (или " +
      lengthMm.toFixed(1) +
      " мм)"
    );
  }

  function updatePlaceholder() {
    var unit = unitSelect.value;
    if (unit === "ghz") {
      input.placeholder = "2.4";
    } else if (unit === "khz") {
      input.placeholder = "4625";
    } else {
      input.placeholder = "433";
    }
  }

  unitSelect.addEventListener("change", updatePlaceholder);
  updatePlaceholder();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var raw = parseFrequency(input.value);
    if (!raw || raw <= 0) {
      result.textContent = "Введите корректную частоту больше нуля.";
      return;
    }

    var unit = unitSelect.value;
    var mhz = toMhz(raw, unit);
    if (!mhz || mhz <= 0) {
      result.textContent = "Введите корректную частоту больше нуля.";
      return;
    }

    var lengthCm = 7500 / mhz;
    result.textContent =
      formatLength(lengthCm) +
      ", λ/4 при " +
      formatFreqLine(mhz, raw, unit) +
      ".";
    if (window.SDR_LAB && window.SDR_LAB.unlockAchievement) {
      window.SDR_LAB.unlockAchievement("engineer");
    }
  });
})();
