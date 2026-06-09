(function () {
  var normalize = function (value) {
    return (value || "").toString().trim().toLowerCase();
  };

  var mobileButton = document.querySelector("[data-mobile-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");
  if (mobileButton && mobileNav) {
    mobileButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-global-search]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("input");
      var query = input ? input.value.trim() : "";
      var target = "./search.html";
      if (query) {
        target += "?q=" + encodeURIComponent(query);
      }
      window.location.href = target;
    });
  });

  document.querySelectorAll("[data-hero]").forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    if (!slides.length) {
      return;
    }
    var index = 0;
    var show = function (nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    };
    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
      });
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
    show(0);
  });

  var filterPanel = document.querySelector("[data-filter-panel]");
  var cardGrid = document.querySelector("[data-card-grid]");
  if (filterPanel && cardGrid) {
    var cards = Array.prototype.slice.call(cardGrid.querySelectorAll(".movie-card"));
    var keywordInput = filterPanel.querySelector("[data-filter-keyword]");
    var typeSelect = filterPanel.querySelector("[data-filter-type]");
    var regionSelect = filterPanel.querySelector("[data-filter-region]");
    var yearSelect = filterPanel.querySelector("[data-filter-year]");
    var status = document.querySelector("[data-filter-status]");
    var params = new URLSearchParams(window.location.search);
    if (keywordInput && params.get("q")) {
      keywordInput.value = params.get("q");
    }
    var update = function () {
      var keyword = normalize(keywordInput ? keywordInput.value : "");
      var type = typeSelect ? typeSelect.value : "";
      var region = regionSelect ? regionSelect.value : "";
      var year = yearSelect ? yearSelect.value : "";
      var visible = 0;
      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-search"));
        var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchesType = !type || card.getAttribute("data-type") === type;
        var matchesRegion = !region || card.getAttribute("data-region").indexOf(region) !== -1;
        var matchesYear = !year || card.getAttribute("data-year") === year;
        var showCard = matchesKeyword && matchesType && matchesRegion && matchesYear;
        card.hidden = !showCard;
        if (showCard) {
          visible += 1;
        }
      });
      if (status) {
        status.textContent = "筛选结果：" + visible + " 部影片";
      }
    };
    [keywordInput, typeSelect, regionSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", update);
        control.addEventListener("change", update);
      }
    });
    update();
  }

  document.querySelectorAll("[data-player]").forEach(function (player) {
    var video = player.querySelector("video[data-hls]");
    var overlay = player.querySelector("[data-play-button]");
    var status = player.querySelector("[data-player-status]");
    var hlsInstance = null;
    if (!video) {
      return;
    }
    var setStatus = function (text) {
      if (status) {
        status.textContent = text;
      }
    };
    var prepare = function () {
      var src = video.getAttribute("data-hls");
      if (!src || video.dataset.ready === "true") {
        return;
      }
      setStatus("正在准备播放");
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.dataset.ready = "true";
          setStatus("高清线路已就绪");
          video.play().catch(function () {
            setStatus("点击画面继续播放");
          });
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            setStatus("网络异常，正在重连");
            hlsInstance.startLoad();
            return;
          }
          if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            setStatus("播放恢复中");
            hlsInstance.recoverMediaError();
            return;
          }
          setStatus("视频暂时无法播放");
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        video.dataset.ready = "true";
        setStatus("高清线路已就绪");
      } else {
        setStatus("视频暂时无法播放");
      }
    };
    var play = function () {
      prepare();
      video.play().catch(function () {
        setStatus("点击画面继续播放");
      });
    };
    if (overlay) {
      overlay.addEventListener("click", play);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });
    video.addEventListener("play", function () {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });
    video.addEventListener("pause", function () {
      if (overlay) {
        overlay.classList.remove("is-hidden");
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
