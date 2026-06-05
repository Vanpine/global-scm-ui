/* ============================================================
   首页 · 全球供应链风险地图
   - 静态层：模拟的供应链/地缘风险点与航线（演示）
   - 实时层：USGS 全球地震 GeoJSON（CORS 开放，纯前端直连，每 60s 刷新）
   依赖 globe.gl + Leaflet（均 CDN）
   ============================================================ */
(function () {
  'use strict';

  function EN() { return window.GSCM_LANG === 'en'; }

  /* ---------- 静态演示数据：供应链/地缘风险 ---------- */
  var POINTS = [
    { lat: 48.4, lng: 35.0, level: 'high', zh: '黑海航线中断风险', en: 'Black Sea route disruption' },
    { lat: 15.0, lng: 42.0, level: 'high', zh: '红海 / 曼德海峡航线告警', en: 'Red Sea / Bab-el-Mandeb alert' },
    { lat: 33.75, lng: -118.19, level: 'high', zh: '美西长滩港罢工 · 滞港', en: 'Long Beach strike · congestion' },
    { lat: 9.1, lng: -79.7, level: 'watch', zh: '巴拿马运河干旱限航', en: 'Panama Canal drought limits' },
    { lat: 30.0, lng: 32.35, level: 'watch', zh: '苏伊士运河通航关注', en: 'Suez Canal transit watch' },
    { lat: 24.5, lng: 119.5, level: 'watch', zh: '台湾海峡局势关注', en: 'Taiwan Strait watch' },
    { lat: 1.29, lng: 103.85, level: 'normal', zh: '新加坡枢纽港', en: 'Singapore' },
    { lat: 31.23, lng: 121.47, level: 'normal', zh: '上海港', en: 'Shanghai' },
    { lat: 53.55, lng: 9.99, level: 'normal', zh: '汉堡港', en: 'Hamburg' },
    { lat: 25.27, lng: 55.30, level: 'normal', zh: '迪拜杰贝阿里港', en: 'Dubai' }
  ];

  var COLORS = { high: '#ff3b30', watch: '#ff9500', normal: '#34c759' };
  var ALT = { high: 0.18, watch: 0.11, normal: 0.045 };

  var ARCS = [
    { startLat: 31.23, startLng: 121.47, endLat: 33.75, endLng: -118.19, color: ['#ff3b30', '#ff9500'] },
    { startLat: 31.23, startLng: 121.47, endLat: 53.55, endLng: 9.99, color: ['#ff9500', '#ff3b30'] },
    { startLat: 1.29, startLng: 103.85, endLat: 51.95, endLng: 4.4, color: ['#ff9500', '#ff3b30'] },
    { startLat: 31.23, startLng: 121.47, endLat: 1.29, endLng: 103.85, color: ['#2997ff', '#2997ff'] },
    { startLat: 25.27, startLng: 55.30, endLat: 53.55, endLng: 9.99, color: ['#2997ff', '#5e5ce6'] }
  ];

  /* ---------- 模块级引用，供实时刷新共享 ---------- */
  var globeWorld = null;
  var leafletMap = null;
  var quakeLayer = null;       // Leaflet 实时地震图层
  var quakePoints = [];        // 实时地震点
  var lastUpdated = null;      // 上次刷新时间
  var liveOK = false;          // 是否成功接入实时数据

  /* ---------- 实时数据源：USGS（过去一天 M2.5+） ---------- */
  var USGS_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson';

  function magLevel(m) { return m >= 6 ? 'high' : (m >= 4.5 ? 'watch' : 'normal'); }

  function minutesAgo(ms) {
    var d = Math.max(0, Date.now() - ms);
    var m = Math.round(d / 60000);
    if (m < 1) return EN() ? 'just now' : '刚刚';
    if (m < 60) return m + (EN() ? ' min ago' : ' 分钟前');
    var h = Math.round(m / 60);
    return h + (EN() ? ' h ago' : ' 小时前');
  }

  function fetchQuakes() {
    return fetch(USGS_URL).then(function (r) { return r.json(); }).then(function (geo) {
      var feats = (geo && geo.features) || [];
      feats.sort(function (a, b) { return b.properties.time - a.properties.time; });
      quakePoints = feats.slice(0, 80).map(function (f) {
        var c = f.geometry.coordinates; // [lng, lat, depth]
        var mag = f.properties.mag || 0;
        return {
          lat: c[1], lng: c[0], level: magLevel(mag), type: 'quake',
          mag: mag, time: f.properties.time, place: f.properties.place || 'Unknown',
          zh: 'M' + mag.toFixed(1) + ' 地震 · ' + (f.properties.place || ''),
          en: 'M' + mag.toFixed(1) + ' quake · ' + (f.properties.place || '')
        };
      });
      liveOK = true; lastUpdated = Date.now();
    }).catch(function () { liveOK = false; });
  }

  /* ---------- 预警面板 ---------- */
  function renderFeed() {
    var ul = document.getElementById('riskFeed');
    if (!ul) return;
    var html = '';
    // 状态行
    if (liveOK) {
      html += '<li class="status"><div class="ev-t" style="color:#34c759">● ' +
        (EN() ? 'Live data connected · USGS' : '实时数据已接入 · USGS 全球地震') + '</div>' +
        '<div class="ev-m"><span>' + (EN() ? 'Pure front-end, no backend' : '纯前端直连，无后端') +
        '</span><span>' + (lastUpdated ? minutesAgo(lastUpdated) : '') + '</span></div></li>';
    }
    // 实时地震（取风险较高的前几条）
    var live = quakePoints.filter(function (q) { return q.level !== 'normal'; }).slice(0, 4);
    if (!live.length) live = quakePoints.slice(0, 4);
    live.forEach(function (q) {
      var tag = q.level === 'high' ? (EN() ? 'HIGH' : '高危') : (q.level === 'watch' ? (EN() ? 'WATCH' : '关注') : (EN() ? 'INFO' : '一般'));
      html += '<li class="' + q.level + '">' +
        '<div class="ev-t">🌐 ' + (EN() ? q.en : q.zh) + '</div>' +
        '<div class="ev-m"><span class="ev-tag ' + (q.level === 'watch' ? 'watch' : '') + '">● ' + tag + '</span><span>' + minutesAgo(q.time) + '</span></div></li>';
    });
    // 若实时不可用，回退到模拟供应链事件
    if (!liveOK) {
      html = '<li class="status"><div class="ev-t" style="color:#ff9500">● ' +
        (EN() ? 'Live source unavailable — showing demo events' : '实时源暂不可用 · 显示演示事件') + '</div></li>' +
        '<li class="high"><div class="ev-t">🌐 ' + (EN() ? 'Long Beach strike — demurrage risk' : '美西长滩港罢工，柜面临滞港费') + '</div><div class="ev-m"><span class="ev-tag">● ' + (EN() ? 'HIGH' : '高危') + '</span><span>' + (EN() ? '2 min ago' : '2 分钟前') + '</span></div></li>' +
        '<li class="watch"><div class="ev-t">🌐 ' + (EN() ? 'Panama Canal draft limits' : '巴拿马运河限制吃水') + '</div><div class="ev-m"><span class="ev-tag watch">● ' + (EN() ? 'WATCH' : '关注') + '</span><span>' + (EN() ? '8 min ago' : '8 分钟前') + '</span></div></li>';
    }
    ul.innerHTML = html;
  }

  /* ---------- 刷新所有视图 ---------- */
  function refreshViews() {
    var all = POINTS.concat(quakePoints);
    if (globeWorld) {
      globeWorld.pointsData(all);
      globeWorld.ringsData(all.filter(function (d) { return d.level !== 'normal'; }));
    }
    if (leafletMap && quakeLayer) {
      quakeLayer.clearLayers();
      quakePoints.forEach(function (q) {
        var color = COLORS[q.level];
        L.circleMarker([q.lat, q.lng], {
          radius: q.level === 'high' ? 8 : (q.level === 'watch' ? 6 : 3.5),
          color: '#fff', weight: 0.8, fillColor: color, fillOpacity: 0.9
        }).bindPopup('<b>' + (EN() ? q.en : q.zh) + '</b><br>' + (EN() ? 'Magnitude ' : '震级 ') + q.mag.toFixed(1) + ' · ' + minutesAgo(q.time)).addTo(quakeLayer);
      });
    }
    renderFeed();
  }

  /* ---------- 3D 地球 ---------- */
  function initGlobe() {
    var el = document.getElementById('globeViz');
    if (!el || typeof Globe === 'undefined') return;
    var HUBS = POINTS.filter(function (d) { return d.level === 'normal'; });
    globeWorld = Globe()
      .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
      .showGraticules(true)
      .showAtmosphere(true).atmosphereColor('#5aa0ff').atmosphereAltitude(0.24)
      .pointsData(POINTS).pointLat('lat').pointLng('lng')
      .pointColor(function (d) { return COLORS[d.level]; }).pointAltitude(function (d) { return ALT[d.level]; })
      .pointRadius(function (d) { return d.level === 'high' ? 0.5 : 0.36; }).pointResolution(24)
      .pointLabel(function (d) { return '<div style="font:500 12px sans-serif;color:#fff;background:rgba(10,14,26,.85);padding:5px 9px;border-radius:8px;border:1px solid ' + COLORS[d.level] + '">' + (EN() ? d.en : d.zh) + '</div>'; })
      .arcsData(ARCS).arcColor('color').arcStroke(0.5)
      .arcDashLength(0.45).arcDashGap(0.22).arcDashAnimateTime(2400).arcAltitudeAutoScale(0.45)
      .ringsData(POINTS.filter(function (d) { return d.level !== 'normal'; }))
      .ringColor(function (d) { var c = COLORS[d.level]; return function (t) { return hexToRgba(c, 1 - t); }; })
      .ringMaxRadius(6).ringPropagationSpeed(3.2).ringRepeatPeriod(1000)
      .labelsData(HUBS).labelLat('lat').labelLng('lng')
      .labelText(function (d) { return (EN() ? d.en : d.zh); })
      .labelSize(0.85).labelDotRadius(0.28).labelColor(function () { return 'rgba(200,220,255,0.75)'; }).labelResolution(2)
      (el);

    globeWorld.controls().autoRotate = true;
    globeWorld.controls().autoRotateSpeed = 0.45;
    globeWorld.controls().enableZoom = true;
    globeWorld.controls().minDistance = 180;
    globeWorld.controls().maxDistance = 500;
    globeWorld.pointOfView({ lat: 22, lng: 55, altitude: 1.9 });

    function resize() { var w = el.clientWidth || el.parentElement.clientWidth; globeWorld.width(w); globeWorld.height(el.clientHeight || 600); }
    resize(); window.addEventListener('resize', resize);
  }

  /* ---------- 2D 地图（Leaflet + OpenStreetMap） ---------- */
  function initLeaflet() {
    var el = document.getElementById('riskLeaflet');
    if (!el || typeof L === 'undefined') return;
    // 仅限制上下（纬度 ±85），经度放开 → 左右可无限循环拖动、上下不露黑边
    var vBounds = L.latLngBounds([[-85, -100000], [85, 100000]]);
    leafletMap = L.map(el, {
      worldCopyJump: true, minZoom: 2, maxZoom: 18, scrollWheelZoom: true,
      maxBounds: vBounds, maxBoundsViscosity: 1.0
    }).setView([24, 40], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors', subdomains: 'abc', maxZoom: 19, noWrap: false
    }).addTo(leafletMap);
    L.control.scale({ imperial: false, position: 'bottomright', maxWidth: 120 }).addTo(leafletMap);

    function levelTag(level) {
      if (level === 'high') return EN() ? 'High Risk' : '高危';
      if (level === 'watch') return EN() ? 'Watch' : '关注';
      return EN() ? 'Normal' : '正常';
    }
    // 静态供应链风险层（带脉冲动效）
    function riskIcon(level) {
      return L.divIcon({
        className: '',
        html: '<span class="risk-dot ' + level + '"><span class="rd-ring"></span><span class="rd-core"></span></span>',
        iconSize: [16, 16], iconAnchor: [8, 8], popupAnchor: [0, -8]
      });
    }
    POINTS.forEach(function (p) {
      var color = COLORS[p.level];
      if (p.level !== 'normal') {
        L.circle([p.lat, p.lng], { radius: p.level === 'high' ? 600000 : 420000, color: color, weight: 1, fillColor: color, fillOpacity: 0.12 }).addTo(leafletMap);
      }
      L.marker([p.lat, p.lng], { icon: riskIcon(p.level) })
        .bindPopup('<b>' + (EN() ? p.en : p.zh) + '</b><br><span style="color:' + color + '">● ' + levelTag(p.level) + '</span>').addTo(leafletMap);
    });
    // 航线
    ARCS.forEach(function (a) {
      var disrupted = a.color[0] !== '#2997ff';
      L.polyline([[a.startLat, a.startLng], [a.endLat, a.endLng]], { color: disrupted ? '#ff6b3d' : '#2997ff', weight: 1.4, opacity: 0.55, dashArray: '6 6' }).addTo(leafletMap);
    });
    // 实时地震层（动态刷新）
    quakeLayer = L.layerGroup().addTo(leafletMap);
    setTimeout(function () { leafletMap.invalidateSize(); }, 350);
    window.addEventListener('resize', function () { leafletMap.invalidateSize(); });
  }

  function hexToRgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  document.addEventListener('DOMContentLoaded', function () {
    initGlobe();
    initLeaflet();
    renderFeed();
    // 首次拉取 + 周期刷新（真·纯前端实时）
    fetchQuakes().then(refreshViews);
    setInterval(function () { fetchQuakes().then(refreshViews); }, 60000);
    var toggle = document.getElementById('lang-toggle');
    if (toggle) toggle.addEventListener('click', function () { setTimeout(refreshViews, 60); });
  });
})();
