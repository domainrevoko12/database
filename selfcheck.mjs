// Self-check: node test.mjs  (tanpa framework, tanpa dependency)
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

if (!globalThis.crypto) globalThis.crypto = webcrypto;

const mod = await import(pathToFileURL(fileURLToPath(new URL("./functions/[[path]].js", import.meta.url))).href);
const { onRequest } = mod;

/* ---- stub GitHub API ---- */
let stored = { whatsapp: [], telegram: [] };
let lastPut = null;

const realFetch = globalThis.fetch;
globalThis.fetch = async (url, opts = {}) => {
  const u = String(url);
  if (u.startsWith("https://api.github.com/")) {
    if (opts.method === "PUT") {
      lastPut = JSON.parse(opts.body);
      stored = JSON.parse(Buffer.from(lastPut.content, "base64").toString());
      return new Response(JSON.stringify({ content: {} }), { status: 200 });
    }
    const content = Buffer.from(JSON.stringify(stored)).toString("base64");
    return new Response(JSON.stringify({ content, sha: "sha-1" }), { status: 200 });
  }
  return realFetch(url, opts);
};

const env = {
  ADMIN_PASSWORD: "rahasia123",
  SESSION_SECRET: "kunci-rahasia-yang-panjang",
  GITHUB_TOKEN: "ghp_test",
  GITHUB_REPO_USERNAME: "owner",
  GITHUB_REPO_NAME: "repo",
  GITHUB_FILE_PATH: "database.json",
  GITHUB_BRANCH: "main",
};

const call = (path, opts = {}) => onRequest({ request: new Request("https://x.test" + path, opts), env });
const json = (r) => r.json();
const cookie = (r) => (r.headers.get("set-cookie") || "").split(";")[0];

/* 1. login salah -> 401 */
assert.equal((await call("/api/login", { method: "POST", body: JSON.stringify({ password: "salah" }) })).status, 401);

/* 2. login benar -> cookie */
const login = await call("/api/login", { method: "POST", body: JSON.stringify({ password: "rahasia123" }) });
assert.equal(login.status, 200);
const sid = cookie(login);
assert.ok(sid.startsWith("session="));

/* 3. session valid */
assert.equal((await json(await call("/api/me", { headers: { cookie: sid } }))).authenticated, true);

/* 4. session dipalsukan -> unauthorized */
const bad = sid.slice(0, -3) + "abc";
assert.equal((await call("/api/data", { headers: { cookie: bad } })).status, 401);

/* 5. tanpa cookie -> unauthorized */
assert.equal((await call("/api/data")).status, 401);

/* 6. nomor tidak valid -> 400 */
assert.equal(
  (await call("/api/whatsapp", { method: "POST", headers: { cookie: sid }, body: JSON.stringify({ number: "abc" }) })).status,
  400
);

/* 7. tambah nomor */
const add = await call("/api/whatsapp", {
  method: "POST",
  headers: { cookie: sid },
  body: JSON.stringify({ number: "628123456789", note: "utama" }),
});
assert.equal(add.status, 200);
assert.equal(stored.whatsapp.length, 1);
assert.equal(stored.whatsapp[0].number, "628123456789");

/* 8. tambah token */
await call("/api/telegram", {
  method: "POST",
  headers: { cookie: sid },
  body: JSON.stringify({ token: "123456789:AAaaaa-bbbb-cccc", note: "bot" }),
});
assert.equal(stored.telegram.length, 1);

/* 9. list data */
const data = await json(await call("/api/data", { headers: { cookie: sid } }));
assert.equal(data.whatsapp.length, 1);
assert.equal(data.telegram.length, 1);
assert.equal(data.rawUrl, "https://raw.githubusercontent.com/owner/repo/main/database.json");

/* 10. hapus nomor -> hilang dari file */
const del = await call(`/api/whatsapp?id=${stored.whatsapp[0].id}`, { method: "DELETE", headers: { cookie: sid } });
assert.equal(del.status, 200);
assert.equal(stored.whatsapp.length, 0);

/* 11. hapus token */
await call(`/api/telegram?id=${stored.telegram[0].id}`, { method: "DELETE", headers: { cookie: sid } });
assert.equal(stored.telegram.length, 0);

/* 12. shell HTML untuk path tanpa ekstensi */
const shell = await call("/telegram");
assert.match(await shell.text(), /<script type="module" src="\/app\.js">/);

/* 13. logout */
const out = await call("/api/logout", { method: "POST", headers: { cookie: sid } });
assert.equal(out.status, 200);
assert.match(out.headers.get("set-cookie"), /Max-Age=0/);

/* 14. frontend & backend pakai nama route + payload yang sama */
const appSrc = await readFile(new URL("./app.js", import.meta.url), "utf8");
assert.match(appSrc, /api\("whatsapp", \{ method: "POST", body: \{ number:/);
assert.match(appSrc, /api\("telegram", \{ method: "POST", body: \{ token:/);
assert.match(appSrc, /api\(`\$\{route\}\?id=\$\{encodeURIComponent\(id\)\}`, \{ method: "DELETE" \}\)/);
assert.match(appSrc, /data-view="whatsapp"/);
assert.match(appSrc, /data-view="telegram"/);
assert.match(appSrc, /data-view="raw"/);

/* 15. package.json type module (fungsi Pages = ESM) */
const pkg = JSON.parse(await readFile(new URL("./package.json", import.meta.url), "utf8"));
assert.equal(pkg.type, "module");

console.log("OK: 16 assertions passed");
