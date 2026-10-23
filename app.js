/* Add Database — frontend SPA (vanilla, no build) */

const CSS = `
:root{
  --bg:#eef1f7;--card:#fff;--ink:#1e293b;--mut:#64748b;--line:#e6eaf2;
  --pri:#4f46e5;--pri-d:#4338ca;--pri-soft:#eef2ff;--pri-ink:#4f46e5;
  --ok-bg:#dcfce7;--ok-ink:#15803d;--danger:#dc2626;
}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%}
body{background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased}
button{font:inherit;color:inherit;cursor:pointer;border:0;background:none}
input{font:inherit}
svg{display:block}

.topbar{position:fixed;inset:0 0 auto 0;height:60px;display:flex;align-items:center;gap:12px;padding:0 14px;background:rgba(255,255,255,.9);backdrop-filter:blur(8px);border-bottom:1px solid var(--line);z-index:40}
.burger{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:#fff;border:1px solid var(--line);box-shadow:0 1px 2px rgba(15,23,42,.06)}
.burger:hover{border-color:var(--pri)}
.topbar .t{font-weight:700;font-size:16px}
.topbar .sp{flex:1}
.counter{font-size:12.5px;color:var(--mut);background:#fff;border:1px solid var(--line);padding:5px 11px;border-radius:999px}

#scrim{position:fixed;inset:0;background:rgba(15,23,42,.45);opacity:0;pointer-events:none;transition:.22s;z-index:45}
#scrim.on{opacity:1;pointer-events:auto}
aside{position:fixed;top:0;left:0;bottom:0;width:284px;max-width:86vw;background:#fff;border-right:1px solid var(--line);transform:translateX(-102%);transition:transform .24s ease;z-index:50;display:flex;flex-direction:column;box-shadow:0 0 40px rgba(15,23,42,.12)}
aside.on{transform:none}
aside .head{padding:16px 16px 14px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:10px}
aside .head b{font-size:15.5px}
aside .head .sp{flex:1}
.x-btn{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;color:var(--mut);border:1px solid var(--line);background:#fff}
.x-btn:hover{color:var(--ink);border-color:#cbd5e1}
nav{padding:10px;display:flex;flex-direction:column;gap:4px;overflow:auto}
nav button{display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:11px;color:var(--mut);text-align:left;font-weight:500;width:100%}
nav button:hover{background:#f1f5f9;color:var(--ink)}
nav button.active{background:var(--pri-soft);color:var(--pri-ink)}
aside .foot{margin-top:auto;padding:12px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:8px}
aside .foot .meta{font-size:11.5px;color:var(--mut);word-break:break-all;line-height:1.4}

main{padding:84px 16px 48px;max-width:820px;margin:0 auto}
.card{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:22px 18px;margin-bottom:18px;box-shadow:0 1px 3px rgba(15,23,42,.05)}
.hero{text-align:center;padding:8px 0 20px}
.hero .logo{width:54px;height:54px;margin:0 auto 12px;border-radius:16px;display:grid;place-items:center;background:var(--pri-soft);color:var(--pri)}
.hero h1{margin:0;font-size:30px;font-weight:800;letter-spacing:-.4px}
.hero p{margin:6px 0 0;color:var(--mut);font-size:15px}
h2.sect{margin:0 0 12px;font-size:17px;font-weight:700}

.field{display:flex;flex-direction:column;gap:7px;margin-bottom:12px}
label{font-size:13px;color:var(--mut);font-weight:500}
.inwrap{position:relative;display:flex;align-items:center}
.inwrap .ic{position:absolute;left:14px;color:#94a3b8;pointer-events:none}
.inwrap input{width:100%;padding:13px 14px 13px 44px;border:1px solid #dde3ee;border-radius:13px;background:#fff;color:var(--ink);outline:none;font-size:15px}
.inwrap input:focus{border-color:var(--pri);box-shadow:0 0 0 3px rgba(79,70,229,.12)}
.inwrap .toggle{position:absolute;right:12px;color:#94a3b8;padding:4px}
.inwrap .toggle:hover{color:var(--ink)}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:14px 18px;border-radius:13px;background:var(--pri);color:#fff;font-weight:600;font-size:15.5px;width:100%;box-shadow:0 6px 16px rgba(79,70,229,.22)}
.btn:hover{background:var(--pri-d)}
.btn:disabled{opacity:.6;cursor:not-allowed}
.btn.sm{padding:9px 14px;font-size:14px;width:auto;box-shadow:none;border-radius:11px}
.btn.ghost{background:#fff;color:var(--ink);border:1px solid #dde3ee;box-shadow:none}
.btn.ghost:hover{background:#f8fafc;border-color:#cbd5e1}
.btn.danger{background:var(--danger);box-shadow:none}
.btn.danger:hover{background:#b91c1c}

.search{position:relative;margin:18px 0 12px}
.search .ic{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#94a3b8}
.search input{width:100%;padding:13px 14px 13px 44px;border:1px solid #dde3ee;border-radius:13px;background:#fff;color:var(--ink);outline:none;font-size:15px}
.search input:focus{border-color:var(--pri);box-shadow:0 0 0 3px rgba(79,70,229,.12)}

.tbl{width:100%;border-collapse:collapse;overflow:hidden;border:1px solid var(--line);border-radius:14px}
.tbl th{background:var(--pri-soft);color:var(--pri-ink);font-weight:700;text-align:left;padding:13px 16px;font-size:14.5px}
.tbl td{padding:15px 16px;border-top:1px solid var(--line);font-size:15px;vertical-align:middle}
.tbl tbody tr:hover{background:#fafbff}
.tbl .num{font-variant-numeric:tabular-nums;font-weight:500}
.tbl .tok{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13.5px;word-break:break-all}
.tbl td.act{width:52px;text-align:right}
.pill{display:inline-block;padding:5px 14px;border-radius:999px;background:var(--ok-bg);color:var(--ok-ink);font-weight:600;font-size:13.5px}
.icon-btn{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:10px;color:#94a3b8;border:1px solid transparent}
.icon-btn:hover{color:#fff;background:var(--danger)}
.empty{padding:34px 16px;text-align:center;color:var(--mut);font-size:14px;border:1px dashed #d8dfec;border-radius:14px}
.note{font-size:12.5px;color:var(--mut);margin-top:2px}
.rawbox{border:1px solid var(--line);border-radius:14px;padding:14px;background:#fbfcff;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;white-space:pre-wrap;word-break:break-all;max-height:340px;overflow:auto}

.modal{position:fixed;inset:0;z-index:70;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(15,23,42,.5)}
.modal.on{display:flex}
.modal-card{background:#fff;border-radius:18px;padding:24px;max-width:380px;width:100%;box-shadow:0 20px 50px rgba(15,23,42,.25)}
.modal-card h3{margin:0 0 8px;font-size:18px}
.modal-card p{margin:0 0 20px;color:var(--mut);font-size:14.5px}
.modal-card .acts{display:flex;gap:10px}
.modal-card .acts .btn{width:auto;flex:1}

#toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,16px);background:#1e293b;color:#fff;padding:11px 18px;border-radius:12px;opacity:0;transition:.2s;pointer-events:none;z-index:80;font-size:14px;box-shadow:0 10px 30px rgba(15,23,42,.25)}
#toast.on{opacity:1;transform:translate(-50%,0)}
#toast.err{background:var(--danger)}

#login{position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:18px;background:var(--bg)}
#login .card{width:min(400px,100%);margin:0}
#login .hero{margin-bottom:18px}
.spin{display:inline-block;width:15px;height:15px;border:2px solid #ffffff59;border-top-color:#fff;border-radius:50%;animation:sp .7s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.hidden{display:none!important}
`;

