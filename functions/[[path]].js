// Cloudflare Pages Function: API + SPA shell
const te = new TextEncoder();
const td = new TextDecoder();

const SHELL = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
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

const secret = (env) =>
  env.SESSION_SECRET || env.SECRET || env.ADMIN_PASSWORD || env.PW_ADMIN_LOGIN || "cf-pages-db-secret-session-key";

async function sign(key, payload) {
  const k = await crypto.subtle.importKey("raw", te.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64u(new Uint8Array(await crypto.subtle.sign("HMAC", k, te.encode(payload))));
}

async function passwordOk(env, given) {
  const pw = env.ADMIN_PASSWORD || env.PW_ADMIN_LOGIN || env.PASSWORD || "";
  if (!pw) return false;
  const a = new Uint8Array(await crypto.subtle.digest("SHA-256", te.encode(String(given))));
  const b = new Uint8Array(await crypto.subtle.digest("SHA-256", te.encode(String(pw))));
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

/* ---------- GitHub storage configuration ---------- */
const isPlaceholder = (val) =>
  !val || val === "username-repo-database" || val === "nama-repo-database";

const cfg = (env) => {
  const rawOwner = env.GITHUB_REPO_USERNAME || env.GITHUB_OWNER || env.GITHUB_USER || env.OWNER || "";
  const rawRepo = env.GITHUB_REPO_NAME || env.GITHUB_REPO || env.REPO || "";

  // Fallback to actual repo "domainrevoko12/database" if empty or placeholder
  const owner = isPlaceholder(rawOwner) ? "domainrevoko12" : rawOwner;
  const repo = isPlaceholder(rawRepo) ? "database" : rawRepo;
  const token = env.GITHUB_TOKEN || env.GH_TOKEN || env.TOKEN || "";
  const path = env.GITHUB_FILE_PATH || env.FILE_PATH || "database.json";
  const branch = env.GITHUB_BRANCH || env.BRANCH || "main";

  return { owner, repo, token, path, branch };
};

const rawUrl = (env) => {
  const c = cfg(env);
  return `https://raw.githubusercontent.com/${c.owner}/${c.repo}/${c.branch}/${c.path}`;
};

const rawUrlRefs = (env) => {
  const c = cfg(env);
  return `https://raw.githubusercontent.com/${c.owner}/${c.repo}/refs/heads/${c.branch}/${c.path}`;
};

const ghHeaders = (env) => {
  const c = cfg(env);
  const h = {
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
    "user-agent": "add-database",
  };
  if (c.token) {
    h.authorization = `Bearer ${c.token}`;
  }
  return h;
};

function parseDbContent(rawText) {
  let parsed = null;
  try {
    if (rawText && rawText.trim()) parsed = JSON.parse(rawText);
  } catch {}

  let whatsapp = [];
  let telegram = [];

  if (Array.isArray(parsed)) {
    // Legacy array format compatibility
    whatsapp = parsed.map((item, idx) => ({
      id: item.id || `wa-${idx}-${Date.now()}`,
      number: typeof item === "string" ? item : item.number || "",
      status: item.status || "active",
      createdAt: item.createdAt || new Date().toISOString(),
    }));
  } else if (parsed && typeof parsed === "object") {
    if (Array.isArray(parsed.whatsapp)) {
      whatsapp = parsed.whatsapp.map((item, idx) => ({
        id: item.id || `wa-${idx}-${Date.now()}`,
        number: typeof item === "string" ? item : item.number || "",
        status: item.status || "active",
        createdAt: item.createdAt || new Date().toISOString(),
      }));
    }
    if (Array.isArray(parsed.telegram)) {
      telegram = parsed.telegram.map((item, idx) => ({
        id: item.id || `tg-${idx}-${Date.now()}`,
        token: typeof item === "string" ? item : item.token || "",
        status: item.status || "active",
        createdAt: item.createdAt || new Date().toISOString(),
      }));
    }
  }

  return { whatsapp, telegram };
}

async function readDb(env) {
  const c = cfg(env);

  if (!c.token) {
    // If no token is provided, attempt to fetch from public raw URL as fallback
    try {
      const publicRes = await fetch(rawUrl(env), { cache: "no-store" });
      if (publicRes.ok) {
        const text = await publicRes.text();
        return { data: parseDbContent(text), sha: null };
      }
    } catch {}
    throw new Error("Konfigurasi GITHUB_TOKEN belum diatur pada environment variables.");
  }

  const url = `https://api.github.com/repos/${c.owner}/${c.repo}/contents/${c.path}?ref=${encodeURIComponent(c.branch)}`;
  const res = await fetch(url, { headers: ghHeaders(env) });
  if (res.status === 404) return { data: { whatsapp: [], telegram: [] }, sha: null };
  if (!res.ok) {
    const txt = await res.text();
    let msg = txt.slice(0, 160);
    try { msg = JSON.parse(txt).message || msg; } catch {}
    throw new Error(`GitHub ${res.status}: ${msg}`);
  }
  const j = await res.json();
  const rawText = unb64((j.content || "").replace(/\s/g, ""));
  return {
    data: parseDbContent(rawText),
    sha: j.sha,
  };
}

async function writeDb(env, data, sha, message) {
  const c = cfg(env);
  if (!c.token) {
    throw new Error("GITHUB_TOKEN belum diatur. Tambahkan GITHUB_TOKEN di environment variables Cloudflare.");
  }
  const body = { message, content: b64(JSON.stringify(data, null, 2)), branch: c.branch };
  if (sha) body.sha = sha;
  const res = await fetch(`https://api.github.com/repos/${c.owner}/${c.repo}/contents/${c.path}`, {
    method: "PUT",
    headers: { ...ghHeaders(env), "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    let msg = txt.slice(0, 160);
    try { msg = JSON.parse(txt).message || msg; } catch {}
    const err = new Error(`GitHub ${res.status}: ${msg}`);
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
      if (err.status === 409 && i < 2) {
        // Exponential backoff for sha conflict
        await new Promise((r) => setTimeout(r, 400 * (i + 1)));
        continue;
      }
      throw err;
    }
  }
}

function cleanWaNumber(raw) {
  let s = String(raw || "").trim();
  s = s.replace(/[\s().-]/g, "");
  if (s.startsWith("+")) s = s.slice(1);
  return s;
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
    return json({
      whatsapp: data.whatsapp,
      telegram: data.telegram,
      rawUrl: rawUrl(env),
      rawUrlRefs: rawUrlRefs(env),
      config: {
        owner: cfg(env).owner,
        repo: cfg(env).repo,
        path: cfg(env).path,
        branch: cfg(env).branch,
      },
    });
  }

  if (route === "raw-data" && method === "GET") {
    const { data } = await readDb(env);
    return json(data);
  }

  if (route === "debug" && method === "GET") {
    const c = cfg(env);
    const probe = async (u, init) => {
      try {
        const r = await fetch(u, init);
        const t = await r.text();
        let j = null;
        try { j = JSON.parse(t); } catch {}
        return { status: r.status, message: j?.message, permissions: j?.permissions, sha: j?.sha };
      } catch (e) {
        return { status: 0, message: e.message };
      }
    };
    return json({
      config: { owner: c.owner, repo: c.repo, path: c.path, branch: c.branch, hasToken: !!c.token },
      rawUrl: rawUrl(env),
      repo: await probe(`https://api.github.com/repos/${c.owner}/${c.repo}`, { headers: ghHeaders(env) }),
      file: await probe(
        `https://api.github.com/repos/${c.owner}/${c.repo}/contents/${c.path}?ref=${encodeURIComponent(c.branch)}`,
        { headers: ghHeaders(env) },
      ),
      raw: await probe(rawUrl(env), { method: "HEAD" }),
    });
  }

  if (route === "whatsapp" && method === "POST") {
    const body = await request.json().catch(() => ({}));
    const rawInput = body.numbers || body.number || "";
    const items = String(rawInput)
      .split(/[\r\n,;]+/)
      .map(cleanWaNumber)
      .filter(Boolean);

    if (items.length === 0) {
      return json({ error: "Nomor WhatsApp tidak valid" }, 400);
    }

    const invalid = items.filter((n) => !/^\d{7,16}$/.test(n));
    if (invalid.length > 0 && items.length === 1) {
      return json({ error: "Nomor WhatsApp tidak valid" }, 400);
    }

    const validItems = items.filter((n) => /^\d{7,16}$/.test(n));
    if (validItems.length === 0) {
      return json({ error: "Nomor WhatsApp tidak valid" }, 400);
    }

    const newEntries = validItems.map((num) => ({
      id: crypto.randomUUID(),
      number: num,
      status: "active",
      createdAt: new Date().toISOString(),
    }));

    await mutate(env, (d) => {
      const existing = new Set(d.whatsapp.map((w) => w.number));
      const toAdd = newEntries.filter((e) => !existing.has(e.number));
      return { ...d, whatsapp: [...d.whatsapp, ...toAdd] };
    }, `add whatsapp (${validItems.length} items)`);

    return json({ ok: true, count: newEntries.length, entry: newEntries[0], entries: newEntries });
  }

  if (route === "whatsapp" && method === "DELETE") {
    const id = url.searchParams.get("id");
    await mutate(env, (d) => {
      const list = d.whatsapp.filter((x) => x.id !== id && x.number !== id);
      return list.length === d.whatsapp.length ? null : { ...d, whatsapp: list };
    }, `delete whatsapp ${id}`);
    return json({ ok: true });
  }

  if (route === "telegram" && method === "POST") {
    const body = await request.json().catch(() => ({}));
    const rawInput = body.tokens || body.token || "";
    const items = String(rawInput)
      .split(/[\r\n,;]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    if (items.length === 0) {
      return json({ error: "Token Telegram tidak valid" }, 400);
    }

    const validItems = items.filter((t) => t.length >= 10);
    if (validItems.length === 0) {
      return json({ error: "Token Telegram tidak valid" }, 400);
    }

    const newEntries = validItems.map((tok) => ({
      id: crypto.randomUUID(),
      token: tok,
      status: "active",
      createdAt: new Date().toISOString(),
    }));

    await mutate(env, (d) => {
      const existing = new Set(d.telegram.map((t) => t.token));
      const toAdd = newEntries.filter((e) => !existing.has(e.token));
      return { ...d, telegram: [...d.telegram, ...toAdd] };
    }, `add telegram (${validItems.length} items)`);

    return json({ ok: true, count: newEntries.length, entry: newEntries[0], entries: newEntries });
  }

  if (route === "telegram" && method === "DELETE") {
    const id = url.searchParams.get("id");
    await mutate(env, (d) => {
      const list = d.telegram.filter((x) => x.id !== id && x.token !== id);
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
