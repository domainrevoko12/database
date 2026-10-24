/* Add Database — frontend SPA (vanilla, no build) */

const CSS = `
:root {
  --bg: #f8fafc;
  --card: #ffffff;
  --ink: #0f172a;
  --mut: #64748b;
  --line: #e2e8f0;
  --line-light: #f1f5f9;
  --pri: #4f46e5;
  --pri-h: #4338ca;
  --pri-soft: #eef2ff;
  --pri-ink: #4338ca;
  --ok-bg: #ecfdf5;
  --ok-ink: #047857;
  --ok-border: #a7f3d0;
  --danger: #ef4444;
  --danger-h: #dc2626;
  --danger-soft: #fef2f2;
  --radius: 16px;
  --shadow-sm: 0 1px 3px rgba(15,23,42,.06);
  --shadow: 0 4px 20px -2px rgba(15,23,42,.07);
  --shadow-lg: 0 20px 40px -8px rgba(15,23,42,.18);
}

* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; }
body {
  background: var(--bg);
  color: var(--ink);
  font: 14.5px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

button { font: inherit; color: inherit; cursor: pointer; border: 0; background: none; }
input, textarea { font: inherit; }
svg { display: block; flex-shrink: 0; }

/* Topbar */
.topbar {
  position: fixed; inset: 0 0 auto 0; height: 62px;
  display: flex; align-items: center; gap: 14px;
  padding: 0 18px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
  z-index: 40;
}
.burger {
  width: 40px; height: 40px; border-radius: 11px;
  display: grid; place-items: center;
  background: #fff; border: 1px solid var(--line);
  color: var(--ink);
  box-shadow: var(--shadow-sm);
  transition: all .18s;
}
.burger:hover { border-color: var(--pri); color: var(--pri); transform: translateY(-1px); }
.topbar .brand { display: flex; align-items: center; gap: 9px; }
.topbar .brand-icon {
  width: 30px; height: 30px; border-radius: 8px;
  display: grid; place-items: center;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff;
}
.topbar .t { font-weight: 700; font-size: 16.5px; letter-spacing: -.3px; }
.topbar .sp { flex: 1; }
.counter {
  font-size: 12.5px; font-weight: 600;
  color: var(--mut); background: #fff;
  border: 1px solid var(--line);
  padding: 5px 12px; border-radius: 999px;
  box-shadow: var(--shadow-sm);
  display: flex; align-items: center; gap: 6px;
}
.counter::before {
  content: ""; width: 7px; height: 7px; border-radius: 50%;
  background: #10b981; display: inline-block;
  box-shadow: 0 0 0 2px rgba(16,185,129,.2);
}

/* Sidebar */
#scrim {
  position: fixed; inset: 0;
  background: rgba(15,23,42,.42);
  backdrop-filter: blur(4px);
  opacity: 0; pointer-events: none;
  transition: opacity .22s; z-index: 45;
}
#scrim.on { opacity: 1; pointer-events: auto; }
aside {
  position: fixed; top: 0; left: 0; bottom: 0;
  width: 290px; max-width: 86vw;
  background: #fff; border-right: 1px solid var(--line);
  transform: translateX(-102%);
  transition: transform .24s cubic-bezier(.16,1,.3,1);
  z-index: 50; display: flex; flex-direction: column;
  box-shadow: var(--shadow-lg);
}
aside.on { transform: none; }
aside .head {
  padding: 18px 18px 16px;
  border-bottom: 1px solid var(--line);
  display: flex; align-items: center; gap: 10px;
}
aside .head b { font-size: 16px; font-weight: 700; letter-spacing: -.2px; }
aside .head .sp { flex: 1; }
.x-btn {
  width: 32px; height: 32px; border-radius: 9px;
  display: grid; place-items: center;
  color: var(--mut); border: 1px solid var(--line); background: #fff;
  transition: all .16s;
}
.x-btn:hover { color: var(--ink); border-color: #cbd5e1; background: #f8fafc; }
nav { padding: 14px 10px; display: flex; flex-direction: column; gap: 5px; overflow-y: auto; flex: 1; }
nav button {
  display: flex; align-items: center; gap: 11px;
  padding: 11px 14px; border-radius: 12px;
  color: var(--mut); text-align: left;
  font-weight: 500; font-size: 14px; width: 100%;
  transition: all .16s;
}
nav button:hover { background: #f1f5f9; color: var(--ink); }
nav button.active {
  background: var(--pri-soft); color: var(--pri-ink);
  font-weight: 600;
}
nav button .nav-badge {
  margin-left: auto; font-size: 11.5px; font-weight: 600;
  padding: 2px 8px; border-radius: 999px;
  background: rgba(79,70,229,.12); color: var(--pri-ink);
}
nav button:not(.active) .nav-badge {
  background: #e2e8f0; color: var(--mut);
}
aside .foot {
  padding: 14px; border-top: 1px solid var(--line);
  display: flex; flex-direction: column; gap: 10px;
  background: #fafbfc;
}
aside .foot .repo-badge {
  display: flex; align-items: center; gap: 8px;
  font-size: 11.5px; color: var(--mut);
  padding: 7px 10px; border-radius: 9px;
  background: #fff; border: 1px solid var(--line);
  word-break: break-all;
}
aside .foot .meta { font-size: 11.5px; color: var(--mut); word-break: break-all; line-height: 1.4; display: none; }

/* Main Layout */
main {
  padding: 86px 18px 56px;
  max-width: 860px;
  margin: 0 auto;
}
.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 24px 22px;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
}

/* Hero Section */
.hero { text-align: center; padding: 6px 0 22px; }
.hero .logo {
  width: 58px; height: 58px; margin: 0 auto 14px;
  border-radius: 18px; display: grid; place-items: center;
  background: linear-gradient(135deg, #4f46e5, #818cf8);
  color: #fff;
  box-shadow: 0 8px 20px -4px rgba(79,70,229,.35);
}
.hero h1 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -.6px; }
.hero p { margin: 7px 0 0; color: var(--mut); font-size: 14.5px; }

/* Stats Row */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 22px;
}
@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr; }
}
.stat-card {
  background: #f8fafc;
  border: 1px solid var(--line);
  border-radius: 13px;
  padding: 13px 15px;
  display: flex; align-items: center; gap: 12px;
}
.stat-icon {
  width: 38px; height: 38px; border-radius: 10px;
  display: grid; place-items: center;
  background: #fff; border: 1px solid var(--line);
}
.stat-info { display: flex; flex-direction: column; }
.stat-val { font-size: 18px; font-weight: 700; line-height: 1.2; }
.stat-lbl { font-size: 11.5px; color: var(--mut); font-weight: 500; }

/* Forms & Inputs */
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
label { font-size: 13px; color: var(--mut); font-weight: 600; display: flex; align-items: center; justify-content: space-between; }
label .hint { font-size: 11.5px; font-weight: 400; color: #94a3b8; }
.inwrap { position: relative; display: flex; align-items: center; }
.inwrap .ic { position: absolute; left: 14px; color: #94a3b8; pointer-events: none; }
.inwrap input {
  width: 100%; padding: 13px 14px 13px 44px;
  border: 1px solid #d8dfec; border-radius: 12px;
  background: #fff; color: var(--ink);
  outline: none; font-size: 14.5px;
  transition: all .16s;
}
.inwrap input:focus {
  border-color: var(--pri);
  box-shadow: 0 0 0 3px rgba(79,70,229,.14);
}
.inwrap .toggle {
  position: absolute; right: 12px; color: #94a3b8;
  padding: 6px; border-radius: 8px;
  display: grid; place-items: center;
  transition: color .15s;
}
.inwrap .toggle:hover { color: var(--ink); }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 13px 18px; border-radius: 12px;
  background: linear-gradient(180deg, var(--pri), var(--pri-h));
  color: #fff; font-weight: 600; font-size: 14.5px;
  width: 100%; box-shadow: 0 4px 14px rgba(79,70,229,.24);
  transition: all .16s;
}
.btn:hover { background: var(--pri-h); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(79,70,229,.3); }
.btn:active { transform: translateY(0); }
.btn:disabled { opacity: .65; cursor: not-allowed; transform: none; box-shadow: none; }
.btn.sm { padding: 9px 15px; font-size: 13.5px; width: auto; box-shadow: none; border-radius: 10px; }
.btn.ghost {
  background: #fff; color: var(--ink);
  border: 1px solid #d8dfec; box-shadow: var(--shadow-sm);
}
.btn.ghost:hover { background: #f8fafc; border-color: #cbd5e1; transform: translateY(-1px); }
.btn.danger { background: var(--danger); box-shadow: 0 4px 14px rgba(239,68,68,.25); }
.btn.danger:hover { background: var(--danger-h); }

/* Search Bar */
.search-bar {
  display: flex; align-items: center; gap: 10px;
  margin: 22px 0 14px;
}
.search { position: relative; flex: 1; }
.search .ic { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
.search input {
  width: 100%; padding: 12px 14px 12px 42px;
  border: 1px solid #d8dfec; border-radius: 12px;
  background: #fff; color: var(--ink);
  outline: none; font-size: 14px;
  transition: all .16s;
}
.search input:focus {
  border-color: var(--pri);
  box-shadow: 0 0 0 3px rgba(79,70,229,.12);
}
.search-count {
  font-size: 12.5px; color: var(--mut);
  white-space: nowrap; font-weight: 500;
}

/* Tables */
.table-wrap {
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  background: #fff;
}
.tbl { width: 100%; border-collapse: collapse; }
.tbl th {
  background: #f8fafc; color: var(--mut);
  font-weight: 600; text-align: left;
  padding: 12px 16px; font-size: 12.5px;
  text-transform: uppercase; letter-spacing: .4px;
  border-bottom: 1px solid var(--line);
}
.tbl td {
  padding: 14px 16px; border-top: 1px solid var(--line);
  font-size: 14.5px; vertical-align: middle;
}
.tbl tbody tr:first-child td { border-top: 0; }
.tbl tbody tr { transition: background .12s; }
.tbl tbody tr:hover { background: #fafbff; }
.tbl .num {
  font-variant-numeric: tabular-nums;
  font-weight: 600; color: #1e293b;
  letter-spacing: .2px;
}
.tbl .tok {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px; word-break: break-all;
  background: #f8fafc; padding: 4px 8px; border-radius: 7px;
  border: 1px solid var(--line);
  transition: all .16s;
}
.tbl .tok:hover { background: #eef2ff; border-color: #c7d2fe; }
.tbl td.act { width: 92px; text-align: right; white-space: nowrap; }

.pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 11px; border-radius: 999px;
  background: var(--ok-bg); color: var(--ok-ink);
  border: 1px solid var(--ok-border);
  font-weight: 600; font-size: 12px;
  letter-spacing: .2px;
}
.pill::before {
  content: ""; width: 6px; height: 6px; border-radius: 50%;
  background: #10b981;
}

.table-acts { display: inline-flex; align-items: center; gap: 4px; }
.icon-btn {
  display: inline-grid; place-items: center;
  width: 32px; height: 32px; border-radius: 8px;
  color: #94a3b8; border: 1px solid transparent;
  transition: all .15s;
}
.icon-btn:hover { color: var(--ink); background: #f1f5f9; }
.icon-btn.del:hover { color: #fff; background: var(--danger); }
.icon-btn.copy:hover { color: var(--pri); background: var(--pri-soft); }

.empty {
  padding: 38px 20px; text-align: center;
  color: var(--mut); font-size: 14px;
}
.empty-icon {
  width: 44px; height: 44px; margin: 0 auto 10px;
  border-radius: 12px; display: grid; place-items: center;
  background: #f1f5f9; color: #94a3b8;
}

/* Raw Github View */
.raw-info {
  background: #eff6ff; border: 1px solid #bfdbfe;
  color: #1e40af; padding: 12px 14px; border-radius: 12px;
  font-size: 13px; line-height: 1.45; margin-bottom: 16px;
  display: flex; gap: 10px; align-items: flex-start;
}
.rawbox {
  border: 1px solid var(--line); border-radius: 12px;
  padding: 16px; background: #0f172a; color: #e2e8f0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px; line-height: 1.5; white-space: pre-wrap;
  word-break: break-all; max-height: 380px; overflow: auto;
  box-shadow: inset 0 2px 4px rgba(0,0,0,.2);
}

/* Modal */
.modal {
  position: fixed; inset: 0; z-index: 70;
  display: none; align-items: center; justify-content: center;
  padding: 20px; background: rgba(15,23,42,.5);
  backdrop-filter: blur(5px);
}
.modal.on { display: flex; }
.modal-card {
  background: #fff; border-radius: 18px;
  padding: 26px 24px; max-width: 400px; width: 100%;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--line);
  animation: pop .18s ease-out;
}
@keyframes pop { from { opacity: 0; transform: scale(.95); } to { opacity: 1; transform: scale(1); } }
.modal-card h3 { margin: 0 0 8px; font-size: 18px; font-weight: 700; }
.modal-card p { margin: 0 0 22px; color: var(--mut); font-size: 14px; line-height: 1.5; }
.modal-card .acts { display: flex; gap: 10px; }
.modal-card .acts .btn { width: auto; flex: 1; }

/* Toast */
#toast {
  position: fixed; left: 50%; bottom: 26px;
  transform: translate(-50%, 16px);
  background: #0f172a; color: #fff;
  padding: 11px 20px; border-radius: 12px;
  opacity: 0; transition: all .2s cubic-bezier(.16,1,.3,1);
  pointer-events: none; z-index: 80;
  font-size: 13.5px; font-weight: 500;
  box-shadow: 0 10px 25px rgba(15,23,42,.3);
  display: flex; align-items: center; gap: 8px;
}
#toast.on { opacity: 1; transform: translate(-50%, 0); }
#toast.err { background: #dc2626; }

/* Login Screen */
#login {
  position: fixed; inset: 0; z-index: 90;
  display: grid; place-items: center;
  padding: 18px; background: var(--bg);
}
#login .card {
  width: min(410px, 100%); margin: 0;
  box-shadow: var(--shadow-lg);
  border-radius: 20px; padding: 28px 26px;
}
#login .hero { padding: 4px 0 18px; }

.spin {
  display: inline-block; width: 15px; height: 15px;
  border: 2px solid rgba(255,255,255,.35); border-top-color: #fff;
  border-radius: 50%; animation: sp .7s linear infinite;
}
@keyframes sp { to { transform: rotate(360deg); } }
.hidden { display: none !important; }
`;

