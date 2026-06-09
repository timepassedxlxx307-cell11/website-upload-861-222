(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMobileNav() {
    var button = document.querySelector("[data-mobile-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function play() {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function reset() {
      if (timer) {
        window.clearInterval(timer);
      }
      play();
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        reset();
      });
    });

    play();
  }

  function setupFilters() {
    var toolbars = Array.prototype.slice.call(document.querySelectorAll("[data-filter-toolbar]"));
    toolbars.forEach(function (toolbar) {
      var section = toolbar.closest("section") || document;
      var cards = Array.prototype.slice.call(section.querySelectorAll("[data-movie-card]"));
      var search = toolbar.querySelector("[data-filter-search]");
      var region = toolbar.querySelector("[data-filter-region]");
      var type = toolbar.querySelector("[data-filter-type]");
      var year = toolbar.querySelector("[data-filter-year]");
      var count = toolbar.querySelector("[data-filter-count]");

      function includes(value, query) {
        return String(value || "").toLowerCase().indexOf(String(query || "").toLowerCase()) !== -1;
      }

      function apply() {
        var q = search ? search.value.trim().toLowerCase() : "";
        var r = region ? region.value : "";
        var t = type ? type.value : "";
        var y = year ? year.value : "";
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year,
            card.dataset.genre,
            card.dataset.tags,
            card.dataset.category
          ].join(" ").toLowerCase();
          var ok = true;
          ok = ok && (!q || includes(haystack, q));
          ok = ok && (!r || card.dataset.region === r);
          ok = ok && (!t || card.dataset.type === t);
          ok = ok && (!y || card.dataset.year === y);
          card.classList.toggle("is-filter-hidden", !ok);
          if (ok) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = visible + " 部";
        }
      }

      [search, region, type, year].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });

      apply();
    });
  }

  ready(function () {
    setupMobileNav();
    setupHero();
    setupFilters();
  });
})();
