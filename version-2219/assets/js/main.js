(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector(".menu-toggle");
        var panel = document.querySelector(".mobile-panel");

        if (toggle && panel) {
            toggle.addEventListener("click", function () {
                var open = panel.classList.toggle("is-open");
                toggle.setAttribute("aria-expanded", open ? "true" : "false");
                toggle.textContent = open ? "×" : "☰";
            });
        }

        var hero = document.querySelector(".hero");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
            var index = 0;

            function show(next) {
                index = (next + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("is-active", i === index);
                });
            }

            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    show(i);
                });
            });

            if (slides.length > 1) {
                window.setInterval(function () {
                    show(index + 1);
                }, 5000);
            }
        }

        var searchInput = document.querySelector("#movieSearchInput");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search]"));
        var empty = document.querySelector(".empty-result");

        if (searchInput && cards.length) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get("q") || "";
            searchInput.value = q;

            function filter() {
                var keyword = searchInput.value.trim().toLowerCase();
                var shown = 0;
                cards.forEach(function (card) {
                    var ok = !keyword || card.getAttribute("data-search").toLowerCase().indexOf(keyword) !== -1;
                    card.style.display = ok ? "" : "none";
                    if (ok) {
                        shown += 1;
                    }
                });
                if (empty) {
                    empty.style.display = shown ? "none" : "block";
                }
            }

            searchInput.addEventListener("input", filter);
            filter();
        }
    });
}());
