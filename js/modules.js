/**
 * SentinelMind AI — Module Renderers
 * Each module renders itself into #module-content
 */

// ─── Shared Utilities ─────────────────────────────────────────────────────────
function severityClass(sev) {
  const s = (sev || '').toLowerCase();
  if (s === 'critical') return 'sev-critical';
  if (s === 'high') return 'sev-high';
  if (s === 'medium') return 'sev-medium';
  if (s === 'low') return 'sev-low';
  return 'sev-info';
}

function severityBadge(sev) {
  return `<span class="badge ${severityClass(sev)}">${sev}</span>`;
}

function statusBadge(status) {
  const cls = status === 'Blocked' ? 'badge-blocked' : status === 'Flagged' ? 'badge-flagged' : 'badge-allowed';
  return `<span class="badge ${cls}">${status}</span>`;
}

function scoreBar(score, max = 100) {
  const pct = Math.round((score / max) * 100);
  const cls = pct >= 80 ? 'bar-critical' : pct >= 60 ? 'bar-high' : pct >= 40 ? 'bar-medium' : 'bar-low';
  return `<div class="score-bar"><div class="score-fill ${cls}" style="width:${pct}%"></div></div>`;
}

function riskScoreColor(score) {
  if (score >= 80) return '#ff3366';
  if (score >= 60) return '#ff9900';
  if (score >= 40) return '#ffcc00';
  return '#00ff88';
}