const ICON = {
  burger: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  close: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  db: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v13c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-13"/><path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/></svg>',
  lock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  eye: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 3l18 18"/><path d="M10.6 6.1A9.9 9.9 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.3 4"/><path d="M6.3 8.2A16.8 16.8 0 0 0 2 12s3.6 6 10 6a10 10 0 0 0 4-.8"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>',
  login: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10 4 15l5 5"/><path d="M4 15h11a5 5 0 0 0 5-5V6"/></svg>',
  plus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  trash: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/></svg>',
  wa: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 21l2.3-5.1A8.4 8.4 0 1 1 21 11.5Z"/></svg>',
  tg: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m21 4-3 16-6-4-3 3v-4.5L21 4Z"/><path d="m9 14.5 5-4"/></svg>',
  raw: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6 3 12l5 6"/><path d="m16 6 5 6-5 6"/></svg>',
  out: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
};

const el = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const mask = (t) => (t.length > 12 ? t.slice(0, 7) + "••••••" + t.slice(-4) : "••••••");

const state = { view: "whatsapp", q: "", data: { whatsapp: [], telegram: [], rawUrl: "" } };

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
  toastTimer = setTimeout(() => (t.className = kind), 2600);
}

/* ---------- Layout ---------- */
document.head.insertAdjacentHTML("beforeend", `<style>${CSS}</style>`);