const ICON = {
  burger: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  db: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>',
  lock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  eye: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M3 3l18 18"/><path d="M10.6 6.1A9.9 9.9 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.3 4"/><path d="M6.3 8.2A16.8 16.8 0 0 0 2 12s3.6 6 10 6a10 10 0 0 0 4-.8"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>',
  login: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>',
  plus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  search: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>',
  wa: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 21l2.3-5.1A8.4 8.4 0 1 1 21 11.5Z"/></svg>',
  tg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m21 4-3 16-6-4-3 3v-4.5L21 4Z"/><path d="m9 14.5 5-4"/></svg>',
  raw: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  out: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>',
  copy: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  refresh: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>',
  info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
};

const el = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const mask = (t) => {
  if (!t) return "••••••";
  return t.length > 12 ? t.slice(0, 6) + "••••••" + t.slice(-4) : "••••••";
};

const state = {
  view: "whatsapp",
  q: "",
  data: { whatsapp: [], telegram: [], rawUrl: "", config: {} },
};

/* ---------- API ---------- */
async function api(path, opts = {}) {
  const res = await fetch(`/api/${path}`, {
    headers: { "content-type": "application/json" },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  let j = {};
  try {
    j = await res.json();
  } catch {}
  if (!res.ok) throw new Error(j.error || `HTTP ${res.status}`);
  return j;
}

let toastTimer;
function toast(msg, kind = "") {
  const t = el("toast");
  t.textContent = msg;
  t.className = "on " + kind;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.className = kind;
  }, 2600);
}

