(function () {
  "use strict";

  var SOURCE_CONFIG = {
    apiKey: "AIzaSyCeD7Xrt6kwPWVgjNIrpwy0jnI8yQso1iM",
    authDomain: "tcs-for-engineers.firebaseapp.com",
    projectId: "tcs-for-engineers",
    storageBucket: "tcs-for-engineers.firebasestorage.app",
    messagingSenderId: "283193216884",
    appId: "1:283193216884:web:75df672769338634722621"
  };
  var COLLECTIONS = [
    { id: "engineers", role: "Engineers" },
    { id: "tcs_mx_receptionists", role: "Receptionists" },
    { id: "tcs_mx_galaxy_consultants", role: "Galaxy Consultants" }
  ];
  var CACHE_KEY = "ssc_tcs_mx_live_cache_v1";
  var rows = [];
  var unsubscribers = [];
  var collectionRows = Object.create(null);
  var refreshTimer = null;
  var refreshInFlight = null;
  var SOURCE_ROOT = "https://firestore.googleapis.com/v1/projects/tcs-for-engineers/databases/(default)/documents";
  var REFRESH_MS = 30000;

  function first(object, names, fallback) {
    for (var i = 0; i < names.length; i += 1) {
      var wanted = String(names[i]).toLowerCase().replace(/[^a-z0-9]/g, "");
      var key = Object.keys(object || {}).find(function (candidate) {
        return String(candidate).toLowerCase().replace(/[^a-z0-9]/g, "") === wanted;
      });
      if (key && object[key] !== undefined && object[key] !== null && object[key] !== "") return object[key];
    }
    return fallback;
  }
  function number(value) {
    var parsed = parseFloat(String(value == null ? "" : value).replace(/[%#,]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  function text(value) { return value == null ? "" : String(value).trim(); }
  function score(value) {
    var parsed = number(value);
    return parsed == null ? "—" : parsed.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  function monthNumber(value) {
    var raw = text(value);
    var parsed = parseInt(raw, 10);
    if (parsed >= 1 && parsed <= 12) return parsed;
    var names = ["january","february","march","april","may","june","july","august","september","october","november","december"];
    var index = names.findIndex(function (name) { return raw.toLowerCase().indexOf(name) === 0; });
    return index < 0 ? null : index + 1;
  }
  function normalized(doc, role, id) {
    var product = text(first(doc, ["product", "productType", "category", "division"], "MX")).toUpperCase();
    if (role === "Engineers" && product && product !== "MX") return null;
    var month = monthNumber(first(doc, ["month", "monthNumber", "evaluationMonth"], ""));
    var year = number(first(doc, ["year", "evaluationYear"], ""));
    var quarter = text(first(doc, ["quarter", "quarterKey", "q"], ""));
    if (!quarter && month) quarter = "Q" + Math.ceil(month / 3);
    var kpi = first(doc, ["kpiScore", "kpisScore", "kpi", "engineerEvaluation", "evaluationScore", "totalKpi"], null);
    return {
      id: id,
      role: role,
      name: text(first(doc, ["engineerName", "name", "employeeName", "receptionistName", "consultantName"], "")),
      code: text(first(doc, ["engineerCode", "code", "employeeCode", "sbaId", "id"], "")),
      region: text(first(doc, ["region", "area", "branch", "ascName", "serviceCenter"], "")),
      month: month,
      year: year,
      quarter: quarter.toUpperCase(),
      tcs: number(first(doc, ["tcsScore", "score", "finalScore", "totalScore"], null)),
      kpi: number(kpi),
      exam: number(first(doc, ["examScore", "exam", "technicalExam", "testScore"], null)),
      drnps: number(first(doc, ["dRnps", "drnps", "drnpsPercent", "drnpsScore"], null)),
      monthlyRank: number(first(doc, ["monthRank", "monthlyRank", "rank"], null)),
      quarterlyRank: number(first(doc, ["qRank", "quarterRank", "quarterlyRank"], null)),
      updatedAt: first(doc, ["updatedAt", "createdAt", "uploadDate"], "")
    };
  }
  function escapeHtml(value) {
    return text(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character];
    });
  }
  function setStatus(state, message) {
    var box = document.getElementById("mxTcsStatus");
    if (!box) return;
    box.className = "mx-tcs-status " + (state === "live" ? "is-live" : state === "error" ? "is-error" : "");
    box.querySelector("strong").textContent = message;
    box.querySelector("small").textContent = state === "live"
      ? "Any source change is reflected automatically while this dashboard is open."
      : "The last successfully loaded copy remains visible.";
  }
  function options(id, values, allLabel) {
    var select = document.getElementById(id);
    if (!select) return;
    var current = select.value;
    select.innerHTML = '<option value="">' + escapeHtml(allLabel) + "</option>" +
      values.filter(Boolean).map(function (value) {
        return '<option value="' + escapeHtml(value) + '">' + escapeHtml(value) + "</option>";
      }).join("");
    if (Array.from(select.options).some(function (option) { return option.value === current; })) select.value = current;
  }
  function filteredRows() {
    var role = document.getElementById("mxTcsRoleFilter").value;
    var year = document.getElementById("mxTcsYearFilter").value;
    var quarter = document.getElementById("mxTcsQuarterFilter").value;
    var month = document.getElementById("mxTcsMonthFilter").value;
    var search = document.getElementById("mxTcsSearch").value.toLowerCase().trim();
    return rows.filter(function (row) {
      return (!role || row.role === role) &&
        (!year || String(row.year) === year) &&
        (!quarter || row.quarter === quarter) &&
        (!month || String(row.month) === month) &&
        (!search || [row.name, row.code, row.region, row.role].join(" ").toLowerCase().indexOf(search) >= 0);
    }).sort(function (a, b) {
      var ar = a.monthlyRank || a.quarterlyRank || 999999;
      var br = b.monthlyRank || b.quarterlyRank || 999999;
      return ar - br || (b.tcs || 0) - (a.tcs || 0);
    });
  }
  function average(list, key) {
    var values = list.map(function (row) { return row[key]; }).filter(Number.isFinite);
    return values.length ? values.reduce(function (sum, value) { return sum + value; }, 0) / values.length : null;
  }
  function renderCompanyMonthMatrix(list) {
    var head = document.getElementById("mxTcsMatrixHead");
    var body = document.getElementById("mxTcsMatrixBody");
    if (!head || !body) return;
    var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    head.innerHTML = "<tr><th>Company / Branch</th>" + monthNames.map(function (month) {
      return "<th>" + month + "</th>";
    }).join("") + "<th>Average</th><th>Quarter Rank</th></tr>";
    var groups = new Map();
    list.forEach(function (row) {
      var company = row.region || row.name || row.code || "Unspecified";
      if (!groups.has(company)) groups.set(company, []);
      groups.get(company).push(row);
    });
    var companies = Array.from(groups.entries()).map(function (entry) {
      var companyRows = entry[1];
      return {
        name: entry[0],
        rows: companyRows,
        average: average(companyRows, "tcs"),
        rank: companyRows.map(function (row) { return row.quarterlyRank; }).filter(Number.isFinite).sort(function (a, b) { return a - b; })[0] || null
      };
    }).sort(function (a, b) {
      return (a.rank || 999999) - (b.rank || 999999) || (b.average || 0) - (a.average || 0) || a.name.localeCompare(b.name);
    });
    body.innerHTML = companies.length ? companies.map(function (company) {
      var monthCells = monthNames.map(function (_name, index) {
        var monthRows = company.rows.filter(function (row) { return row.month === index + 1; });
        var value = average(monthRows, "tcs");
        var bestRank = monthRows.map(function (row) { return row.monthlyRank; }).filter(Number.isFinite).sort(function (a, b) { return a - b; })[0] || null;
        return value == null ? '<td class="mx-tcs-month-empty">—</td>' :
          '<td><span class="mx-tcs-month-score' + (bestRank && bestRank <= 3 ? " is-top" : "") + '" title="' +
          escapeHtml(bestRank ? "Monthly rank #" + bestRank : "TCS score") + '">' + score(value) + "</span></td>";
      }).join("");
      var roles = Array.from(new Set(company.rows.map(function (row) { return row.role; }))).join(" · ");
      return '<tr><td><span class="mx-tcs-company"><strong>' + escapeHtml(company.name) + "</strong><small>" +
        escapeHtml(roles) + "</small></span></td>" + monthCells +
        '<td class="mx-tcs-score">' + score(company.average) + '</td><td><span class="mx-tcs-rank">' +
        escapeHtml(company.rank || "—") + "</span></td></tr>";
    }).join("") : '<tr><td colspan="15" class="mx-tcs-empty">No company data matches the selected filters.</td></tr>';
  }
  function render() {
    var list = filteredRows();
    var cards = {
      mxTcsCount: list.length.toLocaleString(),
      mxTcsAvg: score(average(list, "tcs")),
      mxKpiAvg: score(average(list, "kpi")),
      mxExamAvg: score(average(list, "exam")),
      mxDrnpsAvg: score(average(list, "drnps"))
    };
    Object.keys(cards).forEach(function (id) {
      var element = document.getElementById(id);
      if (element) element.textContent = cards[id];
    });
    renderCompanyMonthMatrix(list);
    var body = document.getElementById("mxTcsTableBody");
    if (!body) return;
    body.innerHTML = list.length ? list.map(function (row) {
      return "<tr><td><strong>" + escapeHtml(row.name || "—") + "</strong></td>" +
        "<td>" + escapeHtml(row.code || "—") + "</td><td>" + escapeHtml(row.role) + "</td>" +
        "<td>" + escapeHtml(row.region || "—") + "</td>" +
        "<td>" + escapeHtml(row.month || "—") + "/" + escapeHtml(row.year || "—") + "</td>" +
        '<td class="mx-tcs-score">' + score(row.tcs) + "</td>" +
        '<td class="mx-tcs-score">' + score(row.kpi) + "</td>" +
        '<td class="mx-tcs-score">' + score(row.exam) + "</td>" +
        '<td class="mx-tcs-score">' + score(row.drnps) + "</td>" +
        '<td><span class="mx-tcs-rank">' + escapeHtml(row.monthlyRank || "—") + "</span></td>" +
        '<td><span class="mx-tcs-rank">' + escapeHtml(row.quarterlyRank || "—") + "</span></td></tr>";
    }).join("") : '<tr><td colspan="11" class="mx-tcs-empty">No MX records match the selected filters.</td></tr>';
  }
  function refreshCombinedRows() {
    rows = COLLECTIONS.flatMap(function (collection) { return collectionRows[collection.id] || []; });
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), rows: rows })); } catch (_error) {}
    options("mxTcsRoleFilter", Array.from(new Set(rows.map(function (row) { return row.role; }))).sort(), "All MX roles");
    options("mxTcsYearFilter", Array.from(new Set(rows.map(function (row) { return row.year; }))).sort().reverse().map(String), "All years");
    options("mxTcsQuarterFilter", Array.from(new Set(rows.map(function (row) { return row.quarter; }))).sort(), "All quarters");
    options("mxTcsMonthFilter", Array.from(new Set(rows.map(function (row) { return row.month; }))).sort(function (a, b) { return a - b; }).map(String), "All months");
    render();
  }
  function loadCached() {
    try {
      var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (cached && Array.isArray(cached.rows)) {
        rows = cached.rows;
        COLLECTIONS.forEach(function (collection) {
          collectionRows[collection.id] = rows.filter(function (row) { return row.role === collection.role; });
        });
        refreshCombinedRows();
      }
    } catch (_error) {}
  }
  function decodeFirestoreValue(value) {
    if (!value || typeof value !== "object") return value;
    if (Object.prototype.hasOwnProperty.call(value, "nullValue")) return null;
    if (Object.prototype.hasOwnProperty.call(value, "stringValue")) return value.stringValue;
    if (Object.prototype.hasOwnProperty.call(value, "booleanValue")) return value.booleanValue;
    if (Object.prototype.hasOwnProperty.call(value, "integerValue")) return Number(value.integerValue);
    if (Object.prototype.hasOwnProperty.call(value, "doubleValue")) return Number(value.doubleValue);
    if (Object.prototype.hasOwnProperty.call(value, "timestampValue")) return value.timestampValue;
    if (Object.prototype.hasOwnProperty.call(value, "referenceValue")) return value.referenceValue;
    if (Object.prototype.hasOwnProperty.call(value, "geoPointValue")) return value.geoPointValue;
    if (Object.prototype.hasOwnProperty.call(value, "bytesValue")) return value.bytesValue;
    if (value.arrayValue) return (value.arrayValue.values || []).map(decodeFirestoreValue);
    if (value.mapValue) return decodeFirestoreFields(value.mapValue.fields || {});
    return value;
  }
  function decodeFirestoreFields(fields) {
    var output = {};
    Object.keys(fields || {}).forEach(function (key) {
      output[key] = decodeFirestoreValue(fields[key]);
    });
    return output;
  }
  async function fetchCollection(collectionId) {
    var documents = [];
    var pageToken = "";
    do {
      var url = SOURCE_ROOT + "/" + encodeURIComponent(collectionId) + "?pageSize=1000";
      if (pageToken) url += "&pageToken=" + encodeURIComponent(pageToken);
      var response = await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-store",
        credentials: "omit",
        headers: { "Accept": "application/json" }
      });
      if (!response.ok) {
        var details = "";
        try { details = (await response.json()).error.message || ""; } catch (_error) {}
        throw new Error(collectionId + " returned HTTP " + response.status + (details ? ": " + details : ""));
      }
      var payload = await response.json();
      documents = documents.concat(Array.isArray(payload.documents) ? payload.documents : []);
      pageToken = payload.nextPageToken || "";
    } while (pageToken);
    return documents;
  }
  async function refreshFromRest(force) {
    if (refreshInFlight && !force) return refreshInFlight;
    refreshInFlight = (async function () {
      setStatus("loading", rows.length ? "Checking the MX source for updates…" : "Loading MX data from the source…");
      var results = await Promise.all(COLLECTIONS.map(async function (collection) {
        var documents = await fetchCollection(collection.id);
        var mapped = documents.map(function (document) {
          var id = String(document.name || "").split("/").pop();
          return normalized(decodeFirestoreFields(document.fields || {}), collection.role, id);
        }).filter(Boolean);
        return { collection: collection, rows: mapped, received: documents.length };
      }));
      results.forEach(function (result) {
        collectionRows[result.collection.id] = result.rows;
      });
      refreshCombinedRows();
      var received = results.reduce(function (total, result) { return total + result.received; }, 0);
      setStatus("live", "Source updated · " + rows.length.toLocaleString() + " MX records (" + received.toLocaleString() + " read)");
      return rows;
    }()).catch(function (error) {
      console.error("MX TCS REST refresh failed:", error);
      setStatus("error", "Could not reach the source · showing " + rows.length.toLocaleString() + " saved records");
      throw error;
    }).finally(function () {
      refreshInFlight = null;
    });
    return refreshInFlight;
  }
  function connect() {
    if (refreshTimer) clearInterval(refreshTimer);
    refreshFromRest(true).catch(function () {});
    refreshTimer = setInterval(function () {
      if (!document.hidden) refreshFromRest(false).catch(function () {});
    }, REFRESH_MS);
  }
  function buildPage() {
    var partnerPage = document.getElementById("partnerQualityPage");
    if (!partnerPage || document.getElementById("tcsMxPage")) return;
    var page = document.createElement("div");
    page.id = "tcsMxPage";
    page.className = "mx-tcs-page mx-tcs-standalone-page";
    page.style.display = "none";
    page.setAttribute("data-service-page", "tcsMx");
    partnerPage.insertAdjacentElement("afterend", page);
    page.classList.add("mx-tcs-page");
    page.innerHTML =
      '<header><div class="brand"><div class="logo-box"><img alt="SKY Distribution Logo" data-site-logo="1" src="assets/SKY.PNG"></div>' +
      '<div><h1>Service Support Center</h1><div class="sub">MX TCS Performance</div></div></div></header>' +
      '<main><div id="mxTcsStatus" class="mx-tcs-status"><span class="mx-tcs-status-dot"></span><strong>Connecting to the MX data source…</strong><small>The saved copy will be used if the source is temporarily unavailable.</small><button id="mxTcsRefreshButton" class="mx-tcs-refresh" type="button">Refresh now</button></div>' +
      '<div class="mx-tcs-filters"><label>MX Role<select id="mxTcsRoleFilter"><option value="">All MX roles</option></select></label>' +
      '<label>Year<select id="mxTcsYearFilter"><option value="">All years</option></select></label>' +
      '<label>Quarter<select id="mxTcsQuarterFilter"><option value="">All quarters</option></select></label>' +
      '<label>Month<select id="mxTcsMonthFilter"><option value="">All months</option></select></label>' +
      '<label>Search<input id="mxTcsSearch" type="search" placeholder="Name, code or branch"></label></div>' +
      '<div class="mx-tcs-cards"><div class="mx-tcs-card"><span>MX Records</span><strong id="mxTcsCount">0</strong></div>' +
      '<div class="mx-tcs-card"><span>Average TCS</span><strong id="mxTcsAvg">—</strong></div>' +
      '<div class="mx-tcs-card"><span>Average KPI</span><strong id="mxKpiAvg">—</strong></div>' +
      '<div class="mx-tcs-card"><span>Average Exam</span><strong id="mxExamAvg">—</strong></div>' +
      '<div class="mx-tcs-card"><span>Average DRNPS</span><strong id="mxDrnpsAvg">—</strong></div></div>' +
      '<div class="mx-tcs-section-title"><h2>Company performance by month</h2><span>Companies are ordered by quarterly rank, then average TCS · January to December</span></div>' +
      '<div class="mx-tcs-table-wrap"><table class="mx-tcs-matrix"><thead id="mxTcsMatrixHead"></thead><tbody id="mxTcsMatrixBody"></tbody></table></div>' +
      '<div class="mx-tcs-section-title"><h2>Detailed MX results</h2><span>TCS, KPI, Exam, DRNPS and monthly/quarterly ranking</span></div>' +
      '<div class="mx-tcs-table-wrap"><table class="mx-tcs-table"><thead><tr><th>Name</th><th>Code</th><th>MX Role</th><th>Region / Branch</th><th>Period</th><th>TCS</th><th>KPI</th><th>Exam</th><th>DRNPS</th><th>Monthly Rank</th><th>Quarterly Rank</th></tr></thead><tbody id="mxTcsTableBody"></tbody></table></div></main>';
    var tab = document.querySelector(".mx-tcs-nav-tab");
    if (tab) {
      tab.removeAttribute("onclick");
      tab.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        openMxTcsTab();
      }, true);
      tab.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          openMxTcsTab();
        }
      }, true);
    }
    ["mxTcsRoleFilter", "mxTcsYearFilter", "mxTcsQuarterFilter", "mxTcsMonthFilter"].forEach(function (id) {
      document.getElementById(id).addEventListener("change", render);
    });
    document.getElementById("mxTcsSearch").addEventListener("input", render);
    document.getElementById("mxTcsRefreshButton").addEventListener("click", function () {
      var button = this;
      button.disabled = true;
      refreshFromRest(true).catch(function () {}).finally(function () { button.disabled = false; });
    });
    loadCached();
    render();
    connect();
  }
  function openMxTcsTab() {
    document.querySelectorAll(".page-shell, #userManagementPage, #securityPage").forEach(function (candidate) {
      candidate.style.setProperty("display", "none", "important");
    });
    var mxPage = document.getElementById("tcsMxPage");
    if (!mxPage) {
      buildPage();
      mxPage = document.getElementById("tcsMxPage");
    }
    if (mxPage) {
      mxPage.classList.remove("fb-page-denied");
      mxPage.removeAttribute("data-fb-page-key");
      mxPage.removeAttribute("data-fb-permission");
      mxPage.style.setProperty("display", "block", "important");
      mxPage.setAttribute("aria-hidden", "false");
    }
    document.querySelectorAll(".side-tab, .mx-tcs-nav-tab").forEach(function (tab) {
      tab.classList.toggle("active", tab.classList.contains("mx-tcs-nav-tab"));
    });
    document.body.setAttribute("data-active-tab", "tcsMx");
    window.__fbActiveTabKey = "dashboard";
    try { localStorage.setItem("serviceEyeActiveTab", "partnerQuality"); } catch (_error) {}
    window.scrollTo({ top: 0, behavior: "smooth" });
    render();
  }
  window.openMxTcsTab = openMxTcsTab;
  document.addEventListener("click", function (event) {
    var tab = event.target && event.target.closest ? event.target.closest(".side-tab") : null;
    if (tab) {
      var page = document.getElementById("tcsMxPage");
      if (page) {
        page.style.setProperty("display", "none", "important");
        page.setAttribute("aria-hidden", "true");
      }
    }
  }, true);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", buildPage, { once: true });
  else buildPage();
  window.addEventListener("beforeunload", function () {
    unsubscribers.forEach(function (unsubscribe) { try { unsubscribe(); } catch (_error) {} });
    if (refreshTimer) clearInterval(refreshTimer);
  });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) refreshFromRest(false).catch(function () {});
  });
  window.addEventListener("online", function () { refreshFromRest(true).catch(function () {}); });
  window.mxTcsRefreshNow = function () { return refreshFromRest(true); };
}());
