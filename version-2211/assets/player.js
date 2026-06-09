(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var dataNode = document.getElementById("player-json");
    var video = document.getElementById("movie-video");
    var button = document.getElementById("movie-play");
    if (!dataNode || !video || !button) {
      return;
    }

    var data;
    try {
      data = JSON.parse(dataNode.textContent || "{}");
    } catch (error) {
      data = {};
    }

    var streamUrl = data.src || "";
    var hlsInstance = null;
    var attached = false;
    var hlsReady = false;
    var wantsPlayback = false;

    function safePlay() {
      var playRequest = video.play();
      if (playRequest && typeof playRequest.catch === "function") {
        playRequest.catch(function () {
          if (!hlsInstance || hlsReady) {
            button.classList.remove("is-hidden");
          }
        });
      }
    }

    function attachStream() {
      if (attached || !streamUrl) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        attached = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          hlsReady = true;
          if (wantsPlayback) {
            safePlay();
          }
        });
        attached = true;
        return;
      }

      video.src = streamUrl;
      attached = true;
    }

    function startPlayback() {
      wantsPlayback = true;
      attachStream();
      button.classList.add("is-hidden");
      video.controls = true;
      safePlay();
    }

    button.addEventListener("click", startPlayback);
    video.addEventListener("click", function () {
      if (!attached || video.paused) {
        startPlayback();
      } else {
        video.pause();
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