/* ---------- Layout Setup ---------- */
document.head.insertAdjacentHTML("beforeend", `<style>${CSS}</style>`);

document.body.innerHTML = `
<header class="topbar">
  <button class="burger" id="burger" aria-label="Menu">${ICON.burger}</button>
  <div class="brand">
    <div class="brand-icon">${ICON.db}</div>
    <span class="t">Database</span>
  </div>
  <span class="sp"></span>
  <span class="counter" id="counter">0 item</span>
</header>
<div id="scrim"></div>
<aside id="side">
  <div class="head">
    <div class="brand-icon" style="width:28px;height:28px">${ICON.db}</div>
    <b>Database</b>
    <span class="sp"></span>
    <button class="x-btn" id="closeSide" aria-label="Tutup">${ICON.close}</button>
  </div>
  <nav>
    <button data-view="whatsapp">${ICON.wa}<span>Whatsapp Number</span><span class="nav-badge" id="waBadge">0</span></button>
    <button data-view="telegram">${ICON.tg}<span>Telegram Token</span><span class="nav-badge" id="tgBadge">0</span></button>
    <button data-view="raw">${ICON.raw}<span>Github Raw</span><span class="nav-badge">Live</span></button>
  </nav>
  <div class="foot">
    <div class="repo-badge">
      ${ICON.raw}
      <span id="repoName">domainrevoko12/database</span>
    </div>
    <button class="btn sm ghost" id="logout" style="width:100%">Logout</button>
    <div class="meta" id="rawMeta"></div>
  </div>
</aside>
<main id="main"></main>
<div class="modal" id="modal">
  <div class="modal-card">
    <h3 id="mTitle">Hapus data?</h3>
    <p id="mText"></p>
    <div class="acts">
      <button class="btn sm ghost" id="mNo">Batal</button>
      <button class="btn sm danger" id="mYes">Hapus</button>
    </div>
  </div>
</div>
<div id="toast"></div>
<div id="login">
  <form class="card" id="loginForm" autocomplete="off">
    <div class="hero">
      <div class="logo">${ICON.db}</div>
      <h1>Database</h1>
      <p>Masuk untuk mengelola database WhatsApp & Telegram</p>
    </div>
    <div class="field">
      <label for="pw">Password</label>
      <div class="inwrap">
        <span class="ic">${ICON.lock}</span>
        <input id="pw" type="password" placeholder="Enter your password" required>
        <button type="button" class="toggle" id="pwToggle" aria-label="Lihat password">${ICON.eye}</button>
      </div>
    </div>
    <button class="btn" type="submit" id="loginBtn">${ICON.login}<span>Masuk</span></button>
  </form>
</div>
`;

