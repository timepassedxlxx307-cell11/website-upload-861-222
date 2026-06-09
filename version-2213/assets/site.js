(function () {
    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function setupMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var root = document.querySelector('[data-hero]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        start();
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));
        panels.forEach(function (panel) {
            var input = panel.querySelector('[data-search-input]');
            var typeSelect = panel.querySelector('[data-filter-type]');
            var yearSelect = panel.querySelector('[data-filter-year]');
            var genreSelect = panel.querySelector('[data-filter-genre]');
            var scope = panel.nextElementSibling && panel.nextElementSibling.hasAttribute('data-filter-scope')
                ? panel.nextElementSibling
                : document.querySelector('[data-filter-scope]');
            if (!scope) {
                scope = panel.parentElement;
            }
            var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

            function apply() {
                var query = normalize(input ? input.value : '');
                var type = normalize(typeSelect ? typeSelect.value : '');
                var year = normalize(yearSelect ? yearSelect.value : '');
                var genre = normalize(genreSelect ? genreSelect.value : '');
                cards.forEach(function (card) {
                    var text = normalize([
                        card.getAttribute('data-title'),
                        card.getAttribute('data-type'),
                        card.getAttribute('data-year'),
                        card.getAttribute('data-genre'),
                        card.getAttribute('data-region')
                    ].join(' '));
                    var ok = true;
                    if (query && text.indexOf(query) === -1) {
                        ok = false;
                    }
                    if (type && text.indexOf(type) === -1) {
                        ok = false;
                    }
                    if (year && text.indexOf(year) === -1) {
                        ok = false;
                    }
                    if (genre && text.indexOf(genre) === -1) {
                        ok = false;
                    }
                    card.classList.toggle('is-hidden', !ok);
                });
            }

            [input, typeSelect, yearSelect, genreSelect].forEach(function (control) {
                if (!control) {
                    return;
                }
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            });
        });
    }

    setupMenu();
    setupHero();
    setupFilters();
})();
