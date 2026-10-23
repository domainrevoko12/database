// Uji lokal end-to-end: nyalakan wrangler pages dev, probe endpoint, matikan.
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";

const PORT = 8900 + Math.floor(Math.random() * 200);
const base = `http://127.0.0.1:${PORT}`;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const proc = spawn("npx", ["wrangler", "pages", "dev", "dist", "--port", String(PORT), "--compatibility-date=2024-09-23"], {
  stdio: ["ignore", "pipe", "pipe"],
});
let log = "";
proc.stdout.on("data", (d) => (log += d));
proc.stderr.on("data", (d) => (log += d));

const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  " + detail : ""}`);
};

try {
  let up = false;
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(`${base}/api/me`, { signal: AbortSignal.timeout(2000) });
      up = true;
      break;
    } catch {
      await wait(1000);
    }
  }
  check("server hidup", up);
  if (!up) throw new Error("server tidak start\n" + log);

  const shell = await fetch(base + "/");
  const shellText = await shell.text();
  check("shell HTML", shellText.includes('<script type="module" src="/app.js">'), `status=${shell.status}`);

  const asset = await fetch(base + "/app.js");
  check("app.js ter-serve", asset.status === 200, `status=${asset.status} type=${asset.headers.get("content-type")}`);

  const noauth = await fetch(base + "/api/data");
  check("data tanpa login ditolak", noauth.status === 401, `status=${noauth.status}`);

  const wrong = await fetch(base + "/api/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password: "salah" }),
  });
  check("login password salah -> 401", wrong.status === 401, `status=${wrong.status}`);

  const pw = readFileSync(".dev.vars", "utf8").match(/^ADMIN_PASSWORD=(.*)$/m)[1].trim();
  const good = await fetch(base + "/api/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password: pw }),
  });
  const cookie = (good.headers.get("set-cookie") || "").split(";")[0];
  check("login benar -> cookie", good.status === 200 && cookie.startsWith("session="), `status=${good.status}`);

  const me = await fetch(base + "/api/me", { headers: { cookie } });
  check("session valid", (await me.json()).authenticated === true);

  const data = await fetch(base + "/api/data", { headers: { cookie } });
  const dataText = await data.text();
  check("data API (butuh GitHub token asli)", data.status === 200 || data.status === 500, `status=${data.status} body=${dataText.slice(0, 120)}`);
} catch (err) {
  check("error fatal", false, err.message);
} finally {
  proc.kill("SIGTERM");
  await wait(500);
  proc.kill("SIGKILL");
}

const failed = results.filter((r) => !r.pass);
console.log(failed.length ? `\n${failed.length} GAGAL` : `\nSEMUA LOLOS (${results.length})`);
if (failed.length) console.log(log.split("\n").slice(-25).join("\n"));
process.exit(failed.length ? 1 : 0);