/* ---------- Sidebar Controls ---------- */
const side = el("side"), scrim = el("scrim");
const openSide = (on) => {
  side.classList.toggle("on", on);
  scrim.classList.toggle("on", on);
};
el("burger").onclick = () => openSide(true);
el("closeSide").onclick = () => openSide(false);
scrim.onclick = () => openSide(false);
addEventListener("keydown", (e) => e.key === "Escape" && openSide(false));
document.querySelectorAll("nav button").forEach((b) => (b.onclick = () => setView(b.dataset.view)));

function setView(v) {
  state.view = v;
  state.q = "";
  document.querySelectorAll("nav button").forEach((b) => b.classList.toggle("active", b.dataset.view === v));
  render();
  if (v === "raw") loadRaw();
  if (innerWidth < 760) openSide(false);
}

/* ---------- Views Rendering ---------- */
function render() {
  const m = el("main");
  m.innerHTML = state.view === "whatsapp" ? waView() : state.view === "telegram" ? tgView() : rawView();
  const waLen = state.data.whatsapp.length;
  const tgLen = state.data.telegram.length;
  const total = waLen + tgLen;
  el("counter").textContent = `${total} item`;

  const wb = el("waBadge");
  if (wb) wb.textContent = waLen;
  const tb = el("tgBadge");
  if (tb) tb.textContent = tgLen;

  if (state.data.config?.owner && state.data.config?.repo) {
    const rn = el("repoName");
    if (rn) rn.textContent = `${state.data.config.owner}/${state.data.config.repo}`;
  }

  bind();
}

