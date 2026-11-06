(function () {
  "use strict";

  var root = document.getElementById("antennaAccordion");
  if (!root) {
    return;
  }

  root.querySelectorAll(".antenna-acc-item").forEach(function (item) {
    var trigger = item.querySelector(".antenna-acc-trigger");
    if (!trigger) {
      return;
    }
    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      root.querySelectorAll(".antenna-acc-item.open").forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove("open");
          var t = openItem.querySelector(".antenna-acc-trigger");
          if (t) {
            t.setAttribute("aria-expanded", "false");
          }
        }
      });
      item.classList.toggle("open", !isOpen);
      trigger.setAttribute("aria-expanded", !isOpen ? "true" : "false");
    });
  });
})();
