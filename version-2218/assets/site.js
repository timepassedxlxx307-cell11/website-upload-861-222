(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function escapeText(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getQuery(name) {
        return new URLSearchParams(window.location.search).get(name) || "";
    }

    function setupNavigation() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-main-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        if (!slides.length) {
            return;
        }
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
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
            });
        });
        window.setInterval(function () {
            show(index + 1);
        }, 5000);
    }

    function setupLocalFilter() {
        var input = document.querySelector("[data-filter-input]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
        if (!input || !cards.length) {
            return;
        }
        input.addEventListener("input", function () {
            var query = input.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var text = (card.getAttribute("data-filter") || "").toLowerCase();
                card.classList.toggle("is-hidden", query && text.indexOf(query) === -1);
            });
        });
    }

    function setupSearchPage() {
        var container = document.querySelector("[data-search-results]");
        var title = document.querySelector("[data-search-title]");
        var summary = document.querySelector("[data-search-summary]");
        var input = document.querySelector("[data-search-input]");
        if (!container || !window.SITE_MOVIES) {
            return;
        }
        var query = getQuery("q").trim();
        if (input) {
            input.value = query;
        }
        if (!query) {
            return;
        }
        var key = query.toLowerCase();
        var results = window.SITE_MOVIES.filter(function (movie) {
            return [movie.title, movie.year, movie.region, movie.genre, movie.tags, movie.oneLine]
                .join(" ")
                .toLowerCase()
                .indexOf(key) !== -1;
        }).slice(0, 120);
        if (title) {
            title.textContent = "搜索结果";
        }
        if (summary) {
            summary.textContent = results.length ? "已匹配到相关影片，点击卡片进入详情播放。" : "没有找到匹配影片，可以尝试更换关键词。";
        }
        container.innerHTML = results.map(function (movie) {
            return [
                '<article class="movie-card">',
                '<a class="poster-link" href="./' + escapeText(movie.url) + '" aria-label="' + escapeText(movie.title) + '">',
                '<img src="' + escapeText(movie.cover) + '" alt="' + escapeText(movie.title) + '" loading="lazy">',
                '<span class="play-chip">播放</span>',
                '</a>',
                '<div class="movie-card-body">',
                '<div class="movie-meta-line"><span>' + escapeText(movie.year) + '</span><span>' + escapeText(movie.region) + '</span><span>' + escapeText(movie.genre) + '</span></div>',
                '<h2><a href="./' + escapeText(movie.url) + '">' + escapeText(movie.title) + '</a></h2>',
                '<p>' + escapeText(movie.oneLine) + '</p>',
                '<div class="tag-row">' + String(movie.tags || "").split(" ").slice(0, 3).map(function (tag) { return '<span>' + escapeText(tag) + '</span>'; }).join("") + '</div>',
                '</div>',
                '</article>'
            ].join("");
        }).join("");
    }

    window.initMoviePlayer = function (videoId, sourceUrl) {
        ready(function () {
            var video = document.getElementById(videoId);
            var button = document.querySelector("[data-player-start]");
            var hlsInstance = null;
            var loaded = false;
            if (!video || !sourceUrl) {
                return;
            }
            function load() {
                if (loaded) {
                    return;
                }
                loaded = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = sourceUrl;
                    video.load();
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(sourceUrl);
                    hlsInstance.attachMedia(video);
                    return;
                }
                video.src = sourceUrl;
                video.load();
            }
            function start() {
                load();
                if (button) {
                    button.classList.add("is-hidden");
                }
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(function () {});
                }
            }
            if (button) {
                button.addEventListener("click", start);
            }
            video.addEventListener("click", function () {
                if (!loaded) {
                    start();
                }
            });
            video.addEventListener("play", function () {
                if (button) {
                    button.classList.add("is-hidden");
                }
            });
            window.addEventListener("beforeunload", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        });
    };

    ready(function () {
        setupNavigation();
        setupHero();
        setupLocalFilter();
        setupSearchPage();
    });
})();