const hero = (title, sub) => `
<div class="hero">
  <div class="logo">${ICON.db}</div>
  <h1>${title}</h1>
  <p>${sub}</p>
</div>`;

const statsHtml = () => `
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-icon" style="color:#10b981">${ICON.wa}</div>
    <div class="stat-info">
      <span class="stat-val">${state.data.whatsapp.length}</span>
      <span class="stat-lbl">WhatsApp Numbers</span>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon" style="color:#0284c7">${ICON.tg}</div>
    <div class="stat-info">
      <span class="stat-val">${state.data.telegram.length}</span>
      <span class="stat-lbl">Telegram Tokens</span>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-icon" style="color:#6366f1">${ICON.raw}</div>
    <div class="stat-info">
      <span class="stat-val" style="font-size:14.5px;color:#047857">Connected</span>
      <span class="stat-lbl">database.json (Live)</span>
    </div>
  </div>
</div>`;

const waView = () => `
<div class="card">
  ${hero("Database", "Add and check your registered numbers")}
  ${statsHtml()}
  <form id="waForm">
    <div class="field">
      <label for="waNum">Phone Number <span class="hint">Format: 628xxx / 08xxx (bisa multi-nomor)</span></label>
      <div class="inwrap">
        <span class="ic">${ICON.wa}</span>
        <input id="waNum" placeholder="Enter phone number" required autocomplete="off">
      </div>
    </div>
    <button class="btn" type="submit" id="waAdd">${ICON.plus}<span>Add Number</span></button>
  </form>
  <div class="search-bar">
    <div class="search">
      <span class="ic">${ICON.search}</span>
      <input id="waSearch" placeholder="Search numbers..." value="${esc(state.q)}">
    </div>
  </div>
  <div id="waTable">${tableHtml(state.data.whatsapp, "wa")}</div>
</div>`;