document.body.innerHTML = `
<header class="topbar">
  <button class="burger" id="burger" aria-label="Menu">${ICON.burger}</button>
  <span class="t">Database</span>
  <span class="sp"></span>
  <span class="counter" id="counter">0 item</span>
</header>
<div id="scrim"></div>
<aside id="side">
  <div class="head">
    <b>Database</b><span class="sp"></span>
    <button class="x-btn" id="closeSide" aria-label="Tutup">${ICON.close}</button>
  </div>
  <nav>
    <button data-view="whatsapp">${ICON.wa}<span>Whatsapp Number</span></button>
    <button data-view="telegram">${ICON.tg}<span>Telegram Token</span></button>
    <button data-view="raw">${ICON.raw}<span>Github Raw</span></button>
  </nav>
  <div class="foot">
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

/* ---------- Sidebar ---------- */
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

/* ---------- Views ---------- */
function render() {
  const m = el("main");
  m.innerHTML = state.view === "whatsapp" ? waView() : state.view === "telegram" ? tgView() : rawView();
  const total = state.data.whatsapp.length + state.data.telegram.length;
  el("counter").textContent = `${total} item`;
  bind();
}

const hero = (title, sub) => `
<div class="hero">
  <div class="logo">${ICON.db}</div>
  <h1>${title}</h1>
  <p>${sub}</p>
</div>`;

const waView = () => `
<div class="card">
  ${hero("Database", "Add and check your registered numbers")}
  <form id="waForm">
    <div class="field">
      <label for="waNum">Phone Number</label>
      <div class="inwrap">
        <span class="ic">${ICON.wa}</span>
        <input id="waNum" placeholder="Enter phone number" required>
      </div>
    </div>
    <button class="btn" type="submit" id="waAdd">${ICON.plus}<span>Add Number</span></button>
  </form>
  <div class="search">
    <span class="ic">${ICON.search}</span>
    <input id="waSearch" placeholder="Search numbers..." value="${esc(state.q)}">
  </div>
  <div id="waTable">${tableHtml(state.data.whatsapp, "wa")}</div>
</div>`;

const tgView = () => `
<div class="card">
  ${hero("Database", "Add and check your registered tokens")}
  <form id="tgForm">
    <div class="field">
      <label for="tgTok">Telegram Token</label>
      <div class="inwrap">
        <span class="ic">${ICON.tg}</span>
        <input id="tgTok" placeholder="Enter bot token" required>
        <button type="button" class="toggle" id="tgToggle" aria-label="Lihat token">${ICON.eye}</button>
      </div>
    </div>
    <button class="btn" type="submit" id="tgAdd">${ICON.plus}<span>Add Token</span></button>
  </form>
  <div class="search">
    <span class="ic">${ICON.search}</span>
    <input id="tgSearch" placeholder="Search tokens..." value="${esc(state.q)}">
  </div>
  <div id="tgTable">${tableHtml(state.data.telegram, "tg")}</div>
</div>`;

const rawView = () => `
<div class="card">
  ${hero("Database", "Raw file from the database repository")}
  <div class="field">
    <label>Raw URL</label>
    <div class="inwrap">
      <span class="ic">${ICON.raw}</span>
      <input id="rawUrl" readonly value="${esc(state.data.rawUrl || "")}">
    </div>
  </div>
  <div style="display:flex;gap:10px">
    <button class="btn sm" id="copyRaw" style="flex:1">Salin Link</button>
    <a class="btn sm ghost" id="openRaw" href="${esc(state.data.rawUrl || "#")}" target="_blank" rel="noopener" style="flex:1">${ICON.out}<span>Buka</span></a>
  </div>
  <div class="field" style="margin-top:18px">
    <label>Isi database.json</label>
    <div class="rawbox" id="rawBody">memuat…</div>
  </div>
