/**
 * SentinelMind AI — Main Application Controller
 * Navigation, simulation engine, matrix rain, toast notifications
 */

// ─── App State ────────────────────────────────────────────────────────────────
const APP = {
  currentModule: 'dashboard',
  matrixCanvas: null,
  matrixCtx: null,
  matrixDrops: [],
  settings: JSON.parse(localStorage.getItem('sm-settings') || '{"matrixEnabled":true,"animationsEnabled":true,"alertSounds":false}'),
};

// ─── Navigation ───────────────────────────────────────────────────────────────
const MODULES = [
  { id: 'dashboard',   label: 'Threat Dashboard',       icon: '🏠', render: renderThreatDashboard },
  { id: 'scanner',     label: 'Model Scanner',           icon: '🔍', render: renderModelScanner },
  { id: 'deepfake',    label: 'Deepfake Detection',      icon: '🎭', render: renderDeepfakeDetection },
  { id: 'firewall',    label: 'Injection Firewall',      icon: '🔥', render: renderInjectionFirewall },
  { id: 'intel',       label: 'Threat Intelligence',     icon: '🕵', render: renderThreatIntelligence },
  { id: 'redteam',     label: 'Red Team Testing',        icon: '⚔', render: renderRedTeam },
  { id: 'compliance',  label: 'Compliance & Reporting',  icon: '📋', render: renderCompliance },
];

function navigateTo(moduleId) {
  APP.currentModule = moduleId;

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navItem = document.querySelector(`[data-module="${moduleId}"]`);
  if (navItem) navItem.classList.add('active');

  // Update module title
  const mod = MODULES.find(m => m.id === moduleId);
  if (mod) {
    document.getElementById('module-title').textContent = mod.icon + '  ' + mod.label;
    document.getElementById('page-title').textContent = mod.label + ' — SentinelMind AI';
  }

  // Render module
  const content = document.getElementById('module-content');
  content.classList.add('fade-out');
  setTimeout(() => {
    content.classList.remove('fade-out');
    content.classList.add('fade-in');
    if (mod) mod.render();
    setTimeout(() => content.classList.remove('fade-in'), 300);
  }, 150);

  // Mobile: close sidebar
  document.getElementById('sidebar').classList.remove('mobile-open');
}

// ─── Alert Ticker ─────────────────────────────────────────────────────────────
const TICKER_MESSAGES = [
  '🔴 CRITICAL: Meridian-13B — Multi-step jailbreak chain detected',
  '⚠ HIGH: TerraLM-70B — Model extraction via systematic API probing (1,200 queries)',
  '🔴 CRITICAL: Supply chain compromise — Backdoored weights detected in 3 models',
  '⚠ HIGH: NovaSpeech-3 — Data poisoning via compromised S3 training pipeline',
  '🔵 INFO: AI-CVE-2026-0847 — Universal LLM Jailbreak (CVSS 9.8) published',
  '⚠ HIGH: PHANTOM-CIRCUIT threat actor active — targeting financial AI systems',
  '🔴 CRITICAL: Deepfake CEO video detected — 99.2% confidence synthetic content',
  '⚠ HIGH: 32,441 prompt injection attempts blocked in last 24h',
  '🟡 MEDIUM: VisionGuard-XL — Adversarial pixel patch attack from 194.165.16.77',
  '🔴 CRITICAL: DRAGON-BYTE campaign active — healthcare AI systems under attack',
  '⚠ HIGH: CodeSentinel-34B — Prompt injection via code comment vectors',
  '🔵 INFO: SOC 2 Type II compliance certified — Deloitte audit complete',
];

function initTicker() {
  const wrap = document.getElementById('ticker-content');
  const msgs = [...TICKER_MESSAGES, ...TICKER_MESSAGES];
  wrap.innerHTML = msgs.map(m => `<span class="ticker-item">${m}</span>`).join('');
}

// ─── Matrix Rain ──────────────────────────────────────────────────────────────
function initMatrixRain() {
  const canvas = document.getElementById('matrix-bg');
  if (!canvas) return;
  APP.matrixCanvas = canvas;
  APP.matrixCtx = canvas.getContext('2d');
  resizeMatrix();
  window.addEventListener('resize', resizeMatrix);
  animateMatrix();
}

function resizeMatrix() {
  const canvas = APP.matrixCanvas;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 16);
  APP.matrixDrops = Array(cols).fill(1);
}

function animateMatrix() {
  if (!APP.settings.matrixEnabled) {
    APP.matrixCtx.clearRect(0, 0, APP.matrixCanvas.width, APP.matrixCanvas.height);
    requestAnimationFrame(animateMatrix);
    return;
  }
  const ctx = APP.matrixCtx;
  const canvas = APP.matrixCanvas;
  ctx.fillStyle = 'rgba(10, 15, 30, 0.04)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const chars = '01アイウエオカキクケコ$#@&%ABCDEF0123456789';
  ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
  ctx.font = '13px JetBrains Mono, monospace';

  APP.matrixDrops.forEach((y, i) => {
    const ch = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillStyle = i % 7 === 0 ? 'rgba(0,255,136,0.18)' : 'rgba(0,240,255,0.10)';
    ctx.fillText(ch, i * 16, y * 16);
    if (y * 16 > canvas.height && Math.random() > 0.975) APP.matrixDrops[i] = 0;
    APP.matrixDrops[i]++;
  });

  setTimeout(() => requestAnimationFrame(animateMatrix), 60);
}