const tgView = () => `
<div class="card">
  ${hero("Database", "Add and check your registered tokens")}
  ${statsHtml()}
  <form id="tgForm">
    <div class="field">
      <label for="tgTok">Telegram Token <span class="hint">Bot Token resmi Telegram</span></label>
      <div class="inwrap">
        <span class="ic">${ICON.tg}</span>
        <input id="tgTok" placeholder="Enter bot token" required autocomplete="off">
        <button type="button" class="toggle" id="tgToggle" aria-label="Lihat token">${ICON.eye}</button>
      </div>
    </div>
    <button class="btn" type="submit" id="tgAdd">${ICON.plus}<span>Add Token</span></button>
  </form>
  <div class="search-bar">
    <div class="search">
      <span class="ic">${ICON.search}</span>
      <input id="tgSearch" placeholder="Search tokens..." value="${esc(state.q)}">
    </div>
  </div>
  <div id="tgTable">${tableHtml(state.data.telegram, "tg")}</div>
</div>`;

const rawView = () => {
  const refsUrl = state.data.rawUrlRefs || (state.data.rawUrl ? state.data.rawUrl.replace(/\/(main|master)\//, "/refs/heads/$1/") : "");
  return `
<div class="card">
  ${hero("Database", "Raw file from the database repository")}
  ${statsHtml()}
  <div class="raw-info">
    ${ICON.info}
    <div>
      <strong>Target Repository:</strong> Link mengarah ke file <code>database.json</code> pada repository GitHub.
      Perubahan data langsung tersimpan di GitHub. Kedua format URL di bawah ini valid dan mengarah ke file yang sama. (Catatan: CDN publik GitHub Raw memiliki cache ~5 menit).
    </div>
  </div>
  <div class="field">
    <label>Raw URL (Format Standar)</label>
    <div class="inwrap">
      <span class="ic">${ICON.raw}</span>
      <input id="rawUrl" readonly value="${esc(state.data.rawUrl || "")}">
    </div>
  </div>
  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px">
    <button class="btn sm" id="copyRaw" style="flex:1;min-width:140px">${ICON.copy}<span>Salin Link</span></button>
    <a class="btn sm ghost" id="openRaw" href="${esc(state.data.rawUrl || "#")}" target="_blank" rel="noopener" style="flex:1;min-width:140px">${ICON.out}<span>Buka</span></a>
    <button class="btn sm ghost" id="refreshRaw" style="flex:1;min-width:140px">${ICON.refresh}<span>Muat Ulang</span></button>
  </div>

  <div class="field">
    <label>Raw URL (Format refs/heads)</label>
    <div class="inwrap">
      <span class="ic">${ICON.raw}</span>
      <input id="rawUrlRefs" readonly value="${esc(refsUrl)}">
    </div>
  </div>
  <div style="display:flex;gap:10px;flex-wrap:wrap">
    <button class="btn sm ghost" id="copyRawRefs" style="flex:1;min-width:140px">${ICON.copy}<span>Salin Link (refs/heads)</span></button>
    <a class="btn sm ghost" id="openRawRefs" href="${esc(refsUrl || "#")}" target="_blank" rel="noopener" style="flex:1;min-width:140px">${ICON.out}<span>Buka (refs/heads)</span></a>
  </div>

  <div class="field" style="margin-top:20px">
    <label>Isi database.json (Real-time Live)</label>
    <div class="rawbox" id="rawBody">memuat…</div>
  </div>
</div>`;
};

function tableHtml(items, type) {
  const q = state.q.trim().toLowerCase();
  const rows = q ? items.filter((it) => (type === "wa" ? it.number : it.token).toLowerCase().includes(q)) : items;

  if (!rows.length) {
    return `
    <div class="empty">
      <div class="empty-icon">${type === "wa" ? ICON.wa : ICON.tg}</div>
      <div>${items.length ? "Tidak ada hasil pencarian yang cocok." : "Belum ada data tersimpan."}</div>
    </div>`;
  }

  const head =
    type === "wa"
      ? "<th>Number</th><th>Status</th>"
      : "<th>Token</th><th>Status</th>";

  const body = rows
    .map((it) => {
      const cell =
        type === "wa"
          ? `<td class="num">${esc(it.number)}</td>`
          : `<td class="tok" data-tok="${esc(it.token)}">${mask(it.token)}</td>`;

      const extraCopy =
        type === "wa"
          ? `<button class="icon-btn copy" data-copy="${esc(it.number)}" title="Salin nomor">${ICON.copy}</button>`
          : `<button class="icon-btn copy" data-copy="${esc(it.token)}" title="Salin token">${ICON.copy}</button>`;

      return `
      <tr data-id="${esc(it.id)}">
        ${cell}
        <td><span class="pill">${esc(it.status || "active")}</span></td>
        <td class="act">
          <div class="table-acts">
            ${extraCopy}
            <button class="icon-btn del" data-act="del" title="Hapus">${ICON.trash}</button>
          </div>
        </td>
      </tr>`;
    })
    .join("");

  return `
  <div class="table-wrap">
    <table class="tbl">
      <thead><tr>${head}<th></th></tr></thead>
      <tbody>${body}</tbody>
    </table>
  </div>`;
}

function bind() {
  const waF = el("waForm");
  if (waF) {
    waF.onsubmit = async (e) => {
      e.preventDefault();
      const btn = el("waAdd");
      btn.disabled = true;
      btn.innerHTML = '<span class="spin"></span> Menyimpan';
      try {
        await api("whatsapp", { method: "POST", body: { number: el("waNum").value } });
        el("waNum").value = "";
        toast("Nomor berhasil ditambahkan ke database", "");
        await refresh();
      } catch (err) {
        toast(err.message, "err");
      } finally {
        btn.disabled = false;
        btn.innerHTML = `${ICON.plus}<span>Add Number</span>`;
      }
    };
  }

  const tgF = el("tgForm");
  if (tgF) {
    tgF.onsubmit = async (e) => {
      e.preventDefault();
      const btn = el("tgAdd");
      btn.disabled = true;
      btn.innerHTML = '<span class="spin"></span> Menyimpan';
      try {
        await api("telegram", { method: "POST", body: { token: el("tgTok").value } });
        el("tgTok").value = "";
        toast("Token berhasil ditambahkan ke database", "");
        await refresh();
      } catch (err) {
        toast(err.message, "err");
      } finally {
        btn.disabled = false;
        btn.innerHTML = `${ICON.plus}<span>Add Token</span>`;
      }
    };
  }

  const waS = el("waSearch");
  if (waS) {
    waS.oninput = () => {
      state.q = waS.value;
      el("waTable").innerHTML = tableHtml(state.data.whatsapp, "wa");
      bindTable();
    };
  }
  const tgS = el("tgSearch");
  if (tgS) {
    tgS.oninput = () => {
      state.q = tgS.value;
      el("tgTable").innerHTML = tableHtml(state.data.telegram, "tg");
      bindTable();
    };
  }

  const tgT = el("tgToggle");
  if (tgT) {
    tgT.onclick = () => {
      const i = el("tgTok");
      const show = i.type === "password";
      i.type = show ? "text" : "password";
      tgT.innerHTML = show ? ICON.eyeOff : ICON.eye;
    };
  }

  const copy = el("copyRaw");
  if (copy) {
    copy.onclick = async () => {
      const u = el("rawUrl").value;
      try {
        await navigator.clipboard.writeText(u);
        toast("Link Raw GitHub disalin ke clipboard", "");
      } catch {
        el("rawUrl").select();
        toast("Tekan Ctrl+C untuk menyalin", "");
      }
    };
  }

  const copyRefs = el("copyRawRefs");
  if (copyRefs) {
    copyRefs.onclick = async () => {
      const u = el("rawUrlRefs").value;
      try {
        await navigator.clipboard.writeText(u);
        toast("Link Raw (refs/heads) disalin", "");
      } catch {
        el("rawUrlRefs").select();
        toast("Tekan Ctrl+C untuk menyalin", "");
      }
    };
  }

  const refRaw = el("refreshRaw");
  if (refRaw) {
    refRaw.onclick = async () => {
      await refresh();
      await loadRaw();
      toast("Data diperbarui", "");
    };
  }

  bindTable();
}

function bindTable() {
  document.querySelectorAll("[data-act=del]").forEach((b) => {
    b.onclick = () => {
      const tr = b.closest("tr");
      const td = tr.querySelector("[data-tok]");
      const numTd = tr.querySelector(".num");
      const label = td ? td.dataset.tok : (numTd ? numTd.textContent : tr.dataset.id);
      confirmDelete(state.view === "whatsapp" ? "whatsapp" : "telegram", tr.dataset.id, label);
    };
  });

  document.querySelectorAll("[data-tok]").forEach((td) => {
    td.style.cursor = "pointer";
    td.title = "Klik untuk lihat / sembunyikan token";
    td.onclick = () => {
      const real = td.dataset.tok;
      td.textContent = td.textContent === real ? mask(real) : real;
    };
  });

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.onclick = async (e) => {
      e.stopPropagation();
      const val = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(val);
        toast("Disalin ke clipboard!", "");
      } catch {
        toast(`Data: ${val}`, "");
      }
    };
  });
}

