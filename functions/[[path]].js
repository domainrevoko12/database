// Cloudflare Pages Function: API + SPA shell
const te = new TextEncoder();
const td = new TextDecoder();

const SHELL = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<title>Database</title>
<link rel="icon" href="data:,">
</head>
<body>
<div id="app"></div>
<script type="module" src="/app.js"></script>
</body>
</html>`;

const b64 = (str) => {
  const bytes = te.encode(str);
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};
const unb64 = (str) => td.decode(Uint8Array.from(atob(str), (c) => c.charCodeAt(0)));
const b64u = (bytes) => {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const unb64u = (s) => {
  let x = s.replace(/-/g, "+").replace(/_/g, "/");
  while (x.length % 4) x += "=";
  return Uint8Array.from(atob(x), (c) => c.charCodeAt(0));
};

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}

const html = () =>
  new Response(SHELL, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });

function ctEq(a, b) {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a[i] ^ b[i];
  return x === 0;
}

const secret = (env) => env.SESSION_SECRET || env.ADMIN_PASSWORD || "";

async function sign(key, payload) {
  const k = await crypto.subtle.importKey("raw", te.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64u(new Uint8Array(await crypto.subtle.sign("HMAC", k, te.encode(payload))));
}

async function passwordOk(env, given) {
  if (!env.ADMIN_PASSWORD) return false;
  const a = new Uint8Array(await crypto.subtle.digest("SHA-256", te.encode(String(given))));
  const b = new Uint8Array(await crypto.subtle.digest("SHA-256", te.encode(String(env.ADMIN_PASSWORD))));
  return ctEq(a, b);
}

async function newSession(env) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8;
  const payload = b64u(te.encode(JSON.stringify({ exp })));
  return `${payload}.${await sign(secret(env), payload)}`;
}

async function checkSession(env, request) {
  const raw = (request.headers.get("Cookie") || "")
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("session="))
    ?.slice(8);
  if (!raw) return false;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return false;
  const want = await sign(secret(env), payload);
  if (sig.length !== want.length) return false;
  if (!ctEq(te.encode(sig), te.encode(want))) return false;
  try {
    const { exp } = JSON.parse(td.decode(unb64u(payload)));
    return exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

const setCookie = (value, request) =>
  `session=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;

/* ---------- GitHub storage ---------- */
const cfg = (env) => {
  const owner = env.GITHUB_REPO_USERNAME;
  const repo = env.GITHUB_REPO_NAME;
  if (!owner || !repo || !env.GITHUB_TOKEN) throw new Error("Konfigurasi GitHub belum lengkap (GITHUB_TOKEN / GITHUB_REPO_USERNAME / GITHUB_REPO_NAME)");
  return { owner, repo, path: env.GITHUB_FILE_PATH || "database.json", branch: env.GITHUB_BRANCH || "main" };
};

const rawUrl = (env) => {
  const c = cfg(env);
  return `https://raw.githubusercontent.com/${c.owner}/${c.repo}/${c.branch}/${c.path}`;
};

const ghHeaders = (env) => ({
  accept: "application/vnd.github+json",
  authorization: `Bearer ${env.GITHUB_TOKEN}`,
  "x-github-api-version": "2022-11-28",
  "user-agent": "add-database",
});

async function readDb(env) {
  const c = cfg(env);
  const url = `https://api.github.com/repos/${c.owner}/${c.repo}/contents/${c.path}?ref=${encodeURIComponent(c.branch)}`;
  const res = await fetch(url, { headers: ghHeaders(env) });
  if (res.status === 404) return { data: { whatsapp: [], telegram: [] }, sha: null };
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${(await res.text()).slice(0, 160)}`);
  const j = await res.json();
  const data = JSON.parse(unb64(j.content.replace(/\s/g, "")));
  return {
    data: { whatsapp: data.whatsapp ?? [], telegram: data.telegram ?? [] },
    sha: j.sha,
  };
}

async function writeDb(env, data, sha, message) {
  const c = cfg(env);
  const body = { message, content: b64(JSON.stringify(data, null, 2)), branch: c.branch };
  if (sha) body.sha = sha;
  const res = await fetch(`https://api.github.com/repos/${c.owner}/${c.repo}/contents/${c.path}`, {
    method: "PUT",
    headers: { ...ghHeaders(env), "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = new Error(`GitHub ${res.status}: ${(await res.text()).slice(0, 160)}`);
    err.status = res.status;
    throw err;
  }
}