// ─── Toast Notifications ──────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === 'error' ? '❌' : type === 'warn' ? '⚠' : 'ℹ'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('toast-visible'), 10);
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

// ─── Simulation Engine ────────────────────────────────────────────────────────
function startSimulation() {
  // Update threat counter every 2-4 seconds
  setInterval(() => {
    SIM_STATE.threatsBlockedToday += randomInt(1, 5);
    SIM_STATE.injectionBlocked += randomInt(1, 3);
    const el = document.getElementById('val-threats');
    if (el) el.textContent = SIM_STATE.threatsBlockedToday.toLocaleString();
    const fwEl = document.getElementById('fw-count');
    if (fwEl) fwEl.textContent = SIM_STATE.injectionBlocked.toLocaleString();
  }, randomInt(2000, 4000));

  // Add new threat to feed every 5-10 seconds
  setInterval(() => {
    const threat = generateThreatEvent();
    SIM_STATE.recentThreats.unshift(threat);
    SIM_STATE.recentThreats = SIM_STATE.recentThreats.slice(0, 50);

    if (APP.currentModule === 'dashboard') {
      renderThreatFeed();
      if (threat.severity === 'Critical') {
        showToast(`🔴 Critical threat: ${threat.type} from ${threat.countryName} targeting ${threat.target}`, 'error');
      }
    }
  }, randomInt(5000, 10000));

  // Add new injection every 3-7 seconds
  setInterval(() => {
    const inj = generateInjectionEvent();
    SIM_STATE.recentInjections.unshift(inj);
    SIM_STATE.recentInjections = SIM_STATE.recentInjections.slice(0, 50);
    if (APP.currentModule === 'firewall') renderFwFeed();
  }, randomInt(3000, 7000));

  // Deepfake counter
  setInterval(() => {
    SIM_STATE.deepfakesDetected += randomInt(0, 2);
    const el = document.querySelector('.df-stat-val');
    if (el && APP.currentModule === 'deepfake') el.textContent = SIM_STATE.deepfakesDetected.toLocaleString();
  }, 8000);

  // Avg response time micro-fluctuation
  setInterval(() => {
    SIM_STATE.avgResponseTime = parseFloat((SIM_STATE.avgResponseTime + (Math.random() - 0.5) * 0.05).toFixed(2));
    if (SIM_STATE.avgResponseTime < 0.1) SIM_STATE.avgResponseTime = 0.1;
    if (SIM_STATE.avgResponseTime > 1.5) SIM_STATE.avgResponseTime = 1.5;
    const el = document.getElementById('val-response');
    if (el) el.textContent = SIM_STATE.avgResponseTime + 'ms';
  }, 3000);

  // Redraw map periodically
  setInterval(() => {
    if (APP.currentModule === 'dashboard') drawThreatMap();
  }, 8000);
}

// ─── Sidebar Toggle ───────────────────────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('mobile-open');
}

// ─── Keyboard Shortcuts ───────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModelDetail && closeModelDetail();
    document.getElementById('sidebar').classList.remove('mobile-open');
  }
  if (e.ctrlKey || e.metaKey) {
    const num = parseInt(e.key);
    if (num >= 1 && num <= MODULES.length) {
      e.preventDefault();
      navigateTo(MODULES[num - 1].id);
    }
  }
});

// ─── Clock ────────────────────────────────────────────────────────────────────
function updateClock() {
  const el = document.getElementById('sys-time');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toUTCString().slice(0, 25) + ' UTC';
}

// ─── Boot Sequence ────────────────────────────────────────────────────────────
function boot() {
  // Build sidebar nav
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = MODULES.map(m => `
    <div class="nav-item ${m.id === 'dashboard' ? 'active' : ''}" data-module="${m.id}" onclick="navigateTo('${m.id}')">
      <span class="nav-icon">${m.icon}</span>
      <span class="nav-label">${m.label}</span>
    </div>
  `).join('');

  initTicker();
  initMatrixRain();

  // Start clock
  updateClock();
  setInterval(updateClock, 1000);

  // Initial render
  renderThreatDashboard();
  startSimulation();

  // Boot toast
  setTimeout(() => showToast('SentinelMind AI platform online — All systems nominal'), 1000);
  setTimeout(() => showToast('🔴 3 critical threats detected — Meridian-13B quarantine recommended', 'error'), 3500);
}

document.addEventListener('DOMContentLoaded', boot);
