(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupMenu() {
    var button = qs('[data-menu-button]');
    var panel = qs('[data-mobile-panel]');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  function setupHero() {
    var hero = qs('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = qsa('[data-hero-slide]', hero);
    var dots = qsa('[data-hero-dot]', hero);
    var prev = qs('[data-hero-prev]', hero);
    var next = qs('[data-hero-next]', hero);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        restart();
      });
    });

    show(0);
    restart();
  }

  function setupNavigationSearch() {
    qsa('[data-nav-search]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = qs('input[name="q"]', form);
        var query = input ? input.value.trim() : '';
        if (!query) {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        var root = form.getAttribute('data-root') || './';
        window.location.href = root + 'search.html?q=' + encodeURIComponent(query);
      });
    });
  }

  function setupFilters() {
    qsa('[data-filter-area]').forEach(function (area) {
      var input = qs('[data-filter-input]', area);
      var select = qs('[data-filter-select]', area);
      var grid = area.parentElement ? qs('[data-card-grid]', area.parentElement) : null;
      var cards = grid ? qsa('[data-movie-card]', grid) : [];
      if (!cards.length) {
        return;
      }

      function apply() {
        var keyword = normalize(input ? input.value : '');
        var year = select ? select.value : '';
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute('data-search') || card.textContent);
          var cardYear = card.getAttribute('data-year') || '';
          var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchYear = !year || cardYear === year;
          card.classList.toggle('is-hidden', !(matchKeyword && matchYear));
        });
      }

      if (input) {
        input.addEventListener('input', apply);
      }
      if (select) {
        select.addEventListener('change', apply);
      }

      var params = new URLSearchParams(window.location.search);
      var query = params.get('q');
      if (query && input) {
        input.value = query;
      }
      apply();
    });
  }

  function setupBackTop() {
    var button = qs('[data-back-top]');
    if (!button) {
      return;
    }
    function update() {
      button.classList.toggle('visible', window.scrollY > 500);
    }
    window.addEventListener('scroll', update, { passive: true });
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupNavigationSearch();
    setupFilters();
    setupBackTop();
  });
})();