/* ---------- Delete Confirmation ---------- */
function confirmDelete(route, id, label) {
  const m = el("modal");
  el("mTitle").textContent = "Hapus data?";
  el("mText").textContent = `${label} akan dihapus permanen dari database.`;
  m.classList.add("on");

  const close = (val) => {
    m.classList.remove("on");
    el("mYes").onclick = el("mNo").onclick = null;
    if (!val) return;
    api(`${route}?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      .then(async () => {
        toast("Data berhasil dihapus", "");
        await refresh();
      })
      .catch((err) => toast(err.message, "err"));
  };
  el("mYes").onclick = () => close(true);
  el("mNo").onclick = () => close(false);
}

async function refresh() {
  state.data = await api("data");
  const meta = el("rawMeta");
  if (meta) meta.textContent = state.data.rawUrl || "";
  render();
}

async function loadRaw() {
  const box = el("rawBody");
  if (!box) return;
  box.textContent = "Memuat data terbaru dari GitHub…";
  try {
    // Attempt live raw-data endpoint first (bypasses CDN cache delay)
    const direct = await api("raw-data").catch(() => null);
    if (direct) {
      box.textContent = JSON.stringify(direct, null, 2);
      return;
    }
    // Fallback to fetch rawUrl directly with cache-busting
    const fetchUrl = state.data.rawUrl ? `${state.data.rawUrl}?_t=${Date.now()}` : "";
    const res = await fetch(fetchUrl, { cache: "no-store" });
    if (res.ok) {
      const text = await res.text();
      try {
        box.textContent = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        box.textContent = text;
      }
    } else {
      box.textContent = JSON.stringify({ whatsapp: state.data.whatsapp, telegram: state.data.telegram }, null, 2);
    }
  } catch {
    box.textContent = JSON.stringify({ whatsapp: state.data.whatsapp, telegram: state.data.telegram }, null, 2);
  }
}

/* ---------- Authentication & Init ---------- */
el("pwToggle").onclick = () => {
  const i = el("pw");
  const show = i.type === "password";
  i.type = show ? "text" : "password";
  el("pwToggle").innerHTML = show ? ICON.eyeOff : ICON.eye;
};

el("loginForm").onsubmit = async (e) => {
  e.preventDefault();
  const btn = el("loginBtn");
  btn.disabled = true;
  btn.innerHTML = '<span class="spin"></span> Memproses';
  try {
    await api("login", { method: "POST", body: { password: el("pw").value } });
    await start();
  } catch (err) {
    toast(err.message, "err");
    el("pw").value = "";
  } finally {
    btn.disabled = false;
    btn.innerHTML = `${ICON.login}<span>Masuk</span>`;
  }
};

el("logout").onclick = async () => {
  await api("logout", { method: "POST" }).catch(() => {});
  location.reload();
};

async function start() {
  el("login").classList.add("hidden");
  await refresh();
  setView("whatsapp");
}

(async () => {
  const me = await api("me").catch(() => ({ authenticated: false }));
  if (me.authenticated) {
    await start();
  } else {
    el("pw").focus();
  }
})();
