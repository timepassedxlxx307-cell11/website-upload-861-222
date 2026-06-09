(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function movieCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");
    return "<article class=\"movie-card\">" +
      "<a class=\"movie-poster\" href=\"./" + escapeHtml(movie.file) + "\">" +
      "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">" +
      "<span class=\"play-chip\">播放</span>" +
      "</a>" +
      "<div class=\"movie-card-body\">" +
      "<div class=\"movie-meta-line\"><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.type) + "</span><span>" + escapeHtml(movie.year) + "</span></div>" +
      "<h3><a href=\"./" + escapeHtml(movie.file) + "\">" + escapeHtml(movie.title) + "</a></h3>" +
      "<p>" + escapeHtml(movie.oneLine || movie.summary || "") + "</p>" +
      "<div class=\"movie-tags\">" + tags + "</div>" +
      "<div class=\"movie-stats\"><span>★ " + escapeHtml(movie.rating) + "</span><span>" + escapeHtml(movie.category) + "</span></div>" +
      "</div>" +
      "</article>";
  }

  ready(function () {
    var form = document.querySelector("[data-search-page-form]");
    var input = document.querySelector("[data-search-page-input]");
    var results = document.querySelector("[data-search-results]");
    var status = document.querySelector("[data-search-status]");
    var data = typeof SEARCH_MOVIES !== "undefined" ? SEARCH_MOVIES : [];
    if (!form || !input || !results || !status) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";
    input.value = initialQuery;

    function runSearch(query) {
      var q = String(query || "").trim().toLowerCase();
      results.innerHTML = "";
      if (!q) {
        status.textContent = "请输入关键词开始搜索。";
        return;
      }

      var matched = data.filter(function (movie) {
        return [
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.category,
          (movie.tags || []).join(" "),
          movie.oneLine,
          movie.summary
        ].join(" ").toLowerCase().indexOf(q) !== -1;
      }).slice(0, 240);

      status.textContent = "找到 " + matched.length + " 条相关结果" + (matched.length === 240 ? "，请继续细化关键词" : "");
      results.innerHTML = matched.map(movieCard).join("");
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var query = input.value.trim();
      var nextUrl = query ? "./search.html?q=" + encodeURIComponent(query) : "./search.html";
      window.history.replaceState(null, "", nextUrl);
      runSearch(query);
    });

    input.addEventListener("input", function () {
      runSearch(input.value);
    });

    runSearch(initialQuery);
  });
})();