</div>`;

function tableHtml(items, type) {
  const q = state.q.trim().toLowerCase();
  const rows = q ? items.filter((it) => (type === "wa" ? it.number : it.token).toLowerCase().includes(q)) : items;
  if (!rows.length) return `<div class="empty">${items.length ? "Tidak ada hasil." : "Belum ada data."}</div>`;
  const head = type === "wa" ? "<th>Number</th><th>Status</th>" : "<th>Token</th><th>Status</th>";
  const body = rows
    .map((it) => {
      const cell =
        type === "wa"
          ? `<td class="num">${esc(it.number)}</td>`
          : `<td class="tok" data-tok="${esc(it.token)}">${mask(it.token)}</td>`;
      return `<tr data-id="${esc(it.id)}">${cell}<td><span class="pill">${esc(it.status || "active")}</span></td>
        <td class="act"><button class="icon-btn" data-act="del" title="Hapus">${ICON.trash}</button></td></tr>`;
    })
    .join("");
  return `<table class="tbl"><thead><tr>${head}<th></th></tr></thead><tbody>${body}</tbody></table>`;
}

function bind() {
  const waF = el("waForm");
  if (waF)
    waF.onsubmit = async (e) => {
      e.preventDefault();
      const btn = el("waAdd");
      btn.disabled = true;
      try {
        await api("whatsapp", { method: "POST", body: { number: el("waNum").value } });
        el("waNum").value = "";
        toast("Nomor ditambahkan", "");
        await refresh();
      } catch (err) {
        toast(err.message, "err");
      } finally {
        btn.disabled = false;
      }
    };

  const tgF = el("tgForm");
  if (tgF)
    tgF.onsubmit = async (e) => {
      e.preventDefault();
      const btn = el("tgAdd");
      btn.disabled = true;
      try {
        await api("telegram", { method: "POST", body: { token: el("tgTok").value } });
        el("tgTok").value = "";
        toast("Token ditambahkan", "");
        await refresh();
      } catch (err) {
        toast(err.message, "err");
      } finally {
        btn.disabled = false;
      }
    };

  const waS = el("waSearch");
  if (waS)
    waS.oninput = () => {
      state.q = waS.value;
      el("waTable").innerHTML = tableHtml(state.data.whatsapp, "wa");
      bindTable();
    };
  const tgS = el("tgSearch");
  if (tgS)
    tgS.oninput = () => {
      state.q = tgS.value;
      el("tgTable").innerHTML = tableHtml(state.data.telegram, "tg");
      bindTable();
    };

  const tgT = el("tgToggle");
  if (tgT)
    tgT.onclick = () => {
      const i = el("tgTok");
      const show = i.type === "password";
      i.type = show ? "text" : "password";
      tgT.innerHTML = show ? ICON.eyeOff : ICON.eye;
    };

  const copy = el("copyRaw");
  if (copy)
    copy.onclick = async () => {
      try {
        await navigator.clipboard.writeText(el("rawUrl").value);
        toast("Link disalin", "");
      } catch {
        el("rawUrl").select();
        toast("Tekan Ctrl+C untuk menyalin", "");
      }
    };

  bindTable();
}

function bindTable() {
  document.querySelectorAll("[data-act=del]").forEach((b) => {
    b.onclick = () => {
      const tr = b.closest("tr");
      const td = tr.querySelector("[data-tok]");
      const label = td ? td.dataset.tok : tr.querySelector(".num").textContent;
      confirmDelete(state.view === "whatsapp" ? "whatsapp" : "telegram", tr.dataset.id, label);
    };
  });
  document.querySelectorAll("[data-tok]").forEach((td) => {
    td.style.cursor = "pointer";
    td.title = "Klik untuk lihat / sembunyikan";
    td.onclick = () => {
      const real = td.dataset.tok;
      td.textContent = td.textContent === real ? mask(real) : real;
    };
  });
}

/* ---------- Hapus + konfirmasi ---------- */
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
        toast("Dihapus", "");
        await refresh();
      })
      .catch((err) => toast(err.message, "err"));
  };
  el("mYes").onclick = () => close(true);
  el("mNo").onclick = () => close(false);
}

async function refresh() {
  state.data = await api("data");
  el("rawMeta").textContent = state.data.rawUrl || "";
  render();
}

async function loadRaw() {
  const box = el("rawBody");
  if (!box) return;
  try {
    const res = await fetch(state.data.rawUrl, { cache: "no-store" });
    box.textContent = await res.text();
  } catch {
    box.textContent = "Gagal memuat file.";
  }
}

/* ---------- Auth ---------- */
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
  if (me.authenticated) await start();
  else el("pw").focus();
})();