async function mutate(env, fn, message) {
  for (let i = 0; i < 3; i++) {
    const { data, sha } = await readDb(env);
    const next = fn(data);
    if (!next) {
      const e = new Error("Data tidak ditemukan");
      e.status = 404;
      throw e;
    }
    try {
      await writeDb(env, next, sha, message);
      return next;
    } catch (err) {
      if (err.status === 409 && i < 2) continue; // retry once on sha conflict
      throw err;
    }
  }
}

/* ---------- API ---------- */
async function api(request, env, url) {
  const route = url.pathname.replace(/^\/api\//, "");
  const method = request.method;

  if (route === "login" && method === "POST") {
    const { password } = await request.json().catch(() => ({}));
    if (!(await passwordOk(env, password))) return json({ error: "Password salah" }, 401);
    return json({ ok: true }, 200, { "set-cookie": setCookie(await newSession(env), request) });
  }
  if (route === "logout" && method === "POST") {
    return json({ ok: true }, 200, { "set-cookie": setCookie("", request).replace("Max-Age=28800", "Max-Age=0") });
  }
  if (route === "me" && method === "GET") return json({ authenticated: await checkSession(env, request) });

  if (!(await checkSession(env, request))) return json({ error: "Unauthorized" }, 401);

  if (route === "data" && method === "GET") {
    const { data } = await readDb(env);
    return json({ whatsapp: data.whatsapp, telegram: data.telegram, rawUrl: rawUrl(env) });
  }

  if (route === "whatsapp" && method === "POST") {
    const { number } = await request.json().catch(() => ({}));
    const num = String(number ?? "").replace(/[\s()-]/g, "");
    if (!/^\+?\d{7,15}$/.test(num)) return json({ error: "Nomor WhatsApp tidak valid" }, 400);
    const entry = { id: crypto.randomUUID(), number: num, status: "active", createdAt: new Date().toISOString() };
    await mutate(env, (d) => ({ ...d, whatsapp: [...d.whatsapp, entry] }), `add whatsapp ${num}`);
    return json({ ok: true, entry });
  }
  if (route === "whatsapp" && method === "DELETE") {
    const id = url.searchParams.get("id");
    await mutate(env, (d) => {
      const list = d.whatsapp.filter((x) => x.id !== id);
      return list.length === d.whatsapp.length ? null : { ...d, whatsapp: list };
    }, `delete whatsapp ${id}`);
    return json({ ok: true });
  }

  if (route === "telegram" && method === "POST") {
    const { token } = await request.json().catch(() => ({}));
    const tok = String(token ?? "").trim();
    if (tok.length < 10) return json({ error: "Token Telegram tidak valid" }, 400);
    const entry = { id: crypto.randomUUID(), token: tok, status: "active", createdAt: new Date().toISOString() };
    await mutate(env, (d) => ({ ...d, telegram: [...d.telegram, entry] }), "add telegram token");
    return json({ ok: true, entry });
  }
  if (route === "telegram" && method === "DELETE") {
    const id = url.searchParams.get("id");
    await mutate(env, (d) => {
      const list = d.telegram.filter((x) => x.id !== id);
      return list.length === d.telegram.length ? null : { ...d, telegram: list };
    }, `delete telegram ${id}`);
    return json({ ok: true });
  }

  return json({ error: "Not found" }, 404);
}

export async function onRequest({ request, env, params }) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path.startsWith("/api/")) {
    try {
      return await api(request, env, url);
    } catch (err) {
      return json({ error: err.message || "Server error" }, err.status === 404 ? 404 : 500);
    }
  }

  // static asset (app.js) — ASSETS binding bawaan Pages
  const last = path.split("/").pop() || "";
  if (last.includes(".")) {
    try {
      const res = await env.ASSETS.fetch(request);
      if (res.status !== 404) return res;
    } catch {}
    return new Response("Not found", { status: 404 });
  }
  return html();
}