// ─── MODULE 1: Threat Dashboard ───────────────────────────────────────────────
function renderThreatDashboard() {
  const container = document.getElementById('module-content');
  container.innerHTML = `
    <div class="module-dashboard">
      <!-- Key Metrics Row -->
      <div class="metrics-grid">
        <div class="metric-card pulse-critical" id="metric-threats">
          <div class="metric-icon">🛡</div>
          <div class="metric-value" id="val-threats">${SIM_STATE.threatsBlockedToday.toLocaleString()}</div>
          <div class="metric-label">Threats Blocked Today</div>
          <div class="metric-delta">▲ 12% from yesterday</div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">🤖</div>
          <div class="metric-value" id="val-models">${SIM_STATE.modelsProtected}</div>
          <div class="metric-label">Models Protected</div>
          <div class="metric-delta">↔ Stable</div>
        </div>
        <div class="metric-card pulse-green">
          <div class="metric-icon">🔍</div>
          <div class="metric-value" id="val-scans">${SIM_STATE.activeScans}</div>
          <div class="metric-label">Active Scans</div>
          <div class="metric-delta">▲ Running now</div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">⚡</div>
          <div class="metric-value" id="val-response">${SIM_STATE.avgResponseTime}ms</div>
          <div class="metric-label">Avg Response Time</div>
          <div class="metric-delta">▼ 0.03ms improved</div>
        </div>
      </div>

      <!-- Main Content: Map + Severity -->
      <div class="dashboard-main">
        <!-- World Map -->
        <div class="panel map-panel">
          <div class="panel-header">
            <span class="panel-title">🌍 Global Threat Map</span>
            <span class="panel-live">● LIVE</span>
          </div>
          <div class="world-map-container">
            <canvas id="threat-map" width="700" height="380"></canvas>
            <div class="map-legend">
              <span class="legend-item"><span class="dot dot-critical"></span>Critical</span>
              <span class="legend-item"><span class="dot dot-high"></span>High</span>
              <span class="legend-item"><span class="dot dot-medium"></span>Medium</span>
            </div>
          </div>
        </div>

        <!-- Severity Meter -->
        <div class="panel severity-panel">
          <div class="panel-header">
            <span class="panel-title">⚠ Threat Severity</span>
          </div>
          <div class="severity-meters">
            <div class="sev-row">
              <span class="sev-label sev-critical">CRITICAL</span>
              <div class="sev-bar-wrap"><div class="sev-bar-fill critical-fill" id="sbar-critical" style="width:65%"></div></div>
              <span class="sev-count" id="scount-critical">247</span>
            </div>
            <div class="sev-row">
              <span class="sev-label sev-high">HIGH</span>
              <div class="sev-bar-wrap"><div class="sev-bar-fill high-fill" id="sbar-high" style="width:78%"></div></div>
              <span class="sev-count" id="scount-high">1,284</span>
            </div>
            <div class="sev-row">
              <span class="sev-label sev-medium">MEDIUM</span>
              <div class="sev-bar-wrap"><div class="sev-bar-fill medium-fill" id="sbar-medium" style="width:55%"></div></div>
              <span class="sev-count" id="scount-medium">3,891</span>
            </div>
            <div class="sev-row">
              <span class="sev-label sev-low">LOW</span>
              <div class="sev-bar-wrap"><div class="sev-bar-fill low-fill" id="sbar-low" style="width:45%"></div></div>
              <span class="sev-count" id="scount-low">9,450</span>
            </div>
          </div>
          <div class="threat-donut-wrap">
            <canvas id="threat-donut" width="180" height="180"></canvas>
            <div class="donut-center">
              <div class="donut-pct" id="donut-pct">98.7%</div>
              <div class="donut-sub">Block Rate</div>
            </div>
          </div>
          <div class="threat-trend">
            <div class="panel-header" style="margin-top:16px"><span class="panel-title">24h Trend</span></div>
            <canvas id="trend-chart" width="260" height="80"></canvas>
          </div>
        </div>
      </div>

      <!-- Live Threat Feed -->
      <div class="panel feed-panel">
        <div class="panel-header">
          <span class="panel-title">🔴 Live Threat Feed</span>
          <span class="panel-live">● LIVE</span>
        </div>
        <div class="threat-feed-table-wrap">
          <table class="data-table">
            <thead>
              <tr><th>Time</th><th>Severity</th><th>Type</th><th>Source</th><th>Target</th><th>Status</th></tr>
            </thead>
            <tbody id="threat-feed-body">
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  renderThreatFeed();
  drawThreatMap();
  drawDonut();
  drawTrendChart();
}

function renderThreatFeed() {
  const tbody = document.getElementById('threat-feed-body');
  if (!tbody) return;
  const rows = SIM_STATE.recentThreats.slice(0, 12).map(t => `
    <tr class="feed-row new-row">
      <td class="mono">${t.timestamp.slice(11)}</td>
      <td>${severityBadge(t.severity)}</td>
      <td class="mono">${t.type}</td>
      <td class="mono">${t.source} <span class="country-tag">${t.countryName}</span></td>
      <td class="mono">${t.target}</td>
      <td>${statusBadge(t.status)}</td>
    </tr>
  `).join('');
  tbody.innerHTML = rows;
}

function drawThreatMap() {
  const canvas = document.getElementById('threat-map');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Background
  ctx.fillStyle = '#050a16';
  ctx.fillRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = 'rgba(0,240,255,0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Simple continent outlines (approximate lat/lon to canvas)
  function latLonToXY(lat, lon) {
    const x = ((lon + 180) / 360) * W;
    const y = ((90 - lat) / 180) * H;
    return { x, y };
  }

  // Draw connection lines from attack source to US target
  const targetPos = latLonToXY(37.77, -96);
  SIM_STATE.recentThreats.slice(0, 8).forEach((t, i) => {
    const src = latLonToXY(t.lat, t.lon);
    const isOld = i > 3;
    const alpha = isOld ? 0.2 : 0.6;
    const color = t.severity === 'Critical' ? `rgba(255,51,102,${alpha})` :
                  t.severity === 'High' ? `rgba(255,153,0,${alpha})` :
                  `rgba(255,204,0,${alpha})`;
    // Arc line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = isOld ? 1 : 1.5;
    ctx.setLineDash([4, 4]);
    const cpx = (src.x + targetPos.x) / 2;
    const cpy = Math.min(src.y, targetPos.y) - 60;
    ctx.moveTo(src.x, src.y);
    ctx.quadraticCurveTo(cpx, cpy, targetPos.x, targetPos.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Source dot
    const dotR = t.severity === 'Critical' ? 5 : 3;
    ctx.beginPath();
    ctx.arc(src.x, src.y, dotR, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Pulse ring
    ctx.beginPath();
    ctx.arc(src.x, src.y, dotR + 4, 0, Math.PI * 2);
    ctx.strokeStyle = color.replace(alpha, 0.3);
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Target dot (US)
  ctx.beginPath();
  ctx.arc(targetPos.x, targetPos.y, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#00f0ff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(targetPos.x, targetPos.y, 12, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0,240,255,0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Label some countries
  const labels = [
    { name: 'RU', lat: 55.75, lon: 37.62 },
    { name: 'CN', lat: 39.90, lon: 116.39 },
    { name: 'US', lat: 37.77, lon: -96 },
    { name: 'KP', lat: 39.02, lon: 125.75 },
    { name: 'IR', lat: 35.69, lon: 51.42 },
  ];
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillStyle = 'rgba(0,240,255,0.6)';
  labels.forEach(l => {
    const { x, y } = latLonToXY(l.lat, l.lon);
    ctx.fillText(l.name, x + 8, y + 4);
  });
}

function drawDonut() {
  const canvas = document.getElementById('threat-donut');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 90, cy = 90, r = 70, inner = 48;
  const data = [
    { val: 247, color: '#ff3366' },
    { val: 1284, color: '#ff9900' },
    { val: 3891, color: '#ffcc00' },
    { val: 9450, color: '#00f0ff' },
  ];
  const total = data.reduce((s, d) => s + d.val, 0);
  let start = -Math.PI / 2;
  ctx.clearRect(0, 0, 180, 180);
  data.forEach(d => {
    const angle = (d.val / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = d.color;
    ctx.fill();
    start += angle;
  });
  // Inner hole
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = '#070d1a';
  ctx.fill();
  // Ring glow
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0,240,255,0.15)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawTrendChart() {
  const canvas = document.getElementById('trend-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const points = [420, 380, 510, 460, 620, 710, 580, 650, 820, 760, 910, 880, 970, 1050, 980, 1100, 1250, 1180, 1350, 1420, 1380, 1480, 1550, 1620];
  const max = Math.max(...points);
  const xs = points.map((_, i) => (i / (points.length - 1)) * W);
  const ys = points.map(p => H - (p / max) * (H - 10) - 5);

  ctx.clearRect(0, 0, W, H);

  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(0,240,255,0.3)');
  grad.addColorStop(1, 'rgba(0,240,255,0)');
  ctx.beginPath();
  ctx.moveTo(xs[0], H);
  xs.forEach((x, i) => ctx.lineTo(x, ys[i]));
  ctx.lineTo(xs[xs.length - 1], H);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2;
  xs.forEach((x, i) => i === 0 ? ctx.moveTo(x, ys[i]) : ctx.lineTo(x, ys[i]));
  ctx.stroke();
}

// ─── MODULE 2: Model Security Scanner ────────────────────────────────────────
function renderModelScanner() {
  const container = document.getElementById('module-content');
  container.innerHTML = `
    <div class="module-scanner">
      <div class="scanner-header">
        <div class="scanner-stats">
          <span>Total Models: <strong>${AI_MODELS.length}</strong></span>
          <span class="stat-sep">|</span>
          <span class="sev-critical">Critical: <strong>${AI_MODELS.filter(m => m.status === 'Critical').length}</strong></span>
          <span class="stat-sep">|</span>
          <span class="sev-high">High Risk: <strong>${AI_MODELS.filter(m => m.status === 'High Risk').length}</strong></span>
          <span class="stat-sep">|</span>
          <span style="color:#00ff88">Low Risk: <strong>${AI_MODELS.filter(m => m.status === 'Low Risk').length}</strong></span>
        </div>
        <button class="btn-action" onclick="simulateScan()">▶ Run Full Scan</button>
      </div>

      <div class="model-grid" id="model-grid">
        ${AI_MODELS.map(model => renderModelCard(model)).join('')}
      </div>

      <!-- Detail Panel (hidden by default) -->
      <div class="model-detail-panel" id="model-detail" style="display:none">
        <div class="detail-close" onclick="closeModelDetail()">✕ Close</div>
        <div id="model-detail-content"></div>
      </div>
    </div>
  `;
}

function renderModelCard(model) {
  const vulnTotal = Object.values(model.vulnerabilities).reduce((a, b) => a + b, 0);
  const statusColor = model.status === 'Critical' ? '#ff3366' : model.status === 'High Risk' ? '#ff9900' : model.status === 'Medium Risk' ? '#ffcc00' : '#00ff88';
  return `
    <div class="model-card" onclick="showModelDetail('${model.id}')">
      <div class="model-card-header">
        <div class="model-name">${model.name}</div>
        <div class="model-type-badge">${model.type}</div>
      </div>
      <div class="model-risk-row">
        <div class="risk-score-num" style="color:${riskScoreColor(model.riskScore)}">${model.riskScore}</div>
        <div class="risk-score-label">Risk Score</div>
        <div class="risk-gauge">
          <div class="risk-gauge-fill" style="width:${model.riskScore}%; background:${riskScoreColor(model.riskScore)}"></div>
        </div>
      </div>
      <div class="model-status" style="color:${statusColor}">● ${model.status}</div>
      <div class="vuln-summary">
        <span class="vsev vs-critical" title="Prompt Injection">PI:${model.vulnerabilities.promptInjection}</span>
        <span class="vsev vs-high" title="Data Poisoning">DP:${model.vulnerabilities.dataPoisoning}</span>
        <span class="vsev vs-high" title="Model Extraction">ME:${model.vulnerabilities.modelExtraction}</span>
        <span class="vsev vs-critical" title="Jailbreak">JB:${model.vulnerabilities.jailbreak}</span>
        <span class="vsev vs-medium" title="Adversarial">AI:${model.vulnerabilities.adversarialInputs}</span>
      </div>
      <div class="model-meta">
        <span>Total vulns: <strong>${vulnTotal}</strong></span>
        <span>Last scan: <span class="mono">${model.lastScan.slice(11)}</span></span>
      </div>
    </div>
  `;
}

function showModelDetail(id) {
  const model = AI_MODELS.find(m => m.id === id);
  if (!model) return;
  const vulnTotal = Object.values(model.vulnerabilities).reduce((a, b) => a + b, 0);
  document.getElementById('model-detail').style.display = 'block';
  document.getElementById('model-detail-content').innerHTML = `
    <div class="detail-header">
      <h2>${model.name} <span class="model-type-badge">${model.type}</span></h2>
      <div class="detail-meta">
        <span>Provider: ${model.provider}</span> &nbsp;|&nbsp;
        <span>Version: ${model.version}</span> &nbsp;|&nbsp;
        <span>Parameters: ${model.parameters}</span> &nbsp;|&nbsp;
        <span>Last Scan: ${model.lastScan}</span>
      </div>
      <p class="detail-desc">${model.description}</p>
    </div>
    <div class="detail-risk-row">
      <div class="detail-score" style="color:${riskScoreColor(model.riskScore)}">
        <span class="detail-score-num">${model.riskScore}</span>
        <span class="detail-score-label">/ 100<br>Risk Score</span>
      </div>
      <div class="detail-gauge-wrap">
        ${scoreBar(model.riskScore)}
        <div class="detail-status" style="color:${riskScoreColor(model.riskScore)}">Status: ${model.status}</div>
      </div>
    </div>
    <h3 class="detail-section-title">Vulnerability Breakdown</h3>
    <div class="vuln-detail-grid">
      ${[
        { name: 'Prompt Injection', key: 'promptInjection', sev: 'critical', desc: 'Attempts to override system instructions via crafted inputs.' },
        { name: 'Data Poisoning', key: 'dataPoisoning', sev: 'high', desc: 'Malicious data injected into training or fine-tuning pipeline.' },
        { name: 'Model Extraction', key: 'modelExtraction', sev: 'high', desc: 'API probing to replicate model behavior or steal weights.' },
        { name: 'Jailbreak', key: 'jailbreak', sev: 'critical', desc: 'Bypassing safety filters via adversarial prompting techniques.' },
        { name: 'Adversarial Inputs', key: 'adversarialInputs', sev: 'medium', desc: 'Crafted inputs causing misclassification or unexpected behavior.' },
      ].map(v => `
        <div class="vuln-detail-card ${model.vulnerabilities[v.key] > 0 ? 'vuln-found' : 'vuln-clean'}">
          <div class="vuln-detail-header">
            <span class="vuln-detail-name">${v.name}</span>
            <span class="vuln-count-badge sev-${v.sev}">${model.vulnerabilities[v.key]} found</span>
          </div>
          <p class="vuln-detail-desc">${v.desc}</p>
          ${scoreBar(model.vulnerabilities[v.key], 10)}
        </div>
      `).join('')}
    </div>
    <div class="detail-actions">
      <button class="btn-action" onclick="alert('Remediation report queued for ${model.name}')">📋 Generate Report</button>
      <button class="btn-warn" onclick="alert('${model.name} quarantine initiated')">⚠ Quarantine Model</button>
      <button class="btn-action" onclick="simulateScan('${model.id}')">🔍 Re-Scan Now</button>
    </div>
  `;
  document.getElementById('model-detail').scrollIntoView({ behavior: 'smooth' });
}

function closeModelDetail() {
  document.getElementById('model-detail').style.display = 'none';
}

function simulateScan(modelId) {
  const btn = document.querySelector('.btn-action');
  if (btn) { btn.textContent = '⏳ Scanning...'; btn.disabled = true; }
  setTimeout(() => {
    if (btn) { btn.textContent = '✅ Scan Complete'; btn.disabled = false; }
    showToast('Scan complete — 3 new vulnerabilities found');
  }, 3000);
}

// ─── MODULE 3: Deepfake Detection ─────────────────────────────────────────────
function renderDeepfakeDetection() {
  const container = document.getElementById('module-content');
  container.innerHTML = `
    <div class="module-deepfake">
      <div class="df-stats-row">
        <div class="df-stat-card">
          <div class="df-stat-val" style="color:#ff3366">${SIM_STATE.deepfakesDetected.toLocaleString()}</div>
          <div class="df-stat-label">Deepfakes Detected Today</div>
        </div>
        <div class="df-stat-card">
          <div class="df-stat-val" style="color:#00ff88">99.1%</div>
          <div class="df-stat-label">Detection Accuracy</div>
        </div>
        <div class="df-stat-card">
          <div class="df-stat-val" style="color:#00f0ff">0.3%</div>
          <div class="df-stat-label">False Positive Rate</div>
        </div>
        <div class="df-stat-card">
          <div class="df-stat-val" style="color:#ffcc00">847ms</div>
          <div class="df-stat-label">Avg Analysis Time</div>
        </div>
      </div>

      <div class="df-main">
        <!-- Upload Interface -->
        <div class="panel df-upload-panel">
          <div class="panel-header"><span class="panel-title">🔬 Analyze Content</span></div>
          <div class="df-upload-zone" id="df-drop-zone" onclick="simulateDeepfakeAnalysis()">
            <div class="upload-icon">📁</div>
            <div class="upload-text">Drop file here or click to analyze</div>
            <div class="upload-subtext">Supports: MP4, MOV, WAV, MP3, JPG, PNG, PDF</div>
            <div class="upload-formats">
              <span class="fmt-badge">Video</span>
              <span class="fmt-badge">Audio</span>
              <span class="fmt-badge">Image</span>
            </div>
          </div>

          <!-- Analysis Result (initially hidden) -->
          <div class="df-result" id="df-result" style="display:none">
            <div class="result-header">
              <span class="result-label">Analysis Complete</span>
              <span class="result-verdict confirmed-fake">⚠ CONFIRMED DEEPFAKE</span>
            </div>
            <div class="result-confidence">
              <div class="conf-label">Confidence Score</div>
              <div class="conf-value" id="conf-value">99.2%</div>
              ${scoreBar(99)}
            </div>
            <div class="result-artifacts">
              <div class="art-title">Detected Artifacts:</div>
              <div class="artifact-list" id="artifact-list">
                <span class="artifact-tag">GAN fingerprint</span>
                <span class="artifact-tag">Temporal inconsistency</span>
                <span class="artifact-tag">Mouth region blur</span>
              </div>
            </div>
            <div class="result-metadata">
              <div class="meta-title">Metadata Analysis:</div>
              <div class="meta-grid">
                <div class="meta-row"><span class="meta-key">File Created:</span><span class="mono meta-val">2026-11-17 14:11:00</span></div>
                <div class="meta-row"><span class="meta-key">Last Modified:</span><span class="mono meta-val">2026-11-17 14:11:03</span></div>
                <div class="meta-row"><span class="meta-key">Software:</span><span class="mono meta-val sev-critical">Unknown GAN Generator v3.x</span></div>
                <div class="meta-row"><span class="meta-key">Hash (SHA256):</span><span class="mono meta-val">a7f3c2d9e1b5...</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Detections Feed -->
        <div class="panel df-feed-panel">
          <div class="panel-header">
            <span class="panel-title">📋 Recent Detections</span>
            <span class="panel-live">● LIVE</span>
          </div>
          <div class="df-feed">
            ${DEEPFAKE_DETECTIONS.map(df => `
              <div class="df-feed-item" onclick="showDeepfakeDetail('${df.id}')">
                <div class="df-thumb df-thumb-${df.thumbnail}">
                  ${df.type === 'Video' ? '🎬' : df.type === 'Audio' ? '🎵' : '🖼'}
                </div>
                <div class="df-feed-info">
                  <div class="df-feed-name">${df.source}</div>
                  <div class="df-feed-meta">
                    <span class="mono">${df.timestamp.slice(11)}</span>
                    <span class="type-badge">${df.type}</span>
                  </div>
                </div>
                <div class="df-feed-score">
                  <div class="conf-pct ${df.confidence > 90 ? 'conf-high' : df.confidence > 70 ? 'conf-med' : 'conf-low'}">${df.confidence}%</div>
                  <div class="conf-label">Confidence</div>
                </div>
                <div class="df-feed-status">
                  <span class="badge ${df.status === 'Confirmed Fake' ? 'sev-critical' : df.status === 'Likely Fake' ? 'sev-high' : 'sev-medium'}">${df.status}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function simulateDeepfakeAnalysis() {
  const zone = document.getElementById('df-drop-zone');
  const result = document.getElementById('df-result');
  zone.innerHTML = '<div class="analyzing"><div class="scan-spinner"></div><div>Analyzing... Running GAN detection models</div><div class="mono" style="font-size:11px;margin-top:8px">Frame-level analysis · Audio spectral scan · Metadata forensics</div></div>';
  setTimeout(() => {
    const df = randomItem(DEEPFAKE_DETECTIONS);
    zone.style.display = 'none';
    document.getElementById('conf-value').textContent = df.confidence + '%';
    document.getElementById('artifact-list').innerHTML = df.artifacts.map(a => `<span class="artifact-tag">${a}</span>`).join('');
    result.style.display = 'block';
  }, 2800);
}

function showDeepfakeDetail(id) {
  const df = DEEPFAKE_DETECTIONS.find(d => d.id === id);
  if (df) showToast(`${df.source} — ${df.confidence}% confidence fake · ${df.type}`);
}

// ─── MODULE 4: Prompt Injection Firewall ──────────────────────────────────────
function renderInjectionFirewall() {
  const container = document.getElementById('module-content');
  container.innerHTML = `
    <div class="module-firewall">
      <div class="fw-top-row">
        <div class="fw-counter">
          <div class="fw-count-label">Total Injections Blocked</div>
          <div class="fw-count-val" id="fw-count">${SIM_STATE.injectionBlocked.toLocaleString()}</div>
          <div class="fw-count-sub">↑ updating live</div>
        </div>
        <div class="fw-filters">
          <select class="fw-select" id="fw-sev-filter" onchange="applyFwFilters()">
            <option value="">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
          <select class="fw-select" id="fw-type-filter" onchange="applyFwFilters()">
            <option value="">All Attack Types</option>
            <option value="System Override">System Override</option>
            <option value="Role Confusion">Role Confusion</option>
            <option value="Jailbreak Chain">Jailbreak Chain</option>
            <option value="Nested Injection">Nested Injection</option>
            <option value="Payload Encoding">Payload Encoding</option>
          </select>
          <select class="fw-select" id="fw-model-filter" onchange="applyFwFilters()">
            <option value="">All Models</option>
            ${AI_MODELS.map(m => `<option value="${m.name}">${m.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <span class="panel-title">🔥 Injection Attempts Feed</span>
          <span class="panel-live">● LIVE</span>
        </div>
        <div class="fw-table-wrap">
          <table class="data-table fw-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Severity</th>
                <th>Attack Type</th>
                <th>Source IP</th>
                <th>Target Model</th>
                <th>Payload Preview</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="fw-feed-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  renderFwFeed();
}

function renderFwFeed(severityFilter, typeFilter, modelFilter) {
  const tbody = document.getElementById('fw-feed-body');
  if (!tbody) return;
  let rows = SIM_STATE.recentInjections;
  if (severityFilter) rows = rows.filter(r => r.severity === severityFilter);
  if (typeFilter) rows = rows.filter(r => r.attackType === typeFilter);
  if (modelFilter) rows = rows.filter(r => r.targetModel === modelFilter);
  tbody.innerHTML = rows.slice(0, 20).map(inj => `
    <tr class="feed-row">
      <td class="mono">${inj.timestamp.slice(11)}</td>
      <td>${severityBadge(inj.severity)}</td>
      <td class="mono">${inj.attackType}</td>
      <td class="mono ip-cell">${inj.sourceIp}</td>
      <td class="mono">${inj.targetModel}</td>
      <td class="mono payload-cell" title="${inj.payload}">${inj.payload.slice(0, 48)}…</td>
      <td>${statusBadge(inj.status)}</td>
    </tr>
  `).join('');
}

function applyFwFilters() {
  const sev = document.getElementById('fw-sev-filter').value;
  const type = document.getElementById('fw-type-filter').value;
  const model = document.getElementById('fw-model-filter').value;
  renderFwFeed(sev, type, model);
}

// ─── MODULE 5: AI Threat Intelligence ────────────────────────────────────────
function renderThreatIntelligence() {
  const container = document.getElementById('module-content');
  container.innerHTML = `
    <div class="module-intel">
      <div class="intel-grid">
        <!-- Threat Actors -->
        <div class="panel intel-panel">
          <div class="panel-header"><span class="panel-title">🕵 Threat Actors</span></div>
          <div class="actor-list">
            ${THREAT_ACTORS.map(actor => `
              <div class="actor-card" onclick="showActorDetail('${actor.id}')">
                <div class="actor-icon">${actor.icon}</div>
                <div class="actor-info">
                  <div class="actor-name">${actor.name}</div>
                  <div class="actor-meta">${actor.origin} · ${actor.sophistication}</div>
                  <div class="actor-ttps">${actor.ttps.slice(0, 2).join(' · ')}</div>
                </div>
                <div class="actor-risk">
                  <span class="badge ${severityClass(actor.riskLevel)}">${actor.riskLevel}</span>
                  <div class="actor-seen">Last: ${actor.lastSeen}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- AI CVE Database -->
        <div class="panel intel-panel">
          <div class="panel-header"><span class="panel-title">🗄 AI CVE Database</span></div>
          <div class="cve-list">
            ${AI_CVE_DATABASE.map(cve => `
              <div class="cve-card">
                <div class="cve-header">
                  <span class="cve-id mono">${cve.id}</span>
                  <span class="badge ${severityClass(cve.severity)}">${cve.severity}</span>
                  <span class="cvss-score">CVSS: ${cve.cvss}</span>
                </div>
                <div class="cve-title">${cve.title}</div>
                <div class="cve-meta">Affects: ${cve.affected} · Published: ${cve.published}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Trending Attack Vectors -->
      <div class="panel" style="margin-top:16px">
        <div class="panel-header"><span class="panel-title">📈 Trending AI Attack Vectors</span></div>
        <div class="trending-vectors">
          ${[
            { name: 'Prompt Injection-as-a-Service', trend: '+340%', severity: 'Critical', desc: 'Commercialized jailbreak toolkits sold on dark web forums' },
            { name: 'LLM Supply Chain Attacks', trend: '+280%', severity: 'Critical', desc: 'Backdoored model weights distributed via PyPI/HuggingFace' },
            { name: 'Deepfake Audio Fraud', trend: '+210%', severity: 'High', desc: 'Voice cloning used for CEO fraud and authentication bypass' },
            { name: 'Multi-Step Jailbreak Chains', trend: '+190%', severity: 'High', desc: 'Automated chains of injections bypassing safety filters' },
            { name: 'Model Extraction via API', trend: '+155%', severity: 'High', desc: 'Systematic querying to replicate proprietary models' },
            { name: 'Training Data Poisoning', trend: '+130%', severity: 'High', desc: 'Contaminating datasets via web scraping manipulation' },
          ].map(v => `
            <div class="vector-row">
              <div class="vector-info">
                <div class="vector-name">${v.name}</div>
                <div class="vector-desc">${v.desc}</div>
              </div>
              <div class="vector-meta">
                <span class="badge ${severityClass(v.severity)}">${v.severity}</span>
                <span class="trend-pct">${v.trend}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function showActorDetail(id) {
  const actor = THREAT_ACTORS.find(a => a.id === id);
  if (!actor) return;
  showToast(`${actor.name} · ${actor.origin} · Last seen: ${actor.lastSeen} · TTPs: ${actor.ttps.join(', ')}`);
}

// ─── MODULE 6: Red Team Testing ───────────────────────────────────────────────
let redTeamRunning = false;
let redTeamResults = {};

function renderRedTeam() {
  const container = document.getElementById('module-content');
  container.innerHTML = `
    <div class="module-redteam">
      <div class="rt-header-row">
        <div class="rt-select-wrap">
          <label class="rt-label">Target Model:</label>
          <select class="fw-select" id="rt-model-select">
            ${AI_MODELS.map(m => `<option value="${m.id}">${m.name} (${m.type})</option>`).join('')}
          </select>
        </div>
        <button class="btn-action btn-launch" id="rt-launch-btn" onclick="launchRedTeam()">
          🚀 Launch Red Team Suite
        </button>
      </div>

      <div class="rt-tests-grid" id="rt-tests-grid">
        ${RED_TEAM_TESTS.map(test => `
          <div class="rt-test-card" id="rtcard-${test.id}">
            <div class="rt-test-icon">${test.icon}</div>
            <div class="rt-test-name">${test.name}</div>
            <div class="rt-test-desc">${test.description}</div>
            <div class="rt-test-meta">${test.testCases} test cases · ~${test.duration}s</div>
            <div class="rt-progress-wrap" id="rt-progress-${test.id}" style="display:none">
              <div class="rt-progress-bar">
                <div class="rt-progress-fill" id="rt-fill-${test.id}" style="width:0%"></div>
              </div>
              <div class="rt-progress-label" id="rt-label-${test.id}">Initializing...</div>
            </div>
            <div class="rt-result" id="rt-result-${test.id}" style="display:none"></div>
          </div>
        `).join('')}
      </div>

      <!-- Results Summary (shown after run) -->
      <div class="rt-summary" id="rt-summary" style="display:none">
        <div class="panel-header"><span class="panel-title">📊 Test Results Summary</span></div>
        <div id="rt-summary-content"></div>
      </div>
    </div>
  `;
}

function launchRedTeam() {
  if (redTeamRunning) return;
  redTeamRunning = true;
  redTeamResults = {};
  const btn = document.getElementById('rt-launch-btn');
  btn.textContent = '⏳ Running Tests...';
  btn.disabled = true;
  document.getElementById('rt-summary').style.display = 'none';

  const modelId = document.getElementById('rt-model-select').value;
  const model = AI_MODELS.find(m => m.id === modelId);

  RED_TEAM_TESTS.forEach((test, idx) => {
    const card = document.getElementById(`rtcard-${test.id}`);
    const progressWrap = document.getElementById(`rt-progress-${test.id}`);
    const fill = document.getElementById(`rt-fill-${test.id}`);
    const label = document.getElementById(`rt-label-${test.id}`);
    const resultDiv = document.getElementById(`rt-result-${test.id}`);

    // Stagger start
    setTimeout(() => {
      card.classList.add('rt-running');
      progressWrap.style.display = 'block';
      resultDiv.style.display = 'none';

      let pct = 0;
      const duration = test.duration * 20; // ms per tick
      const interval = setInterval(() => {
        pct += randomInt(3, 8);
        if (pct >= 100) {
          pct = 100;
          clearInterval(interval);
          fill.style.width = '100%';
          label.textContent = 'Complete';
          card.classList.remove('rt-running');

          // Generate result
          const passRate = model.riskScore < 50 ? randomInt(70, 95) : randomInt(30, 65);
          const passed = Math.round((passRate / 100) * test.testCases);
          const failed = test.testCases - passed;
          const overall = passRate >= 70 ? 'PASS' : 'FAIL';
          redTeamResults[test.id] = { passRate, passed, failed, overall, test };

          progressWrap.style.display = 'none';
          resultDiv.style.display = 'block';
          resultDiv.innerHTML = `
            <div class="rt-result-row">
              <span class="rt-verdict ${overall === 'PASS' ? 'rt-pass' : 'rt-fail'}">${overall === 'PASS' ? '✅ PASS' : '❌ FAIL'}</span>
              <span class="rt-pct">${passRate}% passed</span>
            </div>
            <div class="rt-result-detail mono">${passed}/${test.testCases} cases passed</div>
          `;

          // Check if all done
          if (Object.keys(redTeamResults).length === RED_TEAM_TESTS.length) {
            redTeamRunning = false;
            btn.textContent = '🔄 Re-Run Suite';
            btn.disabled = false;
            showRedTeamSummary(model);
          }
        } else {
          fill.style.width = pct + '%';
          const subTest = test.subtests[Math.floor((pct / 100) * test.subtests.length)] || test.subtests[0];
          label.textContent = `Testing: ${subTest.name}`;
        }
      }, 80);
    }, idx * 600);
  });
}

function showRedTeamSummary(model) {
  document.getElementById('rt-summary').style.display = 'block';
  const totalPass = Object.values(redTeamResults).filter(r => r.overall === 'PASS').length;
  const totalTests = RED_TEAM_TESTS.length;
  const overall = totalPass >= 3 ? 'MODERATE' : 'HIGH RISK';
  document.getElementById('rt-summary-content').innerHTML = `
    <div class="rt-summary-banner ${totalPass >= 3 ? 'banner-warn' : 'banner-crit'}">
      <span class="banner-model">${model.name}</span>
      <span class="banner-verdict">Overall Security Posture: <strong>${overall}</strong></span>
      <span class="banner-score">${totalPass}/${totalTests} tests passed</span>
    </div>
    <div class="rt-summary-grid">
      ${Object.values(redTeamResults).map(r => `
        <div class="rt-sum-row">
          <span class="rt-sum-name">${r.test.icon} ${r.test.name}</span>
          <div class="rt-sum-bar-wrap">
            <div class="rt-sum-bar" style="width:${r.passRate}%;background:${r.overall === 'PASS' ? '#00ff88' : '#ff3366'}"></div>
          </div>
          <span class="rt-sum-pct ${r.overall === 'PASS' ? 'rt-pass' : 'rt-fail'}">${r.passRate}%</span>
          <span class="rt-verdict-sm ${r.overall === 'PASS' ? 'rt-pass' : 'rt-fail'}">${r.overall}</span>
        </div>
      `).join('')}
    </div>
  `;
  document.getElementById('rt-summary').scrollIntoView({ behavior: 'smooth' });
}

// ─── MODULE 7: Compliance & Reporting ────────────────────────────────────────
function renderCompliance() {
  const container = document.getElementById('module-content');
  container.innerHTML = `
    <div class="module-compliance">
      <div class="compliance-header-row">
        <div class="compliance-overall">
          <div class="co-label">Overall Compliance Score</div>
          <div class="co-score">83.75%</div>
          <div class="co-sub">Across 4 frameworks</div>
        </div>
        <div class="compliance-actions">
          <button class="btn-action" onclick="generateReport()">📄 Generate Full Report</button>
          <button class="btn-action" onclick="showToast('Scheduled compliance scan initiated')">🔄 Run Compliance Scan</button>
        </div>
      </div>

      <div class="frameworks-grid">
        ${COMPLIANCE_FRAMEWORKS.map(fw => `
          <div class="fw-card" onclick="showFrameworkDetail('${fw.id}')">
            <div class="fw-card-header">
              <div class="fw-card-name">${fw.name}</div>
              <div class="fw-card-version">v${fw.version}</div>
            </div>
            <div class="fw-score-ring">
              <canvas id="ring-${fw.id}" width="100" height="100"></canvas>
              <div class="ring-center">
                <div class="ring-pct">${fw.score}%</div>
              </div>
            </div>
            <div class="fw-status ${fw.status === 'Certified' ? 'status-certified' : fw.status === 'Compliant' ? 'status-compliant' : 'status-partial'}">${fw.status}</div>
            <div class="fw-controls">
              ${fw.controls.map(c => `
                <div class="ctrl-row">
                  <span class="ctrl-name">${c.name}</span>
                  <span class="ctrl-score">${c.score}%</span>
                  <span class="ctrl-status ${c.status === 'Pass' ? 'ctrl-pass' : 'ctrl-review'}">${c.status}</span>
                </div>
              `).join('')}
            </div>
            <div class="fw-meta">
              <span>Next audit: ${fw.nextAudit}</span>
              <span>Cert body: ${fw.certBody}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Audit Log -->
      <div class="panel" style="margin-top:16px">
        <div class="panel-header">
          <span class="panel-title">📋 Audit Log</span>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Timestamp</th><th>User / Service</th><th>Action</th><th>Resource</th><th>Result</th></tr>
          </thead>
          <tbody>
            ${AUDIT_LOG.map(entry => `
              <tr class="feed-row">
                <td class="mono">${entry.ts}</td>
                <td class="mono">${entry.user}</td>
                <td class="mono">${entry.action}</td>
                <td class="mono">${entry.resource}</td>
                <td><span class="badge ${entry.result === 'Success' ? 'badge-allowed' : entry.result === 'Blocked' ? 'badge-blocked' : 'sev-high'}">${entry.result}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Draw score rings after DOM is ready
  setTimeout(() => {
    COMPLIANCE_FRAMEWORKS.forEach(fw => drawScoreRing(fw.id, fw.score));
  }, 50);
}

function drawScoreRing(fwId, score) {
  const canvas = document.getElementById(`ring-${fwId}`);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 50, cy = 50, r = 38;
  const color = score >= 90 ? '#00ff88' : score >= 75 ? '#00f0ff' : score >= 60 ? '#ffcc00' : '#ff3366';
  // Background ring
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 8; ctx.stroke();
  // Score arc
  const angle = (score / 100) * Math.PI * 2 - Math.PI / 2;
  ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, angle);
  ctx.strokeStyle = color; ctx.lineWidth = 8;
  ctx.lineCap = 'round'; ctx.stroke();
}

function generateReport() {
  showToast('📄 Generating compliance report... This may take a moment.');
  setTimeout(() => showToast('✅ Report ready — sentinelmind-compliance-2026-11-17.pdf'), 2000);
}

function showFrameworkDetail(id) {
  const fw = COMPLIANCE_FRAMEWORKS.find(f => f.id === id);
  if (fw) showToast(`${fw.name} ${fw.version} — Score: ${fw.score}% — Status: ${fw.status} — Certified by: ${fw.certBody}`);
}
