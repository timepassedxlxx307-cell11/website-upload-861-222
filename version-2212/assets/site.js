(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function setupMobileMenu() {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var active = 0;
        var timer;

        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === active);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });

        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        start();
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]"));
        panels.forEach(function (panel) {
            var input = panel.querySelector("[data-filter-input]");
            var region = panel.querySelector("[data-region-filter]");
            var year = panel.querySelector("[data-year-filter]");
            var genre = panel.querySelector("[data-genre-filter]");
            var grid = document.querySelector("[data-card-grid]");
            var empty = document.querySelector("[data-empty-state]");
            if (!grid) {
                return;
            }
            var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));

            function fillSelect(select, attr) {
                if (!select || select.options.length > 1) {
                    return;
                }
                var values = cards.map(function (card) {
                    return card.getAttribute(attr) || "";
                }).filter(Boolean).filter(function (value, index, array) {
                    return array.indexOf(value) === index;
                }).sort().reverse();
                values.forEach(function (value) {
                    var option = document.createElement("option");
                    option.value = value;
                    option.textContent = value;
                    select.appendChild(option);
                });
            }

            function applyFromUrl() {
                var params = new URLSearchParams(window.location.search);
                var q = params.get("q");
                if (q && input) {
                    input.value = q;
                }
            }

            function apply() {
                var q = input ? input.value.trim().toLowerCase() : "";
                var regionValue = region ? region.value : "";
                var yearValue = year ? year.value : "";
                var genreValue = genre ? genre.value : "";
                var visible = 0;
                cards.forEach(function (card) {
                    var searchText = card.getAttribute("data-search") || "";
                    var cardRegion = card.getAttribute("data-region") || "";
                    var cardYear = card.getAttribute("data-year") || "";
                    var cardGenre = card.getAttribute("data-genre") || "";
                    var matched = true;
                    if (q && searchText.indexOf(q) === -1) {
                        matched = false;
                    }
                    if (regionValue && cardRegion !== regionValue) {
                        matched = false;
                    }
                    if (yearValue && cardYear !== yearValue) {
                        matched = false;
                    }
                    if (genreValue && cardGenre.indexOf(genreValue) === -1) {
                        matched = false;
                    }
                    card.style.display = matched ? "" : "none";
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            fillSelect(region, "data-region");
            fillSelect(year, "data-year");
            applyFromUrl();
            [input, region, year, genre].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
            apply();
        });
    }

    window.attachMoviePlayer = function (videoId, sourceUrl) {
        var video = document.getElementById(videoId);
        if (!video) {
            return;
        }
        var button = document.querySelector('[data-player-button="' + videoId + '"]');
        var loaded = false;
        var hlsInstance = null;

        function load() {
            if (loaded) {
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(sourceUrl);
                hlsInstance.attachMedia(video);
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = sourceUrl;
            } else {
                video.src = sourceUrl;
            }
            video.controls = true;
            loaded = true;
        }

        function play() {
            load();
            if (button) {
                button.classList.add("is-hidden");
            }
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {
                    if (button) {
                        button.classList.remove("is-hidden");
                    }
                });
            }
        }

        if (button) {
            button.addEventListener("click", play);
        }
        video.addEventListener("click", function () {
            if (!loaded || video.paused) {
                play();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };

    ready(function () {
        setupMobileMenu();
        setupHero();
        setupFilters();
    });
})();
