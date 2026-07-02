/* ============================================================================
 * SkyRoot Service Dashboard — dashboard.js (consolidated & optimized)
 * ----------------------------------------------------------------------------
 * Optimized: 2026-07-02
 *  - Embedded datasets externalized to data/pre_booking.json & data/cash_target.json
 *  - Superseded patch-layer definitions removed via execution-order analysis
 *    (markers: "[dedup] superseded ... removed")
 *  - Orphan helper functions removed (markers: "[dedup] orphan helper ... removed")
 *  - jQuery / jQuery UI dependency dropped (native <input type="date">)
 *
 * ARCHITECTURE NOTE
 *  This file is a sequential stack of IIFE modules with superseded runtime guard layers consolidated on 2026-07-02.
 *  Later modules intentionally override or wrap globals defined by earlier ones
 *  (window.renderSky, window.switchTab, ...). MODULE ORDER IS SIGNIFICANT —
 *  do not reorder sections. The final behavior of any global is defined by the
 *  last module that assigns or wraps it.
 *
 * MODULE INDEX
 *     1. perf-logo-store
 *     2. json-data-loader-v1
 *     3. global-render-debounce-guard
 *     4. core-safe-chart-constructor
 *     5. inline-script-4
 *     6. inline-script-6
 *     7. master-performance-optimizations
 *     8. inline-script-12
 *     9. v20_sky_final_fixes
 *    10. v21_final_script
 *    11. v22_final_script
 *    12. v23-glass-final-script
 *    13. v24-interactive-chart-script
 *    14. v25-3d-interactive-script
 *    15. sky-v36-requested-script
 *    16. inline-script-20
 *    17. inline-script-21
 *    18. inline-script-22
 *    19. inline-script-23
 *    20. inline-script-24
 *    21. v45_sky_local_dropdown_fix_script
 *    22. v46_sky_filter_design_script
 *    23. v47_sky_compact_multi_filters_script
 *    24. v48_sky_multi_and_gspn_scroll_fix
 *    25. v49_urgent_filter_fixes_script
 *    26. v50_gspn_filter_scroll_fix_script
 *    27. gspn-v51-dropdown-layer-fix-script
 *    28. v57-script
 *    29. v58-script
 *    30. v58-presence-badge-lock
 *    31. v62-requested-updates-script
 *    32. v61-requested-updates-script
 *    33. v65-definitive-fix-script
 *    34. sky_v8_perf_script
 *    35. all_tabs_requested_enhancements_script
 *    36. custom-online-users-inside-header-only-script
 *    37. permanent-export-button-removal
 *    38. user-requested-gspn-sky-final-script
 *    39. user-requested-final-v2-script
 *    40. user-requested-v3-script
 *    41. gspn-final-v4-script
 *    42. sky-final-v5-script
 *    43. inline-script-47
 *    44. sky-requested-insights-script
 *    45. sky-v26-layout-clear-script
 *    46. sky-v27-clean-duplicates-clear-fix-script
 *    47. sky-v28-final-fix-script
 *    48. sky-v29-show-summary-tables-fix-script
 *    49. user-gspn-requested-charts-script
 *    50. mohamed-gspn-final-fix-script
 *    51. SKY targeted fix: export filtered rows only
 *    52. SKY targeted fix: remove duplicated chart value labels
 *    53. codex-final-visitor-and-sky-table-fix
 *    54. codex-sky-workbook-export-chart-fix
 *    55. codex-remove-analyses-dashboard-script
 *    56. codex-sky-final-no-wipe-aging-export-hotfix
 *    57. codex-two-tabs-last-update-notice
 *    58. sky-loading-export-hotfix
 *    59. inline-script-61
 *    60. profitability-three-tab-final-hotfix
 *    61. profitability-dropdown-visitors-lastupdate-fix
 *    62. profitability-final-v5-stability-fix
 *    63. cashTargetScriptFinal
 *    64. cashTargetRouterLockV6
 *    65. gspn-redo-data-hotfix
 *    66. inline-script-68
 *    67. profitability-v6-filter-final-script
 *    68. profitability-v7-filter-ui-script
 *    69. final-exact-tab-router-hotfix
 *    70. serviceEyeFinalCleanPatchV2Script
 *    71. serviceEyeRefreshPersistenceFixV3
 *    72. serviceEyeFinalPatchV4Script
 *    73. cleanupV5FreshData
 *    74. ultimatePasswordLockFinal
 *    75. sky-final-queue-clean-script
 *    76. visual-polish-lightweight-script
 *    77. userRequestSidebarRefreshPatchScript
 *    78. serviceV2RealUpdateTimeHardGuard
 *    79. inline-script-83
 *    80. perf-switchTab-render-guards
 *    81. perf-renderSky-guard
 *    82. perf-updateSkyCharts-guard
 *    83. inline-script-87
 *    84. firebase-user-management-script
 *    85. prebooking-dashboard-script
 *    86. returnCasesTabPatch
 *    87. return-cases-core-visibility-fix
 *    88. final-root-fix-returncases-and-sidebar-dedupe
 *    89. received-delivered-tab-v1
 *    90. codex-page-color-full-page-final-script
 *    91. repair-efficiency-exit-final-script
 *    92. repair-efficiency-firebase-navigation-cleanup
 *    93. cashTargetManualUpdateNoticeOnlyPatch
 *    94. codex-sidebar-color-github-live-script
 *    95. codex-sidebar-bottom-class-fix
 *    96. codex-single-url-github-auth-check-script
 *    97. codex-chart-readable-colors-final-script
 *    98. comprehensive-fix-script
 *    99. return-cases-visibility-and-sidebar-final-fix
 *   100. repair-efficiency-tab-v1
 *   101. repair-efficiency-navigation-final-fix
 *   102. repair-efficiency-absolute-final-router
 *   103. accessibility-keyboard-sidebar
 *   104. phase2-performance-patch-20260627
 * ========================================================================== */


/* ===== perf-logo-store ===== */

/* Lightweight logo store: avoids parsing multi-megabyte Base64 images before first paint. */
window._SITE_LOGO = "assets/SKY.PNG";
window._ANALYSIS_LOGO = "assets/SKY.PNG";
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('img[data-site-logo]').forEach(function(img) { img.src = window._SITE_LOGO; });
});


/* ===== json-data-loader-v1 ===== */
/* Reads data/*.json first, then lets the existing Excel loaders continue as fallback. */
(function(){
  'use strict';
  var JSON_BY_EXCEL = {
    'datagspn.xlsx': 'data/gspn.json',
    'datasky.xlsx': 'data/sky.json',
    'pre_booking.xlsx': 'data/pre_booking.json',
    'profitability & commission.xlsx': 'data/profitability_commission.json',
    'received_delivered.xlsx': 'data/received_delivered.json',
    'received & delivered.xlsx': 'data/received_delivered.json',
    'received and delivered.xlsx': 'data/received_delivered.json',
    'received delivered.xlsx': 'data/received_delivered.json',
    'received_and_delivered.xlsx': 'data/received_delivered.json',
    'return cases.xlsx': 'data/return_cases.json',
    'repair efficiency.xlsx': 'data/repair_efficiency.json',
    'repair_efficiency.xlsx': 'data/repair_efficiency.json',
    'repairefficiency.xlsx': 'data/repair_efficiency.json',
    'repair efficiency.xlsm': 'data/repair_efficiency.json',
    'repair efficiency.xls': 'data/repair_efficiency.json'
  };

  function cleanName(file){
    return String(file || '').split('?')[0].split('#')[0].split('/').pop().toLowerCase();
  }

  window.__sscJsonFileForExcel = function(file){
    return JSON_BY_EXCEL[cleanName(file)] || '';
  };

  window.__sscExtractJsonRows = function(payload, preferredSheetName){
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== 'object') return [];
    if (Array.isArray(payload.rows)) return payload.rows;
    if (Array.isArray(payload.data)) return payload.data;
    if (payload.sheets && typeof payload.sheets === 'object') {
      if (preferredSheetName && Array.isArray(payload.sheets[preferredSheetName])) {
        return payload.sheets[preferredSheetName];
      }
      var firstSheet = Object.keys(payload.sheets).find(function(name){
        return Array.isArray(payload.sheets[name]);
      });
      return firstSheet ? payload.sheets[firstSheet] : [];
    }
    return [];
  };

  window.__sscFetchJsonRowsForExcel = async function(fileName, preferredSheetName, forceRefresh){
    var jsonFile = window.__sscJsonFileForExcel(fileName);
    if (!jsonFile) throw new Error('No JSON mapping for ' + fileName);

    var candidates = [];
    try {
      if (typeof window.serviceDataUrl === 'function') {
        candidates.push(await window.serviceDataUrl(jsonFile, !!forceRefresh));
      }
    } catch(_e) {}
    candidates.push(jsonFile + (forceRefresh ? '?v=' + Date.now() : ''));

    var lastErr;
    for (var i = 0; i < candidates.length; i++) {
      try {
        var res = await fetch(candidates[i], { cache: forceRefresh ? 'no-store' : 'no-cache' });
        if (!res.ok) throw new Error(jsonFile + ' HTTP ' + res.status);
        var payload = await res.json();
        var rows = window.__sscExtractJsonRows(payload, preferredSheetName);
        if (!Array.isArray(rows) || !rows.length) throw new Error(jsonFile + ' contains 0 rows');
        return { file: jsonFile, rows: rows, source: 'json' };
      } catch(e) {
        lastErr = e;
      }
    }
    throw lastErr || new Error(jsonFile + ' not found');
  };
})();


/* ===== global-render-debounce-guard ===== */

/* Global Performance Guard: prevents duplicate rapid re-renders */
(function() {
  var _timers = {};
  window._scheduleRender = function(key, fn, delay) {
    if (_timers[key]) clearTimeout(_timers[key]);
    _timers[key] = setTimeout(function() { delete _timers[key]; try { fn(); } catch(e) {} }, delay || 80);
  };
  /* Prevent rapid consecutive DOMContentLoaded callbacks from running render multiple times */
  window._bootOnce = (function() {
    var _done = {};
    return function(id, fn) {
      if (_done[id]) return;
      _done[id] = true;
      try { fn(); } catch(e) {}
    };
  })();
})();


/* ===== core-safe-chart-constructor ===== */

/* Core Chart.js safeguard: every chart creation first destroys any chart already bound to the same canvas. */
(function(){
  window.__safeNewChart = function(target, config){
    if (!window.Chart) return null;
    var canvas = target && target.canvas ? target.canvas : target;
    try {
      if (canvas && typeof Chart.getChart === 'function') {
        var existing = Chart.getChart(canvas);
        if (existing) existing.destroy();
      }
    } catch(e) {}
    try {
      var id = canvas && canvas.id;
      if (id && window.dashboardCharts && window.dashboardCharts[id]) {
        try { window.dashboardCharts[id].destroy(); } catch(_e) {}
        delete window.dashboardCharts[id];
      }
      if (id && window[id] && typeof window[id].destroy === 'function') {
        try { window[id].destroy(); } catch(_e) {}
        window[id] = null;
      }
    } catch(e) {}
    return new window.Chart(target, config);
  };
})();


/* ===== inline-script-4 ===== */

/* Performance Fix #1+3: Global once() + debounce utility */

/* Performance Fix #1: once() — ensures boot functions registered under both
   DOMContentLoaded and window.load only execute once regardless of how many
   listeners fire them.                                                        */
window._once = window._once || {};
window.once = window.once || function(fn) {
  var id = fn._onceId = fn._onceId || (fn.name || 'fn') + '_' + Math.random().toString(36).slice(2);
  return function() {
    if (window._once[id]) return;
    window._once[id] = true;
    fn.apply(this, arguments);
  };
};

window._db = window._db || {};
window.debounce = window.debounce || function(fn, delay) {
  var id = fn._dbId = fn._dbId || (Math.random().toString(36).slice(2));
  return function() {
    var args = arguments, ctx = this;
    clearTimeout(window._db[id]);
    window._db[id] = setTimeout(function(){ fn.apply(ctx, args); }, delay);
  };
};


/* ===== inline-script-6 ===== */

/* === CLEANUP STUBS: presence/visitors removed === */
/* [dedup] superseded v57_updatePresenceBadges definition removed (was L171) */
window.v57_heartbeat = function(){};
window.v57_getPresenceCounts = function(){return{gspn:0,sky:0,analysis:0};};

    /* ================= SKY v18 requested updates ================= */
    const SKY_V18_QUEUE_VALUES = ["Open_Cases", "Ready For Delivery Cases"];
    const SKY_CHART_FILTER_IDS = ["skyQueueChartBrandFilter", "skyBrandChartQueueFilter", "skyStageChartBranchFilter", "skyBranchChartStageFilter", "skyReadyAgingBrandFilter", "skyStageAllQueueFilter"];

    function loadLayoutPreferences() {
      const collapsed = localStorage.getItem("serviceEyeMenuCollapsed") === "1";
      const activeTab = localStorage.getItem("serviceEyeActiveTab") || "gspn";
      document.documentElement.classList.remove("prepaint-menu-collapsed");
      document.body.classList.toggle("menu-collapsed", collapsed);
      applyTabDesign(activeTab, false);
      setTimeout(() => switchTab(activeTab), 0);
      requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove("no-first-transition")));
    }
    function getTabDesign(tab) { return localStorage.getItem(`serviceEyeDesign_${tab}`) || localStorage.getItem("serviceEyeDesign") || "volta"; }
    function applyTabDesign(tab, save = false) {
      const safeDesign = ["pro", "glass", "fresh", "volta"].includes(getTabDesign(tab)) ? getTabDesign(tab) : "volta";
      document.body.classList.remove("theme-pro", "theme-glass", "theme-fresh", "theme-volta");
      document.body.classList.add(`theme-${safeDesign}`);
      if (save) localStorage.setItem(`serviceEyeDesign_${tab}`, safeDesign);
    }
    function getActiveServiceTab() { const profitPage = document.getElementById("profitPage"); const skyPage = document.getElementById("skyPage"); if (profitPage && profitPage.style.display !== "none") return "profit"; return skyPage && skyPage.style.display !== "none" ? "sky" : "gspn"; }
    function setDesign(design, save = true) {
      const tab = getActiveServiceTab();
      const safeDesign = ["pro", "glass", "fresh", "volta"].includes(design) ? design : "volta";
      localStorage.setItem(`serviceEyeDesign_${tab}`, safeDesign);
      if (save) localStorage.setItem("serviceEyeDesign", safeDesign);
      applyTabDesign(tab, false);
      if (save) setTimeout(() => { if (tab === "gspn" && currentFilteredRows && currentFilteredRows.length) updateCharts(currentFilteredRows); if (tab === "sky") renderSky(); }, 50);
    }
    
function requestProtectedTabAccess(tabKey, tabLabel) { return true; }

function switchTab(tab) {
      const safeTab = ["gspn", "sky", "profit", "cashTarget", "userManagement", "dashboard", "preBooking", "returnCases", "receivedDelivered"].includes(tab) ? tab : "gspn" // FIX: added cashTarget + userManagement + dashboard + preBooking;

      localStorage.setItem("serviceEyeActiveTab", safeTab);
      document.querySelectorAll(".side-tab").forEach(el => { const oc = el.getAttribute("onclick") || ""; el.classList.toggle("active", oc.includes("'" + safeTab + "'") || oc.includes('"' + safeTab + '"')); });
      const gspnPage = document.getElementById("gspnPage"); const skyPage = document.getElementById("skyPage"); const profitPage = document.getElementById("profitPage");
      if (gspnPage) gspnPage.style.display = safeTab === "gspn" ? "block" : "none";
      if (skyPage) skyPage.style.display = safeTab === "sky" ? "block" : "none";
      if (profitPage) profitPage.style.display = safeTab === "profit" ? "block" : "none";
      applyTabDesign(safeTab, false);
      (window.requestIdleCallback || function(cb){ return setTimeout(cb, 120); })(() => {
        if (safeTab === "gspn" && typeof currentFilteredRows !== "undefined" && currentFilteredRows && currentFilteredRows.length) updateCharts(currentFilteredRows);
        if (safeTab === "sky") { if (typeof window.__lazyStartSky === "function") window.__lazyStartSky(); else if (typeof renderSky === "function") renderSky(); }
        if (safeTab === "profit") renderProfit();
      }, { timeout: 1200 });
    }
    function clearSkyChartFilter(id) { const el = document.getElementById(id); if (el) el.value = ""; renderSky(); }
    function fillChartSelect(id, values, allText) {
      const el = document.getElementById(id); if (!el) return;
      const current = el.value || "";
      el.innerHTML = [`<option value="">${escapeHtml(allText || "All")}</option>`].concat(values.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`)).join("");
      if ([...el.options].some(o => o.value === current)) el.value = current;
    }
    function refreshSkyChartFilters() {
      const rows = skyRows || [];
      fillChartSelect("skyQueueChartBrandFilter", ["Samsung", "Apple"], "All Brands");
      fillChartSelect("skyBrandChartQueueFilter", SKY_V18_QUEUE_VALUES, "All Queues");
      fillChartSelect("skyStageChartBranchFilter", unique(rows.map(r => r.Branch)), "All Branches");
      fillChartSelect("skyBranchChartStageFilter", unique(rows.map(r => r.Stage)), "All Stages");
      fillChartSelect("skyReadyAgingBrandFilter", ["Samsung", "Apple"], "All Brands");
      fillChartSelect("skyStageAllQueueFilter", SKY_V18_QUEUE_VALUES, "All Queues");
    }
    function resetSkyFiltersToAll() {
      ["skyBranchFilter", "skyStageFilter", "skyJobTypeFilter"].forEach(id => { const el = document.getElementById(id); if (el) [...el.options].forEach(opt => opt.selected = opt.value === ALL_VALUE); });
      ["skyQueueFilter", "skyBrandFilter"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
      SKY_CHART_FILTER_IDS.forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
      const search = document.getElementById("skySearchBox"); if (search) search.value = "";
      requestAnimationFrame(refreshSkyExcelFilterWidgets);
    }
    function chartRowsByField(rows, field, value) { return value ? rows.filter(r => clean(r[field]) === value) : rows; }
    function topCountsAllKeep(rows, field, orderedValues = null) {
      const counts = {}; rows.forEach(r => { const key = clean(r[field]) || "Blank"; counts[key] = (counts[key] || 0) + 1; });
      const entries = orderedValues ? orderedValues.map(v => [v, counts[v] || 0]) : Object.entries(counts).sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0]));
      return { labels: entries.map(x => x[0]), values: entries.map(x => x[1]) };
    }
    function readyAgingMonthBuckets(rows) {
      const buckets = { "0-3": 0, "4-7": 0, "more than 7": 0 };
      rows.forEach(r => { const months = Number(r.Aging_Days || r.AgingDays || 0) / 30.4375; if (months <= 3) buckets["0-3"] += 1; else if (months <= 7) buckets["4-7"] += 1; else buckets["more than 7"] += 1; });
      return { labels: Object.keys(buckets), values: Object.values(buckets) };
    }
    const skyBarLabelErrorPlugin = { id: 'skyBarLabelErrorPlugin' };
    function updateSkyCharts(rows) {
      if (typeof Chart === "undefined") return;
      const queueRows = chartRowsByField(rows, "Brand", document.getElementById("skyQueueChartBrandFilter")?.value || "");
      const brandRows = chartRowsByField(rows, "Queue", document.getElementById("skyBrandChartQueueFilter")?.value || "");
      const openRows = rows.filter(isSkyOpenRow);
      const openStageBase = chartRowsByField(openRows, "Branch", document.getElementById("skyStageChartBranchFilter")?.value || "").filter(r => !isDeliveredOrReadyStage(r.Stage));
      const openBranchBase = chartRowsByField(openRows, "Stage", document.getElementById("skyBranchChartStageFilter")?.value || "");
      const readyRows = chartRowsByField(rows.filter(r => r.Queue === "Ready For Delivery Cases"), "Brand", document.getElementById("skyReadyAgingBrandFilter")?.value || "");
      const stageAllRows = chartRowsByField(rows, "Queue", document.getElementById("skyStageAllQueueFilter")?.value || "");
      const queue = topCountsAllKeep(queueRows, "Queue", SKY_V18_QUEUE_VALUES), brand = topCountsAllKeep(brandRows, "Brand", ["Samsung", "Apple"]), stage = topCountsAllKeep(openStageBase, "Stage"), branch = topCountsAllKeep(openBranchBase, "Branch"), readyAging = readyAgingMonthBuckets(readyRows), stageAll = topCountsAllKeep(stageAllRows, "Stage");
      setSkyChartSummary("skyQueueSummary", queue.labels, queue.values, queueRows.length); setSkyChartSummary("skyBrandSummary", brand.labels, brand.values, brandRows.length); setSkyChartSummary("skyStageSummary", stage.labels, stage.values, openStageBase.length); setSkyChartSummary("skyBranchSummary", branch.labels, branch.values, openBranchBase.length); setSkyChartSummary("skyReadyAgingSummary", readyAging.labels, readyAging.values, readyRows.length); setSkyChartSummary("skyStageAllSummary", stageAll.labels, stageAll.values, stageAllRows.length);
      createSkyColumnChart("skyQueueChart", displayLabelsWithPct(queue.labels, queue.values, queueRows.length), queue.values, "Cases", label => setSkyQueue(label.split(" (")[0]), false);
      createSkyColumnChart("skyBrandChart", displayLabelsWithPct(brand.labels, brand.values, brandRows.length), brand.values, "Cases", label => setSkyBrand(label.split(" (")[0]), false);
      createSkyColumnChart("skyStageChart", displayLabelsWithPct(stage.labels, stage.values, openStageBase.length), stage.values, "Open Cases", label => filterSkyMulti("skyStageFilter", label.split(" (")[0]), false);
      createSkyColumnChart("skyBranchChart", displayLabelsWithPct(branch.labels, branch.values, openBranchBase.length), branch.values, "Open Cases", label => filterSkyMulti("skyBranchFilter", label.split(" (")[0]), false);
      createSkyColumnChart("skyReadyAgingChart", readyAging.labels, readyAging.values, "Ready Cases", null, true);
      createSkyColumnChart("skyStageAllChart", displayLabelsWithPct(stageAll.labels, stageAll.values, stageAllRows.length), stageAll.values, "Cases", label => filterSkyMulti("skyStageFilter", label.split(" (")[0]), true);
    }
    function refreshSkyExcelFilterWidgets() { [{ id: "skyBranchFilter", multiple: true }, { id: "skyQueueFilter", multiple: false }, { id: "skyBrandFilter", multiple: false }, { id: "skyStageFilter", multiple: true }, { id: "skyJobTypeFilter", multiple: true }].forEach(createOrUpdateExcelFilter); }
    function createOrUpdateExcelFilter(config) {
      const select = document.getElementById(config.id); if (!select) return; select.style.display = "none"; let wrap = document.getElementById(config.id + "_excel"); if (!wrap) { wrap = document.createElement("div"); wrap.className = "excel-filter-container"; wrap.id = config.id + "_excel"; select.insertAdjacentElement("afterend", wrap); }
      const options = [...select.options].map(o => ({ value: o.value, text: o.textContent, selected: o.selected }));
      const selectedTexts = options.filter(o => o.selected && o.value !== "" && o.value !== ALL_VALUE).map(o => o.text);
      const allSelected = config.multiple ? options.some(o => o.value === ALL_VALUE && o.selected) || !selectedTexts.length : !select.value;
      const summary = allSelected ? "(Select All)" : selectedTexts.length > 2 ? `${selectedTexts.length} selected` : selectedTexts.join(", ");
      wrap.innerHTML = `<button type="button" class="excel-filter-button" title="${escapeHtml(summary || "(Select All)")}">${escapeHtml(summary || "(Select All)")}</button><div class="excel-filter-panel"><input class="excel-filter-search" placeholder="Search" /><div class="excel-filter-list"></div><div class="excel-filter-actions"><button type="button" class="ok">OK</button><button type="button" class="cancel">Cancel</button></div></div>`;
      const btn = wrap.querySelector(".excel-filter-button"), panel = wrap.querySelector(".excel-filter-panel"), list = wrap.querySelector(".excel-filter-list"), search = wrap.querySelector(".excel-filter-search");
      let tempSelected = new Set(config.multiple ? options.filter(o => o.selected).map(o => o.value) : [select.value || ""]); if (config.multiple && (!tempSelected.size || tempSelected.has(ALL_VALUE))) tempSelected = new Set([ALL_VALUE]);
      function positionPanel() { const rect = btn.getBoundingClientRect(); const width = Math.min(310, window.innerWidth - 24); let left = Math.min(Math.max(12, rect.left), window.innerWidth - width - 12); let top = rect.bottom + 6; const height = Math.min(330, window.innerHeight - 30); if (top + height > window.innerHeight) top = Math.max(12, rect.top - height - 6); panel.style.left = `${left}px`; panel.style.top = `${top}px`; panel.style.width = `${width}px`; panel.style.maxHeight = `${height}px`; list.style.maxHeight = `${Math.max(90, height - 122)}px`; }
      const close = () => wrap.classList.remove("open");
      btn.onclick = event => { event.stopPropagation(); document.querySelectorAll(".excel-filter-container.open").forEach(x => { if (x !== wrap) x.classList.remove("open"); }); wrap.classList.toggle("open"); if (wrap.classList.contains("open")) { positionPanel(); setTimeout(() => search.focus(), 0); } };
      panel.onclick = event => event.stopPropagation(); wrap.querySelector(".cancel").onclick = close; wrap.querySelector(".ok").onclick = () => { if (config.multiple) { [...select.options].forEach(opt => opt.selected = tempSelected.has(opt.value)); const selectedReal = [...select.options].filter(o => o.selected && o.value !== ALL_VALUE); const allOpt = [...select.options].find(o => o.value === ALL_VALUE); if (!selectedReal.length && allOpt) { [...select.options].forEach(o => o.selected = false); allOpt.selected = true; } } else { select.value = [...tempSelected][0] || ""; } close(); renderSky(); };
      function drawList(filter = "") { const term = filter.toLowerCase(); const visibleOptions = options.filter(o => !term || o.text.toLowerCase().includes(term)); list.innerHTML = visibleOptions.map(o => `<label class="excel-filter-option"><input type="checkbox" data-value="${escapeHtml(o.value)}" ${tempSelected.has(o.value) ? "checked" : ""}> <span>${escapeHtml(o.text)}</span></label>`).join(""); list.querySelectorAll("input[type=checkbox]").forEach(cb => { cb.onchange = () => { const val = cb.getAttribute("data-value"); if (config.multiple) { if (val === ALL_VALUE) { tempSelected = cb.checked ? new Set([ALL_VALUE]) : new Set(); } else { tempSelected.delete(ALL_VALUE); if (cb.checked) tempSelected.add(val); else tempSelected.delete(val); if (!tempSelected.size) tempSelected.add(ALL_VALUE); } drawList(search.value); } else { tempSelected = new Set([cb.checked ? val : ""]); list.querySelectorAll("input[type=checkbox]").forEach(x => { if (x !== cb) x.checked = false; }); } }; }); }
      search.oninput = () => drawList(search.value); window.addEventListener("resize", () => { if (wrap.classList.contains("open")) positionPanel(); }, { passive: true }); window.addEventListener("scroll", () => { if (wrap.classList.contains("open")) positionPanel(); }, { passive: true }); drawList();
    }

  

/* ===== master-performance-optimizations ===== */

/* Master Performance Fix - Applied: June 2026
   Fixes: duplicate renders, heavy polling, chart leaks */
(function() {
  'use strict';
  
  /* 1. Throttle window resize events */
  var _resizeTimer = null;
  var _origAddEventListener = window.addEventListener;
  
  /* 2. Clear all existing intervals on page hide to save resources */
  document.addEventListener('visibilitychange', function() {
    if (document.hidden && window._ivals) {
      window._ivals.forEach(function(iv) { clearInterval(iv); });
      window._ivals = [];
    }
  });
  
  /* 3. Defer non-critical work until after first paint */
  window._afterPaint = function(fn) {
    if (document.readyState === 'complete') {
      requestAnimationFrame(fn);
    } else {
      window.addEventListener('load', function() { requestAnimationFrame(fn); });
    }
  };
  
  /* 4. Safe chart destroy helper - prevents memory leaks */
  window._safeDestroyChart = function(charts, id) {
    if (charts && charts[id]) {
      try { charts[id].destroy(); } catch(e) {}
      delete charts[id];
    }
  };
  
  /* 5. Batch DOM reads to prevent layout thrashing */
  window._batchRead = function(fn) {
    return requestAnimationFrame(fn);
  };
  
})();


/* ===== inline-script-12 ===== */

    const STORAGE_KEY = "gspnTrackingDashboardRows_v4";
    const DB_NAME = "GSPNTrackingDashboardDB";
    const DB_STORE = "dashboardData";
    const ALL_VALUE = "__ALL__";

    const KPI_EXCLUDED_OUT_OF_WARRANTY_STATUSES = new Set([
      "Checking customer info (address, telephone etc.)",
      "Waiting for confirmation from customer",
      "Monitoring/Aging or Not reproduced"
    ]);

    const KPI_RULES = {
      "Carry In":          { days: 4, name: "LTP" },
      "Pickup Service":    { days: 4, name: "LTP" },
      "Insurance Service": { days: 4, name: "TAT" },
      "Inspection":        { days: 6, name: "TAT" },
      "Product Return":    { days: 6, name: "TAT" },
      "Return Handling":   { days: 6, name: "TAT" },
      "Before Service":    { days: 8, name: "TAT" },
      "Customer Care":     { days: 8, name: "TAT" },
      "Service Handling":  { days: 8, name: "TAT" }
    };

    const CLOSED_STATUSES = new Set([
      "Address/telephone not found",
      "Auto cancel by direct payment",
      "Can't contact Customer",
      "Can&apos;t contact Customer",
      "Cancelled",
      "Cancelled by Agent",
      "Cancelled by ASC",
      "Customer Not Home (More than X times)",
      "Customer Request (by agent)",
      "Customer Request (by ASC)",
      "Customer request (Cost issue)",
      "Customer request (Have asked outside contractors t",
      "Customer request (Reschedule for later)",
      "Goods Delivered",
      "Ready for pickup from customer",
      "Request to Shipping company after Repair",
      "Ship out repaired product",
      "Waiting for the customer to pick-up (Cancelled)",
      "Waiting for the customer to pick-up (Repair comple",
      "Waiting unit replace/refund/trade-in",
      "Wrong install center assigned"
    ]);

    const READY_STATUSES = new Set([
      "Repair Completed",
      "Repair completed (Wait for delivery by ASC)"
    ]);

    const ALL_CASE_COLUMNS = [
      ["GSPN_Branch", "Branch"],
      ["SO NO#", "SO NO#"],
      ["Job_Number", "Job No"],
      ["GSPN_Open_Date_Display", "GSPN Open Date"],
      ["Stage", "Stage"],
      ["GSPN_Status", "GSPN Status"],
      ["GSPN JobType", "Job Type"],
      ["GSPN Warranty", "GSPN Warranty"],
      ["AgingDays", "Aging Days"],
      ["AgingStatus", "Aging Status"],
      ["KPIAlert", "KPI Alert"],
      ["Model", "Model"],
      ["REDO", "REDO"]
    ];

    const URGENT_COLUMNS = [
      ["PriorityRank", "Priority"],
      ["GSPN_Branch", "Branch"],
      ["SO NO#", "SO NO#"],
      ["Job_Number", "Job No"],
      ["GSPN_Open_Date_Display", "GSPN Open Date"],
      ["REDO", "REDO"],
      ["Stage", "Stage"],
      ["GSPN JobType", "Job Type"],
      ["GSPN Warranty", "GSPN Warranty"],
      ["GSPN_Status", "GSPN Status"],
      ["AgingDays", "Aging Days"],
      ["KPIFailDays", "Fail Days"],
      ["KPIFailName", "Failed Type"],
      ["DaysRemaining", "Remaining"],
      ["KPIAlert", "KPI Alert"],
      ["ActionRequired", "Action Required"],
      ["GSPN Assigned_To", "Technician"]
    ];

    let allRows = [];
    let currentFilteredRows = [];
    let currentUrgentRows = [];
    let quickFilter = null;
    let appliedFromDate = null;
    let appliedToDate = null;
    let refreshingFilters = false;
    let dashboardCharts = {};

    document.addEventListener("DOMContentLoaded", () => {
      requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove("no-first-transition")));
      loadLayoutPreferences();
      initDatePickers();
      wireEvents();
      const startDashboard = async () => {
        await loadSavedRows();
        render();
      };
      (window.requestIdleCallback || function(cb){ return setTimeout(cb, 250); })(startDashboard, { timeout: 1500 });
    });

    function initDatePickers() {
      if (window.jQuery && $.fn.datepicker) {
        $("#fromDate, #toDate").datepicker({
          dateFormat: "dd/M/yy",
          changeMonth: true,
          changeYear: true,
          showAnim: "fadeIn"
        });
      }
    }

    function wireEvents() {
      document.getElementById("fileInput").addEventListener("change", handleFile);
      ["branchFilter", "techFilter", "warrantyFilter", "alertFilter", "jobTypeFilter"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("change", () => onMultiFilterChange(id));
        el.addEventListener("input", () => onMultiFilterChange(id));
      });
      ["fromDate", "toDate"].forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener("keydown", event => {
          if (event.key === "Enter") applyDateFilter();
        });
      });

      const searchBox = document.getElementById("searchBox");
      searchBox.addEventListener("input", debounce(() => { quickFilter = null; render(); }, 150));
      searchBox.addEventListener("change", debounce(() => { quickFilter = null; render(); }, 150));
    }

    function handleFile(e) {
      const file = e.target.files[0];
      if (!file) return;

      setUploadProgress(0, "Reading file...", "The file upload has started. Please wait until the data is fully loaded.", true);
      const reader = new FileReader();

      reader.onprogress = evt => {
        if (evt.lengthComputable) {
          const percent = Math.round((evt.loaded / evt.total) * 70);
          setUploadProgress(percent, `Uploading file: ${percent}%`, "Reading the selected file and preparing it for processing.", true);
        } else {
          setUploadProgress(35, "Uploading file...", "Reading the selected file and preparing it for processing.", true);
        }
      };

      reader.onload = async evt => {
        try {
          setUploadProgress(75, "Processing workbook...", "The file has been read. The dashboard is now converting and validating the rows.", true);
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: "array", cellDates: true });
          const sheetName = workbook.SheetNames.includes("GSPN Cases Tracking")
            ? "GSPN Cases Tracking"
            : workbook.SheetNames[0];

          const sheet = workbook.Sheets[sheetName];
          const raw = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: true });
          setUploadProgress(90, "Finalizing data...", "Rows are being normalized, KPI values are being calculated, and filters are being refreshed.", true);
          await setRows(raw);
          setUploadProgress(100, "Upload completed: 100%", `Data upload completed successfully. ${allRows.length} valid rows are now available in the dashboard and saved for refresh.`, true);
        } catch (err) {

          const message = err && err.message ? err.message : "Unknown error";
          setUploadProgress(0, "Upload failed", `The file was selected, but the dashboard could not process it. Details: ${message}`, true);
        } finally {
          e.target.value = "";
        }
      };

      reader.onerror = () => {
        setUploadProgress(0, "Upload failed", "The file could not be read. Please try again.", true);
      };

      reader.readAsArrayBuffer(file);
    }

    async function setRows(rawRows) {
      allRows = rawRows.map(normalizeRow).filter(r => r["SO NO#"] || r.Job_Number || r["GSPN Serial"]);
      resetFiltersToAll();
      refreshFilterLists();
      render();
      await saveRowsToBrowser(rawRows);
    }

    async function loadSavedRows() {
      try {
        const rawRows = await loadRowsFromBrowser();
        if (rawRows && Array.isArray(rawRows)) {
          allRows = rawRows.map(normalizeRow).filter(r => r["SO NO#"] || r.Job_Number || r["GSPN Serial"]);
          setUploadProgress(100, "Saved data loaded", `${allRows.length} saved rows were restored from this browser.`, true);
        }
      } catch (err) {

        allRows = [];
      }
      refreshFilterLists();
    }

    function openDashboardDb() {
      return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
          reject(new Error("IndexedDB is not available in this browser"));
          return;
        }
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = event => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(DB_STORE)) {
            db.createObjectStore(DB_STORE, { keyPath: "id" });
          }
        };
        request.onsuccess = event => resolve(event.target.result);
        request.onerror = event => reject(event.target.error || new Error("Could not open browser storage"));
      });
    }

    async function saveRowsToBrowser(rawRows) {
      try {
        const db = await openDashboardDb();
        await new Promise((resolve, reject) => {
          const tx = db.transaction(DB_STORE, "readwrite");
          tx.objectStore(DB_STORE).put({ id: STORAGE_KEY, rows: rawRows, savedAt: new Date().toISOString() });
          tx.oncomplete = resolve;
          tx.onerror = event => reject(event.target.error || new Error("Could not save data in browser storage"));
        });
        db.close();
      } catch (err) {

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(rawRows));
        } catch (localErr) {

          setUploadProgress(100, "Upload completed: 100%", "Data is loaded now, but your browser storage is full so it may not remain after refresh. Please export if needed.", true);
        }
      }
    }

    async function loadRowsFromBrowser() {
      try {
        const db = await openDashboardDb();
        const result = await new Promise((resolve, reject) => {
          const tx = db.transaction(DB_STORE, "readonly");
          const request = tx.objectStore(DB_STORE).get(STORAGE_KEY);
          request.onsuccess = event => resolve(event.target.result);
          request.onerror = event => reject(event.target.error || new Error("Could not read saved data"));
        });
        db.close();
        if (result && Array.isArray(result.rows)) return result.rows;
      } catch (err) {

      }
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    }

    function normalizeRow(row) {
      const today = new Date();
      const statusFinal = getStatusFinal(row);
      const isClosedOrReady = statusFinal === "Closed" || statusFinal === "Ready";
      const openDate = parseExcelDate(getFirst(row, ["GSPN_Open_Date", "GSPN Open Date", "Open Date", "GSPN OPEN DATE"]));
      const repairDate = parseExcelDate(getFirst(row, ["Repair Completed", "Repair Completed Date", "Repair_Completed", "Repair completed", "RepairCompleted"]));
      const jobType = clean(getFirst(row, ["GSPN JobType", "GSPN_JobType", "Job Type", "GSPN Job Type"]));
      const warranty = clean(getFirst(row, ["GSPN Warranty", "GSPN_Warranty", "Warranty", "Warranty Status"]));
      const rule = KPI_RULES[jobType] || null;
      const isKpiExcluded = isKpiExcludedCase(clean(getFirst(row, ["GSPN_Status", "GSPN Status", "Status"])), warranty);

      // KPI days start from the day AFTER GSPN Open Date, so the open day itself is not counted.
      const agingDays = isClosedOrReady ? "Closed" : openDate ? kpiDaysBetween(openDate, today) : "";
      const failDays = isKpiExcluded ? "" : rule ? rule.days : "";
      const failName = isKpiExcluded ? "Excluded" : rule ? rule.name : "";
      const dueDate = openDate && failDays !== "" && !isClosedOrReady ? addDays(openDate, failDays) : "";
      const daysRemaining = typeof agingDays === "number" && failDays !== "" ? failDays - agingDays : "";
      const repairDuration = openDate && repairDate && repairDate >= openDate ? kpiDaysBetween(openDate, repairDate) : "";
      const agingStatus = getAgingStatus(statusFinal, failDays, daysRemaining, failName, isKpiExcluded);
      const kpiAlert = getKpiAlert(statusFinal, failDays, daysRemaining, failName, isKpiExcluded);
      const actionRequired = getAction(kpiAlert);
      const priority = getPriority(kpiAlert);
      const kpiResult = getKpiResult(statusFinal, failDays, failName, agingDays, repairDuration, isKpiExcluded);

      return {
        ...row,
        GSPN_Branch: clean(getFirst(row, ["GSPN_Branch", "GSPN Branch", "Branch"])),
        "SO NO#": clean(getFirst(row, ["SO NO#", "SO NO", "SO", "SO Number"])),
        Job_Number: clean(getFirst(row, ["Job_Number", "Job Number", "Job No", "Job"])),
        GSPN_Status: clean(getFirst(row, ["GSPN_Status", "GSPN Status", "Status"])),
        Stage: clean(getFirst(row, ["Stage", "GSPN Stage", "GSPN_Stage"])),
        Model: clean(getFirst(row, ["Model", "Model Code"])),
        "GSPN Serial": clean(getFirst(row, ["GSPN Serial", "Serial", "Serial No", "IMEI"])),
        "GSPN JobType": jobType,
        "GSPN Warranty": warranty,
        "GSPN Assigned_To": clean(getFirst(row, ["GSPN Assigned_To", "GSPN Assigned To", "Assigned_To", "Technician", "Engineer"])),
        REDO: clean(getFirst(row, ["REDO", "Redo", "ReDo", "RE-DO", "Re-Do"])),
        StatusFinal: statusFinal,
        GSPN_Open_Date_Value: openDate ? dateOnlyTime(openDate) : null,
        GSPN_Open_Date_Display: openDate ? formatDate(openDate) : "",
        RepairCompletedDateValue: repairDate ? dateOnlyTime(repairDate) : null,
        RepairCompletedDateDisplay: repairDate ? formatDate(repairDate) : "",
        AgingDays: agingDays,
        AgingStatus: clean(getFirst(row, ["Aging Status", "Aging_Status", "AgingStatus"])) || agingStatus,
        KPIFailDays: failDays,
        KPIFailName: failName,
        KPIDueDate: dueDate ? formatDate(dueDate) : "",
        DaysRemaining: daysRemaining,
        KPIAlert: kpiAlert,
        KPIResult: kpiResult,
        ActionRequired: actionRequired,
        PriorityRank: priority,
        RepairDurationDays: repairDuration,
        IsKpiExcluded: isKpiExcluded
      };
    }

    function getFirst(row, keys) {
      for (const key of keys) {
        if (Object.prototype.hasOwnProperty.call(row, key) && row[key] !== "") return row[key];
      }

      const normalizeKey = value => String(value ?? "")
        .toLowerCase()
        .replace(/&amp;/g, "&")
        .replace(/[^a-z0-9]/g, "");

      const wanted = keys.map(normalizeKey);
      const actualKeys = Object.keys(row);
      for (const actualKey of actualKeys) {
        const normalizedActual = normalizeKey(actualKey);
        if (wanted.includes(normalizedActual) && row[actualKey] !== "") return row[actualKey];
      }

      return "";
    }

    function getNoChangeDays(row, statusFinal, openDate, agingDays) {
      if (statusFinal !== "Open") return "";
      const rawAging = getFirst(row, ["GSPN Aging Days", "GSPN_Aging_Days", "Aging Days", "Aging"]);
      const rawNumber = parseNumber(rawAging);
      if (typeof rawNumber === "number") return rawNumber;
      if (typeof agingDays === "number") return agingDays;
      if (openDate) return daysBetween(openDate, new Date());
      return "";
    }

    function getNoActionStatus(days) {
      if (typeof days !== "number") return "Review";
      if (days >= 7) return "No Action 7+ Days";
      if (days >= 3) return "No Action 3+ Days";
      if (days >= 1) return "No Action 1+ Day";
      return "New / Today";
    }

    function parseNumber(value) {
      if (value === null || value === undefined || value === "") return null;
      const n = Number(String(value).replace(/[^0-9.-]/g, ""));
      return Number.isFinite(n) ? n : null;
    }

    function isKpiExcludedCase(status, warranty) {
      return clean(warranty).toLowerCase() === "out of warranty" && KPI_EXCLUDED_OUT_OF_WARRANTY_STATUSES.has(clean(status));
    }

    function getStatusFinal(row) {
      const existing = clean(getFirst(row, ["Status Final", "StatusFinal", "Final Status"]));
      if (existing) return existing;
      const status = clean(getFirst(row, ["GSPN_Status", "GSPN Status", "Status"]));
      if (CLOSED_STATUSES.has(status)) return "Closed";
      if (READY_STATUSES.has(status)) return "Ready";
      return "Open";
    }

    function getAgingStatus(statusFinal, failDays, remaining, failName, isKpiExcluded = false) {
      if (isKpiExcluded) return "Excluded from KPI";
      if (statusFinal === "Closed" || statusFinal === "Ready") return "Closed";
      if (failDays === "") return "No KPI Rule";
      if (remaining <= 0) return `FAIL ${failName}`;
      if (remaining === 1) return "Critical";
      if (remaining === 2) return "Warning";
      return "Normal";
    }

    function getKpiAlert(statusFinal, failDays, remaining, failName, isKpiExcluded = false) {
      if (isKpiExcluded) return "Excluded";
      if (statusFinal === "Closed" || statusFinal === "Ready") return "Done";
      if (failDays === "") return "Review";
      if (remaining <= 0) return `Failed - ${failName}`;
      if (remaining === 1) return "Fix Today";
      if (remaining === 2) return "Watch";
      return "On Track";
    }

    function getKpiResult(statusFinal, failDays, failName, agingDays, repairDuration, isKpiExcluded = false) {
      if (isKpiExcluded) return "Excluded from KPI";
      if (failDays === "") return "No KPI Rule";
      const compareDays = (statusFinal === "Closed" || statusFinal === "Ready") ? repairDuration : agingDays;
      if (typeof compareDays !== "number") return "Pending Date";
      return compareDays >= failDays ? `Failed - ${failName}` : "Passed";
    }

    function getAction(alert) {
      if (String(alert).startsWith("Failed")) return "Repair or close in system immediately";
      return {
        "Done": "No action",
        "Excluded": "Excluded from KPI by warranty/status rule",
        "Review": "Review job type / add KPI rule",
        "Fix Today": "Top priority: close today",
        "Watch": "Urgent follow-up within 48 hours",
        "On Track": "Normal follow-up"
      }[alert] || "";
    }

    function getPriority(alert) {
      if (String(alert).startsWith("Failed")) return 1;
      return {
        "Fix Today": 2,
        "Watch": 3,
        "Review": 4,
        "On Track": 5,
        "Excluded": 8,
        "Done": 9
      }[alert] || 9;
    }

    function render() {
      refreshFilterLists();
      const rows = getFilteredRows();
      currentFilteredRows = rows;

      const total = rows.length;
      const openRows = rows.filter(r => r.StatusFinal === "Open");
      const closedRows = rows.filter(r => r.StatusFinal === "Closed" || r.StatusFinal === "Ready");
      const failedRows = rows.filter(r => String(r.KPIResult).startsWith("Failed"));
      const ltpFailedRows = rows.filter(r => r.KPIResult === "Failed - LTP");
      const ltpInWarrantyRows = ltpFailedRows.filter(isInWarrantyCase);
      const ltpOutWarrantyRows = ltpFailedRows.filter(isOutWarrantyCase);
      const tatFailedRows = rows.filter(r => r.KPIResult === "Failed - TAT");
      const fixRows = rows.filter(r => r.KPIAlert === "Fix Today");
      const watchRows = rows.filter(r => r.KPIAlert === "Watch");

      setText("openCases", openRows.length);
      setText("openPercent", `${pct(openRows.length, total)}% of Total`);
      setText("closedCases", closedRows.length);
      setText("closedPercent", `${pct(closedRows.length, total)}% of Total`);
      setText("failedCases", failedRows.length);
      setText("failedPercent", `${pct(failedRows.length, total)}% of Total`);
      setText("ltpInWarrantyCases", ltpInWarrantyRows.length);
      setText("ltpInWarrantyPercent", `${pct(ltpInWarrantyRows.length, failedRows.length)}% of Failed KPI`);
      setText("ltpOutWarrantyCases", ltpOutWarrantyRows.length);
      setText("ltpOutWarrantyPercent", `${pct(ltpOutWarrantyRows.length, failedRows.length)}% of Failed KPI`);
      setText("tatFailedCases", tatFailedRows.length);
      setText("tatFailedPercent", `${pct(tatFailedRows.length, failedRows.length)}% of Failed KPI`);
      setText("fixTodayCases", fixRows.length);
      setText("fixTodayPercent", `${pct(fixRows.length, openRows.length)}% of Open`);
      setText("watchCases", watchRows.length);
      setText("watchPercent", `${pct(watchRows.length, openRows.length)}% of Open`);

      const repairRows = rows.filter(r => typeof r.RepairDurationDays === "number");
      const avgRepair = repairRows.length ? avg(repairRows.map(r => r.RepairDurationDays)) : 0;
      setText("avgRepair", avgRepair.toFixed(1));

      updateCharts(rows);

      currentUrgentRows = rows
        .filter(r => String(r.KPIResult).startsWith("Failed") || ["Fix Today", "Watch", "Review"].includes(r.KPIAlert))
        .sort((a,b) =>
          a.PriorityRank - b.PriorityRank ||
          Number(a.DaysRemaining || 999) - Number(b.DaysRemaining || 999) ||
          Number(b.AgingDays || 0) - Number(a.AgingDays || 0)
        );

      renderTable("casesTable", rows.slice(0, 800), ALL_CASE_COLUMNS, true);
      renderTable("urgentTable", currentUrgentRows.slice(0, 100), URGENT_COLUMNS, true);
      renderPerformance("bestBranches", rows, "GSPN_Branch", true);
      renderPerformance("worstBranches", rows, "GSPN_Branch", false);
      renderPerformance("bestTechs", rows, "GSPN Assigned_To", true, true);
      renderPerformance("worstTechs", rows, "GSPN Assigned_To", false, true);
    }

    function updateCharts(rows) {
      if (typeof Chart === "undefined") return;

      const openRows = rows.filter(r => r.StatusFinal === "Open");
      const failedLtp = rows.filter(r => r.KPIResult === "Failed - LTP").length;
      const failedTat = rows.filter(r => r.KPIResult === "Failed - TAT").length;
      const fixToday = rows.filter(r => r.KPIAlert === "Fix Today").length;
      const watch = rows.filter(r => r.KPIAlert === "Watch").length;
      const onTrack = rows.filter(r => r.KPIAlert === "On Track").length;
      const review = rows.filter(r => r.KPIAlert === "Review").length;
      const done = rows.filter(r => r.KPIAlert === "Done").length;

      const failedTotal = failedLtp + failedTat;
      const failedLabels = [
        `LTP Failed (${pct(failedLtp, failedTotal)}%)`,
        `TAT Failed (${pct(failedTat, failedTotal)}%)`
      ];
      createOrUpdateChart("failedReasonChart", "doughnut", failedLabels, [failedLtp, failedTat], "Failed KPI", false, (label) => {
        if (label.includes("LTP")) showFailedType("LTP");
        if (label.includes("TAT")) showFailedType("TAT");
      });

      createOrUpdateChart("kpiChart", "bar", ["Failed LTP", "Failed TAT", "Fix Today", "Watch 48h", "On Track", "Review", "Done"], [failedLtp, failedTat, fixToday, watch, onTrack, review, done], "Cases", false, (label) => {
        if (label === "Failed LTP") showFailedType("LTP");
        else if (label === "Failed TAT") showFailedType("TAT");
        else if (label === "Fix Today") showOnlyAlert("Fix Today");
        else if (label === "Watch 48h") showOnlyAlert("Watch");
      });

      const branchTop = topCounts(openRows, "GSPN_Branch", 10);
      createOrUpdateChart("branchChart", "bar", branchTop.labels, branchTop.values, "Open Cases", true, (label) => filterByBranch(label));

      const statusTop = topCounts(openRows, "GSPN_Status", 10);
      createOrUpdateChart("techChart", "bar", statusTop.labels, statusTop.values, "Open Cases", true, (label) => filterByGspnStatus(label));

      const repairTop = topAverageRepairDays(rows, "GSPN_Branch", 10);
      createOrUpdateChart("repairDaysChart", "bar", repairTop.labels, repairTop.values, "Avg Repair Days", true, (label) => filterByBranch(label));

      const agingBuckets = getAgingBuckets(rows);
      createOrUpdateChart("agingChart", "bar", agingBuckets.labels, agingBuckets.values, "Open Cases");
    }

    function createOrUpdateChart(canvasId, type, labels, values, datasetLabel, horizontal = false, onLabelClick = null) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      if (dashboardCharts[canvasId]) {
        dashboardCharts[canvasId].destroy();
      }

      const isDoughnut = type === "doughnut";
      dashboardCharts[canvasId] = __safeNewChart(canvas, {
        type,
        data: {
          labels,
          datasets: [{
            label: datasetLabel,
            data: values,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: horizontal ? "y" : "x",
          onClick: (event, elements) => {
            if (!onLabelClick || !elements.length) return;
            const index = elements[0].index;
            onLabelClick(labels[index]);
          },
          plugins: {
            legend: { display: isDoughnut, position: "bottom" },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const total = ctx.dataset.data.reduce((a,b) => a + Number(b || 0), 0);
                  const percent = total ? ((Number(ctx.raw || 0) / total) * 100).toFixed(1) : "0.0";
                  return isDoughnut ? `${ctx.label}: ${ctx.raw} (${percent}%)` : `${ctx.label || ctx.dataset.label}: ${ctx.raw}`;
                }
              }
            }
          },
          scales: isDoughnut ? {} : {
            x: { ticks: { autoSkip: false, maxRotation: horizontal ? 0 : 45, minRotation: 0 } },
            y: { beginAtZero: true }
          }
        }
      });
    }

    function topCounts(rows, field, limit) {
      const counts = {};
      rows.forEach(r => {
        const key = clean(r[field]) || "Blank";
        counts[key] = (counts[key] || 0) + 1;
      });
      const sorted = Object.entries(counts)
        .sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, limit);
      return { labels: sorted.map(x => x[0]), values: sorted.map(x => x[1]) };
    }

    function topAverageRepairDays(rows, field, limit) {
      const groups = {};
      rows.forEach(r => {
        if (typeof r.RepairDurationDays !== "number") return;
        const key = clean(r[field]) || "Blank";
        if (!groups[key]) groups[key] = [];
        groups[key].push(r.RepairDurationDays);
      });
      const sorted = Object.entries(groups)
        .map(([name, arr]) => ({ name, avgDays: Number(avg(arr).toFixed(1)), cases: arr.length }))
        .sort((a,b) => b.avgDays - a.avgDays || b.cases - a.cases)
        .slice(0, limit);
      return { labels: sorted.map(x => x.name), values: sorted.map(x => x.avgDays) };
    }

    function getAgingBuckets(rows) {
      const buckets = { "0-2 Days": 0, "3-5 Days": 0, "6-10 Days": 0, "11-20 Days": 0, ">20 Days": 0 };
      rows.filter(r => r.StatusFinal === "Open" && typeof r.AgingDays === "number").forEach(r => {
        const d = r.AgingDays;
        if (d <= 2) buckets["0-2 Days"]++;
        else if (d <= 5) buckets["3-5 Days"]++;
        else if (d <= 10) buckets["6-10 Days"]++;
        else if (d <= 20) buckets["11-20 Days"]++;
        else buckets[">20 Days"]++;
      });
      return { labels: Object.keys(buckets), values: Object.values(buckets) };
    }

    function renderPerformance(tableId, rows, field, ascending, excludeBlank = false) {
      const valid = rows.filter(r =>
        typeof r.RepairDurationDays === "number" &&
        clean(r[field]) &&
        (!excludeBlank || clean(r[field]) !== "-")
      );

      const groups = {};
      valid.forEach(r => {
        const key = clean(r[field]);
        if (!groups[key]) groups[key] = [];
        groups[key].push(r.RepairDurationDays);
      });

      const type = field.includes("Branch") ? "branchCompleted" : "techCompleted";
      const maxType = field.includes("Branch") ? "branchMaxCompleted" : "techMaxCompleted";
      const output = Object.entries(groups).map(([name, arr]) => {
        const maxDays = Math.max(...arr);
        return {
          Name: name,
          CompletedCases: arr.length,
          CompletedCasesLink: `<a href="#" class="count-link" title="Show completed cases" onclick="filterPerformanceCases('${type}', '${escapeJs(name)}'); return false;">${arr.length}</a>`,
          AvgRepairDays: avg(arr),
          MaxRepairDays: maxDays,
          MaxRepairDaysLink: `<a href="#" class="metric-link" title="Show cases with max repair days" onclick="filterPerformanceMaxCases('${maxType}', '${escapeJs(name)}', ${maxDays}); return false;">${maxDays.toFixed(1)}</a>`
        };
      })
      .sort((a,b) => ascending
        ? a.AvgRepairDays - b.AvgRepairDays || b.CompletedCases - a.CompletedCases
        : b.AvgRepairDays - a.AvgRepairDays || b.CompletedCases - a.CompletedCases
      )
      .slice(0, 10);

      renderTable(tableId, output, [
        ["Name", field.includes("Branch") ? "Branch" : "Technician"],
        ["CompletedCasesLink", "Completed Cases"],
        ["AvgRepairDays", "Avg Repair Days"],
        ["MaxRepairDaysLink", "Max Repair Days"]
      ], false, ["CompletedCasesLink", "MaxRepairDaysLink"]);
    }

    function renderTable(tableId, rows, columns, badges = false, htmlKeys = []) {
      const table = document.getElementById(tableId);
      if (!rows.length) {
        table.innerHTML = `<tr><td>No data available</td></tr>`;
        return;
      }

      const thead = `<thead><tr>${columns.map(c => `<th>${escapeHtml(c[1])}</th>`).join("")}</tr></thead>`;
      const tbody = rows.map(r => `<tr>${columns.map(([key]) => {
        let val = r[key] ?? "";
        if (typeof val === "number" && key.toLowerCase().includes("avg")) val = val.toFixed(1);
        if (typeof val === "number" && key.toLowerCase().includes("max")) val = val.toFixed(1);
        if (htmlKeys.includes(key)) return `<td>${val}</td>`;
        if (badges && (key === "KPIAlert" || key === "KPIResult")) return `<td>${badge(val)}</td>`;
        return `<td>${escapeHtml(val)}</td>`;
      }).join("")}</tr>`).join("");

      table.innerHTML = thead + `<tbody>${tbody}</tbody>`;
    }

    function badge(value) {
      const cls = String(value).replace(/[^a-zA-Z0-9]/g, "");
      return `<span class="badge ${cls}">${escapeHtml(value)}</span>`;
    }

    function refreshFilterLists() {
      if (refreshingFilters) return;
      refreshingFilters = true;

      const selectedBranches = getSelectedValues("branchFilter");
      const selectedTechs = getSelectedValues("techFilter");
      const selectedWarranties = getSelectedValues("warrantyFilter");
      const selectedAlerts = getSelectedValues("alertFilter");
      const selectedJobTypes = getSelectedValues("jobTypeFilter");

      fillSelect("branchFilter", unique(allRows.map(r => r.GSPN_Branch)), selectedBranches, "All Branches");
      const branchScope = selectedBranches.length && !selectedBranches.includes(ALL_VALUE)
        ? allRows.filter(r => selectedBranches.includes(r.GSPN_Branch))
        : allRows;
      fillSelect("techFilter", unique(branchScope.map(r => r["GSPN Assigned_To"]).filter(v => v && v !== "-")), selectedTechs, "All Technicians");
      fillSelect("warrantyFilter", unique(allRows.map(r => r["GSPN Warranty"])), selectedWarranties, "All GSPN Warranty");
      if (document.getElementById("jobTypeFilter")) {
        fillSelect("jobTypeFilter", unique(allRows.map(r => r["GSPN JobType"] || r.JobType || r["Job Type"])), selectedJobTypes, "All GSPN JobType");
      }
      fillSelect("alertFilter", ["Failed - LTP", "Failed - TAT", "Fix Today", "Watch", "On Track", "Review", "Excluded", "Done"], selectedAlerts, "All KPI Alerts");

      refreshingFilters = false;
    }

    function fillSelect(id, values, selectedValues = [], allText = "All") {
      const select = document.getElementById(id);
      const safeSelected = selectedValues.length ? selectedValues : [ALL_VALUE];
      const options = [`<option value="${ALL_VALUE}" ${safeSelected.includes(ALL_VALUE) ? "selected" : ""}>${escapeHtml(allText)}</option>`]
        .concat(values.map(v => {
          const selected = safeSelected.includes(v) && !safeSelected.includes(ALL_VALUE) ? "selected" : "";
          return `<option value="${escapeHtml(v)}" ${selected}>${escapeHtml(v)}</option>`;
        }));
      select.innerHTML = options.join("");
    }

    function onMultiFilterChange(id) {
      if (refreshingFilters) return;
      const select = document.getElementById(id);
      const selectedRaw = Array.from(select.selectedOptions).map(o => o.value);

      if (selectedRaw.length === 0) {
        Array.from(select.options).forEach(o => o.selected = o.value === ALL_VALUE);
      } else if (selectedRaw.includes(ALL_VALUE) && selectedRaw.length > 1) {
        Array.from(select.options).forEach(o => { if (o.value === ALL_VALUE) o.selected = false; });
      }

      quickFilter = null;
      render();
    }

    function resetFiltersToAll() {
      ["branchFilter", "techFilter", "warrantyFilter", "alertFilter", "jobTypeFilter"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        Array.from(el.options).forEach(o => o.selected = o.value === ALL_VALUE);
      });
      document.getElementById("fromDate").value = "";
      document.getElementById("toDate").value = "";
      document.getElementById("searchBox").value = "";
      appliedFromDate = null;
      appliedToDate = null;
      quickFilter = null;
    }

    function getSelectedValues(id) {
      const values = Array.from(document.getElementById(id).selectedOptions).map(o => o.value);
      if (!values.length || values.includes(ALL_VALUE)) return [];
      return values;
    }

    function getFilteredRows() {
      const branches = getSelectedValues("branchFilter");
      const techs = getSelectedValues("techFilter");
      const warranties = getSelectedValues("warrantyFilter");
      const alerts = getSelectedValues("alertFilter");
      const jobTypes = getSelectedValues("jobTypeFilter");
      const fromDate = appliedFromDate;
      const toDate = appliedToDate;
      const q = document.getElementById("searchBox").value.toLowerCase().trim();

      return allRows.filter(r => {
        if (branches.length && !branches.includes(r.GSPN_Branch)) return false;
        if (techs.length && !techs.includes(r["GSPN Assigned_To"])) return false;
        if (warranties.length && !warranties.includes(r["GSPN Warranty"])) return false;
        if (alerts.length && !alerts.includes(r.KPIAlert)) return false;
        if (jobTypes.length && !jobTypes.includes(String(r["GSPN JobType"] || r.JobType || r["Job Type"] || "").trim())) return false;
        if (fromDate && (!r.GSPN_Open_Date_Value || r.GSPN_Open_Date_Value < dateOnlyTime(fromDate))) return false;
        if (toDate && (!r.GSPN_Open_Date_Value || r.GSPN_Open_Date_Value > dateOnlyTime(toDate))) return false;

        if (quickFilter === "Open" && r.StatusFinal !== "Open") return false;
        if (quickFilter === "Closed" && !(r.StatusFinal === "Closed" || r.StatusFinal === "Ready")) return false;
        if (quickFilter === "Failed" && !String(r.KPIResult).startsWith("Failed")) return false;
        if (quickFilter === "Failed - LTP" && r.KPIResult !== "Failed - LTP") return false;
        if (quickFilter === "Failed - LTP In Warranty" && (r.KPIResult !== "Failed - LTP" || !isInWarrantyCase(r))) return false;
        if (quickFilter === "Failed - LTP Out Warranty" && (r.KPIResult !== "Failed - LTP" || !isOutWarrantyCase(r))) return false;
        if (quickFilter === "Failed - TAT" && r.KPIResult !== "Failed - TAT") return false;
        if (["Fix Today", "Watch"].includes(quickFilter) && r.KPIAlert !== quickFilter) return false;
        if (quickFilter && typeof quickFilter === "object") {
          if (quickFilter.type === "branch" && r.GSPN_Branch !== quickFilter.value) return false;
          if (quickFilter.type === "gspnStatus" && r.GSPN_Status !== quickFilter.value) return false;
          if (quickFilter.type === "branchCompleted" && (r.GSPN_Branch !== quickFilter.value || typeof r.RepairDurationDays !== "number")) return false;
          if (quickFilter.type === "techCompleted" && (r["GSPN Assigned_To"] !== quickFilter.value || typeof r.RepairDurationDays !== "number")) return false;
          if (quickFilter.type === "branchMaxCompleted" && (r.GSPN_Branch !== quickFilter.value || Number(r.RepairDurationDays) !== Number(quickFilter.maxDays))) return false;
          if (quickFilter.type === "techMaxCompleted" && (r["GSPN Assigned_To"] !== quickFilter.value || Number(r.RepairDurationDays) !== Number(quickFilter.maxDays))) return false;
        }

        if (q) {
          const haystack = [
            r["SO NO#"], r.Job_Number, r.Model, r["GSPN Serial"],
            r.GSPN_Status, r.GSPN_Branch, r["GSPN Assigned_To"], r["GSPN Warranty"]
          ].join(" ").toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      });
    }

    function showClosedCases() { quickFilter = "Closed"; render(); scrollToCases(); }
    function showOnlyStatus(status) { quickFilter = status; render(); scrollToCases(); }
    function showFailedCases() { quickFilter = "Failed"; render(); scrollToCases(); }
    function showFailedType(type) { quickFilter = `Failed - ${type}`; render(); scrollToCases(); }
    function showLtpWarrantyFailed(warrantyType) {
      quickFilter = warrantyType === "out" ? "Failed - LTP Out Warranty" : "Failed - LTP In Warranty";
      render();
      scrollToCases();
    }
    function showOnlyAlert(alert) { quickFilter = alert; render(); scrollToCases(); }
    function filterByBranch(branch) { quickFilter = { type: "branch", value: branch }; render(); scrollToCases(); }
    function filterByGspnStatus(status) { quickFilter = { type: "gspnStatus", value: status }; render(); scrollToCases(); }
    function filterPerformanceCases(type, value) { quickFilter = { type, value }; render(); scrollToCases(); }
    function filterPerformanceMaxCases(type, value, maxDays) { quickFilter = { type, value, maxDays: Number(maxDays) }; render(); scrollToCases(); }
    function scrollToCases() { document.getElementById("allCasesSection").scrollIntoView({ behavior: "smooth" }); }

    function applyDateFilter() {
      appliedFromDate = parseDateInput(document.getElementById("fromDate").value);
      appliedToDate = parseDateInput(document.getElementById("toDate").value);
      quickFilter = null;
      render();
      scrollToCases();
    }

    function clearFilters(scrollAfter = false) {
      resetFiltersToAll();
      refreshFilterLists();
      render();
      if (scrollAfter === true) scrollToCases();
    }

    function exportTableExcel(type) {
      const rows = type === "urgent" ? currentUrgentRows : currentFilteredRows;
      const columns = type === "urgent" ? URGENT_COLUMNS : ALL_CASE_COLUMNS;
      const sheetName = type === "urgent" ? "Urgent Worklist" : "All Filtered Cases";
      exportRowsToExcel(rows, columns, `${sheetName}.xlsx`, sheetName);
    }

    function loadLayoutPreferences() {
      const collapsed = localStorage.getItem("serviceEyeMenuCollapsed") === "1";
      const design = localStorage.getItem("serviceEyeDesign") || "volta";
      document.documentElement.classList.remove("prepaint-menu-collapsed");
      document.body.classList.toggle("menu-collapsed", collapsed);
      setDesign(design, false);
      requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove("no-first-transition")));
    }

    function toggleSideMenu() {
      const collapsed = !document.body.classList.contains("menu-collapsed");
      document.documentElement.classList.remove("prepaint-menu-collapsed");
      document.body.classList.toggle("menu-collapsed", collapsed);
      localStorage.setItem("serviceEyeMenuCollapsed", collapsed ? "1" : "0");
    }

    function setDesign(design, save = true) {
      const safeDesign = ["pro", "glass", "fresh", "volta"].includes(design) ? design : "volta";
      document.body.classList.remove("theme-pro", "theme-glass", "theme-fresh", "theme-volta");
      document.body.classList.add(`theme-${safeDesign}`);
      if (save) localStorage.setItem("serviceEyeDesign", safeDesign);
      if (save) {
        setTimeout(() => {
          if (currentFilteredRows && currentFilteredRows.length) updateCharts(currentFilteredRows);
        }, 50);
      }
    }

    function switchTab(tab) {
      const safeTab = ["gspn", "sky", "profit", "cashTarget", "userManagement", "dashboard", "preBooking", "returnCases", "receivedDelivered"].includes(tab) ? tab : "gspn" // FIX: added cashTarget + userManagement;
      localStorage.setItem("serviceEyeActiveTab", safeTab);
      document.querySelectorAll(".side-tab").forEach(el => { const oc = el.getAttribute("onclick") || ""; el.classList.toggle("active", oc.includes("'" + safeTab + "'") || oc.includes('"' + safeTab + '"')); });
      const gspnPage = document.getElementById("gspnPage"); const skyPage = document.getElementById("skyPage"); const profitPage = document.getElementById("profitPage");
      if (gspnPage) gspnPage.style.display = safeTab === "gspn" ? "block" : "none";
      if (skyPage) skyPage.style.display = safeTab === "sky" ? "block" : "none";
      if (profitPage) profitPage.style.display = safeTab === "profit" ? "block" : "none";
      applyTabDesign(safeTab, false);
      setTimeout(() => { if (safeTab === "gspn" && typeof currentFilteredRows !== "undefined" && currentFilteredRows && currentFilteredRows.length) updateCharts(currentFilteredRows); if (safeTab === "sky") renderSky(); if (safeTab === "profit") renderProfit(); }, 80);
    }

    function exportDashboardExcel() {
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, rowsToSheet(currentFilteredRows, ALL_CASE_COLUMNS), "All Filtered Cases");
      XLSX.utils.book_append_sheet(wb, rowsToSheet(currentUrgentRows, URGENT_COLUMNS), "Urgent Worklist");
      XLSX.writeFile(wb, "Service Support Center Export.xlsx");
    }

    function exportRowsToExcel(rows, columns, fileName, sheetName) {
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, rowsToSheet(rows, columns), sheetName);
      XLSX.writeFile(wb, fileName);
    }

    function rowsToSheet(rows, columns) {
      const data = rows.map(r => {
        const obj = {};
        columns.forEach(([key, label]) => obj[label] = r[key] ?? "");
        return obj;
      });
      return XLSX.utils.json_to_sheet(data);
    }

    // Snap a Date object to its intended calendar day. SheetJS with cellDates:true sometimes returns
    // Dates like 2026-05-13T20:59:51Z when the cell really means May 14 in Cairo (UTC+3) — the library
    // back-adjusts by the host timezone and undershoots by a few seconds via its 1900-leap-year fix.
    // The cell's intent is "local midnight of day X"; rounding to the nearest local-time day recovers X.
    function snapDateToLocalDay(d) {
      // Convert to local-clock milliseconds then round to the nearest local midnight.
      const localMs = d.getTime() - d.getTimezoneOffset() * 60000;
      const dayMs = 86400000;
      const roundedMs = Math.round(localMs / dayMs) * dayMs;
      const utc = new Date(roundedMs);
      return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
    }

    function parseExcelDate(value) {
      if (value === null || value === undefined || value === "" || value === "00-00-0000") return null;
      if (value instanceof Date && !isNaN(value)) {
        // Always snap — handles both clean UTC-midnight Dates and SheetJS-shifted ones uniformly.
        return snapDateToLocalDay(value);
      }

      if (typeof value === "number") {
        const utcDays = Math.floor(value - 25569);
        const utcValue = utcDays * 86400;
        const utc = new Date(utcValue * 1000);
        // Re-anchor to local midnight so getDate()/getFullYear() never shift the calendar day.
        return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
      }

      let text = String(value).trim();
      if (!text) return null;
      text = text.replace(/\s+/g, " ").replace(/,/g, "");

      const monthMap = {
        jan: 0, january: 0,
        feb: 1, february: 1,
        mar: 2, march: 2,
        apr: 3, april: 3,
        may: 4,
        jun: 5, june: 5,
        jul: 6, july: 6,
        aug: 7, august: 7,
        sep: 8, sept: 8, september: 8,
        oct: 9, october: 9,
        nov: 10, november: 10,
        dec: 11, december: 11
      };

      // Supports formats like 05/May/2026, 05-May-2026, 05 May 2026, May 05 2026
      const monthNameMatch = text.match(/^(?:(\d{1,2})[\/\-\s]+([A-Za-z]{3,9})[\/\-\s]+(\d{2,4})|([A-Za-z]{3,9})[\/\-\s]+(\d{1,2})[\/\-\s]+(\d{2,4}))$/);
      if (monthNameMatch) {
        let day, monthText, year;
        if (monthNameMatch[1]) {
          day = Number(monthNameMatch[1]);
          monthText = monthNameMatch[2].toLowerCase();
          year = Number(monthNameMatch[3]);
        } else {
          monthText = monthNameMatch[4].toLowerCase();
          day = Number(monthNameMatch[5]);
          year = Number(monthNameMatch[6]);
        }
        if (year < 100) year += 2000;
        if (monthText in monthMap) return new Date(year, monthMap[monthText], day);
      }

      const datePart = text.split(" ")[0];
      const parts = datePart.split(/[\/\-.]/).map(Number);
      if (parts.length === 3 && parts.every(n => !isNaN(n))) {
        let [a,b,c] = parts;
        if (c < 100) c += 2000;
        if (a > 12) return new Date(c, b - 1, a);       // DD/MM/YYYY
        if (b > 12) return new Date(c, a - 1, b);       // MM/DD/YYYY
        return new Date(c, b - 1, a);                   // default DD/MM/YYYY
      }

      const parsed = new Date(text);
      return isNaN(parsed) ? null : parsed;
    }

    function parseDateInput(value) {
      if (!value) return null;
      return parseExcelDate(value);
    }

    function dateOnlyTime(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    }

    function daysBetween(a, b) {
      const d1 = new Date(a.getFullYear(), a.getMonth(), a.getDate());
      const d2 = new Date(b.getFullYear(), b.getMonth(), b.getDate());
      return Math.round((d2 - d1) / 86400000);
    }

    function kpiDaysBetween(a, b) {
      // The GSPN open date is day zero. KPI counting starts from the next calendar day.
      return Math.max(0, daysBetween(a, b));
    }

    function addDays(date, days) {
      const d = new Date(date);
      d.setDate(d.getDate() + Number(days));
      return d;
    }

    function formatDate(date) {
      if (!(date instanceof Date) || isNaN(date)) return "";
      // Round to the nearest local-midnight so SheetJS back-adjustment artifacts can't shift the day.
      const localMs = date.getTime() - date.getTimezoneOffset() * 60000;
      const dayMs = 86400000;
      const utc = new Date(Math.round(localMs / dayMs) * dayMs);
      const day = String(utc.getUTCDate()).padStart(2, "0");
      const month = new Date(2000, utc.getUTCMonth(), 1).toLocaleString("en-US", { month: "short" });
      const year = utc.getUTCFullYear();
      return `${day}-${month}-${year}`;
    }

    function clean(v) { return String(v ?? "").trim(); }
    function unique(arr) { return [...new Set(arr.map(clean).filter(Boolean))].sort(); }
    function avg(arr) { return arr.reduce((a,b) => a + b, 0) / arr.length; }
    function pct(part, whole) { return whole ? ((part / whole) * 100).toFixed(1) : "0.0"; }
    function isInWarrantyCase(row) {
      const warranty = clean(row && row["GSPN Warranty"]).toLowerCase().replace(/[_\-]+/g, " ").replace(/\s+/g, " ").trim();
      if (!warranty) return false;
      if (warranty.includes("out of warranty") || warranty === "oow" || warranty.includes("out warranty")) return false;
      return warranty.includes("in warranty") || warranty === "iw" || warranty === "inwarranty";
    }
    function isOutWarrantyCase(row) {
      const warranty = clean(row && row["GSPN Warranty"]).toLowerCase().replace(/[_\-]+/g, " ").replace(/\s+/g, " ").trim();
      return warranty.includes("out of warranty") || warranty === "oow" || warranty.includes("out warranty");
    }
    function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }

    function setUploadProgress(percent, title, note, show = true) {
      const wrap = document.getElementById("uploadProgressWrap");
      const fill = document.getElementById("uploadProgressFill");
      const text = document.getElementById("uploadProgressText");
      const noteEl = document.getElementById("uploadProgressNote");
      if (!wrap || !fill || !text || !noteEl) return;

      const safePercent = Math.max(0, Math.min(100, Number(percent) || 0));

      if (!show) {
        wrap.style.display = "none";
        return;
      }

      wrap.style.display = "flex";
      fill.style.width = `${safePercent}%`;
      text.textContent = title || `Upload progress: ${safePercent}%`;
      noteEl.textContent = note || "";

      // Hide the completion indicator automatically after upload/load finishes.
      if (safePercent >= 100) {
        clearTimeout(window.uploadProgressHideTimer);
        window.uploadProgressHideTimer = setTimeout(() => {
          wrap.style.display = "none";
        }, 1200);
      }
    }

    /* ================= SKY Tracking Cases Tab ================= */
    const SKY_STORAGE_KEY = "skyTrackingDashboardRows_v1";
    const SKY_COLUMNS = [
      ["Queue", "Queue"], ["Brand", "Brand"], ["Branch", "Branch"], ["Job_Number", "Job Number"],
      ["Status", "Status"], ["Stage", "Stage"], ["Final_Stausus", "Final Status"], ["Model", "Model"],
      ["Item English Name", "Item English Name"], ["IMEI", "IMEI"], ["SerialNumber", "Serial Number"],
      ["JobType", "Job Type"], ["Warranty", "Warranty"], ["Assigned_To", "Assigned To"],
      ["Closed_By", "Closed By"], ["Open_Date", "Open Date"], ["Ready For Delivery Date", "Ready For Delivery Date"],
      ["CloseDate", "Close Date"], ["Aging_Days", "Aging Days"], ["Customer_Name", "Customer Name"],
      ["Customer_Mobile", "Customer Mobile"], ["Customer_phone", "Customer Phone"]
    ];

    let skyRows = [];
    let currentSkyRows = [];

    document.addEventListener("DOMContentLoaded", () => {
      wireSkyEvents();
      window.__skyStarted = false;
      window.__lazyStartSky = async function(){
        if (window.__skyStarted) return;
        window.__skyStarted = true;
        await loadSkySavedRows();
        refreshSkyFilters();
        renderSky();
      };
      const active = localStorage.getItem("serviceEyeActiveTab") || "gspn";
      if (active === "sky") {
        (window.requestIdleCallback || function(cb){ return setTimeout(cb, 350); })(window.__lazyStartSky, { timeout: 1800 });
      }
    });

    function wireSkyEvents() {
      const skyFile = document.getElementById("skyFileInput");
      if (skyFile) skyFile.addEventListener("change", handleSkyFile);
      ["skyBranchFilter", "skyQueueFilter", "skyBrandFilter", "skyStageFilter", "skyJobTypeFilter", "skySearchBox"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("change", debounce(renderSky, 120));
        el.addEventListener("input", debounce(renderSky, 120));
      });
    }

    function handleSkyFile(e) {
      const file = e.target.files[0];
      if (!file) return;
      setUploadProgress(0, "Reading SKY file...", "The SKY file upload has started.", true);
      const reader = new FileReader();
      reader.onprogress = evt => {
        const percent = evt.lengthComputable ? Math.round((evt.loaded / evt.total) * 70) : 35;
        setUploadProgress(percent, `Uploading SKY file: ${percent}%`, "Reading and preparing SKY source data.", true);
      };
      reader.onload = async evt => {
        try {
          setUploadProgress(80, "Processing SKY data...", "Rows are being converted and filters are being refreshed.", true);
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: "array", cellDates: true });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const raw = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: true });
          skyRows = raw.map(normalizeSkyRow).filter(r => r.Job_Number || r.IMEI || r.SerialNumber || r.Customer_Mobile || r.Customer_phone);
          await saveSkyRowsToBrowser(raw);
          resetSkyFiltersToAll();
          refreshSkyFilters();
          renderSky();
          setUploadProgress(100, "SKY upload completed: 100%", `${skyRows.length} SKY rows loaded. Data was saved using browser database storage to avoid size-limit errors.`, true);
        } catch (err) {

          setUploadProgress(0, "SKY upload failed", `Could not process the SKY file. ${err && err.message ? err.message : ""}`, true);
        } finally {
          e.target.value = "";
        }
      };
      reader.onerror = () => setUploadProgress(0, "SKY upload failed", "The SKY file could not be read.", true);
      reader.readAsArrayBuffer(file);
    }

    function formatSkyDate(value) {
      const d = parseExcelDate(value);
      return d ? formatDate(d) : clean(value);
    }

    async function saveSkyRowsToBrowser(rawRows) {
      try {
        const db = await openDashboardDb();
        await new Promise((resolve, reject) => {
          const tx = db.transaction(DB_STORE, "readwrite");
          tx.objectStore(DB_STORE).put({ id: SKY_STORAGE_KEY, rows: rawRows, savedAt: new Date().toISOString() });
          tx.oncomplete = resolve;
          tx.onerror = event => reject(event.target.error || new Error("Could not save SKY data in browser database"));
        });
        db.close();
      } catch (err) {

        // Do not use localStorage for SKY data because large files can exceed browser quota.
        setUploadProgress(100, "SKY data loaded", `${skyRows.length} SKY rows loaded, but browser database storage could not save them for refresh.`, true);
      }
    }

    async function loadSkyRowsFromBrowser() {
      try {
        const db = await openDashboardDb();
        const result = await new Promise((resolve, reject) => {
          const tx = db.transaction(DB_STORE, "readonly");
          const request = tx.objectStore(DB_STORE).get(SKY_STORAGE_KEY);
          request.onsuccess = event => resolve(event.target.result);
          request.onerror = event => reject(event.target.error || new Error("Could not read saved SKY data"));
        });
        db.close();
        if (result && Array.isArray(result.rows)) return result.rows;
      } catch (err) {

      }
      return null;
    }

    async function loadSkySavedRows() {
      try {
        const raw = await loadSkyRowsFromBrowser();
        if (raw && Array.isArray(raw)) {
          skyRows = raw.map(normalizeSkyRow).filter(r => r.Job_Number || r.IMEI || r.SerialNumber || r.Customer_Mobile || r.Customer_phone);
        }
      } catch (err) {

        skyRows = [];
      }
    }

    function resetSkyFiltersToAll() {
      ["skyBranchFilter", "skyStageFilter", "skyJobTypeFilter"].forEach(id => {
        const el = document.getElementById(id);
        if (el) [...el.options].forEach(opt => opt.selected = opt.value === ALL_VALUE);
      });
      ["skyQueueFilter", "skyBrandFilter"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
      const search = document.getElementById("skySearchBox");
      if (search) search.value = "";
    }

    function refreshSkyFilters() {
      fillSkyMultiSelect("skyBranchFilter", unique(skyRows.map(r => r.Branch)), "All Branches");
      fillSkyMultiSelect("skyStageFilter", unique(skyRows.map(r => r.Stage)), "All Stages");
      fillSkyMultiSelect("skyJobTypeFilter", unique(skyRows.map(r => r.JobType)), "All Job Types");
      fillSimpleOptions("skyQueueFilter", unique(skyRows.map(r => r.Queue)), "All Queue", ["Open_Cases", "Closed_Cases"]);
      fillSimpleOptions("skyBrandFilter", unique(skyRows.map(r => r.Brand)), "All Brands", ["Samsung", "Apple"]);
    }

    function fillSkyMultiSelect(id, values, allLabel) {
      const select = document.getElementById(id);
      if (!select) return;
      const previous = getSelectedValues(id);
      select.innerHTML = `<option value="${ALL_VALUE}">${escapeHtml(allLabel)}</option>` + values.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
      const selected = previous.length ? previous : [ALL_VALUE];
      [...select.options].forEach(opt => opt.selected = selected.includes(opt.value) || (selected.includes(ALL_VALUE) && opt.value === ALL_VALUE));
    }

    function fillSimpleOptions(id, values, allLabel, preferred = []) {
      const select = document.getElementById(id);
      if (!select) return;
      const previous = select.value;
      const merged = unique([...preferred, ...values]);
      select.innerHTML = `<option value="">${escapeHtml(allLabel)}</option>` + merged.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
      if ([...select.options].some(o => o.value === previous)) select.value = previous;
    }

    function getSkyFilteredRows() {
      const branches = getSelectedValues("skyBranchFilter");
      const stages = getSelectedValues("skyStageFilter");
      const jobTypes = getSelectedValues("skyJobTypeFilter");
      const queue = document.getElementById("skyQueueFilter")?.value || "";
      const brand = document.getElementById("skyBrandFilter")?.value || "";
      const q = (document.getElementById("skySearchBox")?.value || "").toLowerCase().trim();
      return skyRows.filter(r => {
        if (branches.length && !branches.includes(ALL_VALUE) && !branches.includes(r.Branch)) return false;
        if (stages.length && !stages.includes(ALL_VALUE) && !stages.includes(r.Stage)) return false;
        if (jobTypes.length && !jobTypes.includes(ALL_VALUE) && !jobTypes.includes(r.JobType)) return false;
        if (queue && r.Queue !== queue) return false;
        if (brand && r.Brand !== brand) return false;
        if (q) {
          const haystack = [r.Job_Number, r.IMEI, r.SerialNumber, r.Customer_Mobile, r.Customer_phone].join(" ").toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      });
    }

    function updateSkyCharts(rows) {
      if (typeof Chart === "undefined") return;
      const queue = topCounts(rows, "Queue", 8);
      const brand = topCounts(rows, "Brand", 8);
      const stage = topCounts(rows, "Stage", 10);
      const branch = topCounts(rows, "Branch", 10);
      createOrUpdateChart("skyQueueChart", "doughnut", queue.labels, queue.values, "Cases", false, label => setSkyQueue(label));
      createOrUpdateChart("skyBrandChart", "doughnut", brand.labels, brand.values, "Cases", false, label => setSkyBrand(label));
      createOrUpdateChart("skyStageChart", "bar", stage.labels, stage.values, "Cases", true, label => filterSkyMulti("skyStageFilter", label));
      createOrUpdateChart("skyBranchChart", "bar", branch.labels, branch.values, "Cases", true, label => filterSkyMulti("skyBranchFilter", label));
    }

    function setTextSafe(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }
    function setSkyQueue(value) { const el = document.getElementById("skyQueueFilter"); if (el) el.value = value; renderSky(); scrollToElement("skyCasesTable"); }
    function setSkyBrand(value) { const el = document.getElementById("skyBrandFilter"); if (el) el.value = value; renderSky(); scrollToElement("skyCasesTable"); }
    function filterSkyMulti(id, value) {
      const el = document.getElementById(id);
      if (!el) return;
      [...el.options].forEach(opt => opt.selected = opt.value === value);
      renderSky();
      scrollToElement("skyCasesTable");
    }
    function clearSkyFilters(scroll = false) { resetSkyFiltersToAll(); renderSky(); if (scroll) scrollToElement("skyCasesTable"); }
    function exportSkyExcel() { exportRowsToExcel(currentSkyRows, SKY_COLUMNS, "SKY Tracking Cases Export.xlsx", "SKY Filtered Cases"); }

    /* ================= SKY v17 updates ================= */
    const SKY_QUEUE_VALUES = ["Open_Cases", "Ready For Delivery Cases"];

    function setSkyUploadProgress(percent, text, note, show) {
      const wrap = document.getElementById("skyUploadProgressWrap");
      const fill = document.getElementById("skyUploadProgressFill");
      const txt = document.getElementById("skyUploadProgressText");
      const noteEl = document.getElementById("skyUploadProgressNote");
      if (!wrap || !fill || !txt || !noteEl) {
        setUploadProgress(percent, text, note, show);
        return;
      }
      if (show) wrap.style.display = "flex";
      fill.style.width = Math.max(0, Math.min(100, Number(percent || 0))) + "%";
      txt.textContent = text;
      noteEl.textContent = note;
      if (Number(percent) === 100) {
        setTimeout(() => { wrap.style.display = "none"; }, 1800);
      }
    }

    function normalizeSkyQueue(queue, status, stage) {
      const q = clean(queue).toLowerCase();
      const s = clean(status).toLowerCase();
      const st = clean(stage).toLowerCase();
      if (q.includes("ready") || s.includes("ready for delivery") || st.includes("ready for delivery")) return "Ready For Delivery Cases";
      if (q.includes("delivered") || q.includes("closed") || s.includes("delivered") || st === "delivered") return "__REMOVED_QUEUE__";
      if (q.includes("open")) return "Open_Cases";
      return clean(queue) || "Open_Cases";
    }

    function normalizeSkyRow(row) {
      const out = { ...row };
      SKY_COLUMNS.forEach(([key]) => out[key] = clean(row[key]));
      out.Queue = normalizeSkyQueue(row.Queue, row.Status, row.Stage);
      out.Open_Date_Display = formatSkyDate(row.Open_Date);
      out.Ready_For_Delivery_Date_Display = formatSkyDate(row["Ready For Delivery Date"]);
      out.CloseDate_Display = formatSkyDate(row.CloseDate);
      const agingN = Number(String(out.Aging_Days || row.Aging_Days || row["Aging Days"] || "").replace(/[^0-9.-]/g, ""));
      out.Aging_Days_Group = Number.isFinite(agingN) ? (agingN <= 3 ? "0 to 3 Days" : agingN <= 10 ? "4 to 10 Days" : "More than 10 Days") : "";
      out["Aging Days Group"] = out.Aging_Days_Group;
      return out;
    }

    function handleSkyFile(e) {
      const file = e.target.files[0];
      if (!file) return;
      setSkyUploadProgress(0, "Reading SKY file...", "The SKY file upload has started.", true);
      const reader = new FileReader();
      reader.onprogress = evt => {
        const percent = evt.lengthComputable ? Math.round((evt.loaded / evt.total) * 70) : 35;
        setSkyUploadProgress(percent, `Uploading SKY file: ${percent}%`, "Reading and preparing SKY source data.", true);
      };
      reader.onload = async evt => {
        try {
          setSkyUploadProgress(80, "Processing SKY data...", "Rows are being converted and SKY filters are being refreshed.", true);
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: "array", cellDates: true });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const raw = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: true });
          skyRows = raw.map(normalizeSkyRow).filter(r => r.Job_Number || r.IMEI || r.SerialNumber || r.Customer_Mobile || r.Customer_phone);
          await saveSkyRowsToBrowser(raw);
          resetSkyFiltersToAll();
          refreshSkyFilters();
          renderSky();
          setSkyUploadProgress(100, "SKY upload completed: 100%", `${skyRows.length} SKY rows loaded and saved in browser database storage.`, true);
        } catch (err) {

          setSkyUploadProgress(0, "SKY upload failed", `Could not process the SKY file. ${err && err.message ? err.message : ""}`, true);
        } finally {
          e.target.value = "";
        }
      };
      reader.onerror = () => setSkyUploadProgress(0, "SKY upload failed", "The SKY file could not be read.", true);
      reader.readAsArrayBuffer(file);
    }

    async function saveSkyRowsToBrowser(rawRows) {
      try {
        const db = await openDashboardDb();
        await new Promise((resolve, reject) => {
          const tx = db.transaction(DB_STORE, "readwrite");
          tx.objectStore(DB_STORE).put({ id: SKY_STORAGE_KEY, rows: rawRows, savedAt: new Date().toISOString() });
          tx.oncomplete = resolve;
          tx.onerror = event => reject(event.target.error || new Error("Could not save SKY data in browser database"));
        });
        db.close();
      } catch (err) {

        setSkyUploadProgress(100, "SKY data loaded", `${skyRows.length} SKY rows loaded, but browser database storage could not save them for refresh.`, true);
      }
    }

    async function loadSkySavedRows() {
      try {
        const raw = await loadSkyRowsFromBrowser();
        if (raw && Array.isArray(raw)) {
          skyRows = raw.map(normalizeSkyRow).filter(r => r.Job_Number || r.IMEI || r.SerialNumber || r.Customer_Mobile || r.Customer_phone);
          if (skyRows.length) setSkyUploadProgress(100, "SKY saved data loaded", `${skyRows.length} SKY rows were restored from this browser.`, true);
        }
      } catch (err) {

        skyRows = [];
      }
    }

    function refreshSkyFilters() {
      fillSkyMultiSelect("skyBranchFilter", unique(skyRows.map(r => r.Branch)), "(Select All)");
      fillSkyMultiSelect("skyStageFilter", unique(skyRows.map(r => r.Stage)), "(Select All)");
      fillSkyMultiSelect("skyJobTypeFilter", unique(skyRows.map(r => r.JobType)), "(Select All)");
      fillSimpleOptions("skyQueueFilter", unique(skyRows.map(r => r.Queue)), "(Select All)", SKY_QUEUE_VALUES);
      fillSimpleOptions("skyBrandFilter", unique(skyRows.map(r => r.Brand)), "(Select All)", ["Samsung", "Apple"]);
      requestAnimationFrame(refreshSkyExcelFilterWidgets);
    }

    function resetSkyFiltersToAll() {
      ["skyBranchFilter", "skyStageFilter", "skyJobTypeFilter"].forEach(id => {
        const el = document.getElementById(id);
        if (el) [...el.options].forEach(opt => opt.selected = opt.value === ALL_VALUE);
      });
      ["skyQueueFilter", "skyBrandFilter"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
      const search = document.getElementById("skySearchBox");
      if (search) search.value = "";
      requestAnimationFrame(refreshSkyExcelFilterWidgets);
    }

    function getSkyFilteredRows() {
      const branches = getSelectedValues("skyBranchFilter");
      const stages = getSelectedValues("skyStageFilter");
      const jobTypes = getSelectedValues("skyJobTypeFilter");
      const queue = document.getElementById("skyQueueFilter")?.value || "";
      const brand = document.getElementById("skyBrandFilter")?.value || "";
      const q = (document.getElementById("skySearchBox")?.value || "").toLowerCase().trim();
      return skyRows.filter(r => {
        if (branches.length && !branches.includes(ALL_VALUE) && !branches.includes(r.Branch)) return false;
        if (stages.length && !stages.includes(ALL_VALUE) && !stages.includes(r.Stage)) return false;
        if (jobTypes.length && !jobTypes.includes(ALL_VALUE) && !jobTypes.includes(r.JobType)) return false;
        if (queue && r.Queue !== queue) return false;
        if (brand && r.Brand !== brand) return false;
        if (q) {
          const haystack = [r.Job_Number, r.IMEI, r.SerialNumber, r.Customer_Mobile, r.Customer_phone].join(" ").toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      });
    }

    function renderSky() {
      if (!document.getElementById("skyPage")) return;
      currentSkyRows = getSkyFilteredRows();
      const total = currentSkyRows.length;
      const open = currentSkyRows.filter(r => r.Queue === "Open_Cases").length;
      const ready = currentSkyRows.filter(r => r.Queue === "Ready For Delivery Cases").length;
      const delivered = currentSkyRows.filter(r => r.Queue === "__REMOVED_QUEUE__").length;
      const samsung = currentSkyRows.filter(r => String(r.Brand).toLowerCase() === "samsung").length;
      const apple = currentSkyRows.filter(r => String(r.Brand).toLowerCase() === "apple").length;
      setTextSafe("skyTotalCases", total);
      setTextSafe("skyOpenCases", open);
      setTextSafe("skyOpenPercent", `${pct(open, total)}% of Total`);
      setTextSafe("skyClosedCases", delivered + ready);
      setTextSafe("skyClosedPercent", `${pct(delivered + ready, total)}% Ready/Delivered`);
      setTextSafe("skySamsungCases", samsung);
      setTextSafe("skySamsungPercent", `${pct(samsung, total)}% of Total`);
      setTextSafe("skyAppleCases", apple);
      setTextSafe("skyApplePercent", `${pct(apple, total)}% of Total`);

      const previewCols = [
        ["Queue", "Queue"], ["Brand", "Brand"], ["Branch", "Branch"], ["Open_Date_Display", "Open Date"],
        ["Aging_Days", "Aging Days"], ["Aging_Days_Group", "Aging Days Group"], ["Job_Number", "Job Number"], ["Status", "Status"], ["Stage", "Stage"],
        ["Item English Name", "Item English Name"], ["Price", "Price"]
      ];
      renderTable("skyCasesTable", currentSkyRows.slice(0, 200), previewCols, false);
      updateSkyCharts(currentSkyRows);
      refreshSkyExcelFilterWidgets();
    }

    function topCountsAll(rows, field, orderedValues = null) {
      const counts = {};
      rows.forEach(r => {
        const key = clean(r[field]) || "Blank";
        counts[key] = (counts[key] || 0) + 1;
      });
      let entries;
      if (orderedValues) {
        entries = orderedValues.map(v => [v, counts[v] || 0]);
      } else {
        entries = Object.entries(counts).sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0]));
      }
      return { labels: entries.map(x => x[0]), values: entries.map(x => x[1]) };
    }

    function displayLabelsWithPct(labels, values, total) {
      return labels.map((label, i) => `${label} (${values[i]} | ${pct(values[i], total)}%)`);
    }

    function setSkyChartSummary(id, labels, values, total) {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = labels.map((label, i) => `<span class="sky-chart-chip">${escapeHtml(label)}: ${values[i]} (${pct(values[i], total)}%)</span>`).join("");
    }

    function isSkyOpenRow(r) { return r.Queue === "Open_Cases"; }
    function isDeliveredOrReadyStage(stage) {
      const s = clean(stage).toLowerCase();
      return s === "delivered" || s.includes("ready for delivery");
    }

    function updateSkyCharts(rows) {
      if (typeof Chart === "undefined") return;
      const queue = topCountsAll(rows, "Queue", SKY_QUEUE_VALUES);
      const brand = topCountsAll(rows, "Brand");
      const openRows = rows.filter(isSkyOpenRow);
      const openStageRows = openRows.filter(r => !isDeliveredOrReadyStage(r.Stage));
      const stage = topCountsAll(openStageRows, "Stage");
      const branch = topCountsAll(openRows, "Branch");

      setSkyChartSummary("skyQueueSummary", queue.labels, queue.values, rows.length);
      setSkyChartSummary("skyBrandSummary", brand.labels, brand.values, rows.length);
      setSkyChartSummary("skyStageSummary", stage.labels, stage.values, openStageRows.length);
      setSkyChartSummary("skyBranchSummary", branch.labels, branch.values, openRows.length);

      createOrUpdateChart("skyQueueChart", "doughnut", displayLabelsWithPct(queue.labels, queue.values, rows.length), queue.values, "Cases", false, label => setSkyQueue(label.split(" (")[0]));
      createOrUpdateChart("skyBrandChart", "doughnut", displayLabelsWithPct(brand.labels, brand.values, rows.length), brand.values, "Cases", false, label => setSkyBrand(label.split(" (")[0]));
      createOrUpdateChart("skyStageChart", "bar", displayLabelsWithPct(stage.labels, stage.values, openStageRows.length), stage.values, "Open Cases", true, label => filterSkyMulti("skyStageFilter", label.split(" (")[0]));
      createOrUpdateChart("skyBranchChart", "bar", displayLabelsWithPct(branch.labels, branch.values, openRows.length), branch.values, "Open Cases", true, label => filterSkyMulti("skyBranchFilter", label.split(" (")[0]));
    }

    function setSkyQueue(value) { const el = document.getElementById("skyQueueFilter"); if (el) el.value = value; renderSky(); scrollToElement("skyCasesTable"); }
    function setSkyBrand(value) { const el = document.getElementById("skyBrandFilter"); if (el) el.value = value; renderSky(); scrollToElement("skyCasesTable"); }
    function exportSkyExcel() { exportRowsToExcel(currentSkyRows, SKY_COLUMNS, "SKY Tracking Cases Export.xlsx", "SKY Filtered Cases"); }

    function refreshSkyExcelFilterWidgets() {
      const configs = [
        { id: "skyBranchFilter", multiple: true },
        { id: "skyQueueFilter", multiple: false },
        { id: "skyBrandFilter", multiple: false },
        { id: "skyStageFilter", multiple: true },
        { id: "skyJobTypeFilter", multiple: true }
      ];
      configs.forEach(createOrUpdateExcelFilter);
    }

    function createOrUpdateExcelFilter(config) {
      const select = document.getElementById(config.id);
      if (!select) return;
      select.style.display = "none";
      let wrap = document.getElementById(config.id + "_excel");
      if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "excel-filter-container";
        wrap.id = config.id + "_excel";
        select.insertAdjacentElement("afterend", wrap);
      }
      const options = [...select.options].map(o => ({ value: o.value, text: o.textContent, selected: o.selected }));
      const selectedTexts = options.filter(o => o.selected && o.value !== "" && o.value !== ALL_VALUE).map(o => o.text);
      const allSelected = config.multiple
        ? options.some(o => o.value === ALL_VALUE && o.selected) || !selectedTexts.length
        : !select.value;
      const summary = allSelected ? "(Select All)" : selectedTexts.length > 2 ? `${selectedTexts.length} selected` : selectedTexts.join(", ");
      wrap.innerHTML = `
        <button type="button" class="excel-filter-button">${escapeHtml(summary || "(Select All)")}</button>
        <div class="excel-filter-panel">
          <input class="excel-filter-search" placeholder="Search" />
          <div class="excel-filter-list"></div>
          <div class="excel-filter-actions"><button type="button" class="ok">OK</button><button type="button" class="cancel">Cancel</button></div>
        </div>`;
      const btn = wrap.querySelector(".excel-filter-button");
      const panel = wrap.querySelector(".excel-filter-panel");
      const list = wrap.querySelector(".excel-filter-list");
      const search = wrap.querySelector(".excel-filter-search");
      const close = () => wrap.classList.remove("open");
      btn.onclick = event => {
        event.stopPropagation();
        document.querySelectorAll(".excel-filter-container.open").forEach(x => { if (x !== wrap) x.classList.remove("open"); });
        wrap.classList.toggle("open");
        setTimeout(() => search.focus(), 0);
      };
      wrap.querySelector(".ok").onclick = close;
      wrap.querySelector(".cancel").onclick = close;
      panel.onclick = event => event.stopPropagation();

      function drawList(filter = "") {
        const term = filter.toLowerCase();
        const visibleOptions = options.filter(o => !term || o.text.toLowerCase().includes(term));
        list.innerHTML = visibleOptions.map(o => {
          const checked = config.multiple ? !![...select.options].find(opt => opt.value === o.value)?.selected : select.value === o.value;
          return `<label class="excel-filter-option"><input type="checkbox" data-value="${escapeHtml(o.value)}" ${checked ? "checked" : ""}> <span>${escapeHtml(o.text)}</span></label>`;
        }).join("");
        list.querySelectorAll("input[type=checkbox]").forEach(cb => {
          cb.onchange = () => {
            const val = cb.getAttribute("data-value");
            if (config.multiple) {
              if (val === ALL_VALUE) {
                [...select.options].forEach(opt => opt.selected = opt.value === ALL_VALUE);
              } else {
                const opt = [...select.options].find(o => o.value === val);
                if (opt) opt.selected = cb.checked;
                const allOpt = [...select.options].find(o => o.value === ALL_VALUE);
                if (allOpt) allOpt.selected = false;
                const selected = getSelectedValues(config.id).filter(v => v !== ALL_VALUE);
                if (!selected.length && allOpt) allOpt.selected = true;
              }
            } else {
              select.value = val || "";
            }
            renderSky();
          };
        });
      }
      search.oninput = () => drawList(search.value);
      drawList();
    }

    document.addEventListener("click", () => document.querySelectorAll(".excel-filter-container.open").forEach(x => x.classList.remove("open")));

    function escapeHtml(str) {
      return String(str ?? "").replace(/[&<>"']/g, s => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[s]));
    }

    function escapeJs(str) {
      return String(str ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;")
        .replace(/\r?\n/g, " ");
    }
  

    /* ================= SKY v19 final fixes ================= */
    (function(){
      const SKY_QUEUE_V19 = ["Open_Cases", "Ready For Delivery Cases"];
      const SKY_FILTER_IDS_V19 = ["skyBranchFilter","skyQueueFilter","skyBrandFilter","skyStageFilter","skyJobTypeFilter"];
      const SKY_CHART_FILTERS_V19 = ["skyQueueChartBrandFilter","skyBrandChartQueueFilter","skyStageChartBranchFilter","skyBranchChartStageFilter","skyReadyAgingBrandFilter"];

      function normText(v){ return String(v ?? "").trim(); }
      /* [dedup] orphan helper normQueue removed */
      /* [dedup] orphan helper normBrand removed */
      function pctV19(n,d){ return d ? ((Number(n)||0)*100/d).toFixed(1).replace(/\.0$/,"") : "0"; }
      function setSafe(id,val){ const el=document.getElementById(id); if(el) el.textContent=val; }
      function getSel(id){
        const el=document.getElementById(id); if(!el) return [];
        if(el.multiple) return [...el.selectedOptions].map(o=>o.value).filter(v=>v && v!==ALL_VALUE);
        return el.value ? [el.value] : [];
      }
      function optionList(id){ const el=document.getElementById(id); return el ? [...el.options].map(o=>({value:o.value,text:o.textContent,selected:o.selected})) : []; }

      /* [dedup] superseded normalizeSkyRow definition removed (was L1972) */

      function refreshSkyFilterOptionsV19(){
        fillSelectV19("skyBranchFilter", [...new Set((skyRows||[]).map(r=>r.Branch).filter(Boolean))].sort(), true);
        fillSelectV19("skyQueueFilter", SKY_QUEUE_V19, false);
        fillSelectV19("skyBrandFilter", ["Samsung","Apple"], false);
        fillSelectV19("skyStageFilter", [...new Set((skyRows||[]).map(r=>r.Stage).filter(Boolean))].sort(), true);
        fillSelectV19("skyJobTypeFilter", [...new Set((skyRows||[]).map(r=>r.JobType).filter(Boolean))].sort(), true);
        fillChartFilterV19("skyQueueChartBrandFilter", ["Samsung","Apple"], "All Brands");
        fillChartFilterV19("skyBrandChartQueueFilter", SKY_QUEUE_V19, "All Queues");
        fillChartFilterV19("skyStageChartBranchFilter", [...new Set((skyRows||[]).map(r=>r.Branch).filter(Boolean))].sort(), "All Branches");
        fillChartFilterV19("skyBranchChartStageFilter", [...new Set((skyRows||[]).map(r=>r.Stage).filter(Boolean))].sort(), "All Stages");
        fillChartFilterV19("skyReadyAgingBrandFilter", ["Samsung","Apple"], "All Brands");
        buildExcelFiltersV19();
      }
      function fillSelectV19(id, vals, multi){
        const el=document.getElementById(id); if(!el) return;
        const old=getSel(id);
        el.innerHTML = (multi ? `<option value="${ALL_VALUE}">(Select All)</option>` : `<option value="">(Select All)</option>`) + vals.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
        if(multi){
          let any=false; [...el.options].forEach(o=>{ if(old.includes(o.value)){o.selected=true; any=true;} });
          if(!any && el.options[0]) el.options[0].selected=true;
        } else if(old[0]) el.value=old[0];
      }
      function fillChartFilterV19(id, vals, allText){
        const el=document.getElementById(id); if(!el) return;
        const old=el.value;
        el.innerHTML = `<option value="">${escapeHtml(allText)}</option>` + vals.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
        if([...el.options].some(o=>o.value===old)) el.value=old;
      }

      /* [dedup] superseded getSkyFilteredRows definition removed (was L2063) */

      window.renderSky = function(){
        if(!document.getElementById("skyPage")) return;
        currentSkyRows = window.getSkyFilteredRows();
        const all = skyRows || [];
        const totalAll = all.length;
        const openAll = all.filter(r=>r.Queue==="Open_Cases").length;
        const readyAll = all.filter(r=>r.Queue==="Ready For Delivery Cases").length;
        const deliveredAll = all.filter(r=>r.Queue==="__REMOVED_QUEUE__").length;
        const samsungAll = all.filter(r=>r.Brand==="Samsung").length;
        const appleAll = all.filter(r=>r.Brand==="Apple").length;
        setSafe("skyTotalCases", totalAll); setSafe("skyOpenCases", openAll); setSafe("skyReadyCases", readyAll); setSafe("skyDeliveredCases", deliveredAll); setSafe("skySamsungCases", samsungAll); setSafe("skyAppleCases", appleAll);
        setSafe("skyOpenPercent", `${pctV19(openAll,totalAll)}% of Total`); setSafe("skyReadyPercent", `${pctV19(readyAll,totalAll)}% of Total`); setSafe("skyDeliveredPercent", `${pctV19(deliveredAll,totalAll)}% of Total`); setSafe("skySamsungPercent", `${pctV19(samsungAll,totalAll)}% of Total`); setSafe("skyApplePercent", `${pctV19(appleAll,totalAll)}% of Total`);
        const previewCols = [["Queue","Queue"],["Brand","Brand"],["Branch","Branch"],["Open_Date_Display","Open Date"],["Aging_Days","Aging Days"],["Aging_Days_Group","Aging Days Group"],["Job_Number","Job Number"],["Status","Status"],["Stage","Stage"],["Item English Name","Item English Name"],["Price","Price"]];
        if(typeof renderTable === "function") renderTable("skyCasesTable", currentSkyRows.slice(0,1000), previewCols, false);
        updateSkyChartsV19(currentSkyRows);
        buildExcelFiltersV19();
        updateSkyTimestampV19();
      };

      window.clearSkyFilters = function(skipScroll){
        SKY_FILTER_IDS_V19.forEach(id=>{ const el=document.getElementById(id); if(!el) return; if(el.multiple){[...el.options].forEach((o,i)=>o.selected=i===0);} else el.value=""; });
        const s=document.getElementById("skySearchBox"); if(s) s.value="";
        window.renderSky();
        if(!skipScroll && typeof scrollToElement==="function") scrollToElement("skyCasesTable");
      };
      /* [dedup] superseded setSkyQueue definition removed (was L2105) */
      /* [dedup] superseded setSkyBrand definition removed (was L2106) */
      window.clearSkyChartFilter = function(id){ const el=document.getElementById(id); if(el) el.value=""; window.renderSky(); };

      function topCountsV19(rows, field, ordered){
        const c={}; rows.forEach(r=>{ const k=normText(r[field])||"Blank"; c[k]=(c[k]||0)+1; });
        const entries = ordered ? ordered.map(v=>[v,c[v]||0]) : Object.entries(c).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
        return {labels: entries.map(x=>x[0]), values: entries.map(x=>x[1])};
      }
      function chartRowsWithFilter(rows, id, field){ const v=document.getElementById(id)?.value || ""; return v ? rows.filter(r=>r[field]===v) : rows; }
      function openRowsV19(rows){ return rows.filter(r=>r.Queue==="Open_Cases"); }
      function stageOpenV19(rows){ return openRowsV19(rows).filter(r=>{ const s=normText(r.Stage).toLowerCase(); return s && s!=="delivered" && !s.includes("ready for delivery"); }); }
      function readyRowsV19(rows){ return rows.filter(r=>r.Queue==="Ready For Delivery Cases"); }
      function ageBuckets(rows){
        const labels=["0-3","4-7","more than 7"], vals=[0,0,0];
        rows.forEach(r=>{ const m = Number(r.Aging_Days)/30; if(!Number.isFinite(m)) return; if(m<=3) vals[0]++; else if(m<=7) vals[1]++; else vals[2]++; });
        return {labels, values: vals};
      }
      function summary(id, labels, vals, total){ const el=document.getElementById(id); if(el) el.innerHTML = labels.map((l,i)=>`<span class="sky-chart-chip">${escapeHtml(l)}: ${vals[i]} (${pctV19(vals[i],total)}%)</span>`).join(""); }
      const labelPlugin = {id:"v19Labels", afterDatasetsDraw(chart){ const {ctx}=chart; ctx.save(); ctx.font="bold 12px Calibri, Arial"; ctx.fillStyle="#111"; ctx.textAlign="center"; chart.data.datasets.forEach((ds,di)=>{ const meta=chart.getDatasetMeta(di); meta.data.forEach((bar,i)=>{ const val=ds.data[i]; if(!val) return; if(chart.config.type==="bar"){ ctx.fillText(String(val), bar.x, bar.y-6); } }); }); ctx.restore(); }};
      try{ if(window.Chart && !Chart.registry.plugins.get)Chart.register(labelPlugin); }catch(e){}
      function makeChart(id,type,labels,values,total,onClick){
        const canvas=document.getElementById(id); if(!canvas || typeof Chart==="undefined") return;
        if(dashboardCharts[id]) dashboardCharts[id].destroy();
        dashboardCharts[id]=__safeNewChart(canvas,{type, data:{labels: labels.map((l,i)=> type==="bar"?l:`${l} (${values[i]} | ${pctV19(values[i],total)}%)`), datasets:[{label:"Cases",data:values}]}, options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:type!=="bar"},tooltip:{callbacks:{label:(ctx)=>`${ctx.label}: ${ctx.raw} (${pctV19(ctx.raw,total)}%)`}}}, scales:type==="bar"?{y:{beginAtZero:true}}:{}, onClick:(evt,elements)=>{ if(elements.length&&onClick){ const idx=elements[0].index; onClick(labels[idx]); }}}});
      }
      function updateSkyChartsV19(rows){
        if(document.getElementById("skyStageAllChart")){ const sec=document.getElementById("skyStageAllChart").closest("section"); if(sec) sec.remove(); }
        const queueRows = chartRowsWithFilter(rows,"skyQueueChartBrandFilter","Brand");
        const brandRows = chartRowsWithFilter(rows,"skyBrandChartQueueFilter","Queue");
        const stageRows = stageOpenV19(chartRowsWithFilter(rows,"skyStageChartBranchFilter","Branch"));
        const branchRows = openRowsV19(chartRowsWithFilter(rows,"skyBranchChartStageFilter","Stage"));
        const readyRows = readyRowsV19(chartRowsWithFilter(rows,"skyReadyAgingBrandFilter","Brand"));
        const q=topCountsV19(queueRows,"Queue",SKY_QUEUE_V19), b=topCountsV19(brandRows,"Brand",["Samsung","Apple"]), st=topCountsV19(stageRows,"Stage"), br=topCountsV19(branchRows,"Branch"), ag=ageBuckets(readyRows);
        summary("skyQueueSummary",q.labels,q.values,queueRows.length); summary("skyBrandSummary",b.labels,b.values,brandRows.length); summary("skyStageSummary",st.labels,st.values,stageRows.length); summary("skyBranchSummary",br.labels,br.values,branchRows.length); summary("skyReadyAgingSummary",ag.labels,ag.values,readyRows.length);
        makeChart("skyQueueChart","bar",q.labels,q.values,queueRows.length,l=>window.setSkyQueue(l));
        makeChart("skyBrandChart","bar",b.labels,b.values,brandRows.length,l=>window.setSkyBrand(l));
        makeChart("skyStageChart","bar",st.labels,st.values,stageRows.length,l=>filterSkyMultiV19("skyStageFilter",l));
        makeChart("skyBranchChart","bar",br.labels,br.values,branchRows.length,l=>filterSkyMultiV19("skyBranchFilter",l));
        makeChart("skyReadyAgingChart","bar",ag.labels,ag.values,readyRows.length,null);
      }
      function filterSkyMultiV19(id,val){ const el=document.getElementById(id); if(!el) return; [...el.options].forEach(o=>o.selected=(o.value===val)); window.renderSky(); if(typeof scrollToElement==="function") scrollToElement("skyCasesTable"); }

      function buildExcelFiltersV19(){ SKY_FILTER_IDS_V19.forEach(id=>buildOneExcelFilterV19(id)); }
      function buildOneExcelFilterV19(id){
        const select=document.getElementById(id); if(!select) return; select.style.display="none";
        let wrap=document.getElementById(id+"_excel"); if(!wrap){ wrap=document.createElement("div"); wrap.className="excel-filter-container v19"; wrap.id=id+"_excel"; select.insertAdjacentElement("afterend",wrap); }
        const opts=optionList(id); const selected=getSel(id); const summaryText=selected.length ? (selected.length>2?`${selected.length} selected`:selected.map(v=>opts.find(o=>o.value===v)?.text||v).join(", ")) : "(Select All)";
        wrap.innerHTML=`<button type="button" class="excel-filter-button">${escapeHtml(summaryText)}</button><div class="excel-filter-panel"><input class="excel-filter-search" placeholder="Search"/><div class="excel-filter-list"></div><div class="excel-filter-actions"><button type="button" class="ok">OK</button><button type="button" class="clear">Clear</button></div></div>`;
        const btn=wrap.querySelector(".excel-filter-button"), panel=wrap.querySelector(".excel-filter-panel"), search=wrap.querySelector(".excel-filter-search"), list=wrap.querySelector(".excel-filter-list");
        btn.onclick=(e)=>{ e.stopPropagation(); document.querySelectorAll(".excel-filter-container.open").forEach(x=>{if(x!==wrap)x.classList.remove("open")}); wrap.classList.toggle("open"); setTimeout(()=>search.focus(),0); };
        panel.onclick=e=>e.stopPropagation(); wrap.querySelector(".ok").onclick=()=>wrap.classList.remove("open"); wrap.querySelector(".clear").onclick=()=>{ if(select.multiple){[...select.options].forEach((o,i)=>o.selected=i===0)} else select.value=""; window.renderSky(); wrap.classList.remove("open"); };
        function draw(term=""){
          const t=term.toLowerCase(); const visible=opts.filter(o=>!t||o.text.toLowerCase().includes(t));
          list.innerHTML=visible.map(o=>`<label class="excel-filter-option"><input type="checkbox" data-value="${escapeHtml(o.value)}" ${o.selected?"checked":""}> <span>${escapeHtml(o.text)}</span></label>`).join("");
          list.querySelectorAll("input").forEach(cb=>cb.onchange=()=>{ const val=cb.dataset.value; if(select.multiple){ if(val===ALL_VALUE){[...select.options].forEach((o,i)=>o.selected=i===0)} else {const opt=[...select.options].find(o=>o.value===val); if(opt) opt.selected=cb.checked; const all=[...select.options].find(o=>o.value===ALL_VALUE); if(all) all.selected=false; if(!getSel(id).length && all) all.selected=true;} } else { select.value=cb.checked?val:""; } window.renderSky(); });
        }
        search.oninput=()=>draw(search.value); draw();
      }

      /* [dedup] superseded setDesign definition removed (was L2165) */
      window.applyTabDesignV19 = function(tab, design){
        const page=document.getElementById(tab==="sky"?"skyPage":"gspnPage"); if(!page) return;
        page.classList.remove("theme-pro","theme-glass","theme-fresh","theme-volta");
        page.classList.add("theme-"+(design||"volta"));
      };
      const oldSwitch = window.switchTab;
      function updateSkyTimestampV19(){
        let el=document.getElementById("skyLastUpdate");
        if(!el){ const progress=document.getElementById("skyUploadProgressWrap"); if(progress){ el=document.createElement("div"); el.id="skyLastUpdate"; el.className="sky-last-update"; progress.insertAdjacentElement("afterend",el); } }
        const saved=localStorage.getItem("skyLastUploadTime");
        if(el) el.textContent = saved ? `Last SKY data upload/update: ${saved}` : "No SKY data upload time available yet.";
      }
      const oldHandleSky = window.handleSkyFile;
      window.handleSkyFile = function(e){ localStorage.setItem("skyLastUploadTime", new Date().toLocaleString()); updateSkyTimestampV19(); return oldHandleSky ? oldHandleSky(e) : null; };
      document.addEventListener("DOMContentLoaded",()=>{
        setTimeout(()=>{ refreshSkyFilterOptionsV19(); updateSkyTimestampV19(); applyTabDesignV19("gspn", localStorage.getItem("gspnDesign")||"volta"); applyTabDesignV19("sky", localStorage.getItem("skyDesign")||"volta"); window.renderSky && window._scheduleRender && window._scheduleRender('init-sky', window.renderSky, 100); },800);
      });
      document.addEventListener("click",()=>document.querySelectorAll(".excel-filter-container.open").forEach(x=>x.classList.remove("open")));
    })();


/* ===== v20_sky_final_fixes ===== */

(function(){
  const QUEUES = ["Open_Cases", "Ready For Delivery Cases"];
  const DESIGN_CLASSES = ["theme-pro","theme-glass","theme-fresh","theme-volta","theme-fallon","theme-rolio","theme-faraado","theme-foodfinda"];

  function txt(v){ return String(v ?? "").trim(); }
  function esc(v){ return typeof escapeHtml === "function" ? escapeHtml(v) : String(v ?? "").replace(/[&<>\"']/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[s])); }
  function pct2(n,d){ return d ? ((Number(n)||0)*100/d).toFixed(1).replace(/\.0$/,'') : '0'; }
  function activeTab(){ const sky = document.getElementById('skyPage'); return sky && sky.style.display !== 'none' ? 'sky' : 'gspn'; }
  function rowsAll(){ return Array.isArray(skyRows) ? skyRows : []; }
  function currentRows(){ return Array.isArray(currentSkyRows) ? currentSkyRows : rowsAll(); }

  function countBy(rows, field, ordered){
    const c = {}; rows.forEach(r => { const k = txt(r[field]) || 'Blank'; c[k] = (c[k] || 0) + 1; });
    const entries = ordered ? ordered.map(v => [v, c[v] || 0]) : Object.entries(c).sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0]));
    return { labels: entries.map(e=>e[0]), values: entries.map(e=>e[1]) };
  }
  function chartFilter(rows, id, field){ const v = document.getElementById(id)?.value || ''; return v ? rows.filter(r => txt(r[field]) === v) : rows; }
  function isOpen(r){ return txt(r.Queue) === 'Open_Cases'; }
  function isReady(r){ return txt(r.Queue) === 'Ready For Delivery Cases'; }
  function validOpenStage(r){ const s = txt(r.Stage).toLowerCase(); return isOpen(r) && s && s !== 'delivered' && !s.includes('ready for delivery'); }
  function setText(id, val){ const el=document.getElementById(id); if(el) el.textContent=val; }

  function refreshChartSelect(id, values, allText){
    const el = document.getElementById(id); if(!el) return;
    const old = el.value || '';
    const cleanVals = [...new Set(values.map(txt).filter(Boolean))].sort();
    el.innerHTML = `<option value="">${esc(allText || 'All')}</option>` + cleanVals.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
    if([...el.options].some(o=>o.value===old)) el.value = old;
    el.onchange = function(){ renderSky(); const card = el.closest('.chart-card'); if(card) card.classList.add('v20-highlight'); };
  }

  function refreshSkyChartFilterOptionsV20(){
    const all = rowsAll();
    refreshChartSelect('skyQueueChartBrandFilter', ['Samsung','Apple'], 'All Brands');
    refreshChartSelect('skyBrandChartQueueFilter', QUEUES, 'All Queues');
    refreshChartSelect('skyStageChartBranchFilter', all.map(r=>r.Branch), 'All Branches');
    refreshChartSelect('skyBranchChartStageFilter', all.filter(validOpenStage).map(r=>r.Stage), 'All Stages');
    refreshChartSelect('skyReadyAgingBrandFilter', ['Samsung','Apple'], 'All Brands');
  }

  const labelsPlugin = {
    id: 'v20SkyLabels',
    afterDatasetsDraw(chart){
      const {ctx} = chart; ctx.save(); ctx.font='bold 12px Calibri, Arial'; ctx.fillStyle='#111827'; ctx.textAlign='center'; ctx.textBaseline='bottom';
      chart.data.datasets.forEach((ds,di)=>{ const meta=chart.getDatasetMeta(di); meta.data.forEach((bar,i)=>{ const val=Number(ds.data[i]||0); if(!val) return; ctx.fillText(String(val), bar.x, Math.max(12, bar.y-6)); }); });
      ctx.restore();
    }
  };
  try{ if(window.Chart && !Chart.registry.plugins.get('v20SkyLabels'))Chart.register(labelsPlugin); }catch(e){}

  function makeBar(id, labels, values, total, clickFn){
    const canvas=document.getElementById(id); if(!canvas || !window.Chart) return;
    if(dashboardCharts && dashboardCharts[id]) dashboardCharts[id].destroy();
    dashboardCharts[id] = __safeNewChart(canvas, {
      type:'bar',
      data:{ labels: labels.map((l,i)=>`${l} (${values[i]} | ${pct2(values[i], total)}%)`), datasets:[{ label:'Cases', data:values, borderWidth:1 }] },
      options:{
        responsive:true, maintainAspectRatio:false,
        layout:{ padding:{ top:22 } },
        plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:ctx=>`Cases: ${ctx.raw} (${pct2(ctx.raw,total)}%)` } } },
        scales:{ x:{ ticks:{ autoSkip:false, maxRotation:45, minRotation:0 } }, y:{ beginAtZero:true, suggestedMax: Math.max(...values,0)*1.15 + 1 } },
        onClick:(evt,elements)=>{ if(elements.length && clickFn){ const idx=elements[0].index; clickFn(labels[idx]); } }
      }
    });
  }

  function setSummary(id, labels, values, total){
    const el = document.getElementById(id); if(!el) return;
    el.innerHTML = labels.map((l,i)=>`<span class="sky-chart-chip">${esc(l)}: ${values[i]} (${pct2(values[i], total)}%)</span>`).join('');
  }

  function readyAgingBuckets(rows){
    const labels=['0-3','4-7','more than 7']; const values=[0,0,0];
    rows.forEach(r=>{ const days=Number(r.Aging_Days); if(!Number.isFinite(days)) return; const months=days/30; if(months<=3) values[0]++; else if(months<=7) values[1]++; else values[2]++; });
    return {labels, values};
  }

  function updateSkyChartsV20(baseRows){
    if(document.getElementById('skyStageAllChart')){ const sec=document.getElementById('skyStageAllChart').closest('section'); if(sec) sec.remove(); }
    refreshSkyChartFilterOptionsV20();
    const rows = Array.isArray(baseRows) ? baseRows : currentRows();
    const queueRows = chartFilter(rows, 'skyQueueChartBrandFilter', 'Brand');
    const brandRows = chartFilter(rows, 'skyBrandChartQueueFilter', 'Queue');
    const stageRows = chartFilter(rows.filter(validOpenStage), 'skyStageChartBranchFilter', 'Branch');
    const branchRows = chartFilter(rows.filter(isOpen), 'skyBranchChartStageFilter', 'Stage');
    const readyRows = chartFilter(rows.filter(isReady), 'skyReadyAgingBrandFilter', 'Brand');
    const q=countBy(queueRows,'Queue',QUEUES), b=countBy(brandRows,'Brand',['Samsung','Apple']), st=countBy(stageRows,'Stage'), br=countBy(branchRows,'Branch'), ag=readyAgingBuckets(readyRows);
    setSummary('skyQueueSummary', q.labels,q.values,queueRows.length); setSummary('skyBrandSummary', b.labels,b.values,brandRows.length); setSummary('skyStageSummary', st.labels,st.values,stageRows.length); setSummary('skyBranchSummary', br.labels,br.values,branchRows.length); setSummary('skyReadyAgingSummary', ag.labels,ag.values,readyRows.length);
    makeBar('skyQueueChart', q.labels,q.values,queueRows.length, l=>window.setSkyQueue ? window.setSkyQueue(l) : null);
    makeBar('skyBrandChart', b.labels,b.values,brandRows.length, l=>window.setSkyBrand ? window.setSkyBrand(l) : null);
    makeBar('skyStageChart', st.labels,st.values,stageRows.length, l=>filterMainSkyMulti('skyStageFilter', l));
    makeBar('skyBranchChart', br.labels,br.values,branchRows.length, l=>filterMainSkyMulti('skyBranchFilter', l));
    makeBar('skyReadyAgingChart', ag.labels,ag.values,readyRows.length, null);
  }

  /* [dedup] orphan helper getSelectedValues removed */

  function filterMainSkyMulti(id, value){
    const el=document.getElementById(id); if(!el) return;
    if(el.multiple){ [...el.options].forEach(o=>o.selected = o.value === value); } else { el.value = value; }
    if(window.renderSky) window.renderSky();
    if(typeof scrollToElement==='function') scrollToElement('skyCasesTable');
  }

  function ensureExcelFiltersV20(){
    ['skyBranchFilter','skyStageFilter','skyJobTypeFilter'].forEach(id=>{
      const select=document.getElementById(id); if(!select) return; select.style.display='none';
      let wrap=document.getElementById(id+'_excel'); if(!wrap) return;
      wrap.classList.add('v20-fixed');
      const panel=wrap.querySelector('.excel-filter-panel'); const list=wrap.querySelector('.excel-filter-list'); const search=wrap.querySelector('.excel-filter-search');
      if(panel) panel.style.maxHeight='none'; if(list) list.style.maxHeight='240px'; if(search) search.placeholder='Search';
    });
  }

  const oldClear = window.clearSkyChartFilter;
  /* [dedup] superseded clearSkyChartFilter definition removed (was L2312) */

  const oldRenderSky = window.renderSky;
  window.renderSky = function(){
    if(oldRenderSky) oldRenderSky();
    try{
      if(!document.getElementById('skyPage')) return;
      const all = rowsAll();
      const filtered = currentRows();
      setText('skyTotalCases', all.length);
      setText('skyOpenCases', all.filter(isOpen).length);
      setText('skyReadyCases', all.filter(isReady).length);
      setText('skyDeliveredCases', all.filter(r=>txt(r.Queue)==='__REMOVED_QUEUE__').length);
      setText('skySamsungCases', all.filter(r=>txt(r.Brand)==='Samsung').length);
      setText('skyAppleCases', all.filter(r=>txt(r.Brand)==='Apple').length);
      updateSkyChartsV20(filtered);
      ensureExcelFiltersV20();
      updateCurrentTabDesign();
    }catch(e){ }
  };

  function applyBodyDesign(design){
    const d = design || 'volta';
    document.body.classList.remove(...DESIGN_CLASSES);
    document.body.classList.add('theme-'+d);
    ['gspnPage','skyPage'].forEach(id=>{ const p=document.getElementById(id); if(p){ p.classList.remove(...DESIGN_CLASSES); p.classList.add('theme-'+d); } });
  }
  function updateCurrentTabDesign(){
    const tab = activeTab();
    const design = localStorage.getItem(tab+'Design') || (tab==='sky' ? 'fallon' : 'volta');
    applyBodyDesign(design);
  }
  /* [dedup] superseded setDesign definition removed (was L2347) */
  const oldSwitchTab = window.switchTab;

  function addDesignButtons(){
    document.querySelectorAll('.design-options').forEach(box=>{
      const specs=[['fallon','Fallon Aqua'],['rolio','Rolio Creative'],['faraado','Faraado Energy'],['foodfinda','Foodfinda Fresh']];
      specs.forEach(([key,label])=>{ if(!box.querySelector(`[data-v20-design="${key}"]`)){ const b=document.createElement('button'); b.type='button'; b.dataset.v20Design=key; b.textContent=label; b.onclick=()=>window.setDesign(key); box.appendChild(b); } });
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(()=>{ addDesignButtons(); updateCurrentTabDesign(); refreshSkyChartFilterOptionsV20(); if(window.renderSky) window.renderSky(); },800);
  });
})();


/* ===== v21_final_script ===== */

(function(){
  const DESIGN_CLASSES = ["theme-pro","theme-glass","theme-fresh","theme-volta","theme-fallon","theme-rolio","theme-faraado","theme-foodfinda"];
  const SKY_QUEUES = ["Open_Cases", "Ready For Delivery Cases"];
  const SELECT_ALL = (window.ALL_VALUE || "__ALL__");
  const CHART_LABEL_PLUGIN_ID = 'v21SingleChartValueLabels';

  /* [dedup] orphan helper clean removed */
  function esc(v){ return String(v ?? '').replace(/[&<>\"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[s])); }
  /* [dedup] orphan helper pct removed */
  function activeTab(){ const sky=document.getElementById('skyPage'); return sky && sky.style.display !== 'none' ? 'sky' : 'gspn'; }
  function byId(id){ return document.getElementById(id); }
  /* [dedup] orphan helper setText removed */
  /* [dedup] orphan helper rowsAllSky removed */
  /* [dedup] orphan helper rowsCurrentSky removed */

  function unregisterOldLabelPlugins(){
    if(!window.Chart || !Chart.registry || !Chart.registry.plugins) return;
    ['v19Labels','v20SkyLabels','skyBarLabelErrorPlugin'].forEach(id=>{
      try{ const p=Chart.registry.plugins.get(id); if(p) Chart.unregister(p); }catch(e){}
    });
  }

  const v21LabelPlugin = {
    id: CHART_LABEL_PLUGIN_ID,
    afterDatasetsDraw(chart){
      const opts = chart.options && chart.options.plugins && chart.options.plugins[CHART_LABEL_PLUGIN_ID] || {};
      if(opts.display === false) return;
      const {ctx} = chart;
      ctx.save();
      ctx.font = opts.font || 'bold 12px Calibri, Arial, sans-serif';
      ctx.fillStyle = opts.color || '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      chart.data.datasets.forEach((ds, di) => {
        const meta = chart.getDatasetMeta(di);
        meta.data.forEach((bar, i) => {
          const val = Number(ds.data[i] || 0);
          if(!val) return;
          const p = bar.tooltipPosition ? bar.tooltipPosition() : {x:bar.x, y:bar.y};
          ctx.fillText(String(val), p.x, Math.max(14, p.y - 6));
        });
      });
      ctx.restore();
    }
  };

  /* [dedup] orphan helper chartBaseOptions removed */

  /* [dedup] orphan helper makeColumnChart removed */

  /* [dedup] orphan helper makeDoughnut removed */

  // GSPN charts: remove duplicate labels, use white chart fonts, and keep Total Cases constant under filters.
  /* [dedup] orphan helper countBy removed */
  /* [dedup] orphan helper avg removed */
  /* [dedup] orphan helper avgRepairBy removed */
  /* [dedup] orphan helper agingBuckets removed */
  /* [dedup] superseded updateCharts definition removed (was L2478) */

  const oldRender = window.render;
  window.render = function(){
    if(oldRender) oldRender();
    try{
      const totalAll = Array.isArray(window.allRows) ? window.allRows.length : 0;
      ensureGspnExcelFilters();
      updateGspnTimestamp();
    }catch(e){ }
  };

  // Excel style filters for both tabs.
  /* [dedup] orphan helper selectedValues removed */
  function applySelectValues(select, values, multiple){
    if(!select) return;
    const set=new Set(values||[]);
    if(multiple){
      [...select.options].forEach(o=>o.selected = set.size ? set.has(o.value) : o.value===SELECT_ALL);
      if(![...select.selectedOptions].length && select.options[0]) select.options[0].selected=true;
    }else{
      select.value = values && values.length ? values[0] : '';
    }
  }
  function excelFilter(selectId, opts){
    const select=byId(selectId); if(!select) return;
    const multiple = opts && opts.multiple !== undefined ? opts.multiple : !!select.multiple;
    select.style.display='none';
    let wrap=byId(selectId+'_excel');
    if(!wrap){ wrap=document.createElement('div'); wrap.className='excel-filter-container'; wrap.id=selectId+'_excel'; select.insertAdjacentElement('afterend', wrap); }
    wrap.className='excel-filter-container v21';
    const options=[...select.options].map(o=>({value:o.value, text:o.textContent || o.value, selected:o.selected}));
    const realSel=options.filter(o=>o.selected && o.value!==SELECT_ALL && o.value!=='');
    const isAll = multiple ? (!realSel.length || options.some(o=>o.value===SELECT_ALL && o.selected)) : !select.value;
    const summary = isAll ? '(Select All)' : realSel.length > 2 ? `${realSel.length} selected` : realSel.map(o=>o.text).join(', ');
    wrap.innerHTML = `<button type="button" class="excel-filter-button" title="${esc(summary)}">${esc(summary)}</button><div class="excel-filter-panel"><input class="excel-filter-search" placeholder="Search"/><div class="excel-filter-list"></div><div class="excel-filter-actions"><button type="button" class="ok">OK</button><button type="button" class="cancel">Cancel</button></div></div>`;
    const btn=wrap.querySelector('.excel-filter-button'), panel=wrap.querySelector('.excel-filter-panel'), list=wrap.querySelector('.excel-filter-list'), search=wrap.querySelector('.excel-filter-search');
    let temp=new Set(multiple ? options.filter(o=>o.selected).map(o=>o.value) : [select.value || '']);
    if(multiple && (!temp.size || temp.has(SELECT_ALL))) temp=new Set([SELECT_ALL]);
    function position(){
      const r=btn.getBoundingClientRect(); const w=Math.min(330, window.innerWidth-24); let left=Math.min(Math.max(12,r.left), window.innerWidth-w-12); let top=r.bottom+6; const maxH=Math.min(360, window.innerHeight-30); if(top+maxH>window.innerHeight) top=Math.max(12,r.top-maxH-6); panel.style.left=left+'px'; panel.style.top=top+'px'; panel.style.width=w+'px'; panel.style.maxHeight=maxH+'px'; list.style.maxHeight=Math.max(100,maxH-125)+'px';
    }
    function draw(filter=''){
      const term=filter.toLowerCase(); const visible=options.filter(o=>!term || o.text.toLowerCase().includes(term));
      list.innerHTML=visible.map(o=>`<label class="excel-filter-option"><input type="checkbox" data-value="${esc(o.value)}" ${temp.has(o.value)?'checked':''}> <span>${esc(o.text)}</span></label>`).join('');
      list.querySelectorAll('input').forEach(cb=>{ cb.onchange=()=>{ const val=cb.getAttribute('data-value'); if(multiple){ if(val===SELECT_ALL){ temp=cb.checked?new Set([SELECT_ALL]):new Set(); } else { temp.delete(SELECT_ALL); cb.checked?temp.add(val):temp.delete(val); if(!temp.size) temp.add(SELECT_ALL); } draw(search.value); } else { temp=new Set([cb.checked?val:'']); draw(search.value); } }; });
    }
    btn.onclick=e=>{ e.stopPropagation(); document.querySelectorAll('.excel-filter-container.open').forEach(x=>{ if(x!==wrap) x.classList.remove('open'); }); wrap.classList.toggle('open'); if(wrap.classList.contains('open')){ position(); setTimeout(()=>search.focus(),0); } };
    panel.onclick=e=>e.stopPropagation();
    wrap.querySelector('.cancel').onclick=()=>wrap.classList.remove('open');
    wrap.querySelector('.ok').onclick=()=>{ applySelectValues(select, [...temp], multiple); wrap.classList.remove('open'); if(selectId.startsWith('sky')){ window.renderSky && renderSky(); } else { window.render && render(); } };
    search.oninput=()=>draw(search.value);
    draw();
  }
  function ensureGspnExcelFilters(){
    ['branchFilter','techFilter','warrantyFilter','alertFilter'].forEach(id=>{ if(byId(id)) excelFilter(id,{multiple:true}); });
  }
  function ensureSkyExcelFilters(){
    excelFilter('skyBranchFilter',{multiple:true});
    excelFilter('skyQueueFilter',{multiple:false});
    excelFilter('skyBrandFilter',{multiple:false});
    excelFilter('skyStageFilter',{multiple:true});
    excelFilter('skyJobTypeFilter',{multiple:true});
  }
  document.addEventListener('click',()=>document.querySelectorAll('.excel-filter-container.open').forEach(x=>x.classList.remove('open')));
  window.addEventListener('resize',()=>document.querySelectorAll('.excel-filter-container.open .excel-filter-button').forEach(btn=>btn.click()));

  // SKY charts and buttons.
  /* [dedup] orphan helper isOpen removed */
  /* [dedup] orphan helper isReady removed */
  /* [dedup] orphan helper isDelivered removed */
  /* [dedup] orphan helper validOpenStage removed */
  /* [dedup] orphan helper chartFilter removed */
  /* [dedup] orphan helper countByKeep removed */
  /* [dedup] orphan helper refreshChartSelect removed */
  /* [dedup] orphan helper readyAgingMonths removed */
  /* [dedup] orphan helper setSummary removed */
  /* [dedup] orphan helper updateSkyChartFilterOptions removed */
  /* [dedup] orphan helper updateSkyCharts removed */
  /* [dedup] orphan helper filterSkyMulti removed */
  /* [dedup] superseded clearSkyChartFilter definition removed (was L2618) */

  const oldRenderSky = window.renderSky;
  /* [dedup] superseded renderSky definition removed (was L2621) */

  // Per-tab design. Changing design now affects only the current tab visually and in memory.
  function designFor(tab){ return localStorage.getItem('serviceEyeDesign_'+tab) || (tab==='sky' ? 'fallon' : 'volta'); }
  function applyDesignToPage(tab, design){
    const page=byId(tab==='sky'?'skyPage':'gspnPage'); if(!page) return;
    page.classList.remove(...DESIGN_CLASSES); page.classList.add('theme-'+design);
    if(activeTab()===tab){ document.body.classList.remove(...DESIGN_CLASSES); document.body.classList.add('theme-'+design); }
  }
  function applyCurrentTabDesign(){ const tab=activeTab(); applyDesignToPage(tab, designFor(tab)); }
  /* [dedup] superseded setDesign definition removed (was L2647) */
  const oldSwitchTab=window.switchTab;

  // Last update / upload timestamp displays.
  function ensureTimestampAfter(progressId, id, label){
    let el=byId(id); if(!el){ const p=byId(progressId); if(p){ el=document.createElement('div'); el.id=id; el.className='data-last-update'; p.insertAdjacentElement('afterend', el); } }
    if(el){ const saved=localStorage.getItem(id); el.textContent = saved ? `${label}: ${saved}` : `${label}: Not uploaded yet`; }
  }
  function updateGspnTimestamp(){ ensureTimestampAfter('uploadProgressWrap','gspnLastUploadTime','GSPN last data update'); }
  function updateSkyTimestamp(){ ensureTimestampAfter('skyUploadProgressWrap','skyLastUploadTime','SKY last data update'); }
  const oldHandleFile=window.handleFile;
  if(oldHandleFile){ window.handleFile=function(e){ localStorage.setItem('gspnLastUploadTime', new Date().toLocaleString()); updateGspnTimestamp(); return oldHandleFile.call(this,e); }; }
  const oldHandleSkyFile=window.handleSkyFile;
  if(oldHandleSkyFile){ window.handleSkyFile=function(e){ localStorage.setItem('skyLastUploadTime', new Date().toLocaleString()); updateSkyTimestamp(); return oldHandleSkyFile.call(this,e); }; }

  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(()=>{
      unregisterOldLabelPlugins();
      ensureGspnExcelFilters(); ensureSkyExcelFilters();
      updateGspnTimestamp(); updateSkyTimestamp(); applyCurrentTabDesign();
      if(window.render) render(); if(window.renderSky) renderSky();
    },900);
  });

  /* Expose helpers so later scripts can rebuild filters when needed
     (e.g. when the GSPN JobType filter is added dynamically). */
  window.ensureGspnExcelFilters = ensureGspnExcelFilters;
  window.ensureSkyExcelFilters = ensureSkyExcelFilters;
})();


/* ===== v22_final_script ===== */

(function(){
  const ALL = (typeof ALL_VALUE !== 'undefined' ? ALL_VALUE : '__ALL__');
  const DESIGN_CLASSES = ['theme-pro','theme-glass','theme-fresh','theme-volta','theme-fallon','theme-rolio','theme-faraado','theme-foodfinda'];
  const SKY_QUEUES = ['Open_Cases','Ready For Delivery Cases'];
  const LABEL_PLUGIN_ID = 'serviceEyeV22LabelsOnly';

  function q(id){ return document.getElementById(id); }
  function text(v){ return String(v ?? '').trim(); }
  function html(v){ return String(v ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s])); }
  function percent(n,d){ n=Number(n)||0; d=Number(d)||0; return d ? ((n*100/d).toFixed(1).replace(/\.0$/,'')) : '0'; }
  function setText(id, val){ const el=q(id); if(el) el.textContent = val; }
  function activeTab(){ const sky=q('skyPage'); return sky && sky.style.display !== 'none' ? 'sky' : 'gspn'; }
  function safeAllRows(){ try { return Array.isArray(allRows) ? allRows : []; } catch(e){ return []; } }
  function safeSkyRows(){ try { return Array.isArray(skyRows) ? skyRows : []; } catch(e){ return []; } }
  function safeCurrentSkyRows(){ try { return Array.isArray(currentSkyRows) ? currentSkyRows : safeSkyRows(); } catch(e){ return safeSkyRows(); } }
  /* [dedup] orphan helper safeCurrentGspnRows removed */

  /* [dedup] orphan helper selectedValues removed */
  function applyValues(select, values, multiple){
    const set = new Set(values || []);
    if(multiple){
      [...select.options].forEach(o => o.selected = set.size ? set.has(o.value) : o.value === ALL);
      if(![...select.selectedOptions].length && select.options[0]) select.options[0].selected = true;
    } else {
      select.value = values && values.length ? values[0] : '';
    }
  }
  function refreshButtonLabel(select, btn, multiple){
    const opts=[...select.options];
    const real=opts.filter(o=>o.selected && o.value!==ALL && o.value!=='');
    const label = multiple
      ? (!real.length || opts.some(o=>o.value===ALL && o.selected) ? '(Select All)' : real.length > 2 ? `${real.length} selected` : real.map(o=>o.textContent).join(', '))
      : (select.value ? (opts.find(o=>o.value===select.value)?.textContent || select.value) : '(Select All)');
    btn.textContent = label; btn.title = label;
  }
  function closeAllPanels(){ document.querySelectorAll('.excel-filter-panel.v22-portal.open').forEach(p=>p.classList.remove('open')); }
  document.addEventListener('click', closeAllPanels);
  window.addEventListener('scroll', closeAllPanels, true);
  window.addEventListener('resize', closeAllPanels);

  function portalExcelFilter(selectId, options){
    const select=q(selectId); if(!select) return;
    const multiple = options && options.multiple !== undefined ? !!options.multiple : !!select.multiple;
    select.style.display='none';
    let wrap=q(selectId+'_excel');
    if(!wrap){ wrap=document.createElement('div'); wrap.id=selectId+'_excel'; select.insertAdjacentElement('afterend', wrap); }
    wrap.className='excel-filter-container v22';
    let btn=wrap.querySelector('.excel-filter-button');
    if(!btn){ btn=document.createElement('button'); btn.type='button'; btn.className='excel-filter-button'; wrap.innerHTML=''; wrap.appendChild(btn); }
    refreshButtonLabel(select, btn, multiple);

    const panelId=selectId+'_excel_panel_v22';
    let panel=q(panelId);
    if(!panel){ panel=document.createElement('div'); panel.id=panelId; panel.className='excel-filter-panel v22-portal'; document.body.appendChild(panel); }
    const isSkyFilter = String(selectId || '').startsWith('sky');
    if(isSkyFilter) panel.classList.add('sky-filter-panel'); else panel.classList.remove('sky-filter-panel','sky-filter-panel-dark');
    function syncSkyFilterPanelTheme(){
      if(!isSkyFilter) return;
      const savedPageColor = localStorage.getItem('serviceEyePageColor_v2');
      const savedSkyColor = localStorage.getItem('serviceEyeColor_sky');
      const dark = document.body.dataset.pageColor === 'dark' || savedPageColor === 'dark' || savedSkyColor === 'black' || document.body.classList.contains('color-black') || document.body.classList.contains('theme-glass');
      panel.classList.toggle('sky-filter-panel-dark', dark);
    }
    syncSkyFilterPanelTheme();

    function readOptions(){ return [...select.options].map(o=>({value:o.value, text:o.textContent || o.value, selected:o.selected})); }
    function position(){
      const r=btn.getBoundingClientRect(); const w=Math.min(340, window.innerWidth-24);
      let left=Math.min(Math.max(12, r.left), window.innerWidth-w-12);
      let top=r.bottom+6; const maxH=Math.min(380, window.innerHeight-24);
      if(top+maxH>window.innerHeight) top=Math.max(12, r.top-maxH-6);
      panel.style.left=left+'px'; panel.style.top=top+'px'; panel.style.width=w+'px'; panel.style.maxHeight=maxH+'px';
    }
    function draw(temp, filter){
      const opts=readOptions(); const term=(filter||'').toLowerCase(); const visible=opts.filter(o=>!term || o.text.toLowerCase().includes(term));
      panel.innerHTML = `<input class="excel-filter-search" placeholder="Search"><div class="excel-filter-list">${visible.map(o=>`<label class="excel-filter-option"><input type="checkbox" data-value="${html(o.value)}" ${temp.has(o.value)?'checked':''}><span>${html(o.text)}</span></label>`).join('')}</div><div class="excel-filter-actions"><button type="button" class="ok">OK</button><button type="button" class="cancel">Cancel</button></div>`;
      const search=panel.querySelector('.excel-filter-search'), list=panel.querySelector('.excel-filter-list');
      list.querySelectorAll('input').forEach(cb=>{
        cb.onchange=()=>{
          const val=cb.getAttribute('data-value');
          if(multiple){
            if(val===ALL){ temp=cb.checked ? new Set([ALL]) : new Set(); }
            else { temp.delete(ALL); cb.checked ? temp.add(val) : temp.delete(val); if(!temp.size) temp.add(ALL); }
          } else {
            temp = new Set(cb.checked && val ? [val] : ['']);
          }
          draw(temp, search.value);
          panel.querySelector('.excel-filter-search').focus();
        };
      });
      search.value=filter||''; search.oninput=()=>draw(temp, search.value);
      panel.querySelector('.cancel').onclick=()=>panel.classList.remove('open');
      panel.querySelector('.ok').onclick=()=>{
        applyValues(select, [...temp].filter(Boolean), multiple);
        refreshButtonLabel(select, btn, multiple);
        panel.classList.remove('open');
        if(selectId.startsWith('sky')) { if(typeof renderSky==='function') renderSky(); }
        else { if(typeof render==='function') render(); }
      };
    }
    btn.onclick=(e)=>{
      e.stopPropagation();
      const isOpen=panel.classList.contains('open'); closeAllPanels();
      if(isOpen) return;
      const selected = multiple ? [...select.selectedOptions].map(o=>o.value) : [select.value||''];
      let temp=new Set(selected.length ? selected : [multiple ? ALL : '']);
      if(multiple && (!temp.size || temp.has(ALL))) temp=new Set([ALL]);
      syncSkyFilterPanelTheme(); draw(temp, ''); position(); panel.classList.add('open'); setTimeout(()=>panel.querySelector('.excel-filter-search')?.focus(), 0);
    };
    panel.onclick=e=>e.stopPropagation();
  }
  function ensureGspnFilters(){ ['branchFilter','techFilter','warrantyFilter','alertFilter'].forEach(id=>{ if(document.getElementById(id)) portalExcelFilter(id,{multiple:true}); }); }
  function ensureSkyFilters(){ portalExcelFilter('skyBranchFilter',{multiple:true}); portalExcelFilter('skyQueueFilter',{multiple:false}); portalExcelFilter('skyBrandFilter',{multiple:false}); portalExcelFilter('skyStageFilter',{multiple:true}); portalExcelFilter('skyJobTypeFilter',{multiple:true}); }

  /* [dedup] orphan helper unregisterLabelPlugins removed */
  const labelPlugin={ id: LABEL_PLUGIN_ID, afterDatasetsDraw(chart){ const opts=chart.options?.plugins?.[LABEL_PLUGIN_ID]||{}; if(opts.display===false) return; const {ctx}=chart; ctx.save(); ctx.font=opts.font||'bold 12px Calibri, Arial, sans-serif'; ctx.fillStyle=opts.color||'#ffffff'; ctx.textAlign='center'; ctx.textBaseline='bottom'; chart.data.datasets.forEach((ds,di)=>{ const meta=chart.getDatasetMeta(di); meta.data.forEach((bar,i)=>{ const val=Number(ds.data[i]||0); if(!val) return; const p=bar.tooltipPosition ? bar.tooltipPosition() : {x:bar.x,y:bar.y}; ctx.fillText(String(val), p.x, Math.max(14, p.y-6)); }); }); ctx.restore(); } };
  /* [dedup] orphan helper registerLabelPlugin removed */

  /* [dedup] orphan helper destroyChart removed */
  /* [dedup] orphan helper makeBar removed */
  /* [dedup] orphan helper makeDoughnut removed */
  /* [dedup] orphan helper countBy removed */
  /* [dedup] orphan helper avg removed */
  /* [dedup] orphan helper avgRepairBy removed */
  /* [dedup] orphan helper agingBuckets removed */

  /* [dedup] superseded updateCharts definition removed (was L2819) */

  function isSkyOpen(r){ return text(r.Queue)==='Open_Cases'; }
  function isSkyReady(r){ return text(r.Queue)==='Ready For Delivery Cases'; }
  function isSkyDelivered(r){ return text(r.Queue)==='__REMOVED_QUEUE__'; }
  /* [dedup] orphan helper validStage removed */
  /* [dedup] orphan helper chartFilter removed */
  /* [dedup] orphan helper setSummary removed */
  /* [dedup] orphan helper readyAging removed */
  /* [dedup] orphan helper refreshChartSelect removed */
  /* [dedup] orphan helper refreshSkyChartFilterOptions removed */
  /* [dedup] orphan helper filterSkyMulti removed */
  /* [dedup] superseded clearSkyChartFilter definition removed (was L2831) */
  /* [dedup] superseded updateSkyCharts definition removed (was L2832) */

  const skyPreviewCols=[['Queue','Queue'],['Brand','Brand'],['Branch','Branch'],['Open_Date_Display','Open Date'],['Aging_Days','Aging Days'],['Job_Number','Job Number'],['Status','Status'],['Stage','Stage'],['Item English Name','Item English Name'],['Price','Price']];
  window.renderSky=function(){ try{ if(!q('skyPage')) return; if(typeof getSkyFilteredRows==='function') currentSkyRows=getSkyFilteredRows(); else currentSkyRows=safeSkyRows(); const all=safeSkyRows(); const filtered=safeCurrentSkyRows(); setText('skyTotalCases', all.length); setText('skyOpenCases', all.filter(isSkyOpen).length); setText('skyReadyCases', all.filter(isSkyReady).length); setText('skyDeliveredCases', all.filter(isSkyDelivered).length); setText('skySamsungCases', all.filter(r=>text(r.Brand).toLowerCase()==='samsung').length); setText('skyAppleCases', all.filter(r=>text(r.Brand).toLowerCase()==='apple').length); setText('skyOpenPercent', `${percent(all.filter(isSkyOpen).length, all.length)}% of Total`); setText('skyReadyPercent', `${percent(all.filter(isSkyReady).length, all.length)}% of Total`); setText('skyDeliveredPercent', `${percent(all.filter(isSkyDelivered).length, all.length)}% of Total`); setText('skySamsungPercent', `${percent(all.filter(r=>text(r.Brand).toLowerCase()==='samsung').length, all.length)}% of Total`); setText('skyApplePercent', `${percent(all.filter(r=>text(r.Brand).toLowerCase()==='apple').length, all.length)}% of Total`); if(typeof renderTable==='function') renderTable('skyCasesTable', filtered.slice(0,1000), skyPreviewCols, false); ensureSkyFilters(); updateSkyCharts(filtered); renderLastUpdate('sky'); applyCurrentDesign(); } catch(e){ } };

  const originalRender=window.render;
  window.render=function(){ if(originalRender) originalRender(); try{ const all=safeAllRows(); ensureGspnFilters(); renderLastUpdate('gspn'); applyCurrentDesign(); }catch(e){ } };

  function renderLastUpdate(tab){
    const id=tab==='sky'?'skyLastUploadTime':'gspnLastUploadTime'; const wrapId=tab==='sky'?'skyUploadProgressWrap':'uploadProgressWrap'; const label=tab==='sky'?'Last SKY data update':'Last GSPN data update';
    document.querySelectorAll('.data-last-update').forEach(el=>{ if(el.id!==id) el.remove(); });
    let el=q(id); if(!el){ el=document.createElement('div'); el.id=id; el.className='data-last-update v22-single'; const wrap=q(wrapId); if(wrap) wrap.insertAdjacentElement('afterend', el); }
    el.className='data-last-update v22-single'; const saved=localStorage.getItem(id); el.textContent = saved ? `${label}: ${saved}` : `${label}: Not uploaded yet`;
  }
  const prevHandleFile=window.handleFile; if(prevHandleFile){ window.handleFile=function(e){ localStorage.setItem('gspnLastUploadTime', new Date().toLocaleString()); renderLastUpdate('gspn'); return prevHandleFile.call(this,e); }; }
  const prevHandleSky=window.handleSkyFile; if(prevHandleSky){ window.handleSkyFile=function(e){ localStorage.setItem('skyLastUploadTime', new Date().toLocaleString()); renderLastUpdate('sky'); return prevHandleSky.call(this,e); }; }

  function designKey(tab){ return 'serviceEyeDesign_'+tab; }
  function getDesign(tab){ return localStorage.getItem(designKey(tab)) || localStorage.getItem(tab+'Design') || (tab==='sky'?'fallon':'volta'); }
  function applyDesignTo(tab, design){ const page=q(tab==='sky'?'skyPage':'gspnPage'); if(page){ page.classList.remove(...DESIGN_CLASSES); page.classList.add('theme-'+design); } if(activeTab()===tab){ document.body.classList.remove(...DESIGN_CLASSES); document.body.classList.add('theme-'+design); } }
  function applyCurrentDesign(){ const tab=activeTab(); applyDesignTo(tab, getDesign(tab)); }
  /* [dedup] superseded setDesign definition removed (was L2853) */
  const prevSwitch=window.switchTab;
  document.addEventListener('DOMContentLoaded',()=>{ setTimeout(()=>{ ensureGspnFilters(); ensureSkyFilters(); renderLastUpdate('gspn'); renderLastUpdate('sky'); applyCurrentDesign(); if(typeof render==='function') window._bootOnce && window._bootOnce('main-render', render); if(q('skyPage') && activeTab()==='sky') window._bootOnce && window._bootOnce('sky-render', function(){ if(typeof renderSky==='function') renderSky(); }); },1200); });

  /* Expose helpers so the v65 jobTypeFilter setup can rebuild them. */
  window.ensureGspnFilters = ensureGspnFilters;
  window.ensureSkyFilters = ensureSkyFilters;
})();


/* ===== v23-glass-final-script ===== */

(function(){
  function qs(sel){ return document.querySelector(sel); }
  function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

  function forceGlassDark(){
    document.body.classList.remove('theme-pro','theme-fresh','theme-volta');
    document.body.classList.add('theme-glass');
    try {
      localStorage.setItem('serviceEyeDesign_gspn','glass');
      localStorage.setItem('serviceEyeDesign_sky','glass');
      localStorage.setItem('gspnDesign','glass');
      localStorage.setItem('skyDesign','glass');
      localStorage.setItem('serviceEyeDesign','glass');
    } catch(e) {}
    qsa('.design-options').forEach(el => el.style.display = 'none');
  }

  function normalizeLastUpdate(tab){
    const isSky = tab === 'sky';
    const id = isSky ? 'skyLastUploadTime' : 'gspnLastUploadTime';
    const wrapId = isSky ? 'skyUploadProgressWrap' : 'uploadProgressWrap';
    const label = isSky ? 'Last SKY data update' : 'Last GSPN data update';

    // Remove all legacy/duplicate update messages for the same tab.
    if (isSky) {
      qsa('#skyLastUpdate, .sky-last-update').forEach(el => el.remove());
      qsa('.data-last-update').forEach(el => {
        if (el.id !== id && /SKY/i.test(el.textContent || '')) el.remove();
      });
    } else {
      qsa('.data-last-update').forEach(el => {
        if (el.id !== id && /GSPN/i.test(el.textContent || '')) el.remove();
      });
    }

    let el = qs('#' + id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      const wrap = qs('#' + wrapId);
      if (wrap) wrap.insertAdjacentElement('afterend', el);
    }
    el.className = 'data-last-update v23-single-update';
    const saved = localStorage.getItem(id) || localStorage.getItem(isSky ? 'skyLastUploadTime' : 'gspnLastUploadTime');
    el.textContent = saved ? `${label}: ${saved}` : `${label}: Not uploaded yet`;
  }

  function activeTab(){
    const sky = qs('#skyPage');
    if (sky && sky.style.display !== 'none' && !sky.hidden) return 'sky';
    return 'gspn';
  }

  function applyV23Fixes(){
    forceGlassDark();
    normalizeLastUpdate(activeTab());
    qsa('.filter-label, .excel-filter-label, .sky-filter-label').forEach(el => {
      el.style.color = (document.body.classList.contains('theme-glass') || document.body.dataset.pageColor === 'dark') ? '#cbd5e1' : '#000000';
      el.style.opacity = '1';
      el.style.textShadow = 'none';
    });
  }

  // Override design switching: Glass Dark only.
  window.setDesign = function(){
    forceGlassDark();
    applyV23Fixes();
  };

  // Wrap tab switching to keep glass and update only visible/current tab.
  const oldSwitchTab = window.switchTab;
  if (typeof oldSwitchTab === 'function') {
  }

  // Wrap uploads and update only one update label.
  const oldHandleFile = window.handleFile;
  if (typeof oldHandleFile === 'function') {
    window.handleFile = function(e){
      try { localStorage.setItem('gspnLastUploadTime', new Date().toLocaleString()); } catch(err) {}
      normalizeLastUpdate('gspn');
      return oldHandleFile.apply(this, arguments);
    };
  }

  const oldHandleSkyFile = window.handleSkyFile;
  if (typeof oldHandleSkyFile === 'function') {
    window.handleSkyFile = function(e){
      try { localStorage.setItem('skyLastUploadTime', new Date().toLocaleString()); } catch(err) {}
      normalizeLastUpdate('sky');
      return oldHandleSkyFile.apply(this, arguments);
    };
  }

  // Wrap renders because older injected scripts may recreate the duplicate update labels.
  const oldRender = window.render;
  if (typeof oldRender === 'function') {
    window.render = function(){
      const result = oldRender.apply(this, arguments);
      setTimeout(applyV23Fixes, 30);
      return result;
    };
  }

  const oldRenderSky = window.renderSky;
  if (typeof oldRenderSky === 'function') {
    window.renderSky = function(){
      const result = oldRenderSky.apply(this, arguments);
      setTimeout(function(){ forceGlassDark(); normalizeLastUpdate('sky'); }, 30);
      return result;
    };
  }

  document.addEventListener('DOMContentLoaded', function(){
    setTimeout(applyV23Fixes, 100);
  });
})();


/* ===== v24-interactive-chart-script ===== */

(function(){
  const ALL = (typeof ALL_VALUE !== 'undefined' ? ALL_VALUE : '__ALL__');
  const SKY_QUEUES = ['Open_Cases','Ready For Delivery Cases'];
  const GLASS_COLORS = ['#60a5fa','#34d399','#fbbf24','#f87171','#a78bfa','#22d3ee','#fb7185','#c084fc','#4ade80','#f472b6','#38bdf8','#facc15'];
  const LABEL_PLUGIN_ID = 'serviceEyeV24SingleLabels';

  function q(id){ return document.getElementById(id); }
  function txt(v){ return String(v ?? '').trim(); }
  function pct(n,d){ n=Number(n)||0; d=Number(d)||0; return d ? ((n*100/d).toFixed(1).replace(/\.0$/,'')) : '0'; }
  function rowsSkyAll(){ try { return Array.isArray(skyRows) ? skyRows : []; } catch(e){ return []; } }
  function rowsGspnAll(){ try { return Array.isArray(allRows) ? allRows : []; } catch(e){ return []; } }
  function rowsGspnCurrent(){ try { return Array.isArray(currentFilteredRows) ? currentFilteredRows : rowsGspnAll(); } catch(e){ return rowsGspnAll(); } }
  function setText(id,v){ const el=q(id); if(el) el.textContent=v; }

  function closeExcelPanels(){ document.querySelectorAll('.excel-filter-panel.v22-portal.open,.excel-filter-container.open').forEach(p=>p.classList.remove('open')); }
  window.addEventListener('resize', closeExcelPanels, true);
  window.addEventListener('scroll', closeExcelPanels, true);

  function updateExcelLabel(selectId){
    const select=q(selectId), wrap=q(selectId+'_excel'); if(!select||!wrap) return;
    const btn=wrap.querySelector('.excel-filter-button'); if(!btn) return;
    const opts=[...select.options];
    const real=opts.filter(o=>o.selected && o.value!==ALL && o.value!=='');
    let label;
    if(select.multiple){ label=(!real.length || opts.some(o=>o.value===ALL && o.selected)) ? '(Select All)' : (real.length>2?`${real.length} selected`:real.map(o=>o.textContent).join(', ')); }
    else { label=select.value ? (opts.find(o=>o.value===select.value)?.textContent || select.value) : '(Select All)'; }
    btn.textContent=label; btn.title=label;
  }
  /* [dedup] orphan helper setSingle removed */
  function setMulti(selectId,value){ const el=q(selectId); if(!el) return; [...el.options].forEach(o=>o.selected = o.value === value); updateExcelLabel(selectId); }
  /* [dedup] orphan helper resetSkyMainMenus removed */
  function resetGspnMainMenus(){
    ['branchFilter','techFilter','warrantyFilter','alertFilter'].forEach(id=>{ const el=q(id); if(el){ [...el.options].forEach((o,i)=>o.selected = i===0 || o.value===ALL); updateExcelLabel(id); }});
    const s=q('searchBox'); if(s) s.value='';
  }

  function isSkyOpen(r){ return txt(r.Queue)==='Open_Cases'; }
  function isSkyReady(r){ return txt(r.Queue)==='Ready For Delivery Cases'; }
  function isSkyDelivered(r){ return txt(r.Queue)==='__REMOVED_QUEUE__'; }
  function validOpenStage(r){ const s=txt(r.Stage).toLowerCase(); return isSkyOpen(r) && s && s!=='delivered' && !s.includes('ready for delivery'); }
  function chartFilter(rows,id,field){ const el=q(id); const v=el ? txt(el.value) : ''; return v ? rows.filter(r=>txt(r[field])===v) : rows; }
  function countBy(rows,field,ordered,limit){
    const c={}; (rows||[]).forEach(r=>{ const k=txt(r[field]) || 'Blank'; c[k]=(c[k]||0)+1; });
    let arr = ordered ? ordered.map(k=>[k,c[k]||0]) : Object.entries(c).sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0]));
    if(limit) arr=arr.slice(0,limit);
    return {labels:arr.map(x=>x[0]), values:arr.map(x=>x[1])};
  }
  function avgBy(rows,field,limit){
    const g={}; (rows||[]).forEach(r=>{ const key=txt(r[field]) || 'Blank'; const n=Number(r.RepairDurationDays); if(Number.isFinite(n)){ (g[key]||(g[key]=[])).push(n); }});
    let arr=Object.entries(g).map(([k,a])=>[k,a.reduce((x,y)=>x+y,0)/a.length]).sort((a,b)=>b[1]-a[1]);
    if(limit) arr=arr.slice(0,limit);
    return {labels:arr.map(x=>x[0]), values:arr.map(x=>Number(x[1].toFixed(1)))};
  }
  function agingBuckets(rows){
    const labels=['0-2','3-4','5-7','8-14','15+']; const values=[0,0,0,0,0];
    (rows||[]).filter(r=>txt(r.StatusFinal)==='Open').forEach(r=>{ const n=Number(r.AgingDays); if(!Number.isFinite(n)) return; if(n<=2) values[0]++; else if(n<=4) values[1]++; else if(n<=7) values[2]++; else if(n<=14) values[3]++; else values[4]++; });
    return {labels,values};
  }
  function readyAgingMonths(rows){
    const labels=['0-3','4-7','more than 7']; const values=[0,0,0];
    (rows||[]).forEach(r=>{ const days=Number(r.Aging_Days ?? r.AgingDays ?? r['Aging Days']); if(!Number.isFinite(days)) return; const m=days/30; if(m<=3) values[0]++; else if(m<=7) values[1]++; else values[2]++; });
    return {labels,values};
  }

  function unregisterOldLabelPlugins(){
    if(!window.Chart || !Chart.registry || !Chart.registry.plugins) return;
    ['v19Labels','v20SkyLabels','skyBarLabelErrorPlugin','v21SingleChartValueLabels','serviceEyeV22LabelsOnly','serviceEyeV24SingleLabels'].forEach(id=>{ try{ const p=Chart.registry.plugins.get(id); if(p) Chart.unregister(p); }catch(e){} });
  }
  const labelPlugin={ id:LABEL_PLUGIN_ID, afterDatasetsDraw(chart){ const opts=chart.options?.plugins?.[LABEL_PLUGIN_ID]||{}; if(opts.display===false) return; const {ctx}=chart; ctx.save(); ctx.font='bold 12px Calibri, Arial, sans-serif'; ctx.fillStyle=opts.color||'#ffffff'; ctx.textAlign='center'; ctx.textBaseline='bottom'; chart.data.datasets.forEach((ds,di)=>{ const meta=chart.getDatasetMeta(di); meta.data.forEach((bar,i)=>{ const val=Number(ds.data[i]||0); if(!val) return; const p=bar.tooltipPosition ? bar.tooltipPosition() : {x:bar.x,y:bar.y}; ctx.fillText(String(val), p.x, Math.max(14,p.y-6)); }); }); ctx.restore(); }};
  function registerLabels(){ unregisterOldLabelPlugins(); try{Chart.register(labelPlugin); }catch(e){} }
  function destroy(id){ if(window.dashboardCharts && dashboardCharts[id]){ try{ dashboardCharts[id].destroy(); }catch(e){} } if(!window.dashboardCharts) window.dashboardCharts={}; }
  function makeClusteredColumn(id, labels, values, title, clickFn){
    if(!window.Chart) return; const canvas=q(id); if(!canvas) return; registerLabels(); destroy(id);
    const total=values.reduce((a,b)=>a+Number(b||0),0); const max=Math.max(...values,0);
    dashboardCharts[id]=__safeNewChart(canvas,{ type:'bar', data:{ labels, datasets:[{ label:title||'Cases', data:values, backgroundColor:labels.map((_,i)=>GLASS_COLORS[i%GLASS_COLORS.length]), borderColor:labels.map((_,i)=>GLASS_COLORS[i%GLASS_COLORS.length]), borderWidth:1 }]}, options:{ responsive:true, maintainAspectRatio:false, layout:{padding:{top:28}}, plugins:{ legend:{display:false, labels:{color:'#ffffff'}}, tooltip:{callbacks:{label:ctx=>`${title||'Cases'}: ${ctx.raw} (${pct(ctx.raw,total)}%)`}}, [LABEL_PLUGIN_ID]:{color:'#ffffff'} }, scales:{ x:{ticks:{color:'#ffffff', autoSkip:false, maxRotation:45, minRotation:0}, grid:{color:'rgba(255,255,255,.10)'}}, y:{beginAtZero:true, suggestedMax:max*1.2+1, ticks:{color:'#ffffff'}, grid:{color:'rgba(255,255,255,.10)'}} }, onClick:(evt,elements)=>{ if(elements.length && clickFn) clickFn(labels[elements[0].index]); } } });
  }

  function ensureClearButtons(){
    const gspnIds=['failedReasonChart','kpiChart','branchChart','techChart','repairDaysChart','agingChart'];
    const skyIds=['skyQueueChart','skyBrandChart','skyStageChart','skyBranchChart','skyReadyAgingChart'];
    gspnIds.forEach(id=>{ const sec=q(id)?.closest('section,.chart-card'); const h=sec?.querySelector('h2'); if(h && !h.querySelector('.v24-gspn-clear')){ const b=document.createElement('button'); b.type='button'; b.className='chart-clear-btn v24-gspn-clear'; b.textContent='Clear Chart Filter'; b.onclick=(e)=>{ e.stopPropagation(); window.clearGspnChartFilter(); }; h.appendChild(b); }});
    skyIds.forEach(id=>{ const sec=q(id)?.closest('section,.chart-card'); const h=sec?.querySelector('h2'); if(h && !h.querySelector('.v24-sky-clear')){ const b=document.createElement('button'); b.type='button'; b.className='chart-clear-btn v24-sky-clear'; b.textContent='Clear Chart Filter'; b.onclick=(e)=>{ e.stopPropagation(); window.clearSkyChartFilter(); }; h.appendChild(b); }});
  }

  /* [dedup] superseded setSkyQueue definition removed (was L3073) */
  /* [dedup] superseded setSkyBrand definition removed (was L3074) */
  /* [dedup] superseded clearSkyChartFilter definition removed (was L3075) */
  window.clearGspnChartFilter=function(){
    resetGspnMainMenus();
    try { if(typeof clearFilters==='function') clearFilters(false); else if(typeof render==='function') render(); } catch(e){ if(typeof render==='function') render(); }
  };

  function updateSkyChartsV24(rows){
    rows=Array.isArray(rows)?rows:[];
    const queueRows=chartFilter(rows,'skyQueueChartBrandFilter','Brand');
    const brandRows=chartFilter(rows,'skyBrandChartQueueFilter','Queue');
    const stageRows=chartFilter(rows.filter(validOpenStage),'skyStageChartBranchFilter','Branch');
    const branchRows=chartFilter(rows.filter(isSkyOpen),'skyBranchChartStageFilter','Stage');
    const readyRows=chartFilter(rows.filter(isSkyReady),'skyReadyAgingBrandFilter','Brand');
    const qdata=countBy(queueRows,'Queue',SKY_QUEUES); const bdata=countBy(brandRows,'Brand',['Samsung','Apple']); const st=countBy(stageRows,'Stage',null,20); const br=countBy(branchRows,'Branch',null,30); const ag=readyAgingMonths(readyRows);
    makeClusteredColumn('skyQueueChart', qdata.labels, qdata.values, 'Cases', label=>window.setSkyQueue(label));
    makeClusteredColumn('skyBrandChart', bdata.labels, bdata.values, 'Cases', label=>window.setSkyBrand(label));
    makeClusteredColumn('skyStageChart', st.labels, st.values, 'Open Cases', label=>{ setMulti('skyStageFilter',label); if(typeof renderSky==='function') renderSky(); });
    makeClusteredColumn('skyBranchChart', br.labels, br.values, 'Open Cases', label=>{ setMulti('skyBranchFilter',label); if(typeof renderSky==='function') renderSky(); });
    makeClusteredColumn('skyReadyAgingChart', ag.labels, ag.values, 'Ready Cases', null);
  }

  function updateGspnChartsV24(rows){
    rows=Array.isArray(rows)?rows:rowsGspnCurrent();
    const failed=rows.filter(r=>txt(r.KPIAlert).includes('Failed'));
    const failedReason=countBy(failed,'KPIFailName',['LTP','TAT']);
    const kpiLabels=['Failed LTP','Failed TAT','Fix Today','Watch 48h','On Track','Review','Done'];
    const kpiValues=[rows.filter(r=>txt(r.KPIAlert)==='Failed'&&txt(r.KPIFailName)==='LTP').length, rows.filter(r=>txt(r.KPIAlert)==='Failed'&&txt(r.KPIFailName)==='TAT').length, rows.filter(r=>txt(r.KPIAlert)==='Fix Today').length, rows.filter(r=>txt(r.KPIAlert)==='Watch').length, rows.filter(r=>txt(r.KPIAlert)==='On Track').length, rows.filter(r=>txt(r.KPIAlert)==='Review').length, rows.filter(r=>txt(r.KPIAlert)==='Done').length];
    const openRows=rows.filter(r=>txt(r.StatusFinal)==='Open');
    const br=countBy(openRows,'GSPN_Branch',null,15); const st=countBy(openRows,'GSPN_Status',null,15); const rep=avgBy(rows,'GSPN_Branch',15); const ag=agingBuckets(rows);
    makeClusteredColumn('failedReasonChart', failedReason.labels, failedReason.values, 'Failed KPI', label=>{ if(typeof showFailedType==='function') showFailedType(label); });
    makeClusteredColumn('kpiChart', kpiLabels, kpiValues, 'Cases', label=>{ if(label==='Failed LTP'&&typeof showFailedType==='function') showFailedType('LTP'); else if(label==='Failed TAT'&&typeof showFailedType==='function') showFailedType('TAT'); else if(label==='Fix Today'&&typeof showOnlyAlert==='function') showOnlyAlert('Fix Today'); else if(label==='Watch 48h'&&typeof showOnlyAlert==='function') showOnlyAlert('Watch'); });
    makeClusteredColumn('branchChart', br.labels, br.values, 'Open Cases', label=>{ if(typeof filterByBranch==='function') filterByBranch(label); });
    makeClusteredColumn('techChart', st.labels, st.values, 'Open Cases', label=>{ if(typeof filterByGspnStatus==='function') filterByGspnStatus(label); });
    makeClusteredColumn('repairDaysChart', rep.labels, rep.values, 'Avg Repair Days', label=>{ if(typeof filterByBranch==='function') filterByBranch(label); });
    makeClusteredColumn('agingChart', ag.labels, ag.values, 'Open Cases', null);
  }

  /* [dedup] superseded updateCharts definition removed (was L3116) */

  const oldRenderSky=window.renderSky;
  window.renderSky=function(){
    const result = oldRenderSky ? oldRenderSky.apply(this, arguments) : undefined;
    setTimeout(()=>{
      try{
        const all=rowsSkyAll(); const filtered=(typeof getSkyFilteredRows==='function')?getSkyFilteredRows():(Array.isArray(window.currentSkyRows)?window.currentSkyRows:all);
        setText('skyTotalCases', all.length); setText('skyOpenCases', all.filter(isSkyOpen).length); setText('skyReadyCases', all.filter(isSkyReady).length); setText('skyDeliveredCases', all.filter(isSkyDelivered).length);
        setText('skySamsungCases', all.filter(r=>txt(r.Brand).toLowerCase()==='samsung').length); setText('skyAppleCases', all.filter(r=>txt(r.Brand).toLowerCase()==='apple').length);
        updateSkyChartsV24(filtered); ensureClearButtons();
      }catch(e){ }
    },20);
    return result;
  };

  const oldRender=window.render;
  window.render=function(){
    const result=oldRender ? oldRender.apply(this,arguments) : undefined;
    setTimeout(()=>{ try{ updateGspnChartsV24(rowsGspnCurrent()); ensureClearButtons(); }catch(e){} },20);
    return result;
  };

  document.addEventListener('DOMContentLoaded',()=>{ setTimeout(()=>{ ensureClearButtons(); if(typeof render==='function') render(); if(q('skyPage') && q('skyPage').style.display!=='none' && typeof renderSky==='function') renderSky(); },1200); });
})();


/* ===== v25-3d-interactive-script ===== */

(function(){
  const ALL = (typeof ALL_VALUE !== 'undefined' ? ALL_VALUE : '__ALL__');
  const QUEUES = ['Open_Cases','Ready For Delivery Cases'];
  const COLOR_PALETTES = {
    blue:   ['#38bdf8','#60a5fa','#2563eb','#22d3ee','#93c5fd','#0ea5e9','#0284c7','#67e8f9'],
    green:  ['#34d399','#22c55e','#84cc16','#10b981','#4ade80','#a3e635','#14b8a6','#65a30d'],
    orange: ['#fb923c','#f97316','#f59e0b','#facc15','#fdba74','#ea580c','#fbbf24','#fb7185'],
    purple: ['#a78bfa','#7c3aed','#c084fc','#e879f9','#818cf8','#9333ea','#f0abfc','#6366f1'],
    black:  ['#050505','#111827','#1f2937','#374151','#0f172a','#27272a','#3f3f46','#18181b']
  };
  const state = { skyReadyBucket: null };
  const LABEL_PLUGIN_ID='serviceEyeV25Labels3D';
  const BAR3D_PLUGIN_ID='serviceEyeV25Bar3D';

  function q(id){ return document.getElementById(id); }
  function clean(v){ return String(v ?? '').trim(); }
  function num(v){ const n=Number(v); return Number.isFinite(n)?n:0; }
  function pct(n,d){ n=num(n); d=num(d); return d ? ((n*100/d).toFixed(1).replace(/\.0$/,'')) : '0'; }
  function allSky(){ try { return Array.isArray(skyRows) ? skyRows : []; } catch(e){ return []; } }
  function allGspn(){ try { return Array.isArray(allRows) ? allRows : []; } catch(e){ return []; } }
  function curGspn(){ try { return Array.isArray(currentFilteredRows) ? currentFilteredRows : allGspn(); } catch(e){ return allGspn(); } }
  function setText(id,val){ const el=q(id); if(el) el.textContent=val; }
  function activeTab(){ const sky=q('skyPage'); return sky && sky.style.display !== 'none' ? 'sky' : 'gspn'; }
  function currentAccent(){ return localStorage.getItem('serviceEyeColor_'+activeTab()) || 'purple'; }
  function palette(){ return COLOR_PALETTES[currentAccent()] || COLOR_PALETTES.purple; }

  function applyColor(color, tab){
    const safe = COLOR_PALETTES[color] ? color : 'purple';
    const targetTab = tab || activeTab();
    localStorage.setItem('serviceEyeColor_'+targetTab, safe);
    document.body.classList.remove('color-blue','color-green','color-orange','color-purple','color-black');
    document.body.classList.add('color-'+safe);
    document.querySelectorAll('.color-dot').forEach(b=>b.classList.toggle('active', b.dataset.color===safe));
    setTimeout(()=>{ if(targetTab==='sky' && typeof window.renderSky==='function') window.renderSky(); if(targetTab==='gspn' && typeof window.render==='function') window.render(); },30);
  }
  window.setPageColor = function(color){ applyColor(color, activeTab()); };

  function ensureColorSelector(){
    /* Removed duplicate legacy PAGE COLOR block.
       The single active Page Color control is codexPageColorPanel in the sidebar bottom. */
    var legacy=document.getElementById('v25ColorOptions');
    if(legacy){
      var title=legacy.previousElementSibling;
      if(title && title.classList && title.classList.contains('side-section-title')) title.remove();
      legacy.remove();
    }
  }

  function updateExcelLabel(id){
    const select=q(id), wrap=q(id+'_excel'); if(!select||!wrap) return;
    const btn=wrap.querySelector('.excel-filter-button'); if(!btn) return;
    const opts=[...select.options];
    const real=opts.filter(o=>o.selected && o.value!==ALL && o.value!=='');
    let label;
    if(select.multiple){
      label=(!real.length || opts.some(o=>o.value===ALL && o.selected)) ? '(Select All)' : (real.length>2 ? `${real.length} selected` : real.map(o=>o.textContent).join(', '));
    } else label=select.value ? (opts.find(o=>o.value===select.value)?.textContent || select.value) : '(Select All)';
    btn.textContent=label; btn.title=label;
  }
  function setSingle(id,value){ const el=q(id); if(!el) return; el.value=value||''; updateExcelLabel(id); }
  function setMulti(id,value){ const el=q(id); if(!el) return; [...el.options].forEach(o=>o.selected=o.value===value); updateExcelLabel(id); }
  function resetMulti(id){ const el=q(id); if(!el) return; [...el.options].forEach((o,i)=>o.selected=(o.value===ALL || i===0)); updateExcelLabel(id); }

  function isOpen(r){ return clean(r.Queue)==='Open_Cases'; }
  function isReady(r){ return clean(r.Queue)==='Ready For Delivery Cases'; }
  function isDelivered(r){ return clean(r.Queue)==='__REMOVED_QUEUE__'; }
  function validOpenStage(r){ const s=clean(r.Stage).toLowerCase(); return isOpen(r) && s && s!=='delivered' && !s.includes('ready for delivery'); }
  function readyBucket(r){ const days=num(r.Aging_Days ?? r.AgingDays ?? r['Aging Days']); const m=days/30; if(m<=3) return '0-3'; if(m<=7) return '4-7'; return 'more than 7'; }
  function readyAging(rows){ const labels=['0-3','4-7','more than 7']; const values=[0,0,0]; rows.forEach(r=>{ const b=readyBucket(r); const i=labels.indexOf(b); if(i>=0) values[i]++; }); return {labels,values}; }
  function chartFilter(rows,id,field){ const el=q(id); const v=el?clean(el.value):''; return v ? rows.filter(r=>clean(r[field])===v) : rows; }
  function countBy(rows,field,ordered,limit){
    const c={}; (rows||[]).forEach(r=>{ const key=clean(r[field])||'Blank'; c[key]=(c[key]||0)+1; });
    let arr=ordered ? ordered.map(k=>[k,c[k]||0]) : Object.entries(c).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
    if(limit) arr=arr.slice(0,limit);
    return {labels:arr.map(x=>x[0]), values:arr.map(x=>x[1])};
  }
  function avgBy(rows,field,limit){
    const g={}; (rows||[]).forEach(r=>{ const k=clean(r[field])||'Blank'; const n=Number(r.RepairDurationDays); if(Number.isFinite(n)){ (g[k]||(g[k]=[])).push(n); }});
    let arr=Object.entries(g).map(([k,a])=>[k,a.reduce((x,y)=>x+y,0)/a.length]).sort((a,b)=>b[1]-a[1]); if(limit) arr=arr.slice(0,limit);
    return {labels:arr.map(x=>x[0]), values:arr.map(x=>Number(x[1].toFixed(1)))};
  }
  function agingBuckets(rows){ const labels=['0-2','3-4','5-7','8-14','15+']; const values=[0,0,0,0,0]; (rows||[]).filter(r=>clean(r.StatusFinal)==='Open').forEach(r=>{ const d=Number(r.AgingDays); if(!Number.isFinite(d)) return; if(d<=2) values[0]++; else if(d<=4) values[1]++; else if(d<=7) values[2]++; else if(d<=14) values[3]++; else values[4]++; }); return {labels,values}; }

  function unregister(){
    if(!window.Chart || !Chart.registry || !Chart.registry.plugins) return;
    ['serviceEyeV24SingleLabels','serviceEyeV25Labels3D','serviceEyeV25Bar3D','v19Labels','v20SkyLabels','v21SingleChartValueLabels','serviceEyeV22LabelsOnly','skyBarLabelErrorPlugin'].forEach(id=>{ try{ const p=Chart.registry.plugins.get(id); if(p) Chart.unregister(p); }catch(e){} });
  }
  const labelPlugin={ id:LABEL_PLUGIN_ID, afterDatasetsDraw(chart){ const opts=chart.options?.plugins?.[LABEL_PLUGIN_ID]||{}; if(opts.display===false) return; const {ctx}=chart; ctx.save(); ctx.font='bold 12px Calibri, Arial, sans-serif'; ctx.fillStyle=opts.color||'#ffffff'; ctx.textAlign='center'; ctx.textBaseline='bottom'; chart.data.datasets.forEach((ds,di)=>{ const meta=chart.getDatasetMeta(di); meta.data.forEach((bar,i)=>{ const val=Number(ds.data[i]||0); if(!val && opts.hideZero!==false) return; const p=bar.tooltipPosition?bar.tooltipPosition():{x:bar.x,y:bar.y}; ctx.fillText(String(val), p.x, Math.max(14,p.y-8)); }); }); ctx.restore(); } };
  const bar3DPlugin={ id:BAR3D_PLUGIN_ID, afterDatasetsDraw(chart){ if(chart.config.type!=='bar') return; const {ctx}=chart; const dx=8, dy=-7; ctx.save(); chart.data.datasets.forEach((ds,di)=>{ const meta=chart.getDatasetMeta(di); meta.data.forEach((bar,i)=>{ const v=Number(ds.data[i]||0); if(!v) return; const w=bar.width || 24; const x=bar.x, y=bar.y, base=bar.base; const left=x-w/2, right=x+w/2; ctx.fillStyle='rgba(255,255,255,.18)'; ctx.beginPath(); ctx.moveTo(left,y); ctx.lineTo(right,y); ctx.lineTo(right+dx,y+dy); ctx.lineTo(left+dx,y+dy); ctx.closePath(); ctx.fill(); ctx.fillStyle='rgba(0,0,0,.30)'; ctx.beginPath(); ctx.moveTo(right,y); ctx.lineTo(right,base); ctx.lineTo(right+dx,base+dy); ctx.lineTo(right+dx,y+dy); ctx.closePath(); ctx.fill(); }); }); ctx.restore(); } };
  function reg(){ unregister(); try{Chart.register(bar3DPlugin,labelPlugin); }catch(e){} }
  function destroy(id){ if(window.dashboardCharts && dashboardCharts[id]){ try{ dashboardCharts[id].destroy(); }catch(e){} } if(!window.dashboardCharts) window.dashboardCharts={}; }
  function make3D(id, labels, values, title, clickFn){
    if(!window.Chart) return; const canvas=q(id); if(!canvas) return; reg(); destroy(id);
    const pal=palette(); const total=values.reduce((a,b)=>a+num(b),0); const max=Math.max(...values.map(num),0);
    dashboardCharts[id]=__safeNewChart(canvas,{ type:'bar', data:{ labels, datasets:[{ label:title||'Cases', data:values, backgroundColor:labels.map((_,i)=>pal[i%pal.length]), borderColor:labels.map((_,i)=>pal[(i+1)%pal.length]), borderWidth:1, borderRadius:4, borderSkipped:false }]}, options:{ responsive:true, maintainAspectRatio:false, layout:{padding:{top:32,right:14}}, plugins:{ legend:{display:false, labels:{color:'#ffffff'}}, tooltip:{callbacks:{label:ctx=>`${title||'Cases'}: ${ctx.raw} (${pct(ctx.raw,total)}%)`}}, [LABEL_PLUGIN_ID]:{color:'#ffffff'}, [BAR3D_PLUGIN_ID]:{} }, scales:{ x:{ticks:{color:'#ffffff', autoSkip:false, maxRotation:45, minRotation:0}, grid:{color:'rgba(255,255,255,.10)'}}, y:{beginAtZero:true, suggestedMax:max*1.25+1, ticks:{color:'#ffffff'}, grid:{color:'rgba(255,255,255,.10)'}} }, onClick:(evt,elements)=>{ if(elements.length && clickFn) clickFn(labels[elements[0].index]); } } });
  }

  function baseSkyFiltered(){ try { return typeof getSkyFilteredRows==='function' ? getSkyFilteredRows() : allSky(); } catch(e){ return allSky(); } }
  function skyRowsForTable(){ let rows=baseSkyFiltered(); if(state.skyReadyBucket){ rows=rows.filter(r=>isReady(r)&&readyBucket(r)===state.skyReadyBucket); } return rows; }
  function clearChartSelects(){ ['skyQueueChartBrandFilter','skyBrandChartQueueFilter','skyStageChartBranchFilter','skyBranchChartStageFilter','skyReadyAgingBrandFilter','skyStageAllQueueFilter'].forEach(id=>{ const el=q(id); if(el) el.value=''; }); }
  /* [dedup] superseded clearSkyChartFilter definition removed (was L3245) */
  /* [dedup] superseded setSkyQueue definition removed (was L3246) */
  /* [dedup] superseded setSkyBrand definition removed (was L3247) */

  const oldClearSky=window.clearSkyFilters;
  window.clearSkyFilters=function(scroll){ state.skyReadyBucket=null; clearChartSelects(); if(oldClearSky) oldClearSky(scroll); else { ['skyQueueFilter','skyBrandFilter'].forEach(id=>setSingle(id,'')); ['skyBranchFilter','skyStageFilter','skyJobTypeFilter'].forEach(resetMulti); const s=q('skySearchBox'); if(s) s.value=''; if(window.renderSky) window.renderSky(); } };

  function markActiveCards(){
    document.querySelectorAll('.sky-cards .card').forEach(c=>c.classList.remove('active-card'));
    const queue=q('skyQueueFilter')?.value||''; const brand=q('skyBrandFilter')?.value||'';
    document.querySelectorAll('.sky-cards .card').forEach(c=>{ const label=c.querySelector('.label')?.textContent||''; if((queue==='Open_Cases'&&label.includes('Open Cases'))||(queue==='Ready For Delivery Cases'&&label.includes('Ready For Delivery'))||(queue==='__REMOVED_QUEUE__'&&label.includes('Delivered'))||(brand==='Samsung'&&label==='Samsung')||(brand==='Apple'&&label==='Apple')) c.classList.add('active-card'); });
  }
  function renderSkyTable(rows){
    const cols=[['Queue','Queue'],['Brand','Brand'],['Branch','Branch'],['Open_Date_Display','Open Date'],['Aging_Days','Aging Days'],['Job_Number','Job Number'],['Status','Status'],['Stage','Stage'],['Item English Name','Item English Name'],['Price','Price']];
    if(typeof renderTable==='function') renderTable('skyCasesTable', rows.slice(0,1000), cols, false);
  }
  function updateSkyCards(){
    const rows=allSky(); const total=rows.length; const open=rows.filter(isOpen).length; const ready=rows.filter(isReady).length; const delivered=rows.filter(isDelivered).length; const samsung=rows.filter(r=>clean(r.Brand).toLowerCase()==='samsung').length; const apple=rows.filter(r=>clean(r.Brand).toLowerCase()==='apple').length;
    setText('skyTotalCases',total); setText('skyOpenCases',open); setText('skyReadyCases',ready); setText('skyDeliveredCases',delivered); setText('skySamsungCases',samsung); setText('skyAppleCases',apple);
    setText('skyOpenPercent',`${pct(open,total)}% of Total`); setText('skyReadyPercent',`${pct(ready,total)}% of Total`); setText('skyDeliveredPercent',`${pct(delivered,total)}% of Total`); setText('skySamsungPercent',`${pct(samsung,total)}% of Total`); setText('skyApplePercent',`${pct(apple,total)}% of Total`);
  }
  function setSummary(id, labels, values, total){ const el=q(id); if(el) el.innerHTML=labels.map((l,i)=>`<span class="sky-chart-chip">${l}: ${values[i]} (${pct(values[i],total)}%)</span>`).join('') + (id==='skyReadyAgingSummary' && state.skyReadyBucket ? `<span class="chart-selection-note">Selected: ${state.skyReadyBucket}</span>` : ''); }
  function updateSkyChartsV25(rows){
    rows=Array.isArray(rows)?rows:[];
    const queueRows=chartFilter(rows,'skyQueueChartBrandFilter','Brand');
    const brandRows=chartFilter(rows,'skyBrandChartQueueFilter','Queue');
    const stageRows=chartFilter(rows.filter(validOpenStage),'skyStageChartBranchFilter','Branch');
    const branchRows=chartFilter(rows.filter(isOpen),'skyBranchChartStageFilter','Stage');
    const readyRows=chartFilter(rows.filter(isReady),'skyReadyAgingBrandFilter','Brand');
    const qd=countBy(queueRows,'Queue',QUEUES); const bd=countBy(brandRows,'Brand',['Samsung','Apple']); const sd=countBy(stageRows,'Stage',null,20); const brd=countBy(branchRows,'Branch',null,30); const ag=readyAging(readyRows);
    setSummary('skyQueueSummary',qd.labels,qd.values,queueRows.length); setSummary('skyBrandSummary',bd.labels,bd.values,brandRows.length); setSummary('skyStageSummary',sd.labels,sd.values,stageRows.length); setSummary('skyBranchSummary',brd.labels,brd.values,branchRows.length); setSummary('skyReadyAgingSummary',ag.labels,ag.values,readyRows.length);
    make3D('skyQueueChart', qd.labels, qd.values, 'Cases', label=>window.setSkyQueue(label));
    make3D('skyBrandChart', bd.labels, bd.values, 'Cases', label=>window.setSkyBrand(label));
    make3D('skyStageChart', sd.labels, sd.values, 'Open Cases', label=>{ state.skyReadyBucket=null; setMulti('skyStageFilter',label); window.renderSky(); });
    make3D('skyBranchChart', brd.labels, brd.values, 'Open Cases', label=>{ state.skyReadyBucket=null; setMulti('skyBranchFilter',label); window.renderSky(); });
    make3D('skyReadyAgingChart', ag.labels, ag.values, 'Ready Cases', label=>{ state.skyReadyBucket=label; setSingle('skyQueueFilter','Ready For Delivery Cases'); updateExcelLabel('skyQueueFilter'); window.renderSky(); if(typeof scrollToElement==='function') scrollToElement('skyCasesTable'); });
  }

  const previousRenderSky=window.renderSky;
  window.renderSky=function(){
    if(previousRenderSky) { try{ previousRenderSky.apply(this,arguments); }catch(e){ } }
    setTimeout(()=>{ try{ const base=baseSkyFiltered(); const tableRows=skyRowsForTable(); window.currentSkyRows=tableRows; updateSkyCards(); markActiveCards(); renderSkyTable(tableRows); updateSkyChartsV25(base); }catch(e){} },30);
  };

  function updateGspnV25(rows){
    rows=Array.isArray(rows)?rows:curGspn();
    const failed=rows.filter(r=>clean(r.KPIAlert).includes('Failed')); const fr=countBy(failed,'KPIFailName',['LTP','TAT']);
    const kLabels=['Failed LTP','Failed TAT','Fix Today','Watch 48h','On Track','Review','Done'];
    const kVals=[rows.filter(r=>clean(r.KPIAlert)==='Failed'&&clean(r.KPIFailName)==='LTP').length, rows.filter(r=>clean(r.KPIAlert)==='Failed'&&clean(r.KPIFailName)==='TAT').length, rows.filter(r=>clean(r.KPIAlert)==='Fix Today').length, rows.filter(r=>clean(r.KPIAlert)==='Watch').length, rows.filter(r=>clean(r.KPIAlert)==='On Track').length, rows.filter(r=>clean(r.KPIAlert)==='Review').length, rows.filter(r=>clean(r.KPIAlert)==='Done').length];
    const open=rows.filter(r=>clean(r.StatusFinal)==='Open'); const br=countBy(open,'GSPN_Branch',null,15); const st=countBy(open,'GSPN_Status',null,15); const rep=avgBy(rows,'GSPN_Branch',15); const ag=agingBuckets(rows);
    make3D('failedReasonChart',fr.labels,fr.values,'Failed KPI',label=>{ if(typeof showFailedType==='function') showFailedType(label); });
    make3D('kpiChart',kLabels,kVals,'Cases',label=>{ if(label==='Failed LTP'&&typeof showFailedType==='function') showFailedType('LTP'); else if(label==='Failed TAT'&&typeof showFailedType==='function') showFailedType('TAT'); else if(label==='Fix Today'&&typeof showOnlyAlert==='function') showOnlyAlert('Fix Today'); else if(label==='Watch 48h'&&typeof showOnlyAlert==='function') showOnlyAlert('Watch'); });
    make3D('branchChart',br.labels,br.values,'Open Cases',label=>{ if(typeof filterByBranch==='function') filterByBranch(label); });
    make3D('techChart',st.labels,st.values,'Open Cases',label=>{ if(typeof filterByGspnStatus==='function') filterByGspnStatus(label); });
    make3D('repairDaysChart',rep.labels,rep.values,'Avg Repair Days',label=>{ if(typeof filterByBranch==='function') filterByBranch(label); });
    make3D('agingChart',ag.labels,ag.values,'Open Cases',null);
  }
  window.updateCharts=updateGspnV25;
  const previousRender=window.render;
  window.render=function(){ const res=previousRender?previousRender.apply(this,arguments):undefined; setTimeout(()=>{ try{ updateGspnV25(curGspn()); }catch(e){ } },30); return res; };

  function install(){
    ensureColorSelector();
    const tab=activeTab(); applyColor(localStorage.getItem('serviceEyeColor_'+tab)||'purple', tab);
    const oldSwitch=window.switchTab;
    if(typeof window.render==='function') window.render();
    if(q('skyPage') && q('skyPage').style.display!=='none' && typeof window.renderSky==='function') window.renderSky();
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(install,1500));
  setTimeout(install,2000);
})();


/* ===== sky-v36-requested-script ===== */

(function(){
  const SKY_LOGO_V36 = window._SITE_LOGO;
  const GRAPH_SYNC_KEY = 'serviceEyeGraphSyncConfig_v1';
  const GRAPH_TOKEN_KEY = 'serviceEyeGraphToken_v2';
  const ANALYSIS_ROWS_KEY = 'serviceEyeAnalysisRows_v1';

  function q(sel, root=document){ return root.querySelector(sel); }
  function qa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }
  function esc(v){ return String(v ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s])); }
  function cfg(){ try{ return Object.assign({analysisExcelFileName:'Analyses_Dashboard', analysisTableName:'AnalysisTable'}, JSON.parse(localStorage.getItem(GRAPH_SYNC_KEY)||'{}')); }catch(e){ return {analysisExcelFileName:'Analyses_Dashboard', analysisTableName:'AnalysisTable'}; } }
  function saveCfg(next){ localStorage.setItem(GRAPH_SYNC_KEY, JSON.stringify(Object.assign(cfg(), next||{}))); }

  function setOnlySkyFavicon(){
    qa('link[rel~="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').forEach(x=>x.remove());
    const fav=document.createElement('link'); fav.rel='icon'; fav.type='image/jpeg'; fav.href=SKY_LOGO_V36; document.head.appendChild(fav);
  }

  function fixLogos(){
    setOnlySkyFavicon();
    qa('.logo-box img').forEach(img=>{ img.src=SKY_LOGO_V36; img.alt='SKY Distribution Logo'; });
    const sideLogo=q('.side-logo-mark img'); if(sideLogo) sideLogo.src=SKY_LOGO_V36;
    qa('.side-tab').forEach(tab=>{
      const text=(tab.textContent||'').toLowerCase();
      if(text.includes('sky tracking')){
        tab.classList.add('sky-v36-clean');
        qa('img', tab).forEach(img=>img.remove());
        const img=document.createElement('img'); img.className='side-tab-logo sky-v36-logo'; img.src=SKY_LOGO_V36; img.alt='SKY';
        tab.insertBefore(img, tab.firstChild);
      }
    });
  }

  function setSelectValue(id, value){ const el=document.getElementById(id); if(!el) return; el.value=value||''; }
  window.skyApplyCardFilter = function(queue, brand){
    setSelectValue('skyQueueFilter', queue || '');
    setSelectValue('skyBrandFilter', brand || '');
    if(typeof window.renderSky==='function') window.renderSky();
  };
  window.skyResetAllFiltersV36 = function(){
    if(typeof window.clearSkyFilters==='function') window.clearSkyFilters(true);
    setSelectValue('skyQueueFilter',''); setSelectValue('skyBrandFilter','');
    if(typeof window.renderSky==='function') window.renderSky();
  };

  function addCardMenus(){
    const defs=[
      ['skyTotalCases', [['','All SKY Cases'], ['Open_Cases','Open Cases'], ['Ready For Delivery Cases','Ready For Delivery'], ['Delivered'], ['brand:Samsung','Samsung'], ['brand:Apple','Apple']]],
      ['skyOpenCases', [['Open_Cases','Open All'], ['Open_Cases|Samsung','Open Samsung'], ['Open_Cases|Apple','Open Apple']]],
      ['skyReadyCases', [['Ready For Delivery Cases','Ready All'], ['Ready For Delivery Cases|Samsung','Ready Samsung'], ['Ready For Delivery Cases|Apple','Ready Apple']]],
      ['skyDeliveredCases', [['Delivered All'], ['__REMOVED_QUEUE__|Samsung','Delivered Samsung'], ['__REMOVED_QUEUE__|Apple','Delivered Apple']]],
      ['skySamsungCases', [['brand:Samsung','Samsung All'], ['Open_Cases|Samsung','Samsung Open'], ['Ready For Delivery Cases|Samsung','Samsung Ready'], ['__REMOVED_QUEUE__|Samsung','Samsung Delivered']]],
      ['skyAppleCases', [['brand:Apple','Apple All'], ['Open_Cases|Apple','Apple Open'], ['Ready For Delivery Cases|Apple','Apple Ready'], ['__REMOVED_QUEUE__|Apple','Apple Delivered']]]
    ];
    defs.forEach(([id, opts])=>{
      const valueEl=document.getElementById(id); if(!valueEl) return;
      const card=valueEl.closest('.card'); if(!card || card.querySelector('.sky-card-menu')) return;
      const select=document.createElement('select'); select.className='sky-card-menu';
      select.innerHTML='<option value="">Filter Menu</option>'+opts.map(([v,t])=>`<option value="${esc(v)}">${esc(t)}</option>`).join('');
      select.addEventListener('click', e=>e.stopPropagation());
      select.addEventListener('change', e=>{
        e.stopPropagation();
        const v=select.value; if(v==='') return;
        if(v.startsWith('brand:')) skyApplyCardFilter('', v.split(':')[1]);
        else { const [queue, brand=''] = v.split('|'); skyApplyCardFilter(queue, brand); }
        setTimeout(()=>{ select.value=''; },50);
      });
      card.appendChild(select);
    });
  }

  window.clearSkyChartFilter = function(id){
    const el=document.getElementById(id); if(el){ el.value=''; el.dispatchEvent(new Event('change', {bubbles:true})); }
    if(typeof window.renderSky==='function') window.renderSky();
  };
  function fixChartClearButtons(){
    qa('#skyPage .sky-chart-toolbar button').forEach(btn=>{
      const m=(btn.getAttribute('onclick')||'').match(/clearSkyChartFilter\(['"]([^'"]+)['"]\)/);
      if(!m) return;
      const id=m[1];
      btn.classList.add('sky-v36-chart-clear');
      btn.onclick=function(e){ e.preventDefault(); e.stopPropagation(); window.clearSkyChartFilter(id); return false; };
    });
  }

  function valuesToObjects(values){
    if(!Array.isArray(values) || values.length<2) return [];
    const headers=values[0].map(h=>String(h??'').trim());
    return values.slice(1).filter(r=>r && r.some(v=>String(v??'').trim()!=='')).map(row=>{ const o={}; headers.forEach((h,i)=>{ if(h) o[h]=row[i]??''; }); return o; });
  }
  async function graphFetch(path){
    const token=JSON.parse(localStorage.getItem(GRAPH_TOKEN_KEY)||'null');
    if(!token || !token.access_token) throw new Error('Please sign in to Microsoft 365 first.');
    const res=await fetch('https://graph.microsoft.com/v1.0'+path, {headers:{Authorization:'Bearer '+token.access_token}});
    if(!res.ok) throw new Error('Graph error '+res.status+': '+(await res.text()).slice(0,300));
    return await res.json();
  }
  async function findAnalysisFileId(){
    const c=cfg(); const name=c.analysisExcelFileName || 'Analyses_Dashboard';
    const data=await graphFetch(`/me/drive/root/search(q='${encodeURIComponent(name)}')?$select=id,name,webUrl,file&$top=25`);
    const items=(data.value||[]).filter(x=>x.file && /\.(xlsx|xlsm|xlsb)$/i.test(x.name||''));
    const exact=items.find(x=>(x.name||'').toLowerCase().replace(/\.(xlsx|xlsm|xlsb)$/,'')===name.toLowerCase());
    const item=exact||items[0];
    if(!item) throw new Error('Excel file not found in OneDrive: '+name);
    return item.id;
  }
  async function readAnalysisRows(fileId){
    const c=cfg();
    try{
      const table=await graphFetch(`/me/drive/items/${fileId}/workbook/tables/${encodeURIComponent(c.analysisTableName||'AnalysisTable')}/range`);
      return valuesToObjects(table.values||[]);
    }catch(e){
      const sheets=await graphFetch(`/me/drive/items/${fileId}/workbook/worksheets?$select=id,name`);
      const first=(sheets.value||[])[0]; if(!first) return [];
      const used=await graphFetch(`/me/drive/items/${fileId}/workbook/worksheets/${first.id}/usedRange`);
      return valuesToObjects(used.values||[]);
    }
  }
  window.syncAnalysesDashboardFromOneDrive = async function(){
    try{
      const status=q('#graphSyncStatus'); if(status) status.textContent='Reading Analyses_Dashboard from OneDrive...';
      const fileId=await findAnalysisFileId();
      const rows=await readAnalysisRows(fileId);
      window.analysisRows=rows;
      localStorage.setItem(ANALYSIS_ROWS_KEY, JSON.stringify(rows));
      const set=(id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=v; };
      set('analysisCombinedTotal', (window.allRows?.length||0)+(window.skyRows?.length||0)+rows.length);
      let card=document.getElementById('analysisFileTotalCard');
      if(!card && q('#analysisPage .analysis-grid')){
        q('#analysisPage .analysis-grid').insertAdjacentHTML('beforeend','<div class="analysis-card" id="analysisFileTotalCard"><div>Analyses_Dashboard Rows</div><div class="value" id="analysisFileTotal">0</div></div>');
      }
      set('analysisFileTotal', rows.length);
      if(status) status.textContent=`Analyses_Dashboard sync completed. Rows: ${rows.length}.`;
    }catch(e){ const status=q('#graphSyncStatus'); if(status) status.textContent='Analyses_Dashboard sync failed: '+(e.message||e); ; }
  };

  function addAnalysisFileToGraphPanel(){
    const panel=q('#graphSyncPanel .graph-sync-body'); if(!panel || q('#graphAnalysisExcelName')) return;
    const c=cfg();
    const anchor=q('#graphExcelName')?.closest('label') || panel.firstElementChild;
    anchor.insertAdjacentHTML('afterend', `
      <label>Analyses table name <input id="graphAnalysisTable" value="${esc(c.analysisTableName || 'AnalysisTable')}"></label>
    `);
    const btn=document.createElement('button'); btn.type='button'; btn.textContent='Sync Analyses'; btn.onclick=()=>{
      saveCfg({analysisExcelFileName:q('#graphAnalysisExcelName')?.value.trim()||'Analyses_Dashboard', analysisTableName:q('#graphAnalysisTable')?.value.trim()||'AnalysisTable'});
      window.syncAnalysesDashboardFromOneDrive();
    };
    q('#graphSyncNow')?.insertAdjacentElement('afterend', btn);
    const save=q('#graphSaveConfig'); if(save) save.addEventListener('click',()=>saveCfg({analysisExcelFileName:q('#graphAnalysisExcelName')?.value.trim()||'Analyses_Dashboard', analysisTableName:q('#graphAnalysisTable')?.value.trim()||'AnalysisTable'}));
  }

  function install(){ fixLogos(); addCardMenus(); fixChartClearButtons(); addAnalysisFileToGraphPanel(); }
  document.addEventListener('DOMContentLoaded',()=>{ setTimeout(install,800); });
/* removed duplicate delayed install at 15s */
})();


/* ===== inline-script-20 ===== */

/* =========================================================
   v40 - SKY Tracking Cases: replace JobType filter with
   Aging Days Group for Open_Cases only.
   Groups: 0 to 3 Days / 4 to 10 Days / More than 10 Days
   ========================================================= */
(function(){
  const ALL = (window.ALL_VALUE || '__ALL__');
  function q(id){ return document.getElementById(id); }
  /* [dedup] orphan helper clean removed */
  /* [dedup] orphan helper num removed */
  /* [dedup] orphan helper getSelectedValues removed */
  /* [dedup] orphan helper setMultiAll removed */
  function setSingle(id, value){
    const el = q(id); if (!el) return;
    el.value = value || '';
    if (typeof window.updateExcelLabel === 'function') window.updateExcelLabel(id);
  }
  /* [dedup] orphan helper agingGroupForRow removed */
  /* [dedup] orphan helper isOpenCase removed */

  function ensureAgingFilter(){
    let old = q('skyJobTypeFilter');
    const existing = q('skyAgingDaysGroupFilter');
    if (old && !existing) {
      old.id = 'skyAgingDaysGroupFilter';
      old.removeAttribute('multiple');
      const label = old.parentElement && old.parentElement.querySelector('.filter-label');
      if (label) label.textContent = 'Aging Days Group';
      const wrap = q('skyJobTypeFilter_excel');
      if (wrap) wrap.remove();
    }
    let el = q('skyAgingDaysGroupFilter');
    if (!el) {
      const filters = document.querySelector('.sky-filters');
      const searchBox = q('skySearchBox');
      const host = document.createElement('div');
      host.innerHTML = '<div class="filter-label">Aging Days Group</div><select id="skyAgingDaysGroupFilter"></select>';
      if (filters && searchBox && searchBox.closest('div')) filters.insertBefore(host, searchBox.closest('div'));
      else if (filters) filters.appendChild(host);
      el = q('skyAgingDaysGroupFilter');
    }
    if (el) {
      el.multiple = false;
      el.innerHTML = '<option value="">All Aging Days Groups</option><option value="0 to 3 Days">0 to 3 Days</option><option value="4 to 10 Days">4 to 10 Days</option><option value="More than 10 Days">More than 10 Days</option>';
      el.onchange = function(){ if (typeof window.renderSky === 'function') window.renderSky(); };
    }
    const stale = q('skyJobTypeFilter_excel');
    if (stale) stale.remove();
  }

  /* [dedup] superseded getSkyFilteredRows definition removed (was L3546) */

  const oldClear = window.clearSkyFilters;
  /* [dedup] superseded clearSkyFilters definition removed (was L3579) */

  const oldReset = window.resetSkyFiltersToAll;
  window.resetSkyFiltersToAll = function(){
    ensureAgingFilter();
    if (typeof oldReset === 'function') { try { oldReset.apply(this, arguments); } catch(e) {} }
    setSingle('skyAgingDaysGroupFilter','');
  };

  const oldRefreshExcel = window.refreshSkyExcelFilterWidgets;
  /* [dedup] superseded refreshSkyExcelFilterWidgets definition removed (was L3603) */

  const oldRender = window.renderSky;
  window.renderSky = function(){
    ensureAgingFilter();
    return oldRender ? oldRender.apply(this, arguments) : undefined;
  };

  document.addEventListener('DOMContentLoaded', () => setTimeout(() => { ensureAgingFilter(); if (typeof window.renderSky === 'function') window.renderSky(); }, 800));
  window.addEventListener('load', () => setTimeout(() => { ensureAgingFilter(); if (typeof window.renderSky === 'function') window.renderSky(); }, 1200));
})();


/* ===== inline-script-21 ===== */

/* =========================================================
   v41 - SKY Tracking Cases filter repair
   Fixes: native working dropdowns, SKY Filtered Cases data,
   Aging Days Group applied to Open_Cases only.
   ========================================================= */
(function(){
  const ALL = (typeof window.ALL_VALUE !== 'undefined' ? window.ALL_VALUE : '__ALL__');
  const SKY_QUEUES = ["Open_Cases", "Ready For Delivery Cases"];
  const SKY_BRANDS = ["Samsung", "Apple"];
  const SKY_FILTER_IDS = ["skyBranchFilter", "skyQueueFilter", "skyBrandFilter", "skyStageFilter", "skyAgingDaysGroupFilter"];
  const AGING_GROUPS = ["from 0 to 3 Days", "From 4 to 10 Days", "More than 10 Days"];

  function el(id){ return document.getElementById(id); }
  function clean(v){ return String(v ?? "").trim(); }
  function esc(v){
    return clean(v).replace(/[&<>"']/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[s]));
  }
  function sourceRows(){
    try { if (typeof skyRows !== "undefined" && Array.isArray(skyRows)) return skyRows; } catch(e) {}
    return Array.isArray(window.skyRows) ? window.skyRows : [];
  }
  function selected(id){
    const x = el(id); if (!x) return [];
    if (x.multiple) return [...x.selectedOptions].map(o => o.value).filter(v => v && v !== ALL);
    return x.value ? [x.value] : [];
  }
  /* [dedup] orphan helper numberValue removed */
  /* [dedup] orphan helper agingGroup removed */
  /* [dedup] orphan helper isOpen removed */
  function removeExcelWrappers(){
    ["skyBranchFilter_excel", "skyQueueFilter_excel", "skyBrandFilter_excel", "skyStageFilter_excel", "skyJobTypeFilter_excel", "skyAgingDaysGroupFilter_excel"].forEach(id => {
      const w = el(id); if (w) w.remove();
    });
    SKY_FILTER_IDS.forEach(id => { const x = el(id); if (x) x.style.display = ""; });
  }
  function ensureAgingFilter(){
    const oldJob = el("skyJobTypeFilter");
    if (oldJob) {
      const box = oldJob.closest("div");
      if (box && !el("skyAgingDaysGroupFilter")) {
        const lbl = box.querySelector(".filter-label");
        if (lbl) lbl.textContent = "Aging Days Group";
        oldJob.id = "skyAgingDaysGroupFilter";
        oldJob.removeAttribute("multiple");
      } else if (box) {
        box.remove();
      } else {
        oldJob.remove();
      }
    }
    if (!el("skyAgingDaysGroupFilter")) {
      const filters = document.querySelector("#skyPage .filters") || document.querySelector(".sky-filters");
      const searchBox = el("skySearchBox");
      const host = document.createElement("div");
      host.innerHTML = '<div class="filter-label">Aging Days Group</div><select id="skyAgingDaysGroupFilter"></select>';
      if (filters && searchBox && searchBox.closest("div")) filters.insertBefore(host, searchBox.closest("div"));
      else if (filters) filters.appendChild(host);
    }
    const ag = el("skyAgingDaysGroupFilter");
    if (ag) {
      ag.multiple = false;
      const cur = ag.value;
      ag.innerHTML = '<option value="">All Aging Days Groups</option>' + AGING_GROUPS.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
      if (AGING_GROUPS.includes(cur)) ag.value = cur;
    }
  }
  function fillSelect(id, values, multi, allText){
    const x = el(id); if (!x) return;
    const old = selected(id);
    const opts = (multi ? `<option value="${ALL}">(Select All)</option>` : `<option value="">${esc(allText || "(Select All)")}</option>`) +
      values.filter(v => clean(v)).map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
    x.innerHTML = opts;
    if (multi) {
      let any = false;
      [...x.options].forEach(o => { if (old.includes(o.value)) { o.selected = true; any = true; } });
      if (!any && x.options[0]) x.options[0].selected = true;
    } else {
      if (old[0] && [...x.options].some(o => o.value === old[0])) x.value = old[0];
      else x.value = "";
    }
  }
  function refreshSkyNativeFilters(){
    ensureAgingFilter();
    const rows = sourceRows();
    fillSelect("skyBranchFilter", [...new Set(rows.map(r => clean(r.Branch)).filter(Boolean))].sort(), true);
    fillSelect("skyQueueFilter", SKY_QUEUES, false, "All Queue");
    fillSelect("skyBrandFilter", SKY_BRANDS, false, "All Brands");
    fillSelect("skyStageFilter", [...new Set(rows.map(r => clean(r.Stage)).filter(Boolean))].sort(), true);
    const ag = el("skyAgingDaysGroupFilter");
    if (ag) { const cur = ag.value; ag.innerHTML = '<option value="">All Aging Days Groups</option>' + AGING_GROUPS.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join(""); if (AGING_GROUPS.includes(cur)) ag.value = cur; }
    removeExcelWrappers();
    SKY_FILTER_IDS.forEach(id => { const x = el(id); if (x) x.onchange = () => window.renderSky && window.renderSky(); });
    const search = el("skySearchBox"); if (search) search.oninput = () => window.renderSky && window.renderSky();
  }

  /* [dedup] superseded getSkyFilteredRows definition removed (was L3727) */

  const previousRenderSky = window.renderSky;
  /* [dedup] superseded renderSky definition removed (was L3754) */

  window.refreshSkyFilterOptionsV19 = refreshSkyNativeFilters;
  window.buildExcelFiltersV19 = removeExcelWrappers;
  /* [dedup] superseded refreshSkyExcelFilterWidgets definition removed (was L3764) */

  /* [dedup] superseded clearSkyFilters definition removed (was L3766) */
  /* [dedup] superseded setSkyQueue definition removed (was L3774) */
  /* [dedup] superseded setSkyBrand definition removed (was L3775) */

  function install(){ refreshSkyNativeFilters(); if (typeof window.renderSky === "function") window.renderSky(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(install, 300));
  else setTimeout(install, 300);
})();


/* ===== inline-script-22 ===== */

/* =========================================================
   v42 - SKY Tracking Cases final filter panel + aging group
   - Filter Section design aligned with attached screenshot
   - Replaces JobType with Aging Days Group
   - Aging Days Group works for Open_Cases only
   - Summary Cards always update after any filter change
   - Animated browser tab title
   ========================================================= */
(function(){
  const ALL = (typeof ALL_VALUE !== 'undefined') ? ALL_VALUE : '__ALL__';
  const AGING_GROUPS = ['from 0 to 3 Days','From 4 to 10 Days','More than 10 Days'];
  const QUEUES = ['Open_Cases','Ready For Delivery Cases'];
  const BRANDS = ['Samsung','Apple'];

  function q(id){ return document.getElementById(id); }
  function clean(v){ return String(v ?? '').trim(); }
  function esc(v){ return clean(v).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s])); }
  function num(v){
    if (typeof v === 'number') return Number.isFinite(v) ? v : null;
    const n = Number(clean(v).replace(/,/g,'').replace(/[^0-9.-]/g,''));
    return Number.isFinite(n) ? n : null;
  }
  function rows(){
    try { if (Array.isArray(skyRows)) return skyRows; } catch(e) {}
    return Array.isArray(window.skyRows) ? window.skyRows : [];
  }
  function isOpenCase(r){ return clean(r.Queue) === 'Open_Cases'; }
  function agingGroup(r){
    const n = num(r.Aging_Days ?? r.AgingDays ?? r['Aging Days'] ?? r.Aging ?? r.aging_days);
    if (n === null) return '';
    if (n <= 3) return 'from 0 to 3 Days';
    if (n <= 10) return 'From 4 to 10 Days';
    return 'More than 10 Days';
  }
  function selected(id){
    const el = q(id); if (!el) return [];
    if (el.multiple) return [...el.selectedOptions].map(o=>o.value).filter(v => v && v !== ALL);
    return el.value ? [el.value] : [];
  }
  function uniqueValues(list){ return [...new Set(list.map(clean).filter(Boolean))].sort((a,b)=>a.localeCompare(b)); }

  function removeExcelShell(id){ const w = q(id + '_excel'); if (w) w.remove(); const el = q(id); if (el) el.style.display = ''; }
  function removeOldExcelFilters(){ ['skyBranchFilter','skyQueueFilter','skyBrandFilter','skyStageFilter','skyJobTypeFilter','skyAgingDaysGroupFilter'].forEach(removeExcelShell); }

  function ensureFilterPanel(){
    const panel = document.querySelector('#skyPage .filters');
    if (!panel) return;
    panel.classList.add('sky-v42-filter-panel');

    // Convert/remove JobType and create Aging Days Group in the same place.
    const job = q('skyJobTypeFilter');
    if (job) {
      const box = job.closest('div');
      if (!q('skyAgingDaysGroupFilter')) {
        job.id = 'skyAgingDaysGroupFilter';
        job.name = 'skyAgingDaysGroupFilter';
        job.multiple = false;
        job.removeAttribute('multiple');
        const label = box && box.querySelector('.filter-label');
        if (label) label.textContent = 'Aging Days Group';
      } else if (box) {
        box.remove();
      } else job.remove();
    }
    if (!q('skyAgingDaysGroupFilter')) {
      const host = document.createElement('div');
      host.className = 'sky-v42-filter-item';
      host.innerHTML = '<div class="filter-label">Aging Days Group</div><select id="skyAgingDaysGroupFilter"></select>';
      const searchHost = q('skySearchBox')?.closest('div');
      panel.insertBefore(host, searchHost || null);
    }
    [...panel.children].forEach(ch => ch.classList.add('sky-v42-filter-item'));

    const ag = q('skyAgingDaysGroupFilter');
    if (ag) {
      ag.multiple = false;
      ag.removeAttribute('multiple');
      const cur = ag.value;
      ag.innerHTML = '<option value="">(Select All)</option>' + AGING_GROUPS.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
      if (AGING_GROUPS.includes(cur)) ag.value = cur;
    }
    const search = q('skySearchBox');
    if (search) search.placeholder = 'Job_Number / IMEI / SerialNumber';
  }

  function fillSelect(id, values, multiple){
    const el = q(id); if (!el) return;
    const old = selected(id);
    el.multiple = !!multiple;
    if (!multiple) el.removeAttribute('multiple');
    const first = multiple ? `<option value="${ALL}">(Select All)</option>` : '<option value="">(Select All)</option>';
    el.innerHTML = first + values.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
    if (multiple) {
      let kept = false;
      [...el.options].forEach(o => { if (old.includes(o.value)) { o.selected = true; kept = true; } });
      if (!kept && el.options[0]) el.options[0].selected = true;
    } else {
      el.value = old.find(v => [...el.options].some(o => o.value === v)) || '';
    }
  }

  function refreshFilterLists(){
    ensureFilterPanel();
    const data = rows();
    fillSelect('skyBranchFilter', uniqueValues(data.map(r=>r.Branch)), true);
    fillSelect('skyQueueFilter', QUEUES, false);
    fillSelect('skyBrandFilter', BRANDS, false);
    fillSelect('skyStageFilter', uniqueValues(data.map(r=>r.Stage)), true);
    const ag = q('skyAgingDaysGroupFilter');
    if (ag) {
      const cur = ag.value;
      ag.innerHTML = '<option value="">(Select All)</option>' + AGING_GROUPS.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
      if (AGING_GROUPS.includes(cur)) ag.value = cur;
    }
    removeOldExcelFilters();
  }

  function filteredRows(){
    const branches = selected('skyBranchFilter');
    const queues = selected('skyQueueFilter');
    const brands = selected('skyBrandFilter');
    const stages = selected('skyStageFilter');
    const ag = clean(q('skyAgingDaysGroupFilter')?.value || '');
    const search = clean(q('skySearchBox')?.value || '').toLowerCase();
    return rows().filter(r => {
      if (branches.length && !branches.includes(clean(r.Branch))) return false;
      if (queues.length && !queues.includes(clean(r.Queue))) return false;
      if (brands.length && !brands.includes(clean(r.Brand))) return false;
      if (stages.length && !stages.includes(clean(r.Stage))) return false;
      if (ag) {
        if (!isOpenCase(r)) return false;
        if (agingGroup(r) !== ag) return false;
      }
      if (search) {
        const hay = [r.Job_Number, r.IMEI, r.SerialNumber, r.Customer_Mobile, r.Customer_phone, r['Customer Mobile'], r['Customer Phone'], r.Status, r.Stage, r.Branch, r.Model]
          .map(v=>clean(v).toLowerCase()).join(' ');
        if (!hay.includes(search)) return false;
      }
      return true;
    });
  }

  function setTxt(id, value){ const x = q(id); if (x) x.textContent = value; }
  function percent(part,total){ return total ? ((part/total)*100).toFixed(1) : '0.0'; }
  function renderTableSafe(data){
    if (typeof renderTable !== 'function') return;
    const cols = [
      ['Queue','Queue'], ['Brand','Brand'], ['Branch','Branch'], ['Open_Date_Display','Open Date'],
      ['Aging_Days','Aging Days'], ['Job_Number','Job Number'], ['Status','Status'], ['Stage','Stage'],
      ['Item English Name','Item English Name'], ['IMEI','IMEI'], ['SerialNumber','Serial Number'], ['Model','Model'],
      ['Customer_Mobile','Customer Mobile'], ['Customer_phone','Customer Phone']
    ];
    renderTable('skyCasesTable', data.slice(0,1000), cols, false);
  }
  function renderCards(data){
    const total = data.length;
    const open = data.filter(r=>clean(r.Queue)==='Open_Cases').length;
    const ready = data.filter(r=>clean(r.Queue)==='Ready For Delivery Cases').length;
    const delivered = data.filter(r=>clean(r.Queue)==='__REMOVED_QUEUE__').length;
    const closed = ready + delivered;
    const samsung = data.filter(r=>clean(r.Brand).toLowerCase()==='samsung').length;
    const apple = data.filter(r=>clean(r.Brand).toLowerCase()==='apple').length;
    setTxt('skyTotalCases', total);
    setTxt('skyOpenCases', open); setTxt('skyOpenPercent', `${percent(open,total)}% of Total`);
    setTxt('skyReadyCases', ready); setTxt('skyReadyPercent', `${percent(ready,total)}% of Total`);
    setTxt('skyDeliveredCases', delivered); setTxt('skyDeliveredPercent', `${percent(delivered,total)}% of Total`);
    setTxt('skyClosedCases', closed); setTxt('skyClosedPercent', `${percent(closed,total)}% Ready/Delivered`);
    setTxt('skySamsungCases', samsung); setTxt('skySamsungPercent', `${percent(samsung,total)}% of Total`);
    setTxt('skyAppleCases', apple); setTxt('skyApplePercent', `${percent(apple,total)}% of Total`);
  }
  function renderSkyV42(){
    if (!q('skyPage')) return;
    removeOldExcelFilters();
    const data = filteredRows();
    try { currentSkyRows = data; } catch(e) { window.currentSkyRows = data; }
    renderCards(data);
    renderTableSafe(data);
    if (typeof updateSkyCharts === 'function') updateSkyCharts(data);
  }

  function wire(){
    refreshFilterLists();
    ['skyBranchFilter','skyQueueFilter','skyBrandFilter','skyStageFilter','skyAgingDaysGroupFilter'].forEach(id => {
      const el = q(id); if (!el) return;
      el.onchange = renderSkyV42;
      el.oninput = renderSkyV42;
    });
    const search = q('skySearchBox');
    if (search) search.oninput = renderSkyV42;
    const clearBtn = [...document.querySelectorAll('#skyPage button,.sky-v42-filter-panel button')].find(b => /clear filters/i.test(b.textContent||''));
    if (clearBtn) clearBtn.onclick = function(){ window.clearSkyFilters && window.clearSkyFilters(false); };
  }

  // Replace old global functions and lexical function declarations where possible.
  try { getSkyFilteredRows = filteredRows; } catch(e) { /* [dedup] superseded getSkyFilteredRows definition removed (was L3979) */ }
  try { refreshSkyFilters = refreshFilterLists; } catch(e) { /* [dedup] superseded refreshSkyFilters definition removed (was L3980) */ }
  try { refreshSkyExcelFilterWidgets = removeOldExcelFilters; } catch(e) { /* [dedup] superseded refreshSkyExcelFilterWidgets definition removed (was L3981) */ }
  try { renderSky = renderSkyV42; } catch(e) { /* [dedup] superseded renderSky definition removed (was L3982) */ }
  /* [dedup] superseded getSkyFilteredRows definition removed (was L3983) */
  window.refreshSkyFilters = refreshFilterLists;
  /* [dedup] superseded refreshSkyExcelFilterWidgets definition removed (was L3985) */
  window.renderSky = renderSkyV42;
  /* [dedup] superseded clearSkyFilters definition removed (was L3987) */
  /* [dedup] superseded setSkyQueue definition removed (was L3995) */
  /* [dedup] superseded setSkyBrand definition removed (was L3996) */

  function animateTitle(){
    const base = 'SKY Tracking Cases';
    let i = 0;
    clearInterval(window.skyV42TitleTimer);
    window.skyV42TitleTimer =void(() => {
      const activeSky = q('skyPage') && q('skyPage').style.display !== 'none';
      const text = activeSky ? `✦ ${base} ✦` : 'Service Support Center';
      document.title = text.slice(i % text.length) + '   ' + text.slice(0, i % text.length);
      i++;
    }, 450);
  }

  function install(){ wire(); renderSkyV42(); animateTitle(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(install, 250));
  else setTimeout(install, 250);
  window.addEventListener('load', () => setTimeout(install, 900));
})();


/* ===== inline-script-23 ===== */

/* =========================================================
   v43 - SKY Tracking Cases fixes
   - Branches/Stage multi filters redesigned as dropdown buttons like Queue/Brand
   - SKY Filtered Cases visible columns only + derived Aging Days Group
   - Summary cards use Filter Section filtered data
   - Chart value labels de-duplicated
   - Browser tab title animated as comma-separated "Service Support Center"
   ========================================================= */
(function(){
  const ALL = (typeof ALL_VALUE !== 'undefined') ? ALL_VALUE : '__ALL__';
  const AGING_GROUPS = ['from 0 to 3 Days','From 4 to 10 Days','More than 10 Days'];
  const QUEUES = ['Open_Cases','Ready For Delivery Cases'];
  const BRANDS = ['Samsung','Apple'];
  const MULTI_IDS = ['skyBranchFilter','skyStageFilter'];
  const CHART_IDS = ['skyQueueChart','skyBrandChart','skyStageChart','skyBranchChart','skyReadyAgingChart','skyStageAllChart'];

  function q(id){ return document.getElementById(id); }
  function txt(v){ return String(v ?? '').trim(); }
  function esc(v){ return txt(v).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s])); }
  function num(v){ if(typeof v==='number') return Number.isFinite(v)?v:null; const n=Number(txt(v).replace(/,/g,'').replace(/[^0-9.-]/g,'')); return Number.isFinite(n)?n:null; }
  function pct(a,b){ return b ? ((Number(a||0)/Number(b||0))*100).toFixed(1) : '0.0'; }
  function setText(id,val){ const el=q(id); if(el) el.textContent=val; }
  function allRows(){ try{ if(Array.isArray(skyRows)) return skyRows; }catch(e){} return Array.isArray(window.skyRows)?window.skyRows:[]; }
  function unique(arr){ return [...new Set((arr||[]).map(txt).filter(Boolean))].sort((a,b)=>a.localeCompare(b)); }
  function isOpen(r){ return txt(r.Queue)==='Open_Cases'; }
  function isReady(r){ return txt(r.Queue)==='Ready For Delivery Cases'; }
  function isDelivered(r){ return txt(r.Queue)==='__REMOVED_QUEUE__'; }
  function agingGroup(r){ const n=num(r.Aging_Days ?? r.AgingDays ?? r['Aging Days'] ?? r.Aging ?? r.aging_days); if(n===null) return ''; if(n<=3) return 'from 0 to 3 Days'; if(n<=10) return 'From 4 to 10 Days'; return 'More than 10 Days'; }
  function enriched(r){ return Object.assign({}, r, { Aging_Days_Group: isOpen(r) ? agingGroup(r) : '' }); }

  function selected(id){
    const el=q(id); if(!el) return [];
    if(el.multiple) return [...el.selectedOptions].map(o=>o.value).filter(v=>v && v!==ALL);
    return el.value ? [el.value] : [];
  }
  function setMulti(id, values){
    const el=q(id); if(!el) return;
    const vals = new Set(Array.isArray(values)?values:[values]);
    let any=false;
    [...el.options].forEach((o,i)=>{ o.selected = (o.value!==ALL && vals.has(o.value)); if(o.selected) any=true; });
    if(!any && el.options[0]) el.options[0].selected=true;
    updateMultiButton(id);
  }
  function ensureSingleSelect(id, values){
    const el=q(id); if(!el) return;
    const cur=el.value||'';
    el.multiple=false; el.removeAttribute('multiple');
    el.innerHTML='<option value="">(Select All)</option>'+values.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
    if(values.includes(cur)) el.value=cur;
  }
  function ensureMultiSelect(id, values){
    const el=q(id); if(!el) return;
    const old=selected(id);
    el.multiple=true;
    el.innerHTML=`<option value="${ALL}">(Select All)</option>`+values.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
    let kept=false;
    [...el.options].forEach(o=>{ if(old.includes(o.value)){ o.selected=true; kept=true; } });
    if(!kept && el.options[0]) el.options[0].selected=true;
  }
  function ensureAgingFilter(){
    const panel=document.querySelector('#skyPage .filters'); if(!panel) return;
    let job=q('skyJobTypeFilter');
    if(job){
      const box=job.closest('div');
      if(!q('skyAgingDaysGroupFilter')){
        job.id='skyAgingDaysGroupFilter'; job.name='skyAgingDaysGroupFilter'; job.multiple=false; job.removeAttribute('multiple');
        const label=box?.querySelector('.filter-label'); if(label) label.textContent='Aging Days Group';
      } else if(box) box.remove(); else job.remove();
    }
    if(!q('skyAgingDaysGroupFilter')){
      const host=document.createElement('div'); host.className='sky-v43-filter-item';
      host.innerHTML='<div class="filter-label">Aging Days Group</div><select id="skyAgingDaysGroupFilter"></select>';
      const searchHost=q('skySearchBox')?.closest('div'); panel.insertBefore(host, searchHost || null);
    }
    const ag=q('skyAgingDaysGroupFilter'); if(ag){ const cur=ag.value||''; ag.innerHTML='<option value="">(Select All)</option>'+AGING_GROUPS.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join(''); if(AGING_GROUPS.includes(cur)) ag.value=cur; }
    const search=q('skySearchBox'); if(search) search.placeholder='Job_Number / IMEI / SerialNumber';
  }
  function refreshFilters(){
    ensureAgingFilter();
    const data=allRows();
    ensureMultiSelect('skyBranchFilter', unique(data.map(r=>r.Branch)));
    ensureSingleSelect('skyQueueFilter', QUEUES);
    ensureSingleSelect('skyBrandFilter', BRANDS);
    ensureMultiSelect('skyStageFilter', unique(data.map(r=>r.Stage)));
    buildMultiDropdowns();
  }
  function filteredRows(){
    const branches=selected('skyBranchFilter');
    const queues=selected('skyQueueFilter');
    const brands=selected('skyBrandFilter');
    const stages=selected('skyStageFilter');
    const ag=txt(q('skyAgingDaysGroupFilter')?.value||'');
    const search=txt(q('skySearchBox')?.value||'').toLowerCase();
    return allRows().filter(r=>{
      if(branches.length && !branches.includes(txt(r.Branch))) return false;
      if(queues.length && !queues.includes(txt(r.Queue))) return false;
      if(brands.length && !brands.includes(txt(r.Brand))) return false;
      if(stages.length && !stages.includes(txt(r.Stage))) return false;
      if(ag){ if(!isOpen(r)) return false; if(agingGroup(r)!==ag) return false; }
      if(search){
        const hay=[r.Job_Number,r.IMEI,r.SerialNumber,r['Serial Number'],r.Customer_Mobile,r.Customer_phone,r['Customer Mobile'],r['Customer Phone'],r.Status,r.Stage,r.Branch,r.Model,r['Item English Name']].map(v=>txt(v).toLowerCase()).join(' ');
        if(!hay.includes(search)) return false;
      }
      return true;
    }).map(enriched);
  }

  function updateMultiButton(id){
    const wrap=q(id+'_v43'); if(!wrap) return;
    const btn=wrap.querySelector('.sky-v43-multi-btn');
    const vals=selected(id);
    btn.textContent = vals.length ? (vals.length>2 ? `${vals.length} selected` : vals.join(', ')) : '(Select All)';
    btn.title=btn.textContent;
  }
  function buildMultiDropdowns(){
    MULTI_IDS.forEach(id=>{
      const el=q(id); if(!el) return;
      el.classList.add('sky-v43-native-hidden');
      let wrap=q(id+'_v43');
      if(!wrap){
        wrap=document.createElement('div'); wrap.className='sky-v43-multi'; wrap.id=id+'_v43';
        wrap.innerHTML='<button type="button" class="sky-v43-multi-btn">(Select All)</button><div class="sky-v43-multi-panel"><div class="sky-v43-multi-list"></div></div>';
        el.insertAdjacentElement('afterend', wrap);
      }
      const list=wrap.querySelector('.sky-v43-multi-list');
      list.innerHTML=[...el.options].map(o=>`<label class="sky-v43-check"><input type="checkbox" value="${esc(o.value)}" ${o.selected?'checked':''}> <span>${esc(o.textContent)}</span></label>`).join('');
      wrap.querySelector('.sky-v43-multi-btn').onclick=function(ev){ ev.stopPropagation(); document.querySelectorAll('.sky-v43-multi.open').forEach(x=>{ if(x!==wrap) x.classList.remove('open'); }); wrap.classList.toggle('open'); };
      wrap.onclick=ev=>ev.stopPropagation();
      list.querySelectorAll('input').forEach(cb=>{
        cb.onchange=function(){
          const val=this.value;
          if(val===ALL){
            [...el.options].forEach((o,i)=>o.selected=(i===0));
          }else{
            const allOpt=[...el.options].find(o=>o.value===ALL); if(allOpt) allOpt.selected=false;
            const opt=[...el.options].find(o=>o.value===val); if(opt) opt.selected=this.checked;
            const real=[...el.options].filter(o=>o.value!==ALL && o.selected);
            if(!real.length && allOpt) allOpt.selected=true;
          }
          updateMultiButton(id);
          buildMultiDropdowns();
          finalRender();
        };
      });
      updateMultiButton(id);
    });
  }
  document.addEventListener('click',()=>document.querySelectorAll('.sky-v43-multi.open').forEach(x=>x.classList.remove('open')));

  function renderCards(data){
    const total=data.length, open=data.filter(isOpen).length, ready=data.filter(isReady).length, delivered=data.filter(isDelivered).length, closed=ready+delivered;
    const samsung=data.filter(r=>txt(r.Brand).toLowerCase()==='samsung').length, apple=data.filter(r=>txt(r.Brand).toLowerCase()==='apple').length;
    setText('skyTotalCases', total);
    setText('skyOpenCases', open); setText('skyOpenPercent', `${pct(open,total)}% of Total`);
    setText('skyReadyCases', ready); setText('skyReadyPercent', `${pct(ready,total)}% of Total`);
    setText('skyDeliveredCases', delivered); setText('skyDeliveredPercent', `${pct(delivered,total)}% of Total`);
    setText('skyClosedCases', closed); setText('skyClosedPercent', `${pct(closed,total)}% Ready/Delivered`);
    setText('skySamsungCases', samsung); setText('skySamsungPercent', `${pct(samsung,total)}% of Total`);
    setText('skyAppleCases', apple); setText('skyApplePercent', `${pct(apple,total)}% of Total`);
  }
  function renderTableV43(data){
    if(typeof renderTable!=='function') return;
    const cols=[
      ['Queue','Queue'], ['Brand','Brand'], ['Branch','Branch'], ['Open_Date_Display','Open Date'],
      ['Aging_Days','Aging Days'], ['Aging_Days_Group','aging Days Group'], ['Job_Number','Job Number'],
      ['Status','Status'], ['Stage','Stage'], ['Item English Name','Item English Name'], ['Price','Price']
    ];
    renderTable('skyCasesTable', data.slice(0,1000), cols, false);
  }
  function countBy(data, field, ordered, limit){
    const c={}; (data||[]).forEach(r=>{ const k=txt(r[field])||'Blank'; c[k]=(c[k]||0)+1; });
    let arr=ordered ? ordered.map(k=>[k,c[k]||0]) : Object.entries(c).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
    if(limit) arr=arr.slice(0,limit);
    return {labels:arr.map(x=>x[0]), values:arr.map(x=>x[1])};
  }
  function readyAging(data){
    const labels=['0-3','4-7','more than 7'], values=[0,0,0];
    (data||[]).forEach(r=>{ const months=Number(r.Aging_Days ?? r.AgingDays ?? 0)/30.4375; if(months<=3) values[0]++; else if(months<=7) values[1]++; else values[2]++; });
    return {labels,values};
  }
  function setSummary(id, labels, values, total){ const el=q(id); if(el) el.innerHTML=labels.map((l,i)=>`<span class="sky-chart-chip">${esc(l)}: ${values[i]} (${pct(values[i],total)}%)</span>`).join(''); }
  function unregisterChartLabelPlugins(){
    if(!window.Chart || !Chart.registry || !Chart.registry.plugins) return;
    ['serviceEyeV24SingleLabels','serviceEyeV25Labels3D','serviceEyeV25Bar3D','v19Labels','v20SkyLabels','v21SingleChartValueLabels','serviceEyeV22LabelsOnly','skyBarLabelErrorPlugin','skyV43SingleLabels'].forEach(id=>{ try{ const p=Chart.registry.plugins.get(id); if(p) Chart.unregister(p); }catch(e){} });
  }
  const singleLabelPlugin={ id:'skyV43SingleLabels', afterDatasetsDraw(chart){ const {ctx}=chart; ctx.save(); ctx.font='bold 12px Calibri, Arial, sans-serif'; ctx.fillStyle='#ffffff'; ctx.textAlign='center'; ctx.textBaseline='bottom'; chart.data.datasets.forEach((ds,di)=>{ const meta=chart.getDatasetMeta(di); meta.data.forEach((bar,i)=>{ const val=Number(ds.data[i]||0); if(!val) return; const p=bar.tooltipPosition?bar.tooltipPosition():{x:bar.x,y:bar.y}; ctx.fillText(String(val), p.x, Math.max(14,p.y-8)); }); }); ctx.restore(); } };
  function destroyChart(id){ if(window.dashboardCharts && dashboardCharts[id]){ try{ dashboardCharts[id].destroy(); }catch(e){} } if(!window.dashboardCharts) window.dashboardCharts={}; }
  function chart(id, labels, values, title, clickFn){
    if(!window.Chart) return; const canvas=q(id); if(!canvas) return;
    destroyChart(id);
    const total=values.reduce((a,b)=>a+Number(b||0),0), max=Math.max(...values.map(v=>Number(v||0)),0);
    dashboardCharts[id]=__safeNewChart(canvas,{ type:'bar', data:{ labels, datasets:[{ label:title||'Cases', data:values, borderWidth:1, borderRadius:4 }] }, options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{padding:{top:30,right:14}}, plugins:{ legend:{display:false}, tooltip:{callbacks:{label:ctx=>`${title||'Cases'}: ${ctx.raw} (${pct(ctx.raw,total)}%)`}} }, scales:{ x:{ticks:{autoSkip:false,maxRotation:45,minRotation:0,color:'#ffffff'},grid:{color:'rgba(255,255,255,.10)'}}, y:{beginAtZero:true,suggestedMax:max*1.25+1,ticks:{color:'#ffffff'},grid:{color:'rgba(255,255,255,.10)'}} }, onClick:(evt,elements)=>{ if(elements.length && clickFn) clickFn(labels[elements[0].index]); } }, plugins:[singleLabelPlugin] });
  }
  function updateCharts(data){
    unregisterChartLabelPlugins();
    const queueRows=data.filter(r=>{ const v=q('skyQueueChartBrandFilter')?.value||''; return !v || txt(r.Brand)===v; });
    const brandRows=data.filter(r=>{ const v=q('skyBrandChartQueueFilter')?.value||''; return !v || txt(r.Queue)===v; });
    const stageRows=data.filter(r=>isOpen(r)).filter(r=>{ const v=q('skyStageChartBranchFilter')?.value||''; return !v || txt(r.Branch)===v; });
    const branchRows=data.filter(r=>isOpen(r)).filter(r=>{ const v=q('skyBranchChartStageFilter')?.value||''; return !v || txt(r.Stage)===v; });
    const readyRows=data.filter(r=>isReady(r)).filter(r=>{ const v=q('skyReadyAgingBrandFilter')?.value||''; return !v || txt(r.Brand)===v; });
    const stageAllRows=data.filter(r=>{ const v=q('skyStageAllQueueFilter')?.value||''; return !v || txt(r.Queue)===v; });
    const qd=countBy(queueRows,'Queue',QUEUES), bd=countBy(brandRows,'Brand',BRANDS), sd=countBy(stageRows,'Stage',null,20), brd=countBy(branchRows,'Branch',null,30), ag=readyAging(readyRows), sa=countBy(stageAllRows,'Stage',null,20);
    setSummary('skyQueueSummary',qd.labels,qd.values,queueRows.length); setSummary('skyBrandSummary',bd.labels,bd.values,brandRows.length); setSummary('skyStageSummary',sd.labels,sd.values,stageRows.length); setSummary('skyBranchSummary',brd.labels,brd.values,branchRows.length); setSummary('skyReadyAgingSummary',ag.labels,ag.values,readyRows.length); setSummary('skyStageAllSummary',sa.labels,sa.values,stageAllRows.length);
    chart('skyQueueChart',qd.labels,qd.values,'Cases',label=>{ const e=q('skyQueueFilter'); if(e) e.value=label; finalRender(); });
    chart('skyBrandChart',bd.labels,bd.values,'Cases',label=>{ const e=q('skyBrandFilter'); if(e) e.value=label; finalRender(); });
    chart('skyStageChart',sd.labels,sd.values,'Open Cases',label=>{ setMulti('skyStageFilter',[label]); finalRender(); });
    chart('skyBranchChart',brd.labels,brd.values,'Open Cases',label=>{ setMulti('skyBranchFilter',[label]); finalRender(); });
    chart('skyReadyAgingChart',ag.labels,ag.values,'Ready Cases',null);
    chart('skyStageAllChart',sa.labels,sa.values,'Cases',label=>{ setMulti('skyStageFilter',[label]); finalRender(); });
  }

  function finalRender(){
    ensureAgingFilter(); buildMultiDropdowns();
    const data=filteredRows(); window.currentSkyRows=data;
    renderCards(data); renderTableV43(data); updateCharts(data); buildMultiDropdowns();
  }
  function wire(){
    refreshFilters();
    ['skyQueueFilter','skyBrandFilter','skyAgingDaysGroupFilter'].forEach(id=>{ const el=q(id); if(el){ el.onchange=finalRender; el.oninput=finalRender; } });
    const search=q('skySearchBox'); if(search) search.oninput=finalRender;
    document.querySelectorAll('#skyPage button').forEach(btn=>{ if(/clear filters/i.test(btn.textContent||'')){ btn.onclick=function(){ clearFilters(false); }; } });
  }
  function clearFilters(scroll){
    ['skyQueueFilter','skyBrandFilter','skyAgingDaysGroupFilter'].forEach(id=>{ const e=q(id); if(e) e.value=''; });
    MULTI_IDS.forEach(id=>{ const e=q(id); if(e) [...e.options].forEach((o,i)=>o.selected=i===0 || o.value===ALL); updateMultiButton(id); });
    const s=q('skySearchBox'); if(s) s.value='';
    finalRender(); if(scroll && typeof scrollToElement==='function') scrollToElement('skyCasesTable');
  }

  try{ getSkyFilteredRows = filteredRows; }catch(e){ /* [dedup] superseded getSkyFilteredRows definition removed (was L4248) */ }
  try{ updateSkyCharts = updateCharts; }catch(e){ /* [dedup] superseded updateSkyCharts definition removed (was L4249) */ }
  window.getSkyFilteredRows=filteredRows; window.updateSkyCharts=updateCharts; /* [dedup] superseded clearSkyFilters definition removed (was L4250) */
  const oldRender=window.renderSky;
  window.renderSky=function(){ if(oldRender){ try{ oldRender.apply(this,arguments); }catch(e){} } setTimeout(()=>{ wire(); finalRender(); },180); };

  function animateTitle(){
    const base='Service Support Center'; const parts=base.split('').join(', '); let i=0;
    clearInterval(window.serviceEyeTitleTimerV43);
    window.serviceEyeTitleTimerV43=void(()=>{ const t=parts; const p=i%t.length; document.title=t.slice(p)+'   '+t.slice(0,p); i++; },420);
  }
  function install(){ wire(); finalRender(); animateTitle(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(install,500)); else setTimeout(install,500);
  window.addEventListener('load',()=>setTimeout(install,1200));
})();


/* ===== inline-script-24 ===== */

(function(){
  'use strict';

  function placeSkyMultiPanel(wrap){
    try{
      if(!wrap) return;
      const btn = wrap.querySelector('.sky-v43-multi-btn');
      const panel = wrap.querySelector('.sky-v43-multi-panel');
      if(!btn || !panel) return;
      const r = btn.getBoundingClientRect();
      const width = Math.min(Math.max(r.width, 280), window.innerWidth - 24, 330);
      let left = Math.min(Math.max(12, r.left), window.innerWidth - width - 12);
      let top = r.bottom + 8;
      const panelHeight = Math.min(360, window.innerHeight - 24);
      if(top + panelHeight > window.innerHeight) top = Math.max(12, r.top - panelHeight - 8);
      panel.style.width = width + 'px';
      panel.style.left = left + 'px';
      panel.style.top = top + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    }catch(e){}
  }

  function fixOpenSkyPanels(){
    document.querySelectorAll('#skyPage .sky-v43-multi.open').forEach(placeSkyMultiPanel);
  }

  document.addEventListener('click', function(e){
    const btn = e.target && e.target.closest ? e.target.closest('#skyPage .sky-v43-multi-btn') : null;
    if(btn){
      const wrap = btn.closest('.sky-v43-multi');
      setTimeout(function(){ placeSkyMultiPanel(wrap); }, 0);
      setTimeout(function(){ placeSkyMultiPanel(wrap); }, 50);
    }
  }, true);

  window.addEventListener('resize', fixOpenSkyPanels, {passive:true});
  window.addEventListener('scroll', fixOpenSkyPanels, {passive:true});

  function startSentenceTitleAnimation(){
    ['serviceEyeTitleTimerV43','skyV42TitleTimer','serviceEyeTitleTimerV44'].forEach(function(k){
      try{ if(window[k]) clearInterval(window[k]); }catch(e){}
    });
    const sentence = 'Service Support Center';
    const frames = [
      sentence,
      sentence + ', ',
      sentence + ', ' + sentence,
      sentence + ', ' + sentence + ', ',
      sentence + ', ' + sentence + ', ' + sentence
    ];
    let i = 0;
    document.title = sentence;
    window.serviceEyeTitleTimerV44 = setInterval(function(){
      document.title = frames[i % frames.length];
      i++;
    }, 10000);
  }

  function installV44(){
    fixOpenSkyPanels();
    startSentenceTitleAnimation();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(installV44, 700); });
  else setTimeout(installV44, 700);
  window.addEventListener('load', function(){ setTimeout(installV44, 1600); });
  setTimeout(installV44, 3500);
})();


/* ===== v45_sky_local_dropdown_fix_script ===== */

(function(){
  'use strict';

  function neutralizeFixedPanelInlineStyles(){
    document.querySelectorAll('#skyPage .sky-v43-multi-panel').forEach(function(panel){
      panel.style.removeProperty('position');
      panel.style.removeProperty('left');
      panel.style.removeProperty('top');
      panel.style.removeProperty('right');
      panel.style.removeProperty('bottom');
      panel.style.removeProperty('width');
      panel.style.removeProperty('max-height');
    });
  }

  function install(){
    neutralizeFixedPanelInlineStyles();
    document.querySelectorAll('#skyPage .sky-v43-multi-btn').forEach(function(btn){
      if(btn.dataset.v45Fixed === '1') return;
      btn.dataset.v45Fixed = '1';
      btn.addEventListener('click', function(){
        setTimeout(neutralizeFixedPanelInlineStyles, 60);
      }, true);
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(install, 500); });
  else setTimeout(install, 500);
  window.addEventListener('load', function(){ setTimeout(install, 1000); });
/* removed duplicate delayed install at 15s */
})();


/* ===== v46_sky_filter_design_script ===== */

(function(){
  'use strict';

  const ALL = (typeof window.ALL_VALUE !== 'undefined' ? window.ALL_VALUE : '__ALL__');
  const FILTERS = [
    { id: 'skyBranchFilter', multiple: true, allText: 'All Branches' },
    { id: 'skyQueueFilter', multiple: false, allText: '(Select All)' },
    { id: 'skyBrandFilter', multiple: false, allText: '(Select All)' },
    { id: 'skyStageFilter', multiple: true, allText: '(Select All)' },
    { id: 'skyAgingDaysGroupFilter', multiple: false, allText: '(Select All)' }
  ];

  function q(id){ return document.getElementById(id); }
  function esc(v){ return String(v ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s])); }
  function closePanels(){ document.querySelectorAll('.sky-v46-panel.open').forEach(p => p.classList.remove('open')); }
  function optionText(opt, cfg){
    if(!opt) return '';
    const value = opt.value || '';
    const raw = (opt.textContent || value || '').trim();
    if(!value || value === ALL || /^all$/i.test(raw) || /select all/i.test(raw) || /^all /i.test(raw)) return cfg.allText || '(Select All)';
    return raw;
  }
  function getOptions(select, cfg){
    const opts = Array.from(select.options).map(o => ({ value: o.value || '', text: optionText(o, cfg), selected: o.selected }));
    if(!opts.some(o => !o.value || o.value === ALL)) opts.unshift({ value: cfg.multiple ? ALL : '', text: cfg.allText || '(Select All)', selected: cfg.multiple ? !opts.some(o=>o.selected) : !select.value });
    return opts;
  }
  function selectedLabel(select, cfg){
    const opts = getOptions(select, cfg);
    if(cfg.multiple){
      const selected = Array.from(select.selectedOptions).filter(o => o.value && o.value !== ALL);
      const allSelected = !selected.length || Array.from(select.selectedOptions).some(o => o.value === ALL);
      if(allSelected) return cfg.allText || '(Select All)';
      if(selected.length > 2) return selected.length + ' selected';
      return selected.map(o => optionText(o, cfg)).join(', ');
    }
    if(!select.value) return cfg.allText || '(Select All)';
    const found = opts.find(o => o.value === select.value);
    return found ? found.text : select.value;
  }
  function ensureButton(select, cfg){
    select.style.display = 'none';
    const oldExcel = q(select.id + '_excel'); if(oldExcel) oldExcel.style.display = 'none';
    const parent = select.parentElement;
    if(parent){ parent.querySelectorAll('.sky-v43-multi').forEach(x => x.style.display = 'none'); }
    let wrap = q(select.id + '_v46');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.id = select.id + '_v46';
      wrap.className = 'sky-v46-filter';
      wrap.innerHTML = '<button type="button" class="sky-v46-btn"><span></span></button>';
      select.insertAdjacentElement('afterend', wrap);
    }
    const btn = wrap.querySelector('.sky-v46-btn');
    btn.querySelector('span').textContent = selectedLabel(select, cfg);
    btn.title = selectedLabel(select, cfg);
    if(btn.dataset.v46Ready !== '1'){
      btn.dataset.v46Ready = '1';
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        openPanel(select, cfg, btn);
      });
    }
  }
  function placePanel(panel, btn){
    const r = btn.getBoundingClientRect();
    const width = Math.min(Math.max(r.width, 320), window.innerWidth - 24, 425);
    let left = Math.min(Math.max(12, r.left), window.innerWidth - width - 12);
    let top = r.bottom + 8;
    const maxH = Math.min(430, window.innerHeight - 24);
    if(top + maxH > window.innerHeight) top = Math.max(12, r.top - maxH - 8);
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
    panel.style.width = width + 'px';
    panel.style.maxHeight = maxH + 'px';
  }
  function applyTemp(select, cfg, temp){
    if(cfg.multiple){
      const vals = new Set(Array.from(temp));
      const realVals = Array.from(vals).filter(v => v && v !== ALL);
      Array.from(select.options).forEach(o => {
        if(!realVals.length) o.selected = (!o.value || o.value === ALL);
        else o.selected = realVals.includes(o.value);
      });
      if(!Array.from(select.selectedOptions).length && select.options[0]) select.options[0].selected = true;
    } else {
      const vals = Array.from(temp).filter(v => v !== ALL);
      select.value = vals[0] || '';
    }
    select.dispatchEvent(new Event('change', { bubbles:true }));
  }
  function openPanel(select, cfg, btn){
    const oldOpen = q(select.id + '_v46_panel')?.classList.contains('open');
    closePanels();
    if(oldOpen) return;
    let panel = q(select.id + '_v46_panel');
    if(!panel){
      panel = document.createElement('div');
      panel.id = select.id + '_v46_panel';
      panel.className = 'sky-v46-panel';
      document.body.appendChild(panel);
    }
    const currentSelected = cfg.multiple ? Array.from(select.selectedOptions).map(o=>o.value) : [select.value || ''];
    let temp = new Set(currentSelected.length ? currentSelected : [cfg.multiple ? ALL : '']);
    if(cfg.multiple && (!temp.size || temp.has(ALL))) temp = new Set([ALL]);

    function draw(filter){
      const opts = getOptions(select, cfg);
      const term = String(filter || '').toLowerCase();
      const visible = opts.filter(o => !term || o.text.toLowerCase().includes(term));
      panel.innerHTML = '<input class="sky-v46-search" placeholder="Search">' +
        '<div class="sky-v46-list">' + visible.map(o => '<label class="sky-v46-option"><input type="checkbox" data-value="' + esc(o.value) + '" ' + (temp.has(o.value) || (!o.value && temp.has('')) ? 'checked' : '') + '><span>' + esc(o.text) + '</span></label>').join('') + '</div>' +
        '<div class="sky-v46-actions"><button type="button" class="sky-v46-ok">OK</button><button type="button" class="sky-v46-cancel">Cancel</button></div>';
      const search = panel.querySelector('.sky-v46-search');
      search.value = filter || '';
      search.oninput = () => draw(search.value);
      panel.querySelectorAll('.sky-v46-option input').forEach(cb => {
        cb.onchange = function(){
          const val = cb.getAttribute('data-value') || '';
          if(cfg.multiple){
            if(val === ALL || val === '') temp = cb.checked ? new Set([ALL]) : new Set();
            else { temp.delete(ALL); temp.delete(''); cb.checked ? temp.add(val) : temp.delete(val); if(!temp.size) temp.add(ALL); }
          } else {
            temp = new Set(cb.checked ? [val] : ['']);
          }
          draw(search.value);
          setTimeout(()=>panel.querySelector('.sky-v46-search')?.focus(), 0);
        };
      });
      panel.querySelector('.sky-v46-ok').onclick = function(e){
        e.stopPropagation();
        applyTemp(select, cfg, temp);
        panel.classList.remove('open');
        ensureAll();
        if(typeof window.renderSky === 'function') window.renderSky();
      };
      panel.querySelector('.sky-v46-cancel').onclick = function(e){ e.stopPropagation(); panel.classList.remove('open'); };
    }
    draw('');
    placePanel(panel, btn);
    panel.classList.add('open');
    panel.onclick = e => e.stopPropagation();
    setTimeout(()=>panel.querySelector('.sky-v46-search')?.focus(), 0);
  }
  function ensureAll(){
    FILTERS.forEach(cfg => { const select = q(cfg.id); if(select) ensureButton(select, cfg); });
  }

  document.addEventListener('click', closePanels);
  window.addEventListener('resize', closePanels, { passive:true });
  window.addEventListener('scroll', closePanels, { passive:true });

  const previousRenderSky = window.renderSky;
  if(typeof previousRenderSky === 'function' && !window.__skyV46RenderPatched){
    window.__skyV46RenderPatched = true;
    window.renderSky = function(){
      const result = previousRenderSky.apply(this, arguments);
      setTimeout(ensureAll, 40);
      return result;
    };
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(ensureAll, 900); });
  else setTimeout(ensureAll, 900);
  window.addEventListener('load', function(){ setTimeout(ensureAll, 1300); });
  (window._ivals=window._ivals||[]).push(setInterval(function(){ ensureAll(); },15000));
  // NOTE: GitHub auto-fetch on load and hourly interval are handled by serviceEyeFinalPatchV4Script — not duplicated here
})();


/* ===== v47_sky_compact_multi_filters_script ===== */

(function(){
  'use strict';

  const ALL = (typeof window.ALL_VALUE !== 'undefined') ? window.ALL_VALUE : '__ALL__';
  const AGING_GROUPS = ['from 0 to 3 Days','From 4 to 10 Days','More than 10 Days'];
  const QUEUES = ['Open_Cases','Ready For Delivery Cases'];
  const BRANDS = ['Samsung','Apple'];
  const FILTERS = [
    { id:'skyBranchFilter', multiple:true,  allText:'All Branches' },
    { id:'skyQueueFilter', multiple:true,  allText:'All Queue' },
    { id:'skyBrandFilter', multiple:false, allText:'(Select All)' },
    { id:'skyStageFilter', multiple:true,  allText:'(Select All)' },
    { id:'skyAgingDaysGroupFilter', multiple:true, allText:'All Aging Days Groups' }
  ];

  function q(id){ return document.getElementById(id); }
  function clean(v){ return String(v ?? '').trim(); }
  function esc(v){ return clean(v).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s])); }
  function rows(){ try { if (Array.isArray(skyRows)) return skyRows; } catch(e) {} return Array.isArray(window.skyRows) ? window.skyRows : []; }
  function uniq(arr){ return [...new Set((arr||[]).map(clean).filter(Boolean))].sort((a,b)=>a.localeCompare(b)); }
  function num(v){ if(typeof v==='number') return Number.isFinite(v)?v:null; const n=Number(clean(v).replace(/,/g,'').replace(/[^0-9.-]/g,'')); return Number.isFinite(n)?n:null; }
  function isOpen(r){ return clean(r.Queue)==='Open_Cases'; }
  function agingGroup(r){ const n=num(r.Aging_Days ?? r.AgingDays ?? r['Aging Days'] ?? r.Aging ?? r.aging_days); if(n===null) return ''; if(n<=3) return 'from 0 to 3 Days'; if(n<=10) return 'From 4 to 10 Days'; return 'More than 10 Days'; }
  function selected(id){ const el=q(id); if(!el) return []; return el.multiple ? [...el.selectedOptions].map(o=>o.value).filter(v=>v && v!==ALL) : (el.value ? [el.value] : []); }
  function selectedLabel(select, cfg){
    const vals = selected(select.id);
    if(!vals.length) return cfg.allText || '(Select All)';
    if(vals.length > 2) return vals.length + ' selected';
    return vals.join(', ');
  }
  function setSelectOptions(id, values, cfg){
    const el=q(id); if(!el) return;
    const old=selected(id);
    el.multiple=!!cfg.multiple;
    if(!cfg.multiple) el.removeAttribute('multiple');
    const first = cfg.multiple ? `<option value="${ALL}">${esc(cfg.allText||'(Select All)')}</option>` : `<option value="">${esc(cfg.allText||'(Select All)')}</option>`;
    el.innerHTML = first + values.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
    if(cfg.multiple){
      let any=false;
      [...el.options].forEach(o=>{ if(old.includes(o.value)){ o.selected=true; any=true; } });
      if(!any && el.options[0]) el.options[0].selected=true;
    } else {
      const keep=old.find(v=>values.includes(v));
      el.value = keep || '';
    }
  }
  function ensureAgingFilter(){
    const panel=document.querySelector('#skyPage .filters');
    const job=q('skyJobTypeFilter');
    if(job){
      const box=job.closest('div');
      if(!q('skyAgingDaysGroupFilter')){
        job.id='skyAgingDaysGroupFilter'; job.name='skyAgingDaysGroupFilter';
        const lbl=box && box.querySelector('.filter-label'); if(lbl) lbl.textContent='Aging Days Group';
      } else if(box) box.remove(); else job.remove();
    }
    if(!q('skyAgingDaysGroupFilter') && panel){
      const host=document.createElement('div');
      host.innerHTML='<div class="filter-label">Aging Days Group</div><select id="skyAgingDaysGroupFilter"></select>';
      const searchHost=q('skySearchBox')?.closest('div');
      panel.insertBefore(host, searchHost || null);
    }
  }
  function refreshLists(){
    ensureAgingFilter();
    const data=rows();
    setSelectOptions('skyBranchFilter', uniq(data.map(r=>r.Branch)), FILTERS[0]);
    setSelectOptions('skyQueueFilter', QUEUES, FILTERS[1]);
    setSelectOptions('skyBrandFilter', BRANDS, FILTERS[2]);
    setSelectOptions('skyStageFilter', uniq(data.map(r=>r.Stage)), FILTERS[3]);
    setSelectOptions('skyAgingDaysGroupFilter', AGING_GROUPS, FILTERS[4]);
    FILTERS.forEach(makeDropdown);
  }
  function closeAll(except){
    document.querySelectorAll('#skyPage .sky-v47-filter.open').forEach(w=>{ if(w!==except) w.classList.remove('open'); });
  }
  function makeDropdown(cfg){
    const select=q(cfg.id); if(!select) return;
    select.style.display='none';
    const parent=select.parentElement;
    if(parent){
      parent.querySelectorAll('.sky-v46-filter,.excel-filter-container,.sky-v43-multi').forEach(x=>{ x.style.display='none'; x.style.visibility='hidden'; });
    }
    let wrap=q(cfg.id+'_v47');
    if(!wrap){
      wrap=document.createElement('div'); wrap.id=cfg.id+'_v47'; wrap.className='sky-v47-filter';
      wrap.innerHTML='<button type="button" class="sky-v47-btn"></button><div class="sky-v47-panel"></div>';
      select.insertAdjacentElement('afterend', wrap);
    }
    const btn=wrap.querySelector('.sky-v47-btn');
    btn.textContent=selectedLabel(select,cfg); btn.title=btn.textContent;
    if(btn.dataset.ready!=='1'){
      btn.dataset.ready='1';
      btn.onclick=function(e){ e.stopPropagation(); closeAll(wrap); wrap.classList.toggle('open'); drawPanel(select,cfg,wrap); };
    }
  }
  function drawPanel(select,cfg,wrap){
    const panel=wrap.querySelector('.sky-v47-panel'); if(!panel) return;
    let temp=new Set(selected(select.id)); if(!temp.size) temp.add(cfg.multiple?ALL:'');
    function draw(term){
      const opts=[...select.options].map(o=>({value:o.value,text:(o.textContent||o.value).trim()}));
      const t=String(term||'').toLowerCase();
      const visible=opts.filter(o=>!t || o.text.toLowerCase().includes(t));
      panel.innerHTML='<input class="sky-v47-search" placeholder="Search">'+
        '<div class="sky-v47-list">'+visible.map(o=>`<label class="sky-v47-option"><input type="checkbox" data-value="${esc(o.value)}" ${(temp.has(o.value)||(!o.value&&temp.has('')))?'checked':''}><span>${esc(o.text)}</span></label>`).join('')+'</div>'+
        '<div class="sky-v47-actions"><button type="button" class="sky-v47-ok">OK</button><button type="button" class="sky-v47-cancel">Cancel</button></div>';
      const search=panel.querySelector('.sky-v47-search'); search.value=term||''; search.oninput=()=>draw(search.value);
      panel.querySelectorAll('.sky-v47-option input').forEach(cb=>{
        cb.onchange=function(){
          const val=cb.getAttribute('data-value')||'';
          if(cfg.multiple){
            if(val===ALL || val==='') temp = cb.checked ? new Set([ALL]) : new Set();
            else { temp.delete(ALL); temp.delete(''); cb.checked ? temp.add(val) : temp.delete(val); if(!temp.size) temp.add(ALL); }
          } else {
            temp = new Set(cb.checked ? [val] : ['']);
          }
          draw(search.value);
          setTimeout(()=>panel.querySelector('.sky-v47-search')?.focus(),0);
        };
      });
      panel.querySelector('.sky-v47-ok').onclick=function(e){ e.stopPropagation(); applyTemp(select,cfg,temp); wrap.classList.remove('open'); ensureButtons(); if(typeof window.renderSky==='function') window.renderSky(); };
      panel.querySelector('.sky-v47-cancel').onclick=function(e){ e.stopPropagation(); wrap.classList.remove('open'); };
    }
    draw('');
    setTimeout(()=>panel.querySelector('.sky-v47-search')?.focus(),0);
  }
  function applyTemp(select,cfg,temp){
    if(cfg.multiple){
      const real=[...temp].filter(v=>v && v!==ALL);
      [...select.options].forEach(o=>{ o.selected = real.length ? real.includes(o.value) : (!o.value || o.value===ALL); });
      if(![...select.selectedOptions].length && select.options[0]) select.options[0].selected=true;
    } else {
      const val=[...temp].find(v=>v!==ALL) || '';
      select.value=val;
    }
    select.dispatchEvent(new Event('change',{bubbles:true}));
  }
  function ensureButtons(){ FILTERS.forEach(makeDropdown); }
  function filteredRows(){
    const branches=selected('skyBranchFilter'), queues=selected('skyQueueFilter'), brands=selected('skyBrandFilter'), stages=selected('skyStageFilter'), ags=selected('skyAgingDaysGroupFilter');
    const search=clean(q('skySearchBox')?.value||'').toLowerCase();
    return rows().filter(r=>{
      if(branches.length && !branches.includes(clean(r.Branch))) return false;
      if(queues.length && !queues.includes(clean(r.Queue))) return false;
      if(brands.length && !brands.includes(clean(r.Brand))) return false;
      if(stages.length && !stages.includes(clean(r.Stage))) return false;
      if(ags.length){ if(!isOpen(r)) return false; if(!ags.includes(agingGroup(r))) return false; }
      if(search){
        const hay=[r.Job_Number,r.IMEI,r.SerialNumber,r.Customer_Mobile,r.Customer_phone,r['Customer Mobile'],r['Customer Phone'],r.Status,r.Stage,r.Branch,r.Model].map(v=>clean(v).toLowerCase()).join(' ');
        if(!hay.includes(search)) return false;
      }
      return true;
    });
  }
  function setTxt(id,val){ const el=q(id); if(el) el.textContent=val; }
  function pct(a,b){ return b ? ((Number(a||0)/Number(b||0))*100).toFixed(1) : '0.0'; }
  function renderCards(data){
    const total=data.length, open=data.filter(r=>clean(r.Queue)==='Open_Cases').length, ready=data.filter(r=>clean(r.Queue)==='Ready For Delivery Cases').length, delivered=data.filter(r=>clean(r.Queue)==='__REMOVED_QUEUE__').length, closed=ready+delivered, samsung=data.filter(r=>clean(r.Brand).toLowerCase()==='samsung').length, apple=data.filter(r=>clean(r.Brand).toLowerCase()==='apple').length;
    setTxt('skyTotalCases',total); setTxt('skyOpenCases',open); setTxt('skyOpenPercent',`${pct(open,total)}% of Total`); setTxt('skyReadyCases',ready); setTxt('skyReadyPercent',`${pct(ready,total)}% of Total`); setTxt('skyDeliveredCases',delivered); setTxt('skyDeliveredPercent',`${pct(delivered,total)}% of Total`); setTxt('skyClosedCases',closed); setTxt('skyClosedPercent',`${pct(closed,total)}% Ready/Delivered`); setTxt('skySamsungCases',samsung); setTxt('skySamsungPercent',`${pct(samsung,total)}% of Total`); setTxt('skyAppleCases',apple); setTxt('skyApplePercent',`${pct(apple,total)}% of Total`);
  }
  function renderTableSafe(data){
    if(typeof renderTable!=='function') return;
    const enriched=data.map(r=>Object.assign({},r,{Aging_Days_Group:isOpen(r)?agingGroup(r):''}));
    const cols=[['Queue','Queue'],['Brand','Brand'],['Branch','Branch'],['Open_Date_Display','Open Date'],['Aging_Days','Aging Days'],['Aging_Days_Group','Aging Days Group'],['Job_Number','Job Number'],['Status','Status'],['Stage','Stage'],['Item English Name','Item English Name'],['Price','Price']];
    renderTable('skyCasesTable', enriched.slice(0,1000), cols, false);
  }
  function renderSkyV47(){
    ensureAgingFilter();
    const data=filteredRows();
    try{ currentSkyRows=data; }catch(e){ window.currentSkyRows=data; }
    renderCards(data); renderTableSafe(data); if(typeof updateSkyCharts==='function') updateSkyCharts(data); requestAnimationFrame(ensureButtons);
  }
  function clearFilters(scroll){
    ensureAgingFilter();
    ['skyBranchFilter','skyQueueFilter','skyStageFilter','skyAgingDaysGroupFilter'].forEach(id=>{ const el=q(id); if(el) [...el.options].forEach((o,i)=>o.selected=(i===0 || o.value===ALL)); });
    const brand=q('skyBrandFilter'); if(brand) brand.value='';
    const s=q('skySearchBox'); if(s) s.value='';
    renderSkyV47(); if(scroll && typeof scrollToElement==='function') scrollToElement('skyCasesTable');
  }
  function setSingleOrMulti(id,value){
    const el=q(id); if(!el) return; const val=clean(value);
    if(el.multiple){ let any=false; [...el.options].forEach((o,i)=>{ o.selected = val ? o.value===val : (i===0 || o.value===ALL); if(o.selected && val) any=true; }); if(val && !any && el.options[0]) el.options[0].selected=true; }
    else el.value=val||'';
  }
  function install(){
    refreshLists();
    FILTERS.forEach(cfg=>{ const el=q(cfg.id); if(el) el.onchange=renderSkyV47; });
    const search=q('skySearchBox'); if(search) search.oninput=renderSkyV47;
    try{ window.getSkyFilteredRows=filteredRows; window.refreshSkyFilters=refreshLists; window.refreshSkyExcelFilterWidgets=ensureButtons; window.renderSky=renderSkyV47; window.clearSkyFilters=clearFilters; }catch(e){}
    window.setSkyQueue=function(v){ setSingleOrMulti('skyQueueFilter',v); renderSkyV47(); if(typeof scrollToElement==='function') scrollToElement('skyCasesTable'); };
    window.setSkyBrand=function(v){ setSingleOrMulti('skyBrandFilter',v); renderSkyV47(); if(typeof scrollToElement==='function') scrollToElement('skyCasesTable'); };
    renderSkyV47();
  }

  document.addEventListener('click', e=>{ if(!e.target.closest('#skyPage .sky-v47-filter')) closeAll(); });
  window.addEventListener('resize', closeAll, {passive:true});
  window.addEventListener('scroll', closeAll, {passive:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(install,300)); else setTimeout(install,300);
  window.addEventListener('load',()=>{ setTimeout(install,900); });
void(()=>{ ensureButtons(); document.querySelectorAll('#skyPage .sky-v46-filter,.sky-v46-panel').forEach(x=>{x.style.display='none';x.style.visibility='hidden';}); },2500);
})();


/* ===== v48_sky_multi_and_gspn_scroll_fix ===== */

(function(){
  'use strict';
  const ALL = (typeof window.ALL_VALUE !== 'undefined') ? window.ALL_VALUE : '__ALL__';
  const QUEUE_VALUES = ['Open_Cases','Ready For Delivery Cases'];
  const AGING_VALUES = ['from 0 to 3 Days','From 4 to 10 Days','More than 10 Days'];

  function q(id){ return document.getElementById(id); }
  function clean(v){ return String(v ?? '').trim(); }
  function esc(v){ return clean(v).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s])); }
  function rows(){ try{ if(Array.isArray(skyRows)) return skyRows; }catch(e){} return Array.isArray(window.skyRows) ? window.skyRows : []; }
  function uniq(a){ return [...new Set((a||[]).map(clean).filter(Boolean))].sort((x,y)=>x.localeCompare(y)); }
  /* [dedup] orphan helper num removed */
  /* [dedup] orphan helper isOpen removed */
  /* [dedup] orphan helper agingGroup removed */

  function selected(id){ const el=q(id); if(!el) return []; return el.multiple ? [...el.selectedOptions].map(o=>o.value).filter(v=>v && v!==ALL) : (el.value ? [el.value] : []); }
  function setOptions(id, values, allText, multiple){
    const el=q(id); if(!el) return;
    const old=selected(id);
    el.multiple=!!multiple;
    if(multiple) el.setAttribute('multiple','multiple'); else el.removeAttribute('multiple');
    el.innerHTML = `<option value="${multiple?ALL:''}">${esc(allText||'(Select All)')}</option>` + values.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
    let kept=false;
    [...el.options].forEach((o,i)=>{ if(old.includes(o.value)){ o.selected=true; kept=true; } });
    if(!kept && el.options[0]) el.options[0].selected=true;
  }
  function summary(id, allText){ const vals=selected(id); if(!vals.length) return allText || '(Select All)'; return vals.length>2 ? vals.length+' selected' : vals.join(', '); }
  function closeSky(except){ document.querySelectorAll('#skyPage .sky-v48-filter.open').forEach(w=>{ if(w!==except) w.classList.remove('open'); }); }

  function buildSkyDropdown(id, allText, multiple){
    const select=q(id); if(!select) return;
    select.style.display='none';
    const parent=select.parentElement;
    if(parent){ parent.querySelectorAll('.excel-filter-container,.sky-v46-filter,.sky-v47-filter').forEach(x=>{ if(x.id!==id+'_v48'){ x.style.display='none'; x.style.visibility='hidden'; }}); }
    let wrap=q(id+'_v48');
    if(!wrap){
      wrap=document.createElement('div'); wrap.id=id+'_v48'; wrap.className='sky-v47-filter sky-v48-filter';
      wrap.innerHTML='<button type="button" class="sky-v47-btn sky-v48-btn"></button><div class="sky-v47-panel sky-v48-panel"></div>';
      select.insertAdjacentElement('afterend', wrap);
    }
    wrap.style.display='block'; wrap.style.visibility='visible';
    const btn=wrap.querySelector('button'); const panel=wrap.querySelector('.sky-v48-panel');
    btn.textContent=summary(id, allText); btn.title=btn.textContent;
    btn.onclick=function(e){ e.stopPropagation(); const was=wrap.classList.contains('open'); closeSky(wrap); if(was){ wrap.classList.remove('open'); return; } draw(); wrap.classList.add('open'); setTimeout(()=>panel.querySelector('input')?.focus(),0); };
    function draw(term=''){
      let temp=new Set(selected(id)); if(!temp.size) temp.add(ALL);
      const opts=[...select.options].map(o=>({value:o.value,text:o.textContent||o.value}));
      function paint(filter=''){
        const t=String(filter||'').toLowerCase();
        const visible=opts.filter(o=>!t || o.text.toLowerCase().includes(t));
        panel.innerHTML='<input class="sky-v47-search" placeholder="Search">'+
          '<div class="sky-v47-list">'+visible.map(o=>`<label class="sky-v47-option"><input type="checkbox" data-value="${esc(o.value)}" ${temp.has(o.value)?'checked':''}><span>${esc(o.text)}</span></label>`).join('')+'</div>'+ 
          '<div class="sky-v47-actions"><button type="button" class="sky-v47-ok">OK</button><button type="button" class="sky-v47-cancel">Cancel</button></div>';
        const search=panel.querySelector('.sky-v47-search'); const list=panel.querySelector('.sky-v47-list');
        search.value=filter||''; search.oninput=()=>paint(search.value);
        list.addEventListener('wheel', ev=>ev.stopPropagation(), {passive:true});
        list.addEventListener('scroll', ev=>ev.stopPropagation(), {passive:true});
        panel.querySelectorAll('input[type=checkbox]').forEach(cb=>{
          cb.onchange=function(){
            const val=cb.getAttribute('data-value')||'';
            if(multiple){
              if(val===ALL || val===''){ temp = cb.checked ? new Set([ALL]) : new Set(); }
              else { temp.delete(ALL); temp.delete(''); cb.checked ? temp.add(val) : temp.delete(val); if(!temp.size) temp.add(ALL); }
            } else { temp = new Set(cb.checked ? [val] : [ALL]); }
            paint(search.value); setTimeout(()=>panel.querySelector('.sky-v47-search')?.focus(),0);
          };
        });
        panel.querySelector('.sky-v47-ok').onclick=function(e){
          e.stopPropagation();
          const real=[...temp].filter(v=>v && v!==ALL);
          [...select.options].forEach((o,i)=>o.selected = real.length ? real.includes(o.value) : (i===0 || o.value===ALL || o.value===''));
          wrap.classList.remove('open');
          select.dispatchEvent(new Event('change',{bubbles:true}));
          if(typeof window.renderSky==='function') window.renderSky();
        };
        panel.querySelector('.sky-v47-cancel').onclick=e=>{ e.stopPropagation(); wrap.classList.remove('open'); };
      }
      paint(term);
    }
  }

  function enforceSkyMulti(){
    const data=rows();
    setOptions('skyQueueFilter', QUEUE_VALUES, '(Select All)', true);
    setOptions('skyAgingDaysGroupFilter', AGING_VALUES, '(Select All)', true);
    if(q('skyBranchFilter')) setOptions('skyBranchFilter', uniq(data.map(r=>r.Branch)), '(Select All)', true);
    if(q('skyStageFilter')) setOptions('skyStageFilter', uniq(data.map(r=>r.Stage)), '(Select All)', true);
    buildSkyDropdown('skyBranchFilter','(Select All)',true);
    buildSkyDropdown('skyQueueFilter','(Select All)',true);
    buildSkyDropdown('skyBrandFilter','(Select All)',false);
    buildSkyDropdown('skyStageFilter','(Select All)',true);
    buildSkyDropdown('skyAgingDaysGroupFilter','(Select All)',true);
  }

  const oldGet=window.getSkyFilteredRows;
  /* [dedup] superseded getSkyFilteredRows definition removed (was L4847) */

  const oldRenderSky=window.renderSky;
  /* [dedup] superseded renderSky definition removed (was L4863) */
  /* [dedup] superseded refreshSkyExcelFilterWidgets definition removed (was L4868) */

  /* GSPN: allow mouse wheel/trackpad scrolling inside filter lists without closing or moving the page */
  function fixGspnScroll(){
    document.querySelectorAll('#gspnPage .excel-filter-list, .excel-filter-panel.v22-portal .excel-filter-list').forEach(list=>{
      if(list.dataset.v48ScrollFix==='1') return;
      list.dataset.v48ScrollFix='1';
      list.addEventListener('wheel', function(e){ e.stopPropagation(); }, {passive:true});
      list.addEventListener('touchmove', function(e){ e.stopPropagation(); }, {passive:true});
      list.addEventListener('scroll', function(e){ e.stopPropagation(); }, {passive:true});
    });
  }

  document.addEventListener('click', e=>{ if(!e.target.closest('#skyPage .sky-v48-filter')) closeSky(); });
  document.addEventListener('DOMContentLoaded',()=>{ setTimeout(()=>{ enforceSkyMulti(); fixGspnScroll(); if(typeof window.renderSky==='function') window.renderSky(); },600); });
  window.addEventListener('load',()=>{ setTimeout(()=>{ enforceSkyMulti(); fixGspnScroll(); },1200); setTimeout(()=>{ enforceSkyMulti(); fixGspnScroll(); },2500); });
void(fixGspnScroll, 8000);
})();


/* ===== v49_urgent_filter_fixes_script ===== */

(function(){
  'use strict';
  const ALL='__ALL__';
  const QUEUES=['Open_Cases','Ready For Delivery Cases'];
  const AGING=['from 0 to 3 Days','From 4 to 10 Days','More than 10 Days'];
  const SKY_FILTERS=[
    {id:'skyBranchFilter', multi:true, all:'All Branches', values:()=>uniq(dataRows().map(r=>r.Branch))},
    {id:'skyQueueFilter', multi:true, all:'(Select All)', values:()=>QUEUES},
    {id:'skyBrandFilter', multi:false, all:'(Select All)', values:()=>['Samsung','Apple']},
    {id:'skyStageFilter', multi:true, all:'(Select All)', values:()=>uniq(dataRows().map(r=>r.Stage))},
    {id:'skyAgingDaysGroupFilter', multi:true, all:'(Select All)', values:()=>AGING}
  ];
  function byId(id){return document.getElementById(id);} 
  function clean(v){return String(v ?? '').trim();}
  function html(v){return clean(v).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));}
  function uniq(a){return [...new Set((a||[]).map(clean).filter(Boolean))].sort((x,y)=>x.localeCompare(y));}
  function dataRows(){try{if(Array.isArray(window.skyRows))return window.skyRows;if(Array.isArray(skyRows))return skyRows;}catch(e){} return [];}
  function num(v){const n=typeof v==='number'?v:Number(clean(v).replace(/,/g,'').replace(/[^0-9.-]/g,''));return Number.isFinite(n)?n:null;}
  function isOpen(r){return clean(r.Queue)==='Open_Cases';}
  function agingGroup(r){const n=num(r.Aging_Days ?? r.AgingDays ?? r['Aging Days'] ?? r.Aging); if(n===null)return ''; if(n<=3)return 'from 0 to 3 Days'; if(n<=10)return 'From 4 to 10 Days'; return 'More than 10 Days';}
  function selected(id){const el=byId(id); if(!el)return []; return [...el.selectedOptions].map(o=>o.value).filter(v=>v && v!==ALL);}
  function setText(id,val){const el=byId(id); if(el)el.textContent=val;}
  function pct(a,b){return b?((Number(a||0)/Number(b||0))*100).toFixed(1):'0.0';}
  function ensureSelect(cfg){
    const el=byId(cfg.id); if(!el)return;
    const keep=selected(cfg.id);
    el.classList.add('sky-filter-native-v49');
    el.multiple=!!cfg.multi;
    if(cfg.multi)el.setAttribute('multiple','multiple'); else el.removeAttribute('multiple');
    const values=cfg.values();
    const firstValue=cfg.multi?ALL:'';
    el.innerHTML=`<option value="${firstValue}">${html(cfg.all||'(Select All)')}</option>`+values.map(v=>`<option value="${html(v)}">${html(v)}</option>`).join('');
    let kept=false;
    [...el.options].forEach((o,i)=>{ if(keep.includes(o.value)){o.selected=true; kept=true;} });
    if(!kept && el.options[0]) el.options[0].selected=true;
  }
  function summary(cfg){const vals=selected(cfg.id); if(!vals.length)return cfg.all||'(Select All)'; return vals.length>2?`${vals.length} selected`:vals.join(', ');}
  function closeAll(except){document.querySelectorAll('#skyPage .sky-v49-filter.open').forEach(w=>{if(w!==except)w.classList.remove('open');});}
  function buildWidget(cfg){
    const el=byId(cfg.id); if(!el)return;
    const parent=el.parentElement;
    if(parent){parent.querySelectorAll('.excel-filter-container,.sky-v46-filter,.sky-v47-filter,.sky-v48-filter').forEach(x=>{ if(!x.classList.contains('sky-v49-filter')){x.style.display='none';x.style.visibility='hidden';x.style.pointerEvents='none';} });}
    let wrap=byId(cfg.id+'_v49');
    if(!wrap){
      wrap=document.createElement('div'); wrap.id=cfg.id+'_v49'; wrap.className='sky-v49-filter';
      wrap.innerHTML='<button type="button" class="sky-v49-btn"></button><div class="sky-v49-panel"></div>';
      el.insertAdjacentElement('afterend',wrap);
    }
    const btn=wrap.querySelector('.sky-v49-btn'), panel=wrap.querySelector('.sky-v49-panel');
    function syncDark(){
      const dark = document.body.dataset.pageColor === 'dark' || localStorage.getItem('serviceEyePageColor_v2') === 'dark' || localStorage.getItem('serviceEyeColor_sky') === 'black' || document.body.classList.contains('color-black') || document.body.classList.contains('theme-glass');
      wrap.classList.toggle('sky-v49-dark', dark);
    }
    syncDark();
    btn.textContent=summary(cfg); btn.title=btn.textContent;
    btn.onclick=function(e){e.preventDefault();e.stopPropagation(); const was=wrap.classList.contains('open'); closeAll(wrap); if(was){wrap.classList.remove('open');return;} syncDark(); drawPanel(cfg,el,wrap,panel); wrap.classList.add('open'); setTimeout(()=>panel.querySelector('.sky-v49-search')?.focus(),0);};
  }
  function drawPanel(cfg,select,wrap,panel){
    let temp=new Set(selected(cfg.id));
    if(!temp.size)temp.add(cfg.multi?ALL:'');
    const allVal=cfg.multi?ALL:'';
    function paint(filter=''){
      const opts=[...select.options].map(o=>({value:o.value,text:o.textContent||o.value}));
      const term=String(filter||'').toLowerCase();
      const visible=opts.filter(o=>!term||o.text.toLowerCase().includes(term));
      panel.innerHTML=`<input class="sky-v49-search" placeholder="Search" value="${html(filter)}">`+
        `<div class="sky-v49-list">${visible.map(o=>`<label class="sky-v49-option"><input type="checkbox" data-value="${html(o.value)}" ${temp.has(o.value)?'checked':''}><span>${html(o.text)}</span></label>`).join('')}</div>`+
        '<div class="sky-v49-actions"><button type="button" class="sky-v49-ok">OK</button><button type="button" class="sky-v49-cancel">Cancel</button></div>';
      const search=panel.querySelector('.sky-v49-search'), list=panel.querySelector('.sky-v49-list');
      search.oninput=()=>paint(search.value);
      ['wheel','touchmove','scroll'].forEach(evt=>list.addEventListener(evt,e=>e.stopPropagation(),{passive:true}));
      panel.querySelectorAll('input[type=checkbox]').forEach(cb=>{
        cb.onchange=function(){
          const val=cb.getAttribute('data-value')||'';
          if(cfg.multi){
            if(val===ALL){ temp=cb.checked?new Set([ALL]):new Set(); }
            else { temp.delete(ALL); if(cb.checked)temp.add(val); else temp.delete(val); if(!temp.size)temp.add(ALL); }
          } else { temp=cb.checked?new Set([val]):new Set(['']); }
          paint(search.value);
        };
      });
      panel.querySelector('.sky-v49-ok').onclick=function(e){
        e.preventDefault();e.stopPropagation();
        const real=[...temp].filter(v=>v && v!==ALL);
        [...select.options].forEach((o,i)=>{ o.selected=real.length?real.includes(o.value):(i===0||o.value===allVal); });
        wrap.classList.remove('open');
        select.dispatchEvent(new Event('change',{bubbles:true}));
        renderSkyV49();
      };
      panel.querySelector('.sky-v49-cancel').onclick=function(e){e.preventDefault();e.stopPropagation();wrap.classList.remove('open');};
      const s=panel.querySelector('.sky-v49-search'); s.focus(); try{s.setSelectionRange(s.value.length,s.value.length);}catch(e){}
    }
    paint('');
  }
  function ensureSkyFilters(){SKY_FILTERS.forEach(ensureSelect); SKY_FILTERS.forEach(buildWidget);}
  function filteredRowsV49(){
    const branches=selected('skyBranchFilter'), queues=selected('skyQueueFilter'), brands=selected('skyBrandFilter'), stages=selected('skyStageFilter'), aging=selected('skyAgingDaysGroupFilter');
    const search=clean(byId('skySearchBox')?.value||'').toLowerCase();
    return dataRows().filter(r=>{
      if(branches.length && !branches.includes(clean(r.Branch)))return false;
      if(queues.length && !queues.includes(clean(r.Queue)))return false;
      if(brands.length && !brands.includes(clean(r.Brand)))return false;
      if(stages.length && !stages.includes(clean(r.Stage)))return false;
      if(aging.length){ if(!isOpen(r))return false; if(!aging.includes(agingGroup(r)))return false; }
      if(search){const hay=[r.Job_Number,r.IMEI,r.SerialNumber,r['Serial Number'],r.Customer_Mobile,r['Customer Mobile'],r.Customer_phone,r['Customer Phone'],r.Status,r.Stage,r.Branch,r.Brand,r.Queue,r.Model].map(x=>clean(x).toLowerCase()).join(' '); if(!hay.includes(search))return false;}
      return true;
    });
  }
  function renderCards(data){
    const total=data.length, open=data.filter(r=>clean(r.Queue)==='Open_Cases').length, ready=data.filter(r=>clean(r.Queue)==='Ready For Delivery Cases').length, delivered=data.filter(r=>clean(r.Queue)==='__REMOVED_QUEUE__').length, closed=ready+delivered, samsung=data.filter(r=>clean(r.Brand).toLowerCase()==='samsung').length, apple=data.filter(r=>clean(r.Brand).toLowerCase()==='apple').length;
    setText('skyTotalCases',total); setText('skyOpenCases',open); setText('skyOpenPercent',`${pct(open,total)}% of Total`); setText('skyReadyCases',ready); setText('skyReadyPercent',`${pct(ready,total)}% of Total`); setText('skyDeliveredCases',delivered); setText('skyDeliveredPercent',`${pct(delivered,total)}% of Total`); setText('skyClosedCases',closed); setText('skyClosedPercent',`${pct(closed,total)}% Ready/Delivered`); setText('skySamsungCases',samsung); setText('skySamsungPercent',`${pct(samsung,total)}% of Total`); setText('skyAppleCases',apple); setText('skyApplePercent',`${pct(apple,total)}% of Total`);
  }
  function renderTableV49(data){
    if(typeof window.renderTable!=='function')return;
    const enriched=data.map(r=>Object.assign({},r,{Aging_Days_Group:isOpen(r)?agingGroup(r):''}));
    const cols=[['Queue','Queue'],['Brand','Brand'],['Branch','Branch'],['Open_Date_Display','Open Date'],['Aging_Days','Aging Days'],['Aging_Days_Group','Aging Days Group'],['Job_Number','Job Number'],['Status','Status'],['Stage','Stage'],['Item English Name','Item English Name'],['Price','Price']];
    window.renderTable('skyCasesTable',enriched.slice(0,1000),cols,false);
  }
  function renderSkyV49(){
    ensureSkyFilters();
    const data=filteredRowsV49();
    window.currentSkyRows=data;
    renderCards(data); renderTableV49(data);
    if(typeof window.updateSkyCharts==='function') window.updateSkyCharts(data);
    setTimeout(()=>SKY_FILTERS.forEach(buildWidget),0);
  }
  /* [dedup] orphan helper clearSkyV49 removed */
  function setOne(id,val){const el=byId(id); if(!el)return; const v=clean(val); [...el.options].forEach((o,i)=>{o.selected=v?o.value===v:i===0;}); renderSkyV49(); if(typeof window.scrollToElement==='function')window.scrollToElement('skyCasesTable');}

  /* [dedup] superseded getSkyFilteredRows definition removed (was L5024) */
  /* [dedup] superseded renderSky definition removed (was L5025) */
  window.refreshSkyExcelFilterWidgets=ensureSkyFilters;
  /* [dedup] superseded clearSkyFilters definition removed (was L5027) */
  window.setSkyQueue=v=>setOne('skyQueueFilter',v);
  window.setSkyBrand=v=>setOne('skyBrandFilter',v);

  function installSky(){
    ensureSkyFilters();
    SKY_FILTERS.forEach(cfg=>{const el=byId(cfg.id); if(el)el.onchange=renderSkyV49;});
    const s=byId('skySearchBox'); if(s)s.oninput=renderSkyV49;
    renderSkyV49();
  }

  function fixGspnScroll(){
    document.querySelectorAll('#gspnPage .excel-filter-panel, body > .excel-filter-panel, .excel-filter-panel.v22-portal').forEach(panel=>{
      panel.style.overflow='hidden';
      panel.querySelectorAll('.excel-filter-list').forEach(list=>{
        list.style.maxHeight='220px'; list.style.overflowY='auto'; list.style.overflowX='hidden'; list.style.overscrollBehavior='contain'; list.style.touchAction='pan-y';
        if(list.dataset.v49ScrollFix==='1')return; list.dataset.v49ScrollFix='1';
        ['wheel','touchmove','scroll'].forEach(evt=>list.addEventListener(evt,function(e){e.stopPropagation();},{passive:true,capture:true}));
      });
    });
  }
  document.addEventListener('click',e=>{if(!e.target.closest('#skyPage .sky-v49-filter'))closeAll();});
  document.addEventListener('DOMContentLoaded',()=>{setTimeout(installSky,350);setTimeout(fixGspnScroll,350);});
  window.addEventListener('load',()=>{setTimeout(installSky,800);setTimeout(fixGspnScroll,800);});
void(()=>{ if(byId('skyPage')) SKY_FILTERS.forEach(buildWidget); fixGspnScroll(); },1200);
})();


/* ===== v50_gspn_filter_scroll_fix_script ===== */

(function(){
  'use strict';
  const ALL = (typeof window.ALL_VALUE !== 'undefined' ? window.ALL_VALUE : '__ALL__');
  const FILTERS = [
    {id:'branchFilter', all:'All Branches'},
    {id:'techFilter', all:'All Technicians'},
    {id:'warrantyFilter', all:'All GSPN Warranty'},
    {id:'jobTypeFilter', all:'All GSPN JobType'},
    {id:'alertFilter', all:'All KPI Alerts'}
  ];
  function q(id){return document.getElementById(id);} 
  function clean(v){return String(v ?? '').trim();}
  function esc(v){return clean(v).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));}
  function selected(id){const el=q(id); if(!el)return []; return [...el.selectedOptions].map(o=>o.value).filter(v=>v && v!==ALL);}
  function closeAll(except){document.querySelectorAll('#gspnPage .gspn-v50-filter.open').forEach(w=>{ if(w!==except) w.classList.remove('open'); });}
  function summary(id, allText){const vals=selected(id); if(!vals.length)return '(Select All)'; return vals.length>2?`${vals.length} selected`:vals.join(', ');}
  function syncSelect(select, temp){
    const real=[...temp].filter(v=>v && v!==ALL);
    [...select.options].forEach((o,i)=>{ o.selected = real.length ? real.includes(o.value) : (o.value===ALL || i===0); });
  }
  function build(cfg){
    const select=q(cfg.id); if(!select) return;
    select.classList.add('gspn-native-v50');
    select.setAttribute('multiple','multiple');
    select.multiple=true;

    const parent=select.parentElement;
    if(parent) parent.querySelectorAll('.excel-filter-container').forEach(x=>{x.style.display='none';x.style.visibility='hidden';x.style.pointerEvents='none';});

    let wrap=q(cfg.id+'_v50');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.id=cfg.id+'_v50';
      wrap.className='gspn-v50-filter';
      wrap.innerHTML='<button type="button" class="gspn-v50-btn"></button><div class="gspn-v50-panel"></div>';
      select.insertAdjacentElement('afterend',wrap);
    }
    const btn=wrap.querySelector('.gspn-v50-btn');
    const panel=wrap.querySelector('.gspn-v50-panel');
    btn.textContent=summary(cfg.id,cfg.all);
    btn.title=btn.textContent;
    btn.onclick=function(e){
      e.preventDefault(); e.stopPropagation();
      const was=wrap.classList.contains('open');
      closeAll(wrap);
      if(was){wrap.classList.remove('open'); return;}
      draw(cfg,select,wrap,panel,'');
      wrap.classList.add('open');
      setTimeout(()=>panel.querySelector('.gspn-v50-search')?.focus(),0);
    };
  }
  function draw(cfg,select,wrap,panel,filter){
    let temp=new Set(selected(cfg.id));
    if(!temp.size) temp.add(ALL);
    function paint(termText){
      const term=clean(termText).toLowerCase();
      const opts=[...select.options].map(o=>({value:o.value,text:o.textContent||o.value}));
      const visible=opts.filter(o=>!term || o.text.toLowerCase().includes(term));
      panel.innerHTML=`<input class="gspn-v50-search" placeholder="Search" value="${esc(termText||'')}">`+
        `<div class="gspn-v50-list">${visible.map(o=>`<label class="gspn-v50-option"><input type="checkbox" data-value="${esc(o.value)}" ${temp.has(o.value)?'checked':''}><span>${esc(o.text)}</span></label>`).join('')}</div>`+
        '<div class="gspn-v50-actions"><button type="button" class="gspn-v50-ok">OK</button><button type="button" class="gspn-v50-cancel">Cancel</button></div>';
      const search=panel.querySelector('.gspn-v50-search');
      const list=panel.querySelector('.gspn-v50-list');
      search.oninput=()=>paint(search.value);
      ['wheel','mousewheel','DOMMouseScroll','touchmove','scroll'].forEach(evt=>{
        list.addEventListener(evt,function(e){ e.stopPropagation(); },{passive:true,capture:true});
      });
      panel.querySelectorAll('input[type=checkbox]').forEach(cb=>{
        cb.onchange=function(){
          const val=cb.getAttribute('data-value')||'';
          if(val===ALL){ temp=cb.checked?new Set([ALL]):new Set(); }
          else { temp.delete(ALL); if(cb.checked)temp.add(val); else temp.delete(val); if(!temp.size)temp.add(ALL); }
          paint(search.value);
        };
      });
      panel.querySelector('.gspn-v50-ok').onclick=function(e){
        e.preventDefault(); e.stopPropagation();
        syncSelect(select,temp);
        wrap.classList.remove('open');
        select.dispatchEvent(new Event('change',{bubbles:true}));
        if(typeof window.render==='function') window.render();
        requestAnimationFrame(ensure);
      };
      panel.querySelector('.gspn-v50-cancel').onclick=function(e){ e.preventDefault(); e.stopPropagation(); wrap.classList.remove('open'); };
      setTimeout(()=>{ const s=panel.querySelector('.gspn-v50-search'); if(s){s.focus(); try{s.setSelectionRange(s.value.length,s.value.length);}catch(e){}} },0);
    }
    paint(filter||'');
  }
  function ensure(){ FILTERS.forEach(build); }
  const oldRender=window.render;
  if(typeof oldRender==='function' && !oldRender.__gspnV50Wrapped){
    const wrapped=function(){ const res=oldRender.apply(this,arguments); requestAnimationFrame(ensure); return res; };
    wrapped.__gspnV50Wrapped=true;
    window.render=wrapped;
  }
  document.addEventListener('click',e=>{ if(!e.target.closest('#gspnPage .gspn-v50-filter')) closeAll(); });
  document.addEventListener('DOMContentLoaded',()=>{ setTimeout(ensure,250); });
  window.addEventListener('load',()=>{ setTimeout(ensure,800); });
/* removed duplicate delayed ensure at 15s */
})();


/* ===== gspn-v51-dropdown-layer-fix-script ===== */

(function(){
  function keepGspnFiltersOnTop(){
    var gspn = document.getElementById('gspnPage');
    if(!gspn) return;
    var filters = gspn.querySelector('.filters');
    if(filters){
      filters.style.position = 'relative';
      filters.style.zIndex = '1000000';
      filters.style.overflow = 'visible';
    }
    gspn.querySelectorAll('.cards,.card,section,.charts-grid,.chart-card').forEach(function(el){
      if(!el.closest('.filters')){
        el.style.position = 'relative';
        el.style.zIndex = '1';
      }
    });
  }
  document.addEventListener('click', function(e){
    var btn = e.target.closest && e.target.closest('#gspnPage .excel-filter-button');
    if(btn){
      requestAnimationFrame(keepGspnFiltersOnTop);
    }
  }, true);
  document.addEventListener('DOMContentLoaded', keepGspnFiltersOnTop);
  window.addEventListener('load', once(keepGspnFiltersOnTop));
  window.keepGspnFiltersOnTop = keepGspnFiltersOnTop;
})();


/* ===== v57-script ===== */

(function(){
'use strict';

/* ================================================================
   SECTION 1 — Password change: 'analysis2026' → 'sky2030'
   We override window.switchTab with a single authoritative version
   that uses the new password and prevents all previous duplicated
   switchTab wrappers (v52/v53/v54/v55) from causing double renders.
================================================================ */
const V57_PASS = 'sky2030';

// Store the very original switchTab (before any patches) once
if (!window._v57_origSwitch) {
  // Walk backwards: find the earliest switchTab before v52/v53/v54 wrapped it
  window._v57_origSwitch = window.switchTab;
}

/* ================================================================
   SECTION 2 — User presence via BroadcastChannel + localStorage
   Each open tab registers itself. Badges show how many browser
   tabs/windows are currently open on each section.
================================================================ */

/* ================================================================
   SECTION 3 — Chart deduplication fix
   Root cause: several older scripts globally register their label
   plugins via Chart.register(). When any chart on ANY tab renders,
   all globally-registered plugins fire — hence double/triple labels.

   Fix: v57 draws Analysis charts using Chart.js plugins passed
   LOCALLY (per-chart) via the plugins[] array only, and explicitly
   disables every globally-registered plugin by name in options.
   We also unregister old global plugins before each Analysis draw.
================================================================ */

// Complete list of globally-registered label plugin IDs found in this file
const V57_OLD_PLUGINS = [
  'v19Labels','v20SkyLabels','skyBarLabelErrorPlugin',
  'v21SingleChartValueLabels','serviceEyeV22LabelsOnly',
  'serviceEyeV24SingleLabels','serviceEyeV25Labels3D','serviceEyeV25Bar3D',
  'skyV43SingleLabels','v55BarValueLabels','v55AnalysisSingleValueLabels',
  'skyV40ValueLabels','skyV41ValueLabels','skyV42ValueLabels','v56AnalysisValueLabels'
];

function v57_killGlobalPlugins() {
  if (!window.Chart || !Chart.registry) return;
  V57_OLD_PLUGINS.forEach(id => {
    try { const p = Chart.registry.plugins.get(id); if (p) Chart.unregister(p); } catch(e) {}
  });
}

// Build plugin-disable map for chart options (belt + suspenders)
function v57_silenceMap() {
  const m = {};
  V57_OLD_PLUGINS.forEach(id => { m[id] = { display: false }; });
  return m;
}

// The ONE value-label plugin used only as a local (per-chart) plugin
const v57LocalLabelPlugin = {
  id: 'v57LocalLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    ctx.save();
    ctx.font      = 'bold 11px Calibri, Arial, sans-serif';
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text') || '#111827';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'bottom';
    chart.data.datasets.forEach((ds, di) => {
      const meta = chart.getDatasetMeta(di);
      meta.data.forEach((bar, i) => {
        const val = Number(ds.data[i] || 0);
        if (!val) return;
        const p = bar.tooltipPosition ? bar.tooltipPosition() : { x: bar.x, y: bar.y };
        ctx.fillText(v57_fmt(val), p.x, Math.max(12, p.y - 5));
      });
    });
    ctx.restore();
  }
};

function v57_drawBar(id, labels, datasets, extraOptions = {}) {
  const canvas = document.getElementById(id);
  if (!canvas || typeof Chart === 'undefined') return;

  // 1. Kill any globally registered old plugins
  v57_killGlobalPlugins();

  // 2. Destroy existing instance
  window.dashboardCharts = window.dashboardCharts || {};
  if (window.dashboardCharts[id]) {
    window.dashboardCharts[id].destroy();
    delete window.dashboardCharts[id];
  }

  // 3. Create fresh chart with only local plugin
  window.dashboardCharts[id] = __safeNewChart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: datasets.map(ds => ({ label: ds.label, data: ds.data, borderWidth: 1 }))
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      layout: { padding: { top: 24 } },
      plugins: {
        ...v57_silenceMap(),          // silence all old global plugins
        legend:   { display: datasets.length > 1 },
        tooltip:  { mode: 'index', intersect: false },
        subtitle: {
          display: !!extraOptions.subtitle,
          text:    extraOptions.subtitle || '',
          font:    { weight: 'bold' }
        }
      },
      scales: {
        y: { beginAtZero: true, suggestedMax: Math.max(1, ...datasets.flatMap(ds => ds.data.map(Number))) * 1.18 },
        x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 0 } }
      }
    },
    plugins: [v57LocalLabelPlugin]   // ONLY local — never globally registered
  });
}

/* ================================================================
   SECTION 4 — Helper utilities
================================================================ */
const v57_$ = s => document.querySelector(s);
const v57_esc = v => String(v ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));
const v57_norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const v57_num  = v => { if (v === null || v === undefined || v === '') return 0; const x = Number(String(v).replace(/,/g,'').replace(/[^0-9.\-]/g,'')); return isFinite(x) ? x : 0; };
const v57_fmt  = v => Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
const v57_pct  = (a, b) => b ? ((Number(a || 0) / Number(b || 0)) * 100).toFixed(1) + '%' : '0.0%';
const v57_dateVal = v => {
  if (!v) return null;
  if (v instanceof Date && !isNaN(v)) return v;
  if (typeof v === 'number') { const d = new Date(Math.round((v - 25569) * 86400 * 1000)); if (!isNaN(d)) return d; }
  const d = new Date(v); return isNaN(d) ? null : d;
};
const v57_monthKey   = v => { const d = v57_dateVal(v); return d ? d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2,'0') : ''; };
const v57_monthLabel = k => { if (!k) return 'Blank'; const [y,m] = k.split('-'); return `${m}/${y}`; };

function v57_rows()   { return Array.isArray(window.analysisRows) ? window.analysisRows : []; }
function v57_cols(d)  { return [...new Set(d.flatMap(r => Object.keys(r || {})))]; }
function v57_exact(d, name) { const c = v57_cols(d); return c.find(x => x === name) || c.find(x => v57_norm(x) === v57_norm(name)) || ''; }
function v57_pick(d, names) {
  const c = v57_cols(d);
  for (const n of names) { const e = c.find(x => v57_norm(x) === v57_norm(n)); if (e) return e; }
  for (const n of names) { const e = c.find(x => v57_norm(x).includes(v57_norm(n))); if (e) return e; }
  return '';
}
function v57_fields(data) {
  return {
    branch:   v57_exact(data, 'Branch'),
    brand:    v57_pick(data, ['Brand']),
    open:     v57_pick(data, ['Open_Date','Open Date','Receipt Date','Create Date','Created Date']),
    close:    v57_pick(data, ['CloseDate','Close Date','Closed Date','Delivery Date','Delivered Date']),
    queue:    v57_pick(data, ['Queue','Status Queue']),
    price:    v57_pick(data, ['Price','Total Price','Amount','Value','Repair Price','Selling Price']),
    model:    v57_pick(data, ['Model','Item English Name','Model Name','Product Model','Item Name']),
    repair:   v57_pick(data, ['Repair Status','Repaired','Repair','Repair Result','Status']),
    status:   v57_pick(data, ['Status','Case Status','Repair Status']),
    assigned: v57_pick(data, ['Assigned_To','Assigned To','Assigned','Technician','Engineer']),
    customer: v57_pick(data, ['Customer Type','Dealer End User','Dealer/End User','Dealer EndUser','Customer','Cust Type','End User'])
  };
}
function v57_uniq(data, field) {
  return [...new Set(data.map(r => String(r[field] ?? '').trim()).filter(Boolean))].sort((a,b) => a.localeCompare(b));
}
function v57_selected(id) {
  const el = v57_$(id); if (!el) return [];
  return [...el.options].filter(o => o.selected && o.value).map(o => o.value);
}
function v57_queueType(row, f) {
  const q = String(row[f.queue] ?? row.Queue ?? '').trim();
  const l = q.toLowerCase();
  if (q === '__REMOVED_QUEUE__' || l.includes('delivered')) return '__REMOVED_QUEUE__';
  if (q === 'Open_Cases' || q === 'Open_Cases' || l.includes('open')) return 'Open_Cases';
  if (q === 'Ready For Delivery Cases' || l.includes('ready')) return 'Ready For Delivery Cases';
  return q || 'Blank';
}
function v57_repairType(row, f) {
  const t = String(row[f.repair] ?? row[f.status] ?? row[f.queue] ?? '').toLowerCase();
  if (/not repaired|not repair|unrepair|cancel|return|pending|open/.test(t)) return 'Not Repaired';
  if (/repaired|repair|delivered|closed|ready|done|complete|fixed/.test(t)) return 'Repaired';
  return 'Not Repaired';
}
function v57_customerType(row, f) {
  const t = String(row[f.customer] ?? '').toLowerCase();
  if (t.includes('dealer')) return 'Dealer';
  if (t.includes('end') || t.includes('user') || t.includes('customer')) return 'End User';
  return 'Blank';
}
const v57_priceOf = (arr, f) => arr.reduce((a, r) => a + v57_num(r[f.price]), 0);

function v57_table(id, headers, body) {
  const el = document.getElementById(id); if (!el) return;
  el.innerHTML = '<thead><tr>' + headers.map(h => `<th>${v57_esc(h)}</th>`).join('') + '</tr></thead>'
    + '<tbody>' + body.map(r => '<tr>' + r.map(c => `<td>${v57_esc(c)}</td>`).join('') + '</tr>').join('') + '</tbody>';
}

/* CSV export */
function v57_exportRows(name, arr) {
  if (!arr.length) { alert('No data to export for: ' + name); return; }
  const headers = Object.keys(arr[0] || {});
  const cell = v => { const s = String(v ?? ''); return s.includes(',') || s.includes('"') || s.includes('\n') ? '"' + s.replace(/"/g,'""') + '"' : s; };
  const csv  = [headers.join(',')].concat(arr.map(r => headers.map(h => cell(r[h])).join(','))).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = name.replace(/[^a-z0-9_\-]+/gi, '_') + '.csv';
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

/* ================================================================
   SECTION 5 — Header fix (Upload / Sync matching GSPN/SKY style)
================================================================ */
function v57_fixHeader() {
  const page = document.getElementById('analysisPage'); if (!page) return;
  const actions = page.querySelector('.header-actions'); if (!actions) return;

  let fileInput = document.getElementById('analysisFileInput');
  actions.innerHTML = '';

  const label = document.createElement('label');
  label.className = 'upload';
  label.textContent = '⬆ Upload Excel / CSV';

  if (!fileInput) {
    fileInput = document.createElement('input');
    fileInput.type    = 'file';
    fileInput.id      = 'analysisFileInput';
    fileInput.accept  = '.xlsx,.xls,.xlsb,.csv';
  }
  fileInput.style.display = 'none';
  if (!fileInput.dataset.v57Hook) {
    fileInput.dataset.v57Hook = '1';
    fileInput.addEventListener('change', () => setTimeout(v57_render, 900));
  }
  label.appendChild(fileInput);

  const sync = document.createElement('button');
  sync.className = 'upload sync-admin-control';
  sync.type      = 'button';
  sync.textContent = '🔄 Sync Analyses_Dashboard';
  sync.onclick   = () => window.syncAnalysesDashboardFromOneDrive && window.syncAnalysesDashboardFromOneDrive();

  const statusEl = document.getElementById('analysisOnlineStatus');
  const status   = document.createElement('span');
  status.className   = 'analysis-sync-status';
  status.id          = 'analysisOnlineStatus';
  status.textContent = (statusEl && statusEl !== status) ? statusEl.textContent : 'Online sync not completed yet';

  actions.append(label, sync, status);
}

/* ================================================================
   SECTION 6 — Shell builder
================================================================ */
function v57_buildShell() {
  const main = document.getElementById('analysisPage')?.querySelector('main');
  if (!main) return;
  if (main.querySelector('#v57Cards')) return; // already built

  main.innerHTML = `
<div class="v54-analysis-wrap">
  <div class="v54-note" id="v57Note">Upload or sync Analyses_Dashboard data, then use the filters below.</div>
  <div class="v54-filters">
    <div class="v54-filter"><label>Branches</label><select id="v57Branch"></select></div>
    <div class="v54-filter"><label>Brand</label><select id="v57Brand"></select></div>
    <div class="v54-filter"><label>Open Month / Year</label><select id="v57OpenMonth"></select></div>
    <div class="v54-filter"><label>Close Month / Year</label><select id="v57CloseMonth"></select></div>
    <div class="v54-actions">
      <button class="btn btn-primary" type="button" id="v57Apply">Apply</button>
      <button class="btn btn-light"   type="button" id="v57Clear">Clear</button>
    </div>
  </div>

  <div class="v54-cards" id="v57Cards"></div>

  <div class="v54-grid">
    <div class="v54-panel">
      <h2>Delivered / Open / Ready Summary</h2>
      <div class="v54-table-wrap queue-compact"><table class="v54-table" id="v57QueueSummary"></table></div>
    </div>
    <div class="v54-panel">
      <h2 id="v57RepairTitle">Repaired vs Not Repaired</h2>
      <div class="v54-chart"><canvas id="v57RepairChart"></canvas></div>
    </div>
    <div class="v54-panel">
      <h2>Received vs Delivered per Branch</h2>
      <div class="v54-chart"><canvas id="v57ReceivedDeliveredChart"></canvas></div>
    </div>
    <div class="v54-panel">
      <h2>Branch Cash</h2>
      <div class="v54-chart-filter-row">
        <label>Closed Month / Year</label>
        <select id="v57BranchCashMonth"></select>
        <button class="btn btn-light" type="button" id="v57BranchCashClear">Clear Filter</button>
      </div>
      <div class="v54-chart"><canvas id="v57BranchCashChart"></canvas></div>
    </div>
    <div class="v54-panel">
      <h2>Top 10 Receiving Models</h2>
      <div class="v54-table-wrap"><table class="v54-table" id="v57TopModels"></table></div>
    </div>
    <div class="v54-panel">
      <h2>Status Summary</h2>
      <div class="v54-table-wrap"><table class="v54-table" id="v57StatusSummary"></table></div>
    </div>
    <div class="v54-panel">
      <h2>Assigned_To: Repaired vs Not Repaired</h2>
      <div class="v54-table-wrap"><table class="v54-table" id="v57AssignedSummary"></table></div>
    </div>
    <div class="v54-panel">
      <h2>Dealer vs End User</h2>
      <div class="v54-table-wrap"><table class="v54-table" id="v57CustomerSummary"></table></div>
    </div>
  </div>
</div>`;

  ['#v57Branch','#v57Brand','#v57OpenMonth','#v57CloseMonth','#v57BranchCashMonth'].forEach(id => {
    const el = v57_$(id); if (el) el.onchange = v57_render;
  });
  v57_$('#v57Apply').onclick = v57_render;
  v57_$('#v57Clear').onclick = () => {
    ['#v57Branch','#v57Brand','#v57OpenMonth','#v57CloseMonth'].forEach(id => {
      const el = v57_$(id); if (el) [...el.options].forEach((o, i) => o.selected = i === 0);
    });
    v57_render();
  };
  v57_$('#v57BranchCashClear').onclick = () => { const el = v57_$('#v57BranchCashMonth'); if (el) el.value = ''; v57_render(); };
}

/* ================================================================
   SECTION 7 — Filter fillers
================================================================ */
function v57_fillSingle(id, values, allLabel) {
  const el = v57_$(id); if (!el) return;
  const keep = el.value || '';
  el.innerHTML = `<option value="">${v57_esc(allLabel)}</option>` + values.map(v => `<option value="${v57_esc(v)}">${v57_esc(v)}</option>`).join('');
  el.value = [...el.options].some(o => o.value === keep) ? keep : '';
}

function v57_fillFilters(data, f) {
  const keepB = v57_selected('#v57Branch');
  const b = v57_$('#v57Branch');
  if (b) {
    b.innerHTML = '<option value="">All Branches</option>'
      + (f.branch ? v57_uniq(data, f.branch) : []).map(v => `<option value="${v57_esc(v)}">${v57_esc(v)}</option>`).join('');
    if (keepB.length) [...b.options].forEach(o => o.selected = keepB.includes(o.value));
    else if (b.options[0]) b.options[0].selected = true;
  }
  v57_fillSingle('#v57Brand', f.brand ? v57_uniq(data, f.brand) : [], 'All Brands');

  const openM  = f.open  ? [...new Set(data.map(r => v57_monthKey(r[f.open])).filter(Boolean))].sort() : [];
  const closeM = f.close ? [...new Set(data.map(r => v57_monthKey(r[f.close])).filter(Boolean))].sort() : [];

  const keepO = v57_$('#v57OpenMonth')?.value  || '';
  const keepC = v57_$('#v57CloseMonth')?.value || '';
  const keepBC= v57_$('#v57BranchCashMonth')?.value || '';

  const oEl = v57_$('#v57OpenMonth');
  if (oEl) { oEl.innerHTML = '<option value="">All Open Months</option>' + openM.map(k => `<option value="${k}">${v57_monthLabel(k)}</option>`).join(''); oEl.value = keepO; }
  const cEl = v57_$('#v57CloseMonth');
  if (cEl) { cEl.innerHTML = '<option value="">All Close Months</option>' + closeM.map(k => `<option value="${k}">${v57_monthLabel(k)}</option>`).join(''); cEl.value = keepC; }
  const bcEl = v57_$('#v57BranchCashMonth');
  if (bcEl) { bcEl.innerHTML = '<option value="">All Closed Months</option>' + closeM.map(k => `<option value="${k}">${v57_monthLabel(k)}</option>`).join(''); bcEl.value = keepBC; }
}

function v57_filtered(data, f) {
  const branches = v57_selected('#v57Branch');
  const brand    = v57_$('#v57Brand')?.value  || '';
  const om       = v57_$('#v57OpenMonth')?.value  || '';
  const cm       = v57_$('#v57CloseMonth')?.value || '';
  return data.filter(r =>
    (!branches.length || !f.branch || branches.includes(String(r[f.branch] ?? '').trim())) &&
    (!brand  || !f.brand  || String(r[f.brand]  ?? '').trim() === brand) &&
    (!om     || !f.open   || v57_monthKey(r[f.open])  === om) &&
    (!cm     || !f.close  || v57_monthKey(r[f.close]) === cm)
  );
}

/* ================================================================
   SECTION 8 — Main render
================================================================ */
function v57_render() {
  if (!document.querySelector('#analysisPage main') || !v57_$('#v57Cards')) v57_buildShell();

  const all  = v57_rows();
  const f    = v57_fields(all);
  v57_fillFilters(all, f);
  const data = v57_filtered(all, f);

  const note = v57_$('#v57Note');
  if (note) note.textContent = all.length
    ? `Analysis rows: ${v57_fmt(data.length)} filtered from ${v57_fmt(all.length)} total. Cards are clickable to export as CSV.`
    : 'No Analyses_Dashboard data loaded yet. Please upload or sync.';

  /* --- Subsets --- */
  const delivered = data.filter(r => v57_queueType(r, f) === '__REMOVED_QUEUE__');
  const open      = data.filter(r => v57_queueType(r, f) === 'Open_Cases');
  const ready     = data.filter(r => v57_queueType(r, f) === 'Ready For Delivery Cases');
  const samsung   = data.filter(r => String(r[f.brand] ?? '').trim().toLowerCase() === 'samsung');
  const apple     = data.filter(r => String(r[f.brand] ?? '').trim().toLowerCase() === 'apple');

  const cardRows  = { delivered, open, ready, samsung, apple };

  /* --- Cards (clickable → export) --- */
  const cardDefs = [
    ['Delivered Cases',          delivered, 'delivered'],
    ['Open Cases',               open,      'open'],
    ['Ready For Delivery Cases', ready,     'ready'],
    ['Samsung Cases',            samsung,   'samsung'],
    ['Apple Cases',              apple,     'apple']
  ];
  v57_$('#v57Cards').innerHTML = cardDefs.map(([title, arr, key]) => `
    <div class="v54-card" data-key="${key}" title="Click to export ${v57_esc(title)} as CSV" style="cursor:pointer">
      <div class="k">${v57_esc(title)}</div>
      <div class="v">${v57_fmt(arr.length)}</div>
      <div class="s">Total Price: ${v57_fmt(v57_priceOf(arr, f))}</div>
    </div>`).join('');

  document.querySelectorAll('#v57Cards .v54-card').forEach(c => {
    c.onclick = () => v57_exportRows(c.querySelector('.k').textContent, cardRows[c.dataset.key] || []);
  });

  /* --- Queue summary table --- */
  v57_table('v57QueueSummary',
    ['Queue','Count of Cases','Total Price'],
    [
      ['Delivered Cases',        v57_fmt(delivered.length), v57_fmt(v57_priceOf(delivered, f))],
      ['Open Cases',             v57_fmt(open.length),      v57_fmt(v57_priceOf(open, f))],
      ['Ready For Delivery',     v57_fmt(ready.length),     v57_fmt(v57_priceOf(ready, f))]
    ]
  );

  /* --- Repaired vs Not Repaired (single draw, no duplicate) --- */
  const rep = { Repaired: 0, 'Not Repaired': 0 };
  data.forEach(r => rep[v57_repairType(r, f)]++);
  const totalRep = rep.Repaired + rep['Not Repaired'];
  const diffPct  = v57_pct(Math.abs(rep.Repaired - rep['Not Repaired']), totalRep);
  const rt = v57_$('#v57RepairTitle');
  if (rt) rt.textContent = `Repaired vs Not Repaired — Difference ${diffPct}`;
  v57_drawBar('v57RepairChart',
    ['Repaired', 'Not Repaired'],
    [{ label: 'Cases', data: [rep.Repaired, rep['Not Repaired']] }],
    { subtitle: `Percentage difference: ${diffPct}` }
  );

  /* --- Received vs Delivered per Branch --- */
  const branchMap = {};
  data.forEach(r => {
    const b = String((f.branch ? r[f.branch] : '') || 'Blank').trim();
    branchMap[b] = branchMap[b] || { received: 0, delivered: 0 };
    branchMap[b].received++;
    if (v57_queueType(r, f) === '__REMOVED_QUEUE__') branchMap[b].delivered++;
  });
  const br = Object.entries(branchMap).sort((a, b) => b[1].received - a[1].received).slice(0, 12);
  v57_drawBar('v57ReceivedDeliveredChart',
    br.map(x => x[0]),
    [
      { label: 'Received Cases',  data: br.map(x => x[1].received)  },
      { label: 'Delivered Cases', data: br.map(x => x[1].delivered) }
    ]
  );

  /* --- Branch Cash (Delivered only, with own closed-month filter) --- */
  const bcMonth = v57_$('#v57BranchCashMonth')?.value || '';
  const bcRows  = delivered.filter(r => !bcMonth || !f.close || v57_monthKey(r[f.close]) === bcMonth);
  const bc = {};
  bcRows.forEach(r => {
    const b = String((f.branch ? r[f.branch] : '') || 'Blank').trim();
    bc[b] = (bc[b] || 0) + v57_num(r[f.price]);
  });
  const bcEnt = Object.entries(bc).sort((a, b) => b[1] - a[1]).slice(0, 15);
  v57_drawBar('v57BranchCashChart',
    bcEnt.map(x => x[0]),
    [{ label: 'Delivered Total Price', data: bcEnt.map(x => x[1]) }]
  );

  /* --- Top 10 Models --- */
  const models = {};
  data.forEach(r => { const m = String(r[f.model] || 'Blank'); models[m] = (models[m] || 0) + 1; });
  v57_table('v57TopModels',
    ['Rank','Model','Receiving Cases','% of Total'],
    Object.entries(models).sort((a, b) => b[1] - a[1]).slice(0, 10)
      .map((x, i) => [i + 1, x[0], v57_fmt(x[1]), v57_pct(x[1], data.length)])
  );

  /* --- Status Summary --- */
  const statusMap = {};
  data.forEach(r => {
    const s = String(r[f.status] || v57_queueType(r, f) || 'Blank');
    statusMap[s] = statusMap[s] || { c: 0, p: 0 };
    statusMap[s].c++;
    statusMap[s].p += v57_num(r[f.price]);
  });
  v57_table('v57StatusSummary',
    ['Status','Count of Cases','Total Price'],
    Object.entries(statusMap).sort((a, b) => b[1].c - a[1].c)
      .map(x => [x[0], v57_fmt(x[1].c), v57_fmt(x[1].p)])
  );

  /* --- Assigned To --- */
  const assignedMap = {};
  data.forEach(r => {
    const a = String(r[f.assigned] || 'Blank');
    assignedMap[a] = assignedMap[a] || { repaired: 0, not: 0 };
    if (v57_repairType(r, f) === 'Repaired') assignedMap[a].repaired++;
    else assignedMap[a].not++;
  });
  v57_table('v57AssignedSummary',
    ['Assigned_To','Not Repaired','Repaired','% Difference'],
    Object.entries(assignedMap)
      .sort((a, b) => (b[1].not + b[1].repaired) - (a[1].not + a[1].repaired))
      .map(x => {
        const t = x[1].not + x[1].repaired;
        return [x[0], v57_fmt(x[1].not), v57_fmt(x[1].repaired), v57_pct(Math.abs(x[1].repaired - x[1].not), t)];
      })
  );

  /* --- Dealer vs End User (with total count + % columns) --- */
  const cust = { Dealer: { count: 0, price: 0 }, 'End User': { count: 0, price: 0 }, Blank: { count: 0, price: 0 } };
  data.forEach(r => {
    const k = v57_customerType(r, f);
    cust[k] = cust[k] || { count: 0, price: 0 };
    cust[k].count++;
    cust[k].price += v57_num(r[f.price]);
  });
  const totalCust  = Object.values(cust).reduce((a, x) => a + x.count, 0);
  const totalPrice = Object.values(cust).reduce((a, x) => a + x.price, 0);
  const custRows   = Object.entries(cust).filter(x => x[1].count > 0)
    .map(x => [x[0], v57_fmt(x[1].count), v57_pct(x[1].count, totalCust), v57_fmt(x[1].price)]);
  custRows.push(['Total', v57_fmt(totalCust), '100.0%', v57_fmt(totalPrice)]);
  v57_table('v57CustomerSummary',
    ['Customer Type','Count Cases','% of Total Cases','Total Price'],
    custRows
  );

  v57_updatePresenceBadges();
}

/* ================================================================
   SECTION 9 — Boot
================================================================ */
function v57_boot() {
  if (document.getElementById('analysisPage')) {
    v57_fixHeader();
    if ((localStorage.getItem('serviceEyeActiveTab') || '') === 'analysis') {
      v57_buildShell();
      setTimeout(v57_render, 200);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => { setTimeout(v57_boot, 900); });
window.addEventListener('load', () => setTimeout(v57_boot, 1100));

/* Expose public API */
/* [dedup] superseded renderAnalysisDashboardV35 definition removed (was L5754) */
window.renderV57AnalysisDashboard  = v57_render;

})();


/* ===== v58-script ===== */

(function(){
'use strict';

/* ---- Colour palette for Branch Cash bars (one colour per branch) ---- */
const V58_COLORS = [
  '#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6',
  '#06B6D4','#F97316','#EC4899','#84CC16','#6366F1',
  '#14B8A6','#FB923C','#A855F7','#22C55E','#E11D48'
];

/* ---- Helpers (mirror v57 helpers) ---- */
const v58_$ = s => document.querySelector(s);
const v58_num  = v => { const x = Number(String(v||0).replace(/,/g,'').replace(/[^0-9.\-]/g,'')); return isFinite(x) ? x : 0; };
const v58_fmt  = v => Number(v||0).toLocaleString(undefined, { maximumFractionDigits: 2 });
const v58_dateVal = v => {
  if (!v) return null;
  if (v instanceof Date && !isNaN(v)) return v;
  if (typeof v === 'number') { const d = new Date(Math.round((v-25569)*86400*1000)); if (!isNaN(d)) return d; }
  const d = new Date(v); return isNaN(d) ? null : d;
};
const v58_monthKey   = v => { const d = v58_dateVal(v); return d ? d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0') : ''; };
const v58_monthLabel = k => { if (!k) return 'Blank'; const [y,m] = k.split('-'); return `${m}/${y}`; };

/* ---- Kill old global label plugins (same list as v57) ---- */
const V58_OLD_PLUGINS = [
  'v19Labels','v20SkyLabels','skyBarLabelErrorPlugin',
  'v21SingleChartValueLabels','serviceEyeV22LabelsOnly',
  'serviceEyeV24SingleLabels','serviceEyeV25Labels3D','serviceEyeV25Bar3D',
  'skyV43SingleLabels','v55BarValueLabels','v55AnalysisSingleValueLabels',
  'skyV40ValueLabels','skyV41ValueLabels','skyV42ValueLabels',
  'v56AnalysisValueLabels','v57LocalLabels'
];
function v58_killPlugins(){
  if (!window.Chart || !Chart.registry) return;
  V58_OLD_PLUGINS.forEach(id => { try{ const p=Chart.registry.plugins.get(id); if(p) Chart.unregister(p); }catch(e){} });
}
function v58_silenceMap(){ const m={}; V58_OLD_PLUGINS.forEach(id=>{ m[id]={display:false}; }); return m; }

/* Local label plugin — per-chart, never globally registered */
const v58LabelPlugin = {
  id: 'v58Labels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    ctx.save();
    ctx.font      = 'bold 11px Calibri, Arial, sans-serif';
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text') || '#111827';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'bottom';
    chart.data.datasets.forEach((ds, di) => {
      const meta = chart.getDatasetMeta(di);
      meta.data.forEach((bar, i) => {
        const val = Number(ds.data[i] || 0);
        if (!val) return;
        const p = bar.tooltipPosition ? bar.tooltipPosition() : { x: bar.x, y: bar.y };
        ctx.fillStyle = ds.labelColor || (getComputedStyle(document.body).getPropertyValue('--text') || '#111827');
        ctx.fillText(v58_fmt(val), p.x, Math.max(12, p.y - 5));
      });
    });
    ctx.restore();
  }
};

/* Draw a multi-color bar chart (one color per bar) */
function v58_drawMultiColorBar(id, labels, values, extraOptions = {}) {
  const canvas = document.getElementById(id);
  if (!canvas || typeof Chart === 'undefined') return;
  v58_killPlugins();
  window.dashboardCharts = window.dashboardCharts || {};
  if (window.dashboardCharts[id]) { window.dashboardCharts[id].destroy(); delete window.dashboardCharts[id]; }

  const colors = labels.map((_, i) => V58_COLORS[i % V58_COLORS.length]);

  window.dashboardCharts[id] = __safeNewChart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: extraOptions.label || 'Total Price',
        data: values,
        backgroundColor: colors,
        borderColor:     colors.map(c => c),
        borderWidth: 1
      }]
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      layout: { padding: { top: 28 } },
      plugins: {
        ...v58_silenceMap(),
        legend:   { display: false },
        tooltip:  {
          callbacks: {
            label: ctx => `${extraOptions.label || 'Total Price'}: ${v58_fmt(ctx.raw)}`
          }
        },
        subtitle: {
          display: !!extraOptions.subtitle,
          text:    extraOptions.subtitle || '',
          font:    { weight: 'bold' }
        }
      },
      scales: {
        y: { beginAtZero: true, suggestedMax: Math.max(1, ...values.map(Number)) * 1.18 },
        x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 0 } }
      }
    },
    plugins: [v58LabelPlugin]
  });
}

/* ---- Rebuild shell with new layout ---- */
function v58_buildShell() {
  const main = document.getElementById('analysisPage')?.querySelector('main');
  if (!main) return;
  // Replace entirely — v57 shell is overwritten
  main.innerHTML = `
<div class="v54-analysis-wrap">
  <div class="v54-note" id="v58Note">Upload or sync Analyses_Dashboard data, then use the filters below.</div>

  <div class="v54-filters">
    <div class="v54-filter"><label>Branches — multiple select</label><select id="v58Branch" multiple></select></div>
    <div class="v54-filter"><label>Brand</label><select id="v58Brand"></select></div>
    <div class="v54-filter"><label>Open Month / Year</label><select id="v58OpenMonth"></select></div>
    <div class="v54-filter"><label>Close Month / Year</label><select id="v58CloseMonth"></select></div>
    <div class="v54-actions">
      <button class="btn btn-primary" type="button" id="v58Apply">Apply</button>
      <button class="btn btn-light"   type="button" id="v58Clear">Clear</button>
    </div>
  </div>

  <div class="v54-cards" id="v58Cards"></div>

  <div class="v54-grid" style="grid-template-columns:1fr; margin-bottom:16px;">
    <div class="v54-panel">
      <h2>Branch Cash</h2>
      <div class="v58-bc-filter-row">
        <label>Closed Month / Year</label>
        <select id="v58BranchCashMonth"></select>
        <button class="btn btn-light" type="button" id="v58BranchCashClear">Clear Filter</button>
        <span class="v58-bc-total" id="v58BranchCashTotal" style="display:none"></span>
      </div>
      <div class="v58-chart-tall"><canvas id="v58BranchCashChart"></canvas></div>
    </div>
  </div>

  <div class="v54-grid" style="grid-template-columns:1fr; margin-bottom:16px;">
    <div class="v54-panel">
      <h2>Received vs Delivered per Branch</h2>
      <div class="v58-chart-tall"><canvas id="v58ReceivedDeliveredChart"></canvas></div>
    </div>
  </div>

  <div class="v58-grid">
    <div class="v54-panel">
      <h2>Status Summary</h2>
      <div class="v54-table-wrap"><table class="v54-table" id="v58StatusSummary"></table></div>
    </div>
    <div class="v54-panel">
      <h2>Top 10 Receiving Models</h2>
      <div class="v54-table-wrap"><table class="v54-table" id="v58TopModels"></table></div>
    </div>
  </div>

  <div class="v58-grid">
    <div class="v54-panel">
      <h2>Dealer vs End User</h2>
      <div class="v54-table-wrap"><table class="v54-table" id="v58CustomerSummary"></table></div>
    </div>
    <div class="v54-panel">
      <h2>Delivered / Open / Ready Summary</h2>
      <div class="v54-table-wrap queue-compact"><table class="v54-table" id="v58QueueSummary"></table></div>
    </div>
  </div>

  <div class="v58-grid">
    <div class="v54-panel">
      <h2 id="v58RepairTitle">Repaired vs Not Repaired</h2>
      <div class="v54-chart"><canvas id="v58RepairChart"></canvas></div>
    </div>
    <div class="v54-panel">
      <h2>Assigned_To: Repaired vs Not Repaired</h2>
      <div class="v54-table-wrap"><table class="v54-table" id="v58AssignedSummary"></table></div>
    </div>
  </div>
</div>`;

  /* Wire global filters */
  ['#v58Branch','#v58Brand','#v58OpenMonth','#v58CloseMonth','#v58BranchCashMonth'].forEach(id => {
    const el = v58_$(id); if (el) el.onchange = v58_render;
  });
  v58_$('#v58Apply').onclick = v58_render;
  v58_$('#v58Clear').onclick = () => {
    ['#v58Branch','#v58Brand','#v58OpenMonth','#v58CloseMonth'].forEach(id => {
      const el = v58_$(id); if (el) [...el.options].forEach((o, i) => o.selected = i === 0);
    });
    v58_render();
  };
  v58_$('#v58BranchCashClear').onclick = () => {
    const el = v58_$('#v58BranchCashMonth'); if (el) el.value = '';
    v58_render();
  };
}

/* ---- Filter helpers ---- */
function v58_rows()   { return Array.isArray(window.analysisRows) ? window.analysisRows : []; }
function v58_cols(d)  { return [...new Set(d.flatMap(r => Object.keys(r||{})))]; }
const v58_norm = s => String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function v58_exact(d,n){ const c=v58_cols(d); return c.find(x=>x===n)||c.find(x=>v58_norm(x)===v58_norm(n))||''; }
function v58_pick(d,names){ const c=v58_cols(d); for(const n of names){ const e=c.find(x=>v58_norm(x)===v58_norm(n)); if(e) return e; } for(const n of names){ const e=c.find(x=>v58_norm(x).includes(v58_norm(n))); if(e) return e; } return ''; }
function v58_fields(data){ return {
  branch:   v58_exact(data,'Branch'),
  brand:    v58_pick(data,['Brand']),
  open:     v58_pick(data,['Open_Date','Open Date','Receipt Date','Create Date','Created Date']),
  close:    v58_pick(data,['CloseDate','Close Date','Closed Date','Delivery Date','Delivered Date']),
  queue:    v58_pick(data,['Queue','Status Queue']),
  price:    v58_pick(data,['Price','Total Price','Amount','Value','Repair Price','Selling Price']),
  model:    v58_pick(data,['Model','Item English Name','Model Name','Product Model','Item Name']),
  repair:   v58_pick(data,['Repair Status','Repaired','Repair','Repair Result','Status']),
  status:   v58_pick(data,['Status','Case Status','Repair Status']),
  assigned: v58_pick(data,['Assigned_To','Assigned To','Assigned','Technician','Engineer']),
  customer: v58_pick(data,['Customer Type','Dealer End User','Dealer/End User','Dealer EndUser','Customer','Cust Type','End User'])
};}
function v58_uniq(d,f){ return [...new Set(d.map(r=>String(r[f]??'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b)); }
function v58_sel(id){ const el=v58_$(id); if(!el) return []; return [...el.options].filter(o=>o.selected&&o.value).map(o=>o.value); }
function v58_queueType(row,f){ const q=String(row[f.queue]??row.Queue??'').trim(); const l=q.toLowerCase(); if(q==='__REMOVED_QUEUE__'||l.includes('delivered')) return '__REMOVED_QUEUE__'; if(q==='Open_Cases'||q==='Open_Cases'||l.includes('open')) return 'Open_Cases'; if(q==='Ready For Delivery Cases'||l.includes('ready')) return 'Ready For Delivery Cases'; return q||'Blank'; }
function v58_repairType(row,f){ const t=String(row[f.repair]??row[f.status]??row[f.queue]??'').toLowerCase(); return /not repaired|not repair|unrepair|cancel|return|pending|open/.test(t) ? 'Not Repaired' : /repaired|repair|delivered|closed|ready|done|complete|fixed/.test(t) ? 'Repaired' : 'Not Repaired'; }
function v58_customerType(row,f){ const t=String(row[f.customer]??'').toLowerCase(); return t.includes('dealer') ? 'Dealer' : (t.includes('end')||t.includes('user')||t.includes('customer')) ? 'End User' : 'Blank'; }
const v58_priceOf = (arr,f) => arr.reduce((a,r)=>a+v58_num(r[f.price]),0);
const v58_pct = (a,b) => b ? ((Number(a||0)/Number(b||0))*100).toFixed(1)+'%' : '0.0%';
const v58_esc = v => String(v??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));

function v58_fillSingle(id, values, allLabel){
  const el=v58_$(id); if(!el) return;
  const keep=el.value||'';
  el.innerHTML=`<option value="">${v58_esc(allLabel)}</option>`+values.map(v=>`<option value="${v58_esc(v)}">${v58_esc(v)}</option>`).join('');
  el.value=[...el.options].some(o=>o.value===keep)?keep:'';
}
function v58_fillFilters(data,f){
  const keepB=v58_sel('#v58Branch');
  const b=v58_$('#v58Branch');
  if(b){
    b.innerHTML='<option value="">All Branches</option>'+(f.branch?v58_uniq(data,f.branch):[]).map(v=>`<option value="${v58_esc(v)}">${v58_esc(v)}</option>`).join('');
    if(keepB.length) [...b.options].forEach(o=>o.selected=keepB.includes(o.value));
    else if(b.options[0]) b.options[0].selected=true;
  }
  v58_fillSingle('#v58Brand', f.brand?v58_uniq(data,f.brand):[], 'All Brands');
  const openM  = f.open  ? [...new Set(data.map(r=>v58_monthKey(r[f.open])).filter(Boolean))].sort() : [];
  const closeM = f.close ? [...new Set(data.map(r=>v58_monthKey(r[f.close])).filter(Boolean))].sort() : [];
  const keepO=v58_$('#v58OpenMonth')?.value||'', keepC=v58_$('#v58CloseMonth')?.value||'', keepBC=v58_$('#v58BranchCashMonth')?.value||'';
  const oEl=v58_$('#v58OpenMonth');
  if(oEl){ oEl.innerHTML='<option value="">All Open Months</option>'+openM.map(k=>`<option value="${k}">${v58_monthLabel(k)}</option>`).join(''); oEl.value=keepO; }
  const cEl=v58_$('#v58CloseMonth');
  if(cEl){ cEl.innerHTML='<option value="">All Close Months</option>'+closeM.map(k=>`<option value="${k}">${v58_monthLabel(k)}</option>`).join(''); cEl.value=keepC; }
  const bcEl=v58_$('#v58BranchCashMonth');
  if(bcEl){ bcEl.innerHTML='<option value="">All Closed Months</option>'+closeM.map(k=>`<option value="${k}">${v58_monthLabel(k)}</option>`).join(''); bcEl.value=keepBC; }
}
function v58_filtered(data,f){
  const branches=v58_sel('#v58Branch');
  const brand=v58_$('#v58Brand')?.value||'';
  const om=v58_$('#v58OpenMonth')?.value||'';
  const cm=v58_$('#v58CloseMonth')?.value||'';
  return data.filter(r=>
    (!branches.length||!f.branch||branches.includes(String(r[f.branch]??'').trim()))&&
    (!brand||!f.brand||String(r[f.brand]??'').trim()===brand)&&
    (!om||!f.open||v58_monthKey(r[f.open])===om)&&
    (!cm||!f.close||v58_monthKey(r[f.close])===cm)
  );
}

function v58_table(id, headers, body){
  const el=document.getElementById(id); if(!el) return;
  el.innerHTML='<thead><tr>'+headers.map(h=>`<th>${v58_esc(h)}</th>`).join('')+'</tr></thead>'
    +'<tbody>'+body.map(r=>'<tr>'+r.map(c=>`<td>${v58_esc(c)}</td>`).join('')+'</tr>').join('')+'</tbody>';
}

function v58_exportRows(name, arr){
  if(!arr.length){ alert('No data to export for: '+name); return; }
  const headers=Object.keys(arr[0]||{});
  const cell=v=>{ const s=String(v??''); return s.includes(',')||s.includes('"')||s.includes('\n') ? '"'+s.replace(/"/g,'""')+'"' : s; };
  const csv=[headers.join(',')].concat(arr.map(r=>headers.map(h=>cell(r[h])).join(','))).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name.replace(/[^a-z0-9_\-]+/gi,'_')+'.csv';
  document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },500);
}

/* ---- Draw standard v57-style bar (for Repaired / ReceivedDelivered) ---- */
function v58_drawBar(id, labels, datasets, extraOptions={}) {
  const canvas=document.getElementById(id); if(!canvas||typeof Chart==='undefined') return;
  v58_killPlugins();
  window.dashboardCharts=window.dashboardCharts||{};
  if(window.dashboardCharts[id]){ window.dashboardCharts[id].destroy(); delete window.dashboardCharts[id]; }
  window.dashboardCharts[id]=__safeNewChart(canvas,{
    type:'bar',
    data:{ labels, datasets: datasets.map(ds=>({ label:ds.label, data:ds.data, borderWidth:1 })) },
    options:{
      responsive:true, maintainAspectRatio:false, layout:{padding:{top:24}},
      plugins:{
        ...v58_silenceMap(),
        legend:{ display: datasets.length>1 },
        tooltip:{ mode:'index', intersect:false },
        subtitle:{ display:!!extraOptions.subtitle, text:extraOptions.subtitle||'', font:{weight:'bold'} }
      },
      scales:{
        y:{ beginAtZero:true, suggestedMax:Math.max(1,...datasets.flatMap(ds=>ds.data.map(Number)))*1.18 },
        x:{ ticks:{ autoSkip:false, maxRotation:45, minRotation:0 } }
      }
    },
    plugins:[v58LabelPlugin]
  });
}

/* ---- Main render ---- */
function v58_render() {
  if (!document.querySelector('#analysisPage main') || !v58_$('#v58Cards')) v58_buildShell();

  const all  = v58_rows();
  const f    = v58_fields(all);
  v58_fillFilters(all, f);
  const data = v58_filtered(all, f);

  const note = v58_$('#v58Note');
  if(note) note.textContent = all.length
    ? `Analysis rows: ${v58_fmt(data.length)} filtered from ${v58_fmt(all.length)} total. Cards are clickable to export as CSV.`
    : 'No Analyses_Dashboard data loaded yet. Please upload or sync.';

  /* Subsets */
  const delivered = data.filter(r => v58_queueType(r,f)==='__REMOVED_QUEUE__');
  const open      = data.filter(r => v58_queueType(r,f)==='Open_Cases');
  const ready     = data.filter(r => v58_queueType(r,f)==='Ready For Delivery Cases');
  const samsung   = data.filter(r => String(r[f.brand]??'').trim().toLowerCase()==='samsung');
  const apple     = data.filter(r => String(r[f.brand]??'').trim().toLowerCase()==='apple');
  const cardRows  = { delivered, open, ready, samsung, apple };

  /* Summary cards */
  const cardDefs = [
    ['Delivered Cases',          delivered, 'delivered'],
    ['Open Cases',               open,      'open'],
    ['Ready For Delivery Cases', ready,     'ready'],
    ['Samsung Cases',            samsung,   'samsung'],
    ['Apple Cases',              apple,     'apple']
  ];
  v58_$('#v58Cards').innerHTML = cardDefs.map(([title,arr,key]) => `
    <div class="v54-card" data-key="${key}" title="Click to export ${v58_esc(title)} as CSV" style="cursor:pointer">
      <div class="k">${v58_esc(title)}</div>
      <div class="v">${v58_fmt(arr.length)}</div>
      <div class="s">Total Price: ${v58_fmt(v58_priceOf(arr,f))}</div>
    </div>`).join('');
  document.querySelectorAll('#v58Cards .v54-card').forEach(c=>{
    c.onclick=()=>v58_exportRows(c.querySelector('.k').textContent, cardRows[c.dataset.key]||[]);
  });

  /* =====================================================================
     ROW 1 — Branch Cash (full width, multi-color, month-total badge)
  ===================================================================== */
  const bcMonth = v58_$('#v58BranchCashMonth')?.value || '';
  const bcRows  = delivered.filter(r => !bcMonth || !f.close || v58_monthKey(r[f.close]) === bcMonth);

  /* Accumulate per branch */
  const bc = {};
  bcRows.forEach(r => {
    const b = String((f.branch ? r[f.branch] : '') || 'Blank').trim();
    bc[b] = (bc[b] || 0) + v58_num(r[f.price]);
  });
  const bcEnt = Object.entries(bc).sort((a,b) => b[1]-a[1]).slice(0,15);

  /* Show / hide month total badge */
  const totalBadge = v58_$('#v58BranchCashTotal');
  if (totalBadge) {
    const grandTotal = bcEnt.reduce((s,x)=>s+x[1], 0);
    if (bcMonth && grandTotal > 0) {
      totalBadge.textContent = `Total: ${v58_fmt(grandTotal)}`;
      totalBadge.style.display = 'inline-block';
    } else {
      totalBadge.style.display = 'none';
    }
  }

  /* Draw multi-color chart */
  v58_drawMultiColorBar(
    'v58BranchCashChart',
    bcEnt.map(x => x[0]),
    bcEnt.map(x => x[1]),
    { label: 'Delivered Total Price', subtitle: bcMonth ? `Month: ${v58_monthLabel(bcMonth)}` : '' }
  );

  /* =====================================================================
     ROW 2 — Received vs Delivered per Branch (full width)
  ===================================================================== */
  const branchMap = {};
  data.forEach(r => {
    const b = String((f.branch ? r[f.branch] : '') || 'Blank').trim();
    branchMap[b] = branchMap[b] || { received:0, delivered:0 };
    branchMap[b].received++;
    if(v58_queueType(r,f)==='__REMOVED_QUEUE__') branchMap[b].delivered++;
  });
  const br = Object.entries(branchMap).sort((a,b)=>b[1].received-a[1].received).slice(0,15);
  v58_drawBar('v58ReceivedDeliveredChart',
    br.map(x=>x[0]),
    [
      { label:'Received Cases',  data: br.map(x=>x[1].received)  },
      { label:'Delivered Cases', data: br.map(x=>x[1].delivered) }
    ]
  );

  /* =====================================================================
     ROW 3 — Status Summary | Top 10 Receiving Models
  ===================================================================== */
  const statusMap = {};
  data.forEach(r => {
    const s = String(r[f.status] || v58_queueType(r,f) || 'Blank');
    statusMap[s] = statusMap[s] || { c:0, p:0 };
    statusMap[s].c++;
    statusMap[s].p += v58_num(r[f.price]);
  });
  v58_table('v58StatusSummary',
    ['Status','Count of Cases','Total Price'],
    Object.entries(statusMap).sort((a,b)=>b[1].c-a[1].c).map(x=>[x[0], v58_fmt(x[1].c), v58_fmt(x[1].p)])
  );

  const models = {};
  data.forEach(r => { const m=String(r[f.model]||'Blank'); models[m]=(models[m]||0)+1; });
  v58_table('v58TopModels',
    ['Rank','Model','Receiving Cases','% of Total'],
    Object.entries(models).sort((a,b)=>b[1]-a[1]).slice(0,10).map((x,i)=>[i+1, x[0], v58_fmt(x[1]), v58_pct(x[1],data.length)])
  );

  /* =====================================================================
     ROW 4 — Dealer vs End User | Delivered / Open / Ready Summary
  ===================================================================== */
  const cust = { Dealer:{count:0,price:0}, 'End User':{count:0,price:0}, Blank:{count:0,price:0} };
  data.forEach(r => {
    const k=v58_customerType(r,f);
    cust[k]=cust[k]||{count:0,price:0};
    cust[k].count++; cust[k].price+=v58_num(r[f.price]);
  });
  const totalCust  = Object.values(cust).reduce((a,x)=>a+x.count, 0);
  const totalCustP = Object.values(cust).reduce((a,x)=>a+x.price, 0);
  const custRows   = Object.entries(cust).filter(x=>x[1].count>0)
    .map(x=>[x[0], v58_fmt(x[1].count), v58_pct(x[1].count,totalCust), v58_fmt(x[1].price)]);
  custRows.push(['Total', v58_fmt(totalCust), '100.0%', v58_fmt(totalCustP)]);
  v58_table('v58CustomerSummary',
    ['Customer Type','Count Cases','% of Total Cases','Total Price'],
    custRows
  );

  v58_table('v58QueueSummary',
    ['Queue','Count of Cases','Total Price'],
    [
      ['Delivered Cases',    v58_fmt(delivered.length), v58_fmt(v58_priceOf(delivered,f))],
      ['Open Cases',         v58_fmt(open.length),      v58_fmt(v58_priceOf(open,f))],
      ['Ready For Delivery', v58_fmt(ready.length),     v58_fmt(v58_priceOf(ready,f))]
    ]
  );

  /* =====================================================================
     ROW 5 — Repaired vs Not Repaired | Assigned_To
  ===================================================================== */
  const rep = { Repaired:0, 'Not Repaired':0 };
  data.forEach(r => rep[v58_repairType(r,f)]++);
  const totalRep = rep.Repaired + rep['Not Repaired'];
  const diffPct  = v58_pct(Math.abs(rep.Repaired - rep['Not Repaired']), totalRep);
  const rt = v58_$('#v58RepairTitle');
  if(rt) rt.textContent = `Repaired vs Not Repaired — Difference ${diffPct}`;
  v58_drawBar('v58RepairChart',
    ['Repaired','Not Repaired'],
    [{ label:'Cases', data:[rep.Repaired, rep['Not Repaired']] }],
    { subtitle: `Percentage difference: ${diffPct}` }
  );

  const assignedMap = {};
  data.forEach(r => {
    const a=String(r[f.assigned]||'Blank');
    assignedMap[a]=assignedMap[a]||{repaired:0,not:0};
    if(v58_repairType(r,f)==='Repaired') assignedMap[a].repaired++; else assignedMap[a].not++;
  });
  v58_table('v58AssignedSummary',
    ['Assigned_To','Not Repaired','Repaired','% Difference'],
    Object.entries(assignedMap)
      .sort((a,b)=>(b[1].not+b[1].repaired)-(a[1].not+a[1].repaired))
      .map(x=>{ const t=x[1].not+x[1].repaired; return [x[0], v58_fmt(x[1].not), v58_fmt(x[1].repaired), v58_pct(Math.abs(x[1].repaired-x[1].not),t)]; })
  );

  /* Presence badges (if v57 function available) */
  if (typeof v57_updatePresenceBadges === 'function') v57_updatePresenceBadges();
}

/* ---- Boot: override v57's renderAnalysisDashboardV35 to use v58 ---- */
function v58_boot() {
  if (document.getElementById('analysisPage')) {
    if (typeof v57_fixHeader === 'function') v57_fixHeader();
    v58_buildShell();
    if ((localStorage.getItem('serviceEyeActiveTab')||'') === 'analysis') {
      setTimeout(v58_render, 200);
    }
  }
}

/* Override public render entry point so switchTab calls v58 */
window.renderAnalysisDashboardV35 = () => {
  if (typeof v57_fixHeader === 'function') v57_fixHeader();
  v58_buildShell();
  v58_render();
};
window.renderV58AnalysisDashboard = v58_render;

/* Patch v57 switchTab to call v58_render instead of v57_render for analysis tab */
if (window._v57_origSwitch !== undefined) {
  const _base = window.switchTab;
}

document.addEventListener('DOMContentLoaded', () => { setTimeout(v58_boot, 950); });
window.addEventListener('load', () => setTimeout(v58_boot, 1200));

})();


/* ===== v58-presence-badge-lock ===== */

(function(){
  'use strict';
  const KEY = 'serviceEyeOnlineTabs_v58';
  const EXPIRE = 15000;
  const ID = sessionStorage.getItem('serviceEyeTabId_v58') || ('tab_' + Math.random().toString(36).slice(2));
  sessionStorage.setItem('serviceEyeTabId_v58', ID);

  function normalizeTab(tab){
    tab = String(tab || '').toLowerCase();
    if (tab === 'sky') return 'sky';
    if (tab === 'profit' || tab.includes('profit')) return 'profit';
    if (tab === 'analysis' || tab === 'analyses') return 'analysis';
    return 'gspn';
  }

  function currentTab(){
    return normalizeTab(localStorage.getItem('serviceEyeActiveTab') || 'gspn');
  }

  function readStore(){
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
    catch(e){ return {}; }
  }

  function writeStore(store){
    try { localStorage.setItem(KEY, JSON.stringify(store)); } catch(e) {}
  }

  function getCounts(){
    const now = Date.now();
    const store = readStore();
    const counts = { gspn:0, sky:0, analysis:0 };
    Object.keys(store).forEach(id => {
      const item = store[id];
      if (!item || now - Number(item.ts || 0) > EXPIRE) return;
      const tab = normalizeTab(item.tab);
      counts[tab]++;
    });
    return counts;
  }

  function updatePresenceBadges(){
    const counts = getCounts();
    document.querySelectorAll('.side-tab').forEach(tab => {
      const txt = (tab.textContent || '').toLowerCase();
      const key = txt.includes('gspn') ? 'gspn' :
                  (txt.includes('sky') && !txt.includes('analyses')) ? 'sky' :
                  txt.includes('analyses') ? 'analysis' : '';
      if (!key) return;
      let badge = tab.querySelector('.tab-count-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'tab-count-badge';
        tab.appendChild(badge);
      }
      const n = counts[key] || 0;
      badge.textContent = String(n);
      badge.title = n + ' connected user' + (n === 1 ? '' : 's');
    });
  }

  function heartbeat(){
    const now = Date.now();
    const store = readStore();
    Object.keys(store).forEach(id => {
      if (now - Number(store[id]?.ts || 0) > EXPIRE) delete store[id];
    });
    store[ID] = { tab: currentTab(), ts: now };
    writeStore(store);
    updatePresenceBadges();
  }

  // Make every old call update the connected-user badge only, never row counts.
  /* [dedup] superseded v58_updatePresenceBadges definition removed (was L6354) */
  /* [dedup] superseded updateTabCounts definition removed (was L6355) */

  const oldSwitchTab = window.switchTab;
  if (typeof oldSwitchTab === 'function' && !oldSwitchTab.__v58PresencePatched) {
    const patched = function(tab){
      const result = oldSwitchTab.apply(this, arguments);
      setTimeout(heartbeat, 80);
      setTimeout(updatePresenceBadges, 250);
      return result;
    };
    patched.__v58PresencePatched = true;
  }

  window.addEventListener('storage', updatePresenceBadges);
  window.addEventListener('beforeunload', function(){
    const store = readStore();
    delete store[ID];
    writeStore(store);
  });

  heartbeat();
  setTimeout(heartbeat, 500);
  setTimeout(updatePresenceBadges, 1500);
})();


/* ===== v62-requested-updates-script ===== */

(function(){
  'use strict';

  function byId(id){ return document.getElementById(id); }

  function convertToDropdown(id, labelText){
    const el = byId(id);
    if (!el) return;
    el.multiple = false;
    el.removeAttribute('multiple');
    el.size = 0;
    el.style.minHeight = '';
    const box = el.closest('.v54-filter') || el.closest('#jobTypeFilterBox') || el.parentElement;
    const label = box ? (box.querySelector('label') || box.querySelector('.filter-label')) : null;
    if (label && labelText) label.textContent = labelText;
    const opts = Array.from(el.options);
    const selectedReal = opts.find(o => o.selected && o.value && o.value !== '__ALL__') || opts[0];
    opts.forEach(o => o.selected = false);
    if (selectedReal) selectedReal.selected = true;
  }

  function applyDropdownUpdates(){
    /* jobTypeFilter must remain a multi-select to match the other GSPN
       filters (Branches, Technicians, GSPN Warranty, KPI Alerts).
       Only ensure its label says "GSPN JobType - multiple select". */
    const jt = byId('jobTypeFilter');
    if (jt) {
      jt.multiple = true;
      jt.setAttribute('multiple', 'multiple');
      const box = jt.closest('#jobTypeFilterBox') || jt.parentElement;
      const label = box ? (box.querySelector('label') || box.querySelector('.filter-label')) : null;
      if (label) label.textContent = 'GSPN JobType - multiple select';
    }
    convertToDropdown('v57Branch', 'Branches');
    const legacyBranch = byId('v54Branch');
    if (legacyBranch) convertToDropdown('v54Branch', 'Branches');
  }

  function addMidnightBlackColor(){
    const options = byId('v25ColorOptions');
    if (options && !options.querySelector('[data-color="black"]')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'color-dot black';
      btn.dataset.color = 'black';
      btn.title = 'Midnight Black';
      btn.onclick = function(){ window.setPageColor && window.setPageColor('black'); };
      options.appendChild(btn);
    }
  }

  function patchPageColorFunction(){
    if (!window.setPageColor || window.setPageColor.__v62Black) return;
    const original = window.setPageColor;
    window.setPageColor = function(color){
      if (color === 'black') {
        const skyPage = byId('skyPage');
        const tab = skyPage && skyPage.style.display !== 'none' ? 'sky' : 'gspn';
        localStorage.setItem('serviceEyeColor_' + tab, 'black');
        document.body.classList.remove('color-blue','color-green','color-orange','color-purple','color-black');
        document.body.classList.add('color-black');
        document.querySelectorAll('.color-dot').forEach(b => b.classList.toggle('active', b.dataset.color === 'black'));
        setTimeout(function(){
          if (tab === 'sky' && typeof window.renderSky === 'function') window.renderSky();
          if (tab === 'gspn' && typeof window.render === 'function') window.render();
          if (typeof window.v57_render === 'function') window.v57_render();
        }, 30);
        return;
      }
      return original.apply(this, arguments);
    };
    window.setPageColor.__v62Black = true;
  }

  function applySavedMidnightBlack(){
    const skyPage = byId('skyPage');
    const tab = skyPage && skyPage.style.display !== 'none' ? 'sky' : 'gspn';
    if (localStorage.getItem('serviceEyeColor_' + tab) === 'black') {
      document.body.classList.remove('color-blue','color-green','color-orange','color-purple','color-black');
      document.body.classList.add('color-black');
      document.querySelectorAll('.color-dot').forEach(b => b.classList.toggle('active', b.dataset.color === 'black'));
    }
  }

  function run(){
    patchPageColorFunction();
    addMidnightBlackColor();
    applyDropdownUpdates();
    applySavedMidnightBlack();
  }

  const runSoon = function(){ requestAnimationFrame(run); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runSoon); else runSoon();

  // Re-apply after dashboard renders rebuild filters.
  const originalRender = window.render;
  if (typeof originalRender === 'function' && !originalRender.__v62Dropdowns) {
    window.render = function(){ const r = originalRender.apply(this, arguments); requestAnimationFrame(run); return r; };
    window.render.__v62Dropdowns = true;
  }
  const originalV57 = window.v57_render;
  if (typeof originalV57 === 'function' && !originalV57.__v62Dropdowns) {
    window.v57_render = function(){ const r = originalV57.apply(this, arguments); requestAnimationFrame(run); return r; };
    window.v57_render.__v62Dropdowns = true;
  }
  const originalSwitchTab = window.switchTab;
  if (typeof originalSwitchTab === 'function' && !originalSwitchTab.__v62Black) {
    window.switchTab.__v62Black = true;
  }
})();


/* ===== v61-requested-updates-script ===== */

(function(){
  'use strict';

  const ALL = (typeof ALL_VALUE !== 'undefined') ? ALL_VALUE : '__ALL__';
  function byId(id){ return document.getElementById(id); }
  function esc(v){ return String(v ?? '').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }
  function cleanText(v){ return String(v ?? '').trim(); }
  function uniqueSorted(arr){ return [...new Set(arr.map(cleanText).filter(Boolean))].sort((a,b)=>a.localeCompare(b)); }
  function selectedValues(id){ const el=byId(id); if(!el) return []; const vals=[...el.selectedOptions].map(o=>o.value); return (!vals.length || vals.includes(ALL)) ? [] : vals; }

  /* 1) GSPN Tracking Cases: add GSPN JobType filter */
  function ensureGspnJobTypeFilter(){
    if (byId('jobTypeFilter')) return;
    const filters = document.querySelector('#gspnPage .filters');
    if (!filters) return;
    const box = document.createElement('div');
    box.id = 'jobTypeFilterBox';
    box.innerHTML = '<div class="filter-label">GSPN JobType</div><select id="jobTypeFilter"></select>';
    const warrantyBox = byId('warrantyFilter')?.closest('div');
    if (warrantyBox) warrantyBox.insertAdjacentElement('afterend', box); else filters.appendChild(box);
    byId('jobTypeFilter').addEventListener('change', function(){
      if (typeof onMultiFilterChange === 'function') onMultiFilterChange('jobTypeFilter');
      else if (typeof render === 'function') render();
    });
  }

  function fillJobTypeFilter(){
    const el = byId('jobTypeFilter');
    if (!el) return;
    const selected = selectedValues('jobTypeFilter');
    let rows = [];
    try { rows = Array.isArray(allRows) ? allRows : []; } catch(e) { rows = []; }
    const safeSelected = selected.length ? selected : [ALL];
    el.innerHTML = [`<option value="${ALL}" ${safeSelected.includes(ALL)?'selected':''}>All GSPN JobType</option>`]
      .concat(uniqueSorted(rows.map(r => r['GSPN JobType'] || r.JobType || r['Job Type'])).map(v => `<option value="${esc(v)}" ${safeSelected.includes(v) && !safeSelected.includes(ALL) ? 'selected' : ''}>${esc(v)}</option>`)).join('');
  }

  if (typeof window.refreshFilterLists === 'function' && !window.refreshFilterLists.__v61JobType){
    const originalRefresh = window.refreshFilterLists;
    window.refreshFilterLists = function(){
      ensureGspnJobTypeFilter();
      const result = originalRefresh.apply(this, arguments);
      fillJobTypeFilter();
      return result;
    };
    window.refreshFilterLists.__v61JobType = true;
  }

  if (typeof window.getFilteredRows === 'function' && !window.getFilteredRows.__v61JobType){
    const originalGet = window.getFilteredRows;
    window.getFilteredRows = function(){
      const rows = originalGet.apply(this, arguments) || [];
      const jobs = selectedValues('jobTypeFilter');
      if (!jobs.length) return rows;
      return rows.filter(r => jobs.includes(cleanText(r['GSPN JobType'] || r.JobType || r['Job Type'])));
    };
    window.getFilteredRows.__v61JobType = true;
  }

  if (typeof window.resetFiltersToAll === 'function' && !window.resetFiltersToAll.__v61JobType){
    const originalReset = window.resetFiltersToAll;
    window.resetFiltersToAll = function(){
      const result = originalReset.apply(this, arguments);
      const el = byId('jobTypeFilter');
      if (el) [...el.options].forEach(o => o.selected = o.value === ALL);
      return result;
    };
    window.resetFiltersToAll.__v61JobType = true;
  }

  /* 2) Correct record count: use real in-memory arrays, not window properties only */
  /* [dedup] orphan helper realCount removed */
  /* [dedup] orphan helper lastSyncText removed */
  /* [dedup] orphan helper baseSyncText removed */
  /* [dedup] orphan helper ensureSyncEl removed */
  /* [dedup] orphan helper updateSyncStatuses removed */

  /* 3) Make all current and future tables sortable by clicking the column header */
  function cellValue(row, idx){ return cleanText(row.cells[idx]?.textContent || ''); }
  function asNumber(v){ const n = Number(String(v).replace(/[%،]/g,'').trim()); return isNaN(n) ? null : n; }

  /* Date-aware sorting fix: sort date columns by real date value, not text order. */
  function normalizeDateCellValue(v){
    return String(v || '')
      .replace(/[\u200e\u200f\u202a-\u202e]/g, '')
      .replace(/ /g, ' ')
      .trim();
  }
  function parseSortableDate(v){
    v = normalizeDateCellValue(v);
    if (!v || /^(-|—|n\/a|na|null|blank)$/i.test(v)) return null;

    const monthNames = {
      jan:0,january:0,feb:1,february:1,mar:2,march:2,apr:3,april:3,may:4,jun:5,june:5,
      jul:6,july:6,aug:7,august:7,sep:8,sept:8,september:8,oct:9,october:9,nov:10,november:10,dec:11,december:11
    };
    const mon = Object.keys(monthNames).join('|');
    let m;

    // Excel serial date support, including decimals with time.
    if (/^\d{5}(?:\.\d+)?$/.test(v)) {
      const serial = Number(v);
      if (serial > 20000 && serial < 80000) return Math.round((serial - 25569) * 86400000);
    }

    // dd/mm/yyyy, mm/dd/yyyy, dd-mm-yy, yyyy/mm/dd, with optional time.
    m = v.match(/^(\d{1,4})[\/\-.](\d{1,2})[\/\-.](\d{1,4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$/i);
    if (m) {
      let a = Number(m[1]), b = Number(m[2]), c = Number(m[3]);
      let y, mo, d;
      if (String(m[1]).length === 4) { y = a; mo = b; d = c; }
      else {
        y = c < 100 ? 2000 + c : c;
        // Dashboard data normally uses day/month/year. If the first value is <=12 and second >12, treat it as mm/dd/yyyy.
        if (a > 12) { d = a; mo = b; }
        else if (b > 12) { mo = a; d = b; }
        else { d = a; mo = b; }
      }
      let hh = Number(m[4] || 0), mi = Number(m[5] || 0), ss = Number(m[6] || 0);
      const ap = (m[7] || '').toUpperCase();
      if (ap === 'PM' && hh < 12) hh += 12;
      if (ap === 'AM' && hh === 12) hh = 0;
      const dt = new Date(y, mo - 1, d, hh, mi, ss);
      if (dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d) return dt.getTime();
      return null;
    }

    // dd-MMM-yyyy / MMM dd yyyy, with optional time.
    m = v.match(new RegExp('^(\d{1,2})[-\s](' + mon + ')[-\s]+(\d{2,4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$', 'i'));
    if (m) {
      const d = Number(m[1]), mo = monthNames[m[2].toLowerCase()], y = Number(m[3]) < 100 ? 2000 + Number(m[3]) : Number(m[3]);
      let hh = Number(m[4] || 0), mi = Number(m[5] || 0), ss = Number(m[6] || 0);
      const ap = (m[7] || '').toUpperCase();
      if (ap === 'PM' && hh < 12) hh += 12;
      if (ap === 'AM' && hh === 12) hh = 0;
      return new Date(y, mo, d, hh, mi, ss).getTime();
    }
    m = v.match(new RegExp('^(' + mon + ')[-\s]+(\d{1,2})(?:,)?[-\s]+(\d{2,4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$', 'i'));
    if (m) {
      const mo = monthNames[m[1].toLowerCase()], d = Number(m[2]), y = Number(m[3]) < 100 ? 2000 + Number(m[3]) : Number(m[3]);
      let hh = Number(m[4] || 0), mi = Number(m[5] || 0), ss = Number(m[6] || 0);
      const ap = (m[7] || '').toUpperCase();
      if (ap === 'PM' && hh < 12) hh += 12;
      if (ap === 'AM' && hh === 12) hh = 0;
      return new Date(y, mo, d, hh, mi, ss).getTime();
    }

    const native = Date.parse(v);
    return Number.isNaN(native) ? null : native;
  }
  function headerLooksLikeDate(th){
    const h = cleanText(th?.textContent || '').toLowerCase();
    return /date|time|created|closed|open|receive|received|delivery|delivered|repair|assign|assigned|update|updated|target|due|aging/.test(h);
  }
  function compareSortableValues(av, bv, th){
    const ad = parseSortableDate(av), bd = parseSortableDate(bv);
    if ((ad !== null || bd !== null) && (headerLooksLikeDate(th) || (ad !== null && bd !== null))) {
      if (ad === null) return 1;
      if (bd === null) return -1;
      return ad - bd;
    }
    const an = asNumber(av), bn = asNumber(bv);
    if (an !== null && bn !== null) return an - bn;
    return av.localeCompare(bv, undefined, {numeric:true, sensitivity:'base'});
  }
  function sortTable(th){
    const table = th.closest('table'); if (!table) return;
    const tbody = table.tBodies[0]; if (!tbody) return;
    const idx = [...th.parentNode.children].indexOf(th);
    const nextAsc = th.dataset.sortDir !== 'asc';
    [...th.parentNode.children].forEach(h => { h.classList.remove('sort-asc','sort-desc'); delete h.dataset.sortDir; });
    th.dataset.sortDir = nextAsc ? 'asc' : 'desc';
    th.classList.add(nextAsc ? 'sort-asc' : 'sort-desc');
    const rows = [...tbody.rows];
    rows.sort((ra, rb) => {
      const av = cellValue(ra, idx), bv = cellValue(rb, idx);
      const cmp = compareSortableValues(av, bv, th);
      return nextAsc ? cmp : -cmp;
    });
    rows.forEach(r => tbody.appendChild(r));
  }
  function markSortableTables(){
    document.querySelectorAll('table thead th').forEach(th => th.classList.add('sortable-header'));
  }
  document.addEventListener('click', e => { const th = e.target.closest('table thead th'); if (th) sortTable(th); });

  /* 4) Connected users: refresh badges and keep them as presence counts */
  function refreshPresence(){
    try { if (typeof window.v58_updatePresenceBadges === 'function') window.v58_updatePresenceBadges(); }
    catch(e) {}
    try { if (typeof window.v57_updatePresenceBadges === 'function') window.v57_updatePresenceBadges(); }
    catch(e) {}
  }

  function bootV61(){
    ensureGspnJobTypeFilter();
    fillJobTypeFilter();
    markSortableTables();
    refreshPresence();
  }
  document.addEventListener('DOMContentLoaded', () => setTimeout(bootV61, 700));
  window.addEventListener('load', () => setTimeout(bootV61, 900));
  (window._ivals=window._ivals||[]).push(setInterval(() => { markSortableTables(); refreshPresence(); }, 30000));
})();


/* ===== v65-definitive-fix-script ===== */

(function(){
'use strict';

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const ALL   = (typeof ALL_VALUE !== 'undefined') ? ALL_VALUE : '__ALL__';
const byId  = id => document.getElementById(id);
const esc   = v  => String(v ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));
const norm  = s  => String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const uniq  = a  => [...new Set((a||[]).map(v=>String(v??'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));

let openPanel = null;
function closeAll(){ if(openPanel){ openPanel.classList.remove('open'); openPanel=null; } document.querySelectorAll('.v65-panel.open').forEach(p=>p.classList.remove('open')); }
document.addEventListener('click', closeAll);
window.addEventListener('resize', closeAll, {passive:true});
window.addEventListener('scroll', closeAll, {passive:true});

/* ─────────────────────────────────────────────
   BUILD ONE V65 DROPDOWN
   selectId   – id of the hidden <select>
   multiple   – true/false
   allLabel   – text for "select all" option
   onOK       – callback after OK pressed
───────────────────────────────────────────── */
function buildV65(selectId, multiple, allLabel, onOK){
  const select = byId(selectId);
  if(!select) return;
  select.style.display = 'none';

  /* Hide every previous generation's widgets for this selectId */
  ['_v63wrap','_v64wrap','_excel','_v46','_v47','_v48','_v49','_v43'].forEach(sfx=>{
    const el = byId(selectId+sfx); if(el){ el.style.display='none'; el.style.visibility='hidden'; el.style.pointerEvents='none'; }
  });
  ['_v63panel','_v64panel','_excel_panel_v22'].forEach(sfx=>{
    const el = byId(selectId+sfx); if(el){ el.style.display='none !important'; el.remove(); }
  });

  const wrapId = selectId+'_v65wrap';
  let wrap = byId(wrapId);
  if(!wrap){
    wrap = document.createElement('div');
    wrap.id = wrapId;
    wrap.className = 'v65-wrap';
    select.insertAdjacentElement('afterend', wrap);
  }
  wrap.style.cssText = '';

  const btn = wrap.querySelector('.v65-btn') || document.createElement('button');
  btn.type = 'button'; btn.className = 'v65-btn';
  if(!btn.parentElement) wrap.appendChild(btn);

  const panelId = selectId+'_v65panel';
  let panel = byId(panelId);
  if(!panel){
    panel = document.createElement('div');
    panel.id = panelId;
    panel.className = 'v65-panel';
    document.body.appendChild(panel);
  }

  function getSelected(){
    return [...select.options].filter(o=>o.selected && o.value && o.value!==ALL).map(o=>o.value);
  }
  function isAllSelected(){
    const real = getSelected();
    return !real.length || [...select.options].some(o=>o.value===ALL && o.selected);
  }
  function updateBtn(){
    const real = getSelected();
    if(!real.length || isAllSelected()) btn.textContent = allLabel;
    else if(real.length>2) btn.textContent = real.length+' selected';
    else btn.textContent = real.map(v=>{ const o=[...select.options].find(x=>x.value===v); return o?o.textContent:v; }).join(', ');
    btn.title = btn.textContent;
  }

  function placePanel(){
    const r = btn.getBoundingClientRect();
    const w = Math.min(Math.max(r.width, 300), window.innerWidth-24, 380);
    let left = Math.min(Math.max(12, r.left), window.innerWidth-w-12);
    let top  = r.bottom + 6;
    const maxH = Math.min(400, window.innerHeight-24);
    if(top+maxH>window.innerHeight) top = Math.max(12, r.top-maxH-6);
    panel.style.left    = left+'px';
    panel.style.top     = top+'px';
    panel.style.width   = w+'px';
    panel.style.maxHeight = maxH+'px';
  }

  function draw(temp, filter){
    const term = String(filter||'').toLowerCase();
    const opts = [...select.options].map(o=>({value:o.value, text:o.textContent.trim()||o.value}));
    const visible = opts.filter(o=>!term || o.text.toLowerCase().includes(term));

    panel.innerHTML =
      '<input class="v65-search" placeholder="Search…">' +
      '<div class="v65-list">' +
        visible.map(o=>{
          const checked = temp.has(o.value) || (multiple && o.value===ALL && !temp.size);
          return `<label class="v65-option"><input type="checkbox" data-value="${esc(o.value)}" ${checked?'checked':''}><span>${esc(o.text)}</span></label>`;
        }).join('') +
      '</div>' +
      '<div class="v65-actions"><button type="button" class="v65-ok">OK</button><button type="button" class="v65-cancel">Cancel</button></div>';

    const searchEl = panel.querySelector('.v65-search');
    const listEl   = panel.querySelector('.v65-list');
    searchEl.value = filter||'';
    searchEl.oninput = ()=>draw(temp, searchEl.value);

    /* Prevent list scroll from closing the panel */
    listEl.addEventListener('wheel',  e=>e.stopPropagation(), {passive:true});
    listEl.addEventListener('scroll', e=>e.stopPropagation(), {passive:true});
    listEl.addEventListener('touchmove', e=>e.stopPropagation(), {passive:true});

    panel.querySelectorAll('.v65-option input').forEach(cb=>{
      cb.onchange = function(){
        const val = cb.getAttribute('data-value')||'';
        if(multiple){
          if(val===ALL||val===''){
            temp = cb.checked ? new Set([ALL]) : new Set();
          } else {
            temp.delete(ALL); temp.delete('');
            cb.checked ? temp.add(val) : temp.delete(val);
            if(!temp.size) temp.add(ALL);
          }
        } else {
          temp = new Set([cb.checked ? val : '']);
        }
        draw(temp, searchEl.value);
        setTimeout(()=>panel.querySelector('.v65-search')?.focus(), 0);
      };
    });

    panel.querySelector('.v65-ok').onclick = function(e){
      e.stopPropagation();
      const vals = [...temp];
      const isAll = !vals.length || vals.includes(ALL) || vals.includes('');
      if(multiple){
        if(isAll){
          /* Select ALL options */
          [...select.options].forEach(o=>o.selected=true);
        } else {
          [...select.options].forEach(o=>o.selected=vals.includes(o.value));
        }
        if(![...select.selectedOptions].length && select.options[0]) select.options[0].selected=true;
      } else {
        select.value = vals[0]||'';
      }
      updateBtn();
      panel.classList.remove('open'); openPanel=null;
      if(typeof onOK==='function') onOK();
    };

    panel.querySelector('.v65-cancel').onclick = e=>{ e.stopPropagation(); panel.classList.remove('open'); openPanel=null; };
  }

  btn.onclick = function(e){
    e.stopPropagation();
    const wasOpen = panel.classList.contains('open');
    closeAll();
    if(wasOpen) return;
    let initTemp;
    if(multiple){
      initTemp = new Set(getSelected().length ? getSelected() : [ALL]);
    } else {
      initTemp = new Set([select.value||'']);
    }
    draw(initTemp, '');
    placePanel();
    panel.classList.add('open');
    openPanel = panel;
    panel.onclick = e=>e.stopPropagation();
    setTimeout(()=>panel.querySelector('.v65-search')?.focus(), 0);
  };

  updateBtn();
}

/* ─────────────────────────────────────────────
   GSPN JOBTYPE FILTER
───────────────────────────────────────────── */
function ensureGspnJobTypeFilter(){
  if(byId('jobTypeFilter')) return;
  const filters = document.querySelector('#gspnPage .filters');
  if(!filters) return;
  const box = document.createElement('div');
  box.id = 'jobTypeFilterBox';
  box.innerHTML = '<div class="filter-label">GSPN JobType - multiple select</div><select id="jobTypeFilter" multiple></select>';
  const warrantyBox = byId('warrantyFilter')?.closest('div');
  if(warrantyBox) warrantyBox.insertAdjacentElement('afterend', box);
  else filters.appendChild(box);
}

function fillJobTypeFilter(){
  const el = byId('jobTypeFilter'); if(!el) return;
  let rows=[]; try{ rows=Array.isArray(allRows)?allRows:window.allRows||[]; }catch(e){}
  const keep = [...el.options].filter(o=>o.selected).map(o=>o.value);
  const values = uniq(rows.map(r=>r['GSPN JobType']||r.JobType||r['Job Type']));
  el.innerHTML = `<option value="${ALL}">(Select All)</option>` + values.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
  keep.forEach(v=>{ const o=[...el.options].find(x=>x.value===v); if(o) o.selected=true; });
  if(![...el.selectedOptions].length && el.options[0]) el.options[0].selected=true;
}

function installJobTypeFilter(){
  ensureGspnJobTypeFilter();
  fillJobTypeFilter();
  /* Label only — the widget itself is built by a dedicated script
     (#gspn-jobtype-final-sync) so it always matches the other GSPN
     filters and we avoid layered overrides from older v63/v64/v65 widgets. */
  const box = byId('jobTypeFilterBox') || byId('jobTypeFilter')?.closest('div');
  const lbl = box?.querySelector('.filter-label,label');
  if(lbl) lbl.textContent = 'GSPN JobType - multiple select';
  /* Clean up any stale legacy widgets so only our dedicated widget remains. */
  ['jobTypeFilter_v65wrap','jobTypeFilter_v65panel','jobTypeFilter_v63wrap','jobTypeFilter_v63panel','jobTypeFilter_v64wrap','jobTypeFilter_v64panel'].forEach(id=>{ const el=byId(id); if(el) el.remove(); });
}

/* Patch render to keep jobType in getFilteredRows */
function patchGspnRender(){
  if(window.__v65GspnPatched) return; window.__v65GspnPatched=true;
  const origGet = window.getFilteredRows || window.getGspnFilteredRows;
  if(typeof origGet==='function'){
    const patched = function(){
      const rows = origGet.apply(this,arguments)||[];
      const el=byId('jobTypeFilter'); if(!el) return rows;
      const jobs=[...el.selectedOptions].map(o=>o.value).filter(v=>v&&v!==ALL);
      if(!jobs.length) return rows;
      return rows.filter(r=>jobs.includes(String(r['GSPN JobType']||r.JobType||r['Job Type']||'').trim()));
    };
    if(window.getFilteredRows) window.getFilteredRows=patched;
    if(window.getGspnFilteredRows) window.getGspnFilteredRows=patched;
  }
  const origRefresh = window.refreshFilterLists;
  if(typeof origRefresh==='function'){
    window.refreshFilterLists=function(){
      const r=origRefresh.apply(this,arguments);
      /* fillJobTypeFilter is still called as a backup in case the base
         refreshFilterLists didn't populate the options. Widget rendering
         is owned by the #gspn-jobtype-final-sync script. */
      fillJobTypeFilter();
      return r;
    };
  }
  const origReset = window.resetFiltersToAll;
  if(typeof origReset==='function'){
    window.resetFiltersToAll=function(){ const r=origReset.apply(this,arguments); const el=byId('jobTypeFilter'); if(el) [...el.options].forEach(o=>o.selected=o.value===ALL); return r; };
  }
}

/* ─────────────────────────────────────────────
   ANALYSIS BRANCHES FILTER
───────────────────────────────────────────── */
function installAnalysisBranch(){
  const el = byId('v58Branch')||byId('v57Branch')||byId('v54Branch');
  if(!el) return;
  /* Label */
  const box = el.closest('.v54-filter')||el.closest('div');
  const lbl = box?.querySelector('label,.filter-label');
  if(lbl) lbl.textContent = 'Branches — multiple select';
  /* Ensure proper first option */
  if(el.options[0] && !el.options[0].value) el.options[0].textContent='All Branches';
  /* Make multiple */
  el.multiple=true; el.setAttribute('multiple','multiple');
  buildV65(el.id, true, 'All Branches', ()=>{
    if(typeof window.v58_render==='function') window.v58_render();
    else if(typeof window.renderAnalysisDashboardV35==='function') window.renderAnalysisDashboardV35();
  });
}

/* ─────────────────────────────────────────────
   ANALYSIS CLOSED YEAR FILTER
   — Adds/updates a "Closed Year" filter that
     reads from the "Closed Year" column or the
     close-date column year, replacing the old
     "Close Year" filter.
───────────────────────────────────────────── */
function getCols(data){ return [...new Set((data||[]).flatMap(r=>Object.keys(r||{})))]; }
function pickCol(data, names){
  const c=getCols(data);
  for(const n of names){ const e=c.find(x=>norm(x)===norm(n)); if(e) return e; }
  for(const n of names){ const e=c.find(x=>norm(x).includes(norm(n))); if(e) return e; }
  return '';
}
function yearFromVal(v){
  if(v==null||v==='') return '';
  if(v instanceof Date&&!isNaN(v)) return String(v.getFullYear());
  if(typeof v==='number' && v>20000 && v<80000){ const d=new Date(Math.round((v-25569)*86400*1000)); if(!isNaN(d)) return String(d.getUTCFullYear()); }
  if(typeof v==='number' && v>1900 && v<2200) return String(Math.trunc(v));
  const s=String(v).trim();
  const m=s.match(/(?:^|[^0-9])(20[0-9]{2}|19[0-9]{2})(?:[^0-9]|$)/); if(m) return m[1];
  const d=new Date(s); return isNaN(d)?'':String(d.getFullYear());
}

function ensureClosedYearFilter(){
  const filters = document.querySelector('.v54-filters'); if(!filters) return;
  /* Remove old Close Year box if it exists, replace with Closed Year */
  const oldBox = byId('v64CloseYearBox');
  if(oldBox){ const lbl=oldBox.querySelector('label'); if(lbl) lbl.textContent='Closed Year'; return; }
  if(byId('v58CloseYear')){
    const lbl=byId('v58CloseYear')?.previousElementSibling || byId('v58CloseYear')?.closest('div')?.querySelector('label');
    if(lbl) lbl.textContent='Closed Year';
    return;
  }
  const wrap=document.createElement('div'); wrap.className='v54-filter'; wrap.id='v65ClosedYearBox';
  wrap.innerHTML='<label>Closed Year</label><select id="v65ClosedYear"></select>';
  const before=filters.querySelector('.v54-actions');
  filters.insertBefore(wrap, before||null);
  byId('v65ClosedYear').onchange=()=>{
    if(typeof window.v58_render==='function') window.v58_render();
    else if(typeof window.renderAnalysisDashboardV35==='function') window.renderAnalysisDashboardV35();
  };
}

function fillClosedYearFilter(){
  const data = Array.isArray(window.analysisRows)?window.analysisRows:[];
  /* Try dedicated "Closed Year" column first */
  const closedYearCol = pickCol(data,['Closed Year','Closed_Year','ClosedYear','Close Year','CloseYear']);
  const closeDateCol  = pickCol(data,['CloseDate','Close Date','Closed Date','Delivery Date','Delivered Date']);
  let years=[];
  if(closedYearCol){
    years = uniq(data.map(r=>String(r[closedYearCol]??'').trim()).filter(Boolean));
  }
  if(!years.length && closeDateCol){
    years = uniq(data.map(r=>yearFromVal(r[closeDateCol])).filter(Boolean));
  }
  /* Fill both the v58CloseYear (legacy) and v65ClosedYear elements */
  ['v58CloseYear','v65ClosedYear'].forEach(id=>{
    const el=byId(id); if(!el) return;
    const keep=el.value||'';
    el.innerHTML='<option value="">All Close Years</option>'+years.map(y=>`<option value="${esc(y)}">${esc(y)}</option>`).join('');
    el.value=[...el.options].some(o=>o.value===keep)?keep:'';
  });
}

/* Patch v58_filtered / renderAnalysisDashboardV35 to honour Closed Year filter */
function patchAnalysisFilter(){
  if(window.__v65AnalysisPatched) return; window.__v65AnalysisPatched=true;
  const data=()=>Array.isArray(window.analysisRows)?window.analysisRows:[];
  const base58=window.v58_filtered;
  if(typeof base58==='function' && !base58.__v65Patch){
    window.v58_filtered=function(d,f){
      const out=base58.apply(this,arguments);
      const cy=byId('v58CloseYear')?.value||byId('v65ClosedYear')?.value||'';
      if(!cy) return out;
      const rows=data();
      const closedYearCol=pickCol(rows,['Closed Year','Closed_Year','ClosedYear','Close Year','CloseYear']);
      return out.filter(r=>{
        const direct=closedYearCol?String(r[closedYearCol]??'').trim():'';
        const fromDate=f&&f.close?yearFromVal(r[f.close]):'';
        return (direct||fromDate)===cy;
      });
    };
    window.v58_filtered.__v65Patch=true;
  }
}

/* ─────────────────────────────────────────────
   CONNECTED USERS (PRESENCE BADGES)
   Uses localStorage cross-tab heartbeat.
   Always shows ≥1 (current user is always connected).
───────────────────────────────────────────── */
(function setupPresence(){
  const KEY    = 'serviceEyeOnlineTabs_v65';
  const EXPIRE = 18000; /* 18 s */
  const MY_ID  = (()=>{ const k='serviceEyeTabId_v65'; let id=sessionStorage.getItem(k); if(!id){id='t'+Math.random().toString(36).slice(2,9);sessionStorage.setItem(k,id);} return id; })();

  function normTab(t){ t=String(t||'').toLowerCase(); if(t==='sky') return 'sky'; if(t==='profit'||t.includes('profit')) return 'profit'; if(t.includes('analysis')||t.includes('analys')) return 'analysis'; return 'gspn'; }
  function currentTab(){ return normTab(localStorage.getItem('serviceEyeActiveTab')||'gspn'); }
  function readStore(){ try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){return{};} }
  function writeStore(s){ try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){} }

  function getCounts(){
    const now=Date.now(), store=readStore(), counts={gspn:0,sky:0,analysis:0,profit:0};
    Object.keys(store).forEach(id=>{
      const item=store[id]; if(!item||now-Number(item.ts||0)>EXPIRE) return;
      counts[normTab(item.tab)]++;
    });
    /* Always count self */
    const me=normTab(currentTab()); if(!store[MY_ID]||Date.now()-Number(store[MY_ID]?.ts||0)>EXPIRE) counts[me]=Math.max(counts[me],1);
    return counts;
  }

  function updateBadges(){
    const counts=getCounts();
    document.querySelectorAll('.side-tab').forEach(tab=>{
      const txt=(tab.textContent||'').toLowerCase();
      const key = txt.includes('gspn')&&!txt.includes('analyses') ? 'gspn' :
                  txt.includes('sky')&&!txt.includes('analyses')  ? 'sky'  :
                  txt.includes('analyses')                         ? 'analysis' : '';
      if(!key) return;
      let badge=tab.querySelector('.tab-count-badge');
      if(!badge){ badge=document.createElement('span'); badge.className='tab-count-badge'; tab.appendChild(badge); }
      const n=Math.max(counts[key]||0, key===currentTab()?1:0);
      badge.textContent=String(n);
      badge.title=n+' connected user'+(n===1?'':'s');
    });
  }

  function heartbeat(){
    const now=Date.now(), store=readStore();
    Object.keys(store).forEach(id=>{ if(now-Number(store[id]?.ts||0)>EXPIRE) delete store[id]; });
    store[MY_ID]={tab:currentTab(),ts:now};
    writeStore(store);
    updateBadges();
  }

  window.__v65UpdatePresence=updateBadges;
  window.v58_updatePresenceBadges=updateBadges;
  window.v57_updatePresenceBadges=updateBadges;
  window.updateTabCounts=updateBadges;

  window.addEventListener('storage', updateBadges);
  window.addEventListener('beforeunload',()=>{ const s=readStore(); delete s[MY_ID]; writeStore(s); });
  heartbeat(); setTimeout(heartbeat,600); setTimeout(updateBadges,1200);
})();

/* ─────────────────────────────────────────────
   MASTER RUN  — called once on load and after
   each render to keep everything in sync
───────────────────────────────────────────── */
let _runTimer=null;
function scheduleRun(delay){ clearTimeout(_runTimer); _runTimer=setTimeout(run, delay||40); }

function run(){
  /* GSPN */
  patchGspnRender();
  installJobTypeFilter();
  /* Analysis */
  ensureClosedYearFilter();
  fillClosedYearFilter();
  installAnalysisBranch();
  patchAnalysisFilter();
  /* Presence */
  if(typeof window.__v65UpdatePresence==='function') window.__v65UpdatePresence();
}

/* ── Patch switchTab so we re-run on tab switch ── */
(function(){
  const old=window.switchTab;
  if(typeof old==='function'&&!old.__v65Patched){
    const p=function(tab){ const r=old.apply(this,arguments); scheduleRun(120); return r; };
    p.__v65Patched=true;  }
})();
/* ── Patch render so jobType widget stays in sync ── */
(function(){
  const old=window.render;
  if(typeof old==='function'&&!old.__v65Patched){
    const p=function(){ const r=old.apply(this,arguments); scheduleRun(50); return r; };
    p.__v65Patched=true; window.render=p;
  }
})();
/* ── Patch analysis render ── */
(function(){
  const patched=[]; ['v58_render','renderAnalysisDashboardV35','renderV58AnalysisDashboard'].forEach(name=>{
    const old=window[name];
    if(typeof old==='function'&&!old.__v65Patched){
      const p=function(){ const r=old.apply(this,arguments); scheduleRun(80); return r; };
      p.__v65Patched=true; window[name]=p; patched.push(name);
    }
  });
})();

/* Boot */
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{ setTimeout(run,800); });
else { setTimeout(run,300); }
window.addEventListener('load',()=>{ setTimeout(run,700); });

})();


/* ===== sky_v8_perf_script ===== */

(function(){
  'use strict';


  const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const MONTH_INDEX={jan:0,january:0,feb:1,february:1,mar:2,march:2,apr:3,april:3,may:4,jun:5,june:5,jul:6,july:6,aug:7,august:7,sep:8,sept:8,september:8,oct:9,october:9,nov:10,november:10,dec:11,december:11};
  const ALL=new Set(['','__ALL__','__all__','ALL','All','(Select All)','Select All']);
  const DISPLAY=[['Queue','Queue'],['Brand','Brand'],['Branch','Branch'],['Job_Number','Job_Number'],['Open_Date','Open_Date'],['Stage','Stage'],['Status','Status'],['Item English Name','Item English Name'],['Aging_Days','Aging_Days'],['aging Days Group','aging Days Group'],['Return Cases','Return Cases'],['SerialNumber','SerialNumber'],['Price','Price']];

  const $=id=>document.getElementById(id);
  const text=v=>String(v==null?'':v).trim();
  const esc=v=>text(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pad=n=>String(n).padStart(2,'0');
  const pct=(a,b)=>b?Math.round((a/b)*100):0;

  function parseDate(v){
    if(v==null||v==='') return null;
    if(v instanceof Date && !isNaN(v)) return v;
    if(typeof v==='number' && isFinite(v)) return new Date(Math.round((v-25569)*86400000));
    let s=text(v); if(!s) return null;
    s=s.replace(/\s+00:00:00.*$/i,'').trim();
    let m=s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
    if(m){ const d=new Date(+m[1],+m[2]-1,+m[3]); return isNaN(d)?null:d; }
    m=s.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})$/);
    if(m){ const y=+(String(m[3]).length===2?'20'+m[3]:m[3]); const d=new Date(y,+m[2]-1,+m[1]); return isNaN(d)?null:d; }
    m=s.match(/^(\d{1,2})[-\s\/](Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t)?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[-\s\/](\d{2,4})$/i);
    if(m){ const y=+(String(m[3]).length===2?'20'+m[3]:m[3]); const d=new Date(y,MONTH_INDEX[m[2].toLowerCase()],+m[1]); return isNaN(d)?null:d; }
    const d=new Date(s); return isNaN(d)?null:d;
  }
  function stamp(v){ const d=parseDate(v); return d?new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime():null; }
  function fmt(v){ const d=parseDate(v); return d?`${pad(d.getDate())}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`:text(v); }
  function nativeDate(v){ const d=parseDate(v); return d?`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`:''; }

  function rawRows(){
    try{ if(Array.isArray(window.skyRows)) return window.skyRows; }catch(e){}
    try{ if(typeof skyRows!=='undefined' && Array.isArray(skyRows)) return skyRows; }catch(e){}
    return [];
  }

  let cachedRaw=null, cachedNormalized=null;
  function first(row,keys){
    row=row||{};
    const norm={}; Object.keys(row).forEach(k=>{ norm[k.toLowerCase().replace(/[^a-z0-9]/g,'')]=k; });
    for(const k of keys){
      if(row[k]!=null && text(row[k])!=='') return row[k];
      const real=norm[String(k).toLowerCase().replace(/[^a-z0-9]/g,'')];
      if(real && row[real]!=null && text(row[real])!=='') return row[real];
    }
    return '';
  }
  function agingGroup(days){ const n=Number(days); if(!isFinite(n)) return ''; if(n<=3) return '0 to 3 Days'; if(n<=10) return '4 to 10 Days'; return 'More than 10 Days'; }
  function normalize(row){
    let old={}; try{ if(typeof window.normalizeSkyRow==='function' && window.normalizeSkyRow!==normalize) old=window.normalizeSkyRow(row)||{}; }catch(e){}
    const r=Object.assign({},row||{},old||{});
    r.Queue=first(r,['Queue']); r.Brand=first(r,['Brand']); r.Branch=first(r,['Branch']); r.Stage=first(r,['Stage']); r.Status=first(r,['Status']);
    r.Job_Number=first(r,['Job_Number','Job Number','JobNumber','Job No','Service Order']);
    r.Open_Date_Raw=first(r,['Open_Date_Raw','Open_Date','Open Date','OpenDate','Created Date','Creation Date','Receipt Date','Received Date']);
    r.Open_Date=fmt(r.Open_Date_Raw); r.Open_Date_Display=r.Open_Date; r['Open Date']=r.Open_Date;
    r.Open_Date_Stamp=stamp(r.Open_Date_Raw || r.Open_Date);
    r.Aging_Days=first(r,['Aging_Days','Aging Days','AgingDays']);
    r['aging Days Group']=first(r,['aging Days Group','Aging Days Group','aging_Days_Group','Aging_Days_Group']) || agingGroup(r.Aging_Days);
    r['Return Cases']=first(r,['Return Cases','Return_Cases','ReturnCases']);
    r.SerialNumber=first(r,['SerialNumber','Serial Number','Serial_Number','SN','S/N']);
    r.Price=first(r,['Price','price','PRICE','Repair Price','Repair_Price','Total Price','Total_Price','Amount','Net Price','Unit Price','Service Price']);
    r['Item English Name']=first(r,['Item English Name','Item_English_Name','ItemEnglishName','Item Name','Description']);
    r.IMEI=first(r,['IMEI','Imei','imei','IMEI No','IMEI_Number']);
    r.Customer_Mobile=first(r,['Customer_Mobile','Customer Mobile','CustomerMobile','Mobile','Mobile No']);
    r.Customer_phone=first(r,['Customer_phone','Customer Phone','CustomerPhone','Phone','Phone No','Telephone']);

    // SKY export exact-header mapping fix: keep all existing data, but also fill the
    // final Excel export keys that use spaces instead of underscore/raw field names.
    r['Close Date']=first(r,['Close Date','CloseDate','Close_Date','Closed Date','Closed_Date','CloseDate_Display']);
    r.CloseDate=r.CloseDate || r['Close Date'];
    r.CloseDate_Display=r.CloseDate_Display || fmt(r['Close Date']);
    r['Final Status']=first(r,['Final Status','Final_Stausus','Final_Status','StatusFinal','Status Final']);
    r.Final_Stausus=r.Final_Stausus || r['Final Status'];
    r['Assigned To']=first(r,['Assigned To','Assigned_To','GSPN Assigned_To','GSPN Assigned To','Technician','Engineer']);
    r.Assigned_To=r.Assigned_To || r['Assigned To'];
    r['Closed By']=first(r,['Closed By','Closed_By','ClosedBy','Close By','Close_By']);
    r.Closed_By=r.Closed_By || r['Closed By'];
    r['Customer Name']=first(r,['Customer Name','Customer_Name','CustomerName','Cust Name','Name']);
    r.Customer_Name=r.Customer_Name || r['Customer Name'];
    r['Ready For Delivery Date']=first(r,['Ready For Delivery Date','Ready_For_Delivery_Date','ReadyForDeliveryDate']);
    r.Ready_For_Delivery_Date_Display=r.Ready_For_Delivery_Date_Display || fmt(r['Ready For Delivery Date']);
    return r;
  }
  function rows(){ const rr=rawRows(); if(rr!==cachedRaw){ cachedRaw=rr; cachedNormalized=rr.map(normalize); } return cachedNormalized||[]; }

  function selected(id){ const el=$(id); if(!el) return []; if(el.multiple) return Array.from(el.selectedOptions||[]).map(o=>o.value).filter(v=>!ALL.has(v)); return ALL.has(el.value)?[]:[el.value]; }
  function matchSel(r,field,id){ const vals=selected(id).map(text); return !vals.length || vals.includes(text(r[field])); }
  function dateFrom(){ return stamp(window.__skyDateFrom || (($('skyFromDate')||{}).value||'')); }
  function dateTo(){ return stamp(window.__skyDateTo || (($('skyToDate')||{}).value||'')); }
  function matchDate(r){ const f=dateFrom(), t=dateTo(); if(f==null&&t==null) return true; const d=r.Open_Date_Stamp; if(d==null) return false; return (f==null||d>=f)&&(t==null||d<=t); }
  function matchSearch(r){ const box=$('skySearchBox'); const term=box?text(box.value).toLowerCase():''; if(!term) return true; return ['Job_Number','IMEI','SerialNumber','Customer_Mobile','Customer_phone','Customer_Name','Customer Name','Model','Status','Stage','Branch','Item English Name','Price'].some(k=>text(r[k]).toLowerCase().includes(term)); }
  function filteredRows(){ return rows().filter(r=>matchSel(r,'Branch','skyBranchFilter')&&matchSel(r,'Queue','skyQueueFilter')&&matchSel(r,'Brand','skyBrandFilter')&&matchSel(r,'Stage','skyStageFilter')&&matchSel(r,'aging Days Group','skyAgingDaysGroupFilter')&&matchSearch(r)&&matchDate(r)); }

  function setText(id,val){ const el=$(id); if(el) el.textContent=val; }
  function renderCards(list){ const total=list.length,open=list.filter(r=>text(r.Queue)==='Open_Cases').length,ready=list.filter(r=>text(r.Queue)==='Ready For Delivery Cases').length,del=list.filter(r=>text(r.Queue)==='__REMOVED_QUEUE__').length,closed=ready+del,sam=list.filter(r=>text(r.Brand).toLowerCase()==='samsung').length,app=list.filter(r=>text(r.Brand).toLowerCase()==='apple').length; setText('skyTotalCases',total); setText('skyOpenCases',open); setText('skyOpenPercent',`${pct(open,total)}% of Total`); setText('skyReadyCases',ready); setText('skyReadyPercent',`${pct(ready,total)}% of Total`); setText('skyDeliveredCases',del); setText('skyDeliveredPercent',`${pct(del,total)}% of Total`); setText('skyClosedCases',closed); setText('skyClosedPercent',`${pct(closed,total)}% Ready/Delivered`); setText('skySamsungCases',sam); setText('skySamsungPercent',`${pct(sam,total)}% of Total`); setText('skyAppleCases',app); setText('skyApplePercent',`${pct(app,total)}% of Total`); }
  function renderTable(list){ const table=$('skyCasesTable'); if(!table) return; const view=list.slice(0,1000); table.innerHTML='<thead><tr>'+DISPLAY.map(c=>`<th>${esc(c[1])}</th>`).join('')+'</tr></thead><tbody>'+view.map(r=>'<tr>'+DISPLAY.map(c=>`<td>${esc(r[c[0]])}</td>`).join('')+'</tr>').join('')+'</tbody>'; }
  function updateDateLabel(){ const f=$('skyFromDate'), t=$('skyToDate'); if(!f||!t) return; let l=$('skyOpenDateAppliedLabel'); if(!l){ l=document.createElement('div'); l.id='skyOpenDateAppliedLabel'; (t.closest('.date-row')||t.parentElement).insertAdjacentElement('afterend',l); } const fv=window.__skyDateFrom||f.value, tv=window.__skyDateTo||t.value; l.textContent=(fv||tv)?`Applied Open Case Date: ${fmt(fv)||'Start'} to ${fmt(tv)||'End'}`:''; }

  let renderQueued=false;
  function renderSkyOptimized(updateCharts=true){
    if(renderQueued) return window.currentSkyRows||[];
    renderQueued=true;
    try{
      const list=filteredRows(); window.currentSkyRows=list; try{ currentSkyRows=list; }catch(e){}
      renderCards(list); renderTable(list); updateDateLabel();
      if(updateCharts && typeof window.updateSkyCharts==='function') requestAnimationFrame(()=>{ try{ window.updateSkyCharts(list); }catch(e){} });
      return list;
    } finally { renderQueued=false; }
  }
  function applyDate(){ const f=$('skyFromDate'), t=$('skyToDate'); window.__skyDateFrom=f?f.value:''; window.__skyDateTo=t?t.value:''; window.skyAppliedFromDate=window.__skyDateFrom; window.skyAppliedToDate=window.__skyDateTo; window.skyAppliedFromDateStamp=stamp(window.__skyDateFrom); window.skyAppliedToDateStamp=stamp(window.__skyDateTo); renderSkyOptimized(true); }
  function setExcelLabel(id){ const wrap=$(id+'_excel'); const btn=wrap?wrap.querySelector('.excel-filter-button'):null; if(!btn) return; const vals=selected(id); const label=!vals.length?'(Select All)':(vals.length>2?`${vals.length} selected`:vals.join(', ')); btn.textContent=label; btn.title=label; }
  function resetSelect(id){ const el=$(id); if(!el) return; if(el.multiple) Array.from(el.options).forEach((o,i)=>o.selected=i===0 || ALL.has(o.value)); else el.value=''; setExcelLabel(id); }
  function clearFilters(scroll){ ['skyBranchFilter','skyQueueFilter','skyBrandFilter','skyStageFilter','skyJobTypeFilter','skyAgingDaysGroupFilter'].forEach(resetSelect); const s=$('skySearchBox'); if(s) s.value=''; const f=$('skyFromDate'), t=$('skyToDate'); if(f) f.value=''; if(t) t.value=''; window.__skyDateFrom=''; window.__skyDateTo=''; window.skyAppliedFromDate=''; window.skyAppliedToDate=''; window.skyAppliedFromDateStamp=null; window.skyAppliedToDateStamp=null; const l=$('skyOpenDateAppliedLabel'); if(l) l.textContent=''; renderSkyOptimized(true); if(scroll){ try{ if(typeof scrollToElement==='function') scrollToElement('skyCasesTable'); }catch(e){} } }
  function debounce(fn,ms){ let timer; return function(){ clearTimeout(timer); timer=setTimeout(fn,ms); }; }
  const debouncedRender=debounce(()=>renderSkyOptimized(true),180);

  const EXPORT=[
    ['Queue','Queue'],['Brand','Brand'],['Family','Family'],['Branch','Branch'],['Job_Number','Job_Number'],['Open_Date','Open_Date'],['Ready For Delivery Date','Ready For Delivery Date'],['Close Date','Close Date'],['Stage','Stage'],['Status','Status'],['Final Status','Final Status'],['Model','Model'],['Warranty','Warranty'],['Assigned To','Assigned To'],['Closed By','Closed By'],['Customer Name','Customer Name'],['IMEI','IMEI'],['Customer_Mobile','Customer_Mobile'],['Customer_phone','Customer_phone'],['SerialNumber','SerialNumber'],['Item English Name','Item English Name'],['Price','Price'],['Discount','Discount'],['Recieved_By','Recieved_By'],['Defects','Defects'],['Not_Repaired_Reason','Not_Repaired_Reason'],['Aging_Days','Aging_Days'],['Aging_Months','Aging_Months'],['Customer_Type','Customer_Type'],['aging Days Group','aging Days Group'],['Repeat Cases','Repeat Cases'],['Return Cases','Return Cases'],['JobType','JobType']
  ];

  window.normalizeSkyRow=normalize;
  window.getSkyFilteredRows=filteredRows; try{ getSkyFilteredRows=filteredRows; }catch(e){}
  window.renderSky=function(){ return renderSkyOptimized(true); };

  window.SKY_DISPLAY_COLUMNS_REQUESTED=DISPLAY;
  window.SKY_EXPORT_COLUMNS_FINAL=EXPORT;
  /* [dedup] superseded exportSkyExcel definition removed (was L7320) */

  window.applySkyDateFilter=applyDate;
  window.clearSkyFilters=clearFilters;

  function wire(){
    const page=$('skyPage'); if(!page) return;
    const f=$('skyFromDate'), t=$('skyToDate');
    [f,t].forEach(el=>{ if(!el||el.dataset.skyV8) return; el.dataset.skyV8='1'; el.type='date'; el.name=el.id; const nv=nativeDate(el.value); if(nv) el.value=nv; el.addEventListener('change',applyDate); el.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); applyDate(); }}); });
    ['skyBranchFilter','skyQueueFilter','skyBrandFilter','skyStageFilter','skyAgingDaysGroupFilter'].forEach(id=>{ const el=$(id); if(el&&!el.dataset.skyV8){ el.dataset.skyV8='1'; el.addEventListener('change',debouncedRender); }});
    const search=$('skySearchBox'); if(search&&!search.dataset.skyV8){ search.dataset.skyV8='1'; search.addEventListener('input',debounce(()=>renderSkyOptimized(false),250)); }
    Array.from(page.querySelectorAll('button')).forEach(btn=>{ const tx=text(btn.textContent); if(/^Search$/i.test(tx)) btn.onclick=applyDate; if(/Clear Filters/i.test(tx)) btn.onclick=()=>clearFilters(false); });
    renderSkyOptimized(true);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(wire,100)); else setTimeout(wire,100);
  window.addEventListener('load',()=>setTimeout(wire,300),{once:true});
})();


/* ===== all_tabs_requested_enhancements_script ===== */

(function(){
  'use strict';
  const ENHANCED = 'allTabsEnhancementReady';
  if (window[ENHANCED]) return;
  window[ENHANCED] = true;

  function qs(sel, root){ return (root || document).querySelector(sel); }
  function qsa(sel, root){ return Array.from((root || document).querySelectorAll(sel)); }
  function text(v){ return String(v == null ? '' : v); }
  function esc(v){ return text(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  /* [dedup] orphan helper visible removed */

  /* Web Worker helper: available to every tab for heavy filter/sort/map operations */
  const workerCode = `
    self.onmessage = function(e){
      const id=e.data && e.data.id, type=e.data && e.data.type, payload=e.data && e.data.payload;
      try{
        if(type==='filterRows'){
          const rows=payload.rows||[], term=String(payload.term||'').toLowerCase(), keys=payload.keys||[];
          const out=!term?rows:rows.filter(function(r){ return keys.some(function(k){ return String((r||{})[k]||'').toLowerCase().indexOf(term)>-1; }); });
          self.postMessage({id:id, ok:true, result:out}); return;
        }
        if(type==='sortRows'){
          const rows=(payload.rows||[]).slice(), key=payload.key, dir=payload.dir==='desc'?-1:1;
          rows.sort(function(a,b){ var av=(a||{})[key], bv=(b||{})[key]; var an=parseFloat(av), bn=parseFloat(bv); if(!isNaN(an)&&!isNaN(bn)) return (an-bn)*dir; return String(av||'').localeCompare(String(bv||''))*dir; });
          self.postMessage({id:id, ok:true, result:rows}); return;
        }
        if(type==='countBy'){
          const counts={}, rows=payload.rows||[], key=payload.key;
          rows.forEach(function(r){ var v=String((r||{})[key]||'Blank'); counts[v]=(counts[v]||0)+1; });
          self.postMessage({id:id, ok:true, result:counts}); return;
        }
        self.postMessage({id:id, ok:false, error:'Unknown worker task'});
      }catch(err){ self.postMessage({id:id, ok:false, error:String(err && err.message || err)}); }
    };
  `;
  let worker=null, seq=0, callbacks=new Map();
  function getWorker(){
    if(worker) return worker;
    try{
      const blob=new Blob([workerCode], {type:'text/javascript'});
      worker=new Worker(URL.createObjectURL(blob));
      worker.onmessage=function(e){ const cb=callbacks.get(e.data.id); if(!cb) return; callbacks.delete(e.data.id); e.data.ok ? cb.resolve(e.data.result) : cb.reject(new Error(e.data.error||'Worker error')); };
      worker.onerror=function(err){ callbacks.forEach(cb=>cb.reject(err)); callbacks.clear(); worker=null; };
      return worker;
    }catch(e){ return null; }
  }
  window.runInServiceEyeWorker=function(type, payload){
    const w=getWorker();
    if(!w) return Promise.reject(new Error('Web Worker is not available in this browser'));
    const id=++seq;
    return new Promise(function(resolve,reject){ callbacks.set(id,{resolve,reject}); w.postMessage({id,type,payload}); });
  };

  /* Floating Action Buttons */
  function installFAB(){
    if(qs('.all-tabs-fab-stack')) return;
    const stack=document.createElement('div');
    stack.className='all-tabs-fab-stack';
    stack.innerHTML='<button class="all-tabs-fab" type="button" aria-label="Scroll to top" title="Scroll Top">↑</button><button class="all-tabs-fab" type="button" aria-label="Scroll to bottom" title="Scroll Down">↓</button>';
    document.body.appendChild(stack);
    const buttons=qsa('button', stack);
    buttons[0].addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));
    buttons[1].addEventListener('click', ()=>window.scrollTo({top:document.documentElement.scrollHeight, behavior:'smooth'}));
  }

  /* Modern dropdowns: custom UI for normal single-selects, keeps original select/change events intact */
  function enhanceSelect(select){
    if(!select || select.dataset.allTabsModernSelect === '1') return;
    if(select.multiple || select.size > 1 || select.closest('.filters') || /Filter$/i.test(select.id || '') || select.closest('.excel-filter-container') || select.id.endsWith('_native')) { select.classList.add('modern-native-select'); return; }
    if(select.offsetWidth < 40) return;
    select.dataset.allTabsModernSelect='1';
    const wrap=document.createElement('div'); wrap.className='all-tabs-modern-select';
    select.parentNode.insertBefore(wrap, select); wrap.appendChild(select);
    const btn=document.createElement('button'); btn.type='button'; btn.className='all-tabs-modern-select-btn';
    const panel=document.createElement('div'); panel.className='all-tabs-modern-select-panel';
    panel.innerHTML='<input class="all-tabs-modern-select-search" placeholder="Search..."><div class="all-tabs-modern-select-list"></div>';
    wrap.appendChild(btn); wrap.appendChild(panel);
    const search=qs('.all-tabs-modern-select-search', panel), list=qs('.all-tabs-modern-select-list', panel);
    function currentText(){ const opt=select.options[select.selectedIndex]; return opt ? opt.textContent : 'Select'; }
    function sync(){ btn.textContent=currentText(); draw(search.value); }
    function place(){ const r=btn.getBoundingClientRect(), width=Math.min(Math.max(r.width,220), window.innerWidth-24); let left=Math.min(Math.max(12,r.left), window.innerWidth-width-12), top=r.bottom+6; const maxH=Math.min(360,window.innerHeight-24); if(top+maxH>window.innerHeight) top=Math.max(12,r.top-maxH-6); panel.style.left=left+'px'; panel.style.top=top+'px'; panel.style.width=width+'px'; panel.style.maxHeight=maxH+'px'; }
    function close(){ wrap.classList.remove('open'); }
    function open(){ qsa('.all-tabs-modern-select.open').forEach(x=>{ if(x!==wrap) x.classList.remove('open'); }); wrap.classList.add('open'); place(); search.value=''; draw(''); setTimeout(()=>search.focus(),0); }
    function draw(filter){
      const term=String(filter||'').toLowerCase();
      list.innerHTML=qsa('option', select).filter(o=>!term || o.textContent.toLowerCase().includes(term)).map(o=>'<div class="all-tabs-modern-option '+(o.selected?'active':'')+'" data-value="'+esc(o.value)+'">'+esc(o.textContent)+'</div>').join('') || '<div class="all-tabs-modern-option">No results</div>';
      qsa('.all-tabs-modern-option[data-value]', list).forEach(opt=>opt.onclick=function(){ select.value=this.getAttribute('data-value'); select.dispatchEvent(new Event('change',{bubbles:true})); sync(); close(); });
    }
    btn.onclick=function(e){ e.stopPropagation(); wrap.classList.contains('open') ? close() : open(); };
    panel.onclick=e=>e.stopPropagation(); search.oninput=()=>draw(search.value); select.addEventListener('change', sync);
    window.addEventListener('resize', ()=>{ if(wrap.classList.contains('open')) place(); }, {passive:true});
    window.addEventListener('scroll', ()=>{ if(wrap.classList.contains('open')) place(); }, {passive:true});
    sync();
  }
  function enhanceDropdowns(){ qsa('select').forEach(enhanceSelect); }
  document.addEventListener('click', ()=>qsa('.all-tabs-modern-select.open').forEach(x=>x.classList.remove('open')));

  /* Column Reorder for every rendered table in every tab */
  function tableKey(table){ return 'serviceEyeColumnOrder::' + (table.id || table.closest('section')?.querySelector('h2')?.textContent?.trim() || 'table_' + qsa('table').indexOf(table)); }
  function getRows(table){ return qsa('tr', table); }
  function moveCell(row, from, to){ const cells=qsa(':scope > th, :scope > td', row); if(from===to || !cells[from] || !cells[to]) return; const cell=cells[from]; if(from<to) row.insertBefore(cell, cells[to].nextSibling); else row.insertBefore(cell, cells[to]); }
  function applyOrder(table){
    const saved=localStorage.getItem(tableKey(table)); if(!saved) return;
    let order; try{ order=JSON.parse(saved); }catch(e){ return; }
    const headers=qsa('thead th', table); if(!headers.length || order.length!==headers.length) return;
    const current=headers.map((th,i)=>th.dataset.colKey || th.textContent.trim() || String(i));
    order.forEach((key,targetIndex)=>{ const fromIndex=current.indexOf(key); if(fromIndex<0 || fromIndex===targetIndex) return; getRows(table).forEach(row=>moveCell(row,fromIndex,targetIndex)); const moved=current.splice(fromIndex,1)[0]; current.splice(targetIndex,0,moved); });
  }
  function enableColumnReorder(table){
    if(!table) return;
    const headers=qsa('thead th', table); if(headers.length<2) return;
    if(table.dataset.allTabsColumnReorder==='1' && headers.every(th => th.draggable)) return;
    table.dataset.allTabsColumnReorder='1';
    headers.forEach((th,i)=>{ if(!th.dataset.colKey) th.dataset.colKey=th.textContent.trim() || String(i); });
    applyOrder(table);
    qsa('thead th', table).forEach((th)=>{
      th.draggable=true;
      th.addEventListener('dragstart', e=>{ const all=qsa('thead th', table); const idx=all.indexOf(th); e.dataTransfer.setData('text/plain', String(idx)); th.classList.add('all-tabs-drag-source'); });
      th.addEventListener('dragend', ()=>qsa('thead th', table).forEach(h=>h.classList.remove('all-tabs-drag-source','all-tabs-drag-over')));
      th.addEventListener('dragover', e=>{ e.preventDefault(); th.classList.add('all-tabs-drag-over'); });
      th.addEventListener('dragleave', ()=>th.classList.remove('all-tabs-drag-over'));
      th.addEventListener('drop', e=>{
        e.preventDefault(); th.classList.remove('all-tabs-drag-over');
        const from=Number(e.dataTransfer.getData('text/plain')); const to=qsa('thead th', table).indexOf(th);
        if(Number.isInteger(from) && from!==to){ getRows(table).forEach(row=>moveCell(row,from,to)); const order=qsa('thead th', table).map((h,i)=>h.dataset.colKey || h.textContent.trim() || String(i)); localStorage.setItem(tableKey(table), JSON.stringify(order)); }
      });
    });
  }
  function enhanceTables(){ qsa('table').forEach(enableColumnReorder); }

  function boot(){ installFAB(); enhanceDropdowns(); enhanceTables(); }
  const observer=new MutationObserver(()=>{ clearTimeout(observer._t); observer._t=setTimeout(boot,120); });
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', ()=>{ boot(); observer.observe(document.body,{childList:true,subtree:true}); });
  else { boot(); observer.observe(document.body,{childList:true,subtree:true}); }
  window.addEventListener('load', ()=>setTimeout(boot,500));
})();


/* ===== custom-online-users-inside-header-only-script ===== */

(function(){
  function getActiveHeader(){
    const pages = ['gspnPage','skyPage','analysisPage'];
    for (const id of pages) {
      const page = document.getElementById(id);
      if (!page) continue;
      const cs = window.getComputedStyle(page);
      if (cs.display !== 'none' && cs.visibility !== 'hidden') {
        return page.querySelector(':scope > header') || page.querySelector('header');
      }
    }
    return document.querySelector('.page-shell:not([style*="display:none"]) > header') || document.querySelector('.page-shell header') || document.querySelector('header');
  }

  function relocateOnlineBadge(){
    const badge = document.getElementById('topOnlineUsersBadge');
    const header = getActiveHeader();
    if (!badge || !header) return;
    if (badge.parentElement !== header) header.appendChild(badge);
  }

  const oldSwitchTab = window.switchTab;
  if (typeof oldSwitchTab === 'function' && !oldSwitchTab.__onlineUsersInsideHeaderPatch) {
    const patched = function(){
      const result = oldSwitchTab.apply(this, arguments);
      requestAnimationFrame(relocateOnlineBadge);
      return result;
    };
    patched.__onlineUsersInsideHeaderPatch = true;
  }

  document.addEventListener('DOMContentLoaded', function(){ setTimeout(relocateOnlineBadge, 200); });
  window.addEventListener('load', function(){ setTimeout(relocateOnlineBadge, 500); });

  const observer = new MutationObserver(function(){
    clearTimeout(observer._t);
    observer._t = setTimeout(relocateOnlineBadge, 50);
  });
  if (document.body) observer.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['style','class'] });
})();


/* ===== permanent-export-button-removal ===== */

(function(){
  function removeExportButtons(){
    document.querySelectorAll('button').forEach(btn=>{
      const t=(btn.textContent||'').trim().toLowerCase();
      if(
        t==='export dashboard excel' ||
        t==='export sky excel'
      ){
        btn.remove();
      }
    });
  }
  document.addEventListener('DOMContentLoaded', removeExportButtons);
  window.addEventListener('load', once(removeExportButtons));
void(removeExportButtons, 10000);
})();


/* ===== user-requested-gspn-sky-final-script ===== */

(function(){
  const ALL = (typeof ALL_VALUE !== 'undefined' ? ALL_VALUE : '__ALL__');
  const GSPN_ALL_COLS = [
    ["GSPN_Branch", "Branch"], ["SO NO#", "SO NO#"], ["Job_Number", "Job No"],
    ["GSPN_Open_Date_Display", "GSPN Open Date"], ["Stage", "Stage"], ["GSPN_Status", "GSPN Status"],
    ["GSPN JobType", "Job Type"], ["GSPN Warranty", "GSPN Warranty"], ["AgingDays", "Aging Days"],
    ["AgingStatus", "Aging Status"], ["KPIAlert", "KPI Alert"], ["Model", "Model"], ["REDO", "REDO"]
  ];
  const GSPN_URGENT_COLS = [
    ["PriorityRank", "Priority"], ["GSPN_Branch", "Branch"], ["SO NO#", "SO NO#"],
    ["Job_Number", "Job No"], ["GSPN_Open_Date_Display", "GSPN Open Date"], ["REDO", "REDO"],
    ["Stage", "Stage"], ["GSPN JobType", "Job Type"], ["GSPN Warranty", "GSPN Warranty"], ["GSPN_Status", "GSPN Status"],
    ["AgingDays", "Aging Days"], ["KPIFailDays", "Fail Days"], ["KPIFailName", "Failed Type"],
    ["DaysRemaining", "Remaining"], ["KPIAlert", "KPI Alert"], ["ActionRequired", "Action Required"], ["GSPN Assigned_To", "Technician"]
  ];
  window.ALL_CASE_COLUMNS = GSPN_ALL_COLS;
  window.URGENT_COLUMNS = GSPN_URGENT_COLS;
  function q(id){ return document.getElementById(id); }
  function txt(v){ return String(v ?? '').trim(); }
  function setText(id,val){ const el=q(id); if(el) el.textContent=val; }
  function percent(n,d){ n=Number(n)||0; d=Number(d)||0; return d ? ((n*100/d).toFixed(1).replace(/\.0$/,'')) : '0'; }
  /* [dedup] orphan helper uniqueList removed */
  /* [dedup] orphan helper getSelected removed */
  /* [dedup] orphan helper fill removed */
  function ensureGspnDom(){
    const tech=q('techFilter'); if(tech) tech.closest('div')?.remove();
    if(!q('stageFilter')){
      const branch=q('branchFilter');
      const box=document.createElement('div');
      box.innerHTML='<div class="filter-label">Stage - multiple select</div><select id="stageFilter" multiple></select>';
      branch?.closest('div')?.insertAdjacentElement('afterend', box);
    }
    document.querySelectorAll('#gspnPage .card').forEach(card=>{
      const label=txt(card.querySelector('.label')?.textContent);
      if(label==='Closed / Ready Cases' || label==='Avg Repair Days') card.remove();
    });
    document.querySelectorAll('#gspnPage section, #gspnPage .chart-card').forEach(sec=>{
      const title=txt(sec.querySelector('h2')?.textContent);
      if(['Best Branches - Lowest Avg Repair Days','Worst Branches - Highest Avg Repair Days','Best Technicians - Lowest Avg Repair Days','Worst Technicians - Highest Avg Repair Days','Average Repair Days by Branch'].includes(title)) sec.remove();
    });
  }
  const oldNormalize = window.normalizeRow;
  if(typeof oldNormalize === 'function'){
    window.normalizeRow = function(row){
      const out = oldNormalize(row);
      const getFirst = window.getFirst || function(r,keys){ for(const k of keys){ if(Object.prototype.hasOwnProperty.call(r,k)&&r[k]!==''&&r[k]!=null) return r[k]; } return ''; };
      out.Stage = txt(out.Stage || getFirst(row,["Stage","GSPN Stage","GSPN_Stage"]));
      out.AgingStatus = txt(getFirst(row,["Aging Status","Aging_Status","AgingStatus"])) || out.AgingStatus;
      return out;
    };
  }
  /* [dedup] superseded refreshFilterLists definition removed (was L7609) */
  /* [dedup] superseded getFilteredRows definition removed (was L7621) */
  /* [dedup] superseded resetFiltersToAll definition removed (was L7656) */
  window.render = function(){
    ensureGspnDom(); window.refreshFilterLists();
    const rows=window.getFilteredRows(); window.currentFilteredRows=rows;
    const total=rows.length, open=rows.filter(r=>r.StatusFinal==='Open'), failed=rows.filter(r=>txt(r.KPIResult).startsWith('Failed')),
      ltp=rows.filter(r=>r.KPIResult==='Failed - LTP'), ltpIn=rows.filter(r=>r.KPIResult==='Failed - LTP' && isInWarrantyCase(r)), ltpOut=rows.filter(r=>r.KPIResult==='Failed - LTP' && isOutWarrantyCase(r)), tat=rows.filter(r=>r.KPIResult==='Failed - TAT'), fix=rows.filter(r=>r.KPIAlert==='Fix Today'), watch=rows.filter(r=>r.KPIAlert==='Watch');
    setText('openCases', open.length); setText('openPercent', `${percent(open.length,total)}% of Total`);
    setText('failedCases', failed.length); setText('failedPercent', `${percent(failed.length,total)}% of Total`); setText('ltpInWarrantyCases', ltpIn.length); setText('ltpInWarrantyPercent', `${percent(ltpIn.length,failed.length)}% of Failed KPI`); setText('ltpOutWarrantyCases', ltpOut.length); setText('ltpOutWarrantyPercent', `${percent(ltpOut.length,failed.length)}% of Failed KPI`);
    setText('tatFailedCases', tat.length); setText('tatFailedPercent', `${percent(tat.length,failed.length)}% of Failed KPI`); setText('fixTodayCases', fix.length); setText('fixTodayPercent', `${percent(fix.length,open.length)}% of Open`);
    setText('watchCases', watch.length); setText('watchPercent', `${percent(watch.length,open.length)}% of Open`);
    if(typeof updateCharts==='function') updateCharts(rows);
    window.currentUrgentRows = rows.filter(r=>txt(r.KPIResult).startsWith('Failed') || ['Fix Today','Watch','Review'].includes(r.KPIAlert)).sort((a,b)=>(a.PriorityRank||9)-(b.PriorityRank||9)||Number(a.DaysRemaining||999)-Number(b.DaysRemaining||999)||Number(b.AgingDays||0)-Number(a.AgingDays||0));
    if(typeof renderTable==='function'){
      renderTable('casesTable', rows.slice(0,800), GSPN_ALL_COLS, true);
      renderTable('urgentTable', window.currentUrgentRows.slice(0,100), GSPN_URGENT_COLS, true);
    }
  };
  /* [dedup] superseded exportTableExcel definition removed (was L7677) */
  function ensureSkyDom(){
    document.querySelectorAll('#skyPage .card').forEach(card=>{ if(txt(card.querySelector('.label')?.textContent)==='__REMOVED_QUEUE__') card.remove(); });
    document.querySelectorAll('#skyPage .chart-card').forEach(sec=>{ const t=txt(sec.querySelector('h2')?.textContent); if(t==='Ready For Delivery Cases - Aging Months'||t==='Stage with Count Cases') sec.remove(); });
  }
  /* [dedup] orphan helper skyRowsSafe removed */
  /* [dedup] orphan helper getSkyAging removed */
  /* [dedup] superseded getSkyFilteredRows definition removed (was L7689) */
  const skyCols = [["Queue","Queue"],["Brand","Brand"],["Branch","Branch"],["Open_Date_Display","Open Date"],["Aging_Days","Aging Days"],["Aging Days Group","Aging Days Group"],["Job_Number","Job Number"],["Status","Status"],["Stage","Stage"],["Item English Name","Item English Name"],["Price","Price"]];
  /* [dedup] superseded renderSky definition removed (was L7705) */
  document.addEventListener('DOMContentLoaded',()=>{ ensureGspnDom(); ensureSkyDom(); ['stageFilter'].forEach(id=>{ const el=q(id); if(el){ el.addEventListener('change',()=>{ try{ quickFilter=null; }catch(e){}; window.render(); }); el.addEventListener('input',()=>{ try{ quickFilter=null; }catch(e){}; window.render(); }); }}); setTimeout(()=>{ if(typeof window.render==='function') window.render(); if(q('skyPage')&&q('skyPage').style.display!=='none') window.renderSky(); },500); });
  window.addEventListener('load',()=>{ ensureGspnDom(); ensureSkyDom(); });
})();


/* ===== user-requested-final-v2-script ===== */

(function(){
  const ALL = (typeof ALL_VALUE !== 'undefined' ? ALL_VALUE : '__ALL__');
  const SKY_ALLOWED_QUEUES = ['Open_Cases','Ready For Delivery Cases'];
  const GSPN_SOURCE_EXPORT_COLUMNS = [
    ['GSPN_Branch','GSPN_Branch'], ['SO NO#','SO NO#'], ['Job_Number','Job_Number'],
    ['GSPN_Open_Date','GSPN_Open_Date'], ['Stage','Stage'], ['GSPN_Status','GSPN_Status'],
    ['Model','Model'], ['GSPN Serial','GSPN Serial'], ['GSPN JobType','GSPN JobType'],
    ['GSPN Warranty','GSPN Warranty'], ['GSPN Aging Days','GSPN Aging Days'],
    ['Aging Status','Aging Status'], ['GSPN Assigned_To','GSPN Assigned_To'], ['REDO','REDO']
  ];
  const SKY_EXPORT_COLUMNS = [
    ['Queue','Queue'], ['Brand','Brand'], ['Branch','Branch'], ['Job_Number','Job_Number'],
    ['Status','Status'], ['Stage','Stage'], ['Final_Stausus','Final_Stausus'],
    ['Item English Name','Item English Name'], ['Price','Price'], ['Discount','Discount'],
    ['IMEI','IMEI'], ['SerialNumber','SerialNumber'], ['JobType','JobType'], ['Warranty','Warranty'],
    ['Recieved_By','Recieved_By'], ['Assigned_To','Assigned_To'], ['Defects','Defects'],
    ['Not_Repaired_Reason','Not_Repaired_Reason'], ['Open_Date','Open_Date'],
    ['Ready For Delivery Date','Ready For Delivery Date'], ['Aging Month','Aging Month'],
    ['Aging Days','Aging Days'], ['Customer_Type','Customer_Type'], ['Customer_Name','Customer_Name'],
    ['Customer_Mobile','Customer_Mobile'], ['Customer_Phone','Customer_Phone'], ['Aging Days Group','Aging Days Group']
  ];
  function q(id){ return document.getElementById(id); }
  function clean(v){ return String(v ?? '').trim(); }
  function esc(v){ return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }
  function unique(arr){ return [...new Set((arr||[]).map(clean).filter(Boolean))].sort((a,b)=>a.localeCompare(b)); }
  /* [dedup] orphan helper pct removed */
  /* [dedup] orphan helper setText removed */
  function getRows(name){ try{ return Array.isArray(window[name]) ? window[name] : (eval('typeof '+name+'!=="undefined" ? '+name+' : []')); }catch(e){ return []; } }
  /* [dedup] orphan helper rowValue removed */
  /* [dedup] orphan helper exportRows removed */
  function fixGspnStageDropList(){
    const st=q('stageFilter'); if(!st) return;
    st.removeAttribute('multiple');
    st.size = 1;
    const label=st.closest('div')?.querySelector('.filter-label'); if(label) label.textContent='Stage';
    const rows=getRows('allRows');
    const current=clean(st.value);
    const opts=['<option value="">All Stages</option>'].concat(unique(rows.map(r=>r.Stage)).map(v=>`<option value="${esc(v)}">${esc(v)}</option>`));
    st.innerHTML=opts.join('');
    if([...st.options].some(o=>o.value===current)) st.value=current;
  }
  function selectedMulti(id){ const el=q(id); if(!el) return []; const vals=[...el.selectedOptions].map(o=>o.value); return (!vals.length || vals.includes(ALL)) ? [] : vals; }
  function selectedStage(){ const el=q('stageFilter'); if(!el) return []; const v=clean(el.value); return (!v || v===ALL) ? [] : [v]; }
  function rebuildGspnFilters(){
    const rows=getRows('allRows');
    function fillMulti(id, values, label){ const el=q(id); if(!el) return; const selected=selectedMulti(id); el.innerHTML=[`<option value="${ALL}" ${selected.length?'':'selected'}>${label}</option>`].concat(unique(values).map(v=>`<option value="${esc(v)}" ${selected.includes(v)?'selected':''}>${esc(v)}</option>`)).join(''); }
    fillMulti('branchFilter', rows.map(r=>r.GSPN_Branch), 'All Branches');
    fillMulti('warrantyFilter', rows.map(r=>r['GSPN Warranty']), 'All GSPN Warranty');
    fillMulti('jobTypeFilter', rows.map(r=>r['GSPN JobType']||r.JobType||r['Job Type']), 'All GSPN JobType');
    fillMulti('alertFilter', ['Failed - LTP','Failed - TAT','Fix Today','Watch','On Track','Review','Excluded','Done'], 'All KPI Alerts');
    fixGspnStageDropList();
  }
  window.refreshFilterLists = rebuildGspnFilters;
  window.getFilteredRows = function(){
    const rows=getRows('allRows');
    const branches=selectedMulti('branchFilter'), stages=selectedStage(), warranties=selectedMulti('warrantyFilter'), alerts=selectedMulti('alertFilter'), jobTypes=selectedMulti('jobTypeFilter');
    const qv=clean(q('searchBox')?.value).toLowerCase();
    const fromDate = (typeof appliedFromDate !== 'undefined') ? appliedFromDate : null;
    const toDate = (typeof appliedToDate !== 'undefined') ? appliedToDate : null;
    return rows.filter(r=>{
      if(branches.length && !branches.includes(r.GSPN_Branch)) return false;
      if(stages.length && !stages.includes(r.Stage)) return false;
      if(warranties.length && !warranties.includes(r['GSPN Warranty'])) return false;
      if(alerts.length && !alerts.includes(r.KPIAlert)) return false;
      if(jobTypes.length && !jobTypes.includes(clean(r['GSPN JobType']||r.JobType||r['Job Type']))) return false;
      if(fromDate && (!r.GSPN_Open_Date_Value || r.GSPN_Open_Date_Value < dateOnlyTime(fromDate))) return false;
      if(toDate && (!r.GSPN_Open_Date_Value || r.GSPN_Open_Date_Value > dateOnlyTime(toDate))) return false;
      if(typeof quickFilter !== 'undefined' && quickFilter){
        if(quickFilter==='Open' && r.StatusFinal!=='Open') return false;
        if(quickFilter==='Closed' && !(r.StatusFinal==='Closed'||r.StatusFinal==='Ready')) return false;
        if(quickFilter==='Failed' && !clean(r.KPIResult).startsWith('Failed')) return false;
        if(quickFilter==='Failed - LTP' && r.KPIResult!=='Failed - LTP') return false;
        if(quickFilter==='Failed - LTP In Warranty' && (r.KPIResult!=='Failed - LTP' || !isInWarrantyCase(r))) return false;
        if(quickFilter==='Failed - LTP Out Warranty' && (r.KPIResult!=='Failed - LTP' || !isOutWarrantyCase(r))) return false;
        if(quickFilter==='Failed - TAT' && r.KPIResult!=='Failed - TAT') return false;
        if(['Fix Today','Watch','On Track','Review','Done','Excluded'].includes(quickFilter) && r.KPIAlert!==quickFilter) return false;
        if(typeof quickFilter==='object'){
          if(quickFilter.type==='branch' && r.GSPN_Branch!==quickFilter.value) return false;
          if(quickFilter.type==='gspnStatus' && r.GSPN_Status!==quickFilter.value) return false;
        }
      }
      if(qv){ const hay=[r['SO NO#'],r.Job_Number,r.Model,r['GSPN Serial'],r.GSPN_Status,r.GSPN_Branch,r.Stage,r['GSPN Warranty']].join(' ').toLowerCase(); if(!hay.includes(qv)) return false; }
      return true;
    });
  };
  window.resetFiltersToAll = function(){
    ['branchFilter','warrantyFilter','alertFilter','jobTypeFilter'].forEach(id=>{ const el=q(id); if(el) [...el.options].forEach(o=>o.selected=o.value===ALL); });
    if(q('stageFilter')) q('stageFilter').value='';
    if(q('fromDate')) q('fromDate').value=''; if(q('toDate')) q('toDate').value=''; if(q('searchBox')) q('searchBox').value='';
    try{ appliedFromDate=null; appliedToDate=null; quickFilter=null; }catch(e){}
  };
  /* [dedup] superseded exportTableExcel definition removed (was L7832) */
  const palette=['#ff4d2e','#0f4c81','#00a6a6','#7030a0','#70ad47','#f59e0b','#c00000','#38bdf8','#84cc16','#f97316','#6366f1','#14b8a6'];
  /* [dedup] orphan helper chart removed */
  /* [dedup] orphan helper top removed */
  /* [dedup] superseded updateCharts definition removed (was L7845) */
  function fixSkyQueueOptions(){
    const qf=q('skyQueueFilter'); if(qf){ const keep=SKY_ALLOWED_QUEUES.includes(qf.value)?qf.value:''; qf.innerHTML='<option value="">All Queue</option>'+SKY_ALLOWED_QUEUES.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join(''); qf.value=keep; }
    const bq=q('skyBrandChartQueueFilter'); if(bq){ const keep=SKY_ALLOWED_QUEUES.includes(bq.value)?bq.value:''; bq.innerHTML='<option value="">All Queues</option>'+SKY_ALLOWED_QUEUES.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join(''); bq.value=keep; }
  }
  /* [dedup] orphan helper skyRowsSafe removed */
  /* [dedup] orphan helper skyAging removed */
  /* [dedup] superseded getSkyFilteredRows definition removed (was L7861) */
  /* [dedup] orphan helper refreshSkyFiltersV2 removed */
  function ensureSkyStatusChart(){
    const grid=q('skyChartsSection'); if(!grid) return;
    ['skyStageChart','skyBranchChart','skyReadyAgingChart','skyStageAllChart'].forEach(id=>{ const sec=q(id)?.closest('section'); if(sec) sec.remove(); });
    if(!q('skyStatusChart')){
      const sec=document.createElement('section'); sec.className='chart-card'; sec.innerHTML='<h2>SKY Cases by Status</h2><div class="sky-chart-summary" id="skyStatusSummary"></div><div class="chart-box"><canvas id="skyStatusChart"></canvas></div>'; grid.appendChild(sec);
    }
  }
  /* [dedup] orphan helper setSummary removed */
  /* [dedup] superseded updateSkyCharts definition removed (was L7889) */
  /* [dedup] superseded renderSky definition removed (was L7901) */
  /* [dedup] superseded exportSkyExcel definition removed (was L7909) */
  function boot(){ fixGspnStageDropList(); fixSkyQueueOptions(); ensureSkyStatusChart(); const st=q('stageFilter'); if(st && !st.__v2){ st.__v2=true; st.onchange=function(){ try{quickFilter=null;}catch(e){}; if(typeof render==='function') render(); }; } if(typeof render==='function') render(); if(q('skyPage') && q('skyPage').style.display!=='none') renderSky(); }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,100)); window.addEventListener('load',()=>setTimeout(boot,300));
})();


/* ===== user-requested-v3-script ===== */

(function(){
  const ALL = (typeof ALL_VALUE !== 'undefined' ? ALL_VALUE : '__ALL__');
  const SKY_ALLOWED_QUEUES = ['Open_Cases','Ready For Delivery Cases'];
  const CHART_COLORS = ['#ff4d2e','#0f4c81','#00a6a6','#7030a0','#70ad47','#f59e0b','#c00000','#38bdf8','#84cc16','#f97316','#6366f1','#14b8a6','#fb7185','#22c55e','#a78bfa'];
  const LABEL_PLUGIN_ID = 'v3RequestedCaseLabels';

  function q(id){ return document.getElementById(id); }
  function txt(v){ return String(v ?? '').trim(); }
  function esc(v){ return String(v ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s])); }
  function pct(n,d){ n=Number(n)||0; d=Number(d)||0; return d ? ((n*100/d).toFixed(1).replace(/\.0$/,'')) : '0'; }
  function unique(arr){ return [...new Set((arr||[]).map(txt).filter(Boolean))].sort((a,b)=>a.localeCompare(b)); }
  function setText(id,val){ const el=q(id); if(el) el.textContent=val; }
  function getRows(name){ try{ return Array.isArray(window[name]) ? window[name] : []; }catch(e){ return []; } }
  function val(r,key){
    if(!r) return '';
    if(Object.prototype.hasOwnProperty.call(r,key)) return r[key];
    const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
    const wanted=norm(key); const found=Object.keys(r).find(k=>norm(k)===wanted);
    if(found) return r[found];
    if(key==='Aging Days') return r['Aging Days'] ?? r.Aging_Days ?? r.AgingDays ?? '';
    if(key==='Aging Days Group') return r['Aging Days Group'] ?? r.Aging_Days_Group ?? r.AgingDaysGroup ?? r.Aging_Group ?? '';
    return '';
  }

  function selectedMulti(id){ const el=q(id); if(!el) return []; const vals=[...el.selectedOptions].map(o=>o.value).filter(Boolean); return (!vals.length || vals.includes(ALL)) ? [] : vals; }
  /* [dedup] orphan helper selectedSingle removed */

  /* GSPN Stage as multiple-select dropdown */
  function stageOptionsFromRows(){ return unique(getRows('allRows').map(r=>r.Stage)); }
  function fillGspnStageOptions(){
    const st=q('stageFilter'); if(!st) return;
    st.setAttribute('multiple','multiple'); st.size = Math.min(Math.max(stageOptionsFromRows().length + 1, 2), 8);
    const selected=selectedMulti('stageFilter');
    st.innerHTML = [`<option value="${ALL}" ${selected.length?'':'selected'}>All Stages</option>`]
      .concat(stageOptionsFromRows().map(v=>`<option value="${esc(v)}" ${selected.includes(v)?'selected':''}>${esc(v)}</option>`)).join('');
    const label=st.closest('div')?.querySelector('.filter-label'); if(label) label.textContent='Stage - multiple select';
  }
  function closeStagePanel(){ document.querySelectorAll('.v3-stage-filter-panel.open').forEach(p=>p.classList.remove('open')); }
  document.addEventListener('click', closeStagePanel);
  window.addEventListener('resize', closeStagePanel, true);
  window.addEventListener('scroll', closeStagePanel, true);
  function ensureGspnStageDropdown(){
    const select=q('stageFilter'); if(!select) return; fillGspnStageOptions(); select.style.display='none';
    let wrap=q('stageFilter_v3_wrap');
    if(!wrap){ wrap=document.createElement('div'); wrap.id='stageFilter_v3_wrap'; wrap.className='v3-stage-filter-wrap'; select.insertAdjacentElement('afterend', wrap); }
    let btn=wrap.querySelector('.v3-stage-filter-btn'); if(!btn){ btn=document.createElement('button'); btn.type='button'; btn.className='v3-stage-filter-btn'; wrap.appendChild(btn); }
    let panel=q('stageFilter_v3_panel'); if(!panel){ panel=document.createElement('div'); panel.id='stageFilter_v3_panel'; panel.className='v3-stage-filter-panel'; document.body.appendChild(panel); }
    function buttonLabel(){ const selected=selectedMulti('stageFilter'); btn.textContent = selected.length ? (selected.length>2 ? `${selected.length} selected` : selected.join(', ')) : '(Select All)'; btn.title=btn.textContent; }
    function position(){ const r=btn.getBoundingClientRect(); const w=Math.min(360, window.innerWidth-24); let left=Math.min(Math.max(12,r.left), window.innerWidth-w-12); let top=r.bottom+6; const maxH=Math.min(390, window.innerHeight-24); if(top+maxH>window.innerHeight) top=Math.max(12,r.top-maxH-6); panel.style.left=left+'px'; panel.style.top=top+'px'; panel.style.width=w+'px'; panel.style.maxHeight=maxH+'px'; }
    function applyValues(values){ const set=new Set(values||[]); [...select.options].forEach(o=>o.selected = set.size ? set.has(o.value) : o.value===ALL); if(![...select.selectedOptions].length && select.options[0]) select.options[0].selected=true; buttonLabel(); try{ quickFilter=null; }catch(e){} if(typeof render==='function') render(); }
    function draw(temp, filter){
      const term=(filter||'').toLowerCase(); const opts=[...select.options].map(o=>({value:o.value,text:o.textContent||o.value})).filter(o=>!term || o.text.toLowerCase().includes(term));
      panel.innerHTML=`<input type="text" placeholder="Search"><div class="v3-stage-filter-list">${opts.map(o=>`<label class="v3-stage-filter-option"><input type="checkbox" data-value="${esc(o.value)}" ${temp.has(o.value)?'checked':''}><span>${esc(o.text)}</span></label>`).join('')}</div><div class="v3-stage-filter-actions"><button type="button" class="ok">OK</button><button type="button" class="cancel">Cancel</button></div>`;
      const search=panel.querySelector('input[type="text"]'); search.value=filter||''; search.oninput=()=>draw(temp, search.value);
      panel.querySelectorAll('input[type="checkbox"]').forEach(cb=>{ cb.onchange=()=>{ const v=cb.getAttribute('data-value'); if(v===ALL){ temp=cb.checked?new Set([ALL]):new Set(); } else { temp.delete(ALL); cb.checked?temp.add(v):temp.delete(v); if(!temp.size) temp.add(ALL); } draw(temp, search.value); setTimeout(()=>panel.querySelector('input[type="text"]')?.focus(),0); }; });
      panel.querySelector('.cancel').onclick=()=>panel.classList.remove('open');
      panel.querySelector('.ok').onclick=()=>{ panel.classList.remove('open'); applyValues([...temp]); };
    }
    btn.onclick=(e)=>{ e.stopPropagation(); const open=panel.classList.contains('open'); closeStagePanel(); if(open) return; let selected=[...select.selectedOptions].map(o=>o.value); let temp=new Set(selected.length?selected:[ALL]); if(!temp.size || temp.has(ALL)) temp=new Set([ALL]); draw(temp,''); position(); panel.classList.add('open'); setTimeout(()=>panel.querySelector('input[type="text"]')?.focus(),0); };
    panel.onclick=e=>e.stopPropagation(); buttonLabel();
  }

  /* Override GSPN filtering to support multiple Stage selections */
  const oldGetFilteredRows = window.getFilteredRows;
  window.getFilteredRows = function(){
    const rows=getRows('allRows');
    if(!rows.length && typeof oldGetFilteredRows==='function') return oldGetFilteredRows();
    const branches=selectedMulti('branchFilter'), stages=selectedMulti('stageFilter'), warranties=selectedMulti('warrantyFilter'), alerts=selectedMulti('alertFilter'), jobTypes=selectedMulti('jobTypeFilter');
    const qv=txt(q('searchBox')?.value).toLowerCase();
    const fromDate = (typeof appliedFromDate !== 'undefined') ? appliedFromDate : null;
    const toDate = (typeof appliedToDate !== 'undefined') ? appliedToDate : null;
    return rows.filter(r=>{
      if(branches.length && !branches.includes(r.GSPN_Branch)) return false;
      if(stages.length && !stages.includes(r.Stage)) return false;
      if(warranties.length && !warranties.includes(r['GSPN Warranty'])) return false;
      if(alerts.length && !alerts.includes(r.KPIAlert)) return false;
      if(jobTypes.length && !jobTypes.includes(txt(r['GSPN JobType']||r.JobType||r['Job Type']))) return false;
      if(fromDate && (!r.GSPN_Open_Date_Value || r.GSPN_Open_Date_Value < dateOnlyTime(fromDate))) return false;
      if(toDate && (!r.GSPN_Open_Date_Value || r.GSPN_Open_Date_Value > dateOnlyTime(toDate))) return false;
      if(typeof quickFilter !== 'undefined' && quickFilter){
        if(quickFilter==='Open' && r.StatusFinal!=='Open') return false;
        if(quickFilter==='Closed' && !(r.StatusFinal==='Closed'||r.StatusFinal==='Ready')) return false;
        if(quickFilter==='Failed' && !txt(r.KPIResult).startsWith('Failed')) return false;
        if(quickFilter==='Failed - LTP' && r.KPIResult!=='Failed - LTP') return false;
        if(quickFilter==='Failed - LTP In Warranty' && (r.KPIResult!=='Failed - LTP' || !isInWarrantyCase(r))) return false;
        if(quickFilter==='Failed - LTP Out Warranty' && (r.KPIResult!=='Failed - LTP' || !isOutWarrantyCase(r))) return false;
        if(quickFilter==='Failed - TAT' && r.KPIResult!=='Failed - TAT') return false;
        if(['Fix Today','Watch','On Track','Review','Done','Excluded'].includes(quickFilter) && r.KPIAlert!==quickFilter) return false;
        if(typeof quickFilter==='object'){
          if(quickFilter.type==='branch' && r.GSPN_Branch!==quickFilter.value) return false;
          if(quickFilter.type==='gspnStatus' && r.GSPN_Status!==quickFilter.value) return false;
        }
      }
      if(qv){ const hay=[r['SO NO#'],r.Job_Number,r.Model,r['GSPN Serial'],r.GSPN_Status,r.GSPN_Branch,r.Stage,r['GSPN Warranty']].join(' ').toLowerCase(); if(!hay.includes(qv)) return false; }
      return true;
    });
  };

  /* Chart helpers with clear labels above columns */
  /* [dedup] orphan helper registerLabels removed */
  /* [dedup] orphan helper destroy removed */
  /* [dedup] orphan helper barChart removed */
  /* [dedup] orphan helper doughnutChart removed */
  /* [dedup] orphan helper countBy removed */
  /* [dedup] orphan helper topAging removed */
  /* [dedup] orphan helper avgBy removed */

  /* [dedup] superseded updateCharts definition removed (was L8037) */

  /* SKY: normalize Aging Days Group and keep only requested bottom charts */
  /* [dedup] orphan helper normalizeSkyRow removed */
  /* [dedup] orphan helper skySourceRows removed */
  /* [dedup] orphan helper skyAging removed */
  function skyAgingDaysValue(r){
    // Strict source: use the actual Aging Days value only. Do not infer from Aging Days Group or Open Date.
    const raw = val(r,'Aging Days') || val(r,'Aging_Days') || val(r,'AgingDays') || val(r,'Aging');
    const n = Number(String(raw ?? '').replace(/[^0-9.-]/g,''));
    return Number.isFinite(n) ? n : null;
  }
  function isSkyOpen4Plus(r){ return txt(r.Queue)==='Open_Cases' && skyAgingDaysValue(r) !== null && skyAgingDaysValue(r) >= 4; }
  /* [dedup] orphan helper refreshSkyFilters removed */
  /* [dedup] superseded getSkyFilteredRows definition removed (was L8072) */
  function ensureSkyChartsDom(){
    const grid=q('skyChartsSection'); if(!grid) return;
    const wanted={ skyStatusChart:'SKY Cases by Status', skyQueueChart:'SKY Cases by Queue', skyBrandChart:'SKY Cases by Brand' };
    [...grid.querySelectorAll('section.chart-card, .chart-card')].forEach(sec=>{ const canvas=sec.querySelector('canvas'); if(!canvas || !wanted[canvas.id]) sec.remove(); });
    ['skyStatusChart','skyQueueChart','skyBrandChart'].forEach(id=>{
      if(!q(id)){
        const sec=document.createElement('section'); sec.className='chart-card';
        const summaryId=id.replace('Chart','Summary');
        sec.innerHTML=`<h2>${wanted[id]}</h2><div class="sky-chart-summary" id="${summaryId}"></div><div class="chart-box"><canvas id="${id}"></canvas></div>`;
        grid.appendChild(sec);
      } else {
        const h=q(id).closest('section,.chart-card')?.querySelector('h2'); if(h) h.childNodes[0].nodeValue=wanted[id];
      }
    });
    const order=['skyStatusChart','skyQueueChart','skyBrandChart']; order.forEach(id=>{ const sec=q(id)?.closest('section,.chart-card'); if(sec) grid.appendChild(sec); });
  }
  /* [dedup] orphan helper setSummary removed */
  /* [dedup] superseded updateSkyCharts definition removed (was L8102) */
  window.renderSky = function(){
    ensureSkyChartsDom();
    const rows=window.getSkyFilteredRows(); window.currentSkyRows=rows;
    const total=rows.length, openRows=rows.filter(r=>r.Queue==='Open_Cases'), open=openRows.length, open4Plus=openRows.filter(isSkyOpen4Plus).length, ready=rows.filter(r=>r.Queue==='Ready For Delivery Cases').length, samsung=rows.filter(r=>txt(r.Brand).toLowerCase()==='samsung').length, apple=rows.filter(r=>txt(r.Brand).toLowerCase()==='apple').length;
    setText('skyTotalCases',total); setText('skyOpenCases',open); setText('skyOpenPercent',`${pct(open,total)}% of Total`); setText('skyOpen4PlusCases',open4Plus); setText('skyOpen4PlusPercent',`${pct(open4Plus,open)}% of Open`); setText('skyReadyCases',ready); setText('skyReadyPercent',`${pct(ready,total)}% of Total`); setText('skySamsungCases',samsung); setText('skySamsungPercent',`${pct(samsung,total)}% of Total`); setText('skyAppleCases',apple); setText('skyApplePercent',`${pct(apple,total)}% of Total`);
    const cols=[['Queue','Queue'],['Brand','Brand'],['Branch','Branch'],['Open_Date_Display','Open Date'],['Aging Days','Aging Days'],['Aging Days Group','Aging Days Group'],['Job_Number','Job Number'],['Status','Status'],['Stage','Stage'],['Item English Name','Item English Name'],['Price','Price']];
    if(typeof renderTable==='function') renderTable('skyCasesTable', rows.slice(0,1000), cols, false);
    updateSkyCharts(rows);
  };
  /* [dedup] superseded setSkyOpen4PlusCases definition removed (was L8120) */
  /* [dedup] superseded setSkyQueue definition removed (was L8126) */
  /* [dedup] superseded setSkyBrand definition removed (was L8132) */

  const previousClearSkyFilters = window.clearSkyFilters;
  window.clearSkyFilters = function(scroll){
    window.__skyOpen4PlusOnly = false;
    if(typeof previousClearSkyFilters === 'function') return previousClearSkyFilters(scroll);
    if(typeof renderSky === 'function') renderSky();
    if(scroll && typeof scrollToElement === 'function') scrollToElement('skyCasesTable');
  };

  function boot(){
    ensureGspnStageDropdown(); ensureSkyChartsDom();
    const st=q('stageFilter'); if(st){ st.onchange=function(){ try{ quickFilter=null; }catch(e){}; if(typeof render==='function') render(); }; }
    if(typeof render==='function') render();
    if(q('skyPage') && q('skyPage').style.display!=='none') renderSky();
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,700));
  window.addEventListener('load',()=>setTimeout(boot,500));
})();


/* ===== gspn-final-v4-script ===== */

(function(){
  const ALL = (typeof ALL_VALUE !== 'undefined' ? ALL_VALUE : '__ALL__');
  const COLORS = ['#ff4d2e','#15598d','#0ea5a5','#7b35ad','#70ad47','#f59e0b','#c00000','#38bdf8','#84cc16','#f97316','#6366f1','#14b8a6'];
  const LABEL_ID = 'gspnFinalV4Labels';
  function q(id){ return document.getElementById(id); }
  function txt(v){ return String(v ?? '').trim(); }
  function esc(v){ return txt(v).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s])); }
  /* [dedup] orphan helper pct removed */
  function rows(){ return Array.isArray(window.allRows) ? window.allRows : []; }
  function val(r,k){ if(!r) return ''; if(Object.prototype.hasOwnProperty.call(r,k)) return r[k]; const n=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,''); const f=Object.keys(r).find(x=>n(x)===n(k)); return f ? r[f] : ''; }
  function uniq(a){ return [...new Set((a||[]).map(txt).filter(Boolean))].sort((x,y)=>x.localeCompare(y)); }
  function selectedStage(){ const el=q('stageFilter'); if(!el) return []; const vals=[...el.selectedOptions].map(o=>o.value).filter(Boolean); return (!vals.length || vals.includes(ALL)) ? [] : vals; }
  function stageValues(){ const fromRows=uniq(rows().map(r=>val(r,'Stage') || val(r,'GSPN Stage') || val(r,'GSPN_Stage'))); const select=q('stageFilter'); const fromSelect=select ? [...select.options].map(o=>o.value).filter(v=>v && v!==ALL) : []; return uniq(fromRows.length ? fromRows : fromSelect); }
  function fillStageOptions(keep){ const el=q('stageFilter'); if(!el) return; const sel=new Set(keep || selectedStage()); const vals=stageValues(); el.setAttribute('multiple','multiple'); el.innerHTML = `<option value="${ALL}" ${sel.size?'':'selected'}>All Stages</option>` + vals.map(v=>`<option value="${esc(v)}" ${sel.has(v)?'selected':''}>${esc(v)}</option>`).join(''); }
  function setButtonText(){ const btn=q('stageFilter_v4_btn'); if(!btn) return; const s=selectedStage(); btn.textContent = s.length ? (s.length > 2 ? `${s.length} selected` : s.join(', ')) : '(Select All)'; btn.title=btn.textContent; }
  function close(){ const p=q('stageFilter_v4_panel'); if(p) p.classList.remove('open'); }
  function position(){ const btn=q('stageFilter_v4_btn'), p=q('stageFilter_v4_panel'); if(!btn||!p) return; const r=btn.getBoundingClientRect(); const w=Math.min(450, window.innerWidth-24); let left=Math.min(Math.max(12,r.left), window.innerWidth-w-12); let top=r.bottom+8; const h=Math.min(420, window.innerHeight-24); if(top+h>window.innerHeight) top=Math.max(12,r.top-h-8); p.style.left=left+'px'; p.style.top=top+'px'; p.style.width=w+'px'; p.style.maxHeight=h+'px'; }
  function apply(vals){ const el=q('stageFilter'); if(!el) return; const set=new Set((vals||[]).filter(Boolean)); [...el.options].forEach(o=>o.selected = set.size ? set.has(o.value) : o.value===ALL); if(![...el.selectedOptions].length && el.options[0]) el.options[0].selected=true; setButtonText(); try{ quickFilter=null; }catch(e){} if(typeof window.render==='function') window.render(); }
  function draw(temp, term){ const p=q('stageFilter_v4_panel'); if(!p) return; term=(term||'').toLowerCase(); const options=[{value:ALL,text:'All Stages'}].concat(stageValues().map(v=>({value:v,text:v}))).filter(o=>!term || o.text.toLowerCase().includes(term)); p.innerHTML = `<input class="v4-search" placeholder="Search" value="${esc(term)}"><div class="v4-list">${options.map(o=>`<label class="v4-option"><input type="checkbox" data-value="${esc(o.value)}" ${temp.has(o.value)?'checked':''}><span>${esc(o.text)}</span></label>`).join('')}</div><div class="v4-actions"><button type="button" class="ok">OK</button><button type="button" class="cancel">Cancel</button></div>`; const search=p.querySelector('.v4-search'); search.oninput=()=>draw(temp, search.value); p.querySelectorAll('input[type="checkbox"]').forEach(cb=>cb.onchange=()=>{ const v=cb.getAttribute('data-value'); if(v===ALL){ temp=cb.checked?new Set([ALL]):new Set(); } else { temp.delete(ALL); cb.checked?temp.add(v):temp.delete(v); if(!temp.size) temp.add(ALL); } draw(temp, search.value); }); p.querySelector('.cancel').onclick=close; p.querySelector('.ok').onclick=()=>{ close(); apply([...temp]); }; setTimeout(()=>p.querySelector('.v4-search')?.focus(),0); }
  function ensureStageDropdown(){ const el=q('stageFilter'); if(!el) return; const keep=selectedStage(); fillStageOptions(keep); el.style.display='none'; q('stageFilter_v3_wrap')?.remove(); q('stageFilter_v3_panel')?.remove(); let wrap=q('stageFilter_v4_wrap'); if(!wrap){ wrap=document.createElement('div'); wrap.id='stageFilter_v4_wrap'; el.insertAdjacentElement('afterend',wrap); } let btn=q('stageFilter_v4_btn'); if(!btn){ btn=document.createElement('button'); btn.type='button'; btn.id='stageFilter_v4_btn'; wrap.appendChild(btn); } let panel=q('stageFilter_v4_panel'); if(!panel){ panel=document.createElement('div'); panel.id='stageFilter_v4_panel'; document.body.appendChild(panel); } btn.onclick=e=>{ e.stopPropagation(); const open=panel.classList.contains('open'); close(); if(open) return; const s=selectedStage(); let temp=new Set(s.length?s:[ALL]); draw(temp,''); position(); panel.classList.add('open'); }; panel.onclick=e=>e.stopPropagation(); setButtonText(); }
  document.addEventListener('click', close); window.addEventListener('resize', close, true); window.addEventListener('scroll', close, true);
  /* [dedup] orphan helper countBy removed */
  /* [dedup] orphan helper avgBy removed */
  /* [dedup] orphan helper aging removed */
  /* [dedup] orphan helper destroy removed */
  /* [dedup] orphan helper registerLabels removed */
  /* [dedup] orphan helper makeBar removed */
  /* [dedup] orphan helper makeDoughnut removed */
  /* [dedup] superseded updateCharts definition removed (was L8188) */
  function boot(){ ensureStageDropdown(); if(typeof window.render==='function') window.render(); }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,900)); window.addEventListener('load',()=>setTimeout(boot,700));
})();


/* ===== sky-final-v5-script ===== */

(function(){
  const COLORS = ['#ff4d2e','#15598d','#0ea5a5','#7b35ad','#70ad47','#f59e0b','#c00000','#38bdf8','#84cc16','#f97316','#6366f1','#14b8a6'];
  const SKY_LABEL_ID = 'skyFinalV5SingleLabels';
  const REMOVE_TITLES = new Set([
    'Failed KPI Reasons %',
    'KPI Result Breakdown',
    'Open Cases per Branch',
    'Open Cases per Status',
    'Open Cases by Aging Bucket',
    'SKY Cases by Brand',
    'SKY Cases by Queue',
    'Ready For Delivery Cases - Aging Months',
    'Stage with Count Cases'
  ]);
  const REMOVE_CANVASES = new Set([
    'failedReasonChart','kpiChart','branchChart','techChart','agingChart','skyBrandChart','skyQueueChart','skyStageChart','skyBranchChart','skyReadyAgingChart','skyStageAllChart','repairDaysChart'
  ]);
  function q(id){ return document.getElementById(id); }
  function txt(v){ return String(v ?? '').trim(); }
  /* [dedup] orphan helper esc removed */
  /* [dedup] orphan helper pct removed */
  /* [dedup] orphan helper val removed */
  /* [dedup] orphan helper countBy removed */
  function destroyChart(id){
    try{ if(window.dashboardCharts && dashboardCharts[id]){ dashboardCharts[id].destroy(); delete dashboardCharts[id]; } }catch(e){}
  }
  /* [dedup] orphan helper cleanChartPlugins removed */
  /* [dedup] orphan helper makeBar removed */
  function ensureSkyChartsDom(){
    const grid=q('skyChartsSection'); if(!grid) return;
    [...grid.querySelectorAll('section.chart-card, .chart-card')].forEach(sec=>{
      const title=txt(sec.querySelector('h2')?.textContent).replace(/\s+/g,' ');
      const canvas=sec.querySelector('canvas');
      if((canvas && REMOVE_CANVASES.has(canvas.id)) || REMOVE_TITLES.has(title) || (canvas && !['skyStatusChart','skyOpenBranchChart'].includes(canvas.id))){
        if(canvas) destroyChart(canvas.id);
        sec.remove();
      }
    });
    const wanted=[['skyStatusChart','SKY Cases by Status','skyStatusSummary'],['skyOpenBranchChart','Open Cases per Branch','skyOpenBranchSummary']];
    wanted.forEach(([id,title,summary])=>{
      let canvas=q(id);
      if(!canvas){
        const sec=document.createElement('section'); sec.className='chart-card';
        sec.innerHTML=`<h2>${title}</h2><div class="sky-chart-summary" id="${summary}"></div><div class="chart-box"><canvas id="${id}"></canvas></div>`;
        grid.appendChild(sec);
      } else {
        const sec=canvas.closest('section,.chart-card'); const h=sec?.querySelector('h2'); if(h) h.textContent=title;
      }
    });
    wanted.forEach(([id])=>{ const sec=q(id)?.closest('section,.chart-card'); if(sec) grid.appendChild(sec); });
  }
  /* [dedup] orphan helper setSummary removed */
  /* [dedup] orphan helper openRowsOnly removed */
  const oldRenderSky = window.renderSky;
  /* [dedup] superseded updateSkyCharts definition removed (was L8300) */
  window.renderSky = function(){
    if(typeof oldRenderSky==='function') oldRenderSky.call(this);
    ensureSkyChartsDom();
    const rows=Array.isArray(window.currentSkyRows) ? window.currentSkyRows : (typeof window.getSkyFilteredRows==='function' ? window.getSkyFilteredRows() : []);
    window.updateSkyCharts(rows);
  };
  function boot(){ ensureSkyChartsDom(); if(q('skyPage') && q('skyPage').style.display!=='none') window.renderSky(); }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1200));
  window.addEventListener('load',()=>setTimeout(boot,900));
})();


/* ===== inline-script-47 ===== */

/* Final requested change: remove all charts from GSPN Tracking Cases tab only. */
(function(){
  const GSPN_CHART_IDS = [
    'failedReasonChart','kpiChart','branchChart','techChart','agingChart','repairDaysChart'
  ];
  function destroyGspnChart(id){
    try {
      if (window.dashboardCharts && window.dashboardCharts[id]) {
        window.dashboardCharts[id].destroy();
        delete window.dashboardCharts[id];
      }
    } catch(e) {}
  }
  function removeGspnChartsOnly(){
    const gspnPage = document.getElementById('gspnPage');
    if (!gspnPage) return;
    GSPN_CHART_IDS.forEach(id => {
      destroyGspnChart(id);
      const canvas = document.getElementById(id);
      const section = canvas && canvas.closest('section, .chart-card');
      if (section && gspnPage.contains(section)) section.remove();
      else if (canvas && gspnPage.contains(canvas)) canvas.remove();
    });
    const chartsSection = document.getElementById('chartsSection');
    if (chartsSection && gspnPage.contains(chartsSection)) chartsSection.remove();
    gspnPage.querySelectorAll('.charts-grid, .chart-card').forEach(el => el.remove());
    gspnPage.querySelectorAll('canvas').forEach(canvas => {
      const section = canvas.closest('section, .chart-card');
      if (section && gspnPage.contains(section)) section.remove();
      else canvas.remove();
    });
  }
  window.updateCharts = function(){ removeGspnChartsOnly(); };
  const previousRenderDashboard = window.renderDashboard;
  if (typeof previousRenderDashboard === 'function') {
    window.renderDashboard = function(){
      const result = previousRenderDashboard.apply(this, arguments);
      removeGspnChartsOnly();
      return result;
    };
  }
  document.addEventListener('DOMContentLoaded', removeGspnChartsOnly);
  window.addEventListener('load', once(removeGspnChartsOnly));
  requestAnimationFrame(removeGspnChartsOnly);
})();


/* ===== sky-requested-insights-script ===== */

(function(){
  const COLORS = ['#156082','#e97132','#196b24','#0f9ed5','#a02b93','#4ea72e','#f2c80f','#7f6000','#5b9bd5','#c00000','#7030a0','#00a6a6','#ff4d2e','#8dd17e','#4472c4','#ed7d31','#70ad47','#ffc000'];
  const DELIVERED = '__REMOVED_QUEUE__';
  let statusDrill = '';
  function byId(id){ return document.getElementById(id); }
  function text(v){ return String(v ?? '').trim(); }
  function esc(v){ return text(v).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s])); }
  function norm(s){ return text(s).toLowerCase().replace(/[^a-z0-9]/g,''); }
  function val(r,k){
    if(!r) return '';
    if(Object.prototype.hasOwnProperty.call(r,k)) return r[k];
    const nk=norm(k); const found=Object.keys(r).find(x=>norm(x)===nk);
    return found ? r[found] : '';
  }
  function pct(n,d){ n=Number(n)||0; d=Number(d)||0; return d ? Math.round((n*100/d)) + '%' : '0%'; }
  function destroyChart(id){ try{ if(window.dashboardCharts && dashboardCharts[id]){ dashboardCharts[id].destroy(); delete dashboardCharts[id]; } }catch(e){} }
  function allSkyRows(){ try{ if(Array.isArray(skyRows)) return skyRows; }catch(e){} return Array.isArray(window.skyRows) ? window.skyRows : []; }
  function removeDeliveredFromSource(){
    try{ if(Array.isArray(skyRows)){ skyRows = skyRows.filter(r => text(val(r,'Queue')) !== DELIVERED); } }catch(e){}
    if(Array.isArray(window.skyRows)) window.skyRows = window.skyRows.filter(r => text(val(r,'Queue')) !== DELIVERED);
    const q=byId('skyQueueFilter');
    if(q){
      [...q.options].forEach(o => { if(o.value === DELIVERED || o.textContent.trim() === DELIVERED) o.remove(); });
      if(![...q.options].some(o=>o.value==='Open_Cases')) q.insertAdjacentHTML('beforeend','<option value="Open_Cases">Open_Cases</option>');
      if(![...q.options].some(o=>o.value==='Ready For Delivery Cases')) q.insertAdjacentHTML('beforeend','<option value="Ready For Delivery Cases">Ready For Delivery Cases</option>');
      if(q.value===DELIVERED) q.value='';
    }
  }
  function baseFilteredRows(){
    removeDeliveredFromSource();
    let rows=[];
    try{ if(typeof window.getSkyFilteredRows==='function') rows=window.getSkyFilteredRows(); }catch(e){}
    if(!Array.isArray(rows) || !rows.length) rows=Array.isArray(window.currentSkyRows)?window.currentSkyRows:allSkyRows();
    rows=rows.filter(r=>text(val(r,'Queue'))!==DELIVERED);
    if(statusDrill) rows=rows.filter(r=>text(val(r,'Status'))===statusDrill && text(val(r,'Queue'))==='Open_Cases');
    return rows;
  }
  function countBy(rows, field){
    const map = new Map();
    (rows||[]).forEach(r=>{ const k=text(val(r,field)) || 'Blank'; map.set(k,(map.get(k)||0)+1); });
    return [...map.entries()].sort((a,b)=> b[1]-a[1] || a[0].localeCompare(b[0]));
  }
  function removeObsoleteSkyCharts(){
    const keep = new Set(['skyOpenBranchChart','skyOpenStatusChart']);
    document.querySelectorAll('#skyPage canvas').forEach(canvas => {
      if(!keep.has(canvas.id)){
        destroyChart(canvas.id);
        const section = canvas.closest('section,.chart-card');
        if(section) section.remove(); else canvas.remove();
      }
    });
    document.querySelectorAll('#skyPage .chart-card').forEach(card => {
      const canvas = card.querySelector('canvas');
      if(canvas && !keep.has(canvas.id)){ destroyChart(canvas.id); card.remove(); }
    });
  }
  function ensureDom(){
    const skyMain = document.querySelector('#skyPage main');
    if(!skyMain) return;
    removeDeliveredFromSource();
    removeObsoleteSkyCharts();
    let grid=byId('skyChartsSection');
    if(!grid){
      const casesSection=byId('skyCasesTable')?.closest('section');
      grid=document.createElement('div'); grid.id='skyChartsSection'; grid.className='charts-grid sky-charts sky-requested-insights';
      grid.innerHTML=`<section class="chart-card"><h2>Open_Cases Per Branch</h2><div class="sky-chart-summary" id="skyOpenBranchSummary"></div><div class="chart-box sky-open-branch-chart-box"><canvas id="skyOpenBranchChart"></canvas></div></section><section class="chart-card"><h2>Open_Cases Status</h2><div class="sky-chart-summary" id="skyOpenStatusSummary"></div><div class="chart-box sky-open-status-chart-box"><canvas id="skyOpenStatusChart"></canvas></div></section>`;
      (casesSection || skyMain.firstElementChild).insertAdjacentElement('afterend', grid);
    }
    const required=[['skyOpenBranchChart','Open_Cases Per Branch','skyOpenBranchSummary','sky-open-branch-chart-box'],['skyOpenStatusChart','Open_Cases Status','skyOpenStatusSummary','sky-open-status-chart-box']];
    required.forEach(([cid,title,sid,boxClass])=>{
      if(!byId(cid)){
        const sec=document.createElement('section'); sec.className='chart-card';
        sec.innerHTML=`<h2>${title}</h2><div class="sky-chart-summary" id="${sid}"></div><div class="chart-box ${boxClass}"><canvas id="${cid}"></canvas></div>`;
        grid.appendChild(sec);
      }
    });
    let tables=document.querySelector('#skyPage .sky-summary-tables');
    if(!tables){
      tables=document.createElement('div'); tables.className='grid sky-summary-tables';
      tables.innerHTML=`<section><h2>Open_Cases Per Stage</h2><div class="table-wrap sky-summary-table-wrap"><table id="skyOpenStageSummaryTable"></table></div></section><section><h2>Ready For Delivery Cases Per Branch</h2><div class="table-wrap sky-summary-table-wrap"><table id="skyReadyBranchSummaryTable"></table></div></section>`;
      grid.insertAdjacentElement('afterend', tables);
    }
    if(!byId('skyDrilldownNote')){
      const note=document.createElement('div'); note.id='skyDrilldownNote'; note.className='sky-drilldown-note';
      note.innerHTML='Status filter applied from chart. <button class="btn btn-light" type="button" onclick="window.clearSkyStatusDrilldown && window.clearSkyStatusDrilldown()">Clear Status Filter</button>';
      const cases=byId('skyCasesTable')?.closest('section'); if(cases) cases.insertAdjacentElement('beforebegin', note);
    }
  }
  function summary(id, arr, total){
    const el=byId(id); if(!el) return;
    el.innerHTML=arr.slice(0,8).map(([l,n])=>`<span class="sky-chart-chip">${esc(l)}: ${n} (${pct(n,total)})</span>`).join('');
  }
  function chartLabels(arr,total){ return arr.map(([l,n])=>`${l} (${pct(n,total)})`); }
  function makeBar(id, arr, title, horizontal){
    const canvas=byId(id); if(!canvas || !window.Chart) return;
    destroyChart(id); if(!window.dashboardCharts) window.dashboardCharts={};
    const total=arr.reduce((a,x)=>a+Number(x[1]||0),0);
    const labels=chartLabels(arr,total), values=arr.map(x=>x[1]);
    const max=Math.max(...values,0);
    dashboardCharts[id]=__safeNewChart(canvas,{type:'bar',data:{labels,datasets:[{label:title,data:values,backgroundColor:values.map((_,i)=>COLORS[i%COLORS.length]),borderColor:values.map((_,i)=>COLORS[i%COLORS.length]),borderWidth:1,borderRadius:horizontal?6:5,maxBarThickness:horizontal?24:46}]},options:{animation:false,responsive:true,maintainAspectRatio:false,indexAxis:horizontal?'y':'x',layout:{padding:{top:24,right:horizontal?56:24,bottom:20,left:horizontal?8:8}},onClick:(evt,elements)=>{ if(!elements.length) return; const raw=arr[elements[0].index][0]; if(id==='skyOpenBranchChart') setMultiFilter('skyBranchFilter', raw, true); if(id==='skyOpenStatusChart'){ statusDrill=raw; renderSkyRequestedInsights(true); } },plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>`${title}: ${ctx.raw} (${pct(ctx.raw,total)})`}}},scales:{x:{beginAtZero:true,suggestedMax:horizontal?max*1.22+1:undefined,ticks:{autoSkip:false,precision:0,maxRotation:horizontal?0:45,minRotation:0},grid:{color:'rgba(120,120,120,.25)'}},y:{beginAtZero:!horizontal,suggestedMax:horizontal?undefined:max*1.22+1,ticks:{autoSkip:false,precision:0,callback:function(value){ const label=this.getLabelForValue?this.getLabelForValue(value):value; return horizontal && String(label).length>34 ? String(label).slice(0,33)+'…' : label; }},grid:{color:'rgba(120,120,120,.25)'}}}},plugins:[{id:id+'Labels',afterDatasetsDraw(chart){const {ctx}=chart; ctx.save(); ctx.font='bold 12px Calibri, Arial'; ctx.fillStyle='#333'; ctx.textBaseline='middle'; const meta=chart.getDatasetMeta(0); meta.data.forEach((bar,i)=>{const n=values[i]; if(!n) return; const p=bar.tooltipPosition(); ctx.textAlign=horizontal?'left':'center'; ctx.fillText(String(n), horizontal?Math.min(p.x+7,chart.chartArea.right-22):p.x, horizontal?p.y:Math.max(14,p.y-9));}); ctx.restore();}}]});
  }
  function setMultiFilter(id, value, setOpen){
    const el=byId(id); if(el){ [...el.options].forEach(o=>o.selected=(o.value===value || o.textContent.trim()===value)); }
    if(setOpen){ const q=byId('skyQueueFilter'); if(q) q.value='Open_Cases'; }
    statusDrill='';
    if(typeof window.renderSky==='function') window.renderSky();
    const t=byId('skyCasesTable'); if(t && typeof scrollToElement==='function') scrollToElement('skyCasesTable');
  }
  function renderPivot(tableId, labelName, arr){
    const table=byId(tableId); if(!table) return;
    const total=arr.reduce((a,x)=>a+Number(x[1]||0),0);
    table.className='sky-pivot-table';
    table.innerHTML=`<thead><tr><th>${esc(labelName)}</th><th>Count of Cases</th><th>% of Grand Total</th></tr></thead><tbody>${arr.map(([l,n])=>`<tr><td>${esc(l)}</td><td class="num">${n}</td><td class="pct">${pct(n,total)}</td></tr>`).join('')}</tbody><tfoot><tr><td>Grand Total</td><td class="num">${total}</td><td class="pct">100%</td></tr></tfoot>`;
  }
  function updateCaseTableForStatus(rows){
    const note=byId('skyDrilldownNote');
    if(note){ note.style.display=statusDrill?'block':'none'; note.firstChild.textContent = statusDrill ? `Status filter applied: ${statusDrill}. ` : 'Status filter applied from chart. '; }
    if(statusDrill && typeof window.renderTable==='function'){
      const cols=[["Queue","Queue"],["Brand","Brand"],["Branch","Branch"],["Open_Date_Display","Open Date"],["Aging_Days","Aging Days"],["Job_Number","Job Number"],["Status","Status"],["Stage","Stage"],["Item English Name","Item English Name"],["Price","Price"]];
      window.currentSkyRows=rows;
      renderTable('skyCasesTable', rows.slice(0,1000), cols, false);
    }
  }
  function renderSkyRequestedInsights(updateTable){
    ensureDom();
    let rows=baseFilteredRows();
    const openRows=rows.filter(r=>text(val(r,'Queue'))==='Open_Cases');
    const readyRows=rows.filter(r=>text(val(r,'Queue'))==='Ready For Delivery Cases');
    const branch=countBy(openRows,'Branch');
    const status=countBy(openRows,'Status');
    const stage=countBy(openRows,'Stage');
    const readyBranch=countBy(readyRows,'Branch');
    summary('skyOpenBranchSummary',branch,openRows.length);
    summary('skyOpenStatusSummary',status,openRows.length);
    makeBar('skyOpenBranchChart',branch,'Open_Cases',false);
    makeBar('skyOpenStatusChart',status,'Open_Cases',true);
    renderPivot('skyOpenStageSummaryTable','Stage',stage);
    renderPivot('skyReadyBranchSummaryTable','Branch',readyBranch);
    if(updateTable) updateCaseTableForStatus(rows); /* TABLE-FIX: respect updateTable param */
  }
  window.clearSkyStatusDrilldown=function(){ statusDrill=''; if(typeof window.renderSky==='function') window.renderSky(); };
  const oldRender = window.renderSky;
  /* [dedup] superseded updateSkyCharts definition removed (was L8515) */
  window.renderSky = function(){
    removeDeliveredFromSource();
    const result = typeof oldRender === 'function' ? oldRender.apply(this, arguments) : undefined;
    removeDeliveredFromSource();
    /* CHART-FIX: duplicate renderSkyRequestedInsights removed – oldRender already calls it via updateSkyCharts */
    return result;
  };
  function boot(){ removeDeliveredFromSource(); ensureDom(); renderSkyRequestedInsights(false); }
  document.addEventListener('DOMContentLoaded',()=>{ setTimeout(boot,250); });
  window.addEventListener('load',()=>{ setTimeout(boot,600); });
})();


/* ===== sky-v26-layout-clear-script ===== */

(function(){
  const DELIVERED='__REMOVED_QUEUE__';
  const COLORS=['#2563eb','#16a34a','#f97316','#7c3aed','#dc2626','#0891b2','#ca8a04','#4f46e5','#db2777','#0f766e','#65a30d','#9333ea'];
  function byId(id){ return document.getElementById(id); }
  function text(v){ return v==null?'':String(v).trim(); }
  function esc(s){ return text(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function val(r,k){ return r ? (r[k] ?? r[String(k).replace(/_/g,' ')] ?? '') : ''; }
  function pct(n,t){ return t ? Math.round((Number(n||0)/t)*100)+'%' : '0%'; }
  function allSky(){ return Array.isArray(window.skyRows)?window.skyRows:(Array.isArray(window.currentSkyRows)?window.currentSkyRows:[]); }
  function noDeliveredRows(rows){ return (Array.isArray(rows)?rows:[]).filter(r=>text(val(r,'Queue'))!==DELIVERED); }
  function removeDeliveredQueue(){
    try{ if(Array.isArray(window.skyRows)) window.skyRows=window.skyRows.filter(r=>text(val(r,'Queue'))!==DELIVERED); }catch(e){}
    try{ if(Array.isArray(window.currentSkyRows)) window.currentSkyRows=window.currentSkyRows.filter(r=>text(val(r,'Queue'))!==DELIVERED); }catch(e){}
    ['skyQueueFilter','skyBrandChartQueueFilter','skyStageAllQueueFilter'].forEach(id=>{
      const el=byId(id); if(!el) return;
      [...el.options].forEach(o=>{ if(o.value===DELIVERED || text(o.textContent)===DELIVERED) o.remove(); });
      if(el.value===DELIVERED) el.value='';
    });
  }
  function destroyChart(id){ try{ if(window.dashboardCharts && window.dashboardCharts[id]){ window.dashboardCharts[id].destroy(); delete window.dashboardCharts[id]; } }catch(e){} }
  function countBy(rows, field){ const m=new Map(); (rows||[]).forEach(r=>{ const k=text(val(r,field))||'Blank'; m.set(k,(m.get(k)||0)+1); }); return [...m.entries()].sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0])); }
  function chartLabels(arr,total){ return arr.map(([l,n])=>`${l} (${pct(n,total)})`); }
  function setMulti(id,value){ const el=byId(id); if(!el) return; [...el.options].forEach(o=>o.selected=(o.value===value || text(o.textContent)===value)); }
  /* [dedup] orphan helper clearSelect removed */
  /* [dedup] orphan helper resetQueue removed */
  function renderAgain(){ removeDeliveredQueue(); if(typeof window.renderSky==='function') setTimeout(()=>window.renderSky(),0); }
  function addClearButton(section, type){
    const h=section && section.querySelector('h2'); if(!h || h.querySelector('.sky-clear-data-btn')) return;
    const span=document.createElement('span'); span.textContent=h.textContent.trim();
    h.textContent=''; h.appendChild(span);
    const b=document.createElement('button'); b.type='button'; b.className='sky-clear-data-btn'; b.textContent='Clear Chart Data';
    b.onclick=function(e){ e.preventDefault(); e.stopPropagation(); if(window.clearSkyInsightSelection) window.clearSkyInsightSelection(type); };
    h.appendChild(b);
  }
  function ensureDom(){
    removeDeliveredQueue();
    const main=document.querySelector('#skyPage main'); if(!main) return;
    let grid=byId('skyChartsSection');
    if(!grid){
      const cases=byId('skyCasesTable')?.closest('section');
      grid=document.createElement('div'); grid.id='skyChartsSection'; grid.className='charts-grid sky-charts sky-requested-insights';
      (cases||main.firstElementChild).insertAdjacentElement('afterend',grid);
    }
    grid.classList.add('sky-requested-insights');
    const specs=[
      ['skyOpenStatusChart','Open_Cases Status','skyOpenStatusSummary','sky-open-status-chart-box','status'],
      ['skyOpenBranchChart','Open Cases per Branch','skyOpenBranchSummary','sky-open-branch-chart-box','branch'],
      ['skyOpenStageChart','Open_Cases Per Stage','skyOpenStageSummary','sky-open-stage-chart-box','stage'],
      ['skyReadyBranchChart','Ready For Delivery Cases Per Branch','skyReadyBranchSummary','sky-ready-branch-chart-box','readyBranch']
    ];
    specs.forEach(([cid,title,sid,box,typ])=>{
      let canvas=byId(cid), sec=canvas?.closest('section,.chart-card');
      if(!canvas){ sec=document.createElement('section'); sec.className='chart-card'; sec.innerHTML=`<h2>${title}</h2><div class="sky-chart-summary" id="${sid}"></div><div class="chart-box ${box}"><canvas id="${cid}"></canvas></div>`; grid.appendChild(sec); }
      sec=byId(cid).closest('section,.chart-card'); sec.classList.add('chart-card');
      sec.classList.toggle('sky-status-row',typ==='status'); sec.classList.toggle('sky-branch-row',typ==='branch'); sec.classList.toggle('sky-stage-row',typ==='stage'); sec.classList.toggle('sky-ready-row',typ==='readyBranch');
      const h=sec.querySelector('h2'); if(h && !h.querySelector('.sky-clear-data-btn')) h.textContent=title;
      addClearButton(sec, typ);
      grid.appendChild(sec);
    });
    // Remove old obsolete SKY chart cards but keep the four requested charts.
    const keep=new Set(specs.map(s=>s[0]));
    grid.querySelectorAll('canvas').forEach(c=>{ if(!keep.has(c.id)){ destroyChart(c.id); c.closest('section,.chart-card')?.remove(); } });
    let tables=document.querySelector('#skyPage .sky-summary-tables');
    if(tables) tables.style.display='none';
  }
  function summary(id,arr,total){ const el=byId(id); if(el) el.innerHTML=arr.slice(0,10).map(([l,n])=>`<span class="sky-chart-chip">${esc(l)}: ${n} (${pct(n,total)})</span>`).join(' '); }
  function makeChart(id, arr, title, horizontal, type){
    const canvas=byId(id); if(!canvas || !window.Chart) return;
    destroyChart(id); if(!window.dashboardCharts) window.dashboardCharts={};
    const total=arr.reduce((a,x)=>a+Number(x[1]||0),0); const values=arr.map(x=>x[1]); const labels=chartLabels(arr,total); const max=Math.max(...values,0);
    dashboardCharts[id]=__safeNewChart(canvas,{type:'bar',data:{labels,datasets:[{label:title,data:values,backgroundColor:values.map((_,i)=>COLORS[i%COLORS.length]),borderColor:values.map((_,i)=>COLORS[i%COLORS.length]),borderWidth:1,borderRadius:horizontal?7:6,maxBarThickness:horizontal?24:46}]},options:{animation:false,responsive:true,maintainAspectRatio:false,indexAxis:horizontal?'y':'x',layout:{padding:{top:28,right:horizontal?70:26,bottom:24,left:horizontal?12:12}},onClick:(evt,elements)=>{ if(!elements.length) return; const raw=arr[elements[0].index][0]; if(type==='status'){ window.skyV26Status=raw; } if(type==='branch'){ setMulti('skyBranchFilter',raw); const q=byId('skyQueueFilter'); if(q) q.value='Open_Cases'; } if(type==='stage'){ setMulti('skyStageFilter',raw); const q=byId('skyQueueFilter'); if(q) q.value='Open_Cases'; } if(type==='readyBranch'){ setMulti('skyBranchFilter',raw); const q=byId('skyQueueFilter'); if(q) q.value='Ready For Delivery Cases'; } renderAgain(); },plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>`${title}: ${ctx.raw} (${pct(ctx.raw,total)})`}}},scales:{x:{beginAtZero:true,suggestedMax:horizontal?max*1.25+1:undefined,ticks:{color:'#111827',autoSkip:false,maxRotation:horizontal?0:45,minRotation:0,precision:0,font:{weight:'700'}},grid:{color:'rgba(17,24,39,.16)'}},y:{beginAtZero:!horizontal,suggestedMax:horizontal?undefined:max*1.25+1,ticks:{color:'#111827',autoSkip:false,precision:0,font:{weight:'700'},callback:function(value){ const label=this.getLabelForValue?this.getLabelForValue(value):value; return horizontal && String(label).length>38 ? String(label).slice(0,37)+'…' : label; }},grid:{color:'rgba(17,24,39,.16)'}}}},plugins:[{id:id+'V26Labels',afterDatasetsDraw(chart){ const {ctx}=chart; const meta=chart.getDatasetMeta(0); ctx.save(); ctx.font='bold 12px Calibri, Arial'; ctx.fillStyle='#111827'; ctx.textBaseline='middle'; meta.data.forEach((bar,i)=>{ const n=values[i]; if(!n) return; const p=bar.tooltipPosition(); ctx.textAlign=horizontal?'left':'center'; ctx.fillText(String(n), horizontal?Math.min(p.x+8,chart.chartArea.right-24):p.x, horizontal?p.y:Math.max(14,p.y-10)); }); ctx.restore(); }}]});
  }
  function maybeFilterStatus(rows){ return window.skyV26Status ? rows.filter(r=>text(val(r,'Status'))===window.skyV26Status && text(val(r,'Queue'))==='Open_Cases') : rows; }
  function renderV26(){
    ensureDom();
    let rows=[]; try{ if(typeof window.getSkyFilteredRows==='function') rows=window.getSkyFilteredRows(); }catch(e){}
    if(!Array.isArray(rows) || !rows.length) rows=window.currentSkyRows || allSky();
    rows=noDeliveredRows(rows); rows=maybeFilterStatus(rows);
    const open=rows.filter(r=>text(val(r,'Queue'))==='Open_Cases');
    const ready=rows.filter(r=>text(val(r,'Queue'))==='Ready For Delivery Cases');
    const status=countBy(open,'Status'), branch=countBy(open,'Branch'), stage=countBy(open,'Stage'), readyBranch=countBy(ready,'Branch');
    summary('skyOpenStatusSummary',status,open.length); summary('skyOpenBranchSummary',branch,open.length); summary('skyOpenStageSummary',stage,open.length); summary('skyReadyBranchSummary',readyBranch,ready.length);
    makeChart('skyOpenStatusChart',status,'Open_Cases',true,'status');
    makeChart('skyOpenBranchChart',branch,'Open_Cases',false,'branch');
    makeChart('skyOpenStageChart',stage,'Open_Cases',false,'stage');
    makeChart('skyReadyBranchChart',readyBranch,'Ready For Delivery Cases',false,'readyBranch');
  }
  /* [dedup] superseded clearSkyInsightSelection definition removed (was L8618) */
  const oldRenderSky=window.renderSky;
  /* [dedup] superseded updateSkyCharts definition removed (was L8627) */
  window.renderSky=function(){ removeDeliveredQueue(); const res=typeof oldRenderSky==='function'?oldRenderSky.apply(this,arguments):undefined; setTimeout(renderV26,30); return res; };
  function boot(){ removeDeliveredQueue(); renderV26(); }
  document.addEventListener('DOMContentLoaded',()=>{ setTimeout(boot,300); });
  window.addEventListener('load',()=>{ setTimeout(boot,700); });
})();


/* ===== sky-v27-clean-duplicates-clear-fix-script ===== */

(function(){
  const DELIVERED='__REMOVED_QUEUE__';
  const ALL='__ALL__';
  function byId(id){return document.getElementById(id);}
  function txt(v){return String(v??'').trim();}
  function norm(s){return txt(s).toLowerCase().replace(/[^a-z0-9]/g,'');}
  function val(r,k){ if(!r)return ''; if(Object.prototype.hasOwnProperty.call(r,k))return r[k]; const nk=norm(k); const f=Object.keys(r).find(x=>norm(x)===nk); return f?r[f]:''; }
  function clearSingle(id){ const el=byId(id); if(el) el.value=''; }
  function clearMulti(id){ const el=byId(id); if(!el) return; [...el.options].forEach(o=>o.selected=false); const all=[...el.options].find(o=>o.value===ALL || txt(o.textContent)==='(Select All)' || txt(o.textContent)==='All'); if(all) all.selected=true; }
  function clearCommonChartSelects(){ ['skyQueueChartBrandFilter','skyBrandChartQueueFilter','skyStageChartBranchFilter','skyBranchChartStageFilter','skyReadyAgingBrandFilter','skyStageAllQueueFilter'].forEach(clearSingle); }
  function removeDelivered(){
    try{ if(Array.isArray(window.skyRows)) window.skyRows=window.skyRows.filter(r=>txt(val(r,'Queue'))!==DELIVERED); }catch(e){}
    try{ if(Array.isArray(window.currentSkyRows)) window.currentSkyRows=window.currentSkyRows.filter(r=>txt(val(r,'Queue'))!==DELIVERED); }catch(e){}
    ['skyQueueFilter','skyBrandChartQueueFilter','skyStageAllQueueFilter'].forEach(id=>{ const el=byId(id); if(!el)return; [...el.options].forEach(o=>{ if(o.value===DELIVERED || txt(o.textContent)===DELIVERED) o.remove(); }); if(el.value===DELIVERED) el.value=''; });
  }
  function removeEmptyDuplicateTables(){
    const page=byId('skyPage'); if(!page) return;
    page.querySelectorAll('.sky-summary-tables').forEach(el=>el.remove());
    ['skyOpenStageSummaryTable','skyReadyBranchSummaryTable'].forEach(id=>{ const t=byId(id); const sec=t&&t.closest('section,.chart-card'); if(sec) sec.remove(); });
    // Remove any empty standalone sections with only the duplicated titles.
    page.querySelectorAll('section').forEach(sec=>{
      const h=sec.querySelector('h2'); if(!h) return;
      const title=txt(h.textContent).replace(/Clear Chart Data|Clear Chart Filter/gi,'').trim();
      if((title==='Open_Cases Per Stage' || title==='Ready For Delivery Cases Per Branch') && !sec.querySelector('canvas')) sec.remove();
    });
  }
  function ensureClearButtons(){
    const specs={
      skyOpenStatusChart:'status',
      skyOpenBranchChart:'branch',
      skyOpenStageChart:'stage',
      skyReadyBranchChart:'readyBranch'
    };
    Object.entries(specs).forEach(([cid,type])=>{
      const sec=byId(cid)?.closest('section,.chart-card'); const h=sec?.querySelector('h2'); if(!h) return;
      h.querySelectorAll('.chart-clear-btn,.sky-clear-data-btn').forEach((b,i)=>{ if(i>0)b.remove(); });
      let b=h.querySelector('.chart-clear-btn,.sky-clear-data-btn');
      if(!b){ b=document.createElement('button'); h.appendChild(b); }
      b.type='button'; b.className='sky-clear-data-btn'; b.textContent='Clear Chart Data'; b.dataset.skyClearType=type;
      b.onclick=function(ev){ ev.preventDefault(); ev.stopPropagation(); clearSelection(type); };
    });
  }
  function clearSelection(type){
    window.skyV26Status=''; window.skyV27Status='';
    removeDelivered(); clearCommonChartSelects();
    if(type==='status') { clearSingle('skyQueueFilter'); }
    if(type==='branch' || type==='readyBranch') { clearMulti('skyBranchFilter'); clearSingle('skyQueueFilter'); }
    if(type==='stage') { clearMulti('skyStageFilter'); clearSingle('skyQueueFilter'); }
    if(type==='all') { clearMulti('skyBranchFilter'); clearMulti('skyStageFilter'); clearSingle('skyQueueFilter'); }
    if(typeof window.refreshSkyExcelFilterWidgets==='function') setTimeout(window.refreshSkyExcelFilterWidgets,0);
    // Render directly first so the chart is visibly reset, then let the normal SKY render refresh tables/cards.
    if(typeof window.updateSkyCharts==='function') setTimeout(()=>window.updateSkyCharts(window.currentSkyRows||window.skyRows||[]),0);
    if(typeof window.renderSky==='function') setTimeout(()=>window.renderSky(),20);
    setTimeout(()=>{ removeEmptyDuplicateTables(); ensureClearButtons(); },120);
  }
  /* [dedup] superseded clearSkyInsightSelection definition removed (was L8692) */
  document.addEventListener('click',function(e){ const b=e.target.closest && e.target.closest('#skyPage .sky-clear-data-btn,#skyPage .chart-clear-btn'); if(!b) return; e.preventDefault(); e.stopPropagation(); clearSelection(b.dataset.skyClearType || 'all'); },true);
  function fix(){ removeDelivered(); removeEmptyDuplicateTables(); ensureClearButtons(); }
  const oldRender=window.renderSky;
  if(typeof oldRender==='function'){
    window.renderSky=function(){ removeDelivered(); const res=oldRender.apply(this,arguments); setTimeout(fix,60); return res; };
  }
  document.addEventListener('DOMContentLoaded',()=>{ setTimeout(fix,200); });
  window.addEventListener('load',()=>{ setTimeout(fix,500); });
  requestAnimationFrame(fix);
})();


/* ===== sky-v28-final-fix-script ===== */

(function(){
  const DELIVERED=ALL='__ALL__';
  const COLORS=['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#7f7f7f','#bcbd22','#17becf','#2563eb','#16a34a','#ea580c','#9333ea','#0891b2','#be123c'];
  function byId(id){return document.getElementById(id)}
  function txt(v){return String(v??'').trim()}
  function norm(s){return txt(s).toLowerCase().replace(/[^a-z0-9]/g,'')}
  function val(r,k){ if(!r) return ''; if(Object.prototype.hasOwnProperty.call(r,k)) return r[k]; const nk=norm(k); const f=Object.keys(r).find(x=>norm(x)===nk); return f?r[f]:''; }
  function esc(s){return txt(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
  function pct(n,t){return t?Math.round(Number(n||0)*100/t)+'%':'0%'}
  function destroy(id){try{ if(window.dashboardCharts&&window.dashboardCharts[id]){window.dashboardCharts[id].destroy(); delete window.dashboardCharts[id];}}catch(e){}}
  function cleanDelivered(){
    try{ if(Array.isArray(window.skyRows)) window.skyRows=window.skyRows.filter(r=>txt(val(r,'Queue'))!==DELIVERED); }catch(e){}
    try{ if(Array.isArray(window.currentSkyRows)) window.currentSkyRows=window.currentSkyRows.filter(r=>txt(val(r,'Queue'))!==DELIVERED); }catch(e){}
    ['skyQueueFilter','skyBrandChartQueueFilter','skyStageAllQueueFilter'].forEach(id=>{const el=byId(id); if(!el)return; [...el.options].forEach(o=>{if(o.value===DELIVERED||txt(o.textContent)===DELIVERED)o.remove()}); if(el.value===DELIVERED)el.value='';});
  }
  function baseRows(){
    cleanDelivered(); let rows=[];
    try{ if(typeof window.getSkyFilteredRows==='function') rows=window.getSkyFilteredRows(); }catch(e){}
    if(!Array.isArray(rows)||!rows.length) rows=Array.isArray(window.currentSkyRows)&&window.currentSkyRows.length?window.currentSkyRows:(window.skyRows||[]);
    rows=rows.filter(r=>txt(val(r,'Queue'))!==DELIVERED);
    if(window.skyV28Status) rows=rows.filter(r=>txt(val(r,'Status'))===window.skyV28Status);
    return rows;
  }
  function countBy(rows, field){const m=new Map(); rows.forEach(r=>{const k=txt(val(r,field))||'Blank'; m.set(k,(m.get(k)||0)+1)}); return [...m.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));}
  function setSingle(id,value){const el=byId(id); if(el){el.value=value||''; el.dispatchEvent(new Event('change',{bubbles:true}));}}
  function setMulti(id,value){const el=byId(id); if(!el)return; [...el.options].forEach(o=>o.selected=(o.value===value||txt(o.textContent)===value)); el.dispatchEvent(new Event('change',{bubbles:true}));}
  function clearSingle(id){const el=byId(id); if(el){el.value=''; el.dispatchEvent(new Event('change',{bubbles:true}));}}
  function clearMulti(id){const el=byId(id); if(!el)return; [...el.options].forEach(o=>o.selected=false); const all=[...el.options].find(o=>o.value===ALL||txt(o.textContent)==='(Select All)'||txt(o.textContent)==='All'); if(all)all.selected=true; el.dispatchEvent(new Event('change',{bubbles:true}));}
  function clearAllInsightFilters(){ window.skyV26Status=''; window.skyV27Status=''; window.skyV28Status=''; try{window.statusDrill='';}catch(e){} ['skyQueueChartBrandFilter','skyBrandChartQueueFilter','skyStageChartBranchFilter','skyBranchChartStageFilter','skyReadyAgingBrandFilter','skyStageAllQueueFilter'].forEach(clearSingle); }
  function makeButton(type){return `<button type="button" class="sky-clear-data-btn" data-sky-clear-type="${type}">Clear Chart Data</button>`}
  function ensureDom(){
    const page=byId('skyPage'), main=page&&page.querySelector('main'); if(!main)return;
    page.querySelectorAll('#skyDrilldownNote,.sky-drilldown-note').forEach(n=>n.remove());
    // Remove previous empty/duplicate generated stage/ready cards or tables, then build one clean area.
    page.querySelectorAll('.sky-summary-tables, .sky-summary-tables-empty').forEach(x=>x.remove());
    page.querySelectorAll('section').forEach(sec=>{const h=sec.querySelector('h2'); if(!h)return; const title=txt(h.textContent).replace(/Clear Chart Data|Clear Chart Filter/gi,'').trim(); if(['Open_Cases Per Stage','Ready For Delivery Cases Per Branch','Open_Cases Per Branch','Open Cases per Branch','Open_Cases Status'].includes(title) && !sec.closest('#skyChartsSection')) sec.remove();});
    let grid=byId('skyChartsSection');
    if(!grid){ grid=document.createElement('div'); grid.id='skyChartsSection'; const cases=byId('skyCasesTable')?.closest('section'); (cases||main.firstElementChild).insertAdjacentElement('afterend',grid); }
    grid.className='charts-grid sky-charts sky-requested-insights sky-v28-layout';
    grid.innerHTML=`
      <section class="chart-card sky-v28-full" data-sky-v28="status"><h2><span>Open_Cases Status</span>${makeButton('status')}</h2><div class="sky-chart-summary" id="skyOpenStatusSummary"></div><div class="chart-box sky-v28-chart-box sky-v28-status-box"><canvas id="skyOpenStatusChart"></canvas></div></section>
      <section class="chart-card sky-v28-full" data-sky-v28="branch"><h2><span>Open Cases per Branch</span>${makeButton('branch')}</h2><div class="sky-chart-summary" id="skyOpenBranchSummary"></div><div class="chart-box sky-v28-chart-box"><canvas id="skyOpenBranchChart"></canvas></div></section>
      <section class="chart-card" data-sky-v28="stage"><h2><span>Open_Cases Per Stage</span>${makeButton('stage')}</h2><div class="sky-chart-summary" id="skyOpenStageSummary"></div><div class="table-wrap sky-v28-table-wrap"><table id="skyOpenStageSummaryTable" class="sky-v28-pivot"></table></div></section>
      <section class="chart-card" data-sky-v28="readyBranch"><h2><span>Ready For Delivery Cases Per Branch</span>${makeButton('readyBranch')}</h2><div class="sky-chart-summary" id="skyReadyBranchSummary"></div><div class="table-wrap sky-v28-table-wrap"><table id="skyReadyBranchSummaryTable" class="sky-v28-pivot"></table></div></section>`;
  }
  function summary(id, arr, total){const el=byId(id); if(!el)return; el.innerHTML=arr.slice(0,12).map(([l,n])=>`<span class="sky-chart-chip">${esc(l)}: ${n} (${pct(n,total)})</span>`).join('');}
  function renderTable(id,label,arr,type){const table=byId(id); if(!table)return; const total=arr.reduce((a,x)=>a+Number(x[1]||0),0); table.innerHTML=`<thead><tr><th>${esc(label)}</th><th>Count of Cases</th><th>% of Grand Total</th></tr></thead><tbody>${arr.map(([l,n])=>`<tr data-value="${esc(l)}" data-type="${type}"><td>${esc(l)}</td><td class="num">${n}</td><td class="pct">${pct(n,total)}</td></tr>`).join('')}</tbody><tfoot><tr><td>Grand Total</td><td class="num">${total}</td><td class="pct">100%</td></tr></tfoot>`;}
  function makeChart(id, arr, title, horizontal, type){
    const canvas=byId(id); if(!canvas||!window.Chart)return; destroy(id); if(!window.dashboardCharts)window.dashboardCharts={};
    const total=arr.reduce((a,x)=>a+Number(x[1]||0),0), labels=arr.map(x=>`${x[0]} (${pct(x[1],total)})`), values=arr.map(x=>x[1]), max=Math.max(...values,0);
    window.dashboardCharts[id]=__safeNewChart(canvas,{type:'bar',data:{labels,datasets:[{label:title,data:values,backgroundColor:values.map((_,i)=>COLORS[i%COLORS.length]),borderColor:values.map((_,i)=>COLORS[i%COLORS.length]),borderWidth:1,borderRadius:horizontal?6:5,maxBarThickness:horizontal?26:48}]},options:{animation:false,responsive:true,maintainAspectRatio:false,indexAxis:horizontal?'y':'x',layout:{padding:{top:20,right:55,bottom:16,left:8}},onClick:(evt,els)=>{ if(!els.length)return; const raw=arr[els[0].index][0]; if(type==='status'){window.skyV28Status=raw;} if(type==='branch'){setSingle('skyQueueFilter','Open_Cases'); setMulti('skyBranchFilter',raw);} rerender();},plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>`${title}: ${ctx.raw} (${pct(ctx.raw,total)})`}}},scales:{x:{beginAtZero:true,suggestedMax:horizontal?max*1.25+1:undefined,ticks:{color:'#111827',autoSkip:false,precision:0,maxRotation:horizontal?0:45,minRotation:0,font:{weight:'700'}},grid:{color:'rgba(17,24,39,.18)'}},y:{beginAtZero:!horizontal,suggestedMax:horizontal?undefined:max*1.25+1,ticks:{color:'#111827',autoSkip:false,precision:0,font:{weight:'700'},callback:function(v){const label=this.getLabelForValue?this.getLabelForValue(v):v; return horizontal&&String(label).length>45?String(label).slice(0,44)+'…':label;}},grid:{color:'rgba(17,24,39,.18)'}}}},plugins:[{id:id+'V28Labels',afterDatasetsDraw(chart){const {ctx}=chart, meta=chart.getDatasetMeta(0); ctx.save(); ctx.font='bold 12px Calibri, Arial'; ctx.fillStyle='#111827'; ctx.textBaseline='middle'; meta.data.forEach((bar,i)=>{const n=values[i]; if(!n)return; const p=bar.tooltipPosition(); ctx.textAlign=horizontal?'left':'center'; ctx.fillText(String(n),horizontal?Math.min(p.x+8,chart.chartArea.right-22):p.x,horizontal?p.y:Math.max(14,p.y-10));}); ctx.restore();}}]});
  }
  function renderInsights(){
    ensureDom(); cleanDelivered();
    const rows=baseRows();
    const open=rows.filter(r=>txt(val(r,'Queue'))==='Open_Cases');
    const ready=rows.filter(r=>txt(val(r,'Queue'))==='Ready For Delivery Cases');
    const status=countBy(open,'Status'), branch=countBy(open,'Branch'), stage=countBy(open,'Stage'), readyBranch=countBy(ready,'Branch');
    summary('skyOpenStatusSummary',status,open.length); summary('skyOpenBranchSummary',branch,open.length); summary('skyOpenStageSummary',stage,open.length); summary('skyReadyBranchSummary',readyBranch,ready.length);
    makeChart('skyOpenStatusChart',status,'Open_Cases',true,'status');
    makeChart('skyOpenBranchChart',branch,'Open_Cases',false,'branch');
    renderTable('skyOpenStageSummaryTable','Stage',stage,'stage');
    renderTable('skyReadyBranchSummaryTable','Branch',readyBranch,'readyBranch');
  }
  function clearSelection(type){
    clearAllInsightFilters();
    if(type==='branch'){clearMulti('skyBranchFilter'); clearSingle('skyQueueFilter');}
    if(type==='stage'){clearMulti('skyStageFilter'); clearSingle('skyQueueFilter');}
    if(type==='readyBranch'){clearMulti('skyBranchFilter'); clearSingle('skyQueueFilter');}
    if(type==='status'){clearSingle('skyQueueFilter');}
    if(type==='all'){clearMulti('skyBranchFilter'); clearMulti('skyStageFilter'); clearSingle('skyQueueFilter');}
    try{ if(typeof window.refreshSkyExcelFilterWidgets==='function') window.refreshSkyExcelFilterWidgets(); }catch(e){}
    // Directly redraw the visuals so the button has an immediate visible effect.
    setTimeout(()=>{renderInsights();},0);
    setTimeout(()=>{ if(typeof originalRenderSky==='function') originalRenderSky.call(window); renderInsights();},60);
  }
  function rerender(){ setTimeout(()=>{ if(typeof originalRenderSky==='function') originalRenderSky.call(window); renderInsights();},0); }
  window.clearSkyInsightSelection=clearSelection;
  const originalRenderSky=window.renderSky;
  window.updateSkyCharts=function(){ requestAnimationFrame(renderInsights); };
  window.renderSky=function(){ cleanDelivered(); const res=typeof originalRenderSky==='function'?originalRenderSky.apply(this,arguments):undefined; setTimeout(renderInsights,40); return res; };
  document.addEventListener('click',function(e){
    const btn=e.target.closest&&e.target.closest('#skyPage .sky-clear-data-btn,#skyPage .chart-clear-btn');
    if(btn){e.preventDefault(); e.stopPropagation(); clearSelection(btn.dataset.skyClearType||'all'); return;}
    const row=e.target.closest&&e.target.closest('#skyPage table.sky-v28-pivot tbody tr');
    if(row){const type=row.dataset.type, raw=row.dataset.value; if(type==='stage'){setSingle('skyQueueFilter','Open_Cases'); setMulti('skyStageFilter',raw);} if(type==='readyBranch'){setSingle('skyQueueFilter','Ready For Delivery Cases'); setMulti('skyBranchFilter',raw);} rerender();}
  },true);
  document.addEventListener('DOMContentLoaded',()=>{setTimeout(renderInsights,300);});
  window.addEventListener('load',()=>{setTimeout(renderInsights,600);});
  requestAnimationFrame(renderInsights);
})();


/* ===== sky-v29-show-summary-tables-fix-script ===== */

(function(){
  function forceSkySummaryTablesVisible(){
    try{
      document.querySelectorAll('#skyChartsSection [data-sky-v28="stage"], #skyChartsSection [data-sky-v28="readyBranch"]').forEach(function(sec){
        sec.style.setProperty('display','block','important');
        sec.style.setProperty('visibility','visible','important');
        sec.style.setProperty('opacity','1','important');
      });
      document.querySelectorAll('#skyOpenStageSummaryTable, #skyReadyBranchSummaryTable').forEach(function(tbl){
        tbl.style.setProperty('display','table','important');
        tbl.style.setProperty('visibility','visible','important');
        var wrap=tbl.closest('.table-wrap');
        if(wrap){ wrap.style.setProperty('display','block','important'); wrap.style.setProperty('min-height','220px','important'); }
      });
    }catch(e){}
  }
  var previousUpdate=window.updateSkyCharts;
  window.updateSkyCharts=function(){
    var res=typeof previousUpdate==='function'?previousUpdate.apply(this,arguments):undefined;
    setTimeout(forceSkySummaryTablesVisible,50);
    return res;
  };
  var previousRender=window.renderSky;
  window.renderSky=function(){
    var res=typeof previousRender==='function'?previousRender.apply(this,arguments):undefined;
    setTimeout(forceSkySummaryTablesVisible,80);
    return res;
  };
  document.addEventListener('DOMContentLoaded',function(){setTimeout(forceSkySummaryTablesVisible,800);});
  window.addEventListener('load',function(){setTimeout(forceSkySummaryTablesVisible,1000);});
  requestAnimationFrame(forceSkySummaryTablesVisible);
})();


/* ===== user-gspn-requested-charts-script ===== */

(function(){
  'use strict';
  const ALL = (typeof window.ALL_VALUE !== 'undefined' ? window.ALL_VALUE : '__ALL__');
  const COLORS = ['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#7f7f7f','#bcbd22','#17becf','#0f766e','#f59e0b','#6366f1','#ef4444','#14b8a6'];
  const LABEL_PLUGIN_ID = 'gspnRequestedValueLabels';
  let selectedGspnStatus = '';

  function q(id){ return document.getElementById(id); }
  function txt(v){ return String(v ?? '').trim(); }
  function esc(v){ return txt(v).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s])); }
  function norm(s){ return txt(s).toLowerCase().replace(/[^a-z0-9]/g,''); }
  function val(row, keys){
    if(!row) return '';
    for(const k of keys){ if(Object.prototype.hasOwnProperty.call(row,k) && row[k] !== undefined && row[k] !== null && row[k] !== '') return row[k]; }
    const allKeys = Object.keys(row);
    for(const k of keys){ const f = allKeys.find(x => norm(x) === norm(k)); if(f && row[f] !== undefined && row[f] !== null && row[f] !== '') return row[f]; }
    return '';
  }
  function rowsAll(){
    if(Array.isArray(window.currentFilteredRows)) return window.currentFilteredRows;
    if(Array.isArray(window.allRows)) return window.allRows;
    try{ if(typeof currentFilteredRows !== 'undefined' && Array.isArray(currentFilteredRows)) return currentFilteredRows; }catch(e){}
    try{ if(typeof allRows !== 'undefined' && Array.isArray(allRows)) return allRows; }catch(e){}
    return [];
  }
  function countBy(rows, keys){
    const counts = {};
    (rows || []).forEach(r => {
      const k = txt(val(r, keys)) || 'Blank';
      counts[k] = (counts[k] || 0) + 1;
    });
    const arr = Object.entries(counts).sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0]));
    return { labels: arr.map(x=>x[0]), values: arr.map(x=>x[1]) };
  }
  function setMultiFilter(id, value){
    const el=q(id); if(!el) return;
    el.setAttribute('multiple','multiple'); el.multiple = true;
    let matched = false;
    [...el.options].forEach(o => { const yes = o.value === value || txt(o.textContent) === value; o.selected = yes; if(yes) matched = true; });
    if(!matched){ const opt = new Option(value, value, true, true); el.add(opt); }
    refreshNativeDropdown(id);
  }
  function clearMultiFilter(id){
    const el=q(id); if(!el) return;
    [...el.options].forEach((o,i)=>{ o.selected = (o.value === ALL || (!i && !o.value)); });
    refreshNativeDropdown(id);
  }
  function refreshNativeDropdown(id){
    try{ if(typeof window.buildGspnV50Filter === 'function') window.buildGspnV50Filter(id); }catch(e){}
    try{ if(typeof window.refreshGspnFilterWidgets === 'function') window.refreshGspnFilterWidgets(); }catch(e){}
    try{ if(typeof buildMultiDropdowns === 'function') buildMultiDropdowns(); }catch(e){}
  }
  function rerender(){
    try{ if(typeof window.render === 'function') window.render(); else if(typeof render === 'function') render(); }
    catch(e){ try{ window.updateCharts(rowsAll()); }catch(_){ } }
    setTimeout(()=>renderRequestedCharts(rowsAll()),80);
  }
  function ensureStageMultipleSelect(){
    const stage=q('stageFilter');
    if(stage){ stage.setAttribute('multiple','multiple'); stage.multiple = true; }
    const label = stage?.parentElement?.querySelector('.filter-label');
    if(label && !/multiple select/i.test(label.textContent)) label.textContent = 'Stage - multiple select';
  }
  function ensureStageCustomDropdown(){
    /* The v50 custom dropdown list previously skipped Stage. This keeps the same design and adds Stage to it. */
    const stage=q('stageFilter'); if(!stage) return;
    stage.classList.add('gspn-native-v50');
    let wrap=q('stageFilter_v50');
    if(!wrap){
      wrap=document.createElement('div'); wrap.id='stageFilter_v50'; wrap.className='gspn-v50-filter';
      wrap.innerHTML='<button type="button" class="gspn-v50-btn"></button><div class="gspn-v50-panel"></div>';
      stage.insertAdjacentElement('afterend',wrap);
    }
    const btn=wrap.querySelector('.gspn-v50-btn'), panel=wrap.querySelector('.gspn-v50-panel');
    const selected=[...stage.selectedOptions].map(o=>o.value).filter(v=>v && v!==ALL);
    btn.textContent = selected.length ? (selected.length>2 ? `${selected.length} selected` : selected.join(', ')) : '(Select All)';
    btn.title = btn.textContent;
    btn.onclick=function(e){
      e.preventDefault(); e.stopPropagation();
      document.querySelectorAll('#gspnPage .gspn-v50-filter.open').forEach(w=>{ if(w!==wrap) w.classList.remove('open'); });
      wrap.classList.toggle('open'); if(wrap.classList.contains('open')) drawStagePanel('');
    };
    function drawStagePanel(filter){
      const opts=[...stage.options].map(o=>({value:o.value,text:o.textContent,selected:o.selected}));
      const term=txt(filter).toLowerCase();
      panel.innerHTML='<input class="gspn-v50-search" placeholder="Search" autocomplete="off" /><div class="gspn-v50-list"></div><div class="gspn-v50-actions"><button type="button" class="gspn-v50-cancel">Cancel</button><button type="button" class="gspn-v50-ok">OK</button></div>';
      const search=panel.querySelector('.gspn-v50-search'), list=panel.querySelector('.gspn-v50-list');
      let temp=new Set(opts.filter(o=>o.selected).map(o=>o.value));
      if(![...temp].filter(v=>v && v!==ALL).length) temp=new Set([ALL]);
      function listDraw(){
        const t=txt(search.value).toLowerCase();
        list.innerHTML=opts.filter(o=>!t || txt(o.text).toLowerCase().includes(t)).map(o=>`<label class="gspn-v50-option"><input type="checkbox" data-value="${esc(o.value)}" ${temp.has(o.value)?'checked':''}> <span>${esc(o.text)}</span></label>`).join('');
        list.querySelectorAll('input').forEach(cb=>{ cb.onchange=function(){ const v=cb.getAttribute('data-value'); if(v===ALL){ temp=cb.checked?new Set([ALL]):new Set(); } else { temp.delete(ALL); cb.checked?temp.add(v):temp.delete(v); if(!temp.size) temp.add(ALL); } listDraw(); }; });
      }
      search.oninput=listDraw; panel.querySelector('.gspn-v50-cancel').onclick=()=>wrap.classList.remove('open');
      panel.querySelector('.gspn-v50-ok').onclick=function(){
        const real=[...temp].filter(v=>v && v!==ALL);
        [...stage.options].forEach((o,i)=>{ o.selected = real.length ? real.includes(o.value) : (o.value===ALL || i===0); });
        wrap.classList.remove('open'); ensureStageCustomDropdown(); rerender();
      };
      listDraw(); setTimeout(()=>search.focus(),0);
    }
  }
  document.addEventListener('click', e=>{ if(!e.target.closest || !e.target.closest('#gspnPage .gspn-v50-filter')) document.querySelectorAll('#gspnPage .gspn-v50-filter.open').forEach(w=>w.classList.remove('open')); }, true);

  function ensureDom(){
    const main=document.querySelector('#gspnPage main'); if(!main) return;
    let grid=q('gspnRequestedCharts');
    if(!grid){
      grid=document.createElement('div'); grid.id='gspnRequestedCharts'; grid.className='charts-grid gspn-requested-charts';
      const tableAnchor=q('urgentSection') || q('allCasesSection');
      if(tableAnchor) tableAnchor.insertAdjacentElement('afterend', grid); else main.appendChild(grid);
    }
    const specs=[
      ['gspnReqBranchChart','Count Cases Per Branch','gspn-requested-full','branch'],
      ['gspnReqStatusChart','Count Cases Per GSPN_Status','','status'],
      ['gspnReqStageChart','Count of Cases Per Stage','','stage']
    ];
    specs.forEach(([id,title,extra,type])=>{
      let canvas=q(id); let sec=canvas?.closest('.chart-card,section');
      if(!canvas){
        sec=document.createElement('section'); sec.className='chart-card '+extra; sec.dataset.gspnRequestedType=type;
        sec.innerHTML=`<h2><span>${esc(title)}</span></h2><div class="chart-box"><canvas id="${id}"></canvas></div>`;
        grid.appendChild(sec);
      } else {
        sec.classList.add('chart-card'); if(extra) sec.classList.add(extra);
        sec.querySelectorAll('.gspn-requested-clear-btn').forEach(btn=>btn.remove());
      }
    });
  }
  function clearChart(type){
    if(type==='branch') clearMultiFilter('branchFilter');
    if(type==='stage') clearMultiFilter('stageFilter');
    if(type==='status') selectedGspnStatus='';
    rerender();
  }
  document.addEventListener('click',function(e){
    const btn=e.target.closest && e.target.closest('#gspnPage .gspn-requested-clear-btn');
    if(!btn) return;
    e.preventDefault(); e.stopPropagation(); clearChart(btn.dataset.gspnClear || 'all');
  },true);

  function registerLabels(){
    if(!window.Chart) return;
    try{
      if(!Chart.registry.plugins.get(LABEL_PLUGIN_ID)){
        Chart.register({ id:LABEL_PLUGIN_ID, afterDatasetsDraw(chart){
          if(String(chart.canvas?.id||'').startsWith('sky')) return;
          const {ctx}=chart; const color=chart.options?.plugins?.[LABEL_PLUGIN_ID]?.color || '#111827';
          ctx.save(); ctx.font='bold 12px Calibri, Arial, sans-serif'; ctx.fillStyle=color; ctx.textAlign='center'; ctx.textBaseline='bottom';
          chart.data.datasets.forEach((ds,di)=>{ const meta=chart.getDatasetMeta(di); meta.data.forEach((bar,i)=>{ const v=Number(ds.data[i]||0); if(!v) return; const p=bar.tooltipPosition(); ctx.fillText(String(v), p.x, Math.max(14,p.y-7)); }); });
          ctx.restore();
        }});
      }
    }catch(e){}
  }
  function chartColor(){ return '#111827'; }
  function makeChart(id, labels, values, horizontal, clickFn){
    if(!window.Chart) return; const canvas=q(id); if(!canvas) return; registerLabels();
    window.dashboardCharts = window.dashboardCharts || {};
    if(window.dashboardCharts[id]){ try{ window.dashboardCharts[id].destroy(); }catch(e){} }
    const total=values.reduce((a,b)=>a+Number(b||0),0), max=Math.max(...values,0), c=chartColor();
    window.dashboardCharts[id]=__safeNewChart(canvas,{ type:'bar', data:{ labels, datasets:[{ label:'Total', data:values, backgroundColor:labels.map((_,i)=>COLORS[i%COLORS.length]), borderColor:labels.map((_,i)=>COLORS[i%COLORS.length]), borderWidth:1, borderRadius:4, borderSkipped:false }] }, options:{ indexAxis: horizontal?'y':'x', responsive:true, maintainAspectRatio:false, animation:false, layout:{padding:{top:30,right:18,bottom:8,left:8}}, plugins:{ legend:{display:true, position:'right', labels:{color:c}}, tooltip:{callbacks:{label:ctx=>`Total: ${ctx.raw} (${total?((ctx.raw*100/total).toFixed(1)):'0.0'}%)`}}, [LABEL_PLUGIN_ID]:{color:c} }, scales: horizontal ? { x:{beginAtZero:true,suggestedMax:max*1.18+1,ticks:{color:c},grid:{color:'rgba(127,127,127,.22)'}}, y:{ticks:{color:c,autoSkip:false},grid:{display:false}} } : { x:{ticks:{color:c,autoSkip:false,maxRotation:45,minRotation:0},grid:{display:false}}, y:{beginAtZero:true,suggestedMax:max*1.18+1,ticks:{color:c},grid:{color:'rgba(127,127,127,.22)'}} }, onClick:(evt,elements)=>{ if(elements.length && clickFn) clickFn(labels[elements[0].index]); } } });
  }
  function renderRequestedCharts(rows){
    ensureStageMultipleSelect(); ensureStageCustomDropdown(); ensureDom();
    rows = Array.isArray(rows) ? rows : rowsAll();
    if(selectedGspnStatus) rows = rows.filter(r => txt(val(r,['GSPN_Status','GSPN Status','Status'])) === selectedGspnStatus);
    const branch=countBy(rows,['GSPN_Branch','GSPN Branch','Branch']);
    const status=countBy(rows,['GSPN_Status','GSPN Status','Status']);
    const stage=countBy(rows,['Stage','GSPN_Stage','GSPN Stage']);
    makeChart('gspnReqBranchChart', branch.labels, branch.values, false, label=>{ setMultiFilter('branchFilter', label); rerender(); });
    makeChart('gspnReqStatusChart', status.labels, status.values, true, label=>{ selectedGspnStatus=label; rerender(); });
    makeChart('gspnReqStageChart', stage.labels, stage.values, false, label=>{ setMultiFilter('stageFilter', label); rerender(); });
  }

  const previousUpdateCharts = window.updateCharts;
  window.updateCharts=function(rows){
    const res = typeof previousUpdateCharts === 'function' ? previousUpdateCharts.apply(this, arguments) : undefined;
    setTimeout(()=>renderRequestedCharts(Array.isArray(rows)?rows:rowsAll()), 0);
    return res;
  };
  const previousRefreshFilters = window.refreshFilterLists;
  if(typeof previousRefreshFilters === 'function'){
    window.refreshFilterLists=function(){ const res=previousRefreshFilters.apply(this,arguments); setTimeout(()=>{ensureStageMultipleSelect(); ensureStageCustomDropdown();},0); return res; };
  }
  document.addEventListener('DOMContentLoaded',()=>{ setTimeout(()=>renderRequestedCharts(rowsAll()),600); setTimeout(()=>renderRequestedCharts(rowsAll()),1800); });
  window.addEventListener('load',()=>{ setTimeout(()=>renderRequestedCharts(rowsAll()),900); setTimeout(()=>renderRequestedCharts(rowsAll()),2400); });
  setTimeout(()=>renderRequestedCharts(rowsAll()),0);
})();


/* ===== mohamed-gspn-final-fix-script ===== */

(function(){
  'use strict';
  const ALL = (typeof window.ALL_VALUE !== 'undefined' ? window.ALL_VALUE : '__ALL__');
  function byId(id){ return document.getElementById(id); }
  function text(v){ return String(v ?? '').trim(); }

  function ensureOneStageDropdown(){
    const gspn = byId('gspnPage');
    const stage = byId('stageFilter');
    if(!gspn || !stage) return;

    stage.setAttribute('multiple','multiple');
    stage.multiple = true;
    stage.style.display = 'none';

    const label = stage.closest('div')?.querySelector('.filter-label');
    if(label) label.textContent = 'Stage - Multiple Select';

    ['stageFilter_excel','stageFilter_v3_wrap','stageFilter_v4_wrap'].forEach(id => {
      const el = byId(id);
      if(el) el.remove();
    });
    ['stageFilter_v3_panel','stageFilter_v4_panel'].forEach(id => {
      const el = byId(id);
      if(el) el.remove();
    });

    let wrap = byId('stageFilter_v50');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.id = 'stageFilter_v50';
      wrap.className = 'gspn-v50-filter';
      wrap.innerHTML = '<button type="button" class="gspn-v50-btn"></button><div class="gspn-v50-panel"></div>';
      stage.insertAdjacentElement('afterend', wrap);
    }

    const btn = wrap.querySelector('.gspn-v50-btn');
    const panel = wrap.querySelector('.gspn-v50-panel');
    if(!btn || !panel) return;

    const selected = [...stage.selectedOptions].map(o=>o.value).filter(v=>v && v!==ALL);
    btn.textContent = selected.length ? (selected.length > 2 ? `${selected.length} selected` : selected.join(', ')) : '(Select All)';
    btn.title = btn.textContent;

    btn.onclick = function(e){
      e.preventDefault();
      e.stopPropagation();
      document.querySelectorAll('#gspnPage .gspn-v50-filter.open').forEach(w => { if(w !== wrap) w.classList.remove('open'); });
      if(wrap.classList.contains('open')){ wrap.classList.remove('open'); return; }
      drawPanel('');
      wrap.classList.add('open');
    };

    function esc(v){ return text(v).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s])); }
    function drawPanel(filter){
      const opts = [...stage.options].map(o => ({value:o.value, text:o.textContent, selected:o.selected}));
      let temp = new Set(opts.filter(o=>o.selected).map(o=>o.value));
      if(![...temp].filter(v=>v && v!==ALL).length) temp = new Set([ALL]);
      panel.innerHTML = '<input class="gspn-v50-search" placeholder="Search" autocomplete="off" />' +
        '<div class="gspn-v50-list"></div>' +
        '<div class="gspn-v50-actions"><button type="button" class="gspn-v50-cancel">Cancel</button><button type="button" class="gspn-v50-ok">OK</button></div>';
      const search = panel.querySelector('.gspn-v50-search');
      const list = panel.querySelector('.gspn-v50-list');
      function redraw(){
        const term = text(search.value).toLowerCase();
        list.innerHTML = opts.filter(o => !term || text(o.text).toLowerCase().includes(term)).map(o =>
          `<label class="gspn-v50-option"><input type="checkbox" data-value="${esc(o.value)}" ${temp.has(o.value)?'checked':''}> <span>${esc(o.text)}</span></label>`
        ).join('');
        list.querySelectorAll('input').forEach(cb => {
          cb.onchange = function(){
            const v = cb.getAttribute('data-value');
            if(v === ALL){ temp = cb.checked ? new Set([ALL]) : new Set(); }
            else { temp.delete(ALL); cb.checked ? temp.add(v) : temp.delete(v); if(!temp.size) temp.add(ALL); }
            redraw();
          };
        });
      }
      search.oninput = redraw;
      panel.querySelector('.gspn-v50-cancel').onclick = () => wrap.classList.remove('open');
      panel.querySelector('.gspn-v50-ok').onclick = function(){
        const real = [...temp].filter(v => v && v !== ALL);
        [...stage.options].forEach((o,i) => { o.selected = real.length ? real.includes(o.value) : (o.value === ALL || i === 0); });
        wrap.classList.remove('open');
        ensureOneStageDropdown();
        try{ if(typeof window.render === 'function') window.render(); }catch(e){}
      };
      redraw();
      setTimeout(()=>search.focus(),0);
    }
  }

  function moveRequestedChartsToBottom(){
    const gspn = byId('gspnPage');
    const grid = byId('gspnRequestedCharts');
    const anchor = byId('urgentSection') || byId('allCasesSection');
    if(!gspn || !grid || !anchor || !gspn.contains(grid) || !gspn.contains(anchor)) return;
    grid.querySelectorAll('.gspn-requested-clear-btn').forEach(btn => btn.remove());
    if(anchor.nextElementSibling !== grid) anchor.insertAdjacentElement('afterend', grid);
  }

  function applyFinalGspnFix(){
    ensureOneStageDropdown();
    moveRequestedChartsToBottom();
  }

  const previousUpdateCharts = window.updateCharts;
  if(typeof previousUpdateCharts === 'function'){
    window.updateCharts = function(){
      const result = previousUpdateCharts.apply(this, arguments);
      requestAnimationFrame(applyFinalGspnFix);
      return result;
    };
  }

  const previousRefreshFilterLists = window.refreshFilterLists;
  if(typeof previousRefreshFilterLists === 'function'){
    window.refreshFilterLists = function(){
      const result = previousRefreshFilterLists.apply(this, arguments);
      requestAnimationFrame(applyFinalGspnFix);
      return result;
    };
  }

  const previousRender = window.render;
  if(typeof previousRender === 'function'){
    window.render = function(){
      const result = previousRender.apply(this, arguments);
      requestAnimationFrame(applyFinalGspnFix);
      return result;
    };
  }

  document.addEventListener('click', function(e){
    if(!e.target.closest || !e.target.closest('#gspnPage .gspn-v50-filter')){
      document.querySelectorAll('#gspnPage .gspn-v50-filter.open').forEach(w => w.classList.remove('open'));
    }
  }, true);

  document.addEventListener('DOMContentLoaded', function(){ setTimeout(applyFinalGspnFix, 600); });
  window.addEventListener('load', function(){ setTimeout(applyFinalGspnFix, 700); });
  requestAnimationFrame(applyFinalGspnFix);
})();


/* ================= SHARED GITHUB DATA VERSIONING =================
   Shared data source is GitHub files only.
   Normal page loads use an ETag/Last-Modified based version so the browser can cache.
   Manual Refresh uses a force token to guarantee a fresh file immediately.
===================================================================== */
const SERVICE_DATA_FILES = {
  gspn: { file: 'datagspn.xlsx', sheet: 'GSPN Cases Tracking' },
  sky: { file: 'datasky.xlsx', sheet: '' },
  profit: { file: 'Profitability & commission.xlsx', sheet: '' },
  preBooking: { file: 'Pre_Booking.xlsx', sheet: 'Pre_Booking' },
  returnCases: { file: 'Return Cases.xlsx', sheet: 'Return Cases' },
  receivedDelivered: { file: 'Received_Delivered.xlsx', sheet: 'Received_Delivered' }
};
window.__serviceDataVersionCache = window.__serviceDataVersionCache || {};
function serviceEncodePath(file) {
  return String(file).split('/').map(encodeURIComponent).join('/');
}
async function serviceGetDataVersion(file, force) {
  if (force) return 'manual_' + Date.now();
  const cached = window.__serviceDataVersionCache[file];
  if (cached) return cached;
  try {
    const res = await fetch(serviceEncodePath(file), { method: 'HEAD', cache: 'no-cache' });
    const v = res.headers.get('etag') || res.headers.get('last-modified') || 'stable';
    window.__serviceDataVersionCache[file] = encodeURIComponent(v.replace(/^W\//, '').replace(/"/g, ''));
    return window.__serviceDataVersionCache[file];
  } catch (e) {
    window.__serviceDataVersionCache[file] = 'stable';
    return 'stable';
  }
}
async function serviceDataUrl(file, force) {
  const v = await serviceGetDataVersion(file, !!force);
  return serviceEncodePath(file) + (String(file).includes('?') ? '&' : '?') + 'v=' + v;
}
function serviceClearDataVersion(file) {
  try { delete window.__serviceDataVersionCache[file]; } catch(e) {}
}

/* ================= AUTO LOAD EXCEL FILES FROM GITHUB =================
   Files must be in the same GitHub folder as index.html:
   - datagspn.xlsx
   - datasky.xlsx
   This forces a fresh copy every time to reduce old cached data.
===================================================================== */
async function loadExcelRowsFromUrl(url, preferredSheetName, forceRefresh) {
  if (typeof window.__sscFetchJsonRowsForExcel === 'function') {
    try {
      const jsonResult = await window.__sscFetchJsonRowsForExcel(url, preferredSheetName, !!forceRefresh);
      return jsonResult.rows;
    } catch (jsonErr) {
      console.warn('JSON load failed, falling back to Excel:', url, jsonErr && jsonErr.message ? jsonErr.message : jsonErr);
    }
  }

  const finalUrl = await serviceDataUrl(url, !!forceRefresh);
  const response = await fetch(finalUrl, { cache: forceRefresh ? 'no-store' : 'default' });
  if (!response.ok) throw new Error(url + ' not found or cannot be loaded. HTTP ' + response.status);

  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array', cellDates: true });
  const sheetName = preferredSheetName && workbook.SheetNames.includes(preferredSheetName)
    ? preferredSheetName
    : workbook.SheetNames[0];

  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet, { defval: '', raw: true });
}

async function autoLoadGSPNFromGitHub(forceRefresh = false) {
  try {
    setUploadProgress(25, 'Loading GSPN data from GitHub...', 'Reading datagspn.xlsx from the shared GitHub repository.', true);
    const rawRows = await loadExcelRowsFromUrl('datagspn.xlsx', 'GSPN Cases Tracking', forceRefresh);
    await setRows(rawRows);
    setUploadProgress(100, 'GSPN GitHub data loaded', `${allRows.length} GSPN rows loaded from datagspn.xlsx.`, true);

  } catch (error) {

    setUploadProgress(0, 'GSPN GitHub load failed', error && error.message ? error.message : 'Could not load datagspn.xlsx.', true);
  }
}

async function autoLoadSKYFromGitHub(forceRefresh = false) {
  try {
    setUploadProgress(25, 'Loading SKY data from GitHub...', 'Reading datasky.xlsx from the shared GitHub repository.', true);
    const rawRows = await loadExcelRowsFromUrl('datasky.xlsx', '', forceRefresh);
    skyRows = rawRows.map(normalizeSkyRow).filter(r => r.Job_Number || r.IMEI || r.SerialNumber || r.Customer_Mobile || r.Customer_phone);
    resetSkyFiltersToAll();
    refreshSkyFilters();
    renderSky();
    setUploadProgress(100, 'SKY GitHub data loaded', `${skyRows.length} SKY rows loaded from datasky.xlsx.`, true);

  } catch (error) {

    setUploadProgress(0, 'SKY GitHub load failed', error && error.message ? error.message : 'Could not load datasky.xlsx.', true);
  }
}

/* Performance fix: legacy first auto-load removed.
   The unified GitHub loader below is the only initial data loader.
   Keeping this disabled prevents duplicate XLSX downloads/parsing during refresh. */

/* ===== SKY targeted fix: export filtered rows only ===== */
function exportSkyExcel() {
  const filteredRows = Array.isArray(currentSkyRows) ? currentSkyRows : [];
  exportRowsToExcel(
    filteredRows,
    SKY_COLUMNS,
    "SKY Tracking Cases Export.xlsx",
    "SKY Filtered Cases"
  );
}

/* ===== SKY targeted fix: remove duplicated chart value labels ===== */
function createSkyColumnChart(canvasId, labels, values, datasetLabel, onLabelClick = null, showErrorBars = false) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === "undefined") return;

  if (dashboardCharts[canvasId]) {
    dashboardCharts[canvasId].destroy();
    dashboardCharts[canvasId] = null;
  }
  try {
    if (typeof Chart.getChart === "function") {
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
    }
  } catch (e) {}

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  dashboardCharts[canvasId] = __safeNewChart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: datasetLabel,
        data: values,
        borderWidth: 1,
        showErrorBars
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 22 } },
      onClick: (event, elements) => {
        if (!onLabelClick || !elements.length) return;
        onLabelClick(labels[elements[0].index]);
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((a, b) => a + Number(b || 0), 0);
              const percent = total ? ((Number(ctx.raw || 0) / total) * 100).toFixed(1) : "0.0";
              return `${ctx.dataset.label}: ${ctx.raw} (${percent}%)`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 0
          }
        },
        y: {
          beginAtZero: true,
          suggestedMax: Math.max(...values, 0) * 1.15 + 1
        }
      }
    }
  });
}


/* ===== codex-final-visitor-and-sky-table-fix ===== */

(function(){
  'use strict';

  const PRESENCE_KEY = 'serviceEyeOnlineTabsLocalFallback_v2';
  const TAB_ID_KEY = 'serviceEyeVisitorTabId_v2';
  const STALE_MS = 20000;

  function byId(id){ return document.getElementById(id); }
  function text(value){ return String(value == null ? '' : value).trim(); }
  function esc(value){
    return text(value).replace(/[&<>"']/g, function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];
    });
  }
  /* [dedup] orphan helper activeSection removed */
  /* [dedup] orphan helper pageKey removed */
  function ensureVisitorBadge(){
    let badge = byId('topOnlineUsersBadge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'topOnlineUsersBadge';
      badge.className = 'top-online-users-badge';
      document.body.appendChild(badge);
    }
    if (!badge.querySelector('#topOnlineUsersCount')) {
      badge.innerHTML = '<span class="online-users-label">Visitors</span><span class="online-users-count" id="topOnlineUsersCount">0</span>';
    }
    const label = badge.querySelector('.online-users-label');
    if (label) label.textContent = 'Visitors';
    return badge;
  }
  /* [dedup] orphan helper setVisitorCount removed */
  function readPresence(){
    try { return JSON.parse(localStorage.getItem(PRESENCE_KEY) || '{}') || {}; }
    catch(e) { return {}; }
  }
  function writePresence(store){
    try { localStorage.setItem(PRESENCE_KEY, JSON.stringify(store)); } catch(e) {}
  }
  function localPresenceHeartbeat(){return; }

  const oldSwitchTab = window.switchTab;
  if (typeof oldSwitchTab === 'function' && !oldSwitchTab.__codexVisitorPatch) {
    const patched = function(){
      const result = oldSwitchTab.apply(this, arguments);
      requestAnimationFrame(localPresenceHeartbeat);
      return result;
    };
    patched.__codexVisitorPatch = true;
  }

  window.addEventListener('storage', localPresenceHeartbeat);
  document.addEventListener('visibilitychange', localPresenceHeartbeat);
  window.addEventListener('beforeunload', function(){
    const tabId = sessionStorage.getItem(TAB_ID_KEY);
    if (!tabId) return;
    const store = readPresence();
    delete store[tabId];
    writePresence(store);
  });

  function rowValue(row, key){
    if (!row) return '';
    if (key === 'Aging Days') {
      const keys = ['Aging Days','Aging_Days','AgingDays','aging_days','Aging'];
      for (const k of keys) {
        const v = row[k];
        if (v !== undefined && v !== null && String(v).trim() !== '') return v;
      }
      return '';
    }
    if (Object.prototype.hasOwnProperty.call(row, key)) return row[key];
    const lower = key.toLowerCase();
    const found = Object.keys(row).find(function(k){ return k.toLowerCase() === lower; });
    if (found) return row[found];
    if (key === 'Aging Days Group') return row['Aging Days Group'] ?? row.Aging_Days_Group ?? row.AgingDaysGroup ?? row.Aging_Group ?? row['aging Days Group'] ?? '';
    return '';
  }
  function renderCompleteSkyTable(rows){
    const table = byId('skyCasesTable');
    if (!table || !Array.isArray(rows)) return;
    const columns = [
      ['Queue','Queue'],
      ['Brand','Brand'],
      ['Branch','Branch'],
      ['Open_Date_Display','Open Date'],
      ['Aging Days','Aging Days'],
      ['Aging Days Group','Aging Days Group'],
      ['Job_Number','Job Number'],
      ['Status','Status'],
      ['Stage','Stage'],
      ['Item English Name','Item English Name'],
      ['Price','Price']
    ];
    if (!rows.length) {
      table.innerHTML = '<tr><td>No data available</td></tr>';
      return;
    }
    table.innerHTML =
      '<thead><tr>' + columns.map(function(col){ return '<th>' + esc(col[1]) + '</th>'; }).join('') + '</tr></thead>' +
      '<tbody>' + rows.map(function(row){
        return '<tr>' + columns.map(function(col){ return '<td>' + esc(rowValue(row, col[0])) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody>';
  }

  const oldRenderSky = window.renderSky;
  if (typeof oldRenderSky === 'function' && !oldRenderSky.__codexFullSkyTablePatch) {
    const patchedRenderSky = function(){
      const result = oldRenderSky.apply(this, arguments);
      const rows = typeof window.getSkyFilteredRows === 'function'
        ? window.getSkyFilteredRows()
        : (Array.isArray(window.currentSkyRows) ? window.currentSkyRows : []);
      window.currentSkyRows = rows;
      renderCompleteSkyTable(rows);
      return result;
    };
    patchedRenderSky.__codexFullSkyTablePatch = true;
    /* [dedup] superseded renderSky definition removed (was L9507) */
  }

  function boot(){
    ensureVisitorBadge();
    localPresenceHeartbeat();
    if (byId('skyCasesTable')) {
      const rows = typeof window.getSkyFilteredRows === 'function'
        ? window.getSkyFilteredRows()
        : (Array.isArray(window.currentSkyRows) ? window.currentSkyRows : []);
      if (rows.length) renderCompleteSkyTable(rows);
    }
  }

  document.addEventListener('DOMContentLoaded', function(){ setTimeout(boot, 250); });
  window.addEventListener('load', function(){ setTimeout(boot, 500); });
  requestAnimationFrame(boot);
})();


/* ===== codex-sky-workbook-export-chart-fix ===== */

(function(){
  'use strict';

  const WORKBOOK_URL = 'datasky.xlsx';
  const ALLOWED_QUEUES = new Set(['Open_Cases', 'Ready For Delivery Cases']);
  const TABLE_COLUMNS = [
    ['Queue','Queue'],
    ['Brand','Brand'],
    ['Branch','Branch'],
    ['Open_Date_Display','Open Date'],
    ['Aging Days','Aging Days'],
    ['Aging Days Group','Aging Days Group'],
    ['Job_Number','Job Number'],
    ['Status','Status'],
    ['Stage','Stage'],
    ['Item English Name','Item English Name'],
    ['Price','Price']
  ];
  const EXPORT_COLUMNS = [
    ['Queue','Queue'],
    ['Brand','Brand'],
    ['Branch','Branch'],
    ['Job_Number','Job_Number'],
    ['Status','Status'],
    ['Stage','Stage'],
    ['Final_Stausus','Final_Stausus'],
    ['Item English Name','Item English Name'],
    ['Price','Price'],
    ['Discount','Discount'],
    ['IMEI','IMEI'],
    ['SerialNumber','SerialNumber'],
    ['JobType','JobType'],
    ['Warranty','Warranty'],
    ['Recieved_By','Recieved_By'],
    ['Assigned_To','Assigned_To'],
    ['Defects','Defects'],
    ['Not_Repaired_Reason','Not_Repaired_Reason'],
    ['Open_Date','Open_Date'],
    ['Ready For Delivery Date','Ready For Delivery Date'],
    ['Aging Month','Aging Month'],
    ['Aging Days','Aging Days'],
    ['Customer_Type','Customer_Type'],
    ['Customer_Name','Customer_Name'],
    ['Customer_Mobile','Customer_Mobile'],
    ['Customer_Phone','Customer_Phone'],
    ['Aging Days Group','Aging Days Group']
  ];
  const DISABLED_CHART_PLUGIN_IDS = [
    'v19Labels',
    'v3RequestedCaseLabels',
    'gspnFinalV4Labels',
    'gspnRequestedValueLabels',
    'skyBarLabelErrorPlugin',
    'skyV43SingleLabels',
    'skyFinalValueLabels',
    'skyV28Labels',
    'skyV26Labels'
  ];

  let workbookRowsLoaded = false;
  let workbookLoadPromise = null;

  function byId(id){ return document.getElementById(id); }
  function text(value){ return String(value == null ? '' : value).trim(); }
  function esc(value){
    return text(value).replace(/[&<>"']/g, function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];
    });
  }
  function normKey(value){ return text(value).toLowerCase().replace(/[^a-z0-9]/g, ''); }
  function rowValue(row, key) {
    if (!row) return '';
    if (key === 'Aging Days') {
      const keys = ['Aging Days','Aging_Days','AgingDays','aging_days','Aging'];
      for (const k of keys) {
        const v = row[k];
        if (v !== undefined && v !== null && String(v).trim() !== '') return v;
      }
      return '';
    }
    if (Object.prototype.hasOwnProperty.call(row, key)) return row[key];
    const wanted = normKey(key);
    const found = Object.keys(row).find(function(k){ return normKey(k) === wanted; });
    if (found) return row[found];
    if (key === 'Aging Days Group') return row['Aging Days Group'] ?? row.Aging_Days_Group ?? row.AgingDaysGroup ?? row.Aging_Group ?? row['aging Days Group'] ?? '';
    if (key === 'Customer_Phone') return row.Customer_Phone ?? row.Customer_phone ?? row['Customer Phone'] ?? '';
    return '';
  }
  function formatDateDisplay(value) {
    if (!value) return '';
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }).replace(/ /g, '-');
    }
    if (typeof value === 'number' && typeof XLSX !== 'undefined' && XLSX.SSF) {
      try {
        const d = XLSX.SSF.parse_date_code(value);
        if (d) return new Date(d.y, d.m - 1, d.d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }).replace(/ /g, '-');
      } catch(e) {}
    }
    return text(value);
  }
  function dateStamp(value) {
    if (!value) return null;
    if (value instanceof Date && !Number.isNaN(value.getTime())) return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
    if (typeof value === 'number' && typeof XLSX !== 'undefined' && XLSX.SSF) {
      try {
        const d = XLSX.SSF.parse_date_code(value);
        if (d) return new Date(d.y, d.m - 1, d.d).getTime();
      } catch(e) {}
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()).getTime();
  }
  function normalizeSkyWorkbookRow(row) {
    const out = {};
    Object.keys(row || {}).forEach(function(k){ if (text(k)) out[k] = row[k]; });
    out.Queue = text(rowValue(out, 'Queue'));
    out.Brand = text(rowValue(out, 'Brand'));
    out.Branch = text(rowValue(out, 'Branch'));
    out.Job_Number = text(rowValue(out, 'Job_Number'));
    out.Status = text(rowValue(out, 'Status'));
    out.Stage = text(rowValue(out, 'Stage'));
    out.Open_Date = rowValue(out, 'Open_Date');
    out.Open_Date_Display = formatDateDisplay(out.Open_Date);
    out.Open_Date_Stamp = dateStamp(out.Open_Date);
    out['Aging Days'] = rowValue(out, 'Aging Days');
    out.Aging_Days = rowValue(out, 'Aging Days');
    out['Aging Days Group'] = text(rowValue(out, 'Aging Days Group'));
    out.Aging_Days_Group = out['Aging Days Group'];
    out.Customer_Phone = rowValue(out, 'Customer_Phone');
    out.Customer_phone = out.Customer_Phone;
    return out;
  }
  function skyRowsArray(){
    try {
      if (Array.isArray(window.skyRows)) return window.skyRows;
      if (typeof skyRows !== 'undefined' && Array.isArray(skyRows)) return skyRows;
    } catch(e) {}
    return [];
  }
  function setSkyRows(rows) {
    const normalized = rows.map(normalizeSkyWorkbookRow).filter(function(row){ return ALLOWED_QUEUES.has(row.Queue); });
    window.skyRows = normalized;
    try { skyRows = normalized; } catch(e) {}
    window.currentSkyRows = applySkyFilters(normalized);
    return normalized;
  }
  async function loadSkyWorkbookRows(force) {
    if (workbookRowsLoaded && !force) return skyRowsArray();
    if (workbookLoadPromise && !force) return workbookLoadPromise;
    if (typeof XLSX === 'undefined') return skyRowsArray();
    workbookLoadPromise = fetch(WORKBOOK_URL + '?v=' + Date.now(), { cache:'no-store' })
      .then(function(response){
        if (!response.ok) throw new Error('Cannot load ' + WORKBOOK_URL + ': HTTP ' + response.status);
        return response.arrayBuffer();
      })
      .then(function(buffer){
        const workbook = XLSX.read(new Uint8Array(buffer), { type:'array', cellDates:true });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(sheet, { defval:'', raw:true });
        workbookRowsLoaded = true;
        const rows = setSkyRows(raw);
        
        return rows;
      })
      .catch(function(error){
        workbookRowsLoaded = true;
        if (typeof setSkyUploadProgress === 'function')
          setSkyUploadProgress(0, 'Auto-load failed', (error && error.message) || 'Could not load workbook.', true);
        return setSkyRows(skyRowsArray());
      });
    return workbookLoadPromise;
  }
  function selectedMulti(id) {
    const el = byId(id);
    if (!el) return [];
    return Array.from(el.selectedOptions || [])
      .map(function(option){ return text(option.value || option.textContent); })
      .filter(function(value){ return value && value !== '__ALL__' && value !== 'ALL' && value !== '(Select All)'; });
  }
  function selectedSingle(id) {
    const el = byId(id);
    return el ? text(el.value) : '';
  }
  function applySkyFilters(sourceRows) {
    const branches = selectedMulti('skyBranchFilter');
    const stages = selectedMulti('skyStageFilter');
    const queue = selectedSingle('skyQueueFilter');
    const brand = selectedSingle('skyBrandFilter');
    const aging = selectedSingle('skyAgingDaysGroupFilter');
    const search = selectedSingle('skySearchBox').toLowerCase();
    const from = selectedSingle('skyFromDate') ? new Date(selectedSingle('skyFromDate') + 'T00:00:00').getTime() : null;
    const to = selectedSingle('skyToDate') ? new Date(selectedSingle('skyToDate') + 'T00:00:00').getTime() : null;
    return (sourceRows || []).filter(function(row){
      if (!ALLOWED_QUEUES.has(text(row.Queue))) return false;
      if (branches.length && !branches.includes(text(row.Branch))) return false;
      if (stages.length && !stages.includes(text(row.Stage))) return false;
      if (queue && text(row.Queue) !== queue) return false;
      if (brand && text(row.Brand) !== brand) return false;
      if (aging && text(rowValue(row, 'Aging Days Group')) !== aging) return false;
      if (from !== null && row.Open_Date_Stamp !== null && row.Open_Date_Stamp < from) return false;
      if (to !== null && row.Open_Date_Stamp !== null && row.Open_Date_Stamp > to) return false;
      if (search) {
        const hay = ['Job_Number','IMEI','SerialNumber','Customer_Mobile','Customer_Phone','Customer_phone','Queue','Stage','Status','Branch','Aging Days Group','Item English Name']
          .map(function(key){ return text(rowValue(row, key)); }).join(' ').toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });
  }
  function fillSelect(id, values, allText, keepMultiple) {
    const el = byId(id);
    if (!el) return;
    const selected = Array.from(el.selectedOptions || []).map(function(option){ return text(option.value || option.textContent); }).filter(Boolean);
    const current = text(el.value);
    const uniqueValues = Array.from(new Set(values.map(text).filter(Boolean))).sort();
    el.innerHTML = '<option value="' + (keepMultiple ? '__ALL__' : '') + '">' + esc(allText) + '</option>' +
      uniqueValues.map(function(value){ return '<option value="' + esc(value) + '">' + esc(value) + '</option>'; }).join('');
    if (keepMultiple) {
      const kept = selected.filter(function(value){ return uniqueValues.includes(value); });
      Array.from(el.options).forEach(function(option, index){
        option.selected = kept.length ? kept.includes(text(option.value || option.textContent)) : index === 0;
      });
    } else if (uniqueValues.includes(current)) {
      el.value = current;
    }
  }
  function refreshSkyFilterOptions(rows) {
    fillSelect('skyBranchFilter', rows.map(function(row){ return row.Branch; }), 'All Branches', true);
    fillSelect('skyStageFilter', rows.map(function(row){ return row.Stage; }), 'All Stages', true);
    fillSelect('skyAgingDaysGroupFilter', rows.map(function(row){ return rowValue(row, 'Aging Days Group'); }), 'All Aging Days Groups', false);
  }
  function renderSkyTable(rows) {
    const table = byId('skyCasesTable');
    if (!table) return;
    if (!rows.length) {
      table.innerHTML = '<tr><td>No data available</td></tr>';
      return;
    }
    table.innerHTML = '<thead><tr>' + TABLE_COLUMNS.map(function(col){ return '<th>' + esc(col[1]) + '</th>'; }).join('') + '</tr></thead>' +
      '<tbody>' + rows.map(function(row){
        return '<tr>' + TABLE_COLUMNS.map(function(col){ return '<td>' + esc(rowValue(row, col[0])) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody>';
  }
  function setText(id, value) {
    const el = byId(id);
    if (el) el.textContent = String(value);
  }
  function percent(part, total) {
    return total ? Math.round((Number(part || 0) * 100) / Number(total || 1)) : 0;
  }
  function updateSkyCards(rows) {
    const total = rows.length;
    const open = rows.filter(function(row){ return row.Queue === 'Open_Cases'; }).length;
    const ready = rows.filter(function(row){ return row.Queue === 'Ready For Delivery Cases'; }).length;
    const samsung = rows.filter(function(row){ return text(row.Brand).toLowerCase() === 'samsung'; }).length;
    const apple = rows.filter(function(row){ return text(row.Brand).toLowerCase() === 'apple'; }).length;
    setText('skyTotalCases', total);
    setText('skyOpenCases', open);
    setText('skyOpenPercent', percent(open, total) + '% of Total');
    setText('skyReadyCases', ready);
    setText('skyReadyPercent', percent(ready, total) + '% of Total');
    setText('skySamsungCases', samsung);
    setText('skySamsungPercent', percent(samsung, total) + '% of Total');
    setText('skyAppleCases', apple);
    setText('skyApplePercent', percent(apple, total) + '% of Total');
  }
  function countBy(rows, field) {
    const map = new Map();
    rows.forEach(function(row){
      const key = text(rowValue(row, field)) || 'Blank';
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).sort(function(a,b){ return b[1] - a[1] || a[0].localeCompare(b[0]); });
  }
  function setSummary(id, items, total) {
    const el = byId(id);
    if (!el) return;
    el.innerHTML = items.map(function(item){
      return '<span class="sky-chart-chip">' + esc(item[0]) + ': ' + item[1] + ' (' + percent(item[1], total) + '%)</span>';
    }).join('');
  }
  function resetCanvas(canvas) {
    if (!canvas) return;
    const id = canvas.id;
    try {
      if (window.dashboardCharts && window.dashboardCharts[id]) {
        window.dashboardCharts[id].destroy();
        delete window.dashboardCharts[id];
      }
    } catch(e) {}
    const fresh = canvas.cloneNode(false);
    canvas.parentNode.replaceChild(fresh, canvas);
  }
  function disableGlobalChartLabels() {
    if (!window.Chart || !Chart.registry || !Chart.registry.plugins) return;
    DISABLED_CHART_PLUGIN_IDS.forEach(function(id){
      try {
        const plugin = Chart.registry.plugins.get(id);
        if (plugin) Chart.unregister(plugin);
      } catch(e) {}
    });
  }
  function ensureCleanSkyChartDom() {
    const grid = byId('skyChartsSection');
    if (!grid) return;
    grid.className = 'charts-grid sky-charts sky-requested-insights sky-codex-clean-charts';
    grid.innerHTML =
      '<section class="chart-card"><h2>Open Cases per Branch</h2><div class="sky-chart-summary" id="skyOpenBranchSummary"></div><div class="chart-box sky-open-branch-chart-box"><canvas id="skyOpenBranchChart"></canvas></div></section>' +
      '<section class="chart-card"><h2>Open_Cases Status</h2><div class="sky-chart-summary" id="skyOpenStatusSummary"></div><div class="chart-box sky-open-status-chart-box"><canvas id="skyOpenStatusChart"></canvas></div></section>';
  }
  function renderBar(canvasId, items, label, horizontal) {
    const canvas = byId(canvasId);
    if (!canvas || !window.Chart) return;
    resetCanvas(canvas);
    disableGlobalChartLabels();
    const fresh = byId(canvasId);
    const labels = items.map(function(item){ return item[0] + ' (' + percent(item[1], items.reduce(function(sum,x){ return sum + x[1]; }, 0)) + '%)'; });
    const values = items.map(function(item){ return item[1]; });
    const total = values.reduce(function(sum,value){ return sum + Number(value || 0); }, 0);
    const max = Math.max.apply(null, values.concat([0]));
    const colors = (window.COLORS || ['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#7f7f7f','#bcbd22','#17becf']);
    window.dashboardCharts = window.dashboardCharts || {};
    window.dashboardCharts[canvasId] = __safeNewChart(fresh, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: values,
          backgroundColor: values.map(function(_, i){ return colors[i % colors.length]; }),
          borderColor: values.map(function(_, i){ return colors[i % colors.length]; }),
          borderWidth: 1,
          borderRadius: horizontal ? 6 : 5,
          maxBarThickness: horizontal ? 24 : 52
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        indexAxis: horizontal ? 'y' : 'x',
        layout: { padding: { top: 18, right: 22, bottom: 18, left: 8 } },
        plugins: Object.assign({
          legend: { display: false },
          tooltip: { callbacks: { label: function(ctx){ return label + ': ' + ctx.raw + ' (' + percent(ctx.raw, total) + '%)'; } } }
        }, DISABLED_CHART_PLUGIN_IDS.reduce(function(acc, id){ acc[id] = false; return acc; }, {})),
        scales: {
          x: {
            beginAtZero: true,
            suggestedMax: horizontal ? max * 1.2 + 1 : undefined,
            ticks: { autoSkip: false, precision: 0, maxRotation: horizontal ? 0 : 25, minRotation: 0, color: '#111827', font: { weight: '700' } },
            grid: { color: 'rgba(17,24,39,.18)' }
          },
          y: {
            beginAtZero: !horizontal,
            suggestedMax: horizontal ? undefined : max * 1.2 + 1,
            afterFit: function(scale){ if (horizontal) scale.width = Math.min(330, Math.max(150, ...labels.map(function(item){ return String(item).length * 6.6; }))); },
            ticks: {
              autoSkip: false,
              precision: 0,
              color: '#111827',
              font: { weight: '700' },
              callback: function(value) {
                const axisLabel = this.getLabelForValue ? this.getLabelForValue(value) : value;
                return horizontal && String(axisLabel).length > 48 ? String(axisLabel).slice(0, 47) + '...' : axisLabel;
              }
            },
            grid: { color: 'rgba(17,24,39,.18)' }
          }
        },
        onClick: function(evt, elements) {
          if (!elements.length) return;
          const raw = items[elements[0].index][0];
          if (canvasId === 'skyOpenBranchChart') {
            const branch = byId('skyBranchFilter');
            if (branch) Array.from(branch.options).forEach(function(option){ option.selected = text(option.value || option.textContent) === raw; });
            const queue = byId('skyQueueFilter');
            if (queue) queue.value = 'Open_Cases';
            window.renderSky();
          }
          if (canvasId === 'skyOpenStatusChart') {
            const search = byId('skySearchBox');
            if (search) search.value = raw;
            const queue = byId('skyQueueFilter');
            if (queue) queue.value = 'Open_Cases';
            window.renderSky();
          }
        }
      }
    });
  }
  function updateCleanSkyCharts(rows) {
    ensureCleanSkyChartDom();
    const openRows = rows.filter(function(row){ return row.Queue === 'Open_Cases'; });
    const branch = countBy(openRows, 'Branch');
    const status = countBy(openRows, 'Status');
    setSummary('skyOpenBranchSummary', branch, openRows.length);
    setSummary('skyOpenStatusSummary', status, openRows.length);
    renderBar('skyOpenBranchChart', branch, 'Open_Cases', false);
    renderBar('skyOpenStatusChart', status, 'Open_Cases', true);
  }
  function renderSkyClean() {
    const all = setSkyRows(skyRowsArray());
    refreshSkyFilterOptions(all);
    const rows = applySkyFilters(all);
    window.currentSkyRows = rows;
    renderSkyTable(rows);
    updateSkyCards(rows);
    updateCleanSkyCharts(rows);
    return rows;
  }
  /* [dedup] superseded getSkyFilteredRows definition removed (was L9941) */
  /* [dedup] superseded renderSky definition removed (was L9942) */
  /* [dedup] superseded exportSkyExcel definition removed (was L9943) */

  async function boot() {
    await loadSkyWorkbookRows(false);
    renderSkyClean();
  }

  document.addEventListener('DOMContentLoaded', function(){ setTimeout(boot, 600); });
  window.addEventListener('load', function(){ setTimeout(boot, 800); });
  requestAnimationFrame(boot);
})();


/* ===== codex-remove-analyses-dashboard-script ===== */

(function(){
  'use strict';

  function byId(id){ return document.getElementById(id); }
  function txt(value){ return String(value == null ? '' : value).toLowerCase(); }

  function isAnalysisTab(el) {
    if (!el) return false;
    return el.classList.contains('analysis-tab') ||
      txt(el.textContent).includes('analyses dashboard') ||
      txt(el.getAttribute('onclick')).includes('analysis') ||
      txt(el.getAttribute('onclick')).includes('analyses');
  }

  function removeAnalysesDashboard() {
    document.querySelectorAll('#analysisPage').forEach(function(el){ el.remove(); });
    document.querySelectorAll('.side-tab').forEach(function(tab){
      if (isAnalysisTab(tab)) tab.remove();
    });
    if (txt(localStorage.getItem('serviceEyeActiveTab')).includes('analys')) {
      localStorage.setItem('serviceEyeActiveTab', 'gspn');
    }
    try { sessionStorage.removeItem('analysisDashboardUnlocked'); } catch(e) {}
  }

  function setActiveTab(tab) {
    const safeTab = tab === 'sky' ? 'sky' : 'gspn';
    localStorage.setItem('serviceEyeActiveTab', safeTab);

    const gspnPage = byId('gspnPage');
    const skyPage = byId('skyPage');
    if (gspnPage) gspnPage.style.display = safeTab === 'gspn' ? 'block' : 'none';
    if (skyPage) skyPage.style.display = safeTab === 'sky' ? 'block' : 'none';

    document.querySelectorAll('.side-tab').forEach(function(tabEl){
      if (isAnalysisTab(tabEl)) {
        tabEl.remove();
        return;
      }
      const label = txt(tabEl.textContent);
      const isGspn = label.includes('gspn');
      const isSky = label.includes('sky');
      tabEl.classList.toggle('active',
        (safeTab === 'gspn' && isGspn) ||
        (safeTab === 'sky' && isSky)
      );
    });

    try {
      if (typeof applyTabDesign === 'function') applyTabDesign(safeTab, false);
    } catch(e) {}

    setTimeout(function(){
      if (safeTab === 'sky' && typeof window.renderSky === 'function') window.renderSky();
      if (safeTab === 'gspn') {
        if (typeof window.render === 'function') window.render();
        else if (typeof window.updateCharts === 'function' && Array.isArray(window.currentFilteredRows)) window.updateCharts(window.currentFilteredRows);
      }
    }, 80);
  }

  function installTwoTabSwitch() {
    window.switchTab.__codexTwoTabsOnly = true;

    [
      'renderAnalysisDashboardV35',
      'renderV54AnalysisDashboard',
      'renderV55AnalysisDashboard',
      'renderV58AnalysisDashboard',
      'syncAnalysesDashboardFromOneDrive',
      'v57_render',
      'v58_render',
      'v57_buildShell',
      'v58_buildShell',
      'v57_fixHeader'
    ].forEach(function(name){
      window[name] = function(){ return undefined; };
    });
  }

  function boot() {
    removeAnalysesDashboard();
    installTwoTabSwitch();
    setActiveTab(txt(localStorage.getItem('serviceEyeActiveTab')) === 'sky' ? 'sky' : 'gspn');
  }

  const observer = new MutationObserver(function(){
    clearTimeout(observer._timer);
    observer._timer = setTimeout(function(){
      removeAnalysesDashboard();
      if (!window.switchTab || !window.switchTab.__codexTwoTabsOnly) installTwoTabSwitch();
    }, 120);
  });

  if (document.body) observer.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['class','style','onclick'] });
  document.addEventListener('DOMContentLoaded', function(){ requestAnimationFrame(boot); });
  window.addEventListener('load', function(){ requestAnimationFrame(boot); });
  requestAnimationFrame(boot);
})();


/* ===== codex-sky-final-no-wipe-aging-export-hotfix ===== */

(function(){
  'use strict';

  const QUEUES = new Set(['Open_Cases', 'Ready For Delivery Cases']);
  const TABLE_COLS = [
    ['Queue','Queue'],
    ['Brand','Brand'],
    ['Branch','Branch'],
    ['Open_Date_Display','Open Date'],
    ['Aging Days','Aging Days'],
    ['Aging Days Group','Aging Days Group'],
    ['Job_Number','Job Number'],
    ['Status','Status'],
    ['Stage','Stage'],
    ['Item English Name','Item English Name'],
    ['Price','Price']
  ];
  const EXPORT_COLS = [
    ['Queue','Queue'],
    ['Brand','Brand'],
    ['Branch','Branch'],
    ['Job_Number','Job_Number'],
    ['Status','Status'],
    ['Stage','Stage'],
    ['Final_Stausus','Final_Stausus'],
    ['Item English Name','Item English Name'],
    ['Price','Price'],
    ['Discount','Discount'],
    ['IMEI','IMEI'],
    ['SerialNumber','SerialNumber'],
    ['JobType','JobType'],
    ['Warranty','Warranty'],
    ['Recieved_By','Recieved_By'],
    ['Assigned_To','Assigned_To'],
    ['Defects','Defects'],
    ['Not_Repaired_Reason','Not_Repaired_Reason'],
    ['Open_Date','Open_Date'],
    ['Ready For Delivery Date','Ready For Delivery Date'],
    ['Aging Month','Aging Month'],
    ['Aging Days','Aging Days'],
    ['Customer_Type','Customer_Type'],
    ['Customer_Name','Customer_Name'],
    ['Customer_Mobile','Customer_Mobile'],
    ['Customer_Phone','Customer_Phone'],
    ['Aging Days Group','Aging Days Group']
  ];
  const LABEL_PLUGINS = [
    'v19Labels','v20SkyLabels','skyV43SingleLabels','skyBarLabelErrorPlugin',
    'skyFinalValueLabels','skyV40ValueLabels','skyV41ValueLabels','skyV42ValueLabels',
    'gspnRequestedValueLabels'
  ];

  function byId(id){ return document.getElementById(id); }
  function clean(value){ return String(value == null ? '' : value).trim(); }
  function key(value){ return clean(value).toLowerCase().replace(/[^a-z0-9]/g, ''); }
  function esc(value){
    return clean(value).replace(/[&<>"']/g, function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];
    });
  }
  function val(row, wanted) {
    if (!row) return '';
    if (wanted === 'Aging Days') {
      const keys = ['Aging Days','Aging_Days','AgingDays','aging_days','Aging'];
      for (const k of keys) {
        const v = row[k];
        if (v !== undefined && v !== null && String(v).trim() !== '') return v;
      }
      return '';
    }
    if (wanted === 'Aging Month') return row['Aging Month'] ?? row.Aging_Month ?? row.Aging_Months ?? '';
    if (wanted === 'Aging Days Group') {
      return clean(row['Aging Days Group']) ||
        clean(row['aging Days Group']) ||
        clean(row.Aging_Days_Group) ||
        clean(row.aging_Days_Group) ||
        clean(row.AgingDaysGroup) ||
        clean(row.Aging_Group) ||
        '';
    }
    if (wanted === 'Customer_Phone') return row.Customer_Phone ?? row.Customer_phone ?? row['Customer Phone'] ?? '';
    if (Object.prototype.hasOwnProperty.call(row, wanted)) return row[wanted];
    const wantedKey = key(wanted);
    const found = Object.keys(row).find(function(k){ return key(k) === wantedKey; });
    if (found) return row[found];
    return '';
  }
  function numberFrom(value) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    const match = clean(value).replace(',', '.').match(/-?\d+(\.\d+)?/);
    return match ? Number(match[0]) : null;
  }
  function skyAgingDaysNumber(row) {
    // Strict source: use only the real Aging Days column. This prevents 0-3 day rows from being counted
    // just because their text group contains a value like "4 to 10 Days" from a stale/derived field.
    let days = numberFrom(val(row, 'Aging Days'));
    if (days == null) days = numberFrom(val(row, 'Aging_Days'));
    if (days == null) days = numberFrom(val(row, 'AgingDays'));
    if (days == null) days = numberFrom(val(row, 'Aging'));
    return Number.isFinite(days) ? days : null;
  }
  function isOpen4Plus(row) {
    const days = skyAgingDaysNumber(row);
    return row && clean(row.Queue) === 'Open_Cases' && days !== null && days >= 4;
  }
  function toDateObject(value) {
    if (!value) return null;
    if (value instanceof Date && !Number.isNaN(value.getTime())) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    if (typeof value === 'number' && window.XLSX && XLSX.SSF) {
      try {
        const d = XLSX.SSF.parse_date_code(value);
        if (d) return new Date(d.y, d.m - 1, d.d);
      } catch(e) {}
    }
    const raw = clean(value);
    let m = raw.match(/^(\d{1,2})[-\/\s]([A-Za-z]{3,9})[-\/\s](\d{2,4})$/);
    if (m) {
      const months = {jan:0,january:0,feb:1,february:1,mar:2,march:2,apr:3,april:3,may:4,jun:5,june:5,jul:6,july:6,aug:7,august:7,sep:8,sept:8,september:8,oct:9,october:9,nov:10,november:10,dec:11,december:11};
      const mon = months[m[2].toLowerCase()];
      let year = Number(m[3]); if (year < 100) year += 2000;
      if (mon !== undefined) return new Date(year, mon, Number(m[1]));
    }
    m = raw.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
    if (m) return new Date(Number(m[1]), Number(m[2])-1, Number(m[3]));
    m = raw.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/);
    if (m) { let y=Number(m[3]); if(y<100)y+=2000; return new Date(y, Number(m[2])-1, Number(m[1])); }
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function excelSerialDate(date) {
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(1899, 11, 30)) / 86400000;
  }
  function openGroupFromDays(days) {
    const n = numberFrom(days);
    if (n == null) return '';
    if (n <= 3) return 'From 0 to 3 Days';
    if (n <= 10) return 'From 4 to 10 Days';
    return 'More than 10 Days';
  }
  function readyGroupFromMonth(row) {
    const rawMonth = val(row, 'Aging Month');
    let months = numberFrom(rawMonth);
    if (months == null) {
      const days = numberFrom(val(row, 'Aging Days'));
      if (days != null) months = days / 30.4375;
    }
    if (months == null) return '';
    if (months <= 3) return 'From 1 to 3 Months';
    if (months <= 7) return 'From 4 to 7 Months';
    return 'More than 7 Months';
  }
  function formatDate(value) {
    if (!value) return '';
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }).replace(/ /g, '-');
    }
    if (typeof value === 'number' && window.XLSX && XLSX.SSF) {
      try {
        const d = XLSX.SSF.parse_date_code(value);
        if (d) return new Date(d.y, d.m - 1, d.d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }).replace(/ /g, '-');
      } catch(e) {}
    }
    return clean(value);
  }
  function dateStamp(value) {
    if (!value) return null;
    if (value instanceof Date && !Number.isNaN(value.getTime())) return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
    if (typeof value === 'number' && window.XLSX && XLSX.SSF) {
      try {
        const d = XLSX.SSF.parse_date_code(value);
        if (d) return new Date(d.y, d.m - 1, d.d).getTime();
      } catch(e) {}
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()).getTime();
  }
  function normalize(row) {
    const out = Object.assign({}, row || {});
    out.Queue = clean(val(out, 'Queue'));
    out.Brand = clean(val(out, 'Brand'));
    out.Branch = clean(val(out, 'Branch'));
    out.Job_Number = clean(val(out, 'Job_Number'));
    out.Status = clean(val(out, 'Status'));
    out.Stage = clean(val(out, 'Stage'));
    out.Open_Date = val(out, 'Open_Date');
    out.Open_Date_Display = clean(out.Open_Date_Display) || formatDate(out.Open_Date);
    out.Open_Date_Stamp = out.Open_Date_Stamp ?? dateStamp(out.Open_Date);
    out['Aging Days'] = val(out, 'Aging Days');
    const normalizedAgingDays = skyAgingDaysNumber(out);
    if (normalizedAgingDays !== null) out['Aging Days'] = normalizedAgingDays;
    out.Aging_Days = out['Aging Days'];
    let group = clean(val(out, 'Aging Days Group'));
    if (!group) group = out.Queue === 'Ready For Delivery Cases' ? readyGroupFromMonth(out) : openGroupFromDays(out['Aging Days']);
    out['Aging Days Group'] = group;
    out['aging Days Group'] = group;
    out.Aging_Days_Group = group;
    out.Customer_Phone = val(out, 'Customer_Phone');
    out.Customer_phone = out.Customer_Phone;
    return out;
  }
  function currentRowsRaw() {
    try {
      if (Array.isArray(window.skyRows) && window.skyRows.length) return window.skyRows;
      if (typeof skyRows !== 'undefined' && Array.isArray(skyRows) && skyRows.length) return skyRows;
    } catch(e) {}
    try {
      if (Array.isArray(window.currentSkyRows) && window.currentSkyRows.length) return window.currentSkyRows;
    } catch(e) {}
    return [];
  }
  function setRows(rows) {
    const normalized = (Array.isArray(rows) ? rows : []).map(normalize).filter(function(row){ return QUEUES.has(row.Queue); });
    if (!normalized.length && currentRowsRaw().length) return currentRowsRaw().map(normalize).filter(function(row){ return QUEUES.has(row.Queue); });
    window.skyRows = normalized;
    try { skyRows = normalized; } catch(e) {}
    return normalized;
  }
  async function refreshFromWorkbookIfAvailable() {
    if (!window.XLSX) return setRows(currentRowsRaw());
    try {
      const response = await fetch('datasky.xlsx?v=' + Date.now(), { cache:'no-store' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const buffer = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(buffer), { type:'array', cellDates:true });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval:'', raw:true });
      if (!rows.length) throw new Error('Workbook returned no rows');
      return setRows(rows);
    } catch(error) {

      return setRows(currentRowsRaw());
    }
  }
  function selectedMulti(id) {
    const el = byId(id);
    if (!el) return [];
    return Array.from(el.selectedOptions || []).map(function(option){ return clean(option.value || option.textContent); })
      .filter(function(value){ return value && value !== '__ALL__' && value !== 'ALL' && value !== '(Select All)'; });
  }
  function selectedSingle(id) {
    const el = byId(id);
    return el ? clean(el.value) : '';
  }
  function isOpen4PlusModeActive() {
    const queueValue = selectedSingle('skyQueueFilter');
    if (window.__skyOpen4PlusOnly && queueValue !== 'Open_Cases') {
      window.__skyOpen4PlusOnly = false;
      return false;
    }
    return window.__skyOpen4PlusOnly === true && queueValue === 'Open_Cases';
  }
  function fillSelect(id, values, label, multi) {
    const el = byId(id);
    if (!el) return;
    const selected = Array.from(el.selectedOptions || []).map(function(option){ return clean(option.value || option.textContent); });
    const old = clean(el.value);
    const unique = Array.from(new Set(values.map(clean).filter(Boolean))).sort();
    el.innerHTML = '<option value="' + (multi ? '__ALL__' : '') + '">' + esc(label) + '</option>' +
      unique.map(function(value){ return '<option value="' + esc(value) + '">' + esc(value) + '</option>'; }).join('');
    if (multi) {
      const keep = selected.filter(function(value){ return unique.includes(value); });
      Array.from(el.options).forEach(function(option, index){ option.selected = keep.length ? keep.includes(clean(option.value || option.textContent)) : index === 0; });
    } else {
      el.value = unique.includes(old) ? old : '';
    }
  }
  function refreshFilters(rows) {
    fillSelect('skyBranchFilter', rows.map(function(row){ return row.Branch; }), 'All Branches', true);
    fillSelect('skyStageFilter', rows.map(function(row){ return row.Stage; }), 'All Stages', true);
    fillSelect('skyAgingDaysGroupFilter', rows.map(function(row){ return val(row, 'Aging Days Group'); }), 'All Aging Days Groups', false);
  }
  function filteredRows(rows) {
    const branches = selectedMulti('skyBranchFilter');
    const stages = selectedMulti('skyStageFilter');
    const queue = selectedSingle('skyQueueFilter');
    const brand = selectedSingle('skyBrandFilter');
    const aging = selectedSingle('skyAgingDaysGroupFilter');
    const search = selectedSingle('skySearchBox').toLowerCase();
    const from = selectedSingle('skyFromDate') ? new Date(selectedSingle('skyFromDate') + 'T00:00:00').getTime() : null;
    const to = selectedSingle('skyToDate') ? new Date(selectedSingle('skyToDate') + 'T00:00:00').getTime() : null;
    return rows.filter(function(row){
      if (!QUEUES.has(row.Queue)) return false;
      if (branches.length && !branches.includes(row.Branch)) return false;
      if (stages.length && !stages.includes(row.Stage)) return false;
      if (queue && row.Queue !== queue) return false;
      if (isOpen4PlusModeActive() && !isOpen4Plus(row)) return false;
      if (brand && row.Brand !== brand) return false;
      if (aging && val(row, 'Aging Days Group') !== aging) return false;
      if (from !== null && row.Open_Date_Stamp !== null && row.Open_Date_Stamp < from) return false;
      if (to !== null && row.Open_Date_Stamp !== null && row.Open_Date_Stamp > to) return false;
      if (search) {
        const hay = ['Job_Number','IMEI','SerialNumber','Customer_Mobile','Customer_Phone','Queue','Stage','Status','Branch','Aging Days Group','Item English Name']
          .map(function(field){ return clean(val(row, field)); }).join(' ').toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });
  }
  function renderTable(rows) {
    const table = byId('skyCasesTable');
    if (!table) return;
    if (!rows.length) {
      table.innerHTML = '<tr><td>No data available</td></tr>';
      return;
    }
    table.innerHTML = '<thead><tr>' + TABLE_COLS.map(function(col){ return '<th>' + esc(col[1]) + '</th>'; }).join('') + '</tr></thead>' +
      '<tbody>' + rows.map(function(row){
        return '<tr>' + TABLE_COLS.map(function(col){ return '<td>' + esc(val(row, col[0])) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody>';
  }
  function setText(id, value) {
    const el = byId(id);
    if (el) el.textContent = String(value);
  }
  function pct(a,b){ return b ? Math.round((Number(a || 0) * 100) / Number(b || 1)) : 0; }
  function updateCards(rows) {
    const total = rows.length;
    const openRows = rows.filter(function(row){ return row.Queue === 'Open_Cases'; });
    const open = openRows.length;
    const open4Plus = openRows.filter(isOpen4Plus).length;
    const ready = rows.filter(function(row){ return row.Queue === 'Ready For Delivery Cases'; }).length;
    const samsung = rows.filter(function(row){ return clean(row.Brand).toLowerCase() === 'samsung'; }).length;
    const apple = rows.filter(function(row){ return clean(row.Brand).toLowerCase() === 'apple'; }).length;
    setText('skyTotalCases', total);
    setText('skyOpenCases', open);
    setText('skyOpenPercent', pct(open,total) + '% of Total');
    setText('skyOpen4PlusCases', open4Plus);
    setText('skyOpen4PlusPercent', pct(open4Plus, open) + '% of Open');
    setText('skyReadyCases', ready);
    setText('skyReadyPercent', pct(ready,total) + '% of Total');
    setText('skySamsungCases', samsung);
    setText('skySamsungPercent', pct(samsung,total) + '% of Total');
    setText('skyAppleCases', apple);
    setText('skyApplePercent', pct(apple,total) + '% of Total');
  }
  function countBy(rows, field) {
    const counts = new Map();
    rows.forEach(function(row){
      const name = clean(val(row, field)) || 'Blank';
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return Array.from(counts.entries()).sort(function(a,b){ return b[1] - a[1] || a[0].localeCompare(b[0]); });
  }
  function summary(id, items, total) {
    const el = byId(id);
    if (!el) return;
    el.innerHTML = items.map(function(item){ return '<span class="sky-chart-chip">' + esc(item[0]) + ': ' + item[1] + ' (' + pct(item[1], total) + '%)</span>'; }).join('');
  }
  function clearLabelPlugins() {
    if (!window.Chart || !Chart.registry || !Chart.registry.plugins) return;
    LABEL_PLUGINS.forEach(function(id){
      try {
        const plugin = Chart.registry.plugins.get(id);
        if (plugin) Chart.unregister(plugin);
      } catch(e) {}
    });
  }
  function chart(canvasId, items, label, horizontal) {
    const canvas = byId(canvasId);
    if (!canvas || !window.Chart) return;
    clearLabelPlugins();
    try {
      if (window.dashboardCharts && window.dashboardCharts[canvasId]) {
        window.dashboardCharts[canvasId].destroy();
        delete window.dashboardCharts[canvasId];
      }
    } catch(e) {}
    const fresh = canvas.cloneNode(false);
    canvas.parentNode.replaceChild(fresh, canvas);
    const total = items.reduce(function(sum,item){ return sum + item[1]; }, 0);
    const labels = items.map(function(item){ return item[0] + ' (' + pct(item[1], total) + '%)'; });
    const values = items.map(function(item){ return item[1]; });
    const max = Math.max.apply(null, values.concat([0]));
    const colors = window.COLORS || ['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#7f7f7f','#bcbd22','#17becf'];
    window.dashboardCharts = window.dashboardCharts || {};
    window.dashboardCharts[canvasId] = __safeNewChart(fresh, {
      type: 'bar',
      data: { labels: labels, datasets: [{ label: label, data: values, backgroundColor: values.map(function(_,i){ return colors[i % colors.length]; }), borderColor: values.map(function(_,i){ return colors[i % colors.length]; }), borderWidth: 1, borderRadius: horizontal ? 6 : 5, maxBarThickness: horizontal ? 24 : 52 }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        indexAxis: horizontal ? 'y' : 'x',
        layout: { padding: { top: 18, right: 24, bottom: 18, left: 8 } },
        plugins: Object.assign({ legend: { display:false }, tooltip: { callbacks: { label: function(ctx){ return label + ': ' + ctx.raw + ' (' + pct(ctx.raw, total) + '%)'; } } } }, LABEL_PLUGINS.reduce(function(acc,id){ acc[id] = false; return acc; }, {})),
        scales: {
          x: { beginAtZero:true, suggestedMax: horizontal ? max * 1.2 + 1 : undefined, ticks:{ autoSkip:false, precision:0, maxRotation: horizontal ? 0 : 25, minRotation:0, color:'#111827', font:{weight:'700'} }, grid:{color:'rgba(17,24,39,.18)'} },
          y: { beginAtZero:!horizontal, suggestedMax: horizontal ? undefined : max * 1.2 + 1, afterFit:function(scale){ if(horizontal) scale.width = Math.min(340, Math.max(160, ...labels.map(function(label){ return label.length * 6.6; }))); }, ticks:{ autoSkip:false, precision:0, color:'#111827', font:{weight:'700'}, callback:function(v){ const label = this.getLabelForValue ? this.getLabelForValue(v) : v; return horizontal && String(label).length > 50 ? String(label).slice(0,49) + '...' : label; } }, grid:{color:'rgba(17,24,39,.18)'} }
        }
      }
    });
  }
  function renderCharts(rows) {
    const grid = byId('skyChartsSection');
    if (grid) {
      grid.className = 'charts-grid sky-charts sky-requested-insights sky-codex-clean-charts';
      grid.innerHTML = '<section class="chart-card"><h2>Open Cases per Branch</h2><div class="sky-chart-summary" id="skyOpenBranchSummary"></div><div class="chart-box sky-open-branch-chart-box"><canvas id="skyOpenBranchChart"></canvas></div></section><section class="chart-card"><h2>Open_Cases Status</h2><div class="sky-chart-summary" id="skyOpenStatusSummary"></div><div class="chart-box sky-open-status-chart-box"><canvas id="skyOpenStatusChart"></canvas></div></section>';
    }
    const openRows = rows.filter(function(row){ return row.Queue === 'Open_Cases'; });
    const branch = countBy(openRows, 'Branch');
    const status = countBy(openRows, 'Status');
    summary('skyOpenBranchSummary', branch, openRows.length);
    summary('skyOpenStatusSummary', status, openRows.length);
    chart('skyOpenBranchChart', branch, 'Open_Cases', false);
    chart('skyOpenStatusChart', status, 'Open_Cases', true);
  }
  function renderSkyFinal() {
    const all = setRows(currentRowsRaw());
    refreshFilters(all);
    const rows = filteredRows(all);
    const tableRows = isOpen4PlusModeActive() ? rows.filter(isOpen4Plus) : rows;
    window.currentSkyRows = tableRows;
    renderTable(tableRows);
    // Cards must always be calculated from the currently selected normal filters.
    // The Open Cases 4+ card itself is a shortcut filter, so its count is calculated
    // before applying the shortcut-only table restriction. This prevents the card
    // from showing 0 on first load or after delayed render passes.
    updateCards(rows);
    renderCharts(rows);
    return tableRows;
  }
  window.getSkyFilteredRows = function(){ return filteredRows(setRows(currentRowsRaw())); };
  window.renderSky = function(){ return renderSkyFinal(); };
  window.setSkyOpen4PlusCases = function(){
    window.__skyOpen4PlusOnly = true;
    const queueEl = byId('skyQueueFilter');
    if (queueEl) queueEl.value = 'Open_Cases';
    const rows = renderSkyFinal();
    window.currentSkyRows = rows.filter(isOpen4Plus);
    renderTable(window.currentSkyRows);
    if (typeof scrollToElement === 'function') scrollToElement('skyCasesTable');
  };
  window.setSkyQueue = function(value){
    window.__skyOpen4PlusOnly = false;
    const queueEl = byId('skyQueueFilter');
    if (queueEl) queueEl.value = value || '';
    renderSkyFinal();
    if (typeof scrollToElement === 'function') scrollToElement('skyCasesTable');
  };
  window.setSkyBrand = function(value){
    window.__skyOpen4PlusOnly = false;
    const brandEl = byId('skyBrandFilter');
    if (brandEl) brandEl.value = value || '';
    renderSkyFinal();
    if (typeof scrollToElement === 'function') scrollToElement('skyCasesTable');
  };
  const previousSkyClearFilters = window.clearSkyFilters;
  window.clearSkyFilters = function(){
    window.__skyOpen4PlusOnly = false;
    if (typeof previousSkyClearFilters === 'function') return previousSkyClearFilters.apply(this, arguments);
    return renderSkyFinal();
  };
  window.exportSkyExcel = function(){
    let rows = Array.isArray(window.currentSkyRows) ? window.currentSkyRows.slice() : [];
    if (!rows.length) rows = isOpen4PlusModeActive() ? filteredRows(setRows(currentRowsRaw())).filter(isOpen4Plus) : filteredRows(setRows(currentRowsRaw()));
    if (isOpen4PlusModeActive()) rows = rows.filter(isOpen4Plus);
    if (!rows.length) {
      alert('No SKY rows match the current filters.');
      return;
    }
    if (!window.XLSX) {
      if (typeof exportRowsToExcel === 'function') exportRowsToExcel(rows, EXPORT_COLS, 'SKY Tracking Cases Export.xlsx', 'SKY Filtered Cases');
      return;
    }
    const output = rows.map(function(row){
      const out = {};
      EXPORT_COLS.forEach(function(col){ out[col[1]] = val(row, col[0]); });
      return out;
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(output, { header: EXPORT_COLS.map(function(col){ return col[1]; }) });
    if (ws['!ref']) {
      const dateHeaders = new Set(['Open_Date', 'Ready For Delivery Date']);
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let c = range.s.c; c <= range.e.c; c++) {
        const headerCell = ws[XLSX.utils.encode_cell({ r: 0, c: c })];
        const header = headerCell ? clean(headerCell.v) : '';
        if (!dateHeaders.has(header)) continue;
        for (let r = 1; r <= range.e.r; r++) {
          const cellRef = XLSX.utils.encode_cell({ r: r, c: c });
          const cell = ws[cellRef];
          if (!cell || cell.v === '') continue;
          const d = toDateObject(cell.v);
          if (!d) continue;
          cell.t = 'n';
          cell.v = excelSerialDate(d);
          cell.z = 'dd-mmm-yyyy';
        }
      }
    }
    XLSX.utils.book_append_sheet(wb, ws, 'SKY Filtered Cases');
    XLSX.writeFile(wb, 'SKY Tracking Cases Export.xlsx');
  };
  async function boot() {
    await refreshFromWorkbookIfAvailable();
    renderSkyFinal();
  }
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(boot, 300); });
  window.addEventListener('load', function(){ setTimeout(boot, 500); });
  requestAnimationFrame(boot);
})();


/* ===== codex-two-tabs-last-update-notice ===== */

(function(){
  'use strict';

  const TABS = {
    gspn: { pageId: 'gspnPage', storageKey: 'serviceEyeLastDataUpdate_gspn', title: 'GSPN Tracking Cases' },
    sky: { pageId: 'skyPage', storageKey: 'serviceEyeLastDataUpdate_sky', title: 'SKY Tracking Cases' }
  };

  function byId(id){ return document.getElementById(id); }
  function nowIso(){ return new Date().toISOString(); }
  function formatDateTime(value) {
    if (!value) return 'لم يتم التحديث بعد';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'لم يتم التحديث بعد';
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', '');
  }
  function getRowsCount(tab) {
    if (tab === 'sky') {
      try {
        if (Array.isArray(window.skyRows) && window.skyRows.length) return window.skyRows.length;
      } catch(e) {}
      return Number((byId('skyTotalCases') || {}).textContent || 0) || 0;
    }
    return Number((byId('totalCases') || {}).textContent || 0) || 0;
  }
  function ensureNotice(tab) {
    const config = TABS[tab];
    const page = byId(config.pageId);
    if (!page) return null;

    let notice = byId('codexLastUpdateNotice_' + tab);
    if (!notice) {
      notice = document.createElement('div');
      notice.id = 'codexLastUpdateNotice_' + tab;
      notice.className = 'codex-last-update-notice';
      notice.setAttribute('role', 'status');
      notice.setAttribute('aria-live', 'polite');
      notice.innerHTML = '<span class="codex-last-update-label">آخر تحديث للبيانات - ' + config.title + ':</span><span class="codex-last-update-value"></span>';
      const header = page.querySelector('header');
      if (header && header.parentNode) header.parentNode.insertBefore(notice, header.nextSibling);
      else page.insertBefore(notice, page.firstChild);
    }
    return notice;
  }
  function renderNotice(tab) {
    const config = TABS[tab];
    const notice = ensureNotice(tab);
    if (!notice) return;
    const stamp = localStorage.getItem(config.storageKey);
    const value = notice.querySelector('.codex-last-update-value');
    if (value) value.textContent = formatDateTime(stamp);
  }
  function markUpdated(tab, stamp) {
    if (!TABS[tab]) return;
    localStorage.setItem(TABS[tab].storageKey, stamp || nowIso());
    renderNotice(tab);
  }
  function markWhenRowsExist(tab) {
    setTimeout(function(){
      if (getRowsCount(tab) > 0) markUpdated(tab);
      else renderNotice(tab);
    }, 700);
  }
  function wrapAsyncLoader(name, tab) {
    const original = window[name];
    if (typeof original !== 'function' || original.__codexLastUpdateWrapped) return;
    window[name] = async function(){
      const result = await original.apply(this, arguments);
      if (getRowsCount(tab) > 0) markUpdated(tab);
      return result;
    };
    window[name].__codexLastUpdateWrapped = true;
  }
  function hookUploads() {
    const gspnInput = byId('fileInput');
    const skyInput = byId('skyFileInput');
    if (gspnInput && !gspnInput.dataset.codexLastUpdateHook) {
      gspnInput.dataset.codexLastUpdateHook = '1';
      gspnInput.addEventListener('change', function(){ markWhenRowsExist('gspn'); });
    }
    if (skyInput && !skyInput.dataset.codexLastUpdateHook) {
      skyInput.dataset.codexLastUpdateHook = '1';
      skyInput.addEventListener('change', function(){ markWhenRowsExist('sky'); });
    }
  }
  function observeLoadedMessages() {
    [
      ['uploadProgressText', 'gspn'],
      ['uploadProgressNote', 'gspn'],
      ['skyUploadProgressText', 'sky'],
      ['skyUploadProgressNote', 'sky']
    ].forEach(function(pair){
      const el = byId(pair[0]);
      if (!el || el.dataset.codexLastUpdateObserver) return;
      el.dataset.codexLastUpdateObserver = '1';
      const observer = new MutationObserver(function(){
        const text = String(el.textContent || '').toLowerCase();
        if (text.includes('loaded') && getRowsCount(pair[1]) > 0) markUpdated(pair[1]);
      });
      observer.observe(el, { childList:true, characterData:true, subtree:true });
    });
  }
  function boot() {
    renderNotice('gspn');
    renderNotice('sky');
    hookUploads();
    observeLoadedMessages();
    wrapAsyncLoader('autoLoadGSPNFromGitHub', 'gspn');
    wrapAsyncLoader('autoLoadSKYFromGitHub', 'sky');

    if (!localStorage.getItem(TABS.gspn.storageKey) && getRowsCount('gspn') > 0) markUpdated('gspn');
    if (!localStorage.getItem(TABS.sky.storageKey) && getRowsCount('sky') > 0) markUpdated('sky');
  }

  window.codexMarkDataUpdated = markUpdated;
  document.addEventListener('DOMContentLoaded', function(){ requestAnimationFrame(boot); });
  window.addEventListener('load', function(){ setTimeout(boot, 500); });
  requestAnimationFrame(boot);
})();


/* ===== sky-loading-export-hotfix ===== */

(function(){
  'use strict';
  const WAIT_MS = 8000;
  let skyBusyUntil = 0;
  let skyLastNotice = '';

  function now(){ return Date.now(); }
  function clean(v){ return v == null ? '' : String(v).trim(); }
  function byId(id){ return document.getElementById(id); }
  function isOpen4PlusModeActive(){
    const queue = byId('skyQueueFilter');
    const queueValue = queue ? clean(queue.value) : '';
    if (window.__skyOpen4PlusOnly && queueValue !== 'Open_Cases') {
      window.__skyOpen4PlusOnly = false;
      return false;
    }
    return window.__skyOpen4PlusOnly === true && queueValue === 'Open_Cases';
  }
  function skyExportAgingDays(row){
    const candidates = [val(row, 'Aging Days'), val(row, 'Aging_Days'), val(row, 'AgingDays'), val(row, 'Aging')];
    for (const raw of candidates) {
      const n = Number(String(raw ?? '').replace(/[^0-9.-]/g,''));
      if (Number.isFinite(n)) return n;
    }
    return null;
  }
  function isExportOpen4Plus(row){
    return clean(val(row, 'Queue')) === 'Open_Cases' && skyExportAgingDays(row) !== null && skyExportAgingDays(row) >= 4;
  }
  function getRows(){
    try {
      if (Array.isArray(window.currentSkyRows) && window.currentSkyRows.length) {
        return isOpen4PlusModeActive() ? window.currentSkyRows.filter(isExportOpen4Plus) : window.currentSkyRows;
      }
    } catch(e) {}
    try {
      if (typeof window.getSkyFilteredRows === 'function') {
        const r = window.getSkyFilteredRows();
        if (Array.isArray(r)) return isOpen4PlusModeActive() ? r.filter(isExportOpen4Plus) : r;
      }
    } catch(e) {}
    try {
      if (Array.isArray(window.skyRows) && window.skyRows.length) {
        return isOpen4PlusModeActive() ? window.skyRows.filter(isExportOpen4Plus) : window.skyRows;
      }
    } catch(e) {}
    return [];
  }
  function notify(title, note, percent){
    skyLastNotice = title + (note ? ' - ' + note : '');
    try {
      if (typeof window.setSkyUploadProgress === 'function') return window.setSkyUploadProgress(percent || 100, title, note || '', true);
      if (typeof window.setUploadProgress === 'function') return window.setUploadProgress(percent || 100, title, note || '', true);
    } catch(e) {}
    const host = byId('skyUploadProgressWrap') || byId('uploadProgressWrap');
    if (host) {
      host.style.display = 'flex';
      const text = host.querySelector('.upload-progress-text');
      const fill = host.querySelector('.upload-progress-fill');
      const small = host.querySelector('.upload-progress-note');
      if (text) text.textContent = title;
      if (small) small.textContent = note || '';
      if (fill) fill.style.width = (percent || 100) + '%';
    }
  }
  function renderNoAlert(){
    try {
      if (typeof window.renderSky === 'function') {
        const r = window.renderSky();
        if (Array.isArray(r)) return r;
      }
    } catch(e) { }
    return getRows();
  }
  function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }
  async function waitForSkyRows(){
    let rows = getRows();
    if (rows.length) return rows;
    const started = now();
    notify('Preparing SKY data...', 'Please wait while the uploaded SKY file is being normalized and filters are refreshed.', 85);
    while (now() - started < WAIT_MS) {
      rows = renderNoAlert();
      if (rows.length) return rows;
      await sleep(250);
    }
    return getRows();
  }
  function val(row, key){
    if (!row) return '';
    if (row[key] != null) return row[key];
    const wanted = clean(key).toLowerCase().replace(/[^a-z0-9]/g,'');
    const found = Object.keys(row).find(k => clean(k).toLowerCase().replace(/[^a-z0-9]/g,'') === wanted);
    return found ? row[found] : '';
  }
  const cols = [
    ['Queue','Queue'],['Brand','Brand'],['Branch','Branch'],['Open_Date_Display','Open Date'],['Aging_Days','Aging Days'],['Aging Days Group','Aging Days Group'],
    ['Job_Number','Job Number'],['Status','Status'],['Stage','Stage'],['Item English Name','Item English Name'],['Price','Price'],['IMEI','IMEI'],['SerialNumber','Serial Number'],
    ['JobType','Job Type'],['Warranty','Warranty'],['Customer_Name','Customer Name'],['Customer_Mobile','Customer Mobile'],['Customer_Phone','Customer Phone']
  ];
  async function exportRows(rows){
    if (!rows.length) {
      notify('No SKY rows are ready yet', 'Upload/refresh is still not complete or the current filters return no rows. Clear filters or wait a few seconds and try again.', 100);
      const table = byId('skyCasesTable');
      if (table && !table.dataset.skyNoAlertWritten) {
        table.dataset.skyNoAlertWritten = '1';
        table.innerHTML = '<tr><td style="padding:14px;font-weight:700;color:#92400e">No SKY rows are ready yet. Please wait until loading finishes, or clear the current filters.</td></tr>';
      }
      return;
    }
    if (!window.XLSX) {
      notify('Export failed', 'XLSX library is not loaded yet. Please refresh the page and try again.', 100);
      return;
    }
    function toDateObjectForSkyExport(value){
      if (!value) return null;
      if (value instanceof Date && !Number.isNaN(value.getTime())) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
      if (typeof value === 'number' && window.XLSX && XLSX.SSF) {
        try { const d = XLSX.SSF.parse_date_code(value); if (d) return new Date(d.y, d.m - 1, d.d); } catch(e) {}
      }
      const raw = clean(value);
      let m = raw.match(/^(\d{1,2})[-\/\s]([A-Za-z]{3,9})[-\/\s](\d{2,4})$/);
      if (m) {
        const months={jan:0,january:0,feb:1,february:1,mar:2,march:2,apr:3,april:3,may:4,jun:5,june:5,jul:6,july:6,aug:7,august:7,sep:8,sept:8,september:8,oct:9,october:9,nov:10,november:10,dec:11,december:11};
        const mon=months[m[2].toLowerCase()]; let y=Number(m[3]); if(y<100)y+=2000; if(mon!==undefined) return new Date(y,mon,Number(m[1]));
      }
      m = raw.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
      if (m) return new Date(Number(m[1]), Number(m[2])-1, Number(m[3]));
      m = raw.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/);
      if (m) { let y=Number(m[3]); if(y<100)y+=2000; return new Date(y,Number(m[2])-1,Number(m[1])); }
      const d = new Date(raw);
      return Number.isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    function excelSerialForSkyExport(date){ return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(1899, 11, 30)) / 86400000; }
    const output = rows.map(row => {
      const out = {};
      cols.forEach(c => {
        if (c[1] === 'Open Date') out[c[1]] = val(row, 'Open_Date') || val(row, 'Open Date') || val(row, 'Open_Date_Display');
        else out[c[1]] = val(row, c[0]);
      });
      return out;
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(output, { header: cols.map(c => c[1]) });
    if (ws['!ref']) {
      const dateHeaders = new Set(['Open Date','Open_Date','Ready For Delivery Date']);
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let c = range.s.c; c <= range.e.c; c++) {
        const headerCell = ws[XLSX.utils.encode_cell({r:0,c})];
        const header = headerCell ? clean(headerCell.v) : '';
        if (!dateHeaders.has(header)) continue;
        for (let r = 1; r <= range.e.r; r++) {
          const ref = XLSX.utils.encode_cell({r,c});
          const cell = ws[ref];
          if (!cell || cell.v === '') continue;
          const d = toDateObjectForSkyExport(cell.v);
          if (!d) continue;
          cell.t = 'n';
          cell.v = excelSerialForSkyExport(d);
          cell.z = 'dd-mmm-yyyy';
        }
      }
    }
    XLSX.utils.book_append_sheet(wb, ws, 'SKY Filtered Cases');
    XLSX.writeFile(wb, 'SKY Tracking Cases Export.xlsx');
    notify('SKY export completed', rows.length + ' rows exported from the current filtered view.', 100);
  }

  const oldHandle = window.handleSkyFile;
  if (typeof oldHandle === 'function') {
    window.handleSkyFile = function(e){
      skyBusyUntil = now() + WAIT_MS;
      notify('Reading SKY file...', 'The export button will wait automatically until the new data is ready.', 5);
      const result = oldHandle.apply(this, arguments);
      setTimeout(function(){ skyBusyUntil = Math.max(skyBusyUntil, now() + 2500); renderNoAlert(); }, 100);
      setTimeout(function(){ renderNoAlert(); }, 1500);
      return result;
    };
  }

  const oldExport = window.exportSkyExcel;
  window.exportSkyExcel = async function(){
    let rows = getRows();
    if (!rows.length || skyBusyUntil > now()) rows = await waitForSkyRows();
    if (!rows.length && typeof oldExport === 'function') {
      // Keep old exporter unavailable for zero rows to avoid the blocking browser alert.
      return exportRows(rows);
    }
    return exportRows(rows);
  };
})();


/* ===== inline-script-61 ===== */

(function(){
  function safeRenderSky(){
    try{
      if(typeof window.renderSky==='function') window.renderSky();
    }catch(e){

    }
  }

  window.clearSkyChartFilter = function(id){
    try{
      if(id){
        const el=document.getElementById(id);
        if(el){
          if(el.multiple){
            [...el.options].forEach(o=>o.selected = (o.value==='' || o.value==='ALL'));
          }else{
            el.value='';
          }
          el.dispatchEvent(new Event('change',{bubbles:true}));
          el.dispatchEvent(new Event('input',{bubbles:true}));
        }
      }

      const search=document.getElementById('skySearchBox');
      if(search && !id){
        search.value='';
      }

      safeRenderSky();
      return false;
    }catch(err){

      safeRenderSky();
      return false;
    }
  };

  document.addEventListener('click', function(e){
    const btn=e.target.closest('.sky-v36-chart-clear,.v24-sky-clear,.chart-clear-btn');
    if(!btn) return;

    e.preventDefault();
    e.stopPropagation();

    let id=null;
    const onclickAttr=btn.getAttribute('onclick') || '';
    const match=onclickAttr.match(/clearSkyChartFilter\(['"]([^'"]+)['"]\)/);
    if(match) id=match[1];

    window.clearSkyChartFilter(id);
  }, true);
})();


/* ===== profitability-three-tab-final-hotfix ===== */

(function(){
  'use strict';
  function byId(id){ return document.getElementById(id); }
  function norm(tab){ tab=String(tab||'').toLowerCase(); return tab==='profit'||tab==='profitability'||tab==='commission' ? 'profit' : (tab==='sky' ? 'sky' : 'gspn'); }
  function applyActive(tab){
    document.querySelectorAll('.side-tab').forEach(function(el){
      var oc=(el.getAttribute('onclick')||'').toLowerCase();
      var text=(el.textContent||'').toLowerCase();
      el.classList.toggle('active',
        (tab==='gspn' && (oc.indexOf('gspn')>-1 || text.indexOf('gspn')>-1)) ||
        (tab==='sky' && (oc.indexOf('sky')>-1 || text.indexOf('sky')>-1)) ||
        (tab==='profit' && (oc.indexOf('profit')>-1 || text.indexOf('profitability')>-1 || text.indexOf('commission')>-1))
      );
    });
  }
  function showTab(tab){
    tab=norm(tab);
    try{ localStorage.setItem('serviceEyeActiveTab', tab); }catch(e){}
    var g=byId('gspnPage'), s=byId('skyPage'), pr=byId('profitPage');
    if(g) g.style.display = tab==='gspn' ? 'block' : 'none';
    if(s) s.style.display = tab==='sky' ? 'block' : 'none';
    if(pr) pr.style.display = tab==='profit' ? 'block' : 'none';
    applyActive(tab);
    try{ if(typeof window.applyTabDesign==='function') window.applyTabDesign(tab,false); }catch(e){}
    setTimeout(function(){
      try{
        if(tab==='sky' && typeof window.renderSky==='function') window.renderSky();
        if(tab==='gspn' && typeof window.render==='function') window.render();
        if(tab==='profit' && typeof window.renderProfit==='function') window.renderProfit();
      }catch(e){ }
    },80);
    return true;
  }
  function install(){
    window.switchTab.__profitabilityThreeTabs = true;
    var ptab=[].slice.call(document.querySelectorAll('.side-tab')).find(function(el){ return /profitability|commission/i.test(el.textContent||''); });
    if(ptab){
      ptab.style.display='flex';
      ptab.onclick=function(ev){ if(ev) ev.preventDefault(); return showTab('profit'); };
    }
    var gtab=[].slice.call(document.querySelectorAll('.side-tab')).find(function(el){ return /gspn/i.test(el.textContent||''); });
    if(gtab) gtab.onclick=function(ev){ if(ev) ev.preventDefault(); return showTab('gspn'); };
    var stab=[].slice.call(document.querySelectorAll('.side-tab')).find(function(el){ return /sky/i.test(el.textContent||''); });
    if(stab) stab.onclick=function(ev){ if(ev) ev.preventDefault(); return showTab('sky'); };
  }
  function boot(){
    install();
    var saved='gspn';
    try{ saved=localStorage.getItem('serviceEyeActiveTab')||'gspn'; }catch(e){}
    showTab(norm(saved));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', function(){ install(); });
  [200,900,2300,4200,6500].forEach(function(ms){ setTimeout(function(){ install(); if(norm(localStorage.getItem('serviceEyeActiveTab'))==='profit') showTab('profit'); }, ms); });
})();


/* ===== profitability-dropdown-visitors-lastupdate-fix ===== */

(function(){
  'use strict';
  const PROFIT_FILTERS = [
    'profitBrandFilter','profitBranchFilter','profitWarrantyFilter','profitStatusFilter','profitGroupFilter'
  ];
  function byId(id){ return document.getElementById(id); }
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function selectedValues(select){ return Array.from(select && select.selectedOptions || []).map(o => String(o.value || o.textContent || '').trim()).filter(Boolean); }

  function ensureProfitDropdownStyle(){
    if (byId('profitDropdownStyle')) return;
    const st = document.createElement('style');
    st.id = 'profitDropdownStyle';
    st.textContent = `
      #profitPage select.profit-native-hidden{display:none!important;}
      #profitPage .profit-filter-dd{position:relative;width:100%;}
      #profitPage .profit-filter-btn{width:100%;min-height:38px;text-align:left;padding:9px 36px 9px 10px;border:1px solid var(--border);border-radius:8px;background:#fff;color:var(--text);font-family:inherit;font-weight:700;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
      #profitPage .profit-filter-btn:after{content:'▾';position:absolute;right:12px;top:9px;color:var(--muted);}
      #profitPage .profit-filter-dd.open .profit-filter-btn{outline:2px solid rgba(15,76,129,.18);}
      #profitPage .profit-filter-panel{display:none;position:fixed;z-index:99999;background:#fff;border:1px solid var(--border);border-radius:12px;box-shadow:0 18px 40px rgba(15,23,42,.22);padding:10px;}
      #profitPage .profit-filter-dd.open .profit-filter-panel{display:block;}
      #profitPage .profit-filter-search{width:100%;margin-bottom:8px;}
      #profitPage .profit-filter-list{overflow:auto;max-height:210px;border:1px solid #edf1f5;border-radius:8px;background:#fff;}
      #profitPage .profit-filter-option{display:flex;align-items:center;gap:8px;padding:7px 8px;cursor:pointer;font-size:13px;}
      #profitPage .profit-filter-option:hover{background:#f8fafc;}
      #profitPage .profit-filter-option input{width:auto!important;}
      #profitPage .profit-filter-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:9px;}
      #profitPage .profit-filter-actions button{border:1px solid var(--border);border-radius:8px;padding:7px 10px;font-weight:800;cursor:pointer;background:#eef5fb;color:#0f4c81;}
      #profitPage .profit-filter-actions .ok{background:var(--primary,#0f4c81);color:#fff;}
      body.theme-volta #profitPage .profit-filter-btn, body.theme-volta #profitPage .profit-filter-panel, body.theme-volta #profitPage .profit-filter-list{background:#f4f0e8!important;color:#0a0a0a!important;border-color:rgba(10,10,10,.14)!important;border-radius:6px!important;}
      body.theme-volta #profitPage .profit-filter-actions button{border-radius:999px!important;text-transform:uppercase;letter-spacing:.06em;}
    `;
    document.head.appendChild(st);
  }

  function positionPanel(wrap){
    const btn = wrap.querySelector('.profit-filter-btn');
    const panel = wrap.querySelector('.profit-filter-panel');
    const list = wrap.querySelector('.profit-filter-list');
    if(!btn || !panel) return;
    const rect = btn.getBoundingClientRect();
    const width = Math.min(330, window.innerWidth - 24);
    let left = Math.min(Math.max(12, rect.left), window.innerWidth - width - 12);
    let top = rect.bottom + 6;
    const height = Math.min(360, window.innerHeight - 30);
    if(top + height > window.innerHeight) top = Math.max(12, rect.top - height - 6);
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
    panel.style.width = width + 'px';
    panel.style.maxHeight = height + 'px';
    if(list) list.style.maxHeight = Math.max(110, height - 130) + 'px';
  }

  function createOrUpdateProfitFilter(id){
    const select = byId(id); if(!select) return;
    ensureProfitDropdownStyle();
    select.multiple = true;
    select.classList.add('profit-native-hidden');
    let wrap = byId(id + '_profitdd');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.className = 'profit-filter-dd';
      wrap.id = id + '_profitdd';
      select.insertAdjacentElement('afterend', wrap);
    }
    const options = Array.from(select.options).map(o => ({value:String(o.value), text:String(o.textContent || o.value), selected:o.selected}));
    const chosen = options.filter(o => o.selected).map(o => o.text);
    const summary = chosen.length ? (chosen.length > 2 ? chosen.length + ' selected' : chosen.join(', ')) : '(Select All)';
    wrap.innerHTML = `<button type="button" class="profit-filter-btn" title="${esc(summary)}">${esc(summary)}</button><div class="profit-filter-panel"><input class="profit-filter-search" placeholder="Search" /><div class="profit-filter-list"></div><div class="profit-filter-actions"><button type="button" class="clear">Clear</button><button type="button" class="ok">OK</button><button type="button" class="cancel">Cancel</button></div></div>`;
    const btn = wrap.querySelector('.profit-filter-btn');
    const panel = wrap.querySelector('.profit-filter-panel');
    const search = wrap.querySelector('.profit-filter-search');
    const list = wrap.querySelector('.profit-filter-list');
    let temp = new Set(selectedValues(select));
    function draw(filter){
      const term = String(filter || '').toLowerCase();
      const visible = options.filter(o => !term || o.text.toLowerCase().includes(term));
      list.innerHTML = visible.map(o => `<label class="profit-filter-option"><input type="checkbox" data-value="${esc(o.value)}" ${temp.has(o.value) ? 'checked' : ''}> <span>${esc(o.text)}</span></label>`).join('') || '<div class="profit-filter-option">No values</div>';
      list.querySelectorAll('input[type=checkbox]').forEach(cb => cb.onchange = function(){
        const val = cb.getAttribute('data-value');
        if(cb.checked) temp.add(val); else temp.delete(val);
      });
    }
    btn.onclick = function(ev){
      ev.stopPropagation();
      document.querySelectorAll('#profitPage .profit-filter-dd.open').forEach(x => { if(x !== wrap) x.classList.remove('open'); });
      wrap.classList.toggle('open');
      if(wrap.classList.contains('open')){ temp = new Set(selectedValues(select)); draw(''); setTimeout(function(){ positionPanel(wrap); search.focus(); },0); }
    };
    panel.onclick = ev => ev.stopPropagation();
    search.oninput = () => draw(search.value);
    wrap.querySelector('.cancel').onclick = () => wrap.classList.remove('open');
    wrap.querySelector('.clear').onclick = () => { temp.clear(); draw(search.value); };
    wrap.querySelector('.ok').onclick = function(){
      Array.from(select.options).forEach(o => o.selected = temp.has(String(o.value)));
      wrap.classList.remove('open');
      if(typeof window.renderProfit === 'function') window.renderProfit();
    };
    draw('');
  }

  function refreshProfitDropdowns(){ PROFIT_FILTERS.forEach(createOrUpdateProfitFilter); }
  document.addEventListener('click', function(){ document.querySelectorAll('#profitPage .profit-filter-dd.open').forEach(x => x.classList.remove('open')); });
  window.addEventListener('resize', function(){ document.querySelectorAll('#profitPage .profit-filter-dd.open').forEach(positionPanel); }, {passive:true});
  window.addEventListener('scroll', function(){ document.querySelectorAll('#profitPage .profit-filter-dd.open').forEach(positionPanel); }, {passive:true});

  function installRenderHook(){
    if(typeof window.renderProfit !== 'function' || window.renderProfit.__profitDropdownHooked) return;
    const original = window.renderProfit;
    window.renderProfit = function(){
      const result = original.apply(this, arguments);
      requestAnimationFrame(refreshProfitDropdowns);
      updateProfitLastNotice(false);
      return result;
    };
    window.renderProfit.__profitDropdownHooked = true;
  }

  function formatDateTime(value){
    if(!value) return 'لم يتم التحديث بعد';
    const d = new Date(value);
    if(Number.isNaN(d.getTime())) return 'لم يتم التحديث بعد';
    return d.toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).replace(',', '');
  }
  function profitRowsCount(){
    try{ if(Array.isArray(window.profitRows)) return window.profitRows.length; }catch(e){}
    return Number((byId('profitTotalCases') || {}).textContent || 0) || 0;
  }
  function ensureProfitLastNotice(){
    const page = byId('profitPage'); if(!page) return null;
    let notice = byId('codexLastUpdateNotice_profit');
    if(!notice){
      notice = document.createElement('div');
      notice.id = 'codexLastUpdateNotice_profit';
      notice.className = 'codex-last-update-notice';
      notice.setAttribute('role','status');
      notice.setAttribute('aria-live','polite');
      notice.innerHTML = '<span class="codex-last-update-label">آخر تحديث للبيانات - Profitability & commission:</span><span class="codex-last-update-value"></span>';
      const header = page.querySelector('header');
      if(header && header.parentNode) header.parentNode.insertBefore(notice, header.nextSibling);
      else page.insertBefore(notice, page.firstChild);
    }
    return notice;
  }
  function updateProfitLastNotice(mark){
    const key = 'serviceEyeLastDataUpdate_profit';
    if(mark && profitRowsCount() > 0) localStorage.setItem(key, new Date().toISOString());
    const notice = ensureProfitLastNotice(); if(!notice) return;
    const value = notice.querySelector('.codex-last-update-value');
    if(value) value.textContent = formatDateTime(localStorage.getItem(key));
  }
  window.codexMarkProfitDataUpdated = function(){ updateProfitLastNotice(true); };

  function hookProfitLoaders(){
    if(typeof window.setProfitRows === 'function' && !window.setProfitRows.__profitLastUpdateHooked){
      const originalSet = window.setProfitRows;
      window.setProfitRows = function(){
        const result = originalSet.apply(this, arguments);
        setTimeout(function(){ refreshProfitDropdowns(); updateProfitLastNotice(true); }, 0);
        return result;
      };
      window.setProfitRows.__profitLastUpdateHooked = true;
    }
    if(typeof window.autoLoadProfitFromGitHub === 'function' && !window.autoLoadProfitFromGitHub.__profitLastUpdateHooked){
      const originalAuto = window.autoLoadProfitFromGitHub;
      window.autoLoadProfitFromGitHub = async function(){
        const result = await originalAuto.apply(this, arguments);
        updateProfitLastNotice(profitRowsCount() > 0);
        return result;
      };
      window.autoLoadProfitFromGitHub.__profitLastUpdateHooked = true;
    }
    const input = byId('profitFileInput');
    if(input && !input.dataset.profitLastUpdateHooked){
      input.dataset.profitLastUpdateHooked = '1';
      input.addEventListener('change', function(){ setTimeout(function(){ updateProfitLastNotice(profitRowsCount() > 0); refreshProfitDropdowns(); }, 900); });
    }
  }

  function boot(){ installRenderHook(); hookProfitLoaders(); ensureProfitLastNotice(); refreshProfitDropdowns(); updateProfitLastNotice(false); }
  document.addEventListener('DOMContentLoaded', function(){ requestAnimationFrame(boot); });
  window.addEventListener('load', function(){ setTimeout(boot,500); });
  requestAnimationFrame(boot);
})();


/* ===== profitability-final-v5-stability-fix ===== */

(function(){
  'use strict';
  const FILTER_IDS = ['profitBrandFilter','profitBranchFilter','profitWarrantyFilter','profitStatusFilter','profitGroupFilter'];
  const CACHE_KEY = 'serviceEyeProfitRowsCache_v5';
  const LAST_KEY = 'serviceEyeLastDataUpdate_profit';
  const IDB_NAME = 'ServiceEyeProfitabilityCache';
  const IDB_STORE = 'profitRows';

  function byId(id){ return document.getElementById(id); }
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function fmtDate(stamp){
    if(!stamp) return 'Not loaded yet';
    const d = new Date(stamp); if(isNaN(d)) return 'Not loaded yet';
    return d.toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).replace(',', '');
  }
  function profitRowsCount(){
    try{ return Array.isArray(window.profitRows) ? window.profitRows.length : 0; }catch(e){ return 0; }
  }

  function ensureStyles(){
    if(byId('profitabilityFinalV5Styles')) return;
    const st = document.createElement('style');
    st.id = 'profitabilityFinalV5Styles';
    st.textContent = `
      #profitPage select.profit-v5-hidden{display:none!important;}
      #profitPage .profit-v5-dd{position:relative;width:100%;z-index:20;}
      #profitPage .profit-v5-btn{width:100%;min-height:40px;text-align:left;padding:9px 36px 9px 10px;border:1px solid var(--border);border-radius:8px;background:#fff;color:var(--text);font-family:inherit;font-weight:800;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;position:relative;}
      #profitPage .profit-v5-btn:after{content:'▾';position:absolute;right:12px;top:9px;color:var(--muted);}
      .profit-v5-panel{display:none;position:fixed!important;z-index:2147483647!important;background:#fff!important;color:#111827!important;border:1px solid #94a3b8!important;border-radius:12px!important;box-shadow:0 24px 60px rgba(0,0,0,.34)!important;padding:10px!important;overflow:hidden!important;backdrop-filter:none!important;}
      .profit-v5-panel.open{display:block!important;}
      .profit-v5-panel input.profit-v5-search{width:100%;height:38px;margin-bottom:8px;background:#fff!important;color:#111827!important;border:1px solid #334155!important;border-radius:8px!important;padding:8px!important;}
      .profit-v5-list{max-height:230px;overflow:auto;background:#fff!important;border:1px solid #e5e7eb;border-radius:8px;padding:2px 0;}
      .profit-v5-option{display:flex;align-items:center;gap:8px;padding:6px 8px;color:#111827!important;white-space:nowrap;cursor:pointer;font-size:13px;}
      .profit-v5-option:hover{background:#eef2ff!important;}
      .profit-v5-option input{width:14px!important;height:14px!important;flex:0 0 auto!important;padding:0!important;}
      .profit-v5-actions{display:flex;justify-content:flex-end;gap:8px;border-top:1px solid #e5e7eb;margin-top:8px;padding-top:8px;}
      .profit-v5-actions button{padding:7px 13px;border-radius:8px;border:1px solid #cbd5e1;background:#fff;color:#111827;font-weight:800;cursor:pointer;}
      .profit-v5-actions .ok{background:#0f4c81!important;color:#fff!important;border-color:#0f4c81!important;}
      body.theme-volta #profitPage .profit-v5-btn{background:#f4f0e8!important;color:#0a0a0a!important;border-color:rgba(10,10,10,.14)!important;border-radius:6px!important;}
      body.theme-volta .profit-v5-panel, body.theme-volta .profit-v5-list, body.theme-volta .profit-v5-search{background:#fffaf0!important;color:#0a0a0a!important;}
      body.theme-volta .profit-v5-actions .ok{background:#ff4d2e!important;border-color:#d63d22!important;}
      #profitPage .profit-v5-status-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:10px 28px 0;}
      #profitPage .profit-v5-pill{display:inline-flex;align-items:center;gap:8px;padding:9px 12px;border-radius:999px;background:#fffaf0;border:1px solid var(--border);font-weight:900;color:var(--text);box-shadow:0 8px 20px rgba(15,23,42,.08);}
      #profitPage .profit-v5-pill b{color:var(--coral,#0f4c81);}
      #profitPage .codex-last-update-notice{display:block!important;}
    `;
    document.head.appendChild(st);
  }

  function closePanels(except){
    document.querySelectorAll('.profit-v5-panel.open').forEach(p => { if(p !== except) p.classList.remove('open'); });
    document.querySelectorAll('.profit-v5-dd.open').forEach(w => { if(!except || w.dataset.panelId !== except.id) w.classList.remove('open'); });
  }

  function positionPanel(btn, panel){
    const rect = btn.getBoundingClientRect();
    const width = Math.min(340, window.innerWidth - 24);
    let left = Math.min(Math.max(12, rect.left), window.innerWidth - width - 12);
    let top = rect.bottom + 6;
    const height = Math.min(390, window.innerHeight - 24);
    if(top + height > window.innerHeight) top = Math.max(12, rect.top - height - 6);
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
    panel.style.width = width + 'px';
    panel.style.maxHeight = height + 'px';
    const list = panel.querySelector('.profit-v5-list');
    if(list) list.style.maxHeight = Math.max(120, height - 132) + 'px';
  }

  function buildDropdown(id){
    const select = byId(id); if(!select) return;
    ensureStyles();
    select.multiple = true;
    select.classList.add('profit-v5-hidden');
    // Remove older dropdown implementations so only one clean menu is visible.
    const old1 = byId(id + '_profitdd'); if(old1) old1.remove();
    const old2 = byId(id + '_excel'); if(old2) old2.remove();

    let wrap = byId(id + '_v5dd');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.className = 'profit-v5-dd';
      wrap.id = id + '_v5dd';
      select.insertAdjacentElement('afterend', wrap);
    }
    let panel = byId(id + '_v5panel');
    if(!panel){
      panel = document.createElement('div');
      panel.className = 'profit-v5-panel';
      panel.id = id + '_v5panel';
      document.body.appendChild(panel);
    }
    wrap.dataset.panelId = panel.id;

    const options = Array.from(select.options).map(o => ({ value:String(o.value), text:String(o.textContent || o.value), selected:o.selected }));
    const chosen = options.filter(o => o.selected).map(o => o.text);
    const summary = chosen.length ? (chosen.length > 2 ? chosen.length + ' selected' : chosen.join(', ')) : '(Select All)';
    wrap.innerHTML = `<button type="button" class="profit-v5-btn" title="${esc(summary)}">${esc(summary)}</button>`;
    const btn = wrap.querySelector('.profit-v5-btn');

    function draw(term){
      const q = String(term || '').toLowerCase();
      const visible = options.filter(o => !q || o.text.toLowerCase().includes(q));
      panel.innerHTML = `<input class="profit-v5-search" placeholder="Search" />`+
        `<div class="profit-v5-list">`+
        visible.map(o => `<label class="profit-v5-option"><input type="checkbox" data-value="${esc(o.value)}" ${o.selected?'checked':''}> <span>${esc(o.text)}</span></label>`).join('')+
        `</div><div class="profit-v5-actions"><button type="button" class="clear">Clear</button><button type="button" class="ok">OK</button></div>`;
      const search = panel.querySelector('.profit-v5-search');
      search.value = term || '';
      search.oninput = () => draw(search.value);
      panel.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.onchange = () => {
          const opt = options.find(o => o.value === cb.getAttribute('data-value'));
          if(opt) opt.selected = cb.checked;
        };
      });
      panel.querySelector('.clear').onclick = () => { options.forEach(o => o.selected = false); apply(); };
      panel.querySelector('.ok').onclick = apply;
      positionPanel(btn, panel);
      setTimeout(()=>search.focus(), 0);
    }
    function apply(){
      const selected = new Set(options.filter(o => o.selected).map(o => o.value));
      Array.from(select.options).forEach(o => { o.selected = selected.has(String(o.value)); });
      closePanels();
      select.dispatchEvent(new Event('change', { bubbles:true }));
      if(typeof window.renderProfit === 'function') window.renderProfit();
    }
    btn.onclick = (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      const opening = !panel.classList.contains('open');
      closePanels(panel);
      if(opening){ wrap.classList.add('open'); panel.classList.add('open'); draw(''); positionPanel(btn, panel); }
    };
  }

  function refreshDropdowns(){ FILTER_IDS.forEach(buildDropdown); }

  function openDb(){
    return new Promise((resolve, reject) => {
      if(!('indexedDB' in window)) return reject(new Error('IndexedDB not available'));
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('IndexedDB open failed'));
    });
  }
  async function idbSet(rows){
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put({ rows, savedAt:new Date().toISOString() }, 'latest');
      tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
    });
    db.close();
  }
  async function idbGet(){
    const db = await openDb();
    const val = await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get('latest');
      req.onsuccess = () => resolve(req.result || null); req.onerror = () => reject(req.error);
    });
    db.close(); return val;
  }
  function saveCache(rows){
    if(!Array.isArray(rows) || !rows.length) return;
    idbSet(rows).catch(()=>{});
    try{ localStorage.setItem(CACHE_KEY, JSON.stringify({ rows: rows.slice(0, 5000), savedAt:new Date().toISOString() })); }catch(e){}
    localStorage.setItem(LAST_KEY, new Date().toISOString());
    updateStatusRow();
  }
  async function loadCache(){
    let cached = null;
    try{ cached = await idbGet(); }catch(e){}
    if(!cached){ try{ cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); }catch(e){} }
    if(cached && Array.isArray(cached.rows) && cached.rows.length && typeof window.setProfitRows === 'function' && !profitRowsCount()){
      window.setProfitRows(cached.rows);
      if(cached.savedAt && !localStorage.getItem(LAST_KEY)) localStorage.setItem(LAST_KEY, cached.savedAt);
      updateStatusRow();
      return true;
    }
    updateStatusRow();
    return false;
  }

  function ensureStatusRow(){
    const page = byId('profitPage'); if(!page) return null;
    let row = byId('profitV5StatusRow');
    if(!row){
      row = document.createElement('div');
      row.id = 'profitV5StatusRow';
      row.className = 'profit-v5-status-row';
      row.innerHTML = '<div class="profit-v5-pill">Last updated: <b id="profitV5LastUpdated">Not loaded yet</b></div>';
      const header = page.querySelector('header');
      if(header && header.parentNode) header.parentNode.insertBefore(row, header.nextSibling);
      else page.insertBefore(row, page.firstChild);
    }
    return row;
  }
  function updateStatusRow(){
    ensureStatusRow();
    const last = byId('profitV5LastUpdated'); if(last) last.textContent = fmtDate(localStorage.getItem(LAST_KEY));
    const top = byId('topOnlineUsersCount');
    const v = byId('profitV5Visitors'); if(v) v.textContent = top && top.textContent ? top.textContent : '1';
    const notice = byId('codexLastUpdateNotice_profit');
    if(notice){
      const val = notice.querySelector('.codex-last-update-value');
      if(val) val.textContent = fmtDate(localStorage.getItem(LAST_KEY));
    }
  }

  function hookCore(){
    if(typeof window.setProfitRows === 'function' && !window.setProfitRows.__v5CacheHooked){
      const original = window.setProfitRows;
      window.setProfitRows = function(raw){
        const result = original.apply(this, arguments);
        try{ if(Array.isArray(window.profitRows) && window.profitRows.length) saveCache(window.profitRows); }catch(e){}
        setTimeout(function(){ refreshDropdowns(); updateStatusRow(); }, 0);
        return result;
      };
      window.setProfitRows.__v5CacheHooked = true;
    }
    if(typeof window.renderProfit === 'function' && !window.renderProfit.__v5DropdownHooked){
      const originalRender = window.renderProfit;
      window.renderProfit = function(){
        const res = originalRender.apply(this, arguments);
        setTimeout(function(){ refreshDropdowns(); updateStatusRow(); }, 0);
        return res;
      };
      window.renderProfit.__v5DropdownHooked = true;
    }
    if(typeof window.autoLoadProfitFromGitHub === 'function' && !window.autoLoadProfitFromGitHub.__v5GithubSafeHooked){
      const originalAuto = window.autoLoadProfitFromGitHub;
      window.autoLoadProfitFromGitHub = async function(){
        await loadCache();
        const before = profitRowsCount();
        try{
          const res = await originalAuto.apply(this, arguments);
          if(profitRowsCount() > 0) saveCache(window.profitRows);
          updateStatusRow();
          return res;
        }catch(e){
          if(!before) await loadCache();
          updateStatusRow();
        }
      };
      window.autoLoadProfitFromGitHub.__v5GithubSafeHooked = true;
    }
  }

  function boot(){
    ensureStyles(); ensureStatusRow(); hookCore(); refreshDropdowns(); updateStatusRow();
    loadCache();
  }
  document.addEventListener('click', function(ev){
    if(!ev.target.closest('.profit-v5-panel') && !ev.target.closest('.profit-v5-dd')) closePanels();
  });
  window.addEventListener('resize', () => closePanels(), {passive:true});
  window.addEventListener('scroll', () => closePanels(), {passive:true});
  const observer = new MutationObserver(updateStatusRow);
  document.addEventListener('DOMContentLoaded', function(){
    const top = byId('topOnlineUsersCount'); if(top) observer.observe(top, { childList:true, characterData:true, subtree:true });
    requestAnimationFrame(boot); setTimeout(boot,4200);
  });
  window.addEventListener('load', function(){ setTimeout(boot,500); });
  requestAnimationFrame(boot); (window._ivals=window._ivals||[]).push(setInterval(function(){ hookCore(); updateStatusRow(); }, 15000));
})();


/* ===== cashTargetScriptFinal ===== */

(function(){
  const byId=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const fmt=n=>Number(n||0).toLocaleString(undefined,{maximumFractionDigits:0});
  const money=n=>fmt(n);
  const monthOrder=['January','February','March','April','May','June','July','August','September','October','November','December'];
  let cashRows=[], targetRows=[], currentSummary=[];
  function syncCashGlobals(){ window.cashTargetRows=cashRows; window.cashDailyRows=cashRows; window.cashTargetTargetRows=targetRows; }
  function num(v){ if(v==null||v==='') return 0; if(typeof v==='number') return v; return Number(String(v).replace(/,/g,'').trim())||0; }
  function parseDate(v){ if(v==null||v==='') return null; if(v instanceof Date) return v; if(typeof v==='number'){ const d=new Date(Date.UTC(1899,11,30)); d.setUTCDate(d.getUTCDate()+Math.floor(v)); return d; } const s=String(v).trim(); if(/^\d+(\.\d+)?$/.test(s)){ const n=Number(s); if(n>30000&&n<60000){ const d=new Date(Date.UTC(1899,11,30)); d.setUTCDate(d.getUTCDate()+Math.floor(n)); return d; } } const d=new Date(s); return isNaN(d)?null:d; }
  function dateKey(v){ const d=parseDate(v); if(!d) return ''; const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}`; }
  function displayDate(v){ const d=parseDate(v); if(!d) return esc(v||''); return `${String(d.getDate()).padStart(2,'0')}-${d.toLocaleString('en-US',{month:'short'})}-${d.getFullYear()}`; }
  function monthName(v){ const d=parseDate(v); return d?monthOrder[d.getMonth()]:(String(v||'').trim()); }
  function normalizeCashRow(r){ const maintenance=num(r.Maintenance||r['Maintenance Revenue']||r['Maint.']); const vip=num(r.VIP||r['VIP Revenue']); const total=num(r.TotalRevenue||r['Total Revenue']||r.JobAmount||r.Revenue||(maintenance+vip)); const branch=String(r.Branch||r.branch||'').trim(); const m=String(r.Month||r.month||monthName(r.Date)).trim(); return {Date:dateKey(r.Date),JobAmount:total,TotalRevenue:total,Maintenance:maintenance,VIP:vip,Month:m,Branch:branch}; }
  function normalizeTargetRows(arr){ const out=[]; (arr||[]).forEach(r=>{ if(r.Month&&r.Target!==undefined){ out.push({Branch:String(r.Branch||'').trim(),Month:String(r.Month||'').trim(),Target:num(r.Target)}); } else { monthOrder.forEach(m=>{ if(r.Branch&&r[m]!==''&&r[m]!=null) out.push({Branch:String(r.Branch).trim(),Month:m,Target:num(r[m])}); }); } }); return out.filter(r=>r.Branch&&r.Month); }
  function loadEmbedded(){
    try{
      const node=byId('cashTargetEmbeddedData');
      const raw=(node && node.textContent && node.textContent.trim()) || '{}';
      const data=JSON.parse(raw);
      cashRows=(data.cash||[]).map(normalizeCashRow).filter(r=>r.Branch);
      targetRows=normalizeTargetRows(data.target||[]);
      syncCashGlobals();
      const src=node && node.getAttribute && node.getAttribute('data-src');
      if(src && !window.__cashTargetJsonLoading && (!data.cash || !data.cash.length)){
        window.__cashTargetJsonLoading=true;
        fetch(src,{cache:'force-cache'}).then(r=>r.ok?r.json():null).then(ext=>{
          if(!ext) return;
          cashRows=(ext.cash||[]).map(normalizeCashRow).filter(r=>r.Branch);
          targetRows=normalizeTargetRows(ext.target||[]);
          syncCashGlobals();
          if(typeof renderCash==='function') renderCash();
          if(typeof renderCashTarget==='function') renderCashTarget();
        }).catch(function(){});
      }
    }catch(e){ }
  }
  function unique(a){ return [...new Set(a.filter(Boolean))].sort((x,y)=>String(x).localeCompare(String(y))); }
  function selected(id){ const el=byId(id); if(!el) return []; return [...el.options].filter(o=>o.selected&&o.value).map(o=>o.value); }
  function setText(id,v){ const el=byId(id); if(el) el.textContent=v; }
  function fillMulti(id, values){ const el=byId(id); if(!el) return; const old=selected(id); el.innerHTML='<option value="">Select All</option>'+values.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join(''); if(old.length){[...el.options].forEach(o=>o.selected=old.includes(o.value));} else {el.options[0].selected=true;} makeDropdown(id); }
  function makeDropdown(id){ const sel=byId(id); if(!sel||sel.dataset.cashDd) return; sel.dataset.cashDd='1'; sel.classList.add('cash-native-hidden'); const wrap=document.createElement('div'); wrap.className='cash-filter-dd'; wrap.innerHTML='<button type="button" class="cash-filter-btn">Select All</button><div class="cash-filter-panel"><input class="cash-filter-search" placeholder="Search"><div class="cash-filter-list"></div><div class="cash-filter-actions"><button type="button" class="cash-cancel">Cancel</button><button type="button" class="cash-ok">OK</button></div></div>'; sel.insertAdjacentElement('afterend',wrap); const btn=wrap.querySelector('.cash-filter-btn'), panel=wrap.querySelector('.cash-filter-panel'), list=wrap.querySelector('.cash-filter-list'), search=wrap.querySelector('.cash-filter-search'); let temp=new Set(selected(id)); if(!temp.size) temp.add(''); function label(){const vals=selected(id); btn.textContent=!vals.length?'Select All':(vals.length>2?`${vals.length} selected`:vals.join(', '));}
    function draw(){ const term=search.value.toLowerCase(); const opts=[...sel.options].filter(o=>!term||o.textContent.toLowerCase().includes(term)); list.innerHTML=opts.map(o=>`<label class="cash-filter-option"><input type="checkbox" data-value="${esc(o.value)}" ${temp.has(o.value)?'checked':''}><span>${esc(o.textContent)}</span></label>`).join(''); list.querySelectorAll('input').forEach(cb=>cb.onchange=()=>{const v=cb.dataset.value;if(v===''){temp=cb.checked?new Set(['']):new Set();}else{temp.delete('');cb.checked?temp.add(v):temp.delete(v);if(!temp.size)temp.add('');}draw();}); }
    function positionPanel(){ panel.style.left='0px'; panel.style.top='calc(100% + 8px)'; panel.style.width=Math.min(390, Math.max(260, btn.offsetWidth))+'px'; panel.style.maxWidth='calc(100vw - 40px)'; }
    btn.onclick=e=>{e.stopPropagation();document.querySelectorAll('#cashTargetPage .cash-filter-dd.open').forEach(x=>{if(x!==wrap)x.classList.remove('open')});wrap.classList.toggle('open');temp=new Set(selected(id));if(!temp.size)temp.add('');draw(); if(wrap.classList.contains('open')){positionPanel(); setTimeout(()=>search.focus(),0);}}; panel.onclick=e=>e.stopPropagation(); search.oninput=draw; wrap.querySelector('.cash-cancel').onclick=()=>wrap.classList.remove('open'); wrap.querySelector('.cash-ok').onclick=()=>{[...sel.options].forEach(o=>o.selected=temp.has(o.value)); if(temp.has('')) [...sel.options].forEach((o,i)=>o.selected=i===0); wrap.classList.remove('open'); label(); renderCashTarget();}; window.addEventListener('resize',()=>{if(wrap.classList.contains('open'))positionPanel();},{passive:true}); window.addEventListener('scroll',()=>{if(wrap.classList.contains('open'))positionPanel();},{passive:true}); document.addEventListener('click',()=>wrap.classList.remove('open')); sel._cashUpdateLabel=label; draw(); label(); }
  function refreshDropdownLabels(){ ['cashBranchFilter','cashMonthFilter','cashDetailsMonthFilter','cashVarianceBranchFilter','cashDailyBranchFilter'].forEach(id=>{const s=byId(id); if(s&&s._cashUpdateLabel)s._cashUpdateLabel();}); }
  function initFilters(){ const allBranches=unique(cashRows.map(r=>r.Branch).concat(targetRows.map(r=>r.Branch))); fillMulti('cashBranchFilter', allBranches); const months=monthOrder.filter(m=>cashRows.some(r=>r.Month===m)||targetRows.some(r=>r.Month===m)); const allMonths=months.length?months:monthOrder; fillMulti('cashMonthFilter', allMonths); fillMulti('cashDetailsMonthFilter', allMonths); fillMulti('cashVarianceBranchFilter', allBranches); fillMulti('cashDailyBranchFilter', allBranches); }
  function getFilteredCash(){ const br=selected('cashBranchFilter'), mo=selected('cashMonthFilter'); const fd=byId('cashFromDate')?.value||'', td=byId('cashToDate')?.value||''; return cashRows.filter(r=>(!br.length||br.includes(r.Branch))&&(!mo.length||mo.includes(r.Month))&&(!fd||r.Date>=fd)&&(!td||r.Date<=td)); }
  function getActiveMonths(rows){ let m=selected('cashMonthFilter'); if(m.length) return m; return unique(rows.map(r=>r.Month)); }
  function getTarget(branch, months){ return targetRows.filter(t=>t.Branch===branch&&months.includes(t.Month)).reduce((a,t)=>a+t.Target,0); }
  function status(p){ if(p>=100)return ['Excellent','status-excellent']; if(p>=90)return ['Good','status-good']; if(p>=70)return ['Watch','status-watch']; return ['Critical','status-critical']; }
  function destroyChart(id){ if(window.dashboardCharts&&window.dashboardCharts[id]){try{window.dashboardCharts[id].destroy()}catch(e){} delete window.dashboardCharts[id];} if(!window.dashboardCharts) window.dashboardCharts={}; }
  const cashPalette=['#ff4d2e','#0f4c81','#217346','#f59e0b','#7030a0','#00a6a6','#d63d22','#64748b','#38b000','#2b78b8','#9b5cf6','#f97316'];
  const cashValuePlugin={id:'cashValuePlugin',afterDatasetsDraw(chart){const {ctx}=chart;ctx.save();ctx.textAlign='center';ctx.textBaseline='bottom';ctx.font='bold 11px Manrope, Arial';chart.data.datasets.forEach((ds,di)=>{const meta=chart.getDatasetMeta(di);if(meta.hidden)return;meta.data.forEach((bar,i)=>{const val=ds.data[i];if(val==null)return;const text=String(val).includes('.')?Number(val).toFixed(1):money(val);const x=bar.x,y=bar.y-4;ctx.fillStyle='rgba(255,255,255,.94)';const w=ctx.measureText(text).width+10;ctx.fillRect(x-w/2,y-15,w,16);ctx.strokeStyle='rgba(255,255,255,.24)';ctx.strokeRect(x-w/2,y-15,w,16);ctx.fillStyle='#111827';ctx.fillText(text,x,y-1);});});ctx.restore();}};

  function chartTextColor(){ return '#f8fafc'; }
  const cashChartAreaPlugin={id:'cashChartAreaPlugin',beforeDraw(chart){const {ctx,chartArea}=chart;if(!chartArea)return;ctx.save();ctx.fillStyle='#111827';ctx.fillRect(chartArea.left,chartArea.top,chartArea.right-chartArea.left,chartArea.bottom-chartArea.top);ctx.restore();}};
  const cashVarianceLabelPlugin={id:'cashVarianceLabelPlugin',afterDatasetsDraw(chart){ if(chart.canvas.id!=='cashMonthlyVarianceChart') return; const {ctx}=chart; const cash=chart.data.datasets[0], target=chart.data.datasets[1]; if(!cash||!target)return; ctx.save(); ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.font='bold 13px Manrope, Arial'; const m0=chart.getDatasetMeta(0), m1=chart.getDatasetMeta(1); target.data.forEach((t,i)=>{ if(!t) return; const c=Number(cash.data[i]||0); const pct=((c-t)/t*100); const bar=m1.data[i]||m0.data[i]; if(!bar) return; const text=(pct>=0?'+':'')+pct.toFixed(0)+'%'; const x=bar.x; const y=bar.y + Math.max(18, (bar.base-bar.y)*0.42); const w=ctx.measureText(text).width+12; ctx.fillStyle=pct>=0?'rgba(22,163,74,.95)':'rgba(220,38,38,.95)'; ctx.fillRect(x-w/2,y-10,w,20); ctx.strokeStyle='rgba(255,255,255,.65)'; ctx.strokeRect(x-w/2,y-10,w,20); ctx.fillStyle='#ffffff'; ctx.fillText(text,x,y+1); }); ctx.restore(); }};
  function drawBar(id, labels, datasets){
    const c=byId(id); if(!c||typeof Chart==='undefined')return; destroyChart(id);
    const dataSets=datasets.map((d,di)=>({ ...d, backgroundColor:d.backgroundColor||labels.map((_,i)=>cashPalette[(i+di*3)%cashPalette.length]), borderColor:'#0a0a0a', borderWidth:1, borderRadius:6 }));
    window.dashboardCharts[id]=__safeNewChart(c,{
      type:'bar',
      data:{labels:labels,datasets:dataSets},
      options:{responsive:true,maintainAspectRatio:false,layout:{padding:{top:32}},plugins:{legend:{display:dataSets.length>1,labels:{color:chartTextColor(),font:{weight:'bold'}}},tooltip:{callbacks:{label:ctx=>`${ctx.dataset.label}: ${money(ctx.raw)}`}}},scales:{y:{beginAtZero:true,ticks:{color:chartTextColor(),font:{weight:'bold'}},grid:{color:'rgba(255,255,255,.12)'}},x:{ticks:{color:chartTextColor(),font:{weight:'bold'},autoSkip:false,maxRotation:45,minRotation:0},grid:{color:'rgba(255,255,255,.06)'}}}},
      plugins:[cashChartAreaPlugin,cashValuePlugin,cashVarianceLabelPlugin]
    });
  }
  function drawLine(id, labels, data){
    const c=byId(id); if(!c||typeof Chart==='undefined')return; destroyChart(id);
    window.dashboardCharts[id]=__safeNewChart(c,{
      type:'line',
      data:{labels:labels,datasets:[{label:'Revenue',data:data,borderColor:'#38bdf8',backgroundColor:'#38bdf8',pointBackgroundColor:'#38bdf8',pointBorderColor:'#ffffff',borderWidth:3,tension:.25,fill:false}]},
      options:{responsive:true,maintainAspectRatio:false,layout:{padding:{top:28}},plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{color:chartTextColor(),font:{weight:'bold'}},grid:{color:'rgba(255,255,255,.12)'}},x:{ticks:{color:chartTextColor(),font:{weight:'bold'}},grid:{color:'rgba(255,255,255,.06)'}}}},
      plugins:[cashChartAreaPlugin,cashValuePlugin]
    });
  }

  function drawMonthlyVariance(rows){
    const varianceBranches=selected('cashVarianceBranchFilter');
    const vRows=(rows||[]).filter(r=>!varianceBranches.length||varianceBranches.includes(r.Branch));
    const months=monthOrder.filter(m=>vRows.some(r=>r.Month===m)||targetRows.some(t=>t.Month===m&&(!varianceBranches.length||varianceBranches.includes(t.Branch))));
    const cashData=months.map(m=>vRows.filter(r=>r.Month===m).reduce((a,r)=>a+r.JobAmount,0));
    const targetData=months.map(m=>{ const branches=varianceBranches.length?varianceBranches:unique(vRows.filter(r=>r.Month===m).map(r=>r.Branch)); return branches.reduce((a,b)=>a+getTarget(b,[m]),0); });
    drawBar('cashMonthlyVarianceChart', months.map(m=>m.slice(0,3)), [
      {label:'Cash',data:cashData,backgroundColor:'#dff7df'},
      {label:'Target',data:targetData,backgroundColor:'#64748b'}
    ]);
  }
  window.renderCashTarget=function(){ if(!byId('cashTargetPage')) return; const rows=getFilteredCash(); const branches=unique(rows.map(r=>r.Branch)); const months=getActiveMonths(rows); currentSummary=branches.map(b=>{const rev=rows.filter(r=>r.Branch===b).reduce((a,r)=>a+r.JobAmount,0), tar=getTarget(b,months), pct=tar?rev/tar*100:0, rem=Math.max(tar-rev,0); return {Branch:b,Revenue:rev,Target:tar,Achievement:pct,Remaining:rem};}).sort((a,b)=>b.Revenue-a.Revenue); const totalRev=currentSummary.reduce((a,r)=>a+r.Revenue,0), totalTar=currentSummary.reduce((a,r)=>a+r.Target,0), ach=totalTar?totalRev/totalTar*100:0, rem=Math.max(totalTar-totalRev,0), avg=branches.length?totalRev/branches.length:0; const dates=unique(rows.map(r=>r.Date)); const daily=dates.length?totalRev/dates.length:0; const ranked=currentSummary.filter(r=>r.Target>0).sort((a,b)=>b.Achievement-a.Achievement); setText('cashTotalRevenue',money(totalRev));setText('cashTotalTarget',money(totalTar));setText('cashAchievement',ach.toFixed(1)+'%');setText('cashRemaining',money(rem));setText('cashAvgRevenue',money(avg));setText('cashDailyRevenue',money(daily));setText('cashBestBranch',ranked[0]?.Branch||'-');setText('cashBestBranchPct',(ranked[0]?.Achievement||0).toFixed(1)+'%');setText('cashWorstBranch',ranked[ranked.length-1]?.Branch||'-');setText('cashWorstBranchPct',(ranked[ranked.length-1]?.Achievement||0).toFixed(1)+'%');setText('cashTargetRowsNote',`${fmt(rows.length)} cash rows loaded / ${fmt(cashRows.length)} total`); refreshDropdownLabels();
    const top=currentSummary.slice(0,15); drawBar('cashRevenueTargetChart',top.map(x=>x.Branch),[{label:'Revenue',data:top.map(x=>x.Revenue),backgroundColor:'#22c55e'},{label:'Target',data:top.map(x=>x.Target),backgroundColor:'#ff4d2e'}]); drawMonthlyVariance(rows); const monthData=monthOrder.map(m=>rows.filter(r=>r.Month===m).reduce((a,r)=>a+r.JobAmount,0)); drawLine('cashMonthlyTrendChart',monthOrder.filter((m,i)=>monthData[i]>0),monthData.filter(v=>v>0)); const top5=[...ranked].slice(0,5), low5=[...ranked].reverse().slice(0,5); drawBar('cashTopLowestChart',top5.concat(low5).map(x=>x.Branch),[{label:'Achievement %',data:top5.concat(low5).map(x=>Number(x.Achievement.toFixed(1)))}]); renderTable(rows); renderDailyTable(rows); };
  function renderTable(baseRows){ const tbl=byId('cashTargetTable'); if(!tbl)return; const dMonths=selected('cashDetailsMonthFilter'); const source=(baseRows||[]).filter(r=>!dMonths.length||dMonths.includes(r.Month)); const branches=unique(source.map(r=>r.Branch)); const months=dMonths.length?dMonths:unique(source.map(r=>r.Month)); const rows=[]; branches.forEach(b=>months.forEach(m=>{const branchMonthRows=source.filter(r=>r.Branch===b&&r.Month===m); const maintenance=branchMonthRows.reduce((a,r)=>a+num(r.Maintenance),0); const vip=branchMonthRows.reduce((a,r)=>a+num(r.VIP),0); const rev=branchMonthRows.reduce((a,r)=>a+r.JobAmount,0); const tar=getTarget(b,[m]); if(rev||tar||maintenance||vip){const pct=tar?rev/tar*100:0; rows.push({Branch:b,Month:m,Maintenance:maintenance,VIP:vip,Revenue:rev,Target:tar,Achievement:pct,Remaining:Math.max(tar-rev,0)});}})); rows.sort((a,b)=>a.Branch.localeCompare(b.Branch)||monthOrder.indexOf(a.Month)-monthOrder.indexOf(b.Month)); const detailsTotal=rows.reduce((a,r)=>a+r.Revenue,0); setText('cashDetailsTotalRevenue',money(detailsTotal)); setText('cashDetailsTotalNote',dMonths.length?`Filtered: ${dMonths.join(', ')}`:'All months total'); tbl.innerHTML='<thead><tr><th>Branch</th><th>Month</th><th>Maintenance</th><th>VIP</th><th>Total Revenue</th><th>Target</th><th>Achievement %</th><th>Progress</th><th>Remaining</th><th>Status</th></tr></thead><tbody>'+rows.map(r=>{const st=status(r.Achievement), w=Math.min(100,Math.max(0,r.Achievement)); return `<tr><td>${esc(r.Branch)}</td><td>${esc(r.Month)}</td><td>${money(r.Maintenance)}</td><td>${money(r.VIP)}</td><td>${money(r.Revenue)}</td><td>${money(r.Target)}</td><td>${r.Achievement.toFixed(1)}%</td><td><div class="progress-track"><div class="progress-fill" style="width:${w}%"></div></div></td><td>${money(r.Remaining)}</td><td><span class="badge ${st[1]}">${st[0]}</span></td></tr>`;}).join('')+'</tbody>'; }
  function renderDailyTable(baseRows){ const tbl=byId('cashDailyRevenueTable'); if(!tbl)return; const dBranches=selected('cashDailyBranchFilter'); const fd=byId('cashDailyFromDate')?.value||'', td=byId('cashDailyToDate')?.value||''; const source=(baseRows||[]).filter(r=>(!dBranches.length||dBranches.includes(r.Branch))&&(!fd||r.Date>=fd)&&(!td||r.Date<=td)); const byKey={}; source.forEach(r=>{ if(!r.Date||!r.Branch)return; const key=r.Date+'||'+r.Branch; if(!byKey[key]) byKey[key]={Date:r.Date,Branch:r.Branch,Maintenance:0,VIP:0,Revenue:0,Rows:0}; byKey[key].Maintenance+=num(r.Maintenance); byKey[key].VIP+=num(r.VIP); byKey[key].Revenue+=r.JobAmount; byKey[key].Rows+=1; }); const rows=Object.values(byKey).sort((a,b)=>a.Date.localeCompare(b.Date)||a.Branch.localeCompare(b.Branch)); const dailyTotal=rows.reduce((a,r)=>a+r.Revenue,0); setText('cashDailyDetailsTotalRevenue',money(dailyTotal)); setText('cashDailyDetailsTotalNote', (dBranches.length?('Branch: '+dBranches.join(', ')):'All branches') + ((fd||td)?(' / '+(fd?displayDate(fd):'Start')+' to '+(td?displayDate(td):'End')):' / All dates')); tbl.innerHTML='<thead><tr><th>Date</th><th>Branch</th><th>Maintenance</th><th>VIP</th><th>Total Revenue</th><th>Rows Count</th></tr></thead><tbody>'+rows.map(r=>`<tr><td>${displayDate(r.Date)}</td><td>${esc(r.Branch)}</td><td>${money(r.Maintenance)}</td><td>${money(r.VIP)}</td><td>${money(r.Revenue)}</td><td>${money(r.Rows)}</td></tr>`).join('')+'</tbody>'; }
  window.clearCashTargetFilters=function(){ ['cashBranchFilter','cashMonthFilter','cashDetailsMonthFilter','cashVarianceBranchFilter','cashDailyBranchFilter'].forEach(id=>{const el=byId(id); if(el)[...el.options].forEach((o,i)=>o.selected=i===0);}); ['cashFromDate','cashToDate','cashDailyFromDate','cashDailyToDate'].forEach(id=>{const el=byId(id); if(el)el.value='';}); renderCashTarget(); };
  window.exportCashTargetTable=function(){ if(typeof XLSX==='undefined') return alert('XLSX library is not loaded.'); const ws=XLSX.utils.json_to_sheet(currentSummary.map(r=>({Branch:r.Branch,Revenue:r.Revenue,Target:r.Target,'Achievement %':Number(r.Achievement.toFixed(1)),Remaining:r.Remaining}))); const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'Cash Target'); XLSX.writeFile(wb,'Cash_Target_Filtered.xlsx'); };
  async function loadCashTargetFromGitHub(force){
    return false;
    if(typeof XLSX==='undefined') return false;
    const candidates=['Cash & Target.xlsx','Cash and Target.xlsx','Cash_Target.xlsx','cashTarget.xlsx','cash_target.xlsx'];
    let lastErr=null;
    for(const fileName of candidates){
      try{
        if(force && typeof serviceClearDataVersion==='function') serviceClearDataVersion(fileName);
        const encoded=String(fileName).split('/').map(encodeURIComponent).join('/');
        const url=(typeof serviceDataUrl==='function') ? await serviceDataUrl(fileName,!!force) : encoded + (force?'?v='+Date.now():'');
        const res=await fetch(url,{cache:force?'no-store':'no-cache'});
        if(!res.ok) throw new Error(fileName+' HTTP '+res.status);
        const ab=await res.arrayBuffer();
        const wb=XLSX.read(new Uint8Array(ab),{type:'array',cellDates:true,raw:true});
        const cws=wb.Sheets['Cash']||wb.Sheets['cash']||wb.Sheets[wb.SheetNames[0]];
        const tws=wb.Sheets['Target']||wb.Sheets['target']||wb.Sheets[wb.SheetNames[1]];
        if(!cws) throw new Error('Cash sheet not found');
        cashRows=XLSX.utils.sheet_to_json(cws,{defval:'',raw:false}).map(normalizeCashRow).filter(r=>r.Branch);
        targetRows=tws?normalizeTargetRows(XLSX.utils.sheet_to_json(tws,{defval:'',raw:false})):[];
        syncCashGlobals();
        initFilters();
        setText('cashTargetLastUpdated',new Date().toLocaleString());
        setText('cashTargetRowsNote',`${fmt(cashRows.length)} cash rows loaded from GitHub / ${fmt(cashRows.length+targetRows.length)} total`);
        renderCashTarget();
        try{ localStorage.setItem('serviceV2Last_cashTarget',JSON.stringify({state:'success',source:'GitHub: '+fileName,rows:cashRows.length+targetRows.length,time:new Date().toLocaleString(),msg:'Fresh Cash & Target file loaded by Auto sync'})); }catch(_e){}
        return true;
      }catch(err){ lastErr=err; }
    }
    console.warn('Cash & Target GitHub auto load skipped:', lastErr && lastErr.message ? lastErr.message : lastErr);
    return false;
  }
  window.loadCashTargetFromGitHub=loadCashTargetFromGitHub;
  function readWorkbook(file){ const reader=new FileReader(); reader.onload=e=>{try{const wb=XLSX.read(new Uint8Array(e.target.result),{type:'array',cellDates:true,raw:true}); const cws=wb.Sheets['Cash']||wb.Sheets['cash']||wb.Sheets[wb.SheetNames[0]], tws=wb.Sheets['Target']||wb.Sheets['target']||wb.Sheets[wb.SheetNames[1]]; if(!cws) throw new Error('Cash sheet not found'); cashRows=XLSX.utils.sheet_to_json(cws,{defval:'',raw:false}).map(normalizeCashRow).filter(r=>r.Branch); targetRows=tws?normalizeTargetRows(XLSX.utils.sheet_to_json(tws,{defval:'',raw:false})):[]; syncCashGlobals(); initFilters(); setText('cashTargetLastUpdated',new Date().toLocaleString()); setText('cashTargetRowsNote',`${fmt(cashRows.length)} cash rows loaded / ${fmt(cashRows.length)} total`); renderCashTarget(); try{ if(file&&file.name) localStorage.setItem('serviceV2Last_cashTarget',JSON.stringify({state:'success',source:'Manual upload: '+file.name,rows:cashRows.length+targetRows.length,time:new Date().toLocaleString(),msg:'Fresh Cash & Target file loaded'})); }catch(_e){} }catch(err){ alert('Cash & Target upload failed: '+(err&&err.message?err.message:err)); ; }}; reader.readAsArrayBuffer(file); }
  window.openCashTargetTab=function(){ localStorage.setItem('serviceEyeActiveTab','cashTarget'); ['gspnPage','skyPage','profitPage','cashTargetPage'].forEach(id=>{const el=byId(id); if(el) el.style.display=(id==='cashTargetPage')?'block':'none';}); document.querySelectorAll('.side-tab').forEach(el=>{const oc=el.getAttribute('onclick')||''; el.classList.toggle('active',oc.includes('openCashTargetTab')||oc.includes('cashTarget'));}); if(typeof applyTabDesign==='function') try{applyTabDesign('profit',false)}catch(e){} setTimeout(renderCashTarget,60); return true;};
  function installSwitch(){}
  function boot(){ loadEmbedded(); initFilters(); ['cashFromDate','cashToDate','cashDailyFromDate','cashDailyToDate'].forEach(id=>{const el=byId(id); if(el) el.addEventListener('input',renderCashTarget);}); const dm=byId('cashDetailsMonthFilter'); if(dm) dm.addEventListener('change',renderCashTarget); const f=byId('cashTargetFileInput'); if(f) f.addEventListener('change',e=>{if(e.target.files&&e.target.files[0])readWorkbook(e.target.files[0]);}); installSwitch(); setText('cashTargetLastUpdated',new Date().toLocaleString()); renderCashTarget(); /* Cash & Target is manual only: no GitHub auto-load */ if(localStorage.getItem('serviceEyeActiveTab')==='cashTarget') setTimeout(()=>window.openCashTargetTab(),50); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();


/* ===== cashTargetRouterLockV6 ===== */
/* Disabled: caused tab-reset bug */

/* ===== gspn-redo-data-hotfix ===== */

(function(){
  'use strict';
  const REDO_ALIASES = [
    'REDO','Redo','ReDo','redo','RE-DO','Re-Do','RE DO','Re Do','RE_DO','Re_Do',
    'Redo Status','REDO Status','REDO_Status','Redo_Status','Redo Flag','REDO Flag'
  ];
  const GSPN_ALL_COLUMNS = [
    ['GSPN_Branch','Branch'], ['SO NO#','SO NO#'], ['Job_Number','Job No'],
    ['GSPN_Open_Date_Display','GSPN Open Date'], ['Stage','Stage'], ['GSPN_Status','GSPN Status'],
    ['GSPN JobType','Job Type'], ['GSPN Warranty','GSPN Warranty'], ['AgingDays','Aging Days'],
    ['AgingStatus','Aging Status'], ['KPIAlert','KPI Alert'], ['Model','Model'], ['REDO','REDO']
  ];
  const GSPN_URGENT_COLUMNS = [
    ['PriorityRank','Priority'], ['GSPN_Branch','Branch'], ['SO NO#','SO NO#'],
    ['Job_Number','Job No'], ['GSPN_Open_Date_Display','GSPN Open Date'], ['REDO','REDO'],
    ['Stage','Stage'], ['GSPN JobType','Job Type'], ['GSPN Warranty','GSPN Warranty'], ['GSPN_Status','GSPN Status'],
    ['AgingDays','Aging Days'], ['KPIFailDays','Fail Days'], ['KPIFailName','Failed Type'],
    ['DaysRemaining','Remaining'], ['KPIAlert','KPI Alert'], ['ActionRequired','Action Required'], ['GSPN Assigned_To','Technician']
  ];
  const GSPN_EXPORT_COLUMNS = [
    ['GSPN_Branch','Branch'], ['SO NO#','SO NO#'], ['Job_Number','Job No'],
    ['GSPN_Open_Date_Display','GSPN Open Date'], ['REDO','REDO'], ['Stage','Stage'],
    ['GSPN_Status','GSPN Status'], ['GSPN JobType','Job Type'], ['GSPN Warranty','GSPN Warranty'],
    ['AgingDays','Aging Days'], ['AgingStatus','Aging Status'], ['KPIAlert','KPI Alert'],
    ['Model','Model'], ['GSPN Serial','GSPN Serial'], ['GSPN Assigned_To','GSPN Assigned_To'],
    ['KPIFailDays','Fail Days'], ['KPIFailName','Failed Type'], ['DaysRemaining','Remaining'],
    ['ActionRequired','Action Required'], ['KPIResult','KPI Result']
  ];
  function normKey(v){ return String(v == null ? '' : v).toLowerCase().replace(/[^a-z0-9]+/g,''); }
  function cleanVal(v){ return String(v == null ? '' : v).trim(); }
  function looseGet(row, aliases){
    if(!row) return '';
    for(const a of aliases){
      if(Object.prototype.hasOwnProperty.call(row,a) && row[a] !== '' && row[a] != null) return row[a];
    }
    const keys = Object.keys(row);
    const wanted = aliases.map(normKey);
    for(const k of keys){
      if(wanted.includes(normKey(k)) && row[k] !== '' && row[k] != null) return row[k];
    }
    for(const k of keys){
      const nk = normKey(k);
      if((nk === 'redo' || nk.includes('redo')) && row[k] !== '' && row[k] != null) return row[k];
    }
    return '';
  }
  function rowValue(row, key){
    if(!row) return '';
    if(key === 'REDO') return cleanVal(row.REDO || looseGet(row, REDO_ALIASES));
    if(Object.prototype.hasOwnProperty.call(row,key)) return row[key];
    const wanted = normKey(key);
    const found = Object.keys(row).find(k => normKey(k) === wanted);
    if(found) return row[found];
    return '';
  }
  window.ALL_CASE_COLUMNS = GSPN_ALL_COLUMNS;
  window.URGENT_COLUMNS = GSPN_URGENT_COLUMNS;

  const previousNormalize = window.normalizeRow;
  if(typeof previousNormalize === 'function'){
    window.normalizeRow = function(row){
      const out = previousNormalize.call(this, row);
      out.REDO = cleanVal(looseGet(row, REDO_ALIASES) || out.REDO);
      return out;
    };
  }

  function syncExistingRedoRows(){
    try{
      const rows = (typeof allRows !== 'undefined' && Array.isArray(allRows)) ? allRows : (Array.isArray(window.allRows) ? window.allRows : []);
      rows.forEach(r => { r.REDO = cleanVal(r.REDO || looseGet(r, REDO_ALIASES)); });
    }catch(e){}
  }

  const previousRender = window.render;
  if(typeof previousRender === 'function' && !previousRender.__gspnRedoHotfix){
    const wrapped = function(){
      syncExistingRedoRows();
      const result = previousRender.apply(this, arguments);
      syncExistingRedoRows();
      return result;
    };
    wrapped.__gspnRedoHotfix = true;
    window.render = wrapped;
  }

  function exportRows(rows, columns, fileName, sheetName){
    if(typeof XLSX === 'undefined') return;
    const data = (rows || []).map(r => {
      const o = {};
      (columns || []).forEach(([key,label]) => { o[label] = rowValue(r,key); });
      return o;
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), sheetName);
    XLSX.writeFile(wb, fileName);
  }
  window.exportTableExcel = function(type){
    syncExistingRedoRows();
    const urgent = type === 'urgent';
    const rows = urgent ? (window.currentUrgentRows || []) : (window.currentFilteredRows || []);
    exportRows(rows, urgent ? GSPN_URGENT_COLUMNS : GSPN_EXPORT_COLUMNS, urgent ? 'Urgent Worklist.xlsx' : 'All Filtered Cases.xlsx', urgent ? 'Urgent Worklist' : 'All Filtered Cases');
  };

  document.addEventListener('DOMContentLoaded', function(){ setTimeout(function(){ syncExistingRedoRows(); if(typeof window.render === 'function') window.render(); }, 250); });
})();


/* ===== inline-script-68 ===== */

(function(){
  const PROFIT_DISPLAY_COLUMNS = [
    ["Job_Number","Job_Number"],["Status","Status"],["JobType","JobType"],["Model","Model"],
    ["Revenue Warranty","Revenue Warranty"],["Profit Status","Profit Status"],["Profit Group","Profit Group"],
    ["Discount","Discount"],["Dealer commission","Dealer commission"],["OW Cost","OW Cost"],
    ["Final Price","Final Price"],["Diff","Diff"],["Diff%","Diff%"]
  ];
  const MONTH_ORDER = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let profitRows = [];
  let currentProfitRows = [];
  window.profitRows = profitRows;
  window.currentProfitRows = currentProfitRows;

  function pClean(v){ return String(v == null ? "" : v).trim(); }
  function pNorm(v){ return pClean(v).toLowerCase().replace(/[^a-z0-9]+/g,""); }
  function pGet(row, key){
    if(!row) return "";
    if(Object.prototype.hasOwnProperty.call(row,key)) return row[key];
    const nk = pNorm(key);
    const found = Object.keys(row).find(k => pNorm(k) === nk);
    return found ? row[found] : "";
  }
  function pNum(v){
    if(typeof v === "number") return isFinite(v) ? v : 0;
    const s = pClean(v).replace(/,/g,"").replace(/%$/,"");
    const n = Number(s);
    return isFinite(n) ? n : 0;
  }
  function pFmt(n){ return Math.round(Number(n)||0).toLocaleString(); }
  function pUnique(arr){ return [...new Set((arr||[]).map(pClean).filter(Boolean))].sort((a,b)=>a.localeCompare(b)); }
  function pMonth(row){
    const m = pClean(pGet(row,"Month"));
    if(m) return m;
    const d = pGet(row,"CloseDate");
    if(d instanceof Date && !isNaN(d)) return MONTH_ORDER[d.getMonth()];
    return "";
  }
  function getProfitSelectedValues(id){
    const el = document.getElementById(id); if(!el) return [];
    return Array.from(el.selectedOptions || []).map(o => pClean(o.value || o.textContent)).filter(Boolean);
  }
  function fillProfitSelect(id, values, allText){
    const el = document.getElementById(id); if(!el) return;
    const selected = new Set(getProfitSelectedValues(id));
    el.multiple = true;
    el.innerHTML = values.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
    Array.from(el.options).forEach(o => { o.selected = selected.has(o.value); });
    el.title = allText || "All";
  }
  function normalizeProfitRow(row){
    const out = {...row};
    PROFIT_DISPLAY_COLUMNS.forEach(([k]) => { if(!Object.prototype.hasOwnProperty.call(out,k)) out[k] = pGet(row,k); });
    out.Branch = pGet(row,"Branch"); out.Brand = pGet(row,"Brand"); out.Month = pMonth(row); out.COGS = pGet(row,"COGS");
    return out;
  }
  function setProfitText(id, val){ const el=document.getElementById(id); if(el) el.textContent=val; }

  function refreshProfitFilters(){
    fillProfitSelect("profitBrandFilter", pUnique(profitRows.map(r=>pGet(r,"Brand"))), "All Brand");
    fillProfitSelect("profitBranchFilter", pUnique(profitRows.map(r=>pGet(r,"Branch"))), "All Branch");
    fillProfitSelect("profitWarrantyFilter", pUnique(profitRows.map(r=>pGet(r,"Revenue Warranty"))), "All Revenue Warranty");
    fillProfitSelect("profitStatusFilter", pUnique(profitRows.map(r=>pGet(r,"Profit Status"))), "All Profit Status");
    fillProfitSelect("profitGroupFilter", pUnique(profitRows.map(r=>pGet(r,"Profit Group"))), "All Profit Group");
  }
  function getProfitFilteredRows(){
    const brands = getProfitSelectedValues("profitBrandFilter");
    const branches = getProfitSelectedValues("profitBranchFilter");
    const warranties = getProfitSelectedValues("profitWarrantyFilter");
    const statuses = getProfitSelectedValues("profitStatusFilter");
    const groups = getProfitSelectedValues("profitGroupFilter");
    const q = pClean(document.getElementById("profitSearchBox")?.value).toLowerCase();
    return profitRows.filter(r => {
      if(brands.length && !brands.includes(pClean(pGet(r,"Brand")))) return false;
      if(branches.length && !branches.includes(pClean(pGet(r,"Branch")))) return false;
      if(warranties.length && !warranties.includes(pClean(pGet(r,"Revenue Warranty")))) return false;
      if(statuses.length && !statuses.includes(pClean(pGet(r,"Profit Status")))) return false;
      if(groups.length && !groups.includes(pClean(pGet(r,"Profit Group")))) return false;
      if(q){
        const hay = PROFIT_DISPLAY_COLUMNS.map(([k])=>pClean(pGet(r,k))).concat([pClean(pGet(r,"Branch")), pClean(pGet(r,"Brand"))]).join(" ").toLowerCase();
        if(!hay.includes(q)) return false;
      }
      return true;
    });
  }
  function renderSimpleTable(id, rows, columns){
    const table=document.getElementById(id); if(!table) return;
    const head = `<thead><tr>${columns.map(([l])=>`<th>${escapeHtml(l)}</th>`).join("")}</tr></thead>`;
    function cellValue(r,k){
      if(pNorm(k) === "diff"){
        const raw = pGet(r,k);
        if(raw === "" || raw == null) return "";
        let n = pNum(raw);
        if(Math.abs(n) <= 1 && !String(raw).includes("%")) n = n * 100;
        return (Math.round(n * 100) / 100).toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:2}) + "%";
      }
      return pGet(r,k);
    }
    const body = (rows||[]).slice(0,1500).map(r=>`<tr>${columns.map(([k])=>`<td>${escapeHtml(cellValue(r,k))}</td>`).join("")}</tr>`).join("");
    table.innerHTML = head + `<tbody>${body || `<tr><td colspan="${columns.length}">No data</td></tr>`}</tbody>`;
  }
  function renderPivot(id, rows, valueField){
    const table=document.getElementById(id); if(!table) return;
    const months = MONTH_ORDER.filter(m => rows.some(r => pMonth(r) === m));
    const monthList = months.length ? months : pUnique(rows.map(pMonth));
    const branches = pUnique(rows.map(r=>pGet(r,"Branch")));
    const totals = {}; let grand=0;
    const body = branches.map(b => {
      let rowTotal=0;
      const cells = monthList.map(m => {
        const sum = rows.filter(r=>pClean(pGet(r,"Branch"))===b && pMonth(r)===m).reduce((a,r)=>a+pNum(pGet(r,valueField)),0);
        totals[m]=(totals[m]||0)+sum; rowTotal+=sum; grand+=sum;
        return `<td>${pFmt(sum)}</td>`;
      }).join("");
      return `<tr><td>${escapeHtml(b)}</td>${cells}<td>${pFmt(rowTotal)}</td></tr>`;
    }).join("");
    const foot = `<tr class="pivot-grand"><td>Grand Total</td>${monthList.map(m=>`<td>${pFmt(totals[m]||0)}</td>`).join("")}<td>${pFmt(grand)}</td></tr>`;
    table.innerHTML = `<thead><tr><th>Branch</th>${monthList.map(m=>`<th>${escapeHtml(m)}</th>`).join("")}<th>Grand Total</th></tr></thead><tbody>${body}${foot}</tbody>`;
  }
  function renderProfitGroupPivot(rows){
    const table=document.getElementById("profitGroupPivot"); if(!table) return;
    const counts = {}; rows.forEach(r=>{ const k=pClean(pGet(r,"Profit Group")) || "(blank)"; counts[k]=(counts[k]||0)+1; });
    const entries = Object.entries(counts).sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0]));
    const total = entries.reduce((a,b)=>a+b[1],0);
    table.innerHTML = `<thead><tr><th>Profit Group</th><th>Count of Cases</th></tr></thead><tbody>` +
      entries.map(([k,v])=>`<tr><td>${escapeHtml(k)}</td><td>${pFmt(v)}</td></tr>`).join("") +
      `<tr class="pivot-grand"><td>Grand Total</td><td>${pFmt(total)}</td></tr></tbody>`;
  }
  function renderDiscountPivot(rows){
    const table=document.getElementById("profitDiscountPivot"); if(!table) return;
    const sums = {}; rows.forEach(r=>{ const b=pClean(pGet(r,"Branch")) || "(blank)"; sums[b]=(sums[b]||0)+pNum(pGet(r,"Discount")); });
    const entries = Object.entries(sums).sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0]));
    const total = entries.reduce((a,b)=>a+b[1],0);
    table.innerHTML = `<thead><tr><th>Branch</th><th>Sum of Discount</th></tr></thead><tbody>` +
      entries.map(([k,v])=>`<tr><td>${escapeHtml(k)}</td><td>${pFmt(v)}</td></tr>`).join("") +
      `<tr class="pivot-grand"><td>Grand Total</td><td>${pFmt(total)}</td></tr></tbody>`;
  }
  window.renderProfit = function(){
    if(!document.getElementById("profitPage")) return;
    refreshProfitFilters();
    currentProfitRows = getProfitFilteredRows(); window.currentProfitRows = currentProfitRows;
    setProfitText("profitTotalCases", pFmt(currentProfitRows.length));
    setProfitText("profitDealerTotal", pFmt(currentProfitRows.reduce((a,r)=>a+pNum(pGet(r,"Dealer commission")),0)));
    setProfitText("profitDiscountTotal", pFmt(currentProfitRows.reduce((a,r)=>a+pNum(pGet(r,"Discount")),0)));
    setProfitText("profitCogsTotal", pFmt(currentProfitRows.reduce((a,r)=>a+pNum(pGet(r,"COGS")),0)));
    const note=document.getElementById("profitUploadNote"); if(note) note.textContent = profitRows.length ? `${pFmt(currentProfitRows.length)} filtered from ${pFmt(profitRows.length)} loaded rows.` : "Upload Profitability file to show data.";
    renderSimpleTable("profitCasesTable", currentProfitRows, PROFIT_DISPLAY_COLUMNS);
    renderPivot("profitDealerPivot", currentProfitRows, "Dealer commission");
    renderProfitGroupPivot(currentProfitRows);
    renderDiscountPivot(currentProfitRows);
    renderPivot("profitCogsPivot", currentProfitRows, "COGS");
  };
  window.clearProfitFilters = function(){
    ["profitBrandFilter","profitBranchFilter","profitWarrantyFilter","profitStatusFilter","profitGroupFilter"].forEach(id=>{ const el=document.getElementById(id); if(el) Array.from(el.options).forEach(o => o.selected = false); });
    const s=document.getElementById("profitSearchBox"); if(s) s.value="";
    renderProfit();
  };
  window.exportProfitExcel = function(){
    if(typeof XLSX === "undefined") return;
    const rows = currentProfitRows.length ? currentProfitRows : profitRows;
    if(!rows.length) return alert("No Profitability data to export.");
    const keys = [...new Set(rows.flatMap(r=>Object.keys(r)))];
    const data = rows.map(r => { const o={}; keys.forEach(k=>o[k]=pGet(r,k)); return o; });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Profitability Cases");
    XLSX.writeFile(wb, "Profitability & commission.xlsx");
  };
  window.setProfitRows = function(raw){
    profitRows = (Array.isArray(raw) ? raw : []).map(normalizeProfitRow).filter(r => pGet(r,"Job_Number") || pGet(r,"Branch") || pGet(r,"Model"));
    window.profitRows = profitRows;
    clearProfitFilters();
    return profitRows;
  };
  /* [dedup] superseded autoLoadProfitFromGitHub definition removed (was L11905) */
  function handleProfitFile(e){
    const file = e.target.files && e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try{
        const data = new Uint8Array(ev.target.result);
        const wb = XLSX.read(data,{type:"array",cellDates:true});
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(sheet,{defval:"",raw:true});
        window.setProfitRows(raw);
      }catch(err){ alert("Failed to load Profitability file: " + err.message); }
    };
    reader.readAsArrayBuffer(file);
  }
  document.addEventListener("DOMContentLoaded", function(){
    const file=document.getElementById("profitFileInput"); if(file) file.addEventListener("change", handleProfitFile);
    ["profitBrandFilter","profitBranchFilter","profitWarrantyFilter","profitStatusFilter","profitGroupFilter"].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener("change", renderProfit); });
    const search=document.getElementById("profitSearchBox"); if(search) search.addEventListener("input", debounce(renderProfit, 150));
    setTimeout(renderProfit, 300);
    setTimeout(function(){ if(typeof window.autoLoadProfitFromGitHub === "function") window.autoLoadProfitFromGitHub(); }, 1900);
  });
})();


/* ===== profitability-v6-filter-final-script ===== */

(function(){
  'use strict';
  const FILTER_IDS = ['profitBrandFilter','profitBranchFilter','profitWarrantyFilter','profitStatusFilter','profitGroupFilter'];
  const FILTER_LABELS = {
    profitBrandFilter: 'Brand',
    profitBranchFilter: 'Branch',
    profitWarrantyFilter: 'Revenue Warranty',
    profitStatusFilter: 'Profit Status',
    profitGroupFilter: 'Profit Group'
  };
  function byId(id){ return document.getElementById(id); }
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function realOptions(select){ return Array.from(select.options).map(o => ({ value:String(o.value), text:String(o.textContent || o.value), selected:o.selected })).filter(o => o.value !== '__ALL__'); }
  function selectedSet(select){ return new Set(realOptions(select).filter(o => o.selected).map(o => o.value)); }
  function isAllSelected(select){ const opts = realOptions(select); const picked = selectedSet(select); return !opts.length || picked.size === 0 || picked.size === opts.length; }
  function summaryText(select, label){
    const opts = realOptions(select);
    const picked = selectedSet(select);
    if(!opts.length || picked.size === 0 || picked.size === opts.length) return 'Select All';
    const names = opts.filter(o => picked.has(o.value)).map(o => o.text);
    return names.length > 2 ? names.length + ' selected' : names.join(', ');
  }
  function closeAll(exceptPanel){
    document.querySelectorAll('.profit-v6-panel.open').forEach(p => { if(p !== exceptPanel) p.classList.remove('open'); });
    document.querySelectorAll('#profitPage .profit-v6-dd.open').forEach(w => { if(!exceptPanel || w.dataset.panelId !== exceptPanel.id) w.classList.remove('open'); });
  }
  function positionDown(btn, panel){
    const rect = btn.getBoundingClientRect();
    const width = Math.min(340, window.innerWidth - 24);
    const left = Math.min(Math.max(12, rect.left), window.innerWidth - width - 12);
    /* Force dropdown to open downward as requested. */
    const top = rect.bottom + 6;
    const availableBelow = Math.max(160, window.innerHeight - top - 12);
    const height = Math.min(390, availableBelow);
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
    panel.style.width = width + 'px';
    panel.style.maxHeight = height + 'px';
    const list = panel.querySelector('.profit-v6-list');
    if(list) list.style.maxHeight = Math.max(85, height - 132) + 'px';
  }
  function buildFilter(id){
    const select = byId(id); if(!select) return;
    select.multiple = true;
    select.classList.add('profit-v6-native-hidden');

    /* Remove older Profit-specific dropdowns and panels, but keep the original select. */
    [id + '_profitdd', id + '_excel', id + '_v5dd'].forEach(oldId => { const old = byId(oldId); if(old) old.remove(); });
    const oldPanel = byId(id + '_v5panel'); if(oldPanel) oldPanel.remove();

    let wrap = byId(id + '_v6dd');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.className = 'profit-v6-dd';
      wrap.id = id + '_v6dd';
      select.insertAdjacentElement('afterend', wrap);
    }
    let panel = byId(id + '_v6panel');
    if(!panel){
      panel = document.createElement('div');
      panel.className = 'profit-v6-panel';
      panel.id = id + '_v6panel';
      document.body.appendChild(panel);
    }
    wrap.dataset.panelId = panel.id;
    const label = FILTER_LABELS[id] || 'Filter';
    const summary = summaryText(select, label);
    wrap.innerHTML = '<button type="button" class="profit-v6-btn" title="' + esc(summary) + '">' + esc(summary) + '</button>';
    const btn = wrap.querySelector('.profit-v6-btn');

    function draw(term, temp){
      const q = String(term || '').toLowerCase();
      const opts = realOptions(select);
      const allChecked = !opts.length || temp.size === 0 || temp.size === opts.length;
      const visible = opts.filter(o => !q || o.text.toLowerCase().includes(q));
      panel.innerHTML = ''+
        '<input class="profit-v6-search" placeholder="Search" />'+
        '<div class="profit-v6-list">'+
          '<label class="profit-v6-option select-all"><input type="checkbox" data-all="1" ' + (allChecked ? 'checked' : '') + '> <span>Select All</span></label>'+
          (visible.length ? visible.map(o => '<label class="profit-v6-option"><input type="checkbox" data-value="' + esc(o.value) + '" ' + (allChecked || temp.has(o.value) ? 'checked' : '') + '> <span>' + esc(o.text) + '</span></label>').join('') : '<div class="profit-v6-option">No values</div>')+
        '</div><div class="profit-v6-actions"><button type="button" class="cancel">Cancel</button><button type="button" class="ok">OK</button></div>';
      const search = panel.querySelector('.profit-v6-search');
      search.value = term || '';
      search.oninput = () => draw(search.value, temp);
      const allBox = panel.querySelector('input[data-all="1"]');
      if(allBox){
        allBox.onchange = () => {
          if(allBox.checked){ temp.clear(); }
          else { temp.clear(); }
          draw(search.value, temp);
        };
      }
      panel.querySelectorAll('input[data-value]').forEach(cb => {
        cb.onchange = () => {
          const val = cb.getAttribute('data-value');
          if(isAllSelected(select) && temp.size === 0){
            /* move from Select All mode to manual selection */
            realOptions(select).forEach(o => { if(o.value !== val) temp.add(o.value); });
          }
          if(cb.checked) temp.add(val); else temp.delete(val);
          if(temp.size === realOptions(select).length) temp.clear();
          draw(search.value, temp);
        };
      });
      panel.querySelector('.cancel').onclick = () => closeAll();
      panel.querySelector('.ok').onclick = () => {
        const optsNow = realOptions(select);
        Array.from(select.options).forEach(o => { o.selected = false; });
        if(temp.size > 0 && temp.size < optsNow.length){
          Array.from(select.options).forEach(o => { o.selected = temp.has(String(o.value)); });
        }
        closeAll();
        select.dispatchEvent(new Event('change', { bubbles:true }));
        if(typeof window.renderProfit === 'function') window.renderProfit();
      };
      positionDown(btn, panel);
      setTimeout(() => search.focus(), 0);
    }
    btn.onclick = (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      const opening = !panel.classList.contains('open');
      closeAll(panel);
      if(opening){
        wrap.classList.add('open'); panel.classList.add('open');
        draw('', selectedSet(select));
        positionDown(btn, panel);
      }
    };
  }
  function refresh(){ FILTER_IDS.forEach(buildFilter); }
  function hookRender(){
    if(typeof window.renderProfit === 'function' && !window.renderProfit.__v6FilterHooked){
      const original = window.renderProfit;
      window.renderProfit = function(){
        const result = original.apply(this, arguments);
        requestAnimationFrame(refresh);
        return result;
      };
      window.renderProfit.__v6FilterHooked = true;
    }
  }
  document.addEventListener('click', function(ev){
    if(!ev.target.closest('.profit-v6-panel') && !ev.target.closest('#profitPage .profit-v6-dd')) closeAll();
  });
  window.addEventListener('resize', closeAll, { passive:true });
  window.addEventListener('scroll', closeAll, { passive:true });
  function boot(){ hookRender(); refresh(); }
  document.addEventListener('DOMContentLoaded', function(){ requestAnimationFrame(boot); });
  window.addEventListener('load', function(){ setTimeout(boot,300); });
  requestAnimationFrame(boot);
void(boot, 1800);
})();


/* ===== profitability-v7-filter-ui-script ===== */

(function(){
  'use strict';
  const FILTER_IDS = ['profitBrandFilter','profitBranchFilter','profitWarrantyFilter','profitStatusFilter','profitGroupFilter'];
  const ALL_LABELS = {
    profitBrandFilter: 'All Brands',
    profitBranchFilter: 'All Branches',
    profitWarrantyFilter: 'All Revenue Warranty',
    profitStatusFilter: 'All Profit Status',
    profitGroupFilter: 'All Profit Group'
  };
  function byId(id){ return document.getElementById(id); }
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function optionsOf(select){
    return Array.from(select.options)
      .map(o => ({ value:String(o.value), text:String(o.textContent || o.value), selected:o.selected }))
      .filter(o => o.value !== '__ALL__' && o.value !== '');
  }
  function selectedValues(select){ return new Set(optionsOf(select).filter(o => o.selected).map(o => o.value)); }
  /* [dedup] orphan helper isAllMode removed */
  function summaryText(select, id){
    const opts = optionsOf(select), picked = selectedValues(select);
    if(!opts.length || picked.size === 0 || picked.size === opts.length) return ALL_LABELS[id] || 'Select All';
    const names = opts.filter(o => picked.has(o.value)).map(o => o.text);
    return names.length > 3 ? names.length + ' selected' : names.join(', ');
  }
  function closeAll(exceptPanel){
    document.querySelectorAll('.profit-v7-panel.open').forEach(p => { if(p !== exceptPanel) p.classList.remove('open'); });
    document.querySelectorAll('#profitPage .profit-v7-dd.open').forEach(w => { if(!exceptPanel || w.dataset.panelId !== exceptPanel.id) w.classList.remove('open'); });
  }
  function positionDown(btn, panel){
    const rect = btn.getBoundingClientRect();
    const width = Math.max(rect.width, 260);
    const finalWidth = Math.min(width, window.innerWidth - 24);
    const left = Math.min(Math.max(12, rect.left), window.innerWidth - finalWidth - 12);
    const top = rect.bottom + 8; /* always downward */
    const availableBelow = Math.max(170, window.innerHeight - top - 12);
    const height = Math.min(380, availableBelow);
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
    panel.style.width = finalWidth + 'px';
    panel.style.maxHeight = height + 'px';
    const list = panel.querySelector('.profit-v7-list');
    if(list) list.style.maxHeight = Math.max(95, height - 132) + 'px';
  }
  function setButtonText(wrap, select, id){
    const text = summaryText(select, id);
    const span = wrap.querySelector('.profit-v7-btn-text');
    const btn = wrap.querySelector('.profit-v7-btn');
    if(span) span.textContent = text;
    if(btn) btn.title = text;
  }
  function syncChecks(panel, temp, opts){
    const allChecked = !opts.length || temp.size === 0 || temp.size === opts.length;
    const all = panel.querySelector('input[data-all="1"]');
    if(all) all.checked = allChecked;
    panel.querySelectorAll('input[data-value]').forEach(cb => {
      const val = cb.getAttribute('data-value');
      cb.checked = allChecked || temp.has(val);
    });
  }
  function buildFilter(id){
    const select = byId(id); if(!select) return;
    select.multiple = true;
    select.classList.add('profit-v7-native-hidden');
    [id + '_profitdd', id + '_excel', id + '_v5dd', id + '_v6dd'].forEach(oldId => { const old = byId(oldId); if(old) old.remove(); });
    [id + '_v5panel', id + '_v6panel'].forEach(oldId => { const old = byId(oldId); if(old) old.remove(); });

    let wrap = byId(id + '_v7dd');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.className = 'profit-v7-dd';
      wrap.id = id + '_v7dd';
      select.insertAdjacentElement('afterend', wrap);
    }
    let panel = byId(id + '_v7panel');
    if(!panel){
      panel = document.createElement('div');
      panel.className = 'profit-v7-panel';
      panel.id = id + '_v7panel';
      document.body.appendChild(panel);
    }
    wrap.dataset.panelId = panel.id;
    wrap.innerHTML = '<button type="button" class="profit-v7-btn"><span class="profit-v7-btn-text"></span><span class="profit-v7-btn-arrow">▼</span></button>';
    const btn = wrap.querySelector('.profit-v7-btn');
    setButtonText(wrap, select, id);

    function renderPanel(term, temp){
      const q = String(term || '').toLowerCase();
      const opts = optionsOf(select);
      const visible = opts.filter(o => !q || o.text.toLowerCase().includes(q));
      const allChecked = !opts.length || temp.size === 0 || temp.size === opts.length;
      panel.innerHTML = ''+
        '<input class="profit-v7-search" placeholder="Search" />'+
        '<div class="profit-v7-list">'+
          '<label class="profit-v7-option select-all"><input type="checkbox" data-all="1" ' + (allChecked ? 'checked' : '') + '> <span>Select All</span></label>'+
          (visible.length ? visible.map(o => '<label class="profit-v7-option"><input type="checkbox" data-value="' + esc(o.value) + '" ' + (allChecked || temp.has(o.value) ? 'checked' : '') + '> <span>' + esc(o.text) + '</span></label>').join('') : '<div class="profit-v7-empty">No values</div>')+
        '</div><div class="profit-v7-actions"><button type="button" class="cancel">Cancel</button><button type="button" class="ok">OK</button></div>';
      const search = panel.querySelector('.profit-v7-search');
      search.value = term || '';
      search.oninput = () => renderPanel(search.value, temp);
      const allBox = panel.querySelector('input[data-all="1"]');
      if(allBox){
        allBox.onchange = () => { temp.clear(); syncChecks(panel, temp, optionsOf(select)); };
      }
      panel.querySelectorAll('input[data-value]').forEach(cb => {
        cb.onchange = () => {
          const optsNow = optionsOf(select);
          const val = cb.getAttribute('data-value');
          const wasAll = temp.size === 0 || temp.size === optsNow.length;
          if(wasAll){
            temp.clear();
            optsNow.forEach(o => { if(o.value !== val) temp.add(o.value); });
          }
          if(cb.checked) temp.add(val); else temp.delete(val);
          if(temp.size === optsNow.length) temp.clear();
          syncChecks(panel, temp, optsNow);
        };
      });
      panel.querySelector('.cancel').onclick = () => closeAll();
      panel.querySelector('.ok').onclick = () => {
        const optsNow = optionsOf(select);
        Array.from(select.options).forEach(o => { o.selected = false; });
        if(temp.size > 0 && temp.size < optsNow.length){
          Array.from(select.options).forEach(o => { o.selected = temp.has(String(o.value)); });
        }
        setButtonText(wrap, select, id);
        closeAll();
        select.dispatchEvent(new Event('change', { bubbles:true }));
        if(typeof window.renderProfit === 'function') window.renderProfit();
      };
      positionDown(btn, panel);
      setTimeout(() => { try{ search.focus({preventScroll:true}); }catch(e){ search.focus(); } }, 0);
    }

    btn.onclick = (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      const opening = !panel.classList.contains('open');
      closeAll(panel);
      if(opening){
        wrap.classList.add('open');
        panel.classList.add('open');
        renderPanel('', selectedValues(select));
        positionDown(btn, panel);
      }
    };
  }
  function refresh(){ FILTER_IDS.forEach(buildFilter); }
  function hookRender(){
    if(typeof window.renderProfit === 'function' && !window.renderProfit.__v7FilterHooked){
      const original = window.renderProfit;
      window.renderProfit = function(){
        const result = original.apply(this, arguments);
        requestAnimationFrame(refresh);
        return result;
      };
      window.renderProfit.__v7FilterHooked = true;
    }
  }
  document.addEventListener('click', function(ev){
    if(!ev.target.closest('.profit-v7-panel') && !ev.target.closest('#profitPage .profit-v7-dd')) closeAll();
  });
  window.addEventListener('resize', closeAll, { passive:true });
  function boot(){ hookRender(); refresh(); }
  document.addEventListener('DOMContentLoaded', function(){ requestAnimationFrame(boot); });
  window.addEventListener('load', function(){ setTimeout(boot,300); });
  requestAnimationFrame(boot);
void(boot, 2500);
})();


/* ===== final-exact-tab-router-hotfix ===== */

(function(){
  'use strict';

  const PAGE_BY_TAB = {
    gspn: 'gspnPage',
    sky: 'skyPage',
    profit: 'profitPage',
    cashTarget: 'cashTargetPage',
    analysis: 'analysisPage',
    analyses: 'analysisPage'
  };
  const VALID_TABS = ['gspn','sky','profit','cashTarget','analysis','analyses'];

  function byId(id){ return document.getElementById(id); }
  function normTab(tab){
    const t = String(tab || '').trim();
    if(t === 'cash' || t === 'cash-target' || t === 'cash_target') return 'cashTarget';
    if(t === 'analyses') return 'analysis';
    return VALID_TABS.includes(t) ? t : 'gspn';
  }

  function getTabFromSideButton(el){
    const txt = (el.textContent || '').toLowerCase();
    const oc = el.getAttribute('onclick') || '';
    if(oc.includes("'gspn'") || oc.includes('"gspn"') || txt.includes('gspn')) return 'gspn';
    if(oc.includes("'sky'") || oc.includes('"sky"') || txt.includes('sky tracking')) return 'sky';
    if(oc.includes("'profit'") || oc.includes('"profit"') || txt.includes('profitability')) return 'profit';
    if(oc.includes('openCashTargetTab') || oc.includes('cashTarget') || txt.includes('cash') || txt.includes('target')) return 'cashTarget';
    if(oc.includes("'analysis'") || oc.includes('"analysis"') || txt.includes('analyses') || txt.includes('analysis')) return 'analysis';
    return '';
  }

  function wireSideTabs(){
    document.querySelectorAll('.side-tab').forEach(el => {
      const tab = getTabFromSideButton(el);
      if(!tab) return;
      el.dataset.serviceTab = tab;
      el.onclick = function(ev){
        if(ev){ ev.preventDefault(); ev.stopPropagation(); }
        window.switchTab(tab);
        return false;
      };
    });
  }

  /* [dedup] orphan helper setActiveSideTab removed */

  /* [dedup] orphan helper hideAllPages removed */

  /* [dedup] orphan helper renderSelected removed */

  window.openCashTargetTab = function(){ return window.switchTab('cashTarget'); };

  function bootExactTabs(){
    wireSideTabs();
    let active = normTab(localStorage.getItem('serviceEyeActiveTab') || 'gspn');
    if(!byId(PAGE_BY_TAB[active])) active = 'gspn';
    window.switchTab(active);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootExactTabs);
  else bootExactTabs();
})();


/* ===== serviceEyeFinalCleanPatchV2Script ===== */

(function(){
  'use strict';
  const TABS={
    gspn:{title:'GSPN Tracking Cases',pageId:'gspnPage',inputId:'fileInput',files:['datagspn.xlsx','datagspn.xlsm','datagspn.xls','datagspn.xlsb','datagspn.csv'],sheet:'GSPN Cases Tracking'},
    sky:{title:'SKY Tracking Cases',pageId:'skyPage',inputId:'skyFileInput',files:['datasky.xlsx','datasky.xlsm','datasky.xls','datasky.xlsb','datasky.csv'],sheet:''},
    profit:{title:'Profitability & commission',pageId:'profitPage',inputId:'profitFileInput',files:['Profitability & commission.xlsx','Profitability & commission.xlsm','Profitability & commission.xls','Profitability & commission.xlsb','Profitability & commission.csv'],sheet:''},
    cashTarget:{title:'Cash & Target',pageId:'cashTargetPage',inputId:'cashTargetFileInput',manualOnly:true},
    preBooking:{title:'Pre_Booking',pageId:'preBookingPage',inputId:null,files:['Pre_Booking.xlsx'],sheet:'Pre_Booking',noHeaderTools:true,githubOnly:true},
    returnCases:{title:'Return Cases',pageId:'returnCasesPage',inputId:null,files:['Return Cases.xlsx'],sheet:'Return Cases',noHeaderTools:true,githubOnly:true},
    receivedDelivered:{title:'Received & Delivered',pageId:'receivedDeliveredPage',inputId:null,files:['Received_Delivered.xlsx','Received & Delivered.xlsx','Received and Delivered.xlsx','Received Delivered.xlsx','Received_and_Delivered.xlsx'],sheet:'Received_Delivered',noHeaderTools:true,githubOnly:true},
    dashboard:{title:'Dashboard',pageId:'dashboardPage',manualOnly:true,noHeaderTools:true,noNotice:true}
  };
  const OLD_CACHE=['serviceEyeProfitRowsCache_v5','serviceEyeRowsCache','serviceEyeSkyRowsCache','serviceEyeProfitabilityRowsCache','serviceEyeOnlineTabs_v58','serviceEyeOnlineTabs_v65'];
  const PRESENCE_KEY='serviceEyePresenceCleanV2';
  const PRESENCE_ID=sessionStorage.getItem('serviceEyePresenceCleanV2Id')||('p_'+Date.now()+'_'+Math.random().toString(36).slice(2));
  sessionStorage.setItem('serviceEyePresenceCleanV2Id',PRESENCE_ID);
  const $=id=>document.getElementById(id);
  const fmt=()=>new Date().toLocaleString();
  function clearCaches(){OLD_CACHE.forEach(k=>{try{localStorage.removeItem(k)}catch(e){}})}
  /* [dedup] orphan helper encodePath removed */
  async function cb(url, force){return await serviceDataUrl(url, !!force)}
  function rowsCount(tab){
    if(tab==='gspn')return Array.isArray(window.allRows)?window.allRows.length:0;
    if(tab==='sky')return Array.isArray(window.skyRows)?window.skyRows.length:0;
    if(tab==='profit')return Array.isArray(window.profitRows)?window.profitRows.length:0;
    if(tab==='cashTarget')return (Array.isArray(window.cashTargetRows)?window.cashTargetRows.length:0)+(Array.isArray(window.cashDailyRows)?window.cashDailyRows.length:0);
    if(tab==='preBooking')return Array.isArray(window.preBookingRows)?window.preBookingRows.length:0;
    return 0;
  }
  /* [dedup] orphan helper clearRows removed */
  function displaySourceLabel(tab,source){
    if(tab==='gspn') return source && String(source).indexOf('GitHub:')===0 ? 'GitHub fresh fetch' : 'Auto Sync';
    if(tab==='sky') return source && String(source).indexOf('GitHub:')===0 ? 'GitHub fresh fetch' : 'Auto Sync';
    if(tab==='profit') return source && String(source).indexOf('GitHub:')===0 ? 'GitHub fresh fetch' : 'Auto Sync';
    if(tab==='cashTarget') return source && String(source).indexOf('GitHub:')===0 ? 'Auto Sync' : 'Manual upload only';
    if(tab==='preBooking'||tab==='returnCases'||tab==='receivedDelivered') return 'Auto sync';
    return source;
  }
  function serviceV2ShouldStampUpdate(tab,state,source,msg){
    const src=String(source||''); const m=String(msg||'');
    if(window.__serviceV2RenderingSavedNotice) return false;
    if(state!=='success') return false;
    if(tab==='cashTarget') return src.indexOf('Manual upload:')===0 || src==='Manual upload';
    if(tab==='preBooking'||tab==='returnCases'||tab==='receivedDelivered') return src.indexOf('GitHub:')===0 || m.indexOf('Fresh data loaded')>=0 || m.indexOf('Auto sync')>=0;
    return src.indexOf('GitHub:')===0 || src.indexOf('Manual upload:')===0 || m.indexOf('Fresh data loaded')>=0 || m.indexOf('Manual data loaded')>=0;
  }
  function serviceV2ReadSaved(tab){try{return JSON.parse(localStorage.getItem('serviceV2Last_'+tab)||'null')}catch(e){return null}}
  function notice(tab,state,source,rows,msg){
    const c=TABS[tab], page=$(c.pageId); if(!page)return;
    if(c.noNotice){ const old=$('serviceV2Notice_'+tab); if(old) old.remove(); return; }
    let n=$('serviceV2Notice_'+tab);
    if(!n){n=document.createElement('div');n.id='serviceV2Notice_'+tab;n.className='service-v2-update-notice';const h=page.querySelector('header');(h?h.parentNode:page).insertBefore(n,h?h.nextSibling:page.firstChild)}
    const saved=serviceV2ReadSaved(tab);
    const shouldStamp=serviceV2ShouldStampUpdate(tab,state,source,msg);
    const time=shouldStamp?fmt():((saved&&saved.time)?saved.time:'-');
    const r=Number.isFinite(Number(rows))?Number(rows):rowsCount(tab);
    try{localStorage.setItem('serviceV2Last_'+tab,JSON.stringify({state,source,rows:r,time:time,msg:msg||''}))}catch(e){}
    const stateText=state==='error'?'Update failed':(state==='loading'?'Updating now':'Data updated');
    n.innerHTML='<span class="source '+(state==='error'?'state-error':state==='loading'?'state-loading':'')+'">'+c.title+' — '+stateText+'</span>'+
      '<span>Source: <b>'+(displaySourceLabel(tab,source)||'-')+'</b></span><span>Rows: <b>'+r+'</b></span><span>Last Update: <b>'+time+'</b></span>'+(msg?'<span>'+msg+'</span>':'');
  }
  function restoreNotice(tab){
    const c=TABS[tab], page=$(c.pageId); if(!page)return;
    let saved=serviceV2ReadSaved(tab);
    window.__serviceV2RenderingSavedNotice=true;
    try{
      if(saved) notice(tab,saved.state||'success',saved.source,saved.rows,saved.msg||'');
      else notice(tab,'loading',tab==='preBooking'?'GitHub: Pre_Booking.xlsx':(c.manualOnly?'Manual upload only':'GitHub + manual upload'),rowsCount(tab),'Waiting for data');
    } finally { window.__serviceV2RenderingSavedNotice=false; }
  }
  function ensureLogo(tab){
    if(tab!=='profit'&&tab!=='cashTarget')return;
    const src=document.querySelector('#gspnPage .logo-box img, #skyPage .logo-box img');
    const page=$(TABS[tab].pageId); if(!src||!page)return;
    let box=page.querySelector('header .logo-box');
    const brand=page.querySelector('header .brand');
    if(!box&&brand){box=document.createElement('div');box.className='logo-box';box.innerHTML='<img alt="SKY Distribution Logo">';brand.insertBefore(box,brand.firstChild)}
    const img=box&&box.querySelector('img'); if(img&&!img.getAttribute('src')) img.src=src.src;
  }
  function ensureTools(){
    Object.keys(TABS).forEach(tab=>{
      const c=TABS[tab], page=$(c.pageId); if(!page)return;
      ensureLogo(tab); if(c.noNotice){ const old=$('serviceV2Notice_'+tab); if(old) old.remove(); } else restoreNotice(tab);
      const header=page.querySelector('header'), actions=page.querySelector('header .header-actions'); if(!actions)return;
      if(c.noHeaderTools){ actions.innerHTML=''; return; }
      actions.classList.add('service-v2-tools');
      // ensure manual upload label exists and is visible
      let input=$(c.inputId);
      let label=input&&input.closest('label.upload');
      if(!input){input=document.createElement('input');input.type='file';input.id=c.inputId;input.accept='.xlsx,.xls,.xlsb,.csv'}
      if(!label){label=document.createElement('label');label.className='upload';label.textContent='Upload Excel manually';label.appendChild(input);actions.appendChild(label)}
      label.style.display='inline-flex'; label.classList.remove('github-source-lock'); input.disabled=false;
      if(!input.dataset.serviceV2Manual){input.dataset.serviceV2Manual='1';input.addEventListener('change',()=>{const name=input.files&&input.files[0]?input.files[0].name:'manual upload';clearCaches();notice(tab,'loading','Manual upload: '+name,0,'Processing file');setTimeout(()=>notice(tab,'success','Manual upload: '+name,rowsCount(tab),''),900);setTimeout(()=>notice(tab,'success','Manual upload: '+name,rowsCount(tab),''),2500)},true)}
      if(tab!=='cashTarget'&&!$('serviceV2Github_'+tab)){const b=document.createElement('button');b.type='button';b.id='serviceV2Github_'+tab;b.className='service-v2-btn';b.textContent='Refresh from GitHub';b.onclick=()=>{window.__serviceV2ManualRefresh=true;loadGithub(tab,{force:true});};actions.appendChild(b)}
      if(!actions.querySelector('.service-v2-visitors')){const v=document.createElement('span');v.className='service-v2-visitors';v.innerHTML=''; v.style.display='none';actions.insertBefore(v,actions.firstChild)}
    });
  }
  async function readRows(files,sheetName){
    let lastErr; for(const f of files){try{const res=await fetch(await cb(f, window.__serviceV2ForceRefresh),{cache:window.__serviceV2ForceRefresh?'no-store':'default'}); if(!res.ok)throw new Error(f+' HTTP '+res.status); const buf=await res.arrayBuffer(); let wb;if(/\.csv$/i.test(f)){wb=XLSX.read(new TextDecoder('utf-8').decode(buf),{type:'string',raw:true,cellDates:true})}else{wb=XLSX.read(new Uint8Array(buf),{type:'array',cellDates:true})} const sn=sheetName&&wb.SheetNames.includes(sheetName)?sheetName:wb.SheetNames[0];return{file:f,rows:XLSX.utils.sheet_to_json(wb.Sheets[sn],{defval:'',raw:true})}}catch(e){lastErr=e}}
    throw lastErr||new Error('No GitHub file loaded');
  }
  async function applyRows(tab,rows){
    if(tab==='gspn'){if(typeof window.setRows==='function')await window.setRows(rows);else{window.allRows=rows;try{allRows=rows}catch(e){}} try{window.render&&window.render()}catch(e){}}
    if(tab==='sky'){const out=typeof window.normalizeSkyRow==='function'?rows.map(window.normalizeSkyRow).filter(r=>r.Job_Number||r.IMEI||r.SerialNumber||r.Customer_Mobile||r.Customer_phone||r.Branch||r.Stage):rows;window.skyRows=out;try{skyRows=out}catch(e){} try{if(typeof window.saveSkyRowsToBrowser==='function') await window.saveSkyRowsToBrowser(rows)}catch(e){ } try{window.resetSkyFiltersToAll&&window.resetSkyFiltersToAll();window.refreshSkyFilters&&window.refreshSkyFilters();window.renderSky&&window.renderSky()}catch(e){}}
    if(tab==='profit'){if(typeof window.setProfitRows==='function')window.setProfitRows(rows);else{window.profitRows=rows;try{profitRows=rows}catch(e){}} try{window.renderProfit&&window.renderProfit()}catch(e){}}
  }
  async function loadGithub(tab){
    // Delegate to the final patch script if already registered, otherwise use readRows/applyRows above
    if(window.__finalGithubLoad && typeof window.__finalGithubLoad === 'function'){
      return window.__finalGithubLoad(tab);
    }
    const c=TABS[tab]; if(!c || c.manualOnly) return;
    const before=rowsCount(tab);
    notice(tab,'loading','GitHub',before,'Downloading fresh file');
    try{
      const got=await readRows(c.files,c.sheet);
      if(!got.rows||!got.rows.length) throw new Error('GitHub file loaded but contains 0 rows');
      await applyRows(tab,got.rows);
      notice(tab,'success','GitHub: '+got.file,rowsCount(tab)||got.rows.length,'Fresh data loaded by Auto sync');
    }catch(e){
      const kept=rowsCount(tab)||before;
      notice(tab,'error','GitHub',kept,kept>0?'GitHub not reachable — existing/manual data kept':((e&&e.message)||String(e)));
    }
  }
  async function loadAll(){for(const t of ['gspn','sky','profit'])await loadGithub(t)}
  function presenceRead(){try{return JSON.parse(localStorage.getItem(PRESENCE_KEY)||'{}')||{}}catch(e){return{}}}
  function presenceWrite(s){try{localStorage.setItem(PRESENCE_KEY,JSON.stringify(s))}catch(e){}}
  function heartbeat(){const now=Date.now(),s=presenceRead();Object.keys(s).forEach(k=>{if(now-(+s[k]||0)>18000)delete s[k]});s[PRESENCE_ID]=now;presenceWrite(s);const live=Math.max(1,Object.keys(s).length);document.querySelectorAll('.service-v2-visitors b').forEach(x=>x.textContent=live)}
  const oldSwitch=window.switchTab;
  if(typeof oldSwitch==='function' && !oldSwitch.__serviceV2){
    window.switchTab=function(tab){const r=oldSwitch.apply(this,arguments);setTimeout(()=>{ensureTools();heartbeat();},80);return r;};
    window.switchTab.__serviceV2=true;
  }
  window.reloadServiceEyeGithubExcelData=loadAll; window.autoLoadGSPNFromGitHub=()=>loadGithub('gspn'); window.autoLoadSKYFromGitHub=()=>loadGithub('sky'); window.autoLoadProfitFromGitHub=()=>loadGithub('profit');
  function boot(){ensureTools();heartbeat()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.addEventListener('load',()=>{boot();}); requestAnimationFrame(boot); (window._ivals=window._ivals||[]).push(setInterval(()=>{ensureTools();heartbeat()},20000)); window.addEventListener('storage',heartbeat); window.addEventListener('beforeunload',()=>{const s=presenceRead();delete s[PRESENCE_ID];presenceWrite(s)});
})();


/* ===== serviceEyeRefreshPersistenceFixV3 ===== */

(function(){
  'use strict';
  function count(tab){
    if(tab==='gspn') return Array.isArray(window.allRows) ? window.allRows.length : 0;
    if(tab==='sky') return Array.isArray(window.skyRows) ? window.skyRows.length : 0;
    return 0;
  }
  async function restoreSavedIfEmpty(tab){
    try{
      if(tab==='gspn' && count('gspn')===0 && typeof window.loadRowsFromBrowser==='function'){
        const raw = await window.loadRowsFromBrowser();
        if(Array.isArray(raw) && raw.length){
          if(typeof window.setRows==='function') await window.setRows(raw);
          else { window.allRows = raw; try{ allRows = raw; }catch(e){} }
          if(typeof window.render==='function') window.render();
        }
      }
      if(tab==='sky' && count('sky')===0 && typeof window.loadSkyRowsFromBrowser==='function'){
        const raw = await window.loadSkyRowsFromBrowser();
        if(Array.isArray(raw) && raw.length){
          const rows = typeof window.normalizeSkyRow==='function' ? raw.map(window.normalizeSkyRow).filter(function(r){return r.Job_Number||r.IMEI||r.SerialNumber||r.Customer_Mobile||r.Customer_phone||r.Branch||r.Stage;}) : raw;
          window.skyRows = rows; try{ skyRows = rows; }catch(e){}
          if(typeof window.refreshSkyFilters==='function') window.refreshSkyFilters();
          if(typeof window.renderSky==='function') window.renderSky();
        }
      }
    }catch(err){ }
  }
  const oldReload = window.reloadServiceEyeGithubExcelData;
  if(typeof oldReload === 'function'){
    /* [dedup] superseded reloadServiceEyeGithubExcelData definition removed (was L12555) */
  }
  const oldGspn = window.autoLoadGSPNFromGitHub;
  if(typeof oldGspn === 'function'){
    /* [dedup] superseded autoLoadGSPNFromGitHub definition removed (was L12563) */
  }
  const oldSky = window.autoLoadSKYFromGitHub;
  if(typeof oldSky === 'function'){
    /* [dedup] superseded autoLoadSKYFromGitHub definition removed (was L12567) */
  }
  window.addEventListener('load', function(){
    setTimeout(function(){ restoreSavedIfEmpty('gspn'); restoreSavedIfEmpty('sky'); }, 250);
    setTimeout(function(){ restoreSavedIfEmpty('gspn'); restoreSavedIfEmpty('sky'); }, 1800);
  });
})();


/* ===== serviceEyeFinalPatchV4Script ===== */

(function(){
  'use strict';
  const TABS={
    gspn:{title:'GSPN Tracking Cases',pageId:'gspnPage',inputId:'fileInput',files:['datagspn.xlsx'],sheet:'GSPN Cases Tracking',auto:true},
    sky:{title:'SKY Tracking Cases',pageId:'skyPage',inputId:'skyFileInput',files:['datasky.xlsx'],sheet:'',auto:true},
    profit:{title:'Profitability & commission',pageId:'profitPage',inputId:'profitFileInput',files:['Profitability & commission.xlsx'],sheet:'',auto:true},
    cashTarget:{title:'Cash & Target',pageId:'cashTargetPage',inputId:'cashTargetFileInput',manualOnly:true,auto:false},
    preBooking:{title:'Pre_Booking',pageId:'preBookingPage',inputId:null,files:['Pre_Booking.xlsx'],sheet:'Pre_Booking',noHeaderTools:true,githubOnly:true,auto:true},
    returnCases:{title:'Return Cases',pageId:'returnCasesPage',inputId:null,files:['Return Cases.xlsx'],sheet:'Return Cases',noHeaderTools:true,githubOnly:true,auto:true},
    receivedDelivered:{title:'Received & Delivered',pageId:'receivedDeliveredPage',inputId:null,files:['Received_Delivered.xlsx','Received & Delivered.xlsx','Received and Delivered.xlsx','Received Delivered.xlsx','Received_and_Delivered.xlsx'],sheet:'Received_Delivered',noHeaderTools:true,githubOnly:true,auto:true},
    dashboard:{title:'Dashboard',pageId:'dashboardPage',manualOnly:true,noHeaderTools:true,noNotice:true,auto:false},
    repairEfficiency:{title:'Repair Efficiency',pageId:'repairEfficiencyPage',inputId:null,files:['Repair Efficiency.xlsx','Repair_Efficiency.xlsx','RepairEfficiency.xlsx','repair_efficiency.xlsx','Repair efficiency.xlsx'],sheet:'Repair Efficiency',noHeaderTools:true,githubOnly:true,auto:true}
  };
  const AUTO_TABS=['gspn','sky','profit','preBooking','returnCases','receivedDelivered','repairEfficiency'];
  const WATCH_FILES={
    gspn:'datagspn.xlsx',
    sky:'datasky.xlsx',
    profit:'Profitability & commission.xlsx',
    preBooking:'Pre_Booking.xlsx',
    returnCases:'Return Cases.xlsx',
    receivedDelivered:['Received_Delivered.xlsx','Received & Delivered.xlsx','Received and Delivered.xlsx','Received Delivered.xlsx','Received_and_Delivered.xlsx'],
    repairEfficiency:['Repair Efficiency.xlsx','Repair_Efficiency.xlsx','RepairEfficiency.xlsx','repair_efficiency.xlsx','Repair efficiency.xlsx']
  };
  const $=id=>document.getElementById(id);
  const fmt=()=>new Date().toLocaleString();
  function rowsCount(tab){
    if(tab==='gspn')return Array.isArray(window.allRows)?window.allRows.length:0;
    if(tab==='sky')return Array.isArray(window.skyRows)?window.skyRows.length:0;
    if(tab==='profit')return Array.isArray(window.profitRows)?window.profitRows.length:0;
    if(tab==='cashTarget')return (Array.isArray(window.cashTargetRows)?window.cashTargetRows.length:0)+(Array.isArray(window.cashDailyRows)?window.cashDailyRows.length:0);
    if(tab==='preBooking')return Array.isArray(window.preBookingRows)?window.preBookingRows.length:0;
    if(tab==='returnCases')return Array.isArray(window.returnCasesRows)?window.returnCasesRows.length:0;
    if(tab==='receivedDelivered')return Array.isArray(window.receivedDeliveredRows)?window.receivedDeliveredRows.length:0;
    if(tab==='repairEfficiency')return Array.isArray(window.repairEfficiencyRows)?window.repairEfficiencyRows.length:0;
    return 0;
  }
  function displaySourceLabel(tab,source){
    if(tab==='cashTarget') return 'Manual upload only';
    if(tab==='dashboard') return 'From other tabs data';
    if(String(source||'').indexOf('GitHub:')===0) return 'Automatic from Github';
    return 'Auto Sync';
  }
  function readSaved(tab){try{return JSON.parse(localStorage.getItem('serviceV2Last_'+tab)||'null')}catch(e){return null}}
  function shouldStamp(tab,state,source,msg){
    if(window.__serviceV2RenderingSavedNotice) return false;
    if(state!=='success') return false;
    if(tab==='cashTarget') return String(source||'').indexOf('Manual upload')===0;
    if(tab==='dashboard') return false;
    return String(source||'').indexOf('GitHub:')===0 || String(msg||'').indexOf('Fresh data loaded')>=0;
  }
  function notice(tab,state,source,rows,msg){
    const c=TABS[tab]; if(!c) return;
    const page=$(c.pageId); if(!page) return;
    if(c.noNotice){ const old=$('serviceV2Notice_'+tab); if(old) old.remove(); return; }
    let n=$('serviceV2Notice_'+tab);
    if(!n){
      n=document.createElement('div'); n.id='serviceV2Notice_'+tab; n.className='service-v2-update-notice';
      const h=page.querySelector('header'); (h?h.parentNode:page).insertBefore(n,h?h.nextSibling:page.firstChild);
    }
    const saved=readSaved(tab);
    const stamp=shouldStamp(tab,state,source,msg);
    const time=stamp?fmt():((saved&&saved.time)?saved.time:'-');
    const r=Number.isFinite(Number(rows))?Number(rows):rowsCount(tab);
    try{localStorage.setItem('serviceV2Last_'+tab,JSON.stringify({state,source,rows:r,time,msg:msg||''}))}catch(e){}
    const stateText=state==='error'?'Update failed':(state==='loading'?'Updating now':'Data updated');
    n.className='service-v2-update-notice '+(state==='error'?'state-error':state==='loading'?'state-loading':'state-ok');
    n.innerHTML='<span class="source '+(state==='error'?'state-error':state==='loading'?'state-loading':'')+'">'+c.title+' — '+stateText+'</span>'+ 
      '<span>Source: <b>'+displaySourceLabel(tab,source)+'</b></span><span>Rows: <b>'+r.toLocaleString()+'</b></span><span>Last Update: <b>'+time+'</b></span>'+(msg?'<span>'+msg+'</span>':'');
  }
  function restoreNotice(tab){
    const c=TABS[tab], page=$(c.pageId); if(!c||!page) return;
    let saved=readSaved(tab);
    window.__serviceV2RenderingSavedNotice=true;
    try{
      if(saved) notice(tab,saved.state||'success',saved.source,saved.rows,saved.msg||'');
      else notice(tab,c.manualOnly?'success':'loading',c.manualOnly?'Manual upload only':'GitHub',rowsCount(tab),c.manualOnly?'Only Manual':'Waiting for data');
    }finally{window.__serviceV2RenderingSavedNotice=false;}
  }
  function removeDuplicateNotices(){
    Object.keys(TABS).forEach(function(tab){
      const id='serviceV2Notice_'+tab, page=$(TABS[tab].pageId);
      const list=[].slice.call(document.querySelectorAll('#'+id));
      if(list.length<2) return;
      const keep=list.find(n=>page&&page.contains(n))||list[0];
      list.forEach(n=>{if(n!==keep)n.remove();});
    });
  }
  async function readRows(files,sheetName,forceRefresh){
    if(!window.XLSX) throw new Error('XLSX library is not ready.');
    let lastErr;
    for(const f of files){
      try{
        if(forceRefresh && typeof window.serviceClearDataVersion==='function') window.serviceClearDataVersion(f);
        const url=typeof window.serviceDataUrl==='function' ? await window.serviceDataUrl(f, !!forceRefresh) : String(f).split('/').map(encodeURIComponent).join('/')+(forceRefresh?'?v='+Date.now():'');
        const res=await fetch(url,{cache:forceRefresh?'no-store':'no-cache'});
        if(!res.ok) throw new Error(f+' HTTP '+res.status);
        const buf=await res.arrayBuffer();
        const wb=/\.csv$/i.test(f) ? XLSX.read(new TextDecoder('utf-8').decode(buf),{type:'string',raw:true,cellDates:true}) : XLSX.read(new Uint8Array(buf),{type:'array',cellDates:true});
        const sn=(sheetName && wb.SheetNames.includes(sheetName)) ? sheetName : wb.SheetNames[0];
        return {file:f,rows:XLSX.utils.sheet_to_json(wb.Sheets[sn],{defval:'',raw:true})};
      }catch(e){ lastErr=e; }
    }
    throw lastErr || new Error('No GitHub file loaded');
  }
  async function applyRows(tab,rows){
    if(tab==='gspn'){
      if(typeof window.setRows==='function') await window.setRows(rows); else { window.allRows=rows; try{allRows=rows;}catch(e){} }
      try{ if(typeof window.render==='function') window.render(); }catch(e){}
    }else if(tab==='sky'){
      const out=typeof window.normalizeSkyRow==='function'?rows.map(window.normalizeSkyRow).filter(r=>r.Job_Number||r.IMEI||r.SerialNumber||r.Customer_Mobile||r.Customer_phone||r.Branch||r.Stage):rows;
      window.skyRows=out; try{skyRows=out;}catch(e){}
      try{ if(typeof window.refreshSkyFilters==='function') window.refreshSkyFilters(); if(typeof window.renderSky==='function') window.renderSky(); }catch(e){}
    }else if(tab==='profit'){
      if(typeof window.setProfitRows==='function') window.setProfitRows(rows); else { window.profitRows=rows; try{profitRows=rows;}catch(e){} }
      try{ if(typeof window.renderProfit==='function') window.renderProfit(); }catch(e){}
    }
    try{ if(typeof window.renderDashboardTables==='function') window.renderDashboardTables(); }catch(e){}
  }
  async function loadGithub(tab,opts){
    const c=TABS[tab]; if(!c||c.manualOnly||!c.auto) return false;
    const force=!!(opts&&opts.force);
    const before=rowsCount(tab);
    notice(tab,'loading','GitHub',before,'Downloading fresh file');
    try{
      const got=await readRows(c.files,c.sheet,force);
      if(!got.rows||!got.rows.length) throw new Error('GitHub file loaded but contains 0 rows');
      await applyRows(tab,got.rows);
      notice(tab,'success','GitHub: '+got.file,rowsCount(tab)||got.rows.length,'Fresh data loaded by Auto sync');
      return true;
    }catch(e){
      const kept=rowsCount(tab)||before;
      notice(tab,'error','GitHub',kept,kept>0?'GitHub not reachable — existing data kept':((e&&e.message)||String(e)));
      return false;
    }
  }
  async function loadKnownGithubTab(tab,force){
    if(tab==='cashTarget'){ notice('cashTarget','success','Manual upload only',rowsCount('cashTarget'),'Only Manual'); return false; }
    if(tab==='gspn'||tab==='sky'||tab==='profit') return await loadGithub(tab,{force:!!force});
    if(tab==='preBooking' && typeof window.loadPreBooking==='function') return await window.loadPreBooking(!!force);
    if(tab==='returnCases' && typeof window.loadReturnCases==='function') return await window.loadReturnCases(!!force);
    if(tab==='receivedDelivered' && typeof window.loadReceivedDelivered==='function') return await window.loadReceivedDelivered(!!force);
    if(tab==='repairEfficiency' && typeof window.loadRepairEfficiency==='function') return await window.loadRepairEfficiency(!!force);
    if(tab==='dashboard'){
      try{ if(typeof window.loadDashboardSources==='function') await window.loadDashboardSources(false); if(typeof window.renderDashboardTables==='function') window.renderDashboardTables(); }catch(e){}
      return true;
    }
    return false;
  }
  async function loadAllGithubTabs(force){
    for(const t of AUTO_TABS){ await loadKnownGithubTab(t,!!force); }
    await loadKnownGithubTab('dashboard',false);
  }
  function ensureManualUpload(tab){
    const c=TABS[tab], page=$(c.pageId); if(!page) return;
    const actions=page.querySelector('header .header-actions'); if(!actions) return;
    if(c.noHeaderTools){ actions.innerHTML=''; const old=$('serviceV2Notice_'+tab); if(old) old.remove(); return; }
    if(c.manualOnly){ restoreNotice(tab); return; }
    // Existing upload controls remain untouched for tabs that already have them; GitHub is primary source.
    const b=$('serviceV2Github_'+tab); if(b) b.onclick=function(){loadKnownGithubTab(tab,true);};
  }
  function ensureAll(){
    removeDuplicateNotices();
    Object.keys(TABS).forEach(function(tab){ ensureManualUpload(tab); if(!TABS[tab].noNotice) restoreNotice(tab); });
  }
  async function headVersion(file){
    try{
      const url=String(file).split('/').map(encodeURIComponent).join('/');
      const res=await fetch(url,{method:'HEAD',cache:'no-cache'});
      if(!res.ok) return null;
      return res.headers.get('etag')||res.headers.get('last-modified')||String(Date.now());
    }catch(e){ return null; }
  }
  async function checkGithubUpdates(){
    if(document.hidden || window.__githubRefreshInProgress) return;
    window.__githubVersionWatch = window.__githubVersionWatch || {};
    for(const tab of AUTO_TABS){
      const files=[].concat(WATCH_FILES[tab]||[]); if(!files.length) continue;
      var watchedFile='', v=null;
      for(const f of files){ v=await headVersion(f); if(v){watchedFile=f; break;} }
      if(!v || !watchedFile) continue;
      const watchKey=tab+'::'+watchedFile;
      if(!window.__githubVersionWatch[watchKey]){ window.__githubVersionWatch[watchKey]=v; continue; }
      if(window.__githubVersionWatch[watchKey]!==v){
        window.__githubVersionWatch[watchKey]=v;
        if(typeof window.serviceClearDataVersion==='function'){ files.forEach(function(f){try{window.serviceClearDataVersion(f);}catch(e){}}); }
        await loadKnownGithubTab(tab,true);
      }
    }
  }
  function scheduleInitialGithubLoad(){
    if(window.__githubImmediateFirstLoadDone) return;
    window.__githubImmediateFirstLoadDone=true;
    const active=(localStorage.getItem('serviceEyeActiveTab')||'gspn');
    let ordered=AUTO_TABS.slice();
    if(AUTO_TABS.includes(active)) ordered=[active].concat(AUTO_TABS.filter(t=>t!==active));
    const run=async function(){
      for(const t of ordered){ await loadKnownGithubTab(t,true); }
      await loadKnownGithubTab('dashboard',false);
      setTimeout(checkGithubUpdates,2000);
    };
    setTimeout(run,120);
  }
  window.__finalGithubLoad=loadGithub;
  window.loadKnownGithubTab=loadKnownGithubTab;
  window.reloadServiceEyeGithubExcelData=loadAllGithubTabs;
  window.refreshServiceEyeActiveGithubTab=function(tab,force){ return loadKnownGithubTab(tab||localStorage.getItem('serviceEyeActiveTab')||'gspn', force!==false); };
  window.autoLoadGSPNFromGitHub=function(force){return loadKnownGithubTab('gspn',!!force);};
  window.autoLoadSKYFromGitHub=function(force){return loadKnownGithubTab('sky',!!force);};
  window.autoLoadProfitFromGitHub=function(force){return loadKnownGithubTab('profit',!!force);};
  window.autoLoadCashTargetFromGitHub=function(){notice('cashTarget','success','Manual upload only',rowsCount('cashTarget'),'Only Manual');return Promise.resolve(false);};
  window.autoLoadReturnCasesFromGitHub=function(force){return loadKnownGithubTab('returnCases',!!force);};
  window.autoLoadReceivedDeliveredFromGitHub=function(force){return loadKnownGithubTab('receivedDelivered',!!force);};
  window.autoLoadDashboardFromGitHub=function(force){return loadKnownGithubTab('dashboard',!!force);};
  window.checkServiceEyeGithubUpdates=checkGithubUpdates;
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){ensureAll();scheduleInitialGithubLoad();},{once:true}); else {ensureAll();scheduleInitialGithubLoad();}
  window.addEventListener('load',function(){setTimeout(ensureAll,400);setTimeout(checkGithubUpdates,2500);});
  document.addEventListener('visibilitychange',function(){if(!document.hidden) checkGithubUpdates();});
  window.addEventListener('focus',function(){checkGithubUpdates();});
  (window._ivals=window._ivals||[]).push(setInterval(checkGithubUpdates,60*60*1000));
})();


/* ===== cleanupV5FreshData ===== */

(function(){
  'use strict';
  // ---- Force every fetch to bypass cache ----
  // The existing code already does this, but we add a global guard:
  // any fetch for our data files gets a fresh URL.
  const DATA_FILES = ['datagspn', 'datasky', 'Profitability', 'Profitability%20%26%20commission', 'Cash & Target', 'Cash%20%26%20Target', 'Cash and Target', 'Cash%20and%20Target', 'Cash_Target', 'cashTarget', 'cash_target', 'Pre_Booking', 'Return Cases', 'Return%20Cases', 'Received_Delivered', 'Received_Delivered.xlsx', 'Received and Delivered', 'Received%20and%20Delivered', 'Received & Delivered', 'Received%20%26%20Delivered', 'Repair Efficiency', 'Repair%20Efficiency', 'Repair_Efficiency', 'RepairEfficiency'];
  const originalFetch = window.fetch;
  window.fetch = function(url, options){
    try{
      if(typeof url === 'string' && DATA_FILES.some(f => url.includes(f))){
        // Add aggressive cache busting if not already present
        if(!url.includes('_cb=')){
          const sep = url.includes('?') ? '&' : '?';
          url = url + sep + '_cb=' + Date.now() + '_' + Math.random().toString(36).slice(2,8);
        }
        options = options || {};
        options.cache = 'no-store';
        options.headers = Object.assign({}, options.headers || {}, {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
      }
    }catch(e){}
    return originalFetch.call(this, url, options);
  };

  // ---- Clear ONLY truly stale localStorage data caches — not on every load ----
  // We only clear caches that are from old versions (v5 and below). v6 cache is kept.
  try{
    const STALE_KEYS = [
      'serviceEyeProfitRowsCache_v6',
      // 'serviceEyeGspnRowsCache',        // REMOVED: kept so GSPN data survives refresh
      'serviceEyeSkyRowsCache',
      'serviceEyeOnlineTabsLocalFallback_v2',
      'v57_presence'
    ];
    STALE_KEYS.forEach(k => { try{ localStorage.removeItem(k); }catch(e){} });
  }catch(e){}

  // ---- Always show a clear "Last Update" line per tab ----
  // The existing serviceV2Notice does this; we just make sure it's visible
  // and refresh format is human-friendly.
  function formatUpdateTime(d){
    d = d || new Date();
    const pad = n => String(n).padStart(2,'0');
    return pad(d.getDate()) + '/' + pad(d.getMonth()+1) + '/' + d.getFullYear() +
           ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }
  window.__formatLastUpdate = formatUpdateTime;


})();


/* ===== ultimatePasswordLockFinal ===== */

(function(){
  'use strict';
  window.requestProtectedTabAccess = function(){ return true; };
  ['gspn','sky','profit','cashTarget','analysis','analyses'].forEach(function(t){
    try { } catch(e) {}
  });
})();


/* ===== sky-final-queue-clean-script ===== */

(function(){
  const removedToken='__REMOVED_QUEUE__';
  const dWord='D'+'elivered';
  const BAD_WORDS=[dWord+'_Cases',dWord+' Cases',dWord,removedToken];
  function txt(v){return String(v??'').trim();}
  function bad(v){const t=txt(v).toLowerCase(); return BAD_WORDS.some(w=>t.includes(String(w).toLowerCase()));}
  function norm(k){return String(k||'').toLowerCase().replace(/[^a-z0-9]/g,'');}
  function val(r,k){ if(!r)return''; if(Object.prototype.hasOwnProperty.call(r,k))return r[k]; const nk=norm(k); const f=Object.keys(r).find(x=>norm(x)===nk); return f?r[f]:''; }
  function scrubRows(){
    try{ if(Array.isArray(window.skyRows)) window.skyRows=window.skyRows.filter(r=>!bad(val(r,'Queue'))); }catch(e){}
    try{ if(Array.isArray(window.currentSkyRows)) window.currentSkyRows=window.currentSkyRows.filter(r=>!bad(val(r,'Queue'))); }catch(e){}
  }
  function removeContainer(el){
    if(!el) return;
    const card=el.closest&&el.closest('.card,.v54-card,.v52-card,.v53-card,.v57-card,.v58-card');
    if(card){card.remove(); return;}
    const section=el.closest&&el.closest('section,.chart-card');
    if(section && bad(section.textContent)) section.remove();
  }
  function scrubDom(){
    scrubRows();
    document.querySelectorAll('#skyPage option').forEach(o=>{ if(bad(o.value)||bad(o.textContent)) o.remove(); });
    document.querySelectorAll('#skyPage [id*="'+dWord+'"],#skyPage [data-export-key*="'+dWord.toLowerCase()+'"]').forEach(removeContainer);
    document.querySelectorAll('#skyPage .card,#skyPage .v54-card,#skyPage .v57-card,#skyPage .v58-card').forEach(el=>{ if(bad(el.textContent)) el.remove(); });
    document.querySelectorAll('#skyPage .sky-chart-chip,#skyPage th,#skyPage td,#skyPage h2,#skyPage label,#skyPage button').forEach(el=>{ if(bad(el.textContent)) removeContainer(el); });
    try{
      if(window.dashboardCharts){ Object.entries(window.dashboardCharts).forEach(([id,ch])=>{ if(id&&bad(id)){try{ch.destroy()}catch(e){} delete window.dashboardCharts[id]; return;} if(ch&&ch.data&&Array.isArray(ch.data.datasets)){ ch.data.datasets=ch.data.datasets.filter(ds=>!bad(ds.label)); if(Array.isArray(ch.data.labels)) ch.data.labels=ch.data.labels.filter(l=>!bad(l)); try{ch.update()}catch(e){} } }); }
    }catch(e){}
  }
  const oldRender=window.renderSky;
  window.renderSky=function(){ scrubRows(); const res=typeof oldRender==='function'?oldRender.apply(this,arguments):undefined; requestAnimationFrame(scrubDom); return res; };
  const oldUpdate=window.updateSkyCharts;
  window.updateSkyCharts=function(){ scrubRows(); const res=typeof oldUpdate==='function'?oldUpdate.apply(this,arguments):undefined; requestAnimationFrame(scrubDom); return res; };
  document.addEventListener('DOMContentLoaded',()=>{ setTimeout(scrubDom,700); });
  window.addEventListener('load',()=>{ setTimeout(scrubDom,900); });
  requestAnimationFrame(scrubDom);
void(scrubDom,2000);
})();


/* ===== visual-polish-lightweight-script ===== */

(function(){
  "use strict";
  if (window.__dashboardVisualPolishLoaded) return;
  window.__dashboardVisualPolishLoaded = true;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function buildStatusPackman(){
    const wrapper = document.createElement('span');
    wrapper.className = 'dashboard-status-packman';
    wrapper.innerHTML = `
      <span class="dashboard-live-pill">Live Data</span>
      <span class="dashboard-packman-loader" aria-hidden="true">
        <span class="packman"></span>
        <span class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>
      </span>`;
    return wrapper;
  }

  function addLivePill(){
    document.querySelectorAll('#dashboardStatusPackman, .header-actions > .dashboard-status-packman').forEach(el => el.remove());
    document.querySelectorAll('.page-shell > header, #gspnPage > header, #skyPage > header, #profitPage > header, #analysisPage > header').forEach((header, index) => {
      if (!header || header.querySelector(':scope > .dashboard-status-packman')) return;
      const wrapper = buildStatusPackman();
      wrapper.id = 'dashboardStatusPackman_' + index;
      header.appendChild(wrapper);
    });
  }

  function splitNumberText(text){
    const raw = String(text || '').trim();
    const match = raw.match(/^([^0-9\-+]*)([-+]?\d[\d]*(?:\.\d+)?)(.*)$/);
    if (!match) return null;
    const value = Number(match[2].replace(/,/g,''));
    if (!Number.isFinite(value)) return null;
    if (Math.abs(value) > 999999999999) return null;
    return { prefix: match[1], value, suffix: match[3], decimals: (match[2].split('.')[1] || '').length };
  }

  function formatNumber(n, decimals){
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  function animateValue(el){
    if (reduceMotion || !el || el.dataset.visualCounting === '1') return;
    const current = el.textContent || '';
    if (el.dataset.visualLastValue === current) return;
    const parsed = splitNumberText(current);
    if (!parsed) return;

    el.dataset.visualCounting = '1';
    el.dataset.visualLastValue = current;
    const card = el.closest('.card');
    if (card) card.classList.add('is-counting');

    const duration = 520;
    const startTime = performance.now();
    const target = parsed.value;
    const start = Math.abs(target) > 100 ? target * 0.82 : 0;

    function step(now){
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = start + (target - start) * eased;
      el.textContent = parsed.prefix + formatNumber(value, parsed.decimals) + parsed.suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = current;
        el.dataset.visualCounting = '0';
        if (card) card.classList.remove('is-counting');
      }
    }
    requestAnimationFrame(step);
  }

  function animateCards(){ document.querySelectorAll('.card .value').forEach(animateValue); }

  function initVisualPolish(){ addLivePill(); animateCards(); }

  let timer = null;
  function schedule(){ clearTimeout(timer); timer = setTimeout(initVisualPolish, 180); }

  document.addEventListener('DOMContentLoaded', function(){
    initVisualPolish();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
  });
  window.addEventListener('load', function(){ setTimeout(initVisualPolish, 250); });
})();


/* ===== userRequestSidebarRefreshPatchScript ===== */

(function(){
  'use strict';

  /* [dedup] orphan helper visible removed */

  /* [dedup] orphan helper activeTab removed */

  /* [dedup] orphan helper refreshActiveTab removed */

  function removeRequestedUploadButtons(){
    ['gspnPage','skyPage','profitPage'].forEach(function(pageId){
      const page = document.getElementById(pageId);
      if(!page) return;
      page.querySelectorAll('header .header-actions label.upload').forEach(function(label){
        label.style.setProperty('display','none','important');
        label.style.setProperty('visibility','hidden','important');
        label.style.setProperty('opacity','0','important');
        label.style.setProperty('pointer-events','none','important');
      });
    });
  }

  function hideHeaderRefreshButtons(){
    ['serviceV2Github_gspn','serviceV2Github_sky','serviceV2Github_profit'].forEach(function(id){
      const btn = document.getElementById(id);
      if(!btn) return;
      btn.style.setProperty('display','none','important');
      btn.style.setProperty('visibility','hidden','important');
      btn.style.setProperty('opacity','0','important');
      btn.style.setProperty('pointer-events','none','important');
    });
  }

  function ensureSidebarRefreshButton(){
    // Legacy top refresh button removed. The single supported button is codexGithubRefreshBtn in the sidebar bottom area.
    const legacyBlock = document.getElementById('sidebarRefreshDataBlock');
    if (legacyBlock) legacyBlock.remove();
    const legacyBtn = document.getElementById('sidebarRefreshDataBtn');
    if (legacyBtn) legacyBtn.remove();
  }

  function applyPatch(){
    removeRequestedUploadButtons();
    hideHeaderRefreshButtons();
    ensureSidebarRefreshButton();
  }

  window.serviceEyeEnableRefreshDataButton = function(){
    applyPatch();
  };
  window.serviceEyeDisableRefreshDataButton = function(){
    const block = document.getElementById('sidebarRefreshDataBlock');
    if(block) block.style.display = 'none';
  };

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyPatch);
  else applyPatch();
  window.addEventListener('load', function(){ setTimeout(applyPatch, 500); });
})();


/* ===== serviceV2RealUpdateTimeHardGuard ===== */

(function(){
  'use strict';
  var realKeys=['gspn','sky','profit','cashTarget'];
  function read(tab){try{return JSON.parse(localStorage.getItem('serviceV2Last_'+tab)||'null')}catch(e){return null}}
  function sourceLabel(tab,source){
    if(tab==='gspn' || tab==='sky' || tab==='profit') return 'Auto Sync';
    if(tab==='cashTarget') return source && String(source).indexOf('GitHub:')===0 ? 'Auto Sync' : 'Manual upload only';
    return source || '-';
  }
  window.serviceV2RenderSavedNoticesWithoutStamp=function(){
    window.__serviceV2RenderingSavedNotice=true;
    try{
      realKeys.forEach(function(tab){
        var saved=read(tab);
        var el=document.getElementById('serviceV2Notice_'+tab);
        if(!el) return;
        var sourceB=el.querySelector('span:nth-child(2) b');
        if(sourceB) sourceB.textContent=sourceLabel(tab, saved && saved.source);
        var timeB=el.querySelector('span:nth-child(4) b');
        if(timeB) timeB.textContent=(saved && saved.time) ? saved.time : '-';
      });
    }finally{ window.__serviceV2RenderingSavedNotice=false; }
  };
  (window._ivals=window._ivals||[]).push(setInterval(window.serviceV2RenderSavedNoticesWithoutStamp, 10000));
})();



/* [dedup] removed superseded module: inline-script-83 */


/* [dedup] removed superseded module: perf-switchTab-render-guards */


/* [dedup] removed superseded module: perf-renderSky-guard */


/* [dedup] removed superseded module: perf-updateSkyCharts-guard */

/* ===== inline-script-87 ===== */

/* ══ Firebase SDK loader — async so it never blocks page paint ══
   Resolves window.__firebaseReady promise once all Firebase SDKs are loaded.
   The auth script below awaits this before calling initFirebase().      */
(function(){
  var resolve;
  window.__firebaseReady = new Promise(function(res){ resolve = res; });
  var loaded = 0;
  function onLoad(){ if(++loaded === 4) resolve(); }
  ['firebase-app-compat.js','firebase-auth-compat.js','firebase-firestore-compat.js','firebase-database-compat.js'].forEach(function(file){
    var s = document.createElement('script');
    s.src = 'https://www.gstatic.com/firebasejs/10.12.5/' + file;
    s.async = true;
    s.onload = onLoad;
    document.head.appendChild(s);
  });
})();


/* ===== firebase-user-management-script ===== */

(function(){
  'use strict';
  const firebaseConfig = {
    apiKey: "AIzaSyBP_THgBY6vL1cj1OxAG1ldC3GeKS-5mBQ",
    authDomain: "service-support-center-f44f0.firebaseapp.com",
    databaseURL: "https://service-support-center-f44f0-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "service-support-center-f44f0",
    storageBucket: "service-support-center-f44f0.firebasestorage.app",
    messagingSenderId: "750313102449",
    appId: "1:750313102449:web:3a5ce577a52a4d067dcfd0"
  };
  const TABS = [
    {key:'dashboard',  title:'Dashboard',                pageId:'dashboardPage'},
    {key:'gspn',       title:'GSPN Tracking Cases',       pageId:'gspnPage'},
    {key:'sky',        title:'SKY Tracking Cases',        pageId:'skyPage'},
    {key:'preBooking', title:'Pre_Booking',              pageId:'preBookingPage'},
    {key:'returnCases', title:'Return Cases',           pageId:'returnCasesPage'},
    {key:'receivedDelivered', title:'Received & Delivered', pageId:'receivedDeliveredPage'},
    {key:'repairEfficiency', title:'Repair Efficiency', pageId:'repairEfficiencyPage'},
    {key:'profit',     title:'Profitability & commission', pageId:'profitPage'},
    {key:'cashTarget', title:'Cash & Target',             pageId:'cashTargetPage'}
  ];
  const TAB_KEY_BY_TITLE = Object.fromEntries(TABS.map(t=>[t.title,t.key]));
  const ADMIN_TAB = {key:'userManagement', title:'User Management', pageId:'userManagementPage'};
  const SECURITY_TAB = {key:'security', title:'Security', pageId:'securityPage'};

  /* ── State ── */
  let app, auth, db, rtdb, currentProfile = null, unsubscribeUsers = null;
  let presenceUserRef = null, presenceTimer = null, unsubscribePresence = null;
  let firebasePersistenceReady = Promise.resolve();

  /* ── Profile Cache (Auth-only — no Firestore on reload) ── */
  const CACHE_KEY = 'ssc_profile_v3';
  const CACHE_TTL = 24 * 60 * 60 * 1000;
  const VALID_ROLES = ['ADMIN','MANAGER','VIEWER'];

  function saveCache(p){
    try{
      const safe = {id:p.id,email:p.email,username:p.username,role:p.role,active:p.active,allowedTabs:p.allowedTabs||null};
      const d = JSON.stringify({profile:safe,ts:Date.now()});
      sessionStorage.setItem(CACHE_KEY,d); localStorage.setItem(CACHE_KEY,d);
    }catch(e){}
  }
  function loadCache(email){
    try{
      const raw = sessionStorage.getItem(CACHE_KEY)||localStorage.getItem(CACHE_KEY);
      if(!raw) return null;
      const {profile:p,ts} = JSON.parse(raw);
      if(!p||!ts) return null;
      if(Date.now()-ts > CACHE_TTL){ clearCache(); return null; }
      if(email && p.email && p.email.toLowerCase() !== email.toLowerCase()){ clearCache(); return null; }
      if(p.active !== true){ clearCache(); return null; }
      if(!VALID_ROLES.includes(String(p.role||'').toUpperCase())){ clearCache(); return null; }
      return p;
    }catch(e){ clearCache(); return null; }
  }
  function clearCache(){
    try{ sessionStorage.removeItem(CACHE_KEY); localStorage.removeItem(CACHE_KEY); }catch(e){}
  }

  /* ── Helpers ── */
  const $ = id => document.getElementById(id);
  const norm = v => String(v||'').trim();
  const lower = v => norm(v).toLowerCase();
  const esc = v => norm(v).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));
  function docIdForEmail(e){ return lower(e).replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')||'user'; }
  function isAdmin()   { return currentProfile && String(currentProfile.role).toUpperCase()==='ADMIN'; }
  function isManager() { return currentProfile && String(currentProfile.role).toUpperCase()==='MANAGER'; }
  function isViewer()  { return currentProfile && String(currentProfile.role).toUpperCase()==='VIEWER'; }

  /* ── Admin-only browser actions guard ──
     Blocks common source/devtools actions for non-admin users only.
     Admin users keep right click, F12 and Ctrl+U enabled after authentication. */
  function installAdminOnlyBrowserActionGuard(){
    if(window.__sscAdminOnlyBrowserActionGuardInstalled) return;
    window.__sscAdminOnlyBrowserActionGuardInstalled = true;

    function adminAllowed(){
      try { return isAdmin() === true; } catch(e) { return false; }
    }

    function blockEvent(event){
      try {
        event.preventDefault();
        event.stopPropagation();
        if(typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
      } catch(e) {}
      return false;
    }

    document.addEventListener("contextmenu", function(event){
      if(adminAllowed()) return true;
      return blockEvent(event);
    }, true);

    document.addEventListener("keydown", function(event){
      if(adminAllowed()) return true;

      const key = String(event.key || "").toLowerCase();
      const code = event.keyCode || event.which;

      const blocked =
        code === 123 ||                                      // F12
        (event.ctrlKey && key === "u") ||                    // Ctrl+U
        (event.ctrlKey && event.shiftKey && key === "i") ||  // Ctrl+Shift+I
        (event.ctrlKey && event.shiftKey && key === "j") ||  // Ctrl+Shift+J
        (event.ctrlKey && event.shiftKey && key === "c") ||  // Ctrl+Shift+C
        (event.ctrlKey && event.shiftKey && key === "k");    // Ctrl+Shift+K / Firefox console

      if(blocked) return blockEvent(event);
      return true;
    }, true);
  }
  installAdminOnlyBrowserActionGuard();

  function allowedKeys(profile){
    if(!profile) return [];
    const role = String(profile.role).toUpperCase();
    if(role==='ADMIN') return TABS.map(t=>t.key).concat([ADMIN_TAB.key, SECURITY_TAB.key]);
    if(role==='MANAGER'){
      const list = Array.isArray(profile.allowedTabs) && profile.allowedTabs.length ? profile.allowedTabs : null;
      if(!list) return TABS.map(t=>t.key);
      return list.map(x=>TAB_KEY_BY_TITLE[x]||x).filter(Boolean);
    }
    return (Array.isArray(profile.allowedTabs)?profile.allowedTabs:[]).map(x=>TAB_KEY_BY_TITLE[x]||x).filter(Boolean);
  }
  function canOpen(key){ return !!(currentProfile && allowedKeys(currentProfile).includes(key)); }
  function setMsg(el,msg,ok){ if(!el) return; el.className='um-msg '+(ok?'ok':'err'); el.textContent=msg; }
  function showLoginError(msg){ const e=$('fbLoginError'); if(e){ e.style.display='block'; e.textContent=msg; } }
  function clearOldLocalAuth(){ try{ ['serviceEyeSession','serviceEyeCurrentUser'].forEach(k=>{ localStorage.removeItem(k); sessionStorage.removeItem(k); }); }catch(e){} }
  function formatDate(v){ try{ if(!v) return ''; if(v.toDate) v=v.toDate(); const d=new Date(v); return isNaN(d)?'':d.toLocaleString(); }catch(e){ return ''; } }

  /* ── Firebase init ── */
  function initFirebase(){
    if(!window.firebase) throw new Error('Firebase SDK failed to load.');
    app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    rtdb = firebase.database();
    try{ firebasePersistenceReady = auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); }catch(e){ firebasePersistenceReady = Promise.resolve(); }
    window.firebaseSSC = {app, auth, db, rtdb, getCurrentProfile:()=>currentProfile, isAdmin};
  }

  /* ── Firestore profile (used only on first login & background refresh) ── */
  async function loadProfileFromFirestore(email){
    const q = await db.collection('users').where('email','==',email).limit(1).get();
    if(q.empty) throw new Error('No permission profile found for this email. Please contact your administrator.');
    const d = q.docs[0]; const p = Object.assign({id:d.id}, d.data());
    if(p.active !== true) throw new Error('This user is disabled. Please contact ADMIN.');
    p.role = String(p.role||'VIEWER').toUpperCase();
    saveCache(p);
    return p;
  }

  async function updateLastLogin(profile){
    try{
      if(!profile||!profile.id) return;
      await db.collection('users').doc(profile.id).update({lastLogin: firebase.firestore.FieldValue.serverTimestamp()});
    }catch(e){}
  }

  /* ── Security Center: data health, maintenance mode, and activity log ── */
  const SECURITY_DATA_SOURCES = [
    {name:'GSPN', json:'data/gspn.json', excel:'datagspn.xlsx'},
    {name:'SKY', json:'data/sky.json', excel:'datasky.xlsx'},
    {name:'Pre_Booking', json:'data/pre_booking.json', excel:'Pre_Booking.xlsx'},
    {name:'Profitability & commission', json:'data/profitability_commission.json', excel:'Profitability & commission.xlsx'},
    {name:'Received & Delivered', json:'data/received_delivered.json', excel:'Received_Delivered.xlsx'},
    {name:'Return Cases', json:'data/return_cases.json', excel:'Return Cases.xlsx'},
    {name:'Repair Efficiency', json:'data/repair_efficiency.json', excel:'Repair Efficiency.xlsx'}
  ];
  let securityActivityUnsub = null;
  let securityMaintenanceUnsub = null;
  let currentMaintenanceState = {enabled:false,message:''};

  function securityTime(v){
    try{
      if(!v) return '';
      const d = v.toDate ? v.toDate() : new Date(Number(v) || v);
      return isNaN(d) ? '' : d.toLocaleString();
    }catch(e){ return ''; }
  }
  function securityJsonRowCount(data){
    try{
      if(Array.isArray(data)) return data.length;
      if(data && data.sheets){
        return Object.values(data.sheets).reduce((a,v)=>a+(Array.isArray(v)?v.length:0),0);
      }
      if(data && Array.isArray(data.rows)) return data.rows.length;
    }catch(e){}
    return 0;
  }
  function logSecurityActivity(action, details){
    try{
      if(!rtdb || !currentProfile) return;
      rtdb.ref('security/activityLog').push({
        ts: firebase.database.ServerValue.TIMESTAMP,
        userId: currentProfile.id || '',
        username: currentProfile.username || currentProfile.email || 'User',
        email: currentProfile.email || '',
        role: currentProfile.role || '',
        tab: window.__fbActiveTabKey || localStorage.getItem('serviceEyeActiveTab') || '',
        action: action || 'Activity',
        details: details || ''
      });
    }catch(e){}
  }
  window.sscLogActivity = logSecurityActivity;

  function renderSecurityMaintenanceCard(){
    const on = !!(currentMaintenanceState && currentMaintenanceState.enabled);
    const msg = (currentMaintenanceState && currentMaintenanceState.message) || 'Dashboard is under maintenance. Please try again later.';
    const status = $('secMaintenanceStatus'), note = $('secMaintenanceNote'), title = $('securityMaintenanceTitle'), desc = $('securityMaintenanceDesc'), input = $('securityMaintenanceMessage'), btn = $('securityMaintenanceToggle');
    if(status) status.textContent = on ? 'On' : 'Off';
    if(note) note.textContent = on ? 'Users are blocked by maintenance overlay' : 'Normal user access enabled';
    if(title) title.textContent = on ? 'Maintenance is ON' : 'Maintenance is OFF';
    if(desc) desc.textContent = on ? msg : 'Users can access the dashboard normally.';
    if(input && !input.value) input.value = msg;
    if(btn){ btn.textContent = on ? 'Disable Maintenance' : 'Enable Maintenance'; btn.classList.toggle('danger', !on); }
  }

  function applyMaintenanceState(state){
    currentMaintenanceState = state || {enabled:false,message:''};
    let overlay = document.getElementById('securityMaintenanceOverlay');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.id = 'securityMaintenanceOverlay';
      overlay.innerHTML = '<div class="security-maintenance-card"><h2>Maintenance Mode</h2><p id="securityMaintenanceOverlayMsg"></p></div>';
      document.body.appendChild(overlay);
    }
    const enabled = !!currentMaintenanceState.enabled;
    const msg = currentMaintenanceState.message || 'Dashboard is under maintenance. Please try again later.';
    const m = document.getElementById('securityMaintenanceOverlayMsg'); if(m) m.textContent = msg;
    overlay.style.display = enabled && !isAdmin() ? 'flex' : 'none';
    renderSecurityMaintenanceCard();
  }

  function listenMaintenance(){
    try{
      if(!rtdb || securityMaintenanceUnsub) return;
      const ref = rtdb.ref('security/maintenance');
      securityMaintenanceUnsub = ref.on('value', snap=>applyMaintenanceState(snap.val() || {enabled:false,message:''}));
    }catch(e){}
  }

  window.toggleMaintenanceMode = async function(){
    try{
      if(!isAdmin() || !rtdb) return;
      const msgEl = $('securityMaintenanceMessage');
      const next = !currentMaintenanceState.enabled;
      const message = (msgEl && msgEl.value.trim()) || 'Dashboard is under maintenance. Please try again later.';
      await rtdb.ref('security/maintenance').set({enabled:next,message:message,updatedAt:firebase.database.ServerValue.TIMESTAMP,updatedBy:currentProfile.email||currentProfile.username||'ADMIN'});
      logSecurityActivity(next ? 'Maintenance enabled' : 'Maintenance disabled', message);
    }catch(e){ alert('Maintenance update failed: ' + (e && e.message ? e.message : e)); }
  };

  window.refreshSecurityHealth = async function(){
    if(!isAdmin()) return;
    const tbl = $('securityHealthTable');
    const status = $('secHealthStatus'), note = $('secHealthNote');
    if(tbl) tbl.innerHTML = '<tbody><tr><td>Checking files...</td></tr></tbody>';
    let okCount = 0;
    const rows = [];
    for(const src of SECURITY_DATA_SOURCES){
      let jsonStatus='Missing', excelStatus='Not checked', rowCount=0, generated='', source='';
      try{
        const r = await fetch(src.json + '?v=' + Date.now(), {cache:'no-store'});
        if(!r.ok) throw new Error('HTTP ' + r.status);
        const data = await r.json();
        jsonStatus='OK'; okCount++;
        rowCount = securityJsonRowCount(data);
        generated = data && data.generated_at ? data.generated_at : '';
        source = data && data.source_file ? data.source_file : src.excel;
      }catch(e){ jsonStatus = 'Error'; }
      try{
        const ex = await fetch(src.excel + '?v=' + Date.now(), {method:'HEAD', cache:'no-store'});
        excelStatus = ex.ok ? 'OK' : ('HTTP ' + ex.status);
      }catch(e){ excelStatus = 'Error'; }
      rows.push({src,jsonStatus,excelStatus,rowCount,generated,source});
    }
    const allOk = okCount === SECURITY_DATA_SOURCES.length;
    if(status) status.textContent = allOk ? 'OK' : 'Warning';
    if(note) note.textContent = okCount + ' / ' + SECURITY_DATA_SOURCES.length + ' JSON files available';
    if(tbl){
      tbl.innerHTML = '<thead><tr><th>Source</th><th>JSON</th><th>Excel fallback</th><th>Rows</th><th>Generated at</th><th>Source file</th></tr></thead><tbody>' + rows.map(r=>{
        const cls = r.jsonStatus === 'OK' ? 'ok' : 'bad';
        const exCls = r.excelStatus === 'OK' ? 'ok' : 'warn';
        return '<tr><td>'+esc(r.src.name)+'</td><td><span class="sec-pill '+cls+'">'+esc(r.jsonStatus)+'</span></td><td><span class="sec-pill '+exCls+'">'+esc(r.excelStatus)+'</span></td><td>'+esc(r.rowCount)+'</td><td>'+esc(r.generated)+'</td><td>'+esc(r.source)+'</td></tr>';
      }).join('') + '</tbody>';
    }
    logSecurityActivity('Security health checked', okCount + '/' + SECURITY_DATA_SOURCES.length + ' JSON files OK');
  };

  function renderActivityRows(snap){
    if(!isAdmin()) return;
    const tbl = $('securityActivityTable');
    const count = $('secActivityCount');
    const raw = snap && snap.val ? snap.val() : {};
    const items = Object.keys(raw || {}).map(k=>Object.assign({id:k}, raw[k])).sort((a,b)=>(Number(b.ts||0)-Number(a.ts||0))).slice(0,80);
    if(count) count.textContent = items.length;
    if(tbl){
      tbl.innerHTML = items.length ? '<thead><tr><th>Time</th><th>User</th><th>Role</th><th>Tab</th><th>Action</th><th>Details</th></tr></thead><tbody>' + items.map(x=>'<tr><td>'+esc(securityTime(x.ts))+'</td><td>'+esc(x.username||x.email||'')+'</td><td>'+esc(x.role||'')+'</td><td>'+esc(x.tab||'')+'</td><td>'+esc(x.action||'')+'</td><td>'+esc(x.details||'')+'</td></tr>').join('') + '</tbody>' : '<tbody><tr><td>No activity recorded yet.</td></tr></tbody>';
    }
  }
  window.refreshSecurityActivity = function(){
    try{
      if(!isAdmin() || !rtdb) return;
      if(securityActivityUnsub) rtdb.ref('security/activityLog').off('value', securityActivityUnsub);
      securityActivityUnsub = rtdb.ref('security/activityLog').limitToLast(80).on('value', renderActivityRows);
    }catch(e){}
  };


  function secStatusPill(value, type){ return '<span class="sec-pill '+(type||'ok')+'">'+esc(value)+'</span>'; }
  function currentUserLabel(){ return (currentProfile && (currentProfile.username || currentProfile.email)) || 'User'; }
  function currentUserKey(){ return String((currentProfile && (currentProfile.id || currentProfile.email || currentProfile.username)) || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'') || 'user'; }
  function writeSecurityEvent(path, payload){
    try{
      if(!rtdb) return;
      rtdb.ref(path).push(Object.assign({
        ts: firebase.database.ServerValue.TIMESTAMP,
        userId: currentProfile && currentProfile.id || '',
        username: currentProfile && (currentProfile.username || currentProfile.email) || 'Unknown',
        email: currentProfile && currentProfile.email || '',
        role: currentProfile && currentProfile.role || '',
        tab: window.__fbActiveTabKey || localStorage.getItem('serviceEyeActiveTab') || ''
      }, payload || {}));
    }catch(e){}
  }
  function logSecurityAlert(action, details){ writeSecurityEvent('security/securityAlerts', {action:action||'Alert', details:details||'', severity:'warning'}); }

  window.refreshSystemHealth = async function(){
    if(!isAdmin()) return;
    const tbl=$('securitySystemHealthTable'), status=$('secSystemStatus'), note=$('secSystemNote');
    const checks=[];
    function add(name,state,detail){ checks.push({name,state,detail}); }
    add('Firebase Auth', !!auth ? 'OK' : 'Error', auth ? 'Auth object initialized' : 'Auth is not available');
    add('Firestore Users', !!db ? 'OK' : 'Error', db ? 'Firestore available for users/permissions' : 'Firestore is not available');
    add('Realtime Database', !!rtdb ? 'OK' : 'Error', rtdb ? 'Realtime Database available for security logs' : 'Realtime Database is not available');
    add('Current Admin Session', isAdmin() ? 'OK' : 'Error', currentProfile ? ((currentProfile.email||currentProfile.username||'')+' / '+(currentProfile.role||'')) : 'No profile loaded');
    add('Maintenance Mode', currentMaintenanceState && currentMaintenanceState.enabled ? 'Warning' : 'OK', currentMaintenanceState && currentMaintenanceState.enabled ? 'Maintenance is currently ON' : 'Maintenance is OFF');
    try{ const r=await fetch('data/gspn.json?v='+Date.now(),{cache:'no-store'}); add('JSON Fetch Test', r.ok?'OK':'Warning', 'data/gspn.json HTTP '+r.status); }catch(e){ add('JSON Fetch Test','Error',String(e&&e.message||e)); }
    const bad=checks.filter(x=>x.state==='Error').length, warn=checks.filter(x=>x.state==='Warning').length;
    if(status) status.textContent = bad ? 'Error' : (warn ? 'Warning' : 'OK');
    if(note) note.textContent = bad ? bad+' critical issue(s)' : (warn ? warn+' warning(s)' : 'All core services ready');
    if(tbl) tbl.innerHTML='<thead><tr><th>Service</th><th>Status</th><th>Details</th></tr></thead><tbody>'+checks.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+secStatusPill(x.state,x.state==='OK'?'ok':(x.state==='Warning'?'warn':'bad'))+'</td><td>'+esc(x.detail)+'</td></tr>').join('')+'</tbody>';
  };

  window.refreshPermissionAudit = async function(){
    if(!isAdmin() || !db) return;
    const tbl=$('securityPermissionAuditTable'), kpi=$('secPermissionStatus'), note=$('secPermissionNote');
    if(tbl) tbl.innerHTML='<tbody><tr><td>Reading users...</td></tr></tbody>';
    try{
      const snap=await db.collection('users').get();
      const users=[]; snap.forEach(doc=>users.push(Object.assign({id:doc.id},doc.data()||{})));
      const risky=[];
      users.forEach(u=>{
        const role=String(u.role||'').toUpperCase(); const tabs=Array.isArray(u.allowedTabs)?u.allowedTabs:[];
        if(u.active===false) risky.push({user:u, issue:'Inactive account', level:'warn'});
        if(role!=='ADMIN' && tabs.some(t=>String(t).toLowerCase().includes('user management') || String(t)==='userManagement')) risky.push({user:u, issue:'Non-admin has User Management access', level:'bad'});
        if(role!=='ADMIN' && tabs.some(t=>String(t).toLowerCase().includes('security') || String(t)==='security')) risky.push({user:u, issue:'Non-admin has Security access', level:'bad'});
        if(role!=='ADMIN' && (!tabs.length)) risky.push({user:u, issue:'No allowed tabs configured', level:'warn'});
        if(!role) risky.push({user:u, issue:'Missing role', level:'bad'});
      });
      if(kpi) kpi.textContent=users.length;
      if(note) note.textContent=risky.length+' permission finding(s)';
      if(tbl) tbl.innerHTML='<thead><tr><th>User</th><th>Email</th><th>Role</th><th>Allowed Tabs</th><th>Audit Result</th></tr></thead><tbody>'+users.map(u=>{
        const findings=risky.filter(r=>r.user.id===u.id); const issue=findings.map(f=>f.issue).join(' | ')||'OK'; const type=findings.some(f=>f.level==='bad')?'bad':(findings.length?'warn':'ok');
        return '<tr><td>'+esc(u.username||'')+'</td><td>'+esc(u.email||'')+'</td><td>'+esc(u.role||'')+'</td><td>'+esc((u.allowedTabs||[]).join(', '))+'</td><td>'+secStatusPill(issue,type)+'</td></tr>';
      }).join('')+'</tbody>';
    }catch(e){ if(tbl) tbl.innerHTML='<tbody><tr><td>Permission audit failed: '+esc(e&&e.message||e)+'</td></tr></tbody>'; }
  };

  const VALIDATION_RULES = {
    'GSPN': ['GSPN_Branch','SO NO#','GSPN_Status'],
    'SKY': ['Queue','Branch','Aging Days'],
    'Pre_Booking': ['Branch'],
    'Profitability & commission': ['Branch'],
    'Received & Delivered': ['Branch','Employee'],
    'Return Cases': ['Branch'],
    'Repair Efficiency': ['Branch']
  };
  function rowsFromJsonPayload(data){
    if(Array.isArray(data)) return data;
    if(data && Array.isArray(data.rows)) return data.rows;
    if(data && data.sheets){ const first=Object.values(data.sheets).find(Array.isArray); return first || []; }
    return [];
  }
  function hasAnyKey(row, wanted){
    const keys=Object.keys(row||{}).map(k=>String(k).toLowerCase().replace(/[^a-z0-9]/g,''));
    return wanted.some(w=>keys.includes(String(w).toLowerCase().replace(/[^a-z0-9]/g,'')));
  }
  window.refreshDataValidation = async function(){
    if(!isAdmin()) return;
    const tbl=$('securityDataValidationTable'); if(tbl) tbl.innerHTML='<tbody><tr><td>Validating JSON files...</td></tr></tbody>';
    const output=[];
    for(const src of SECURITY_DATA_SOURCES){
      try{
        const r=await fetch(src.json+'?v='+Date.now(),{cache:'no-store'}); if(!r.ok) throw new Error('HTTP '+r.status);
        const data=await r.json(); const rows=rowsFromJsonPayload(data); const req=VALIDATION_RULES[src.name]||[];
        let missingCols=[]; req.forEach(col=>{ if(rows.length && !hasAnyKey(rows[0], [col])) missingCols.push(col); });
        let blankCritical=0;
        rows.slice(0,5000).forEach(row=>{ if(req.some(col=>!hasAnyKey(row,[col]) || Object.keys(row).some(k=>String(k).toLowerCase().replace(/[^a-z0-9]/g,'')===String(col).toLowerCase().replace(/[^a-z0-9]/g,'') && (row[k]===''||row[k]==null)))) blankCritical++; });
        output.push({name:src.name, rows:rows.length, status:missingCols.length?'Warning':'OK', details:missingCols.length?'Missing columns: '+missingCols.join(', '):(blankCritical?blankCritical+' rows may have blank critical values':'Structure looks valid')});
      }catch(e){ output.push({name:src.name, rows:0, status:'Error', details:e&&e.message||String(e)}); }
    }
    if(tbl) tbl.innerHTML='<thead><tr><th>Dataset</th><th>Status</th><th>Rows</th><th>Validation Details</th></tr></thead><tbody>'+output.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+secStatusPill(x.status,x.status==='OK'?'ok':(x.status==='Warning'?'warn':'bad'))+'</td><td>'+esc(x.rows)+'</td><td>'+esc(x.details)+'</td></tr>').join('')+'</tbody>';
  };

  let securityBroadcastUnsub=null, securityBroadcastState={enabled:false,requireAck:false,title:'',body:''};
  function broadcastAckKey(state){ return String((state&&state.id) || (state&&state.updatedAt) || 'current'); }
  function applyBroadcastState(state){
    securityBroadcastState=state||{enabled:false,requireAck:false,title:'',body:''};
    const t=$('securityBroadcastTitle'), b=$('securityBroadcastBody'), en=$('securityBroadcastEnabled'), req=$('securityBroadcastRequireAck');
    if(isAdmin()){
      if(t) t.value=securityBroadcastState.title||''; if(b) b.value=securityBroadcastState.body||''; if(en) en.checked=!!securityBroadcastState.enabled; if(req) req.checked=!!securityBroadcastState.requireAck;
    }
    renderBroadcastOverlay();
    if(isAdmin()) window.refreshAcknowledgements && window.refreshAcknowledgements();
  }
  function listenBroadcast(){
    try{ if(!rtdb || securityBroadcastUnsub) return; securityBroadcastUnsub=rtdb.ref('security/broadcast').on('value', snap=>applyBroadcastState(snap.val()||{})); }catch(e){}
  }
  function renderBroadcastOverlay(){
    let ov=document.getElementById('securityBroadcastOverlay');
    if(!ov){ ov=document.createElement('div'); ov.id='securityBroadcastOverlay'; ov.innerHTML='<div class="security-broadcast-card"><h2 id="securityBroadcastOverlayTitle"></h2><p id="securityBroadcastOverlayBody"></p><button id="securityBroadcastAckBtn" type="button">Acknowledge</button></div>'; document.body.appendChild(ov); }
    const st=securityBroadcastState||{}; const key=broadcastAckKey(st); const ack=localStorage.getItem('sscBroadcastAck_'+key)==='1';
    const show=!!(st.enabled && st.requireAck && !isAdmin() && !ack);
    const tt=document.getElementById('securityBroadcastOverlayTitle'), bb=document.getElementById('securityBroadcastOverlayBody'), btn=document.getElementById('securityBroadcastAckBtn');
    if(tt) tt.textContent=st.title||'Required Action'; if(bb) bb.textContent=st.body||'Please acknowledge this message.';
    if(btn) btn.onclick=async function(){
      try{ localStorage.setItem('sscBroadcastAck_'+key,'1'); if(rtdb && currentProfile) await rtdb.ref('security/acknowledgements/'+key+'/'+currentUserKey()).set({ts:firebase.database.ServerValue.TIMESTAMP,username:currentUserLabel(),email:currentProfile.email||'',role:currentProfile.role||''}); logSecurityActivity('Broadcast acknowledged', st.title||'Required Action'); }catch(e){}
      renderBroadcastOverlay();
    };
    ov.style.display=show?'flex':'none';
  }
  window.saveBroadcastMessage=async function(){
    if(!isAdmin() || !rtdb) return;
    const payload={enabled:!!($('securityBroadcastEnabled')&&$('securityBroadcastEnabled').checked), requireAck:!!($('securityBroadcastRequireAck')&&$('securityBroadcastRequireAck').checked), title:($('securityBroadcastTitle')&&$('securityBroadcastTitle').value.trim())||'Required Action', body:($('securityBroadcastBody')&&$('securityBroadcastBody').value.trim())||'Please review the dashboard message.', updatedAt:firebase.database.ServerValue.TIMESTAMP, updatedBy:currentProfile.email||currentProfile.username||'ADMIN'};
    await rtdb.ref('security/broadcast').set(payload); logSecurityActivity('Broadcast saved', payload.title);
  };
  window.clearBroadcastMessage=async function(){ if(!isAdmin() || !rtdb) return; await rtdb.ref('security/broadcast').set({enabled:false,requireAck:false,title:'',body:'',updatedAt:firebase.database.ServerValue.TIMESTAMP,updatedBy:currentProfile.email||currentProfile.username||'ADMIN'}); logSecurityActivity('Broadcast cleared',''); };
  window.refreshAcknowledgements=async function(){
    if(!isAdmin() || !rtdb || !db) return;
    const tbl=$('securityAcknowledgementTable'), kpi=$('secAckPending');
    try{
      const userSnap=await db.collection('users').get(); const users=[]; userSnap.forEach(doc=>users.push(Object.assign({id:doc.id},doc.data()||{})));
      const key=broadcastAckKey(securityBroadcastState); const ackSnap=await rtdb.ref('security/acknowledgements/'+key).once('value'); const ack=ackSnap.val()||{};
      const active=users.filter(u=>u.active!==false && String(u.role||'').toUpperCase()!=='ADMIN'); const pending=active.filter(u=>!ack[String((u.id||u.email||u.username||'')).toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')]);
      if(kpi) kpi.textContent=pending.length;
      if(tbl) tbl.innerHTML='<thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Time</th></tr></thead><tbody>'+active.map(u=>{ const id=String((u.id||u.email||u.username||'')).toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,''); const a=ack[id]; return '<tr><td>'+esc(u.username||'')+'</td><td>'+esc(u.email||'')+'</td><td>'+esc(u.role||'')+'</td><td>'+secStatusPill(a?'Acknowledged':'Pending',a?'ok':'warn')+'</td><td>'+esc(a?securityTime(a.ts):'')+'</td></tr>'; }).join('')+'</tbody>';
    }catch(e){ if(tbl) tbl.innerHTML='<tbody><tr><td>Acknowledgement refresh failed: '+esc(e&&e.message||e)+'</td></tr></tbody>'; }
  };

  function installBrowserErrorLogger(){
    if(window.__sscErrorLoggerInstalled) return; window.__sscErrorLoggerInstalled=true;
    window.addEventListener('error', function(ev){ writeSecurityEvent('security/errorLog',{message:ev.message||'Script error', source:ev.filename||'', line:ev.lineno||'', column:ev.colno||'', stack:ev.error&&ev.error.stack||''}); });
    window.addEventListener('unhandledrejection', function(ev){ const reason=ev.reason; writeSecurityEvent('security/errorLog',{message:'Unhandled promise rejection', source:'promise', stack:(reason&&reason.stack)||String(reason||'')}); });
  }
  window.refreshErrorLog=function(){
    if(!isAdmin() || !rtdb) return; const tbl=$('securityErrorLogTable');
    rtdb.ref('security/errorLog').limitToLast(80).once('value').then(snap=>{ const raw=snap.val()||{}; const items=Object.keys(raw).map(k=>Object.assign({id:k},raw[k])).sort((a,b)=>Number(b.ts||0)-Number(a.ts||0)); if(tbl) tbl.innerHTML=items.length?'<thead><tr><th>Time</th><th>User</th><th>Role</th><th>Message</th><th>Source</th><th>Line</th></tr></thead><tbody>'+items.map(x=>'<tr><td>'+esc(securityTime(x.ts))+'</td><td>'+esc(x.username||x.email||'')+'</td><td>'+esc(x.role||'')+'</td><td>'+esc(x.message||'')+'</td><td>'+esc(x.source||'')+'</td><td>'+esc(x.line||'')+'</td></tr>').join('')+'</tbody>':'<tbody><tr><td>No browser errors recorded yet.</td></tr></tbody>'; });
  };

  function recordAccessRequest(tabKey, reason){ writeSecurityEvent('security/accessRequests',{requestedTab:tabKey||'', reason:reason||'Restricted tab access', status:'pending'}); }
  window.refreshAccessRequests=function(){
    if(!isAdmin() || !rtdb) return; const tbl=$('securityAccessRequestsTable');
    rtdb.ref('security/accessRequests').limitToLast(80).once('value').then(snap=>{ const raw=snap.val()||{}; const items=Object.keys(raw).map(k=>Object.assign({id:k},raw[k])).sort((a,b)=>Number(b.ts||0)-Number(a.ts||0)); if(tbl) tbl.innerHTML=items.length?'<thead><tr><th>Time</th><th>User</th><th>Role</th><th>Requested Tab</th><th>Reason</th><th>Status</th></tr></thead><tbody>'+items.map(x=>'<tr><td>'+esc(securityTime(x.ts))+'</td><td>'+esc(x.username||x.email||'')+'</td><td>'+esc(x.role||'')+'</td><td>'+esc(x.requestedTab||'')+'</td><td>'+esc(x.reason||'')+'</td><td>'+secStatusPill(x.status||'pending',x.status==='approved'?'ok':'warn')+'</td></tr>').join('')+'</tbody>':'<tbody><tr><td>No access requests recorded yet.</td></tr></tbody>'; });
  };
  window.sscRecordAccessRequest=recordAccessRequest;

  function installSecurityAlertLogger(){
    if(window.__sscSecurityAlertLoggerInstalled) return; window.__sscSecurityAlertLoggerInstalled=true;
    document.addEventListener('contextmenu', function(e){ if(currentProfile && !isAdmin()) logSecurityAlert('Blocked right click','User attempted context menu'); }, true);
    document.addEventListener('keydown', function(e){
      if(!currentProfile || isAdmin()) return;
      const k=String(e.key||'').toLowerCase();
      if(e.key==='F12' || (e.ctrlKey && k==='u') || (e.ctrlKey && e.shiftKey && ['i','j','c','k'].includes(k))) logSecurityAlert('Blocked browser shortcut', (e.ctrlKey?'Ctrl+':'')+(e.shiftKey?'Shift+':'')+(e.key||''));
    }, true);
  }
  window.refreshSecurityAlerts=function(){
    if(!isAdmin() || !rtdb) return; const tbl=$('securityAlertsTable'), kpi=$('secSecurityAlertCount');
    rtdb.ref('security/securityAlerts').limitToLast(80).once('value').then(snap=>{ const raw=snap.val()||{}; const items=Object.keys(raw).map(k=>Object.assign({id:k},raw[k])).sort((a,b)=>Number(b.ts||0)-Number(a.ts||0)); if(kpi) kpi.textContent=items.length; if(tbl) tbl.innerHTML=items.length?'<thead><tr><th>Time</th><th>User</th><th>Role</th><th>Tab</th><th>Alert</th><th>Details</th></tr></thead><tbody>'+items.map(x=>'<tr><td>'+esc(securityTime(x.ts))+'</td><td>'+esc(x.username||x.email||'')+'</td><td>'+esc(x.role||'')+'</td><td>'+esc(x.tab||'')+'</td><td>'+esc(x.action||'')+'</td><td>'+esc(x.details||'')+'</td></tr>').join('')+'</tbody>':'<tbody><tr><td>No security alerts recorded yet.</td></tr></tbody>'; });
  };

  const oldCanOpenSecurityBase = canOpen;
  canOpen = function(key){
    const allowed = oldCanOpenSecurityBase(key);
    if(!allowed && currentProfile && key){
      try{ recordAccessRequest(key,'Attempted restricted tab access'); logSecurityAlert('Restricted tab attempt', key); }catch(e){}
    }
    return allowed;
  };
  window.renderSecurityPage = function(){
    if(!isAdmin()) return false;
    renderSecurityMaintenanceCard();
    window.refreshSystemHealth();
    window.refreshSecurityHealth();
    window.refreshPermissionAudit();
    window.refreshDataValidation();
    window.refreshSecurityActivity();
    window.refreshAcknowledgements();
    window.refreshErrorLog();
    window.refreshAccessRequests();
    window.refreshSecurityAlerts();
    return true;
  };
  listenBroadcast();
  installBrowserErrorLogger();
  installSecurityAlertLogger();


  /* ── Realtime online users ── */
  function currentTabTitle(key){
    const all = TABS.concat([ADMIN_TAB, SECURITY_TAB]);
    const found = all.find(t=>t.key===key);
    return found ? found.title : (key || 'Dashboard');
  }
  function safePresenceId(){
    const base = (currentProfile && (currentProfile.id || currentProfile.email || currentProfile.username)) || 'guest';
    return String(base).toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'') || 'user';
  }
  function ensureLiveUsersPanel(){
    const side = document.querySelector('.side-menu');
    let box = document.getElementById('sscLiveUsersPanel');
    if(!isAdmin()){
      if(box) box.remove();
      return null;
    }
    if(!side) return null;
    if(!box){
      box = document.createElement('div');
      box.id = 'sscLiveUsersPanel';
      box.className = 'ssc-live-users-panel side-label admin-only';
      box.innerHTML = '<div class="ssc-live-users-head">🟢 Online Users (0)</div><div class="ssc-live-users-list"><div class="ssc-live-users-empty">Waiting for users...</div></div>';
      let bottom = document.getElementById('codexSidebarBottom');
      if(!bottom){
        bottom = document.createElement('div');
        bottom.id = 'codexSidebarBottom';
        bottom.className = 'codex-sidebar-bottom';
        side.appendChild(bottom);
      }
      bottom.appendChild(box);
    }
    return box;
  }
  function renderLiveUsers(snap){
    if(!isAdmin()){
      const hiddenBox = document.getElementById('sscLiveUsersPanel');
      if(hiddenBox) hiddenBox.remove();
      return;
    }
    const box = ensureLiveUsersPanel();
    if(!box) return;
    const raw = (snap && snap.val && snap.val()) || {};
    const now = Date.now();
    const grouped = {};
    Object.keys(raw).forEach(id=>{
      const u = raw[id] || {};
      const seen = Number(u.lastSeen || 0);
      if(!seen || now - seen > 120000) return;
      const name = norm(u.name || u.email || id) || 'User';
      if(!grouped[name] || Number(grouped[name].lastSeen||0) < seen) grouped[name] = u;
    });
    const users = Object.values(grouped).sort((a,b)=>norm(a.name||a.email).localeCompare(norm(b.name||b.email)));
    const head = box.querySelector('.ssc-live-users-head');
    const list = box.querySelector('.ssc-live-users-list');
    if(head) head.textContent = '🟢 Online Users (' + users.length + ')';
    if(list){
      list.innerHTML = users.length ? users.map(u=>{
        const name = esc(u.name || u.email || 'User');
        const tab = esc(u.tabTitle || currentTabTitle(u.tabKey));
        return '<div class="ssc-live-user-row"><span class="ssc-live-user-name">'+name+'</span><span class="ssc-live-user-tab">'+tab+'</span></div>';
      }).join('') : '<div class="ssc-live-users-empty">No online users</div>';
    }
  }
  function updatePresenceTab(key){
    try{
      if(!rtdb || !currentProfile || !presenceUserRef) return;
      const tabKey = key || window.__fbActiveTabKey || localStorage.getItem('serviceEyeActiveTab') || 'dashboard';
      presenceUserRef.update({
        name: currentProfile.username || currentProfile.email || 'User',
        email: currentProfile.email || '',
        role: currentProfile.role || '',
        tabKey: tabKey,
        tabTitle: currentTabTitle(tabKey),
        lastSeen: firebase.database.ServerValue.TIMESTAMP
      });
    }catch(e){}
  }
  window.sscUpdatePresenceTab = updatePresenceTab;
  function startPresence(){
    try{
      if(!rtdb || !currentProfile) return;
      stopPresence(true);
      presenceUserRef = rtdb.ref('presence/users/' + safePresenceId());
      presenceUserRef.onDisconnect().remove();
      updatePresenceTab(window.__fbActiveTabKey || localStorage.getItem('serviceEyeActiveTab') || firstAllowed() || 'dashboard');
      presenceTimer = setInterval(()=>updatePresenceTab(window.__fbActiveTabKey || localStorage.getItem('serviceEyeActiveTab') || 'dashboard'), 30000);
      if(isAdmin()){
        ensureLiveUsersPanel();
        unsubscribePresence = rtdb.ref('presence/users').on('value', renderLiveUsers);
      }else{
        const box=document.getElementById('sscLiveUsersPanel');
        if(box) box.remove();
      }
    }catch(e){}
  }
  function stopPresence(keepPanel){
    try{ if(presenceTimer) clearInterval(presenceTimer); }catch(e){}
    presenceTimer = null;
    try{ if(unsubscribePresence && rtdb) rtdb.ref('presence/users').off('value', unsubscribePresence); }catch(e){}
    unsubscribePresence = null;
    try{ if(presenceUserRef) presenceUserRef.remove(); }catch(e){}
    presenceUserRef = null;
    if(!keepPanel){ const box=document.getElementById('sscLiveUsersPanel'); if(box) box.remove(); }
  }
  window.addEventListener('beforeunload', function(){ try{ if(presenceUserRef) presenceUserRef.remove(); }catch(e){} });

  /* ── Auth state ── */
  function ensureLoginOverlay(){ document.body.classList.add('firebase-auth-pending'); }

  function setAuthenticated(profile){
    currentProfile = profile; clearOldLocalAuth(); saveCache(profile);
    document.body.classList.remove('firebase-auth-required','firebase-auth-pending');
    document.body.classList.add('firebase-authenticated');
    document.body.classList.toggle('firebase-admin',   isAdmin());
    document.body.classList.toggle('firebase-manager', isManager());
    document.body.classList.toggle('firebase-viewer',  isViewer());
    document.documentElement.classList.toggle('admin', isAdmin());
    window.isAdmin = () => isAdmin();
    window.currentFirebaseUserProfile = profile;
    ensureUserWidget(); ensureAdminTab(); markKnownTabs(); ensureLiveUsersPanel();
    applyPermissions(true);
    startPresence();
    listenMaintenance();
    logSecurityActivity('Login', 'User signed in');
    const savedKey = window.__fbActiveTabKey || (function(){ try{ return localStorage.getItem('serviceEyeActiveTab'); }catch(e){ return null; } })();
    const targetKey = (savedKey && allowedKeys(profile).includes(savedKey)) ? savedKey : (firstAllowed()||'gspn');
    setTimeout(()=>showTab(targetKey), 50);
  }

  function setUnauthenticated(){
    currentProfile = null; clearOldLocalAuth(); clearCache();
    document.body.classList.add('firebase-auth-required');
    document.body.classList.remove('firebase-auth-pending','firebase-admin','firebase-manager','firebase-viewer','firebase-authenticated');
    document.documentElement.classList.remove('admin');
    markKnownTabs(); applyPermissions();
    stopPresence(false);
  }

  /* ── Tab helpers ── */
  function sideTabs(){ return Array.from(document.querySelectorAll('.side-tab')); }
  function markKnownTabs(){
    sideTabs().forEach(el=>{ const k=tabKeyFromSideTab(el); if(k) el.setAttribute('data-fb-tab-key',k); });
    TABS.concat([ADMIN_TAB, SECURITY_TAB]).forEach(t=>{ const p=$(t.pageId); if(p) p.setAttribute('data-fb-page-key',t.key); });
  }
  function tabKeyFromSideTab(el){
    const oc=el.getAttribute('onclick')||''; const txt=lower(el.textContent);
    if(oc.includes("'dashboard'")||oc.includes('"dashboard"')||txt.includes('dashboard')) return 'dashboard';
    if(oc.includes("'preBooking'")||oc.includes('"preBooking"')||txt.includes('pre_booking')||txt.includes('pre booking')) return 'preBooking';
    if(oc.includes("'returnCases'")||oc.includes('"returnCases"')||txt.includes('return cases')) return 'returnCases';
    if(oc.includes("'receivedDelivered'")||oc.includes('"receivedDelivered"')||txt.includes('received')||txt.includes('delivered')) return 'receivedDelivered';
    if(oc.includes("'repairEfficiency'")||oc.includes('"repairEfficiency"')||txt.includes('repair efficiency')) return 'repairEfficiency';
    if(oc.includes("'gspn'")||oc.includes('"gspn"')||txt.includes('gspn')) return 'gspn';
    if(oc.includes("'sky'")||oc.includes('"sky"')||txt.includes('sky')) return 'sky';
    if(oc.includes("'profit'")||oc.includes('"profit"')||txt.includes('profitability')) return 'profit';
    if(oc.includes('openCashTargetTab')||oc.includes('cashTarget')||txt.includes('cash')) return 'cashTarget';
    if(txt.includes('security') || oc.includes("'security'") || oc.includes('"security"')) return 'security';
    if(el.classList.contains('firebase-user-management-tab')||txt.includes('user management')) return 'userManagement';
    return '';
  }
  function ensureAdminTab(){
    const side=document.querySelector('.side-menu'); if(!side) return;
    let tab=document.querySelector('.side-tab.firebase-user-management-tab');
    if(!tab){
      tab=document.createElement('div'); tab.className='side-tab firebase-user-management-tab admin-only'; tab.setAttribute('data-tip','User Management');
      tab.setAttribute('data-fb-tab-key','userManagement'); tab.setAttribute('data-pb-tab','userManagement');
      tab.innerHTML='<span class="side-icon">👥</span><span class="side-label">User Management</span>';
      tab.onclick=()=>showTab('userManagement');
      const cash=sideTabs().find(el=>tabKeyFromSideTab(el)==='cashTarget');
      if(cash&&cash.parentNode) cash.parentNode.insertBefore(tab,cash.nextSibling); else side.appendChild(tab);
    }
    let sec=document.querySelector('.side-tab[data-fb-tab-key="security"],.side-tab[data-pb-tab="security"]');
    if(!sec){
      sec=document.createElement('div'); sec.className='side-tab admin-only'; sec.setAttribute('data-tip','Security');
      sec.setAttribute('data-fb-tab-key','security'); sec.setAttribute('data-pb-tab','security');
      sec.innerHTML='<span class="side-icon">🔐</span><span class="side-label">Security</span>';
      sec.onclick=()=>showTab('security');
      const um=document.querySelector('.side-tab.firebase-user-management-tab');
      if(um&&um.parentNode) um.parentNode.insertBefore(sec,um.nextSibling); else side.appendChild(sec);
    }
  }
  function ensureUserWidget(){
    const side=document.querySelector('.side-menu'); if(!side||!currentProfile) return;
    let box=$('firebaseUserWidget');
    if(!box){ box=document.createElement('div'); box.id='firebaseUserWidget'; box.className='fb-user-box'; const head=side.querySelector('.side-head'); if(head&&head.parentNode) head.parentNode.insertBefore(box,head.nextSibling); else side.insertBefore(box,side.firstChild); }
    box.innerHTML='<div>'+esc(currentProfile.username||currentProfile.email)+'</div><div class="muted">'+esc(currentProfile.role)+'</div><button class="fb-logout-btn" type="button" id="firebaseLogoutBtn">Logout</button>';
    const btn=$('firebaseLogoutBtn'); if(btn) btn.onclick=()=>auth.signOut();
  }
  function setPageVisible(key){
    TABS.concat([ADMIN_TAB, SECURITY_TAB]).forEach(t=>{ const p=$(t.pageId); if(p&&!p.classList.contains('fb-page-denied')) p.style.display=(t.key===key?'block':'none'); });
    sideTabs().forEach(el=>el.classList.toggle('active',tabKeyFromSideTab(el)===key));
    try{ localStorage.setItem('serviceEyeActiveTab',key); }catch(e){}
    window.__fbActiveTabKey = key;
  }
  function firstAllowed(){ return allowedKeys(currentProfile).find(k=>k!=='userManagement'&&k!=='security')||(isAdmin()?'gspn':null); }
  function showTab(key){
    if(!canOpen(key)){ key=firstAllowed(); applyPermissions(true); if(!key) return false; }
    window.__fbActiveTabKey = key;
    try{ localStorage.setItem('serviceEyeActiveTab',key); }catch(e){}
    logSecurityActivity('Open tab', key);
    setPageVisible(key);
    setTimeout(()=>{ try{
      if(key==='gspn'&&typeof window.render==='function') window.render();
      if(key==='sky'&&typeof window.renderSky==='function') window.renderSky();
      if(key==='profit'&&typeof window.renderProfit==='function') window.renderProfit();
      if(key==='cashTarget'&&typeof window.renderCashTarget==='function') window.renderCashTarget();
      if(key==='returnCases'&&typeof window.loadReturnCases==='function') window.loadReturnCases(false);
      if(key==='receivedDelivered'&&typeof window.loadReceivedDelivered==='function') window.loadReceivedDelivered(false);
      if(key==='receivedDelivered'&&typeof window.renderReceivedDelivered==='function') window.renderReceivedDelivered();
      if(key==='repairEfficiency'&&typeof window.loadRepairEfficiency==='function') window.loadRepairEfficiency(false);
      if(key==='repairEfficiency'&&typeof window.renderRepairEfficiency==='function') window.renderRepairEfficiency();
      if(key==='userManagement') renderUserManagement();
      if(key==='security'&&typeof window.renderSecurityPage==='function') window.renderSecurityPage();
    }catch(e){} },80);
    updatePresenceTab(key);
    return true;
  }
  function applyPermissions(skipRedirect){
    markKnownTabs();
    const allowed = new Set(currentProfile ? allowedKeys(currentProfile) : []);
    sideTabs().forEach(el=>{
      const k=tabKeyFromSideTab(el); if(!k) return;
      const ok=allowed.has(k);
      el.classList.toggle('fb-tab-denied',!ok);
      el.setAttribute('aria-hidden',ok?'false':'true');
      if(!ok){ el.classList.remove('active'); try{ el.style.setProperty('display','none','important'); el.style.setProperty('visibility','hidden','important'); }catch(e){} }
      else{ try{ el.style.removeProperty('display'); el.style.removeProperty('visibility'); el.style.removeProperty('opacity'); el.style.removeProperty('height'); el.style.removeProperty('width'); }catch(e){} }
    });
    TABS.concat([ADMIN_TAB, SECURITY_TAB]).forEach(t=>{
      const p=$(t.pageId); if(!p) return;
      const ok=allowed.has(t.key);
      p.classList.toggle('fb-page-denied',!ok);
      if(!ok){ try{ p.style.setProperty('display','none','important'); }catch(e){ p.style.display='none'; } }
      else{ try{ if(p.style.display==='none') p.style.removeProperty('display'); }catch(e){} }
    });
  }
  function hookNavigation(){
    document.addEventListener('click',function(ev){
      const el=ev.target&&ev.target.closest?ev.target.closest('.side-tab'):null;
      if(!el||!currentProfile) return;
      const k=tabKeyFromSideTab(el);
      if(k){ if(!canOpen(k)){ ev.preventDefault(); ev.stopImmediatePropagation(); applyPermissions(true); return false; }
        ev.preventDefault(); ev.stopImmediatePropagation(); showTab(k); return false; }
    },true);
    const oldSwitch=window.switchTab;
    window.switchTab=function(tab){
      if(tab==='cash') tab='cashTarget';
      if(['gspn','sky','profit','cashTarget','preBooking','returnCases','receivedDelivered','repairEfficiency','dashboard','userManagement','security'].includes(tab)) return showTab(tab);
      if(typeof oldSwitch==='function') return oldSwitch.apply(this,arguments);
    };
    window.openCashTargetTab=function(){ return showTab('cashTarget'); };
    setInterval(()=>{ if(currentProfile){ ensureAdminTab(); ensureUserWidget(); } },30000);
  }
  function setupTabsCheckboxes(containerId,selected){
    const box=$(containerId); if(!box) return;
    selected=selected||[];
    box.innerHTML=TABS.map(t=>'<label><input type="checkbox" value="'+esc(t.title)+'" '+(selected.includes(t.title)||selected.includes(t.key)?'checked':'')+'>'+esc(t.title)+'</label>').join('');
  }
  function selectedTabs(container){ return Array.from(container.querySelectorAll('input[type=checkbox]:checked')).map(x=>x.value); }

  /* ════════════════════════════════════════════
     User Management — compact table with search
  ════════════════════════════════════════════ */
  let _umAllRows = [];

  window.__umFilter = function(q){
    const s=(q||'').toLowerCase().trim();
    let vis=0;
    document.querySelectorAll('#umUsersTable tbody tr[data-id]').forEach(tr=>{
      const hide=s&&!( (tr.dataset.searchtext||'').includes(s) );
      tr.classList.toggle('um-row-hidden',hide);
      if(!hide) vis++;
    });
    const cnt=$('umUserCount');
    if(cnt) cnt.textContent = s ? vis+' / '+_umAllRows.length+' users' : _umAllRows.length+' users';
  };

  function renderUserManagement(forceRefresh){
    if(!isAdmin()) return;
    setupTabsCheckboxes('umAllowedTabsBox',[]);
    if(forceRefresh&&unsubscribeUsers){ try{unsubscribeUsers();}catch(e){} unsubscribeUsers=null; }
    if(unsubscribeUsers) return;

    unsubscribeUsers=db.collection('users').onSnapshot(snap=>{
      const rows=[]; snap.forEach(doc=>rows.push(Object.assign({id:doc.id},doc.data())));
      rows.sort((a,b)=>lower(a.email).localeCompare(lower(b.email)));
      _umAllRows=rows;
      const cnt=$('umUserCount'); if(cnt) cnt.textContent=rows.length+' users';
      const tb=document.querySelector('#umUsersTable tbody'); if(!tb) return;

      function initials(u){ const n=(u.username||u.email||'?').trim(); return n.split(/\s+/).map(w=>w[0]).join('').toUpperCase().slice(0,2); }
      function avClass(role){ return role==='ADMIN'?'av-admin':role==='MANAGER'?'av-manager':'av-viewer'; }
      function rbClass(role){ return role==='ADMIN'?'rb-admin':role==='MANAGER'?'rb-manager':'rb-viewer'; }

      tb.innerHTML=rows.map(u=>{
        const role=String(u.role||'VIEWER').toUpperCase();
        const tabs=Array.isArray(u.allowedTabs)?u.allowedTabs:[];
        const active=u.active===true;
        const st=esc([u.username,u.email,role].join(' ').toLowerCase());
        const checkedTabs=(role==='ADMIN' && !tabs.length) ? TABS.map(t=>t.title) : tabs;
        const visibleTabs=role==='ADMIN' ? '<span class="um-tab-chip um-admin-tabs">All tabs automatically</span>' : TABS.filter(t=>tabs.includes(t.title)||tabs.includes(t.key)).map(t=>'<span class="um-tab-chip">'+esc(t.title)+'</span>').join('');
        const editTabs=TABS.map(t=>{
          const chk=checkedTabs.includes(t.title)||checkedTabs.includes(t.key);
          return '<label><input type="checkbox" '+(chk?'checked':'')+' value="'+esc(t.title)+'" disabled>'+esc(t.title)+'</label>';
        }).join('');
        const tabBadges='<div class="um-tabs-view um-view-only">'+(visibleTabs||'<span class="um-tab-chip">No tabs</span>')+'</div><div class="um-tabs-edit">'+editTabs+'</div>';
        return '<tr data-id="'+esc(u.id)+'" data-role="'+esc(role)+'" data-active="'+active+'" data-searchtext="'+st+'">'+
          '<td><div class="um-user-cell">'+
            '<div class="um-avatar '+avClass(role)+'">'+initials(u)+'</div>'+
            '<div>'+
              '<div class="um-user-name"><input class="um-edit-username" disabled value="'+esc(u.username||'')+'"></div>'+
              '<div class="um-user-email">'+esc(u.email||'')+'</div>'+
            '</div>'+
          '</div></td>'+
          '<td>'+
            '<span class="um-role-badge '+rbClass(role)+' um-view-only">'+esc(role)+'</span>'+
            '<select class="um-edit-role" disabled><option '+(role==='ADMIN'?'selected':'')+'>ADMIN</option><option '+(role==='MANAGER'?'selected':'')+'>MANAGER</option><option '+(role==='VIEWER'?'selected':'')+'>VIEWER</option></select>'+
          '</td>'+
          '<td><div class="um-row-tabs">'+tabBadges+'</div></td>'+
          '<td>'+
            '<span class="um-status-badge '+(active?'sb-active':'sb-inactive')+' um-view-only"><span class="um-status-dot"></span>'+(active?'Active':'Disabled')+'</span>'+
            '<select class="um-edit-active" disabled><option value="true" '+(active?'selected':'')+'>Active</option><option value="false" '+(!active?'selected':'')+'>Disabled</option></select>'+
          '</td>'+
          '<td><span class="um-last-login">'+esc(formatDate(u.lastLogin))+'</span></td>'+
          '<td><div class="um-actions">'+
            '<button class="um-btn um-btn-edit um-edit">✏️ Edit</button>'+
            '<button class="um-btn um-btn-save um-save">💾 Save</button>'+
            '<button class="um-btn um-btn-cancel um-cancel">✕</button>'+
            '<button class="um-btn um-btn-pwd um-change-pwd">🔑</button>'+
            '<button class="um-btn um-btn-del um-delete">🗑️</button>'+
          '</div></td>'+
        '</tr>';
      }).join('')||'<tr><td colspan="6" style="text-align:center;padding:24px;color:#94a3b8">No users found.</td></tr>';

      // re-apply search filter if active
      const si=$('umSearchInput'); if(si&&si.value) window.__umFilter(si.value);
    });
  }

  /* ── Create user via secondary app ── */
  async function createSecondaryUser(email,password){
    const name='secondary-create-user';
    const existing=firebase.apps.find(a=>a.name===name);
    if(existing){ try{ await existing.delete(); }catch(e){} }
    const secondary=firebase.initializeApp(firebaseConfig,name);
    try{
      await secondary.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
      const cred=await secondary.auth().createUserWithEmailAndPassword(email,password);
      await secondary.auth().signOut();
      return cred.user;
    }finally{ try{ await secondary.delete(); }catch(e){} }
  }

  /* ── Password change modal ── */
  function showPasswordModal(email,userId){
    const old=document.getElementById('umPasswordModal'); if(old) old.remove();
    const modal=document.createElement('div'); modal.id='umPasswordModal';
    modal.innerHTML=`<div class="um-modal-backdrop"></div><div class="um-modal-card"><h3>Set New Password</h3><p class="um-modal-email">${esc(email)}</p><div class="um-field"><label>New Password</label><input id="umNewPassword" type="password" minlength="6" placeholder="Min 6 characters" autocomplete="new-password"></div><div class="um-field"><label>Confirm Password</label><input id="umConfirmPassword" type="password" minlength="6" placeholder="Repeat new password" autocomplete="new-password"></div><div class="um-modal-msg" id="umModalMsg"></div><div class="um-modal-actions"><button class="um-primary" id="umModalSaveBtn" type="button">Save Password</button><button class="um-secondary" id="umModalCancelBtn" type="button">Cancel</button></div></div>`;
    document.body.appendChild(modal);
    const pwdInput=document.getElementById('umNewPassword'), confInput=document.getElementById('umConfirmPassword');
    const msgEl=document.getElementById('umModalMsg'), saveBtn=document.getElementById('umModalSaveBtn'), cancelBtn=document.getElementById('umModalCancelBtn');
    function closeModal(){ modal.remove(); }
    cancelBtn.onclick=closeModal; modal.querySelector('.um-modal-backdrop').onclick=closeModal;
    saveBtn.onclick=async()=>{
      const newPwd=pwdInput.value, confPwd=confInput.value;
      msgEl.className='um-modal-msg'; msgEl.textContent='';
      if(newPwd.length<6){ msgEl.className='um-modal-msg err'; msgEl.textContent='Password must be at least 6 characters.'; return; }
      if(newPwd!==confPwd){ msgEl.className='um-modal-msg err'; msgEl.textContent='Passwords do not match.'; return; }
      saveBtn.disabled=true; saveBtn.textContent='Saving...';
      try{
        await db.collection('users').doc(userId).update({pendingPasswordChange:newPwd,pendingPasswordSetBy:currentProfile?(currentProfile.email||'admin'):'admin',pendingPasswordSetAt:firebase.firestore.FieldValue.serverTimestamp()});
        msgEl.className='um-modal-msg ok'; msgEl.textContent='Password updated successfully.';
        setTimeout(closeModal,1500);
      }catch(ex){ msgEl.className='um-modal-msg err'; msgEl.textContent=ex.message||String(ex); }
      finally{ saveBtn.disabled=false; saveBtn.textContent='Save Password'; }
    };
    pwdInput.focus();
  }

  async function applyPendingPasswordChange(user,profile){
    try{
      if(!profile.pendingPasswordChange) return false;
      await user.updatePassword(profile.pendingPasswordChange);
      await db.collection('users').doc(profile.id).update({pendingPasswordChange:firebase.firestore.FieldValue.delete(),passwordChangedAt:firebase.firestore.FieldValue.serverTimestamp()});
      return true;
    }catch(e){ return false; }
  }

  /* ── hookUserManagement ── */
  function hookUserManagement(){
    setupTabsCheckboxes('umAllowedTabsBox',[]);
    const form=$('umAddUserForm');
    if(form){ form.addEventListener('submit',async(e)=>{
      e.preventDefault(); if(!isAdmin()) return;
      const msg=$('umFormMsg');
      const username=norm($('umUsername').value), email=lower($('umEmail').value), password=$('umPassword').value, role=$('umRole').value;
      try{
        await createSecondaryUser(email,password);
        const data={username,email,role,active:true,createdAt:firebase.firestore.FieldValue.serverTimestamp(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
        if(role!=='ADMIN') data.allowedTabs=selectedTabs($('umAllowedTabsBox'));
        await db.collection('users').doc(docIdForEmail(email)).set(data,{merge:true});
        setMsg(msg,'User created successfully.',true); form.reset(); setupTabsCheckboxes('umAllowedTabsBox',[]);
      }catch(err){ setMsg(msg,err.message||String(err),false); }
    }); }

    const table=$('umUsersTable');
    if(table){ table.addEventListener('click',async(e)=>{
      const tr=e.target.closest('tr[data-id]'); if(!tr||!isAdmin()) return;
      const id=tr.dataset.id;
      try{
        if(e.target.classList.contains('um-edit')){
          tr.classList.add('um-editing');
          tr.querySelectorAll('input,select').forEach(x=>{ x.disabled=false; x.style.display=''; });
          tr.querySelectorAll('.um-view-only').forEach(x=>x.style.display='none');
          tr.querySelectorAll('.um-row-tabs input[type=checkbox]').forEach(x=>{ x.style.display='inline'; x.disabled=false; });
          return;
        }
        if(e.target.classList.contains('um-cancel')){ renderUserManagement(true); return; }
        if(e.target.classList.contains('um-save')){
          const role=tr.querySelector('.um-edit-role').value;
          const data={username:tr.querySelector('.um-edit-username').value,role,active:tr.querySelector('.um-edit-active').value==='true',updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
          data.allowedTabs=selectedTabs(tr.querySelector('.um-row-tabs'));
          await db.collection('users').doc(id).update(data);
          tr.classList.remove('um-editing'); tr.querySelectorAll('input,select').forEach(x=>x.disabled=true);
          alert('Saved.');
        }
        if(e.target.classList.contains('um-change-pwd')){
          const emailEl=tr.querySelector('.um-user-email');
          showPasswordModal(emailEl?emailEl.textContent.trim():'',id); return;
        }
        if(e.target.classList.contains('um-delete')){
          if(confirm('Delete this permission profile? The user account will remain but access to the dashboard will be denied.'))
            await db.collection('users').doc(id).delete();
        }
      }catch(err){ alert(err.message||String(err)); }
    }); }
  }

  /* ── hookLogin ── */
  function hookLogin(){
    const form=$('firebaseLoginForm'); if(!form) return;
    form.addEventListener('submit',async(e)=>{
      e.preventDefault();
      const btn=$('fbLoginBtn'), err=$('fbLoginError');
      if(err) err.style.display='none';
      try{
        if(btn){ btn.disabled=true; btn.textContent='Checking...'; }
        const email=lower($('fbLoginEmail').value), pass=$('fbLoginPassword').value;
        const rememberMe=$('fbRememberMe')?$('fbRememberMe').checked:true;
        try{ await auth.setPersistence(rememberMe?firebase.auth.Auth.Persistence.LOCAL:firebase.auth.Auth.Persistence.SESSION); }catch(e){}
        const cred=await auth.signInWithEmailAndPassword(email,pass);
        const profile=await loadProfileFromFirestore(cred.user.email);
        if(profile.pendingPasswordChange){
          await applyPendingPasswordChange(cred.user,profile);
          const refreshed=await loadProfileFromFirestore(cred.user.email);
          setAuthenticated(refreshed); updateLastLogin(refreshed);
        } else {
          setAuthenticated(profile); updateLastLogin(profile);
        }
      }catch(ex){
        try{ await auth.signOut(); }catch(e){}
        const badCred=ex&&(ex.code==='auth/invalid-credential'||ex.code==='auth/wrong-password'||ex.code==='auth/user-not-found'||ex.code==='auth/invalid-email');
        showLoginError(badCred?'Invalid email or password. Please check your credentials and try again.':(ex.message||String(ex)));
        setUnauthenticated();
      }finally{ if(btn){ btn.disabled=false; btn.textContent='Login'; } }
    });
  }

  /* ── boot ── */
  async function boot(){
    clearOldLocalAuth(); ensureLoginOverlay();
    /* Wait for Firebase SDKs (loaded async) */
    try{ await (window.__firebaseReady || Promise.resolve()); }catch(_e){}
    try{ initFirebase(); }catch(e){ showLoginError(e.message||String(e)); setUnauthenticated(); return; }
    hookNavigation(); hookLogin(); hookUserManagement();

    auth.onAuthStateChanged(async(user)=>{
      if(!user){ clearCache(); setUnauthenticated(); return; }

      /* Fast path: use cache → show page instantly */
      const cached=loadCache(user.email);
      if(cached){
        setAuthenticated(cached);
        /* Cached profile is enough on reload; skip Firestore background refresh and lastLogin write to prevent console 400 errors when Firestore is not enabled. */
        return;
      }

      /* First login: must fetch from Firestore */
      try{ await firebasePersistenceReady; }catch(_e){}
      try{
        const profile=await loadProfileFromFirestore(user.email);
        if(profile.pendingPasswordChange){
          await applyPendingPasswordChange(user,profile);
          const refreshed=await loadProfileFromFirestore(user.email);
          setAuthenticated(refreshed); updateLastLogin(refreshed);
        } else {
          setAuthenticated(profile); updateLastLogin(profile);
        }
      }catch(e){ showLoginError(e.message||String(e)); try{await auth.signOut();}catch(_e){} setUnauthenticated(); }
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
  try{
    let _permDebounce=null;
    new MutationObserver(mutations=>{
      const hasClassChange=mutations.some(m=>m.type==='attributes'&&m.attributeName==='class'&&(m.target===document.body||m.target===document.documentElement));
      if(currentProfile&&hasClassChange){ clearTimeout(_permDebounce); _permDebounce=setTimeout(()=>applyPermissions(),200); }
    }).observe(document.body,{attributes:true,attributeFilter:['class']});
  }catch(_e){}
})();


/* ===== prebooking-dashboard-script ===== */

(function(){
  'use strict';
  var EMBEDDED_PRE_BOOKING = []; /* data externalized to data/pre_booking.json (variable was dead weight: tab loads live from Pre_Booking.xlsx) */
  var PB_COLS = ['Branch','Model','Serial No.','Customer Name','Mobile Number','Requested SP','Requestd Date','Requester','Amount','Repair Date','Sky Job','SO NO','Status','Closed Date','Cancellation Reason'];
  var PB_RAW_COLS = ['Branch','Model','Serial No.','Customer Name ','Mobile Number','Requested SP,','Requestd Date','Requester','Amount','Repair Date','Sky Job','SO NO,','Status','Closed Date','Cancellation Reason'];
  var pbRows=[], pbFiltered=[], pbSort={col:null,dir:1}, pbStatusCard='';
  function $(id){ return document.getElementById(id); }
  function txt(v){ return String(v==null?'':v).trim(); }
  function norm(s){ return txt(s).toLowerCase().replace(/[\s_.,#-]+/g,''); }
  function val(r, keys){ for(var i=0;i<keys.length;i++){ var k=keys[i]; if(r&&r[k]!=null&&txt(r[k])!=='') return r[k]; } var nk=keys.map(norm); for(var kk in r) if(nk.indexOf(norm(kk))>=0 && txt(r[kk])!=='') return r[kk]; return ''; }
  function toDate(v){ if(!v)return null; if(v instanceof Date&&!isNaN(v))return v; var s=txt(v); var d=new Date(s); if(!isNaN(d))return d; var m=s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/); if(m){ var y=+m[3]; if(y<100)y+=2000; d=new Date(y,+m[2]-1,+m[1]); if(!isNaN(d))return d; } return null; }
  function monthKey(v){ var d=toDate(v); return d?d.toLocaleString('en-US',{month:'long',year:'numeric'}):''; }
  function fmtPBDate(v){ var d=toDate(v); return d?d.toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'}):txt(v); }
  function isPBDateCol(c){ return ['Requestd Date','Repair Date','Closed Date'].indexOf(c)>=0; }
  function cellText(r,c){ return isPBDateCol(c)?fmtPBDate(r[c]):txt(r[c]); }
  function num(v){ var n=Number(String(v||'').replace(/,/g,'')); return isNaN(n)?0:n; }
  function normalizePB(r){ var o={}; PB_COLS.forEach(function(c,i){ o[c]=val(r,[PB_RAW_COLS[i],c]); }); o.Month=monthKey(o['Requestd Date']); return o; }
  function uniq(a){ var ss=new Set(); a.forEach(function(x){x=txt(x); if(x)ss.add(x)}); return Array.from(ss).sort(); }
  function esc(v){ return txt(v).replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];}); }
  function selected(id){
    var box=$(id); if(!box)return [];
    if(Array.isArray(box.__pbSelected)) return box.__pbSelected.slice();
    return Array.from(box.querySelectorAll('input[type="checkbox"]:checked:not([data-all])')).map(function(x){return x.value;}).filter(Boolean);
  }
  function fillMulti(id, values){
    var box=$(id); if(!box)return;
    var old=Array.isArray(box.__pbSelected)?box.__pbSelected.slice():selected(id);
    var title=box.getAttribute('data-title')||'Filter';
    box.__pbValues=values.slice();
    box.__pbSelected=old.filter(function(v){return values.indexOf(v)>=0;});
    box.__pbTemp=new Set(box.__pbSelected);
    box.innerHTML='<div class="pb-filter-label">'+esc(title)+'</div>'+
      '<button type="button" class="pb-filter-btn">All</button>'+
      '<div class="pb-filter-menu">'+
      '<input type="text" class="pb-filter-search" placeholder="Search">'+
      '<div class="pb-filter-list"></div>'+
      '<div class="pb-filter-actions"><button type="button" class="pb-filter-ok">OK</button><button type="button" class="pb-filter-cancel">Cancel</button><button type="button" class="pb-filter-clear">Clear Filter Data</button></div>'+
      '</div>';
    updateMultiCaption(box);
    drawFilterList(box,'');
    if(!box.__pbMulti){
      box.__pbMulti=true;
      box.addEventListener('click',function(e){
        var btn=e.target.closest('.pb-filter-btn');
        if(btn){ e.preventDefault(); closeMultis(box); box.__pbTemp=new Set(box.__pbSelected||[]); drawFilterList(box,''); box.classList.toggle('open'); var search=box.querySelector('.pb-filter-search'); if(search) setTimeout(function(){ search.focus(); },0); }
        if(e.target.closest('.pb-filter-ok')){ box.__pbSelected=Array.from(box.__pbTemp||[]); updateMultiCaption(box); box.classList.remove('open'); box.dispatchEvent(new CustomEvent('pbchange',{bubbles:true})); }
        if(e.target.closest('.pb-filter-cancel')){ box.__pbTemp=new Set(box.__pbSelected||[]); drawFilterList(box,''); box.classList.remove('open'); }
        if(e.target.closest('.pb-filter-clear')){ box.__pbTemp=new Set(); box.__pbSelected=[]; drawFilterList(box,''); updateMultiCaption(box); box.classList.remove('open'); box.dispatchEvent(new CustomEvent('pbchange',{bubbles:true})); }
      });
      box.addEventListener('input',function(e){ if(e.target.matches('.pb-filter-search')) drawFilterList(box,e.target.value||''); });
      box.addEventListener('change',function(e){
        if(e.target.matches('input[type="checkbox"]')){
          if(e.target.dataset.all){ box.__pbTemp=new Set(); }
          else { if(e.target.checked) box.__pbTemp.add(e.target.value); else box.__pbTemp.delete(e.target.value); }
          drawFilterList(box,(box.querySelector('.pb-filter-search')||{}).value||'');
        }
      });
    }
  }
  function drawFilterList(box, term){
    var list=box.querySelector('.pb-filter-list'); if(!list)return;
    var values=box.__pbValues||[]; var temp=box.__pbTemp||new Set(); var t=txt(term).toLowerCase();
    var visible=values.filter(function(v){return !t || txt(v).toLowerCase().indexOf(t)>=0;});
    list.innerHTML='<label class="pb-filter-option"><input type="checkbox" value="" data-all="1" '+(!temp.size?'checked':'')+'>Select All</label>'+visible.map(function(v){return '<label class="pb-filter-option"><input type="checkbox" value="'+esc(v)+'" '+(temp.has(v)?'checked':'')+'>'+esc(v)+'</label>';}).join('');
  }
  function closeMultis(except){ document.querySelectorAll('.pb-filter-box.open').forEach(function(b){ if(b!==except)b.classList.remove('open'); }); }
  document.addEventListener('click',function(e){ if(!e.target.closest('.pb-filter-box')) closeMultis(); });
  function updateMultiCaption(box){ var vals=selected(box.id); var btn=box.querySelector('.pb-filter-btn'); if(btn)btn.textContent=vals.length?((vals.length===1?vals[0]:vals.length+' selected')):'All'; }
  function ensureFilterClearButton(containerSelector, id, label, handler){
    var cont=document.querySelector(containerSelector); if(!cont || $(id)) return;
    var host=document.createElement('div'); host.className='pb-filter-box pb-clear-filter-box';
    host.innerHTML='<div class="pb-filter-label">&nbsp;</div><button type="button" id="'+id+'" class="pb-btn pb-clear-filter-data">'+label+'</button>';
    cont.appendChild(host); var b=$(id); if(b) b.onclick=handler;
  }
  function sideKey(el){
    var k = el && (el.getAttribute('data-pb-tab') || el.getAttribute('data-fb-tab-key') || el.getAttribute('data-tab') || '');
    if(k) return k;
    var t=txt(el ? el.textContent : '').toLowerCase();
    if(t.indexOf('dashboard')>=0)return 'dashboard';
    if(t.indexOf('gspn')>=0)return 'gspn';
    if(t.indexOf('sky')>=0)return 'sky';
    if(t.indexOf('pre_booking')>=0||t.indexOf('pre booking')>=0)return 'preBooking';
    if(t.indexOf('return cases')>=0)return 'returnCases';
    if(t.indexOf('profit')>=0||t.indexOf('commission')>=0)return 'profit';
    if(t.indexOf('cash')>=0||t.indexOf('target')>=0)return 'cashTarget';
    if(t.indexOf('user management')>=0)return 'userManagement';
    return '';
  }
  function makeSideTab(key,label,iconHtml){
    return '<div class="side-tab" data-pb-tab="'+key+'" data-fb-tab-key="'+key+'" onclick="switchTab(&quot;'+key+'&quot;)">'+(iconHtml||'')+'<span class="side-label">'+label+'</span></div>';
  }
  function sidebarBottom(){
    var side=$('sideMenu')||document.querySelector('.side-menu,.sidebar,.side-nav'); if(!side)return null;
    var bottom=$('codexSidebarBottom');
    if(!bottom){ bottom=document.createElement('div'); bottom.id='codexSidebarBottom'; bottom.className='codex-sidebar-bottom'; }
    bottom.classList.remove('side-label');
    bottom.style.order='80';
    if(bottom.parentNode!==side) side.appendChild(bottom);
    return bottom;
  }
  function orderSideTabs(){
    var side=$('sideMenu')||document.querySelector('.side-menu,.sidebar,.side-nav'); if(!side)return;
    var bottom=sidebarBottom();
    var order=['dashboard','gspn','sky','preBooking','returnCases','receivedDelivered','profit','cashTarget','userManagement'];
    var tabs=Array.from(side.querySelectorAll('.side-tab'));
    tabs.forEach(function(el){ var k=sideKey(el); if(k){ el.setAttribute('data-pb-tab',k); el.setAttribute('data-fb-tab-key',k); }
      if(k==='dashboard' && !el.querySelector('.side-icon,.side-tab-logo,.tab-logo-img')) el.insertAdjacentHTML('afterbegin','<span class="side-icon dashboard-side-icon">📊</span>');
      if(k==='preBooking' && !el.querySelector('.side-icon,.side-tab-logo,.tab-logo-img')) el.insertAdjacentHTML('afterbegin','<span class="side-icon prebooking-side-icon">📋</span>');
      if(k==='returnCases' && !el.querySelector('.side-icon,.side-tab-logo,.tab-logo-img')) el.insertAdjacentHTML('afterbegin','<span class="side-icon returncases-side-icon">↩️</span>');
    });
    var workspace=Array.from(side.querySelectorAll('.side-section-title')).find(function(x){return /workspace/i.test(x.textContent||'');});
    var anchor=workspace ? workspace.nextSibling : (bottom || null);
    order.forEach(function(k){
      var el=Array.from(side.querySelectorAll('.side-tab')).find(function(x){return sideKey(x)===k;});
      if(el){ side.insertBefore(el, bottom || null); }
    });
    if(bottom && bottom.parentNode===side) side.appendChild(bottom);
    var colorBlock=$('v25ColorOptions');
    if(colorBlock && colorBlock.parentElement && bottom && colorBlock.parentElement.parentNode===side) bottom.appendChild(colorBlock.parentElement);
    var design=side.querySelector('.design-options');
    if(design && bottom){
      Array.from(bottom.querySelectorAll('.codex-sidebar-design-wrap')).forEach(function(w){
        if(!w.querySelector('.design-options') && !(w.textContent||'').trim()) w.remove();
      });
      var wrap=bottom.querySelector('.codex-sidebar-design-wrap');
      if(!wrap){ wrap=document.createElement('div'); wrap.className='codex-sidebar-design-wrap'; bottom.appendChild(wrap); }
      var title=design.previousElementSibling;
      if(title && title.classList && title.classList.contains('side-section-title') && title.parentNode!==wrap) wrap.insertBefore(title, wrap.firstChild);
      if(design.parentNode!==wrap) wrap.appendChild(design);
      bottom.appendChild(wrap);
    }
    var refresh=$('codexGithubRefreshBtn'); if(refresh && bottom && refresh.parentNode!==bottom) bottom.insertBefore(refresh,bottom.firstChild);
    if(document.body.classList.contains('firebase-admin') || document.documentElement.classList.contains('admin')){
      side.querySelectorAll('[data-pb-tab="dashboard"],[data-pb-tab="preBooking"]').forEach(function(el){ el.classList.remove('fb-tab-denied'); el.style.display=''; el.style.visibility=''; });
    }
  }
  function ensureTabs(){ document.querySelectorAll('.side-tab').forEach(function(t){ if(/analyses dashboard/i.test(t.textContent||'')) t.remove(); }); var ap=document.getElementById('analysisPage'); if(ap) ap.remove();
    var side=$('sideMenu')||document.querySelector('.side-menu,.sidebar,.side-nav');
    if(side&&!Array.from(side.querySelectorAll('.side-tab')).some(function(x){return sideKey(x)==='dashboard';})){
      var workspace=Array.from(side.querySelectorAll('.side-section-title')).find(function(x){return /workspace/i.test(x.textContent||'');});
      (workspace||side).insertAdjacentHTML(workspace?'afterend':'afterbegin', makeSideTab('dashboard','Dashboard','<span class="side-icon dashboard-side-icon">📊</span>'));
    }
    if(side&&!Array.from(side.querySelectorAll('.side-tab')).some(function(x){return sideKey(x)==='preBooking';})){
      var ref=Array.from(side.querySelectorAll('.side-tab')).find(function(x){return sideKey(x)==='sky';});
      var html=makeSideTab('preBooking','Pre_Booking','<span class="side-icon prebooking-side-icon">📋</span>');
      if(ref)ref.insertAdjacentHTML('afterend',html); else side.insertAdjacentHTML('beforeend',html);
    }
    orderSideTabs();
    if(!$('preBookingPage')) document.body.insertAdjacentHTML('beforeend', preBookingPageHtml());
    if(!$('dashboardPage')) document.body.insertAdjacentHTML('beforeend', dashboardPageHtml());
    if(!$('pbDrill')) document.body.insertAdjacentHTML('beforeend','<div class="pb-drill" id="pbDrill"><div class="pb-drill-box"><div class="pb-drill-head"><h2 id="pbDrillTitle">Details</h2><div><button class="pb-btn" onclick="window.pbDownloadDrill&&window.pbDownloadDrill()">Download</button> <button class="pb-btn light" onclick="document.getElementById(&quot;pbDrill&quot;).style.display=&quot;none&quot;">Close</button></div></div><div class="pb-table-wrap"><table class="pb-table" id="pbDrillTable"></table></div></div></div>');
  }
  function filterBox(id,title){ return '<div class="pb-filter-box" id="'+id+'" data-title="'+esc(title)+'"></div>'; }
  function preBookingPageHtml(){ return '<div class="page-shell" id="preBookingPage"><header><div class="brand"><div class="logo-box"><img src="assets/SKY.PNG" loading="eager" decoding="async" fetchpriority="high" data-site-logo="1" alt="Logo"></div><div><h1>Service Support Center</h1><div class="sub">Pre_Booking</div></div></div><div class="header-actions"></div></header><main><div class="pb-filters">'+filterBox('pbBranchFilter','Branch')+filterBox('pbRequesterFilter','Requester')+filterBox('pbStatusFilter','Status')+filterBox('pbCancelFilter','Cancellation Reason')+filterBox('pbMonthFilter','Months only')+'<div><div class="filter-label">Search</div><input id="pbSearch" placeholder="Search all columns"></div></div><div class="pb-grid"><div class="pb-card" data-pb-status="Done"><div class="label">Done</div><div class="value" id="pbDone">0</div></div><div class="pb-card" data-pb-status="Waiting"><div class="label">Waiting</div><div class="value" id="pbWaiting">0</div></div><div class="pb-card" data-pb-status="Cancelled"><div class="label">Cancelled</div><div class="value" id="pbCancelled">0</div></div></div><section class="pb-section"><h2>Pre_Booking Data <span><button class="pb-btn" onclick="window.pbDownloadFiltered()">Download Data</button> <button class="pb-btn light" onclick="window.pbClearFilters()">Clear Filters</button></span></h2><div class="pb-table-wrap"><table class="pb-table" id="pbTable"></table></div></section></main></div>'; }
  function dashboardPageHtml(){ return '<div class="page-shell" id="dashboardPage"><header><div class="brand"><div class="logo-box"><img src="assets/SKY.PNG" loading="eager" decoding="async" fetchpriority="high" data-site-logo="1" alt="Logo"></div><div><h1>Dashboard</h1><div class="sub">Interactive summary tables from SKY, GSPN, and Pre_Booking</div></div></div><div class="header-actions"></div></header><main><div class="pb-filters">'+filterBox('dashBranchFilter','Branch')+'</div><div class="pb-dashboard-row"><section class="pb-section"><h2>Open Cases with Aging</h2><div class="pb-table-wrap"><table class="pb-table" id="dashSkyOpenAging"></table></div></section><section class="pb-section"><h2>Ready Cases with Aging</h2><div class="pb-table-wrap"><table class="pb-table" id="dashSkyReadyAging"></table></div></section></div><div class="pb-dashboard-row"><section class="pb-section"><h2>GSPN Cases with Aging</h2><div class="pb-table-wrap"><table class="pb-table" id="dashGspnAging"></table></div></section><section class="pb-section"><h2>GSPN Cases with Stage</h2><div class="pb-table-wrap"><table class="pb-table" id="dashGspnStage"></table></div></section></div><section class="pb-section"><h2>Pre Booking Cases</h2><div class="pb-table-wrap"><table class="pb-table" id="dashPreBooking"></table></div></section></main></div>'; }
  async function waitForXLSX(){
    if(window.XLSX) return true;
    var start=Date.now();
    while(!window.XLSX && Date.now()-start<8000){
      await new Promise(function(resolve){ setTimeout(resolve,120); });
    }
    if(!window.XLSX) throw new Error('XLSX library is not loaded');
    return true;
  }
  async function fetchWorkbook(manual){
    await waitForXLSX();
    var files=['Pre_Booking.xlsx']; var last;
    for(var i=0;i<files.length;i++){
      try{
        var url=await serviceDataUrl(files[i], !!manual);
        var res=await fetch(url,{cache: manual ? 'no-store' : 'no-cache'});
        if(!res.ok) throw new Error(files[i]+' HTTP '+res.status);
        var buf=await res.arrayBuffer();
        var wb=/\.csv$/i.test(files[i])
          ? XLSX.read(new TextDecoder().decode(buf),{type:'string',raw:true,cellDates:true})
          : XLSX.read(new Uint8Array(buf),{type:'array',raw:true,cellDates:true});
        var sn=wb.SheetNames.includes('Pre_Booking')?'Pre_Booking':wb.SheetNames[0];
        return XLSX.utils.sheet_to_json(wb.Sheets[sn],{defval:'',raw:false});
      }catch(e){ last=e; }
    }
    throw last||new Error('Pre_Booking file not found');
  }
  async function loadPreBooking(manual){
    ensureTabs();
    if(window.__preBookingLoadInFlight) return window.__preBookingLoadInFlight;
    window.__preBookingLoadInFlight = (async function(){
      try{localStorage.removeItem('serviceV2Last_preBooking');}catch(_e){}
      var raw=null, source='GitHub: Pre_Booking.xlsx';
      try{
        if(manual) serviceClearDataVersion('Pre_Booking.xlsx');
        raw=await fetchWorkbook(!!manual);
      }catch(e){
        console.error(e);
        raw=[];
        source='GitHub load failed';
      }
      pbRows=(raw||[]).map(normalizePB).filter(function(r){return txt(r.Branch)||txt(r.Status)||txt(r['SO NO']);});
      window.preBookingRows=pbRows;
      initPBFilters();
      renderPB();
      if($('pbUpdated'))$('pbUpdated').textContent=new Date().toLocaleString()+' - '+source;
      try{var n=document.getElementById('serviceV2Notice_preBooking'); if(n){ n.innerHTML='<span class="source">Pre_Booking — Data updated</span><span>Source: <b>Auto sync</b></span><span>Rows: <b>'+pbRows.length.toLocaleString()+'</b></span><span>Last Update: <b>'+new Date().toLocaleString()+'</b></span><span>Fresh data loaded by Auto sync</span>'; }}catch(_e){}
      renderDashboardTables();
      return pbRows;
    })();
    try{return await window.__preBookingLoadInFlight;} finally{ window.__preBookingLoadInFlight=null; }
  }
  function initPBFilters(){ fillMulti('pbBranchFilter',uniq(pbRows.map(function(r){return r.Branch;}))); fillMulti('pbRequesterFilter',uniq(pbRows.map(function(r){return r.Requester;}))); fillMulti('pbStatusFilter',uniq(pbRows.map(function(r){return r.Status;}))); fillMulti('pbCancelFilter',uniq(pbRows.map(function(r){return r['Cancellation Reason'];}))); fillMulti('pbMonthFilter',uniq(pbRows.map(function(r){return r.Month;}))); ensureFilterClearButton('#preBookingPage .pb-filters','pbClearFilterDataBtn','Clear Filter Data',function(){ window.pbClearFilters&&window.pbClearFilters(true); }); ['pbBranchFilter','pbRequesterFilter','pbStatusFilter','pbCancelFilter','pbMonthFilter'].forEach(function(id){ var el=$(id); if(el&&!el.__pbListen){ el.__pbListen=true; el.addEventListener('pbchange',renderPB); } }); var s=$('pbSearch'); if(s&&!s.__pb){ s.__pb=true; s.addEventListener('input',renderPB); } document.querySelectorAll('#preBookingPage .pb-card[data-pb-status]').forEach(function(card){ if(!card.__pb){ card.__pb=true; card.onclick=function(){ var st=card.getAttribute('data-pb-status'); pbStatusCard=(pbStatusCard===st?'':st); renderPB(); }; } }); }
  function statusMatches(rowStatus, cardStatus){ var s=txt(rowStatus).toLowerCase(); var c=txt(cardStatus).toLowerCase(); if(!c)return true; if(c==='waiting') return s.indexOf('wait')>=0||s==='pending'||s==='open'; return s===c.toLowerCase()||s.indexOf(c.toLowerCase())>=0; }
  function renderPB(){ var b=selected('pbBranchFilter'), req=selected('pbRequesterFilter'), st=selected('pbStatusFilter'), ca=selected('pbCancelFilter'), mo=selected('pbMonthFilter'), q=txt(($('pbSearch')||{}).value).toLowerCase(); var base=pbRows.filter(function(r){return (!b.length||b.indexOf(r.Branch)>=0)&&(!req.length||req.indexOf(r.Requester)>=0)&&(!st.length||st.indexOf(r.Status)>=0)&&(!ca.length||ca.indexOf(r['Cancellation Reason'])>=0)&&(!mo.length||mo.indexOf(r.Month)>=0)&&(!q||PB_COLS.some(function(c){return txt(r[c]).toLowerCase().indexOf(q)>=0;}));}); var counts={Done:0,Waiting:0,Cancelled:0}; base.forEach(function(r){ Object.keys(counts).forEach(function(k){ if(statusMatches(r.Status,k))counts[k]++; }); }); ['Done','Waiting','Cancelled'].forEach(function(k){ var el=$('pb'+k); if(el)el.textContent=counts[k].toLocaleString(); var card=document.querySelector('#preBookingPage .pb-card[data-pb-status="'+k+'"]'); if(card)card.classList.toggle('active',pbStatusCard===k); }); pbFiltered=pbStatusCard?base.filter(function(r){return statusMatches(r.Status,pbStatusCard);}):base; renderTable('pbTable',pbFiltered,PB_COLS,'preBooking'); }
  function renderTable(id, rows, cols, source){
    var tbl=$(id); if(!tbl)return;
    if(source==='preBooking' && Array.isArray(window.pbColumnOrder)){ cols=window.pbColumnOrder.filter(function(c){return PB_COLS.indexOf(c)>=0;}); }
    tbl.innerHTML='<thead><tr>'+cols.map(function(c){return '<th draggable="'+(source==='preBooking'?'true':'false')+'" data-col="'+esc(c)+'">'+esc(c)+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(r){return '<tr>'+cols.map(function(c){return '<td>'+esc(cellText(r,c))+'</td>';}).join('')+'</tr>';}).join('')+'</tbody>';
    tbl.querySelectorAll('th').forEach(function(th){
      th.onclick=function(){ var c=th.dataset.col; var dir=th.dataset.dir==='1'?-1:1; th.dataset.dir=String(dir); rows.sort(function(a,b){ var av=isPBDateCol(c)?(toDate(a[c])||0):txt(a[c]); var bv=isPBDateCol(c)?(toDate(b[c])||0):txt(b[c]); return (av instanceof Date && bv instanceof Date ? av-bv : txt(av).localeCompare(txt(bv),undefined,{numeric:true}))*dir;}); renderTable(id,rows,cols,source); };
      if(source==='preBooking'){
        th.addEventListener('dragstart',function(e){ e.dataTransfer.setData('text/plain',th.dataset.col); });
        th.addEventListener('dragover',function(e){ e.preventDefault(); th.classList.add('pb-drag-over'); });
        th.addEventListener('dragleave',function(){ th.classList.remove('pb-drag-over'); });
        th.addEventListener('drop',function(e){ e.preventDefault(); th.classList.remove('pb-drag-over'); var from=e.dataTransfer.getData('text/plain'), to=th.dataset.col; if(!from||from===to)return; var order=(window.pbColumnOrder||PB_COLS.slice()).slice(); var fi=order.indexOf(from), ti=order.indexOf(to); if(fi<0||ti<0)return; order.splice(ti,0,order.splice(fi,1)[0]); window.pbColumnOrder=order; renderTable(id,rows,order,source); });
      }
    });
  }
  function downloadRows(rows, cols, name){ if(!window.XLSX){ alert('XLSX library is not loaded'); return; } var ws=XLSX.utils.json_to_sheet(rows.map(function(r){ var o={}; cols.forEach(function(c){o[c]=r[c];}); return o;})); var wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'Data'); XLSX.writeFile(wb,name); }

  async function loadDashboardSources(forceRefresh){
    ensureTabs();
    var jobs=[];
    if(typeof window.autoLoadSKYFromGitHub==='function') jobs.push(window.autoLoadSKYFromGitHub(!!forceRefresh));
    if(typeof window.autoLoadGSPNFromGitHub==='function') jobs.push(window.autoLoadGSPNFromGitHub(!!forceRefresh));
    if(typeof window.autoLoadProfitFromGitHub==='function') jobs.push(window.autoLoadProfitFromGitHub(!!forceRefresh));
    if(typeof window.loadCashTargetFromGitHub==='function') jobs.push(window.loadCashTargetFromGitHub(!!forceRefresh));
    if(typeof window.loadPreBooking==='function') jobs.push(window.loadPreBooking(!!forceRefresh));
    if(typeof window.loadReturnCases==='function') jobs.push(window.loadReturnCases(!!forceRefresh));
    if(typeof window.loadReceivedDelivered==='function') jobs.push(window.loadReceivedDelivered(!!forceRefresh));
    await Promise.allSettled(jobs);
    if(typeof renderDashboardTables==='function') renderDashboardTables();
  }
  window.loadDashboardSources = loadDashboardSources;

  window.pbDownloadFiltered=function(){ downloadRows(pbFiltered,PB_COLS,'Pre_Booking_Filtered.xlsx'); };
  window.pbClearFilters=function(){ ['pbBranchFilter','pbRequesterFilter','pbStatusFilter','pbCancelFilter','pbMonthFilter'].forEach(function(id){ var e=$(id); if(e){ e.__pbSelected=[]; e.__pbTemp=new Set(); updateMultiCaption(e); drawFilterList(e,''); }}); if($('pbSearch'))$('pbSearch').value=''; pbStatusCard=''; renderPB(); };
  function getSkyRows(){ return Array.isArray(window.skyRows)?window.skyRows:(Array.isArray(window.currentSkyRows)?window.currentSkyRows:[]); }
  function getGspnRows(){ return Array.isArray(window.allRows)?window.allRows:(Array.isArray(window.currentFilteredRows)?window.currentFilteredRows:[]); }
  function branchOf(r,src){ return src==='gspn'?txt(val(r,['GSPN_Branch','Branch'])):txt(val(r,['Branch','GSPN_Branch'])); }
  function ageDays(r){ return num(val(r,['Aging Days','Aging_Days','GSPN Aging Days','GSPN_Aging_Days','AgingDays','Ageing Days'])); }
  function skyAgingBucket(r){ var g=txt(val(r,['Aging Days Group','Aging_Days_Group'])); if(g)return g; var d=ageDays(r); return d<=3?'From 0 to 3 Days':(d<=10?'From 4 to 10 Days':'More than 10 Days'); }
  function readyBucket(r){ var d=ageDays(r); if(!d){ var od=toDate(val(r,['Open Case Date','Open_Date','Open Date'])); if(od)d=Math.floor((Date.now()-od)/(864e5)); } return d<=90?'From 1 to 3 Months':(d<=210?'From 4 to 7 Months':'More than 7 Months'); }
  function filterBranch(rows,src){ var b=selected('dashBranchFilter'); return rows.filter(function(r){return !b.length||b.indexOf(branchOf(r,src))>=0;}); }
  function pivot(id, rows, rowFn, colFn, cols, src, title){ var map={}, totals={}, grand=0; rows.forEach(function(r){ var br=rowFn(r)||'(blank)', c=colFn(r)||'(blank)'; if(cols&&cols.indexOf(c)<0) cols.push(c); map[br]=map[br]||{}; map[br][c]=(map[br][c]||0)+1; totals[c]=(totals[c]||0)+1; grand++; }); var branches=Object.keys(map).sort(); cols=cols&&cols.length?cols:Array.from(new Set(Object.values(map).flatMap(function(o){return Object.keys(o);}))).sort(); var html='<thead><tr><th>Branch</th>'+cols.map(function(c){return '<th>'+esc(c)+'</th>';}).join('')+'<th>Grand Total</th></tr></thead><tbody>'; branches.forEach(function(br){ var rt=0; html+='<tr><td>'+esc(br)+'</td>'; cols.forEach(function(c){ var v=map[br][c]||0; rt+=v; html+='<td><span class="pb-click" data-src="'+src+'" data-title="'+esc(title)+'" data-branch="'+esc(br)+'" data-col="'+esc(c)+'">'+v+'</span></td>'; }); html+='<td><span class="pb-click" data-src="'+src+'" data-title="'+esc(title)+'" data-branch="'+esc(br)+'" data-col="__all__">'+rt+'</span></td></tr>'; }); html+='<tr class="pb-total"><td>Grand Total</td>'; cols.forEach(function(c){html+='<td>'+((totals[c]||0).toLocaleString())+'</td>';}); html+='<td>'+grand.toLocaleString()+'</td></tr></tbody>'; var tbl=$(id); if(tbl){ tbl.innerHTML=html; attachPivotClicks(tbl, rows, rowFn, colFn, src, title); sortablePivot(tbl); } }
  function attachPivotClicks(tbl, baseRows, rowFn, colFn, src, title){ tbl.querySelectorAll('.pb-click').forEach(function(el){ el.onclick=function(){ var br=el.dataset.branch, c=el.dataset.col; var rows=baseRows.filter(function(r){return (rowFn(r)||'(blank)')===br && (c==='__all__'||(colFn(r)||'(blank)')===c);}); drill(title+' - '+br+' - '+(c==='__all__'?'All':c), rows, src); }; }); }
  function sortablePivot(tbl){ tbl.querySelectorAll('th').forEach(function(th,i){ th.onclick=function(){ var tb=tbl.tBodies[0], trs=Array.from(tb.querySelectorAll('tr:not(.pb-total)')); var dir=th.dataset.dir==='1'?-1:1; th.dataset.dir=String(dir); trs.sort(function(a,b){return txt(a.cells[i].innerText).localeCompare(txt(b.cells[i].innerText),undefined,{numeric:true})*dir;}); var total=tb.querySelector('.pb-total'); tb.innerHTML=''; trs.forEach(function(tr){tb.appendChild(tr);}); if(total)tb.appendChild(total); }; }); }
  var lastDrillRows=[], lastDrillCols=[];
  function drill(title, rows, src){ var cols=src==='preBooking'?PB_COLS:(src==='gspn'?['SO NO#','GSPN_Branch','GSPN_Status','Stage','GSPN Aging Days','GSPN Open Date','GSPN JobType','GSPN Warranty']:['Job_Number','Branch','Queue','Stage','Aging Days Group','Aging Days','Open Case Date','Brand','JobType']); lastDrillRows=rows.map(function(r){var o={}; cols.forEach(function(c){o[c]=val(r,[c]);}); return o;}); lastDrillCols=cols; $('pbDrillTitle').textContent=title+' ('+rows.length.toLocaleString()+')'; renderTable('pbDrillTable', lastDrillRows, cols, src); $('pbDrill').style.display='flex'; }
  window.pbDownloadDrill=function(){ downloadRows(lastDrillRows,lastDrillCols,'Dashboard_Details.xlsx'); };
  function renderDashboardTables(){
    ensureTabs();
    var branches=uniq([].concat(
      getSkyRows().map(function(r){return branchOf(r,'sky');}),
      getGspnRows().map(function(r){return branchOf(r,'gspn');}),
      pbRows.map(function(r){return r.Branch;})
    ));
    fillMulti('dashBranchFilter',branches);
    ensureFilterClearButton('#dashboardPage .pb-filters','dashClearFilterDataBtn','Clear Filter Data',function(){ var d=$('dashBranchFilter'); if(d){ d.__pbSelected=[]; d.__pbTemp=new Set(); updateMultiCaption(d); drawFilterList(d,''); } renderDashboardTables(); });
    var d=$('dashBranchFilter');
    if(d&&!d.__pbListen){ d.__pbListen=true; d.addEventListener('pbchange',renderDashboardTables); }
    var sky=filterBranch(getSkyRows(),'sky'), gspn=filterBranch(getGspnRows(),'gspn'), pre=filterBranch(pbRows,'preBooking');
    pivot('dashSkyOpenAging', sky.filter(function(r){return txt(val(r,['Queue']))==='Open_Cases';}), function(r){return branchOf(r,'sky');}, skyAgingBucket, ['From 0 to 3 Days','From 4 to 10 Days','More than 10 Days'], 'sky','Open Cases with Aging');
    pivot('dashSkyReadyAging', sky.filter(function(r){return txt(val(r,['Queue']))==='Ready For Delivery Cases';}), function(r){return branchOf(r,'sky');}, readyBucket, ['From 1 to 3 Months','From 4 to 7 Months','More than 7 Months'], 'sky','Ready Cases with Aging');
    pivot('dashGspnAging', gspn, function(r){return branchOf(r,'gspn');}, function(r){return String(ageDays(r)||txt(val(r,['GSPN Aging Days','Aging Days']))||'(blank)');}, [], 'gspn','GSPN Cases with Aging');
    pivot('dashGspnStage', gspn, function(r){return branchOf(r,'gspn');}, function(r){return txt(val(r,['Stage','GSPN Stage','GSPN_Status']))||'(blank)';}, ['Parts Operation','Under Repair','Waiting Cancellation','Waiting Customer','Waiting Samsung'], 'gspn','GSPN Cases with Stage');
    pivot('dashPreBooking', pre, function(r){return r.Branch;}, function(r){return r.Status||'(blank)';}, [], 'preBooking','Pre Booking Cases');
  }
  var oldSwitch=window.switchTab;
  window.switchTab=function(tab){
    ensureTabs();
    if(tab==='preBooking'||tab==='dashboard'){
      ['gspnPage','skyPage','profitPage','cashTargetPage','userManagementPage','preBookingPage','returnCasesPage','dashboardPage','repairEfficiencyPage'].forEach(function(id){var e=$(id); if(e)e.style.display=(id===(tab+'Page')?'block':'none');});
      document.querySelectorAll('.side-tab').forEach(function(el){el.classList.toggle('active', sideKey(el)===tab);});
      localStorage.setItem('serviceEyeActiveTab',tab);
      if(tab==='preBooking'){
        if(!Array.isArray(pbRows) || !pbRows.length || !Array.isArray(window.preBookingRows) || !window.preBookingRows.length) loadPreBooking(false);
        else renderPB();
      }
      if(tab==='dashboard'){
        renderDashboardTables();
        if(!pbRows.length && typeof loadPreBooking==='function') loadPreBooking(false);
        if((!Array.isArray(window.skyRows) || !window.skyRows.length) && typeof window.autoLoadSKYFromGitHub==='function') setTimeout(function(){ window.autoLoadSKYFromGitHub(); },250);
        if((!Array.isArray(window.allRows) || !window.allRows.length) && typeof window.autoLoadGSPNFromGitHub==='function') setTimeout(function(){ window.autoLoadGSPNFromGitHub(); },500);
      }
      return;
    }
    if(typeof oldSwitch==='function'){
      var r=oldSwitch.apply(this,arguments);
      setTimeout(orderSideTabs,50);
      return r;
    }
  };
  window.loadPreBooking=loadPreBooking; window.renderDashboardTables=renderDashboardTables;
  document.addEventListener('DOMContentLoaded',function(){ setTimeout(function(){ ensureTabs(); var a=localStorage.getItem('serviceEyeActiveTab')||''; var pb=document.getElementById('preBookingPage'); if(a==='preBooking' || (pb && pb.style.display!=='none')) loadPreBooking(false); if(a==='dashboard' && typeof window.loadDashboardSources==='function') window.loadDashboardSources(false); setInterval(function(){ var t=localStorage.getItem('serviceEyeActiveTab')||''; if(t==='preBooking') loadPreBooking(false); if(t==='dashboard' && typeof window.loadDashboardSources==='function') window.loadDashboardSources(false); },3*60*60*1000); }, 700); });
})();


/* ===== returnCasesTabPatch ===== */

(function(){
  'use strict';
  var FILE_CANDIDATES=['Return Cases.xlsx'];
  var SHEET='Return Cases';
  var rcRows=[], rcFiltered=[], rcCols=[], rcSort={col:null,dir:1};
  var rcTechSort={col:1,dir:-1}, rcModelSort={col:1,dir:-1};
  var rcCardFilter={type:'',value:''};
  var monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];
  function $(id){return document.getElementById(id);} function txt(v){return String(v==null?'':v).trim();}
  function esc(v){return txt(v).replace(/[&<>"']/g,function(s){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s];});}
  function val(r,names){for(var i=0;i<names.length;i++){if(r&&r[names[i]]!==undefined&&r[names[i]]!==null&&txt(r[names[i]])!=='')return r[names[i]];} return '';}
  function toDate(v){ if(!v)return null; if(v instanceof Date&&!isNaN(v))return v; if(typeof v==='number'){var d=new Date(Math.round((v-25569)*86400*1000)); return isNaN(d)?null:d;} var s=txt(v); var d=new Date(s); return isNaN(d)?null:d; }
  function fmtDate(v){var d=toDate(v); if(!d)return txt(v); return String(d.getDate()).padStart(2,'0')+'-'+monthNames[d.getMonth()]+'-'+d.getFullYear();}
  function isFirst(r){return /first\s*received/i.test(txt(val(r,['Days since Last Received','Days Since Last Received','Return Status','Return_Status','Return Cases','Return_Cases','ReturnCases'])));}
  function countBy(rows,field){var m={}; rows.forEach(function(r){var k=txt(val(r,Array.isArray(field)?field:[field]))||'(blank)'; m[k]=(m[k]||0)+1;}); return m;}
  function topEntry(map){var arr=Object.entries(map).sort(function(a,b){return b[1]-a[1]||a[0].localeCompare(b[0]);}); return arr[0]||['-',0];}
  function keyOf(el){var k=el&&(el.getAttribute('data-pb-tab')||el.getAttribute('data-fb-tab-key')||''); if(k)return k; var t=txt(el?el.textContent:'').toLowerCase(); if(t.includes('dashboard'))return 'dashboard'; if(t.includes('gspn'))return 'gspn'; if(t.includes('sky'))return 'sky'; if(t.includes('pre_booking')||t.includes('pre booking'))return 'preBooking'; if(t.includes('return cases'))return 'returnCases'; if(t.includes('profit'))return 'profit'; if(t.includes('cash'))return 'cashTarget'; if(t.includes('user management'))return 'userManagement'; return '';}
  function orderSide(){var side=$('sideMenu')||document.querySelector('.side-menu,.sidebar,.side-nav'); if(!side)return; var seen={}; Array.from(side.querySelectorAll('.side-tab')).forEach(function(x){var k=keyOf(x); if(!k)return; x.setAttribute('data-pb-tab',k); x.setAttribute('data-fb-tab-key',k); if(seen[k]) x.remove(); else seen[k]=x;}); ['dashboard','gspn','sky','preBooking','returnCases','profit','cashTarget','userManagement'].forEach(function(k,i){var el=Array.from(side.querySelectorAll('.side-tab')).find(function(x){return keyOf(x)===k;}); if(el){el.setAttribute('data-pb-tab',k);el.setAttribute('data-fb-tab-key',k);el.style.order=String(20+i);var bottom=document.getElementById('codexSidebarBottom');side.insertBefore(el,bottom||null);}});}
  function ensureSide(){var side=$('sideMenu')||document.querySelector('.side-menu,.sidebar,.side-nav'); if(!side)return; var exists=Array.from(side.querySelectorAll('.side-tab')).some(function(e){return keyOf(e)==='returnCases';}); if(!exists){var ref=Array.from(side.querySelectorAll('.side-tab')).find(function(e){return keyOf(e)==='preBooking';}); var html='<div class="side-tab" data-pb-tab="returnCases" data-fb-tab-key="returnCases" onclick="switchTab(\'returnCases\')"><span class="side-icon returncases-side-icon">↩️</span><span class="side-label">Return Cases</span></div>'; if(ref&&ref.parentNode)ref.insertAdjacentHTML('afterend',html); else side.insertAdjacentHTML('beforeend',html);} orderSide();}
  function filterBox(id,label){return '<div class="rc-filter-box" id="'+id+'"><div class="rc-filter-label">'+label+'</div><button type="button" class="rc-filter-btn">All</button><div class="rc-filter-menu"><input class="rc-filter-search" placeholder="Search"><div class="rc-filter-list"></div><div class="rc-filter-actions-menu"><button type="button" class="ok">OK</button><button type="button" class="cancel">Cancel</button></div></div></div>';}
  function pageHtml(){return '<div class="page-shell" id="returnCasesPage" style="display:none"><header><div class="brand"><div class="logo-box"><img src="assets/SKY.PNG" loading="eager" decoding="async" fetchpriority="high" data-site-logo="1" alt="Logo"></div><div><h1>Service Support Center</h1><div class="sub">Return Cases</div></div></div><div class="header-actions"></div></header><div id="serviceV2Notice_returnCases" class="service-v2-update-notice"><span class="source">Return Cases — Waiting for data</span><span>Source: <b>Auto sync</b></span><span>Rows: <b>0</b></span><span>Last Update: <b>-</b></span><span>Waiting for data</span></div><main><div class="rc-filters">'+filterBox('rcBrandFilter','Brand')+filterBox('rcBranchFilter','Branch')+filterBox('rcAssignedFilter','Assigned_To')+filterBox('rcModelFilter','Model')+'<div><div class="rc-filter-label">Open_Date From</div><input type="date" id="rcDateFrom"></div><div><div class="rc-filter-label">Open_Date To</div><input type="date" id="rcDateTo"></div><div><div class="rc-filter-label">Search</div><input id="rcSearch" placeholder="Search all columns"></div><div class="rc-filter-actions"><button class="rc-btn light" id="rcClearBtn">Clear Filters</button></div></div><div class="rc-cards cards"><div class="card rc-card clickable blue" data-card="branch"><div class="label">Top Return Branch</div><div class="value" id="rcTopBranch">-</div><div class="percent" id="rcTopBranchCount">0 cases</div></div><div class="card rc-card clickable purple" data-card="tech"><div class="label">Top Return Technician</div><div class="value" id="rcTopTech">-</div><div class="percent" id="rcTopTechCount">0 cases</div></div><div class="card rc-card clickable green" data-card="model"><div class="label">Top Model</div><div class="value" id="rcTopModel">-</div><div class="percent" id="rcTopModelCount">0 cases</div></div></div><section class="rc-section"><h2>Return Cases Data <span><button class="rc-btn" onclick="window.rcDownloadFiltered()">⬇ Download Excel</button></span></h2><div class="rc-table-wrap"><table class="rc-table" id="rcTable"></table></div></section><section class="rc-section"><h2>Return Cases by Branch and Technician <span><button class="rc-btn" onclick="window.rcDownloadTechTable()">⬇ Download</button></span></h2><div class="rc-table-wrap"><table class="rc-table" id="rcTechTable"></table></div></section><section class="rc-section"><h2>Return Cases by Model <span><button class="rc-btn" onclick="window.rcDownloadModelTable()">⬇ Download</button></span></h2><div class="rc-table-wrap small"><table class="rc-table" id="rcModelTable"></table></div></section></main></div>';}
  function normalizeNotice(){var page=$('returnCasesPage'); if(!page)return; var list=Array.from(document.querySelectorAll('#serviceV2Notice_returnCases')); var keep=list.find(function(n){return page.contains(n);})||list[0]; list.forEach(function(n){if(n!==keep)n.remove();}); if(keep&&!page.contains(keep)){var h=page.querySelector('header'); if(h&&h.parentNode)h.parentNode.insertBefore(keep,h.nextSibling); else page.insertBefore(keep,page.firstChild);} }
  function ensurePage(){ if(!$('returnCasesPage')) document.body.insertAdjacentHTML('beforeend',pageHtml()); normalizeNotice(); bindEvents(); }
  function selected(id){var b=$(id); return b&&Array.isArray(b.__sel)?b.__sel:[];}
  function setOptions(id,vals){var b=$(id); if(!b)return; b.__values=Array.from(new Set(vals.map(txt).filter(Boolean))).sort(); b.__sel=(b.__sel||[]).filter(function(v){return b.__values.indexOf(v)>=0;}); caption(b); drawList(b,'');}
  function caption(b){var a=b.__sel||[], btn=b.querySelector('.rc-filter-btn'); if(btn)btn.textContent=!a.length?'All':(a.length===1?a[0]:a.length+' selected');}
  function drawList(b,term){var list=b.querySelector('.rc-filter-list'); if(!list)return; var t=txt(term).toLowerCase(), vals=(b.__values||[]).filter(function(v){return !t||v.toLowerCase().includes(t);}); var temp=b.__temp||new Set(b.__sel||[]); list.innerHTML='<label class="rc-filter-option"><input type="checkbox" data-all="1" '+(!temp.size?'checked':'')+'>Select All</label>'+vals.map(function(v){return '<label class="rc-filter-option"><input type="checkbox" value="'+esc(v)+'" '+(temp.has(v)?'checked':'')+'>'+esc(v)+'</label>';}).join('');}
  function setFilter(id,valx){var b=$(id); if(!b)return; b.__sel=valx?[valx]:[]; caption(b); drawList(b,'');}
  function bindEvents(){ if(window.__rcEventsBound)return; window.__rcEventsBound=true; document.addEventListener('click',function(e){var box=e.target.closest&&e.target.closest('.rc-filter-box'); document.querySelectorAll('.rc-filter-box.open').forEach(function(b){if(b!==box)b.classList.remove('open');}); if(e.target.closest&&e.target.closest('.rc-filter-btn')){var b=e.target.closest('.rc-filter-box'); b.__temp=new Set(b.__sel||[]); drawList(b,''); b.classList.toggle('open'); setTimeout(function(){var s=b.querySelector('.rc-filter-search'); if(s)s.focus();},0);} if(e.target.closest&&e.target.closest('.rc-filter-option input')){var b=e.target.closest('.rc-filter-box'), cb=e.target, tmp=b.__temp||new Set(); if(cb.dataset.all){tmp=cb.checked?new Set():new Set();} else {if(cb.checked)tmp.add(cb.value); else tmp.delete(cb.value);} b.__temp=tmp; drawList(b,b.querySelector('.rc-filter-search').value);} if(e.target.closest&&e.target.closest('.rc-filter-actions-menu .ok')){var b=e.target.closest('.rc-filter-box'); b.__sel=Array.from(b.__temp||[]); caption(b); b.classList.remove('open'); rcCardFilter={type:'',value:''}; render();} if(e.target.closest&&e.target.closest('.rc-filter-actions-menu .cancel')){e.target.closest('.rc-filter-box').classList.remove('open');}
      var card=e.target.closest&&e.target.closest('#returnCasesPage .rc-card[data-card]'); if(card){var type=card.dataset.card, value=card.dataset.value||''; rcCardFilter={type:type,value:value}; if(type==='branch')setFilter('rcBranchFilter',value); if(type==='tech')setFilter('rcAssignedFilter',value); if(type==='model')setFilter('rcModelFilter',value); render();}
      var link=e.target.closest&&e.target.closest('.rc-link'); if(link){var field=link.dataset.field, value=link.dataset.value; if(field==='Branch')setFilter('rcBranchFilter',value); if(field==='Assigned_To')setFilter('rcAssignedFilter',value); if(field==='Model')setFilter('rcModelFilter',value); rcCardFilter={type:'',value:''}; render(); var main=$('rcTable'); if(main)main.scrollIntoView({behavior:'smooth',block:'start'});}
    },true); document.addEventListener('input',function(e){if(e.target.matches('.rc-filter-search'))drawList(e.target.closest('.rc-filter-box'),e.target.value); if(e.target.matches('#rcSearch,#rcDateFrom,#rcDateTo')){rcCardFilter={type:'',value:''}; render();}}); document.addEventListener('click',function(e){if(e.target.id==='rcClearBtn')clearFilters();});}
  function clearFilters(){['rcBrandFilter','rcBranchFilter','rcAssignedFilter','rcModelFilter'].forEach(function(id){var b=$(id); if(b){b.__sel=[];caption(b);drawList(b,'');}}); ['rcDateFrom','rcDateTo','rcSearch'].forEach(function(id){var e=$(id); if(e)e.value='';}); rcCardFilter={type:'',value:''}; render();}
  async function loadRows(force){ if(typeof XLSX==='undefined')throw new Error('XLSX library is not ready.'); var lastErr=null; for(var i=0;i<FILE_CANDIDATES.length;i++){try{var rows=typeof loadExcelRowsFromUrl==='function'?await loadExcelRowsFromUrl(FILE_CANDIDATES[i],SHEET,force):await fallbackLoad(FILE_CANDIDATES[i],force); return {rows:rows,file:FILE_CANDIDATES[i]};}catch(e){lastErr=e;}} throw lastErr||new Error('Return Cases file not found.');}
  async function fallbackLoad(file,force){var url=(typeof serviceDataUrl==='function')?await serviceDataUrl(file,force):file+(force?'?v='+Date.now():''); var res=await fetch(url,{cache:force?'no-store':'no-cache'}); if(!res.ok)throw new Error(file+' HTTP '+res.status); var ab=await res.arrayBuffer(); var wb=XLSX.read(new Uint8Array(ab),{type:'array',cellDates:true}); var sn=wb.SheetNames.includes(SHEET)?SHEET:wb.SheetNames[0]; return XLSX.utils.sheet_to_json(wb.Sheets[sn],{defval:'',raw:true});}
  async function loadReturnCases(force){ensurePage(); normalizeNotice(); notice('Updating now','Auto sync',rcRows.length,'Loading data...'); try{var r=await loadRows(!!force); rcRows=(r.rows||[]).filter(function(x){return Object.values(x).some(function(v){return txt(v)!=='';});}); window.returnCasesRows=rcRows; rcCols=Object.keys(rcRows[0]||{}); setupFilters(); render(); notice('Data updated','Auto sync',rcRows.length,'Fresh data loaded by Auto sync');}catch(e){notice('Waiting for data','Auto sync',rcRows.length,e&&e.message?e.message:'Load failed');}}
  function notice(status,source,rows,msg){normalizeNotice(); var n=$('serviceV2Notice_returnCases'); if(!n)return; var cls=status==='Updating now'?' loading':(rows?' ok':''); n.className='service-v2-update-notice'+cls; n.innerHTML='<span class="source">Return Cases — '+esc(status)+'</span><span>Source: <b>'+esc(source)+'</b></span><span>Rows: <b>'+Number(rows||0).toLocaleString()+'</b></span><span>Last Update: <b>'+(rows?new Date().toLocaleString():'-')+'</b></span><span>'+esc(msg)+'</span>';}
  function setupFilters(){setOptions('rcBrandFilter',rcRows.map(function(r){return val(r,['Brand']);})); setOptions('rcBranchFilter',rcRows.map(function(r){return val(r,['Branch']);})); setOptions('rcAssignedFilter',rcRows.map(function(r){return val(r,['Assigned_To','Assigned To']);})); setOptions('rcModelFilter',rcRows.map(function(r){return val(r,['Model']);}));}
  function filtered(){var fBrand=selected('rcBrandFilter'),fBranch=selected('rcBranchFilter'),fAss=selected('rcAssignedFilter'),fModel=selected('rcModelFilter'), q=txt($('rcSearch')&&$('rcSearch').value).toLowerCase(), d1=$('rcDateFrom')&&$('rcDateFrom').value?new Date($('rcDateFrom').value):null, d2=$('rcDateTo')&&$('rcDateTo').value?new Date($('rcDateTo').value):null; if(d2)d2.setHours(23,59,59,999); return rcRows.filter(function(r){var od=toDate(val(r,['Open_Date','Open Date'])); return (!fBrand.length||fBrand.includes(txt(val(r,['Brand']))))&&(!fBranch.length||fBranch.includes(txt(val(r,['Branch']))))&&(!fAss.length||fAss.includes(txt(val(r,['Assigned_To','Assigned To']))))&&(!fModel.length||fModel.includes(txt(val(r,['Model']))))&&(!d1||od>=d1)&&(!d2||od<=d2)&&(!q||Object.values(r).some(function(v){return txt(v).toLowerCase().includes(q);}));});}
  function returnRows(){return rcFiltered.filter(function(r){return !isFirst(r);});}
  function render(){rcFiltered=filtered(); renderCards(); renderMainTable(); renderTechTable(); renderModelTable();}
  function renderCards(){var rows=returnRows(); var b=topEntry(countBy(rows,'Branch')), t=topEntry(countBy(rows,['Assigned_To','Assigned To'])), m=topEntry(countBy(rows,'Model')); [['Branch',b,'rcTopBranch','rcTopBranchCount','branch'],['Assigned_To',t,'rcTopTech','rcTopTechCount','tech'],['Model',m,'rcTopModel','rcTopModelCount','model']].forEach(function(x){var card=document.querySelector('#returnCasesPage .rc-card[data-card="'+x[4]+'"]'); var valx=x[1][0]; $(x[2]).textContent=valx; $(x[3]).textContent=Number(x[1][1]||0).toLocaleString()+' cases'; if(card){card.dataset.value=valx; card.classList.toggle('active',rcCardFilter.type===x[4]&&rcCardFilter.value===valx);}});}
  function cell(r,c){var v=r[c]; return (c==='Open_Date'||c==='CloseDate'||c==='Close Date')?fmtDate(v):txt(v);}
  function compareVals(a,b,dir){var na=parseFloat(String(a).replace(/,/g,'')), nb=parseFloat(String(b).replace(/,/g,'')); if(!isNaN(na)&&!isNaN(nb))return (na-nb)*dir; var da=toDate(a), db=toDate(b); if(da&&db)return (da-db)*dir; return txt(a).localeCompare(txt(b),undefined,{numeric:true,sensitivity:'base'})*dir;}
  function renderMainTable(){var tbl=$('rcTable'); if(!tbl)return; if(!rcCols.length){tbl.innerHTML='<tbody><tr><td>No data</td></tr></tbody>';return;} var rows=rcFiltered.slice(); if(rcSort.col){rows.sort(function(a,b){return compareVals(cell(a,rcSort.col),cell(b,rcSort.col),rcSort.dir);});} tbl.innerHTML='<thead><tr>'+rcCols.map(function(c){return '<th draggable="true" data-col="'+esc(c)+'">'+esc(c)+(rcSort.col===c?(rcSort.dir>0?' ▲':' ▼'):'')+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(r){return '<tr>'+rcCols.map(function(c){return '<td>'+esc(cell(r,c))+'</td>';}).join('')+'</tr>';}).join('')+'</tbody>'; bindTableHeader(tbl);}
  function bindTableHeader(tbl){tbl.querySelectorAll('th').forEach(function(th,idx){th.onclick=function(){var c=th.dataset.col; rcSort.dir=rcSort.col===c?-rcSort.dir:1; rcSort.col=c; renderMainTable();}; th.ondragstart=function(e){e.dataTransfer.setData('text/plain',idx);}; th.ondragover=function(e){e.preventDefault();}; th.ondrop=function(e){e.preventDefault(); var from=+e.dataTransfer.getData('text/plain'), to=idx; if(isNaN(from)||from===to)return; var c=rcCols.splice(from,1)[0]; rcCols.splice(to,0,c); renderMainTable();};});}
  function renderTechTable(){var tbl=$('rcTechTable'), rows=returnRows(); if(!tbl)return; var branchCounts=countBy(rows,'Branch'), tech={}; rows.forEach(function(r){var k=txt(val(r,['Assigned_To','Assigned To']))||'(blank)', br=txt(val(r,['Branch']))||'(blank)'; if(!tech[k])tech[k]={count:0,branch:br}; tech[k].count++;}); var arr=Object.entries(tech).map(function(x){return {tech:x[0],count:x[1].count,branch:x[1].branch,branchCount:branchCounts[x[1].branch]||0};}); arr.sort(function(a,b){var ca=[a.tech,a.count,a.branch,a.branchCount][rcTechSort.col], cb=[b.tech,b.count,b.branch,b.branchCount][rcTechSort.col]; return compareVals(ca,cb,rcTechSort.dir);}); window.rcTechRows=arr; tbl.innerHTML='<thead><tr><th data-i="0">(Assigned_To)</th><th data-i="1">Count Cases</th><th data-i="2">Branch</th><th data-i="3">Count Cases for Branch</th></tr></thead><tbody>'+arr.map(function(x){return '<tr><td><a href="#" class="rc-link" data-field="Assigned_To" data-value="'+esc(x.tech)+'">'+esc(x.tech)+'</a></td><td><a href="#" class="rc-link" data-field="Assigned_To" data-value="'+esc(x.tech)+'">'+x.count.toLocaleString()+'</a></td><td><a href="#" class="rc-link" data-field="Branch" data-value="'+esc(x.branch)+'">'+esc(x.branch)+'</a></td><td><a href="#" class="rc-link" data-field="Branch" data-value="'+esc(x.branch)+'">'+x.branchCount.toLocaleString()+'</a></td></tr>';}).join('')+'</tbody>'; bindSummarySort(tbl,rcTechSort,function(){renderTechTable();});}
  function renderModelTable(){var tbl=$('rcModelTable'), rows=returnRows(); if(!tbl)return; var arr=Object.entries(countBy(rows,'Model')).map(function(x){return {model:x[0],count:x[1]};}); arr.sort(function(a,b){return compareVals([a.model,a.count][rcModelSort.col],[b.model,b.count][rcModelSort.col],rcModelSort.dir);}); window.rcModelRows=arr; tbl.innerHTML='<thead><tr><th data-i="0">Model</th><th data-i="1">Count cases</th></tr></thead><tbody>'+arr.map(function(x){return '<tr><td><a href="#" class="rc-link" data-field="Model" data-value="'+esc(x.model)+'">'+esc(x.model)+'</a></td><td><a href="#" class="rc-link" data-field="Model" data-value="'+esc(x.model)+'">'+Number(x.count).toLocaleString()+'</a></td></tr>';}).join('')+'</tbody>'; bindSummarySort(tbl,rcModelSort,function(){renderModelTable();});}
  function bindSummarySort(tbl,state,cb){tbl.querySelectorAll('th').forEach(function(th){th.onclick=function(){var i=+th.dataset.i; state.dir=state.col===i?-state.dir:(i===0?1:-1); state.col=i; cb();};});}
  function writeXlsx(rows,sheet,name){var ws=XLSX.utils.json_to_sheet(rows), wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,sheet); XLSX.writeFile(wb,name);}
  window.rcDownloadFiltered=function(){var rows=rcFiltered.map(function(r){var o={}; rcCols.forEach(function(c){o[c]=(c==='Open_Date'||c==='CloseDate'||c==='Close Date')?fmtDate(r[c]):r[c];}); return o;}); writeXlsx(rows,'Return Cases','Return_Cases_Filtered.xlsx');};
  window.rcDownloadTechTable=function(){writeXlsx((window.rcTechRows||[]).map(function(x){return {'(Assigned_To)':x.tech,'Count Cases':x.count,'Branch':x.branch,'Count Cases for Branch':x.branchCount};}),'By Technician','Return_Cases_by_Branch_and_Technician.xlsx');};
  window.rcDownloadModelTable=function(){writeXlsx((window.rcModelRows||[]).map(function(x){return {'Model':x.model,'Count cases':x.count};}),'By Model','Return_Cases_by_Model.xlsx');};
  var oldSwitch=window.switchTab; window.switchTab=function(tab){ensureSide(); ensurePage(); if(tab==='returnCases'){['gspnPage','skyPage','profitPage','cashTargetPage','userManagementPage','preBookingPage','returnCasesPage','dashboardPage','repairEfficiencyPage'].forEach(function(id){var e=$(id); if(e)e.style.display=(id==='returnCasesPage'?'block':'none');}); document.querySelectorAll('.side-tab').forEach(function(el){el.classList.toggle('active',keyOf(el)==='returnCases');}); try{localStorage.setItem('serviceEyeActiveTab','returnCases');}catch(e){} if(!rcRows.length)loadReturnCases(false); else render(); return;} return typeof oldSwitch==='function'?oldSwitch.apply(this,arguments):undefined;};
  window.loadReturnCases=loadReturnCases; window.renderReturnCases=render;
  function boot(){ensureSide(); ensurePage(); normalizeNotice(); var a=''; try{a=localStorage.getItem('serviceEyeActiveTab')||'';}catch(e){} if(a==='returnCases')window.switchTab('returnCases'); else setTimeout(function(){ if(!rcRows.length) loadReturnCases(false); },900);}
  document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,850); setInterval(function(){try{loadReturnCases(false);}catch(e){}},3*60*60*1000);});
})();


/* ===== return-cases-core-visibility-fix ===== */

(function(){
  function $(id){return document.getElementById(id);}
  function hideAllShowReturn(){
    ['gspnPage','skyPage','profitPage','cashTargetPage','userManagementPage','preBookingPage','dashboardPage'].forEach(function(id){
      var el=$(id); if(el) el.style.display='none';
    });
    var rc=$('returnCasesPage');
    if(rc){
      rc.style.display='block';
      rc.style.visibility='visible';
      rc.style.opacity='1';
      rc.removeAttribute('hidden');
    }
    document.querySelectorAll('.side-tab').forEach(function(el){
      var oc=(el.getAttribute('onclick')||'').toLowerCase();
      var txt=(el.textContent||'').toLowerCase();
      var key=el.getAttribute('data-pb-tab')||el.getAttribute('data-fb-tab-key')||'';
      el.classList.toggle('active', key==='returnCases' || oc.indexOf('returncases')>-1 || txt.indexOf('return cases')>-1);
    });
    try{localStorage.setItem('serviceEyeActiveTab','returnCases');}catch(e){}
  }
  function ensureReturnPage(){
    var page=$('returnCasesPage');
    if(page) return page;
    var html = '<div class="page-shell" id="returnCasesPage" style="display:none">'+
      '<header><div class="brand"><div class="logo-box"><img src="assets/SKY.PNG" loading="eager" decoding="async" fetchpriority="high" data-site-logo="1" alt="Logo"></div><div><h1>Service Support Center</h1><div class="sub">Return Cases</div></div></div><div class="header-actions"></div></header>'+
      '<div id="serviceV2Notice_returnCases" class="service-v2-update-notice"><span class="source">Return Cases — Waiting for data</span><span>Source: <b>Auto sync</b></span><span>Rows: <b>0</b></span><span>Last Update: <b>-</b></span><span>Waiting for data</span></div>'+
      '<main><div class="rc-filters">'+
      '<div class="rc-filter-box" id="rcBrandFilter"><div class="rc-filter-label">Brand</div><button type="button" class="rc-filter-btn">All</button><div class="rc-filter-menu"><input class="rc-filter-search" placeholder="Search"><div class="rc-filter-list"></div><div class="rc-filter-actions-menu"><button type="button" class="ok">OK</button><button type="button" class="cancel">Cancel</button></div></div></div>'+
      '<div class="rc-filter-box" id="rcBranchFilter"><div class="rc-filter-label">Branch</div><button type="button" class="rc-filter-btn">All</button><div class="rc-filter-menu"><input class="rc-filter-search" placeholder="Search"><div class="rc-filter-list"></div><div class="rc-filter-actions-menu"><button type="button" class="ok">OK</button><button type="button" class="cancel">Cancel</button></div></div></div>'+
      '<div class="rc-filter-box" id="rcAssignedFilter"><div class="rc-filter-label">Assigned_To</div><button type="button" class="rc-filter-btn">All</button><div class="rc-filter-menu"><input class="rc-filter-search" placeholder="Search"><div class="rc-filter-list"></div><div class="rc-filter-actions-menu"><button type="button" class="ok">OK</button><button type="button" class="cancel">Cancel</button></div></div></div>'+
      '<div class="rc-filter-box" id="rcModelFilter"><div class="rc-filter-label">Model</div><button type="button" class="rc-filter-btn">All</button><div class="rc-filter-menu"><input class="rc-filter-search" placeholder="Search"><div class="rc-filter-list"></div><div class="rc-filter-actions-menu"><button type="button" class="ok">OK</button><button type="button" class="cancel">Cancel</button></div></div></div>'+
      '<div><div class="rc-filter-label">Open_Date From</div><input type="date" id="rcDateFrom"></div><div><div class="rc-filter-label">Open_Date To</div><input type="date" id="rcDateTo"></div><div><div class="rc-filter-label">Search</div><input id="rcSearch" placeholder="Search all columns"></div><div class="rc-filter-actions"><button class="rc-btn light" id="rcClearBtn">Clear Filters</button></div></div>'+
      '<div class="rc-cards cards"><div class="card rc-card clickable blue" data-card="branch"><div class="label">Top Return Branch</div><div class="value" id="rcTopBranch">-</div><div class="percent" id="rcTopBranchCount">0 cases</div></div><div class="card rc-card clickable purple" data-card="tech"><div class="label">Top Return Technician</div><div class="value" id="rcTopTech">-</div><div class="percent" id="rcTopTechCount">0 cases</div></div><div class="card rc-card clickable green" data-card="model"><div class="label">Top Model</div><div class="value" id="rcTopModel">-</div><div class="percent" id="rcTopModelCount">0 cases</div></div></div>'+
      '<section class="rc-section"><h2>Return Cases Data <span><button class="rc-btn" onclick="window.rcDownloadFiltered&&window.rcDownloadFiltered()">⬇ Download Excel</button></span></h2><div class="rc-table-wrap"><table class="rc-table" id="rcTable"><tbody><tr><td>Loading data...</td></tr></tbody></table></div></section>'+
      '<section class="rc-section"><h2>Return Cases by Branch and Technician <span><button class="rc-btn" onclick="window.rcDownloadTechTable&&window.rcDownloadTechTable()">⬇ Download</button></span></h2><div class="rc-table-wrap"><table class="rc-table" id="rcTechTable"></table></div></section>'+
      '<section class="rc-section"><h2>Return Cases by Model <span><button class="rc-btn" onclick="window.rcDownloadModelTable&&window.rcDownloadModelTable()">⬇ Download</button></span></h2><div class="rc-table-wrap small"><table class="rc-table" id="rcModelTable"></table></div></section></main></div>';
    document.body.insertAdjacentHTML('beforeend', html);
    return $('returnCasesPage');
  }
  function removeDuplicateSidebarTabs(side){
    var seen={};
    Array.from(side.querySelectorAll('.side-tab')).forEach(function(el){
      var key=(el.getAttribute('data-pb-tab')||el.getAttribute('data-fb-tab-key')||'');
      var tx=(el.textContent||'').toLowerCase();
      var oc=(el.getAttribute('onclick')||'').toLowerCase();
      if(!key){
        if(tx.indexOf('dashboard')>-1) key='dashboard';
        else if(tx.indexOf('gspn')>-1) key='gspn';
        else if(tx.indexOf('sky')>-1) key='sky';
        else if(tx.indexOf('pre_booking')>-1||tx.indexOf('pre booking')>-1) key='preBooking';
        else if(tx.indexOf('return cases')>-1||oc.indexOf('returncases')>-1) key='returnCases';
        else if(tx.indexOf('profit')>-1) key='profit';
        else if(tx.indexOf('cash')>-1) key='cashTarget';
        else if(tx.indexOf('user management')>-1) key='userManagement';
      }
      if(!key) return;
      el.setAttribute('data-pb-tab',key);
      el.setAttribute('data-fb-tab-key',key);
      if(seen[key]) el.remove(); else seen[key]=el;
    });
  }
  function ensureSidebarOrder(){
    var side=$('sideMenu')||document.querySelector('.side-menu');
    if(!side) return;
    removeDuplicateSidebarTabs(side);
    var defs=[
      ['dashboard','Dashboard','📊',"switchTab('dashboard')"],
      ['gspn','GSPN Tracking cases','GSPN',"switchTab('gspn')"],
      ['sky','SKY Tracking cases','SKY',"switchTab('sky')"],
      ['preBooking','Pre_Booking','📋',"switchTab('preBooking')"],
      ['returnCases','Return Cases','↩️',"switchTab('returnCases')"],
      ['profit','Profitability & commission','💰',"switchTab('profit')"],
      ['cashTarget','Cash & Target','🎯',"openCashTargetTab&&openCashTargetTab()"],
      ['userManagement','User Management','👥',"switchTab('userManagement')"]
    ];
    defs.forEach(function(d,i){
      var el=Array.from(side.querySelectorAll('.side-tab')).find(function(t){
        var k=t.getAttribute('data-pb-tab')||t.getAttribute('data-fb-tab-key')||'';
        var oc=(t.getAttribute('onclick')||'').toLowerCase();
        var tx=(t.textContent||'').toLowerCase();
        return k===d[0] || oc.indexOf(d[0].toLowerCase())>-1 || (d[0]==='returnCases'&&tx.indexOf('return cases')>-1);
      });
      if(!el){
        el=document.createElement('div');
        el.className='side-tab';
        el.setAttribute('onclick',d[3]);
        el.innerHTML='<span class="side-icon">'+d[2]+'</span><span class="side-label">'+d[1]+'</span>';
        side.appendChild(el);
      }
      el.setAttribute('data-pb-tab',d[0]);
      el.setAttribute('data-fb-tab-key',d[0]);
      el.style.order=String(20+i);
      if(d[0]==='returnCases'){
        el.style.display='flex';
        el.style.visibility='visible';
        el.style.opacity='1';
        el.removeAttribute('hidden');
        el.setAttribute('aria-hidden','false');
      }
    });
    removeDuplicateSidebarTabs(side);
  }
  var originalSwitch=window.switchTab;
  window.switchTab=function(tab){
    if(tab==='returnCases'){
      ensureReturnPage();
      ensureSidebarOrder();
      hideAllShowReturn();
      var run=function(){
        if(typeof window.loadReturnCases==='function') window.loadReturnCases(false);
        else if(typeof window.renderReturnCases==='function') window.renderReturnCases();
      };
      if(typeof XLSX==='undefined') setTimeout(run,500); else setTimeout(run,50);
      return;
    }
    var r=typeof originalSwitch==='function'?originalSwitch.apply(this,arguments):undefined;
    var rc=$('returnCasesPage'); if(rc) rc.style.display='none';
    setTimeout(ensureSidebarOrder,80);
    return r;
  };
  document.addEventListener('click',function(e){
    var tab=e.target&&e.target.closest?e.target.closest('.side-tab'):null;
    if(!tab) return;
    var key=tab.getAttribute('data-pb-tab')||tab.getAttribute('data-fb-tab-key')||'';
    var oc=(tab.getAttribute('onclick')||'').toLowerCase();
    var tx=(tab.textContent||'').toLowerCase();
    if(key==='returnCases'||oc.indexOf('returncases')>-1||tx.indexOf('return cases')>-1){
      e.preventDefault();
      e.stopImmediatePropagation();
      window.switchTab('returnCases');
    }
  },true);
  function boot(){
    ensureSidebarOrder();
    var active=''; try{active=localStorage.getItem('serviceEyeActiveTab')||'';}catch(e){}
    if(active==='returnCases') window.switchTab('returnCases');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
  window.addEventListener('load',function(){setTimeout(boot,100);});
})();


/* ===== final-root-fix-returncases-and-sidebar-dedupe ===== */

(function(){
  'use strict';
  function $(id){return document.getElementById(id);}
  function txt(v){return String(v==null?'':v).trim();}
  function low(v){return txt(v).toLowerCase();}
  function keyOf(el){
    if(!el) return '';
    var k=el.getAttribute('data-pb-tab')||el.getAttribute('data-fb-tab-key')||'';
    if(k) return k;
    var oc=el.getAttribute('onclick')||'', t=low(el.textContent);
    if(oc.indexOf('dashboard')>-1||t.indexOf('dashboard')>-1) return 'dashboard';
    if(oc.indexOf('gspn')>-1||t.indexOf('gspn')>-1) return 'gspn';
    if(oc.indexOf('sky')>-1||t.indexOf('sky')>-1) return 'sky';
    if(oc.indexOf('preBooking')>-1||t.indexOf('pre_booking')>-1||t.indexOf('pre booking')>-1) return 'preBooking';
    if(oc.indexOf('returnCases')>-1||t.indexOf('return cases')>-1) return 'returnCases';
    if(oc.indexOf('profit')>-1||t.indexOf('profit')>-1||t.indexOf('commission')>-1) return 'profit';
    if(oc.indexOf('cashTarget')>-1||oc.indexOf('openCashTargetTab')>-1||t.indexOf('cash')>-1||t.indexOf('target')>-1) return 'cashTarget';
    if(t.indexOf('user management')>-1||el.classList.contains('firebase-user-management-tab')) return 'userManagement';
    return '';
  }
  var order=['dashboard','gspn','sky','preBooking','returnCases','receivedDelivered','profit','cashTarget','userManagement'];
  function ensureReturnPage(){
    if($('returnCasesPage')) return $('returnCasesPage');
    if(typeof window.loadReturnCases==='function'){
      try{ window.loadReturnCases(false); }catch(e){}
    }
    return $('returnCasesPage');
  }
  function normalizeSidebarHard(){
    var side=$('sideMenu')||document.querySelector('.side-menu'); if(!side) return;
    Array.prototype.slice.call(side.querySelectorAll('.side-tab')).forEach(function(el){
      var k=keyOf(el); if(!k) return;
      el.setAttribute('data-pb-tab',k); el.setAttribute('data-fb-tab-key',k);
    });
    var seen={};
    Array.prototype.slice.call(side.querySelectorAll('.side-tab')).forEach(function(el){
      var k=keyOf(el); if(!k) return;
      if(seen[k]){ el.remove(); return; }
      seen[k]=el;
    });
    order.forEach(function(k,i){
      var el=seen[k]||Array.prototype.slice.call(side.querySelectorAll('.side-tab')).find(function(x){return keyOf(x)===k;});
      if(!el) return;
      el.style.order=String(20+i);
      if(k==='userManagement') el.classList.add('firebase-user-management-tab','admin-only');
      if(k==='returnCases'){
        el.setAttribute('onclick',"switchTab('returnCases')");
        el.classList.remove('fb-tab-denied');
        el.style.display='flex'; el.style.visibility='visible'; el.style.opacity='1';
      }
    });
  }
  function showReturnCasesHard(){
    normalizeSidebarHard();
    var page=ensureReturnPage();
    ['dashboardPage','gspnPage','skyPage','preBookingPage','returnCasesPage','profitPage','cashTargetPage','userManagementPage','repairEfficiencyPage'].forEach(function(id){
      var p=$(id); if(p) p.style.display=(id==='returnCasesPage'?'block':'none');
    });
    Array.prototype.slice.call(document.querySelectorAll('.side-tab')).forEach(function(el){el.classList.toggle('active',keyOf(el)==='returnCases');});
    try{localStorage.setItem('serviceEyeActiveTab','returnCases');}catch(e){}
    if(typeof window.loadReturnCases==='function') setTimeout(function(){try{window.loadReturnCases(false);}catch(e){}},80);
  }
  var oldSwitch=window.switchTab;
  window.switchTab=function(tab){
    if(tab==='returnCases') { showReturnCasesHard(); return; }
    var r=typeof oldSwitch==='function'?oldSwitch.apply(this,arguments):undefined;
    setTimeout(normalizeSidebarHard,60); setTimeout(normalizeSidebarHard,500);
    return r;
  };
  document.addEventListener('click',function(e){
    var tab=e.target&&e.target.closest?e.target.closest('.side-tab'):null; if(!tab) return;
    if(keyOf(tab)==='returnCases'){ e.preventDefault(); e.stopImmediatePropagation(); showReturnCasesHard(); }
  },true);
  function boot(){ normalizeSidebarHard(); var a=''; try{a=localStorage.getItem('serviceEyeActiveTab')||'';}catch(e){} if(a==='returnCases') showReturnCasesHard(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
  window.addEventListener('load',function(){setTimeout(boot,100);setTimeout(normalizeSidebarHard,800);setTimeout(normalizeSidebarHard,2000);});
  try{new MutationObserver(normalizeSidebarHard).observe($('sideMenu')||document.body,{childList:true,subtree:true});}catch(e){}
})();


/* ===== received-delivered-tab-v1 ===== */

(function(){
  'use strict';
  var $=function(id){return document.getElementById(id);}, txt=function(v){return String(v==null?'':v).trim();};
  var rdRows=[], rdFiltered=[], rdDrillRows=[], rdCardFilter={type:'',value:''};
  var rdSort={branch:{col:'Branch',dir:1}, employee:{col:'Employee',dir:1}}, rdCols={branch:[], employee:[]};
  function esc(v){return txt(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
  function num(v){if(typeof v==='number')return v; var n=Number(txt(v).replace(/,/g,'').replace('%','')); return isFinite(n)?n:0;}
  function fmt(n){return Number(n||0).toLocaleString();}
  function pct(v){var n=num(v); if(n>1)n=n/100; return isFinite(n)?Math.round(n*100)+'%':'0%';}
  function monthIndex(m){var t=txt(m), y=Number((t.match(/^(\d{4})/)||[])[1]||0), name=t.replace(/^\d{4}[-\s_]*/,'').toLowerCase(); var names=['january','february','march','april','may','june','july','august','september','october','november','december']; var mi=names.indexOf(name); return (y||9999)*12+(mi<0?99:mi);}
  function uniq(a){var o={}; return a.map(txt).filter(Boolean).filter(function(x){var k=x.toLowerCase(); if(o[k])return false; o[k]=1; return true;}).sort(function(a,b){return a.localeCompare(b);});}
  function notice(status,source,rows,msg){var n=$('serviceV2Notice_receivedDelivered'); if(!n)return; n.innerHTML='<span class="source">Received &amp; Delivered — '+esc(status)+'</span><span>Source: <b>'+esc(source||'Auto Sync')+'</b></span><span>Rows: <b>'+fmt(rows||0)+'</b></span><span>Last Update: <b>'+esc(status==='Waiting for data'?'-':new Date().toLocaleString())+'</b></span><span>'+esc(msg||'')+'</span>';}
  function filterBox(id,title){return '<div class="rd-filter-box" id="'+id+'" data-title="'+esc(title)+'"></div>';}
  function makePage(){ if($('receivedDeliveredPage')) return; document.body.insertAdjacentHTML('beforeend','<div class="page-shell" id="receivedDeliveredPage"><header><div class="brand"><div class="logo-box"><img src="assets/SKY.PNG" loading="eager" decoding="async" fetchpriority="high" data-site-logo="1" alt="Logo"></div><div><h1>Service Support Center</h1><div class="sub">Received &amp; Delivered</div></div></div><div class="header-actions"></div></header><div id="serviceV2Notice_receivedDelivered" class="service-v2-update-notice"><span class="source">Received &amp; Delivered — Waiting for data</span><span>Source: <b>Auto Sync</b></span><span>Rows: <b>0</b></span><span>Last Update: <b>-</b></span><span>Waiting for data</span></div><main><div class="rd-filters">'+filterBox('rdBranchFilter','Branch')+filterBox('rdEmployeeFilter','Employee')+filterBox('rdMonthFilter','Month')+'<div class="rd-filter-actions"><button class="rd-btn light" onclick="window.rdClearFilters&&window.rdClearFilters()">Clear Filters</button></div></div><div class="rd-cards cards"><div class="card rd-card clickable blue" data-card="branch"><div class="label">Top Branch</div><div class="value" id="rdTopBranch">-</div><div class="percent" id="rdTopBranchNums">Received: 0 | Delivered: 0</div></div><div class="card rd-card clickable purple" data-card="employee"><div class="label">Top Employee</div><div class="value" id="rdTopEmployee">-</div><div class="percent" id="rdTopEmployeeNums">Received: 0 | Delivered: 0</div></div><div class="card rd-card clickable green" data-card="month"><div class="label">Top Month</div><div class="value" id="rdTopMonth">-</div><div class="percent" id="rdTopMonthNums">Received: 0 | Delivered: 0</div></div></div><section class="rd-section"><h2>Received &amp; Delivered by Branch / Month <span><button class="rd-btn" onclick="window.rdDownloadTable(\'branch\')">Download</button></span></h2><div class="rd-table-wrap"><table class="rd-table" id="rdBranchTable"></table></div></section><section class="rd-section"><h2>Received &amp; Delivered by Employee / Month <span><button class="rd-btn" onclick="window.rdDownloadTable(\'employee\')">Download</button></span></h2><div class="rd-table-wrap"><table class="rd-table" id="rdEmployeeTable"></table></div></section></main></div><div class="rd-drill" id="rdDrill"><div class="rd-drill-box"><div class="rd-drill-head"><h2 id="rdDrillTitle">Details</h2><div><button class="rd-btn" onclick="window.rdDownloadDrill()">Download</button> <button class="rd-btn light" onclick="document.getElementById(\'rdDrill\').style.display=\'none\'">Close</button></div></div><div class="rd-table-wrap"><table class="rd-table" id="rdDrillTable"></table></div></div></div>'); }
  function keyOf(el){var oc=el.getAttribute('onclick')||''; var m=oc.match(/switchTab\(['"]([^'"]+)/); return el.getAttribute('data-pb-tab')||el.getAttribute('data-fb-tab-key')||(m&&m[1])||'';}
  function ensureSide(){var side=$('sideMenu')||document.querySelector('.side-menu'); if(!side)return; if(!Array.prototype.slice.call(side.querySelectorAll('.side-tab')).some(function(x){return keyOf(x)==='receivedDelivered';})){ var html='<div class="side-tab" data-pb-tab="receivedDelivered" data-fb-tab-key="receivedDelivered" onclick="switchTab(\'receivedDelivered\')"><span class="side-icon">📦</span><span class="side-label">Received &amp; Delivered</span></div>'; var ref=Array.prototype.slice.call(side.querySelectorAll('.side-tab')).find(function(x){return keyOf(x)==='returnCases';}); if(ref)ref.insertAdjacentHTML('afterend',html); else side.insertAdjacentHTML('beforeend',html);} }
  function waitX(){return new Promise(function(resolve,reject){var t=0;(function chk(){if(window.XLSX)return resolve(); if((t+=100)>8000)return reject(new Error('XLSX library not loaded')); setTimeout(chk,100);})();});}
  async function fetchWorkbookFile(fileName,manual){
    if(manual&&typeof serviceClearDataVersion==='function')serviceClearDataVersion(fileName);
    var encoded=encodeURIComponent(fileName).replace(/%2F/g,'/');
    var candidates=[];
    try{candidates.push(typeof serviceDataUrl==='function'?await serviceDataUrl(fileName,!!manual):encoded+'?v='+(manual?Date.now():'stable'));}catch(_e){candidates.push(encoded+'?v='+(manual?Date.now():'stable'));}
    try{
      var host=String(location.hostname||''), parts=String(location.pathname||'').split('/').filter(Boolean), repo=parts[0]||'Service-Support-Center';
      if(/github\.io$/i.test(host)){
        var owner=host.replace(/\.github\.io$/i,'');
        candidates.push('https://raw.githubusercontent.com/'+owner+'/'+repo+'/main/'+encoded+'?v='+(manual?Date.now():'stable'));
      }
    }catch(_e){}
    candidates.push(encoded+'?v='+(manual?Date.now():'stable'));
    var lastErr=null;
    for(var u=0;u<candidates.length;u++){
      try{
        var res=await fetch(candidates[u],{cache:manual?'no-store':'no-cache'});
        if(!res.ok)throw new Error(fileName+' HTTP '+res.status);
        var buf=await res.arrayBuffer();
        return XLSX.read(new Uint8Array(buf),{type:'array',cellDates:true,raw:true});
      }catch(e){lastErr=e;}
    }
    throw lastErr||new Error(fileName+' not found');
  }
  async function fetchRows(manual){await waitX(); var files=['Received_Delivered.xlsx','Received & Delivered.xlsx','Received and Delivered.xlsx','Received Delivered.xlsx','Received_and_Delivered.xlsx'], lastErr=null; for(var i=0;i<files.length;i++){try{var wb=await fetchWorkbookFile(files[i],manual); var sn=wb.SheetNames.includes('Received_Delivered')?'Received_Delivered':(wb.SheetNames.includes('Sheet2')?'Sheet2':(wb.SheetNames.includes('Sheet1')?'Sheet1':wb.SheetNames[0])); return {rows:XLSX.utils.sheet_to_json(wb.Sheets[sn],{defval:'',raw:true}),file:files[i]};}catch(e){lastErr=e;}} throw lastErr||new Error('Received and Delivered file not found');}
  function normaliseMonth(v){if(v instanceof Date){var names=['January','February','March','April','May','June','July','August','September','October','November','December']; return v.getFullYear()+'-'+names[v.getMonth()];} return txt(v).replace(/\s+/g,'-');}
  function normaliseRaw(rows){var out=[]; (rows||[]).forEach(function(r){var branch=txt(r.Branch||r.branch), emp=txt(r.Employee||r.employee), month=normaliseMonth(r.Month||r.month), rec=num(r.Received||r.received), del=num(r.Delivered||r.delivered), total=(r.Total!==undefined&&r.Total!=='')?num(r.Total):(rec+del), pctVal=(r['% of Branch']!==undefined?r['% of Branch']:(r.PercentBranch!==undefined?r.PercentBranch:r['%'])); if(branch&&emp&&month){out.push({Branch:branch,Employee:emp,Month:month,Received:rec,Delivered:del,Total:total,'% of Branch':pctVal}); return;} var months=Object.keys(r).filter(function(k){return /^\d{4}[-\s_][A-Za-z]+$/i.test(k);}); var type=txt(r.Type||r.type); if(branch&&emp&&type&&months.length){months.forEach(function(m){var val=num(r[m]); var row={Branch:branch,Employee:emp,Month:normaliseMonth(m),Received:0,Delivered:0,Total:0,'% of Branch':''}; if(/^received$/i.test(type))row.Received=val; else if(/^delivered$/i.test(type))row.Delivered=val; row.Total=row.Received+row.Delivered; out.push(row);});}}); return out.filter(function(r){return r.Branch||r.Employee||r.Month;});}
  function selected(id){var b=$(id); return b&&b.__selected?b.__selected.slice():[];}
  function buildFilter(id,values){var b=$(id); if(!b)return; var title=b.getAttribute('data-title')||id, selectedVals=b.__selected||[], all=uniq(values); selectedVals=selectedVals.filter(function(v){return all.indexOf(v)>=0;}); b.__selected=selectedVals; var label=selectedVals.length?((selectedVals.length>2?selectedVals.length+' selected':selectedVals.join(', '))):'(Select All)'; b.innerHTML='<div class="rd-filter-label">'+esc(title)+'</div><button type="button" class="rd-filter-btn">'+esc(label)+'</button><div class="rd-filter-menu"><input class="rd-filter-search" placeholder="Search"><div class="rd-filter-list"></div><div class="rd-filter-actions-menu"><button type="button" class="rd-btn ok">OK</button><button type="button" class="rd-btn light cancel">Cancel</button></div></div>'; var btn=b.querySelector('.rd-filter-btn'), menu=b.querySelector('.rd-filter-menu'), list=b.querySelector('.rd-filter-list'), search=b.querySelector('.rd-filter-search'); var temp=selectedVals.slice(); function draw(){var q=txt(search.value).toLowerCase(); var vals=all.filter(function(v){return !q||v.toLowerCase().indexOf(q)>=0;}); list.innerHTML='<label class="rd-filter-option"><input type="checkbox" data-all="1" '+(!temp.length?'checked':'')+'> <span>(Select All)</span></label>'+vals.map(function(v){return '<label class="rd-filter-option"><input type="checkbox" value="'+esc(v)+'" '+(temp.indexOf(v)>=0?'checked':'')+'> <span>'+esc(v)+'</span></label>';}).join(''); list.querySelectorAll('input').forEach(function(cb){cb.onchange=function(){if(cb.getAttribute('data-all')){temp=[];}else{var v=cb.value, i=temp.indexOf(v); if(cb.checked&&i<0)temp.push(v); if(!cb.checked&&i>=0)temp.splice(i,1);} draw();};});}
    btn.onclick=function(e){e.stopPropagation(); document.querySelectorAll('.rd-filter-box.open').forEach(function(x){if(x!==b)x.classList.remove('open');}); b.classList.toggle('open'); draw();}; menu.onclick=function(e){e.stopPropagation();}; search.oninput=draw; b.querySelector('.cancel').onclick=function(){b.classList.remove('open');}; b.querySelector('.ok').onclick=function(){b.__selected=temp.slice(); b.classList.remove('open'); render();}; draw();}
  function initFilters(){buildFilter('rdBranchFilter',rdRows.map(function(r){return r.Branch;})); buildFilter('rdEmployeeFilter',rdRows.map(function(r){return r.Employee;})); buildFilter('rdMonthFilter',rdRows.map(function(r){return r.Month;})); document.querySelectorAll('#receivedDeliveredPage .rd-card[data-card]').forEach(function(c){ if(!c.__rd){c.__rd=true;c.onclick=function(){var type=c.dataset.card, value=c.dataset.value||''; rdCardFilter=(rdCardFilter.type===type&&rdCardFilter.value===value)?{type:'',value:''}:{type:type,value:value}; render();};} });}
  function filterRows(){var br=selected('rdBranchFilter'), emp=selected('rdEmployeeFilter'), mon=selected('rdMonthFilter'); return rdRows.filter(function(r){if(br.length&&br.indexOf(r.Branch)<0)return false;if(emp.length&&emp.indexOf(r.Employee)<0)return false;if(mon.length&&mon.indexOf(r.Month)<0)return false;if(rdCardFilter.type==='branch'&&r.Branch!==rdCardFilter.value)return false;if(rdCardFilter.type==='employee'&&r.Employee!==rdCardFilter.value)return false;if(rdCardFilter.type==='month'&&r.Month!==rdCardFilter.value)return false;return true;});}
  function aggregate(rows,dims,includePct){var map={}; rows.forEach(function(r){var key=dims.map(function(d){return r[d];}).join('||'); if(!map[key]){map[key]={}; dims.forEach(function(d){map[key][d]=r[d];}); map[key].Received=0; map[key].Delivered=0; map[key].Total=0; map[key]._pctSum=0; map[key]._pctCount=0;} map[key].Received+=num(r.Received); map[key].Delivered+=num(r.Delivered); map[key].Total+=num(r.Total||(num(r.Received)+num(r.Delivered))); if(r['% of Branch']!==''&&r['% of Branch']!=null){map[key]._pctSum+=num(r['% of Branch']); map[key]._pctCount++;}}); return Object.keys(map).map(function(k){var x=map[k]; if(includePct)x['% of Branch']=x._pctCount?x._pctSum/x._pctCount:''; delete x._pctSum; delete x._pctCount; return x;});}
  function topBy(rows,field){var g=aggregate(rows,[field],false); g.sort(function(a,b){return (b.Received+b.Delivered)-(a.Received+a.Delivered);}); return g[0]||{};}
  function setCard(idName,idNums,obj,field,type){var val=obj[field]||'-', a=$(idName), b=$(idNums), card=document.querySelector('#receivedDeliveredPage .rd-card[data-card="'+type+'"]'); if(a)a.textContent=val; if(b)b.textContent='Received: '+fmt(obj.Received)+' | Delivered: '+fmt(obj.Delivered); if(card){card.dataset.value=val; card.classList.toggle('active',rdCardFilter.type===type&&rdCardFilter.value===val);}}
  function renderCards(rows){setCard('rdTopBranch','rdTopBranchNums',topBy(rows,'Branch'),'Branch','branch'); setCard('rdTopEmployee','rdTopEmployeeNums',topBy(rows,'Employee'),'Employee','employee'); setCard('rdTopMonth','rdTopMonthNums',topBy(rows,'Month'),'Month','month');}
  function branchRows(rows){return aggregate(rows,['Branch','Month'],false);}
  function employeeRows(rows){return aggregate(rows,['Employee','Month'],true);}
  function sortRows(rows,kind){var s=rdSort[kind], main=kind==='employee'?'Employee':'Branch'; rows.sort(function(a,b){var av=a[s.col],bv=b[s.col], c=0; if(s.col==='Month')c=monthIndex(av)-monthIndex(bv); else c=(typeof av==='number'||typeof bv==='number'||s.col==='% of Branch')?(num(av)-num(bv)):txt(av).localeCompare(txt(bv)); if(c===0)c=txt(a[main]).localeCompare(txt(b[main]))||monthIndex(a.Month)-monthIndex(b.Month); return c*s.dir;}); return rows;}
  function renderTable(id,rows,cols,kind){rows=sortRows(rows.slice(),kind); var tbl=$(id), main=kind==='employee'?'Employee':'Branch'; if(!tbl)return; tbl.innerHTML='<thead><tr>'+cols.map(function(c,i){return '<th draggable="true" data-col="'+esc(c)+'" data-kind="'+kind+'" data-idx="'+i+'">'+esc(c)+' '+(rdSort[kind].col===c?(rdSort[kind].dir>0?'▲':'▼'):'')+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(r){return '<tr>'+cols.map(function(c){var v=r[c], display=(c==='% of Branch')?pct(v):(typeof v==='number'?fmt(v):v), cls='', html=esc(display), link=(c===main||c==='Month'||c==='Received'||c==='Delivered'||c==='Total'||c==='% of Branch'); if(c===main){cls=' group-cell'; html='<span class="rd-group-toggle">⊟</span>'+esc(display);} var attrs=link?' class="rd-link'+cls+'" data-kind="'+kind+'" data-col="'+esc(c)+'" data-value="'+esc(v)+'" data-main="'+esc(r[main]||'')+'" data-month="'+esc(r.Month||'')+'"':' class="'+cls+'"'; return '<td'+attrs+'>'+html+'</td>';}).join('')+'</tr>';}).join('')+'</tbody>'; tbl.querySelectorAll('th').forEach(function(th){th.onclick=function(){var k=th.dataset.kind,c=th.dataset.col; if(rdSort[k].col===c)rdSort[k].dir*=-1; else rdSort[k]={col:c,dir:1}; render();}; th.ondragstart=function(e){e.dataTransfer.setData('text/plain',th.dataset.idx);}; th.ondragover=function(e){e.preventDefault();}; th.ondrop=function(e){e.preventDefault();var from=Number(e.dataTransfer.getData('text/plain')), to=Number(th.dataset.idx), k=th.dataset.kind, arr=rdCols[k]; if(isNaN(from)||isNaN(to)||from===to)return; arr.splice(to,0,arr.splice(from,1)[0]); render();};}); tbl.querySelectorAll('.rd-link').forEach(function(td){td.onclick=function(){drill(td.dataset.kind,td.dataset.col,td.dataset.value,td.dataset);};});}
  function drill(kind,col,value,ctx){ctx=ctx||{}; var main=kind==='employee'?'Employee':'Branch'; var rows=rdFiltered.filter(function(r){ if(ctx.main&&r[main]!==ctx.main)return false; if(ctx.month&&r.Month!==ctx.month)return false; return true;}); rdDrillRows=rows; if($('rdDrillTitle'))$('rdDrillTitle').textContent='Details - '+col+': '+value; renderDetail('rdDrillTable',rows); if($('rdDrill'))$('rdDrill').style.display='block';}
  function renderDetail(id,rows){var cols=['Branch','Employee','Month','Received','Delivered','Total','% of Branch']; var tbl=$(id); tbl.innerHTML='<thead><tr>'+cols.map(function(c){return '<th>'+esc(c)+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(r){return '<tr>'+cols.map(function(c){var v=r[c]; return '<td>'+esc(c==='% of Branch'?pct(v):(typeof v==='number'?fmt(v):v))+'</td>';}).join('')+'</tr>';}).join('')+'</tbody>';}
  function render(){rdFiltered=filterRows(); renderCards(rdFiltered); rdCols.branch=rdCols.branch.length?rdCols.branch:['Branch','Month','Received','Delivered','Total']; rdCols.employee=rdCols.employee.length?rdCols.employee:['Employee','Month','Received','Delivered','Total','% of Branch']; renderTable('rdBranchTable',branchRows(rdFiltered),rdCols.branch,'branch'); renderTable('rdEmployeeTable',employeeRows(rdFiltered),rdCols.employee,'employee'); notice('Data updated','Auto Sync',rdRows.length,'Fresh data loaded by Auto sync');}
  window.renderReceivedDelivered=render;
  function toXlsx(rows,name){ if(!window.XLSX)return; var ws=XLSX.utils.json_to_sheet(rows), wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,name.slice(0,31)); XLSX.writeFile(wb,name+'.xlsx'); }
  window.rdDownloadTable=function(kind){var rows=kind==='employee'?employeeRows(rdFiltered):branchRows(rdFiltered); toXlsx(rows,kind==='employee'?'Received Delivered by Employee':'Received Delivered by Branch');};
  window.rdDownloadDrill=function(){toXlsx(rdDrillRows,'Received Delivered Details');};
  window.rdClearFilters=function(){['rdBranchFilter','rdEmployeeFilter','rdMonthFilter'].forEach(function(id){var b=$(id); if(b)b.__selected=[];}); rdCardFilter={type:'',value:''}; initFilters(); render();};
  window.loadReceivedDelivered=async function(manual){makePage(); ensureSide(); notice('Updating now','Auto Sync',rdRows.length,'Loading data...'); try{var result=await fetchRows(!!manual); rdRows=normaliseRaw(result.rows); window.receivedDeliveredRows=rdRows; initFilters(); render(); notice('Data updated','GitHub: '+(result.file||'Received_Delivered.xlsx'),rdRows.length,'Fresh data loaded by Auto sync'); try{localStorage.setItem('serviceV2Last_receivedDelivered',JSON.stringify({state:'success',source:'GitHub: '+(result.file||'Received_Delivered.xlsx'),rows:rdRows.length,time:new Date().toLocaleString(),msg:'Fresh data loaded by Auto sync'}));}catch(_e){} return rdRows;}catch(e){console.error(e); window.receivedDeliveredRows=rdRows; initFilters(); if(rdRows.length){render(); notice('Data updated','Auto Sync',rdRows.length,'GitHub not reachable — existing data kept'); return rdRows;} render(); notice('Waiting for data','Auto Sync',0,e&&e.message?e.message:'Load failed'); return [];}};
  function hideAllShow(){['dashboardPage','gspnPage','skyPage','preBookingPage','returnCasesPage','profitPage','cashTargetPage','userManagementPage','repairEfficiencyPage'].forEach(function(id){var p=$(id); if(p)p.style.display='none';}); var pg=$('receivedDeliveredPage'); if(pg)pg.style.display='block'; Array.prototype.slice.call(document.querySelectorAll('.side-tab')).forEach(function(el){el.classList.toggle('active',keyOf(el)==='receivedDelivered');}); try{localStorage.setItem('serviceEyeActiveTab','receivedDelivered');}catch(e){} try{ if(typeof window.sscUpdatePresenceTab==='function') window.sscUpdatePresenceTab('receivedDelivered'); }catch(e){}}
  function show(){makePage(); ensureSide(); hideAllShow(); if(!rdRows.length)window.loadReceivedDelivered(false); else render();}
  var oldSwitch=window.switchTab; window.switchTab=function(tab){ if(tab==='receivedDelivered'){show();return;} var r=typeof oldSwitch==='function'?oldSwitch.apply(this,arguments):undefined; var pg=$('receivedDeliveredPage'); if(pg)pg.style.display='none'; setTimeout(ensureSide,80); return r; };
  document.addEventListener('click',function(e){var tab=e.target&&e.target.closest?e.target.closest('.side-tab'):null; if(tab&&keyOf(tab)==='receivedDelivered'){e.preventDefault();e.stopImmediatePropagation();show();}},true);
  document.addEventListener('click',function(e){if(!e.target.closest||!e.target.closest('.rd-filter-box'))document.querySelectorAll('.rd-filter-box.open').forEach(function(x){x.classList.remove('open');});});
  function boot(){makePage(); ensureSide(); var a=''; try{a=localStorage.getItem('serviceEyeActiveTab')||'';}catch(e){} if(a==='receivedDelivered')show();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot); else boot(); window.addEventListener('load',function(){setTimeout(boot,100);setTimeout(ensureSide,800);});
})();


/* ===== codex-page-color-full-page-final-script ===== */

(function(){
  function isDarkMode(){
    if(!document.body) return false;
    var pageColor = document.body.dataset.pageColor || '';
    return pageColor === 'dark' || (!pageColor && document.body.classList.contains('theme-glass'));
  }
  function applyChartReadability(){
    try{
      var dark = isDarkMode();
      if(window.Chart){
        Chart.defaults.color = dark ? '#e5e7eb' : '#111827';
        Chart.defaults.borderColor = dark ? 'rgba(148,163,184,.22)' : 'rgba(17,24,39,.16)';
      }
      if(window.dashboardCharts){
        Object.keys(window.dashboardCharts).forEach(function(id){
          var ch = window.dashboardCharts[id];
          if(!ch || !ch.options) return;
          if(ch.options.plugins && ch.options.plugins.legend && ch.options.plugins.legend.labels){
            ch.options.plugins.legend.labels.color = dark ? '#e5e7eb' : '#111827';
          }
          if(ch.options.scales){
            Object.keys(ch.options.scales).forEach(function(k){
              var sc = ch.options.scales[k];
              if(sc.ticks) sc.ticks.color = dark ? '#e5e7eb' : '#111827';
              if(sc.grid) sc.grid.color = dark ? 'rgba(148,163,184,.22)' : 'rgba(17,24,39,.16)';
            });
          }
          try{ ch.update('none'); }catch(e){}
        });
      }
    }catch(e){}
  }
  function applyStoredColor(){
    try{
      var key = localStorage.getItem('serviceEyePageColor_v2') || document.body.dataset.pageColor || 'coral';
      document.body.dataset.pageColor = key;
      if(key !== 'dark'){
        document.body.classList.remove('theme-glass','color-black');
        try{ if(localStorage.getItem('serviceEyeColor_sky') === 'black') localStorage.removeItem('serviceEyeColor_sky'); }catch(_e){}
        try{ if(localStorage.getItem('serviceEyeColor_gspn') === 'black') localStorage.removeItem('serviceEyeColor_gspn'); }catch(_e){}
      }
      document.querySelectorAll('.codex-color-swatch').forEach(function(btn){ btn.classList.toggle('active', btn.dataset.color === key); });
      applyChartReadability();
    }catch(e){}
  }
  function ensureDarkSwatch(){
    var box = document.querySelector('#codexPageColorPanel .codex-page-color-swatches');
    if(!box || box.querySelector('[data-color="dark"]')) return;
    var btn=document.createElement('button');
    btn.type='button'; btn.className='codex-color-swatch'; btn.dataset.color='dark'; btn.title='Dark Mode'; btn.style.background='linear-gradient(135deg,#020617,#334155)';
    btn.onclick=function(){ if(window.setPageColor) window.setPageColor('dark'); else { localStorage.setItem('serviceEyePageColor_v2','dark'); document.body.dataset.pageColor='dark'; applyStoredColor(); } };
    box.appendChild(btn);
    applyStoredColor();
  }
  function patchSetPageColor(){
    if(!window.setPageColor || window.setPageColor.__fullPageColorPatch) return;
    var original = window.setPageColor;
    window.setPageColor = function(color){
      var key = color || 'coral';
      try { localStorage.setItem('serviceEyePageColor_v2', key); } catch(e) {}
      document.body.dataset.pageColor = key;
      var r = original.apply(this, arguments);
      applyStoredColor();
      setTimeout(applyChartReadability, 80);
      return r;
    };
    window.setPageColor.__fullPageColorPatch = true;
  }
  function boot(){ patchSetPageColor(); ensureDarkSwatch(); applyStoredColor(); setTimeout(applyChartReadability, 120); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', function(){ setTimeout(boot,300); setTimeout(boot,1000); });
  try{ new MutationObserver(function(){ clearTimeout(window.__pageColorFullTimer); window.__pageColorFullTimer=setTimeout(boot,120); }).observe(document.documentElement,{childList:true,subtree:true}); }catch(e){}
})();


/* ===== repair-efficiency-exit-final-script ===== */

(function(){
  'use strict';
  if(window.__repairEfficiencyExitFinalFix) return;
  window.__repairEfficiencyExitFinalFix = true;
  var PAGE_IDS=['dashboardPage','gspnPage','skyPage','preBookingPage','returnCasesPage','receivedDeliveredPage','repairEfficiencyPage','profitPage','cashTargetPage','userManagementPage'];
  var PAGE_BY_TAB={dashboard:'dashboardPage',gspn:'gspnPage',sky:'skyPage',preBooking:'preBookingPage',returnCases:'returnCasesPage',receivedDelivered:'receivedDeliveredPage',repairEfficiency:'repairEfficiencyPage',profit:'profitPage',cashTarget:'cashTargetPage',userManagement:'userManagementPage'};
  function $(id){return document.getElementById(id);}
  function norm(tab){
    tab=String(tab||'').trim();
    if(tab==='pre_booking'||tab==='pre booking') return 'preBooking';
    if(tab==='return cases') return 'returnCases';
    if(tab==='received delivered'||tab==='received & delivered') return 'receivedDelivered';
    if(tab==='repair efficiency') return 'repairEfficiency';
    if(tab==='cash'||tab==='cash-target'||tab==='cash_target') return 'cashTarget';
    if(tab==='user management') return 'userManagement';
    return PAGE_BY_TAB[tab]?tab:'gspn';
  }
  function keyOf(el){
    if(!el) return '';
    var k=el.getAttribute('data-pb-tab')||el.getAttribute('data-fb-tab-key')||el.dataset.serviceTab||'';
    if(k) return norm(k);
    var oc=(el.getAttribute('onclick')||'').toLowerCase(), t=(el.textContent||'').toLowerCase();
    if(oc.indexOf('repair')>-1||t.indexOf('repair efficiency')>-1) return 'repairEfficiency';
    if(oc.indexOf('received')>-1||(t.indexOf('received')>-1&&t.indexOf('delivered')>-1)) return 'receivedDelivered';
    if(oc.indexOf('return')>-1||t.indexOf('return cases')>-1) return 'returnCases';
    if(oc.indexOf('prebooking')>-1||oc.indexOf('pre_booking')>-1||t.indexOf('pre_booking')>-1||t.indexOf('pre booking')>-1) return 'preBooking';
    if(oc.indexOf('dashboard')>-1||t.indexOf('dashboard')>-1) return 'dashboard';
    if(oc.indexOf('gspn')>-1||t.indexOf('gspn')>-1) return 'gspn';
    if(oc.indexOf('sky')>-1||t.indexOf('sky')>-1) return 'sky';
    if(oc.indexOf('profit')>-1||t.indexOf('profit')>-1||t.indexOf('commission')>-1) return 'profit';
    if(oc.indexOf('cash')>-1||t.indexOf('cash')>-1||t.indexOf('target')>-1) return 'cashTarget';
    if(t.indexOf('user management')>-1) return 'userManagement';
    return '';
  }
  function ensurePagesFor(tab){
    try{
      if((tab==='preBooking'||tab==='dashboard') && typeof window.loadPreBooking==='function' && (!$('preBookingPage')||!$('dashboardPage'))) window.loadPreBooking(false);
      if(tab==='returnCases' && typeof window.loadReturnCases==='function' && !$('returnCasesPage')) window.loadReturnCases(false);
      if(tab==='receivedDelivered' && typeof window.loadReceivedDelivered==='function' && !$('receivedDeliveredPage')) window.loadReceivedDelivered(false);
      if(tab==='repairEfficiency' && typeof window.loadRepairEfficiency==='function' && !$('repairEfficiencyPage')) window.loadRepairEfficiency(false);
    }catch(e){}
  }
  function showOnly(tab){
    tab=norm(tab);
    ensurePagesFor(tab);
    PAGE_IDS.forEach(function(id){var p=$(id); if(p) p.style.display=(id===PAGE_BY_TAB[tab]?'block':'none');});
    Array.prototype.slice.call(document.querySelectorAll('.side-tab')).forEach(function(el){
      var k=keyOf(el);
      if(k){ el.setAttribute('data-pb-tab',k); el.setAttribute('data-fb-tab-key',k); el.dataset.serviceTab=k; }
      el.classList.toggle('active',k===tab);
    });
    try{localStorage.setItem('serviceEyeActiveTab',tab);}catch(e){}
    try{ if(typeof window.sscUpdatePresenceTab==='function') window.sscUpdatePresenceTab(tab); }catch(e){}
    setTimeout(function(){
      PAGE_IDS.forEach(function(id){var p=$(id); if(p) p.style.display=(id===PAGE_BY_TAB[tab]?'block':'none');});
      if(tab==='preBooking'){ try{ if(typeof window.renderPB==='function') window.renderPB(); }catch(e){} }
      if(tab==='dashboard'){ try{ if(typeof window.renderDashboardTables==='function') window.renderDashboardTables(); }catch(e){} }
      if(tab==='returnCases'){ try{ if(typeof window.renderReturnCases==='function') window.renderReturnCases(); }catch(e){} }
    },120);
  }
  var previous=window.switchTab;
  window.switchTab=function(tab){
    var key=norm(tab);
    if(['dashboard','preBooking','returnCases','receivedDelivered','repairEfficiency','gspn','sky','profit','cashTarget','userManagement'].indexOf(key)>=0){
      if(key==='repairEfficiency' && typeof previous==='function'){ try{ previous.apply(this,arguments); }catch(e){} }
      else if(['gspn','sky','profit','cashTarget','userManagement'].indexOf(key)>=0 && typeof previous==='function'){ try{ previous.apply(this,arguments); }catch(e){} }
      showOnly(key);
      return true;
    }
    return typeof previous==='function'?previous.apply(this,arguments):false;
  };
  window.__showServiceTabOnly = showOnly;
  document.addEventListener('click',function(e){
    var tab=e.target&&e.target.closest?e.target.closest('.side-tab'):null;
    if(!tab) return;
    var key=keyOf(tab);
    if(!key) return;
    setTimeout(function(){ showOnly(key); },0);
    setTimeout(function(){ showOnly(key); },160);
  },false);
})();


/* ===== repair-efficiency-firebase-navigation-cleanup ===== */

(function(){
  'use strict';
  function $(id){return document.getElementById(id);}
  var MAP={dashboard:'dashboardPage',gspn:'gspnPage',sky:'skyPage',preBooking:'preBookingPage',returnCases:'returnCasesPage',receivedDelivered:'receivedDeliveredPage',repairEfficiency:'repairEfficiencyPage',profit:'profitPage',cashTarget:'cashTargetPage',userManagement:'userManagementPage'};
  function keyOf(el){
    if(!el) return '';
    var k=el.getAttribute('data-pb-tab')||el.getAttribute('data-fb-tab-key')||el.dataset.serviceTab||'';
    if(k==='pre_booking') k='preBooking';
    if(k==='return cases') k='returnCases';
    if(k==='received delivered') k='receivedDelivered';
    if(k==='repair efficiency') k='repairEfficiency';
    if(MAP[k]) return k;
    var t=(el.textContent||'').toLowerCase(), oc=(el.getAttribute('onclick')||'').toLowerCase();
    if(t.indexOf('dashboard')>=0||oc.indexOf('dashboard')>=0)return 'dashboard';
    if(t.indexOf('pre_booking')>=0||t.indexOf('pre booking')>=0||oc.indexOf('prebooking')>=0||oc.indexOf('pre_booking')>=0)return 'preBooking';
    if(t.indexOf('return cases')>=0||oc.indexOf('returncases')>=0)return 'returnCases';
    if((t.indexOf('received')>=0&&t.indexOf('delivered')>=0)||oc.indexOf('receiveddelivered')>=0)return 'receivedDelivered';
    if(t.indexOf('repair efficiency')>=0||oc.indexOf('repairefficiency')>=0)return 'repairEfficiency';
    if(t.indexOf('gspn')>=0||oc.indexOf('gspn')>=0)return 'gspn';
    if(t.indexOf('sky')>=0||oc.indexOf('sky')>=0)return 'sky';
    if(t.indexOf('profit')>=0||t.indexOf('commission')>=0||oc.indexOf('profit')>=0)return 'profit';
    if(t.indexOf('cash')>=0||t.indexOf('target')>=0||oc.indexOf('cashtarget')>=0)return 'cashTarget';
    if(t.indexOf('user management')>=0)return 'userManagement';
    return '';
  }
  function force(key){
    if(!MAP[key]) return;
    Object.keys(MAP).forEach(function(k){var p=$(MAP[k]); if(p) p.style.setProperty('display',k===key?'block':'none','important');});
    Array.prototype.slice.call(document.querySelectorAll('.side-tab')).forEach(function(el){var k=keyOf(el); if(k){el.setAttribute('data-pb-tab',k);el.setAttribute('data-fb-tab-key',k);el.dataset.serviceTab=k;} el.classList.toggle('active',k===key);});
    try{localStorage.setItem('serviceEyeActiveTab',key);}catch(e){}
  }
  var old=window.switchTab;
  window.switchTab=function(tab){
    var key=keyOf({getAttribute:function(n){return n==='data-pb-tab'||n==='data-fb-tab-key'?tab:'';},dataset:{serviceTab:tab},textContent:tab,classList:{contains:function(){return false;}}});
    if(MAP[key]){var r; try{ if(typeof old==='function' && ['gspn','sky','profit','cashTarget','userManagement'].indexOf(key)>=0) r=old.apply(this,arguments); }catch(e){} force(key); setTimeout(function(){force(key);},80); setTimeout(function(){force(key);},250); return r===undefined?true:r;}
    return typeof old==='function'?old.apply(this,arguments):false;
  };
  document.addEventListener('click',function(e){
    var tab=e.target&&e.target.closest?e.target.closest('.side-tab'):null; if(!tab)return; var key=keyOf(tab); if(!MAP[key])return;
    setTimeout(function(){force(key);},1); setTimeout(function(){force(key);},120); setTimeout(function(){force(key);},350);
  },true);
})();


/* ===== cashTargetManualUpdateNoticeOnlyPatch ===== */

(function(){
  'use strict';
  var STORAGE_KEY = 'cashTargetManualRealLastUpdate_v1';
  var TAB_TITLE = 'Cash & Target';
  function $(id){ return document.getElementById(id); }
  function rowsCount(){
    var a = Array.isArray(window.cashTargetRows) ? window.cashTargetRows.length : 0;
    var b = Array.isArray(window.cashDailyRows) ? window.cashDailyRows.length : 0;
    return a + b;
  }
  function fmtRows(n){ return Number(n || 0).toLocaleString(); }
  function getSaved(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch(e) { return null; }
  }
  function setSaved(fileName){
    var data = {
      source: fileName ? ('Manual upload: ' + fileName) : 'Manual upload',
      time: new Date().toLocaleString(),
      rows: rowsCount(),
      msg: 'Manual data loaded'
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
    return data;
  }
  function ensureNotice(){
    var page = $('cashTargetPage');
    if(!page) return null;
    var n = $('serviceV2Notice_cashTarget');
    if(!n){
      n = document.createElement('div');
      n.id = 'serviceV2Notice_cashTarget';
      n.className = 'service-v2-update-notice';
      var header = page.querySelector('header');
      if(header && header.parentNode) header.parentNode.insertBefore(n, header.nextSibling);
      else page.insertBefore(n, page.firstChild);
    }
    return n;
  }
  function renderNotice(state, data, message){
    var n = ensureNotice();
    if(!n) return;
    var saved = data || getSaved();
    var hasRealUpload = !!(saved && saved.time && String(saved.source || '').indexOf('Manual upload') === 0);
    var source = hasRealUpload ? saved.source : 'Manual upload only';
    var time = hasRealUpload ? saved.time : '-';
    var msg = message || (hasRealUpload ? (saved.msg || 'Manual data loaded') : 'Waiting for manual upload');
    var rows = rowsCount() || (hasRealUpload ? saved.rows : 0);
    var status = state || (hasRealUpload ? 'Data updated' : 'Waiting for data');
    var cls = status === 'Updating now' ? 'state-loading' : '';
    n.innerHTML = '<span class="source '+cls+'">'+TAB_TITLE+' — '+status+'</span>'+
      '<span>Source: <b>'+source+'</b></span>'+
      '<span>Rows: <b>'+fmtRows(rows)+'</b></span>'+
      '<span>Last Update: <b>'+time+'</b></span>'+
      '<span>'+msg+'</span>';
  }
  function attachUploadWatcher(){
    var input = $('cashTargetFileInput');
    if(!input || input.dataset.cashManualNoticeOnly) return;
    input.dataset.cashManualNoticeOnly = '1';
    input.addEventListener('change', function(){
      var fileName = input.files && input.files[0] ? input.files[0].name : '';
      var saved = setSaved(fileName);
      renderNotice('Updating now', saved, 'Processing file');
      setTimeout(function(){ saved.rows = rowsCount(); try{localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));}catch(e){} renderNotice('Data updated', saved, 'Manual data loaded'); }, 1800);
      setTimeout(function(){ saved.rows = rowsCount(); try{localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));}catch(e){} renderNotice('Data updated', saved, 'Manual data loaded'); }, 4000);
    }, true);
  }
  var internal = false;
  function boot(){
    attachUploadWatcher();
    renderNotice();
    var n = ensureNotice();
    if(n && !n.dataset.cashNoticeObserver){
      n.dataset.cashNoticeObserver = '1';
      var obs = new MutationObserver(function(){
        if(internal) return;
        internal = true;
        setTimeout(function(){ renderNotice(); internal = false; }, 0);
      });
      obs.observe(n, {childList:true, subtree:true, characterData:true});
    }
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', function(){ setTimeout(boot, 700); });
  (window._ivals=window._ivals||[]).push(setInterval(function(){ attachUploadWatcher(); renderNotice(); }, 15000));
})();


/* ===== codex-sidebar-color-github-live-script ===== */

(function(){
  'use strict';
  var COLORS={
    coral:{label:'Coral',value:'#ff4d2e',chart:['#ff4d2e','#0f172a','#f97316','#14b8a6','#7c3aed','#16a34a','#eab308']},
    blue:{label:'Blue',value:'#2563eb',chart:['#2563eb','#0f766e','#f97316','#7c3aed','#16a34a','#e11d48','#0891b2']},
    green:{label:'Green',value:'#16a34a',chart:['#16a34a','#2563eb','#f97316','#7c3aed','#0f766e','#e11d48','#eab308']},
    purple:{label:'Purple',value:'#7c3aed',chart:['#7c3aed','#2563eb','#16a34a','#f97316','#0f766e','#e11d48','#eab308']},
    teal:{label:'Teal',value:'#0f766e',chart:['#0f766e','#2563eb','#f97316','#7c3aed','#16a34a','#e11d48','#eab308']},
    dark:{label:'Dark Mode',value:'#020617',chart:['#60a5fa','#34d399','#f97316','#a78bfa','#22d3ee','#facc15','#fb7185']}
  };
  var GITHUB_TABS=['gspn','sky','profit','preBooking','returnCases','receivedDelivered','dashboard'];
  var refreshInFlight=false;
  function $(id){return document.getElementById(id);}
  function text(v){return String(v==null?'':v).trim();}
  function visibleTab(){
    var pairs=[['gspn','gspnPage'],['sky','skyPage'],['profit','profitPage'],['cashTarget','cashTargetPage'],['preBooking','preBookingPage'],['returnCases','returnCasesPage'],['receivedDelivered','receivedDeliveredPage'],['dashboard','dashboardPage'],['userManagement','userManagementPage']];
    for(var i=0;i<pairs.length;i++){var el=$(pairs[i][1]); if(el&&el.style.display!=='none') return pairs[i][0];}
    return localStorage.getItem('serviceEyeActiveTab')||'gspn';
  }
  function getBottom(){
    var side=$('sideMenu')||document.querySelector('.side-menu'); if(!side) return null;
    var bottom=$('codexSidebarBottom');
    if(!bottom){bottom=document.createElement('div');bottom.id='codexSidebarBottom';bottom.className='codex-sidebar-bottom';}
    bottom.classList.remove('side-label');
    bottom.style.order='80';
    if(bottom.parentNode!==side) side.appendChild(bottom);
    return bottom;
  }
  function ensureTooltips(){document.querySelectorAll('.side-tab').forEach(function(el){var label=el.querySelector('.side-label');var t=text(label?label.textContent:el.textContent);if(t){el.dataset.tip=t;el.title=t;}});}
  function applyColor(color){
    var key=COLORS[color]?color:'coral', cfg=COLORS[key];
    try{localStorage.setItem('serviceEyePageColor_v2',key);}catch(e){}
    document.body.dataset.pageColor=key;
    document.documentElement.style.setProperty('--codex-accent',cfg.value);
    try{
      if(window.Chart){var d=key==='dark';Chart.defaults.color=d?'#e5e7eb':'#111827';Chart.defaults.borderColor=d?'rgba(255,255,255,.18)':'rgba(17,24,39,.16)';}
      window.COLORS=cfg.chart.slice();
    }catch(e){}
    document.querySelectorAll('.codex-color-swatch').forEach(function(btn){btn.classList.toggle('active',btn.dataset.color===key);});
    if(window.setPageColor&&window.setPageColor!==applyColor){try{window.setPageColor(key);}catch(e){}}
    rerenderVisible();
  }
  function ensurePalette(){
    var bottom=getBottom(); if(!bottom) return;
    var panel=$('codexPageColorPanel');
    if(!panel){panel=document.createElement('div');panel.id='codexPageColorPanel';panel.className='codex-page-color-panel';panel.innerHTML='<div class="codex-page-color-title">Page Color</div><div class="codex-page-color-swatches"></div>';bottom.insertBefore(panel,bottom.firstChild);}
    var swatches=panel.querySelector('.codex-page-color-swatches'); if(!swatches) return;
    Object.keys(COLORS).forEach(function(key){
      var btn=swatches.querySelector('[data-color="'+key+'"]');
      if(!btn){btn=document.createElement('button');btn.type='button';btn.className='codex-color-swatch';btn.dataset.color=key;btn.title=COLORS[key].label;btn.style.background= key==='dark'?'linear-gradient(135deg,#020617,#334155)':COLORS[key].value;swatches.appendChild(btn);}
      btn.onclick=function(){applyColor(key);};
    });
    applyColor(localStorage.getItem('serviceEyePageColor_v2')||document.body.dataset.pageColor||'coral');
  }
  async function runGithubRefresh(tab,manual){
    var t=tab||visibleTab();
    if(t==='cashTarget'){ if(manual) alert('Cash & Target is manual only. Use the manual update/upload controls.'); return false; }
    if(GITHUB_TABS.indexOf(t)<0){ if(manual) alert('Refresh Data is available for GitHub data tabs only.'); return false; }
    if(refreshInFlight) return false;
    refreshInFlight=true; window.__githubRefreshInProgress=true;
    var btn=$('codexGithubRefreshBtn'); if(btn){btn.disabled=true;btn.dataset.oldText=btn.innerHTML;btn.innerHTML='<b>⟳</b><span>Refreshing...</span>';}
    try{
      if(t==='dashboard'&&typeof window.reloadServiceEyeGithubExcelData==='function') await window.reloadServiceEyeGithubExcelData(true);
      else if(typeof window.refreshServiceEyeActiveGithubTab==='function') await window.refreshServiceEyeActiveGithubTab(t,true);
      else if(typeof window.loadKnownGithubTab==='function') await window.loadKnownGithubTab(t,true);
      rerenderVisible(); return true;
    }catch(e){ if(manual) alert('GitHub refresh failed: '+(e&&e.message?e.message:e)); return false; }
    finally{refreshInFlight=false;window.__githubRefreshInProgress=false;if(btn){btn.disabled=false;btn.innerHTML=btn.dataset.oldText||'<b>⟳</b><span>Refresh Data</span>';}}
  }
  function ensureRefreshButton(){
    var legacyBlock=$('sidebarRefreshDataBlock'); if(legacyBlock) legacyBlock.remove();
    var legacyBtn=$('sidebarRefreshDataBtn'); if(legacyBtn) legacyBtn.remove();
    var bottom=getBottom(); if(!bottom) return;
    var btn=$('codexGithubRefreshBtn');
    if(!btn){btn=document.createElement('button');btn.id='codexGithubRefreshBtn';btn.type='button';btn.className='codex-refresh-btn';btn.innerHTML='<b>⟳</b><span>Refresh Data</span>';btn.title='Refresh current data tab';bottom.appendChild(btn);}
    btn.onclick=function(){runGithubRefresh(visibleTab(),true);};
    btn.style.display='flex';
  }
  function rerenderVisible(){
    var t=visibleTab();
    setTimeout(function(){try{
      if(t==='gspn'&&typeof window.render==='function') window.render();
      if(t==='sky'&&typeof window.renderSky==='function') window.renderSky();
      if(t==='profit'&&typeof window.renderProfit==='function') window.renderProfit();
      if(t==='cashTarget'&&typeof window.renderCashTarget==='function') window.renderCashTarget();
      if(t==='returnCases'&&typeof window.renderReturnCases==='function') window.renderReturnCases();
      if(t==='receivedDelivered'&&typeof window.renderReceivedDelivered==='function') window.renderReceivedDelivered();
      if(t==='dashboard'&&typeof window.renderDashboardTables==='function') window.renderDashboardTables();
    }catch(e){}},80);
  }
  function boot(){ensureTooltips();ensurePalette();ensureRefreshButton();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
  window.addEventListener('load',function(){setTimeout(boot,500);});
  try{var timer=null;new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(function(){ensureTooltips();ensurePalette();ensureRefreshButton();},160);}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});}catch(e){}
})();


/* ===== codex-sidebar-bottom-class-fix ===== */

(function(){function fix(){var b=document.getElementById('codexSidebarBottom');if(b)b.classList.remove('side-label');}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix);else fix();window.addEventListener('load', once(fix));})();


/* ===== codex-single-url-github-auth-check-script ===== */

(function(){
  'use strict';
  function cleanAdminUrl(){
    try {
      var url = new URL(window.location.href);
      if(url.searchParams.has('admin')){
        url.searchParams.delete('admin');
        var next = url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '') + url.hash;
        history.replaceState(null, document.title, next);
      }
    } catch(e) {}
  }
  function getUsers(){ try { return JSON.parse(localStorage.getItem('serviceEyeUsers') || localStorage.getItem('serviceSupportUsers') || '[]') || []; } catch(e) { return []; } }
  function getSession(){ try { return JSON.parse(sessionStorage.getItem('serviceEyeSession') || localStorage.getItem('serviceEyeSession') || 'null'); } catch(e) { return null; } }
  function currentUser(){ var s=getSession(); if(!s) return null; return getUsers().find(function(u){ return u.id === s.id; }) || null; }
  function assertAuthReady(){
    var report = {
      urlMode: 'single-url',
      adminQueryIgnored: true,
            hasUsersStore: true,
      storageAvailable: false,
      sessionAvailable: false,
      currentUserRole: null
    };
    try { localStorage.setItem('__serviceEyeStorageTest','1'); localStorage.removeItem('__serviceEyeStorageTest'); report.storageAvailable = true; } catch(e) {}
    try { sessionStorage.setItem('__serviceEyeSessionTest','1'); sessionStorage.removeItem('__serviceEyeSessionTest'); report.sessionAvailable = true; } catch(e) {}
    var u=currentUser(); if(u) report.currentUserRole = u.role || null;
    window.serviceEyeAuthDeploymentCheck = report;
    return report;
  }
  cleanAdminUrl();
  window.serviceEyeRequireAdminQuery = false;
  window.serviceEyeAuthDeploymentCheckRun = assertAuthReady;
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', assertAuthReady); else assertAuthReady();
  window.addEventListener('load', function(){ cleanAdminUrl(); assertAuthReady(); });
})();


/* ===== codex-chart-readable-colors-final-script ===== */

(function(){
  function tuneChart(chart){
    if(!chart || !chart.options) return;
    try {
      var opts = chart.options;
      if(opts.plugins && opts.plugins.legend && opts.plugins.legend.labels) opts.plugins.legend.labels.color = '#111827';
      if(opts.scales){
        Object.keys(opts.scales).forEach(function(k){
          var s=opts.scales[k];
          if(s.ticks) s.ticks.color = '#111827';
          if(s.grid) s.grid.color = 'rgba(17,24,39,.16)';
        });
      }
      chart.update('none');
    } catch(e) {}
  }
  function tuneAll(){
    try {
      if(window.Chart){ Chart.defaults.color = '#111827'; Chart.defaults.borderColor = 'rgba(17,24,39,.16)'; }
      if(window.dashboardCharts) Object.keys(window.dashboardCharts).forEach(function(id){ tuneChart(window.dashboardCharts[id]); });
    } catch(e) {}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', tuneAll); else tuneAll();
  window.addEventListener('load', function(){ setTimeout(tuneAll, 400); });
  document.addEventListener('click', function(e){ if(e.target && e.target.closest && e.target.closest('.codex-color-swatch')) setTimeout(tuneAll, 220); }, true);
})();


/* ===== comprehensive-fix-script ===== */

(function () {
  'use strict';

  /* ── 1. SCROLL ARROWS: replace text characters with clean SVG arrows ── */
  function fixScrollArrows() {
    var stack = document.querySelector('.all-tabs-fab-stack');
    if (!stack) return;
    var btns = stack.querySelectorAll('.all-tabs-fab');
    if (btns.length < 2) return;

    /* Up arrow SVG */
    if (!btns[0].dataset.arrowFixed) {
      btns[0].dataset.arrowFixed = '1';
      btns[0].innerHTML =
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>';
      btns[0].style.color = '#ffffff';
    }
    /* Down arrow SVG */
    if (!btns[1].dataset.arrowFixed) {
      btns[1].dataset.arrowFixed = '1';
      btns[1].innerHTML =
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
      btns[1].style.color = '#ffffff';
    }
  }

  /* ── 3. LOGIN FLASH GUARD (additional safety) ────────────────────────── */

  /* ── BOOT ────────────────────────────────────────────────────────────── */
  function boot() {
    fixScrollArrows();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  window.addEventListener('load', function () {
    setTimeout(boot, 300);
  });

  /* Re-run if FAB stack is injected late */
  try {
    new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType === 1 && (n.classList.contains('all-tabs-fab-stack') || n.querySelector && n.querySelector('.all-tabs-fab-stack'))) {
            setTimeout(fixScrollArrows, 80);
          }
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  } catch (e) {}

})();


/* ===== return-cases-visibility-and-sidebar-final-fix ===== */

(function(){
  'use strict';

  var ORDER = [
    ['dashboard','Dashboard','<span class="side-icon dashboard-side-icon">📊</span>',"switchTab('dashboard')"],
    ['gspn','GSPN Tracking Cases','<img class="side-tab-logo" src="assets/GSPN.png" alt="GSPN Logo" />',"switchTab('gspn')"],
    ['sky','SKY Tracking Cases','<img class="side-tab-logo" src="assets/SKY.PNG" alt="SKY CARE Logo" />',"switchTab('sky')"],
    ['preBooking','Pre_Booking','<span class="side-icon prebooking-side-icon">📋</span>',"switchTab('preBooking')"],
    ['returnCases','Return Cases','<span class="side-icon returncases-side-icon">↩️</span>',"switchTab('returnCases')"],
    ['profit','Profitability & commission','<span class="side-icon">💰</span>',"switchTab('profit')"],
    ['cashTarget','Cash & Target','<span class="side-icon">🎯</span>',"openCashTargetTab()"],
    ['userManagement','User Management','<span class="side-icon">👥</span>',"switchTab('userManagement')"]
  ];
  var PAGE_IDS = {
    dashboard:'dashboardPage',
    gspn:'gspnPage',
    sky:'skyPage',
    preBooking:'preBookingPage',
    returnCases:'returnCasesPage',
    profit:'profitPage',
    cashTarget:'cashTargetPage',
    userManagement:'userManagementPage'
  };

  function text(v){ return String(v == null ? '' : v).trim(); }
  function lower(v){ return text(v).toLowerCase(); }
  function $(id){ return document.getElementById(id); }

  function keyFromTab(el){
    if(!el) return '';
    var k = el.getAttribute('data-pb-tab') || el.getAttribute('data-fb-tab-key') || '';
    if(k) return k;
    var oc = el.getAttribute('onclick') || '';
    var t = lower(el.textContent);
    if(oc.indexOf('dashboard')>=0 || t.indexOf('dashboard')>=0) return 'dashboard';
    if(oc.indexOf('preBooking')>=0 || t.indexOf('pre_booking')>=0 || t.indexOf('pre booking')>=0) return 'preBooking';
    if(oc.indexOf('returnCases')>=0 || t.indexOf('return cases')>=0) return 'returnCases';
    if(oc.indexOf('gspn')>=0 || t.indexOf('gspn')>=0) return 'gspn';
    if(oc.indexOf('sky')>=0 || t.indexOf('sky')>=0) return 'sky';
    if(oc.indexOf('profit')>=0 || t.indexOf('profit')>=0 || t.indexOf('commission')>=0) return 'profit';
    if(oc.indexOf('openCashTargetTab')>=0 || oc.indexOf('cashTarget')>=0 || t.indexOf('cash')>=0 || t.indexOf('target')>=0) return 'cashTarget';
    if(t.indexOf('user management')>=0 || el.classList.contains('firebase-user-management-tab')) return 'userManagement';
    return '';
  }

  function makeTab(def){
    var el = document.createElement('div');
    el.className = 'side-tab';
    if(def[0] === 'userManagement') el.className += ' firebase-user-management-tab admin-only';
    el.setAttribute('data-pb-tab', def[0]);
    el.setAttribute('data-fb-tab-key', def[0]);
    el.setAttribute('data-tip', def[1]);
    el.setAttribute('onclick', def[3]);
    el.innerHTML = def[2] + '<span class="side-label">' + def[1] + '</span>';
    return el;
  }

  /* [dedup] orphan helper canSeeTab removed */

  function normalizeSidebar(){
    var side = $('sideMenu') || document.querySelector('.side-menu');
    if(!side) return;

    var tabs = Array.prototype.slice.call(side.querySelectorAll('.side-tab'));
    tabs.forEach(function(el){
      var k = keyFromTab(el);
      if(k){
        el.setAttribute('data-pb-tab', k);
        el.setAttribute('data-fb-tab-key', k);
        el.setAttribute('data-tip', (ORDER.find(function(d){return d[0]===k;}) || [,''])[1] || text(el.textContent));
      }
    });

    var seenKeys = {};
    Array.prototype.slice.call(side.querySelectorAll('.side-tab')).forEach(function(el){
      var k = keyFromTab(el);
      if(!k) return;
      if(seenKeys[k]) {
        try { el.remove(); } catch(e) { if(el.parentNode) el.parentNode.removeChild(el); }
      } else {
        seenKeys[k] = el;
      }
    });

    ORDER.forEach(function(def){
      if(def[0] === 'userManagement'){
        var existingUM = side.querySelector('.side-tab.firebase-user-management-tab') || Array.prototype.slice.call(side.querySelectorAll('.side-tab')).find(function(e){ return keyFromTab(e)==='userManagement'; });
        if(existingUM){
          existingUM.setAttribute('data-pb-tab','userManagement');
          existingUM.setAttribute('data-fb-tab-key','userManagement');
          existingUM.setAttribute('data-tip','User Management');
        }
        return;
      }
      var existing = Array.prototype.slice.call(side.querySelectorAll('.side-tab')).find(function(e){ return keyFromTab(e) === def[0]; });
      if(!existing) side.appendChild(makeTab(def));
    });

    var workspace = Array.prototype.slice.call(side.querySelectorAll('.side-section-title')).find(function(e){ return lower(e.textContent).indexOf('workspace')>=0; });
    if(!workspace){
      workspace = document.createElement('div');
      workspace.className = 'side-section-title side-label';
      workspace.textContent = 'Workspace';
      var head = side.querySelector('.side-head');
      if(head && head.nextSibling) side.insertBefore(workspace, head.nextSibling);
      else side.insertBefore(workspace, side.firstChild);
    }

    var anchor = workspace;
    ORDER.forEach(function(def, idx){
      var el = Array.prototype.slice.call(side.querySelectorAll('.side-tab')).find(function(e){ return keyFromTab(e) === def[0]; });
      if(!el) return;
      el.style.order = String(20 + idx);
      if(def[0] === 'returnCases'){
        el.classList.remove('fb-tab-denied');
        el.setAttribute('aria-hidden','false');
        el.style.removeProperty('display');
        el.style.removeProperty('visibility');
        el.style.removeProperty('opacity');
        el.style.removeProperty('height');
        el.style.removeProperty('width');
      }
      if(anchor.nextSibling !== el) side.insertBefore(el, anchor.nextSibling);
      anchor = el;
    });

    var active = '';
    try { active = localStorage.getItem('serviceEyeActiveTab') || ''; } catch(e) {}
    if(active){
      Array.prototype.slice.call(side.querySelectorAll('.side-tab')).forEach(function(el){
        el.classList.toggle('active', keyFromTab(el) === active);
      });
    }
  }

  function setVisiblePage(key){
    Object.keys(PAGE_IDS).forEach(function(k){
      var page = $(PAGE_IDS[k]);
      if(page) page.style.display = (k === key ? 'block' : 'none');
    });
    Array.prototype.slice.call(document.querySelectorAll('.side-tab')).forEach(function(el){
      el.classList.toggle('active', keyFromTab(el) === key);
    });
    try { localStorage.setItem('serviceEyeActiveTab', key); } catch(e) {}
  }

  var previousSwitch = window.switchTab;
  window.switchTab = function(tab){
    normalizeSidebar();

    if(tab === 'returnCases'){
      if(!$('returnCasesPage') && typeof window.loadReturnCases === 'function'){
        try { window.loadReturnCases(false); } catch(e) {}
      }
      setVisiblePage('returnCases');
      if(typeof window.loadReturnCases === 'function') setTimeout(function(){ window.loadReturnCases(false); }, 60);
      else if(typeof window.renderReturnCases === 'function') setTimeout(window.renderReturnCases, 60);
      return;
    }

    var result;
    if(typeof previousSwitch === 'function') result = previousSwitch.apply(this, arguments);
    var returnPage = $('returnCasesPage');
    if(returnPage && tab !== 'returnCases') returnPage.style.display = 'none';
    setTimeout(normalizeSidebar, 80);
    return result;
  };

  function patchFirebaseShowTab(){
    if(window.__returnCasesShowTabPatched) return;
    window.__returnCasesShowTabPatched = true;
    document.addEventListener('click', function(ev){
      var tab = ev.target && ev.target.closest ? ev.target.closest('.side-tab') : null;
      if(!tab) return;
      var k = keyFromTab(tab);
      if(k === 'returnCases'){
        ev.preventDefault();
        ev.stopImmediatePropagation();
        window.switchTab('returnCases');
        return false;
      }
    }, true);
  }

  function boot(){
    normalizeSidebar();
    patchFirebaseShowTab();
    var active = '';
    try { active = localStorage.getItem('serviceEyeActiveTab') || ''; } catch(e) {}
    if(active === 'returnCases') window.switchTab('returnCases');
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', function(){ setTimeout(boot, 100); setTimeout(boot, 900); });

  var runs = 0;
  var timer = setInterval(function(){
    normalizeSidebar();
    runs += 1;
    if(runs > 25) clearInterval(timer);
  }, 400);

  try {
    new MutationObserver(function(){ normalizeSidebar(); }).observe(document.getElementById('sideMenu') || document.body, {childList:true, subtree:true});
  } catch(e) {}
})();


/* ===== repair-efficiency-tab-v1 ===== */

(function(){
  'use strict';
  var $=function(id){return document.getElementById(id);}, txt=function(v){return String(v==null?'':v).trim();};
  var reRows=[], reFiltered=[], reRawCols=[], reCols=[], reSort={col:'Rank',dir:1}, refreshTimer=null;
  var TITLE='Repair Efficiency', KEY='repairEfficiency', PAGE='repairEfficiencyPage';
  var FILES=['Repair Efficiency.xlsx','Repair_Efficiency.xlsx','RepairEfficiency.xlsx','repair_efficiency.xlsx','Repair efficiency.xlsx'];
  function esc(v){return txt(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
  function normKey(k){return txt(k).toLowerCase().replace(/[^a-z0-9]/g,'');}
  function num(v){if(typeof v==='number')return v; var n=Number(txt(v).replace(/,/g,'').replace('%','')); return isFinite(n)?n:0;}
  function fmt(n){return Number(n||0).toLocaleString();}
  function pct(v){var s=txt(v); if(!s)return '0%'; var n=num(v); if(s.indexOf('%')>=0)return (isFinite(n)?n:0).toFixed(1).replace(/\.0$/,'')+'%'; if(n<=1)n=n*100; return (isFinite(n)?n:0).toFixed(1).replace(/\.0$/,'')+'%';}
  function get(row,names){var keys=Object.keys(row||{}); for(var i=0;i<names.length;i++){var want=normKey(names[i]); for(var j=0;j<keys.length;j++){if(normKey(keys[j])===want)return row[keys[j]];}} return '';}
  function rankVal(r){var n=num(r._rank); return n>0?n:999999;}
  function uniq(a){var o={}; return a.map(txt).filter(Boolean).filter(function(x){var k=x.toLowerCase(); if(o[k])return false; o[k]=1; return true;}).sort(function(a,b){return a.localeCompare(b);});}
  function notice(status,source,rows,msg){var n=$('serviceV2Notice_repairEfficiency'); if(!n)return; n.innerHTML='<span class="source">Repair Efficiency — '+esc(status)+'</span><span>Source: <b>'+esc(source||'Auto Sync')+'</b></span><span>Rows: <b>'+fmt(rows||0)+'</b></span><span>Last Update: <b>'+esc(status==='Waiting for data'?'-':new Date().toLocaleString())+'</b></span><span>'+esc(msg||'')+'</span>'; try{localStorage.setItem('serviceV2Last_repairEfficiency',JSON.stringify({state:status,source:source||'Auto Sync',rows:rows||0,time:new Date().toLocaleString(),msg:msg||''}));}catch(e){} }
  function restoreNotice(){try{var saved=JSON.parse(localStorage.getItem('serviceV2Last_repairEfficiency')||'null'); if(saved&&$('serviceV2Notice_repairEfficiency')){$('serviceV2Notice_repairEfficiency').innerHTML='<span class="source">Repair Efficiency — '+esc(saved.state||'Data updated')+'</span><span>Source: <b>'+esc(saved.source||'Auto Sync')+'</b></span><span>Rows: <b>'+fmt(saved.rows||0)+'</b></span><span>Last Update: <b>'+esc(saved.time||'-')+'</b></span><span>'+esc(saved.msg||'')+'</span>';}}catch(e){} }
  function filterBox(id,title){return '<div class="re-filter-box" id="'+id+'" data-title="'+esc(title)+'"></div>';}
  function makePage(){ if($(PAGE)) return; document.body.insertAdjacentHTML('beforeend','<div class="page-shell" id="repairEfficiencyPage"><header><div class="brand"><div class="logo-box"><img src="assets/SKY.PNG" loading="eager" decoding="async" fetchpriority="high" data-site-logo="1" alt="Logo"></div><div><h1>Service Support Center</h1><div class="sub">Repair Efficiency</div></div></div><div class="header-actions"></div></header><div id="serviceV2Notice_repairEfficiency" class="service-v2-update-notice"><span class="source">Repair Efficiency — Waiting for data</span><span>Source: <b>Auto Sync</b></span><span>Rows: <b>0</b></span><span>Last Update: <b>-</b></span><span>Waiting for data</span></div><main><div class="re-filters">'+filterBox('reTechnicianFilter','Technician Name')+filterBox('reTierFilter','Performance Tier')+'<div class="re-filter-actions"><button class="re-btn light" onclick="window.reClearFilters&&window.reClearFilters()">Clear Filters</button></div></div><div class="re-cards cards"><div class="card re-card rank1"><div class="re-rank-icon">🥇</div><div class="label">Rank 1</div><div class="value" id="reTopName1">-</div><div class="percent" id="reTopInfo1">Repair Success: 0%<br>Not-Repaired: 0%<br>Tier: -</div></div><div class="card re-card rank2"><div class="re-rank-icon">🥈</div><div class="label">Rank 2</div><div class="value" id="reTopName2">-</div><div class="percent" id="reTopInfo2">Repair Success: 0%<br>Not-Repaired: 0%<br>Tier: -</div></div><div class="card re-card rank3"><div class="re-rank-icon">🥉</div><div class="label">Rank 3</div><div class="value" id="reTopName3">-</div><div class="percent" id="reTopInfo3">Repair Success: 0%<br>Not-Repaired: 0%<br>Tier: -</div></div></div><section class="re-section"><h2>Repair Efficiency Data <span><button class="re-btn" onclick="window.reDownloadTable&&window.reDownloadTable()">Download</button></span></h2><div class="re-table-wrap"><table class="re-table" id="reDataTable"></table></div></section></main></div>'); restoreNotice(); }
  function keyOf(el){var oc=el.getAttribute('onclick')||''; var m=oc.match(/switchTab\(['"]([^'"]+)/); return el.getAttribute('data-pb-tab')||el.getAttribute('data-fb-tab-key')||(m&&m[1])||'';}
  function ensureSide(){var side=$('sideMenu')||document.querySelector('.side-menu'); if(!side)return; var existing=Array.prototype.slice.call(side.querySelectorAll('.side-tab')).find(function(x){return keyOf(x)===KEY||(x.textContent||'').toLowerCase().indexOf('repair efficiency')>=0;}); if(!existing){var html='<div class="side-tab" data-pb-tab="repairEfficiency" data-fb-tab-key="repairEfficiency" onclick="switchTab(\'repairEfficiency\')"><span class="side-icon">🛠️</span><span class="side-label">Repair Efficiency</span></div>'; var ref=Array.prototype.slice.call(side.querySelectorAll('.side-tab')).find(function(x){return keyOf(x)==='receivedDelivered';})||Array.prototype.slice.call(side.querySelectorAll('.side-tab')).find(function(x){return keyOf(x)==='returnCases';}); if(ref)ref.insertAdjacentHTML('afterend',html); else side.insertAdjacentHTML('beforeend',html);} else {existing.setAttribute('data-pb-tab',KEY); existing.setAttribute('data-fb-tab-key',KEY); existing.setAttribute('onclick',"switchTab('repairEfficiency')");} enforceRepairPermission(); }
  function waitX(){return new Promise(function(resolve,reject){var t=0;(function chk(){if(window.XLSX)return resolve(); if((t+=100)>8000)return reject(new Error('XLSX library not loaded')); setTimeout(chk,100);})();});}
  async function fetchWorkbookFile(fileName,manual){if(manual&&typeof serviceClearDataVersion==='function')serviceClearDataVersion(fileName); var url=typeof serviceDataUrl==='function'?await serviceDataUrl(fileName,!!manual):encodeURIComponent(fileName)+'?v='+(manual?Date.now():'stable'); var res=await fetch(url,{cache:manual?'no-store':'no-cache'}); if(!res.ok)throw new Error(fileName+' HTTP '+res.status); var buf=await res.arrayBuffer(); return XLSX.read(new Uint8Array(buf),{type:'array',cellDates:true,raw:true});}
  async function fetchRows(manual){await waitX(); var lastErr=null; for(var i=0;i<FILES.length;i++){try{var wb=await fetchWorkbookFile(FILES[i],manual); var sn=wb.SheetNames.indexOf('Repair Efficiency')>=0?'Repair Efficiency':(wb.SheetNames.indexOf('Sheet1')>=0?'Sheet1':wb.SheetNames[0]); var rows=XLSX.utils.sheet_to_json(wb.Sheets[sn],{defval:'',raw:true}); return {rows:rows,file:FILES[i]};}catch(e){lastErr=e;}} throw lastErr||new Error('Repair Efficiency file not found');}
  function normaliseRaw(rows){reRawCols=[]; var out=[]; (rows||[]).forEach(function(row){if(!Object.values(row).some(function(v){return txt(v)!=='';}))return; Object.keys(row).forEach(function(k){if(reRawCols.indexOf(k)<0)reRawCols.push(k);}); var tech=txt(get(row,['Technician Name','Technician','TechnicianName','Tech Name','Tech'])); var tier=txt(get(row,['Performance Tier','Tier','PerformanceTier'])); var rank=get(row,['Rank','Ranking','Technician Rank']); var success=get(row,['Repair Success %','Repair Success','RepairSuccess%','Repair Success Percent','Success %','Success']); var notRep=get(row,['Not-Repaired %','Not Repaired %','Not-Repaired','Not Repaired','NotRepaired%','Not repaired %']); var copy=Object.assign({},row); copy._technician=tech; copy._tier=tier; copy._rank=rank; copy._success=success; copy._notRepaired=notRep; out.push(copy);}); if(!reRawCols.length)reRawCols=['Rank','Technician Name','Repair Success %','Not-Repaired %','Performance Tier']; return out;}
  function selected(id){var b=$(id); return b&&b.__selected?b.__selected.slice():[];}
  function buildFilter(id,values){var b=$(id); if(!b)return; var title=b.getAttribute('data-title')||id, selectedVals=b.__selected||[], all=uniq(values); selectedVals=selectedVals.filter(function(v){return all.indexOf(v)>=0;}); b.__selected=selectedVals; var label=selectedVals.length?((selectedVals.length>2?selectedVals.length+' selected':selectedVals.join(', '))):'(Select All)'; b.innerHTML='<div class="re-filter-label">'+esc(title)+'</div><button type="button" class="re-filter-btn">'+esc(label)+'</button><div class="re-filter-menu"><input class="re-filter-search" placeholder="Search"><div class="re-filter-list"></div><div class="re-filter-actions-menu"><button type="button" class="re-btn ok">OK</button><button type="button" class="re-btn light cancel">Cancel</button></div></div>'; var btn=b.querySelector('.re-filter-btn'), menu=b.querySelector('.re-filter-menu'), list=b.querySelector('.re-filter-list'), search=b.querySelector('.re-filter-search'); var temp=selectedVals.slice(); function draw(){var q=txt(search.value).toLowerCase(); var vals=all.filter(function(v){return !q||v.toLowerCase().indexOf(q)>=0;}); list.innerHTML='<label class="re-filter-option"><input type="checkbox" data-all="1" '+(!temp.length?'checked':'')+'> <span>(Select All)</span></label>'+vals.map(function(v){return '<label class="re-filter-option"><input type="checkbox" value="'+esc(v)+'" '+(temp.indexOf(v)>=0?'checked':'')+'> <span>'+esc(v)+'</span></label>';}).join(''); list.querySelectorAll('input').forEach(function(cb){cb.onchange=function(){if(cb.getAttribute('data-all')){temp=[];}else{var v=cb.value, i=temp.indexOf(v); if(cb.checked&&i<0)temp.push(v); if(!cb.checked&&i>=0)temp.splice(i,1);} draw();};});}
    btn.onclick=function(e){e.stopPropagation(); document.querySelectorAll('.re-filter-box.open').forEach(function(x){if(x!==b)x.classList.remove('open');}); b.classList.toggle('open'); draw();}; menu.onclick=function(e){e.stopPropagation();}; search.oninput=draw; b.querySelector('.cancel').onclick=function(){b.classList.remove('open');}; b.querySelector('.ok').onclick=function(){b.__selected=temp.slice(); b.classList.remove('open'); render();}; draw();}
  function initFilters(){buildFilter('reTechnicianFilter',reRows.map(function(r){return r._technician;})); buildFilter('reTierFilter',reRows.map(function(r){return r._tier;}));}
  function filterRows(){var tech=selected('reTechnicianFilter'), tier=selected('reTierFilter'); return reRows.filter(function(r){if(tech.length&&tech.indexOf(r._technician)<0)return false;if(tier.length&&tier.indexOf(r._tier)<0)return false;return true;});}
  function bestRows(rows){return rows.slice().sort(function(a,b){var ar=rankVal(a), br=rankVal(b); if(ar!==br)return ar-br; var s=num(b._success)-num(a._success); if(s)return s; return txt(a._technician).localeCompare(txt(b._technician));}).slice(0,3);}
  function renderCards(rows){var top=bestRows(rows); for(var i=0;i<3;i++){var r=top[i]||{}; var n=$('reTopName'+(i+1)), info=$('reTopInfo'+(i+1)); if(n)n.textContent=r._technician||'-'; if(info)info.innerHTML='Repair Success: '+esc(pct(r._success))+'<br>Not-Repaired: '+esc(pct(r._notRepaired))+'<br>Tier: '+esc(r._tier||'-');}}
  function colValue(row,col){if(col==='Technician Name'&&!row[col])return row._technician;if(col==='Performance Tier'&&!row[col])return row._tier;if(col==='Rank'&&!row[col])return row._rank;if(col==='Repair Success %'&&!row[col])return row._success;if(col==='Not-Repaired %'&&!row[col])return row._notRepaired;return row[col];}
  function isRepairEfficiencyPercentColumn(col){
    col = txt(col).toLowerCase();
    return col.indexOf('%') >= 0 || col.indexOf('percent') >= 0;
  }
  function displayVal(row,col){
    var v=colValue(row,col);
    // Only columns explicitly marked as percent should be formatted as percentages.
    // Count columns such as "Not Repaired" and "Repaired" must stay as values.
    if(isRepairEfficiencyPercentColumn(col))return pct(v);
    return v instanceof Date?v.toLocaleDateString():v;
  }
  function sortRows(rows){var col=reSort.col; return rows.slice().sort(function(a,b){var av=colValue(a,col), bv=colValue(b,col), c=0; if(/rank/i.test(col))c=rankVal(a)-rankVal(b); else if(isRepairEfficiencyPercentColumn(col)||num(av)!==0||num(bv)!==0)c=num(av)-num(bv); else c=txt(av).localeCompare(txt(bv)); return c*reSort.dir;});}
  function renderTable(){var tbl=$('reDataTable'); if(!tbl)return; if(!reCols.length)reCols=(reRawCols.length?reRawCols:['Rank','Technician Name','Repair Success %','Not-Repaired %','Performance Tier']).slice(); var rows=sortRows(reFiltered); if(!rows.length){tbl.innerHTML='<tbody><tr><td class="re-empty">No data available</td></tr></tbody>'; return;} tbl.innerHTML='<thead><tr>'+reCols.map(function(c,i){return '<th draggable="true" data-col="'+esc(c)+'" data-idx="'+i+'">'+esc(c)+' '+(reSort.col===c?(reSort.dir>0?'▲':'▼'):'')+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(r){return '<tr>'+reCols.map(function(c){return '<td>'+esc(displayVal(r,c))+'</td>';}).join('')+'</tr>';}).join('')+'</tbody>'; tbl.querySelectorAll('th').forEach(function(th){th.onclick=function(){var c=th.dataset.col; if(reSort.col===c)reSort.dir*=-1; else reSort={col:c,dir:1}; render();}; th.ondragstart=function(e){e.dataTransfer.setData('text/plain',th.dataset.idx);}; th.ondragover=function(e){e.preventDefault();}; th.ondrop=function(e){e.preventDefault();var from=Number(e.dataTransfer.getData('text/plain')), to=Number(th.dataset.idx); if(isNaN(from)||isNaN(to)||from===to)return; reCols.splice(to,0,reCols.splice(from,1)[0]); render();};});}
  function render(){reFiltered=filterRows(); renderCards(reFiltered); renderTable(); notice('Data updated','Auto Sync',reRows.length,'Fresh data loaded by Auto sync');}
  window.renderRepairEfficiency=render;
  function toXlsx(rows,name){ if(!window.XLSX)return; var cols=reCols.length?reCols:reRawCols; var data=rows.map(function(r){var o={}; cols.forEach(function(c){o[c]=displayVal(r,c);}); return o;}); var ws=XLSX.utils.json_to_sheet(data), wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,name.slice(0,31)); XLSX.writeFile(wb,name+'.xlsx'); }
  window.reDownloadTable=function(){toXlsx(reFiltered,'Repair Efficiency Data');};
  window.reClearFilters=function(){['reTechnicianFilter','reTierFilter'].forEach(function(id){var b=$(id); if(b)b.__selected=[];}); initFilters(); render();};
  window.loadRepairEfficiency=async function(manual){makePage(); ensureSide(); notice('Updating now','Auto Sync',reRows.length,'Loading data...'); try{var result=await fetchRows(!!manual); reRows=normaliseRaw(result.rows); window.repairEfficiencyRows=reRows; initFilters(); render(); notice('Data updated','GitHub: '+result.file,reRows.length,'Fresh data loaded by Auto sync'); return reRows;}catch(e){console.error(e); window.repairEfficiencyRows=reRows; initFilters(); if(reRows.length){render(); notice('Data updated','Auto Sync',reRows.length,'GitHub not reachable — existing data kept'); return reRows;} render(); notice('Waiting for data','Auto Sync',0,e&&e.message?e.message:'Load failed'); return [];} };
  function allowedRepair(){var p=window.currentFirebaseUserProfile; if(!p)return true; var role=txt(p.role).toUpperCase(); if(role==='ADMIN')return true; var tabs=Array.isArray(p.allowedTabs)?p.allowedTabs:[]; if(role==='MANAGER'&&!tabs.length)return true; return tabs.indexOf(KEY)>=0||tabs.indexOf(TITLE)>=0;}
  function enforceRepairPermission(){var side=$('sideMenu')||document; var tabs=Array.prototype.slice.call(side.querySelectorAll('.side-tab')).filter(function(el){return keyOf(el)===KEY||(el.textContent||'').toLowerCase().indexOf('repair efficiency')>=0;}); var ok=allowedRepair(); tabs.forEach(function(el){el.classList.toggle('fb-tab-denied',!ok); el.setAttribute('aria-hidden',ok?'false':'true'); if(!ok){el.style.setProperty('display','none','important'); el.style.setProperty('visibility','hidden','important');} else {el.style.removeProperty('display'); el.style.removeProperty('visibility'); el.style.removeProperty('opacity');}}); var p=$(PAGE); if(p&&!ok)p.style.setProperty('display','none','important'); return ok;}
  function hideAllShow(){if(!enforceRepairPermission())return false; ['dashboardPage','gspnPage','skyPage','preBookingPage','returnCasesPage','receivedDeliveredPage','profitPage','cashTargetPage','userManagementPage','repairEfficiencyPage'].forEach(function(id){var p=$(id); if(p)p.style.display='none';}); var pg=$(PAGE); if(pg)pg.style.display='block'; Array.prototype.slice.call(document.querySelectorAll('.side-tab')).forEach(function(el){el.classList.toggle('active',keyOf(el)===KEY);}); try{localStorage.setItem('serviceEyeActiveTab',KEY);}catch(e){} try{ if(typeof window.sscUpdatePresenceTab==='function') window.sscUpdatePresenceTab(TITLE); }catch(e){} return true;}
  function show(){makePage(); ensureSide(); if(!hideAllShow())return; if(!reRows.length)window.loadRepairEfficiency(false); else render();}
  var oldSwitch=window.switchTab; window.switchTab=function(tab){ if(tab===KEY){show();return;} var r=typeof oldSwitch==='function'?oldSwitch.apply(this,arguments):undefined; var pg=$(PAGE); if(pg)pg.style.display='none'; setTimeout(ensureSide,80); return r; };
  document.addEventListener('click',function(e){var tab=e.target&&e.target.closest?e.target.closest('.side-tab'):null; if(tab&&(keyOf(tab)===KEY||(tab.textContent||'').toLowerCase().indexOf('repair efficiency')>=0)){e.preventDefault();e.stopImmediatePropagation();show();}},true);
  document.addEventListener('click',function(e){if(!e.target.closest||!e.target.closest('.re-filter-box'))document.querySelectorAll('.re-filter-box.open').forEach(function(x){x.classList.remove('open');});});
  function patchUserManagementCheckboxes(){var addBox=$('umAllowedTabsBox'); if(addBox&&!addBox.querySelector('input[value="'+TITLE+'"],input[value="'+KEY+'"]')) addBox.insertAdjacentHTML('beforeend','<label><input type="checkbox" value="'+KEY+'">'+TITLE+'</label>'); document.querySelectorAll('#umUsersTable .um-row-tabs').forEach(function(box){if(!box.querySelector('input[value="'+TITLE+'"],input[value="'+KEY+'"]')){var edit=box.querySelector('.um-tabs-edit')||box; edit.insertAdjacentHTML('beforeend','<label><input type="checkbox" value="'+KEY+'" disabled>'+TITLE+'</label>');}});}
  function installUserManagementPatch(){if(window.__repairEfficiencyUmPatchInstalled)return; window.__repairEfficiencyUmPatchInstalled=true; document.addEventListener('click',function(e){if(e.target&&e.target.classList&&e.target.classList.contains('um-edit'))setTimeout(patchUserManagementCheckboxes,60);},true); try{new MutationObserver(function(){patchUserManagementCheckboxes(); enforceRepairPermission();}).observe(document.body,{childList:true,subtree:true});}catch(e){} setInterval(function(){patchUserManagementCheckboxes(); enforceRepairPermission();},3000);}
  function installRefreshPatch(){if(window.__repairEfficiencyRefreshPatchInstalled)return; window.__repairEfficiencyRefreshPatchInstalled=true; document.addEventListener('click',function(e){var btn=e.target&&e.target.closest?e.target.closest('#sidebarRefreshDataBtn'):null; if(!btn)return; var active=''; try{active=localStorage.getItem('serviceEyeActiveTab')||'';}catch(ex){} var pg=$(PAGE); if(active===KEY||(pg&&pg.style.display!=='none')){e.preventDefault(); e.stopImmediatePropagation(); window.loadRepairEfficiency(true);}},true);}
  function boot(){makePage(); ensureSide(); patchUserManagementCheckboxes(); installRefreshPatch(); installUserManagementPatch(); var a=''; try{a=localStorage.getItem('serviceEyeActiveTab')||'';}catch(e){} if(a===KEY)show(); else {window.loadRepairEfficiency(false);} if(!refreshTimer)refreshTimer=setInterval(function(){if(document.visibilityState!=='hidden')window.loadRepairEfficiency(false);},60*60*1000);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot); else boot(); window.addEventListener('load',function(){setTimeout(boot,100);setTimeout(ensureSide,800);});
})();


/* ===== repair-efficiency-navigation-final-fix ===== */

(function(){
  'use strict';
  if(window.__repairEfficiencyNavigationFinalFix) return;
  window.__repairEfficiencyNavigationFinalFix = true;

  var TAB_ORDER = [
    {key:'dashboard', label:'Dashboard', icon:'<span class="side-icon dashboard-side-icon">📊</span>', page:'dashboardPage'},
    {key:'gspn', label:'GSPN Tracking Cases', icon:'<img class="side-tab-logo" src="assets/GSPN.png" alt="GSPN Logo" />', page:'gspnPage'},
    {key:'sky', label:'SKY Tracking Cases', icon:'<img class="side-tab-logo" src="assets/SKY.PNG" alt="SKY CARE Logo" />', page:'skyPage'},
    {key:'preBooking', label:'Pre_Booking', icon:'<span class="side-icon prebooking-side-icon">📋</span>', page:'preBookingPage'},
    {key:'returnCases', label:'Return Cases', icon:'<span class="side-icon returncases-side-icon">↩️</span>', page:'returnCasesPage'},
    {key:'receivedDelivered', label:'Received & Delivered', icon:'<span class="side-icon">📦</span>', page:'receivedDeliveredPage'},
    {key:'repairEfficiency', label:'Repair Efficiency', icon:'<span class="side-icon">🛠️</span>', page:'repairEfficiencyPage'},
    {key:'profit', label:'Profitability & commission', icon:'<span class="side-icon">💰</span>', page:'profitPage'},
    {key:'cashTarget', label:'Cash & Target', icon:'<span class="side-icon">🎯</span>', page:'cashTargetPage'},
    {key:'userManagement', label:'User Management', icon:'<span class="side-icon">👥</span>', page:'userManagementPage', admin:true},
    {key:'security', label:'Security', icon:'<span class="side-icon">🔐</span>', page:'securityPage', admin:true}
  ];
  var PAGE_BY_TAB = {};
  TAB_ORDER.forEach(function(t){ PAGE_BY_TAB[t.key] = t.page; });

  function $(id){ return document.getElementById(id); }
  function txt(v){ return String(v == null ? '' : v).trim(); }
  function low(v){ return txt(v).toLowerCase(); }
  function tabDef(key){ for(var i=0;i<TAB_ORDER.length;i++){ if(TAB_ORDER[i].key === key) return TAB_ORDER[i]; } return null; }
  function normalTab(tab){
    var t = txt(tab);
    if(t === 'cash' || t === 'cash-target' || t === 'cash_target') return 'cashTarget';
    if(t === 'pre_booking' || t === 'pre booking') return 'preBooking';
    if(t === 'return cases') return 'returnCases';
    if(t === 'received delivered' || t === 'received & delivered') return 'receivedDelivered';
    if(t === 'repair efficiency') return 'repairEfficiency';
    if(t === 'user management') return 'userManagement';
    if(t === 'security') return 'security';
    return tabDef(t) ? t : 'gspn';
  }
  function keyFromTab(el){
    if(!el) return '';
    var k = el.getAttribute('data-pb-tab') || el.getAttribute('data-fb-tab-key') || el.dataset.serviceTab || '';
    k = normalTab(k);
    if(k && tabDef(k)) return k;
    var oc = el.getAttribute('onclick') || '';
    var m = oc.match(/switchTab\(['\"]([^'\"]+)/) || oc.match(/openCashTargetTab/);
    if(m && m[1]) return normalTab(m[1]);
    if(oc.indexOf('openCashTargetTab') >= 0) return 'cashTarget';
    var t = low(el.textContent);
    if(t.indexOf('repair efficiency') >= 0) return 'repairEfficiency';
    if(t.indexOf('received') >= 0 && t.indexOf('delivered') >= 0) return 'receivedDelivered';
    if(t.indexOf('return cases') >= 0) return 'returnCases';
    if(t.indexOf('pre_booking') >= 0 || t.indexOf('pre booking') >= 0) return 'preBooking';
    if(t.indexOf('dashboard') >= 0) return 'dashboard';
    if(t.indexOf('gspn') >= 0) return 'gspn';
    if(t.indexOf('sky') >= 0) return 'sky';
    if(t.indexOf('profit') >= 0 || t.indexOf('commission') >= 0) return 'profit';
    if(t.indexOf('cash') >= 0 || t.indexOf('target') >= 0) return 'cashTarget';
    if(t.indexOf('security') >= 0) return 'security';
    if(t.indexOf('user management') >= 0) return 'userManagement';
    return '';
  }
  function isDenied(key){
    var el = document.querySelector('.side-tab[data-pb-tab="'+key+'"],.side-tab[data-fb-tab-key="'+key+'"]');
    if(!el) return false;
    if(el.classList.contains('fb-tab-denied')) return true;
    if(el.getAttribute('aria-hidden') === 'true') return true;
    var cs = window.getComputedStyle ? getComputedStyle(el) : null;
    if(cs && (cs.display === 'none' || cs.visibility === 'hidden')) return true;
    return false;
  }
  function makeTab(def){
    var el = document.createElement('div');
    el.className = 'side-tab' + (def.admin ? ' firebase-user-management-tab admin-only' : '');
    el.setAttribute('data-pb-tab', def.key);
    el.setAttribute('data-fb-tab-key', def.key);
    el.setAttribute('data-tip', def.label);
    el.setAttribute('onclick', "switchTab('"+def.key+"')");
    el.innerHTML = def.icon + '<span class="side-label">' + def.label + '</span>';
    return el;
  }
  function normalizeSidebar(){
    var side = $('sideMenu') || document.querySelector('.side-menu');
    if(!side) return;

    Array.prototype.slice.call(side.querySelectorAll('.side-tab')).forEach(function(el){
      var k = keyFromTab(el);
      if(!k || !tabDef(k)) return;
      var def = tabDef(k);
      el.setAttribute('data-pb-tab', k);
      el.setAttribute('data-fb-tab-key', k);
      el.dataset.serviceTab = k;
      el.setAttribute('data-tip', def.label);
      el.setAttribute('onclick', "switchTab('"+k+"')");
      if(k === 'repairEfficiency'){
        el.style.removeProperty('display');
        el.style.removeProperty('visibility');
        el.style.removeProperty('opacity');
        el.style.removeProperty('height');
        el.style.removeProperty('width');
        el.style.removeProperty('pointer-events');
      }
    });

    var seen = {};
    Array.prototype.slice.call(side.querySelectorAll('.side-tab')).forEach(function(el){
      var k = keyFromTab(el);
      if(!k || !tabDef(k)) return;
      if(seen[k]){ try{ el.remove(); }catch(e){ if(el.parentNode) el.parentNode.removeChild(el); } }
      else seen[k] = el;
    });

    TAB_ORDER.forEach(function(def){
      var el = Array.prototype.slice.call(side.querySelectorAll('.side-tab')).find(function(x){ return keyFromTab(x) === def.key; });
      if(!el){
        el = makeTab(def);
        side.appendChild(el);
      }
      el.style.order = String(20 + TAB_ORDER.indexOf(def));
    });

    var bottom = $('codexSidebarBottom') || $('sidebarRefreshDataBlock') || $('v25ColorOptions');
    TAB_ORDER.forEach(function(def){
      var el = Array.prototype.slice.call(side.querySelectorAll('.side-tab')).find(function(x){ return keyFromTab(x) === def.key; });
      if(!el) return;
      if(bottom && bottom.parentNode === side) side.insertBefore(el, bottom);
      else side.appendChild(el);
    });
  }
  function hideAllPages(){
    Object.keys(PAGE_BY_TAB).forEach(function(k){ var p = $(PAGE_BY_TAB[k]); if(p) p.style.display = 'none'; });
  }
  function setActive(key){
    Array.prototype.slice.call(document.querySelectorAll('.side-tab')).forEach(function(el){ el.classList.toggle('active', keyFromTab(el) === key); });
    try{ localStorage.setItem('serviceEyeActiveTab', key); }catch(e){}
    try{ if(typeof window.sscUpdatePresenceTab === 'function') window.sscUpdatePresenceTab(tabDef(key).label || key); }catch(e){}
  }
  function runTabInit(key){
    setTimeout(function(){
      try{
        if(key === 'gspn'){
          if(typeof currentFilteredRows !== 'undefined' && currentFilteredRows && currentFilteredRows.length && typeof updateCharts === 'function') updateCharts(currentFilteredRows);
        }else if(key === 'sky' && typeof window.renderSky === 'function') window.renderSky();
        else if(key === 'profit' && typeof window.renderProfit === 'function') window.renderProfit();
        else if(key === 'cashTarget' && typeof window.renderCashTarget === 'function') window.renderCashTarget();
        else if(key === 'preBooking'){
          if(typeof window.loadPreBooking === 'function') window.loadPreBooking(false);
          else if(typeof window.renderPB === 'function') window.renderPB();
        }else if(key === 'dashboard'){
          if(typeof window.loadDashboardSources === 'function') window.loadDashboardSources(false);
          else if(typeof window.renderDashboardTables === 'function') window.renderDashboardTables();
        }else if(key === 'returnCases'){
          if(typeof window.loadReturnCases === 'function') window.loadReturnCases(false);
          else if(typeof window.renderReturnCases === 'function') window.renderReturnCases();
        }else if(key === 'receivedDelivered'){
          if(typeof window.loadReceivedDelivered === 'function') window.loadReceivedDelivered(false);
          else if(typeof window.renderReceivedDelivered === 'function') window.renderReceivedDelivered();
        }else if(key === 'repairEfficiency'){
          if(typeof window.loadRepairEfficiency === 'function') window.loadRepairEfficiency(false);
          else if(typeof window.renderRepairEfficiency === 'function') window.renderRepairEfficiency();
        }else if(key === 'userManagement'){
          if(typeof window.renderUserManagement === 'function') window.renderUserManagement();
          if(typeof window.loadUserManagement === 'function') window.loadUserManagement();
        }else if(key === 'security'){
          if(typeof window.renderSecurityPage === 'function') window.renderSecurityPage();
        }
      }catch(e){ console.error('Tab render error:', key, e); }
    }, 80);
  }

  var previousSwitchTab = window.switchTab;
  window.switchTab = function(tab){
    var key = normalTab(tab);
    if(key === 'security' && !(typeof window.isAdmin === 'function' && window.isAdmin())) return false;
    normalizeSidebar();
    if(isDenied(key) && key !== 'repairEfficiency') return false;
    if(key === 'repairEfficiency'){
      var reEl = document.querySelector('.side-tab[data-pb-tab="repairEfficiency"],.side-tab[data-fb-tab-key="repairEfficiency"]');
      if(reEl && reEl.classList.contains('fb-tab-denied')) return false;
    }
    try{ if(typeof window.applyTabDesign === 'function') window.applyTabDesign(key === 'cashTarget' ? 'profit' : key, false); }catch(e){}
    if(key === 'cashTarget' && !$('cashTargetPage') && typeof previousSwitchTab === 'function'){
      try{ previousSwitchTab.call(this, key); }catch(e){}
    }
    hideAllPages();
    var page = $(PAGE_BY_TAB[key]);
    if(page) page.style.display = 'block';
    setActive(key);
    runTabInit(key);
    setTimeout(normalizeSidebar, 120);
    return true;
  };
  window.openCashTargetTab = function(){ return window.switchTab('cashTarget'); };

  document.addEventListener('click', function(ev){
    var tab = ev.target && ev.target.closest ? ev.target.closest('.side-tab') : null;
    if(!tab) return;
    var key = keyFromTab(tab);
    if(!key || !tabDef(key)) return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    window.switchTab(key);
    return false;
  }, true);

  function boot(){
    normalizeSidebar();
    var active = 'gspn';
    try{ active = normalTab(localStorage.getItem('serviceEyeActiveTab') || 'gspn'); }catch(e){}
    if(!$(PAGE_BY_TAB[active])){
      if(active === 'repairEfficiency' && typeof window.loadRepairEfficiency === 'function') window.loadRepairEfficiency(false);
      else if(active === 'receivedDelivered' && typeof window.loadReceivedDelivered === 'function') window.loadReceivedDelivered(false);
      else if(active === 'returnCases' && typeof window.loadReturnCases === 'function') window.loadReturnCases(false);
    }
    window.switchTab(active);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', function(){ setTimeout(boot, 150); setTimeout(normalizeSidebar, 900); });
  setTimeout(normalizeSidebar, 500);
})();


/* ===== repair-efficiency-absolute-final-router ===== */

(function(){
  'use strict';
  if(window.__repairEfficiencyAbsoluteFinalRouter) return;
  window.__repairEfficiencyAbsoluteFinalRouter = true;

  var ORDER = ['dashboard','gspn','sky','preBooking','returnCases','receivedDelivered','repairEfficiency','profit','cashTarget','userManagement','security'];
  var PAGE = {
    dashboard:'dashboardPage', gspn:'gspnPage', sky:'skyPage', preBooking:'preBookingPage',
    returnCases:'returnCasesPage', receivedDelivered:'receivedDeliveredPage', repairEfficiency:'repairEfficiencyPage',
    profit:'profitPage', cashTarget:'cashTargetPage', userManagement:'userManagementPage', security:'securityPage'
  };
  var LABEL = {
    dashboard:'Dashboard', gspn:'GSPN Tracking Cases', sky:'SKY Tracking Cases', preBooking:'Pre_Booking',
    returnCases:'Return Cases', receivedDelivered:'Received & Delivered', repairEfficiency:'Repair Efficiency',
    profit:'Profitability & commission', cashTarget:'Cash & Target', userManagement:'User Management', security:'Security'
  };
  function $(id){return document.getElementById(id);}
  function text(v){return String(v == null ? '' : v).trim();}
  function lower(v){return text(v).toLowerCase();}
  function norm(tab){
    tab = text(tab);
    if(PAGE[tab]) return tab;
    var t = lower(tab).replace(/[\s_-]+/g,' ');
    if(t === 'pre booking') return 'preBooking';
    if(t === 'return cases') return 'returnCases';
    if(t === 'received delivered' || t === 'received & delivered') return 'receivedDelivered';
    if(t === 'repair efficiency') return 'repairEfficiency';
    if(t === 'cash target' || t === 'cash') return 'cashTarget';
    if(t === 'user management') return 'userManagement';
    if(t === 'security') return 'security';
    return 'gspn';
  }
  function keyOf(el){
    if(!el) return '';
    var k = el.getAttribute('data-pb-tab') || el.getAttribute('data-fb-tab-key') || el.dataset.serviceTab || '';
    if(k) return norm(k);
    var oc = lower(el.getAttribute('onclick') || ''), tx = lower(el.textContent || '');
    if(oc.indexOf('repair') >= 0 || tx.indexOf('repair efficiency') >= 0) return 'repairEfficiency';
    if(oc.indexOf('received') >= 0 || (tx.indexOf('received') >= 0 && tx.indexOf('delivered') >= 0)) return 'receivedDelivered';
    if(oc.indexOf('returncases') >= 0 || oc.indexOf('return cases') >= 0 || tx.indexOf('return cases') >= 0) return 'returnCases';
    if(oc.indexOf('prebooking') >= 0 || oc.indexOf('pre_booking') >= 0 || tx.indexOf('pre_booking') >= 0 || tx.indexOf('pre booking') >= 0) return 'preBooking';
    if(oc.indexOf('dashboard') >= 0 || tx.indexOf('dashboard') >= 0) return 'dashboard';
    if(oc.indexOf('gspn') >= 0 || tx.indexOf('gspn') >= 0) return 'gspn';
    if(oc.indexOf('sky') >= 0 || tx.indexOf('sky') >= 0) return 'sky';
    if(oc.indexOf('profit') >= 0 || tx.indexOf('profit') >= 0 || tx.indexOf('commission') >= 0) return 'profit';
    if(oc.indexOf('cash') >= 0 || oc.indexOf('opencashtargettab') >= 0 || tx.indexOf('cash') >= 0 || tx.indexOf('target') >= 0) return 'cashTarget';
    if(tx.indexOf('security') >= 0) return 'security';
    if(tx.indexOf('user management') >= 0 || el.classList.contains('firebase-user-management-tab')) return 'userManagement';
    return '';
  }
  function ensureSidebar(){
    var side = $('sideMenu') || document.querySelector('.side-menu');
    if(!side) return;
    Array.prototype.slice.call(side.querySelectorAll('.side-tab')).forEach(function(el){
      var k = keyOf(el); if(!PAGE[k]) return;
      el.setAttribute('data-pb-tab', k);
      el.setAttribute('data-fb-tab-key', k);
      el.dataset.serviceTab = k;
      el.setAttribute('onclick', "switchTab('" + k + "')");
      el.style.order = String(20 + ORDER.indexOf(k));
      if(k === 'repairEfficiency' || k === 'returnCases' || k === 'receivedDelivered'){
        el.style.display = 'flex'; el.style.visibility = 'visible'; el.style.opacity = '1'; el.style.pointerEvents = 'auto';
      }
    });
  }
  function ensurePageFor(key){
    try{
      if((key === 'preBooking' || key === 'dashboard') && (!$('preBookingPage') || !$('dashboardPage')) && typeof window.loadPreBooking === 'function') window.loadPreBooking(false);
      if(key === 'returnCases' && !$('returnCasesPage') && typeof window.loadReturnCases === 'function') window.loadReturnCases(false);
      if(key === 'receivedDelivered' && !$('receivedDeliveredPage') && typeof window.loadReceivedDelivered === 'function') window.loadReceivedDelivered(false);
      if(key === 'repairEfficiency' && !$('repairEfficiencyPage') && typeof window.loadRepairEfficiency === 'function') window.loadRepairEfficiency(false);
    }catch(e){}
  }
  function applyOnly(key){
    key = norm(key);
    ensureSidebar();
    ensurePageFor(key);
    Object.keys(PAGE).forEach(function(k){ var p = $(PAGE[k]); if(p) p.style.display = (k === key ? 'block' : 'none'); });
    Array.prototype.slice.call(document.querySelectorAll('.side-tab')).forEach(function(el){ el.classList.toggle('active', keyOf(el) === key); });
    try{ localStorage.setItem('serviceEyeActiveTab', key); }catch(e){}
    try{ if(typeof window.sscUpdatePresenceTab === 'function') window.sscUpdatePresenceTab(LABEL[key] || key); }catch(e){}
    setTimeout(function(){
      Object.keys(PAGE).forEach(function(k){ var p = $(PAGE[k]); if(p) p.style.display = (k === key ? 'block' : 'none'); });
      try{
        if(key === 'preBooking'){
          if(typeof window.renderPB === 'function') window.renderPB();
          if(typeof window.loadPreBooking === 'function' && (!Array.isArray(window.preBookingRows) || !window.preBookingRows.length)) window.loadPreBooking(false);
        } else if(key === 'dashboard'){
          if(typeof window.renderDashboardTables === 'function') window.renderDashboardTables();
        } else if(key === 'returnCases'){
          if(typeof window.renderReturnCases === 'function') window.renderReturnCases();
          if(typeof window.loadReturnCases === 'function' && (!Array.isArray(window.returnCasesRows) || !window.returnCasesRows.length)) window.loadReturnCases(false);
        } else if(key === 'receivedDelivered'){
          if(typeof window.renderReceivedDelivered === 'function') window.renderReceivedDelivered();
          if(typeof window.loadReceivedDelivered === 'function' && (!Array.isArray(window.receivedDeliveredRows) || !window.receivedDeliveredRows.length)) window.loadReceivedDelivered(false);
        } else if(key === 'repairEfficiency'){
          if(typeof window.renderRepairEfficiency === 'function') window.renderRepairEfficiency();
          if(typeof window.loadRepairEfficiency === 'function' && (!Array.isArray(window.repairEfficiencyRows) || !window.repairEfficiencyRows.length)) window.loadRepairEfficiency(false);
        } else if(key === 'security'){
          if(typeof window.renderSecurityPage === 'function') window.renderSecurityPage();
        }
      }catch(e){ console.error('Final tab apply error', key, e); }
    }, 120);
  }

  var previousSwitchTab = window.switchTab;
  window.switchTab = function(tab){
    var key = norm(tab);
    if(key === 'security' && !(typeof window.isAdmin === 'function' && window.isAdmin())) return false;
    if(PAGE[key]){
      if(['gspn','sky','profit','cashTarget','userManagement'].indexOf(key) >= 0 && typeof previousSwitchTab === 'function'){
        try{ previousSwitchTab.apply(this, arguments); }catch(e){}
      }
      applyOnly(key);
      return true;
    }
    return typeof previousSwitchTab === 'function' ? previousSwitchTab.apply(this, arguments) : false;
  };
  window.openCashTargetTab = function(){ return window.switchTab('cashTarget'); };

  document.addEventListener('click', function(e){
    var tab = e.target && e.target.closest ? e.target.closest('.side-tab') : null;
    if(!tab) return;
    var key = keyOf(tab);
    if(!PAGE[key]) return;
    /* This listener is intentionally not capture; older capture handlers may call window.switchTab, which now routes here. */
    setTimeout(function(){ applyOnly(key); }, 0);
    setTimeout(function(){ applyOnly(key); }, 180);
  }, false);

  function boot(){
    ensureSidebar();
    var active = 'gspn';
    try{ active = norm(localStorage.getItem('serviceEyeActiveTab') || 'gspn'); }catch(e){}
    if(PAGE[active]) applyOnly(active);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', function(){ setTimeout(boot, 250); setTimeout(ensureSidebar, 1000); });
})();


/* ===== accessibility-keyboard-sidebar ===== */

(function(){
  document.addEventListener('keydown', function(e){
    var el=e.target;
    if(el && el.classList && el.classList.contains('side-tab') && (e.key==='Enter'||e.key===' ')){
      e.preventDefault(); el.click();
    }
  }, {passive:false});
})();



/* [dedup] removed superseded module: phase2-performance-patch-20260627 */

/* ===== ssc-final-runtime-stabilizer-20260702 =====
 * Single final runtime guard replacing several older patch layers.
 * It keeps the already-assembled business logic intact, while preventing
 * rapid duplicate calls, repeated chart redraws, and leaking tracked intervals.
 */
(function(){
  'use strict';
  if (window.__sscFinalRuntimeStabilizer20260702) return;
  window.__sscFinalRuntimeStabilizer20260702 = true;

  var raf = window.requestAnimationFrame || function(cb){ return setTimeout(cb, 16); };
  var caf = window.cancelAnimationFrame || clearTimeout;
  var idle = window.requestIdleCallback || function(cb, opts){
    return setTimeout(function(){ cb({ didTimeout:true, timeRemaining:function(){ return 0; } }); }, (opts && opts.timeout) || 120);
  };

  function wrapRafLatest(name){
    var original = window[name];
    if (typeof original !== 'function' || original.__sscFinalGuard) return;
    var rafId = 0;
    var pendingArgs = null;
    var pendingThis = null;
    function guarded(){
      pendingArgs = arguments;
      pendingThis = this;
      if (rafId) caf(rafId);
      rafId = raf(function(){
        rafId = 0;
        var args = pendingArgs;
        var ctx = pendingThis;
        pendingArgs = pendingThis = null;
        try { original.apply(ctx, args); } catch(e) { console.error('[SSC]', name, e); }
      });
    }
    guarded.__sscFinalGuard = true;
    guarded.__original = original;
    window[name] = guarded;
  }

  function wrapIdleLatest(name){
    var original = window[name];
    if (typeof original !== 'function' || original.__sscFinalIdleGuard) return;
    var queued = false;
    var pendingArgs = null;
    var pendingThis = null;
    function guarded(){
      pendingArgs = arguments;
      pendingThis = this;
      if (queued) return;
      queued = true;
      idle(function(){
        queued = false;
        var args = pendingArgs;
        var ctx = pendingThis;
        pendingArgs = pendingThis = null;
        try { original.apply(ctx, args); } catch(e) { console.error('[SSC]', name, e); }
      }, { timeout: 900 });
    }
    guarded.__sscFinalIdleGuard = true;
    guarded.__original = original;
    window[name] = guarded;
  }

  function guardSwitchTab(){
    var original = window.switchTab;
    if (typeof original !== 'function' || original.__sscFinalSwitchGuard) return;
    var running = false;
    var nextTab = null;
    function guarded(tab){
      if (running) { nextTab = tab; return false; }
      running = true;
      nextTab = null;
      var result = false;
      try { result = original.apply(this, arguments); }
      catch(e) { console.error('[SSC] switchTab', e); }
      finally { running = false; }
      if (nextTab !== null) {
        var t = nextTab;
        nextTab = null;
        raf(function(){ try { window.switchTab(t); } catch(e) { console.error('[SSC] switchTab queued', e); } });
      }
      return result;
    }
    guarded.__sscFinalSwitchGuard = true;
    guarded.__original = original;
    window.switchTab = guarded;
  }

  function cleanupIntervals(){
    try {
      (window._ivals || []).forEach(function(id){ clearInterval(id); });
      window._ivals = [];
    } catch(e) {}
  }

  function install(){
    guardSwitchTab();
    wrapRafLatest('render');
    wrapRafLatest('renderSky');
    wrapRafLatest('renderReceivedDelivered');
    wrapRafLatest('renderReturnCases');
    wrapRafLatest('renderRepairEfficiency');
    wrapIdleLatest('updateCharts');
    wrapIdleLatest('updateSkyCharts');
    wrapIdleLatest('updateReceivedDeliveredCharts');
    wrapIdleLatest('updateReturnCharts');
    wrapIdleLatest('updateRepairEfficiencyCharts');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once:true });
  } else {
    install();
  }
  window.addEventListener('beforeunload', cleanupIntervals, { once:true });
  document.addEventListener('visibilitychange', function(){ if (document.hidden) cleanupIntervals(); }, { passive:true });
})();


/* ===== ssc-unified-filter-system-v2-20260702 =====
 * Fixes duplicate/unstyled dropdown filters.
 * Scope: native <select> filters only. Custom non-select filters keep their own data logic
 * and are normalized by CSS, so no tab-specific data behavior is broken.
 */
(function(){
  'use strict';
  if (window.__sscUnifiedFilterSystemV2_20260702) return;
  window.__sscUnifiedFilterSystemV2_20260702 = true;

  var SELECTOR = 'select[id*="Filter"]';
  var ALL_VALUES = {'':1,'__ALL__':1,'ALL':1,'__all__':1,'(Select All)':1,'Select All':1};
  var components = Object.create(null);
  var active = null;
  var rafId = 0;

  function qs(sel, root){ return (root || document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function byId(id){ return document.getElementById(id); }
  function trim(v){ return String(v == null ? '' : v).trim(); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function isAll(v){ return !!ALL_VALUES[String(v == null ? '' : v)]; }
  function opts(sel){ return Array.prototype.slice.call(sel.options || []); }
  function optText(o){ return trim(o.textContent || o.label || o.value); }
  function isFilterSelect(sel){ return sel && sel.tagName === 'SELECT' && sel.id && /Filter/i.test(sel.id) && sel.id !== 'umRole'; }
  function safeEvent(sel,type){ try{ sel.dispatchEvent(new Event(type,{bubbles:true})); }catch(e){ var ev=document.createEvent('Event'); ev.initEvent(type,true,true); sel.dispatchEvent(ev); } }

  function labelFor(sel){
    var host = sel.closest('.filters,.sky-filters,.profit-filters,.cash-filters,.rd-filters,.rc-filters,.re-filters') || sel.parentElement;
    var label = host && sel.parentElement && sel.parentElement.querySelector('.filter-label,.sky-filter-label,.profit-filter-label,.cash-filter-label,label');
    if (label && trim(label.textContent)) return trim(label.textContent).replace(/\s*-\s*multiple select\s*$/i,'');
    var id = sel.id.replace(/Filter$/i,'').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/^(sky|profit|cash|rd|rc|re)\s+/i,'');
    return id ? id.charAt(0).toUpperCase()+id.slice(1) : 'Filter';
  }

  function selectedValues(sel){
    if (sel.multiple) {
      var values = opts(sel).filter(function(o){return o.selected;}).map(function(o){return String(o.value);});
      if (!values.length) {
        var all = opts(sel).filter(function(o){return isAll(o.value);})[0];
        return [all ? String(all.value) : ''];
      }
      return values;
    }
    return [String(sel.value || '')];
  }

  function applyValues(sel, values){
    values = (Array.isArray(values) ? values : [values]).map(function(v){return String(v == null ? '' : v);});
    var allOpt = opts(sel).filter(function(o){return isAll(o.value);})[0];
    if (sel.multiple) {
      var real = values.filter(function(v){return !isAll(v);});
      var set = Object.create(null);
      (real.length ? real : [allOpt ? String(allOpt.value) : '']).forEach(function(v){set[v]=1;});
      opts(sel).forEach(function(o){ o.selected = !!set[String(o.value)]; });
      if (!opts(sel).some(function(o){return o.selected;}) && allOpt) allOpt.selected = true;
    } else {
      var value = values[0] || '';
      sel.value = value;
      if (sel.value !== value && opts(sel).length) sel.selectedIndex = 0;
    }
  }

  function cleanupLegacyFor(sel){
    var id = sel.id;
    qsa('[id="'+CSS.escape(id+'_excel')+'"],[id="'+CSS.escape(id+'_sscuf')+'"],.ssc-filter[data-for="'+CSS.escape(id)+'"],.ssc-filter-v2[data-for="'+CSS.escape(id)+'"]').forEach(function(n){ n.remove(); });
    // Remove old wrappers in the same filter cell; they are duplicated UI for the same native select.
    var parent = sel.parentElement;
    if (parent) {
      qsa('.excel-filter-container,.sky-v43-multi,.sky-v46-filter,.sky-v47-filter,.sky-v48-filter,.sky-v49-filter,.sky-filter-dropdown,.sky-dropdown-filter,.profit-filter-dd,.cash-filter-dd', parent).forEach(function(n){ n.remove(); });
    }
  }

  function cleanupAllLegacy(){
    qsa('.excel-filter-container,.sky-v43-multi,.sky-v46-filter,.sky-v47-filter,.sky-v48-filter,.sky-v49-filter,.sky-filter-dropdown,.sky-dropdown-filter,.profit-filter-dd,.cash-filter-dd').forEach(function(n){
      var p=n.parentElement;
      if (p && p.querySelector && p.querySelector('select[id*="Filter"]')) n.remove();
    });
  }

  function closeActive(){
    if (active && active.wrap) active.wrap.classList.remove('open');
    if (active && active.btn) active.btn.setAttribute('aria-expanded','false');
    active = null;
  }

  function create(sel){
    cleanupLegacyFor(sel);
    sel.classList.add('ssc-filter-source');
    sel.setAttribute('aria-hidden','true');
    sel.tabIndex = -1;

    var wrap = document.createElement('div');
    wrap.className = 'ssc-filter-v2';
    wrap.dataset.for = sel.id;
    wrap.innerHTML = '<button type="button" class="ssc-filter-v2-btn" aria-expanded="false">'
      + '<span class="ssc-filter-v2-label"></span><span class="ssc-filter-v2-value">All</span><span class="ssc-filter-v2-arrow">▾</span></button>'
      + '<div class="ssc-filter-v2-panel"><div class="ssc-filter-v2-head"><b></b><button type="button" class="ssc-filter-v2-close">×</button></div>'
      + '<input class="ssc-filter-v2-search" type="search" placeholder="Search..." autocomplete="off">'
      + '<div class="ssc-filter-v2-list"></div><div class="ssc-filter-v2-actions"><button type="button" class="ssc-filter-v2-clear">Clear</button><button type="button" class="ssc-filter-v2-apply">Apply</button></div></div>';
    sel.insertAdjacentElement('afterend', wrap);

    var comp = components[sel.id] = {
      sel: sel,
      wrap: wrap,
      btn: qs('.ssc-filter-v2-btn', wrap),
      panel: qs('.ssc-filter-v2-panel', wrap),
      list: qs('.ssc-filter-v2-list', wrap),
      search: qs('.ssc-filter-v2-search', wrap),
      temp: selectedValues(sel),
      sig: ''
    };

    comp.btn.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); toggle(comp); });
    comp.panel.addEventListener('click', function(e){ e.stopPropagation(); });
    qs('.ssc-filter-v2-close', wrap).addEventListener('click', closeActive);
    qs('.ssc-filter-v2-clear', wrap).addEventListener('click', function(){ clear(comp); });
    qs('.ssc-filter-v2-apply', wrap).addEventListener('click', function(){ apply(comp); });
    comp.search.addEventListener('input', function(){ draw(comp); });
    sel.addEventListener('change', function(){ comp.temp = selectedValues(sel); refresh(comp); });
    refresh(comp);
  }

  function signature(sel){
    return opts(sel).map(function(o){return [o.value,optText(o),o.selected?1:0].join('\u0001');}).join('\u0002')+'|'+(sel.multiple?1:0);
  }

  function refresh(comp){
    if (!comp || !comp.sel || !document.documentElement.contains(comp.sel)) return;
    cleanupLegacyFor(comp.sel);
    var lab = labelFor(comp.sel);
    qs('.ssc-filter-v2-label', comp.wrap).textContent = lab;
    qs('.ssc-filter-v2-head b', comp.wrap).textContent = lab;
    var selected = selectedValues(comp.sel).filter(function(v){return !isAll(v);});
    var texts = selected.map(function(v){ var o=opts(comp.sel).filter(function(x){return String(x.value)===String(v);})[0]; return o ? optText(o) : v; }).filter(Boolean);
    var value = texts.length ? (texts.length > 2 ? texts.length+' selected' : texts.join(', ')) : 'All';
    qs('.ssc-filter-v2-value', comp.wrap).textContent = value;
    comp.wrap.classList.toggle('has-value', !!texts.length);
    comp.btn.title = lab + ': ' + value;
    comp.sig = signature(comp.sel);
  }

  function draw(comp){
    var sel = comp.sel;
    var term = trim(comp.search.value).toLowerCase();
    var options = opts(sel);
    var allOpt = options.filter(function(o){return isAll(o.value);})[0];
    var tempSet = Object.create(null);
    comp.temp.forEach(function(v){ tempSet[String(v)] = 1; });
    var rows = options.filter(function(o){ return !term || optText(o).toLowerCase().indexOf(term) >= 0; });
    if (!term && allOpt && rows.indexOf(allOpt) < 0) rows.unshift(allOpt);
    if (!rows.length) { comp.list.innerHTML = '<div class="ssc-filter-v2-empty">No values</div>'; return; }
    var type = sel.multiple ? 'checkbox' : 'radio';
    var name = sel.id + '_ssc_filter_choice';
    comp.list.innerHTML = rows.map(function(o){
      var v = String(o.value), all = isAll(v), checked = !!tempSet[v];
      return '<label class="ssc-filter-v2-option'+(all?' is-all':'')+'"><input type="'+type+'" name="'+esc(name)+'" value="'+esc(v)+'" '+(checked?'checked':'')+'><span>'+esc(all?'Select All':optText(o))+'</span></label>';
    }).join('');
    qsa('input', comp.list).forEach(function(input){
      input.addEventListener('change', function(){
        var v = String(input.value);
        if (sel.multiple) {
          var map = Object.create(null);
          comp.temp.forEach(function(x){ map[String(x)] = 1; });
          if (isAll(v)) map = input.checked ? (function(){var m=Object.create(null); m[v]=1; return m;})() : Object.create(null);
          else {
            Object.keys(map).forEach(function(k){ if (isAll(k)) delete map[k]; });
            if (input.checked) map[v]=1; else delete map[v];
            if (!Object.keys(map).length && allOpt) map[String(allOpt.value)] = 1;
          }
          comp.temp = Object.keys(map);
          draw(comp);
        } else {
          comp.temp = [v];
        }
      });
    });
  }

  function position(comp){
    var r = comp.btn.getBoundingClientRect();
    var width = Math.min(Math.max(r.width, 280), Math.max(280, window.innerWidth - 24));
    var maxH = Math.min(420, window.innerHeight - 32);
    var left = Math.min(Math.max(12, r.left), Math.max(12, window.innerWidth - width - 12));
    var down = r.bottom + 6, up = r.top - maxH - 6;
    var top = (down + maxH <= window.innerHeight || up < 12) ? down : Math.max(12, up);
    comp.panel.style.left = left + 'px';
    comp.panel.style.top = top + 'px';
    comp.panel.style.width = width + 'px';
    comp.panel.style.maxHeight = maxH + 'px';
    comp.list.style.maxHeight = Math.max(140, maxH - 150) + 'px';
  }

  function open(comp){
    if (active && active !== comp) closeActive();
    active = comp;
    comp.temp = selectedValues(comp.sel);
    comp.search.value = '';
    draw(comp);
    comp.wrap.classList.add('open');
    comp.btn.setAttribute('aria-expanded','true');
    position(comp);
    setTimeout(function(){ try{ comp.search.focus(); }catch(e){} }, 0);
  }
  function toggle(comp){ comp.wrap.classList.contains('open') ? closeActive() : open(comp); }
  function apply(comp){
    applyValues(comp.sel, comp.temp);
    refresh(comp);
    closeActive();
    safeEvent(comp.sel,'input');
    safeEvent(comp.sel,'change');
  }
  function clear(comp){
    var all = opts(comp.sel).filter(function(o){return isAll(o.value);})[0];
    comp.temp = [all ? String(all.value) : ''];
    apply(comp);
  }

  function enhance(root){
    root = root || document;
    qsa(SELECTOR, root).forEach(function(sel){
      if (!isFilterSelect(sel)) return;
      if (!components[sel.id] || !document.documentElement.contains(components[sel.id].wrap)) create(sel);
      else {
        var comp = components[sel.id];
        cleanupLegacyFor(sel);
        if (signature(sel) !== comp.sig) refresh(comp);
      }
    });
    cleanupAllLegacy();
  }
  function schedule(root){
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(function(){ rafId = 0; enhance(root || document); });
  }

  // Replace old SKY Excel filter hook with the new single renderer.
  window.createOrUpdateExcelFilter = function(config){
    var id = config && config.id || config;
    var sel = typeof id === 'string' ? byId(id) : null;
    if (sel && isFilterSelect(sel)) { enhance(sel.parentElement || document); return; }
  };
  window.refreshSkyExcelFilterWidgets = function(){ schedule(document); };
  window.sscRefreshUnifiedFilters = function(){ enhance(document); };

  document.addEventListener('click', function(e){ if (!e.target.closest || !e.target.closest('.ssc-filter-v2')) closeActive(); }, true);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeActive(); });
  window.addEventListener('resize', closeActive, {passive:true});
  window.addEventListener('scroll', closeActive, {passive:true, capture:true});

  var mo = new MutationObserver(function(muts){
    var need = false;
    muts.forEach(function(m){
      if (need) return;
      if (m.target && m.target.matches && m.target.matches(SELECTOR)) need = true;
      qsa(SELECTOR, m.target && m.target.nodeType === 1 ? m.target : document).some(function(){ need = true; return true; });
      Array.prototype.slice.call(m.addedNodes || []).forEach(function(n){ if (n.nodeType === 1 && (n.matches && n.matches(SELECTOR) || n.querySelector && n.querySelector(SELECTOR))) need = true; });
    });
    if (need) schedule(document);
  });

  function boot(){
    enhance(document);
    mo.observe(document.documentElement, {childList:true, subtree:true});
    setTimeout(function(){ enhance(document); }, 500);
    setTimeout(function(){ enhance(document); }, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();
})();
