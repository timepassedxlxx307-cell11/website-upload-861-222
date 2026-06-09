(function () {
  function setupPlayer(frame) {
    var video = frame.querySelector('video');
    var trigger = frame.querySelector('[data-play-trigger]');
    var stream = frame.getAttribute('data-stream');
    var ready = false;
    var hls = null;

    function load() {
      if (ready || !video || !stream) {
        return;
      }
      ready = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function play() {
      load();
      if (trigger) {
        trigger.classList.add('is-hidden');
      }
      video.controls = true;
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    if (trigger) {
      trigger.addEventListener('click', play);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!ready || video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        if (trigger) {
          trigger.classList.add('is-hidden');
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls && hls.destroy) {
        hls.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
  });
})();
