(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var toggle = document.querySelector(".nav-toggle");
        var nav = document.querySelector(".main-nav");
        if (toggle && nav) {
            toggle.addEventListener("click", function () {
                var open = nav.classList.toggle("is-open");
                toggle.setAttribute("aria-expanded", open ? "true" : "false");
            });
        }

        var slider = document.querySelector("#heroSlider");
        if (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
            var index = 0;
            var timer = null;

            function show(next) {
                if (!slides.length) {
                    return;
                }
                index = (next + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("is-active", i === index);
                });
            }

            function start() {
                window.clearInterval(timer);
                timer = window.setInterval(function () {
                    show(index + 1);
                }, 5200);
            }

            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    show(i);
                    start();
                });
            });
            start();
        }

        Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]")).forEach(function (panel) {
            var targetSelector = panel.getAttribute("data-target");
            var target = targetSelector ? document.querySelector(targetSelector) : document;
            if (!target) {
                return;
            }
            var cards = Array.prototype.slice.call(target.querySelectorAll(".movie-card, .rank-card"));
            var search = panel.querySelector("[data-search-input]");
            var filters = Array.prototype.slice.call(panel.querySelectorAll("[data-filter-key]"));

            function apply() {
                var query = search ? search.value.trim().toLowerCase() : "";
                cards.forEach(function (card) {
                    var ok = true;
                    if (query && (card.getAttribute("data-search") || "").toLowerCase().indexOf(query) === -1) {
                        ok = false;
                    }
                    filters.forEach(function (filter) {
                        var key = filter.getAttribute("data-filter-key");
                        var value = filter.value;
                        if (value && card.getAttribute("data-" + key) !== value) {
                            ok = false;
                        }
                    });
                    card.hidden = !ok;
                });
            }

            if (search) {
                search.addEventListener("input", apply);
            }
            filters.forEach(function (filter) {
                filter.addEventListener("change", apply);
            });
        });
    });
})();
