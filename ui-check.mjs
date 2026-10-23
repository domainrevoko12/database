// Uji UI dengan jsdom: render app.js di DOM virtual, cek sidebar/tabel/modal delete.
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { readFile } from "node:fs/promises";

const appSrc = await readFile(new URL("./app.js", import.meta.url), "utf8");

const db = {
  whatsapp: [
    { id: "w1", number: "6288985152635", status: "active" },
    { id: "w2", number: "6288393930202", status: "active" },
  ],
  telegram: [{ id: "t1", token: "123456789:AAsecret-token-value", status: "active" }],
  rawUrl: "https://raw.githubusercontent.com/owner/repo/main/database.json",
};

const calls = [];
const J = (data, status = 200) => new Response(JSON.stringify(data), { status });

const dom = new JSDOM(`<!doctype html><html><head></head><body><script></script></body></html>`, {
  url: "https://app.test/",
  runScripts: "dangerously",
  beforeParse(window) {
    window.fetch = async (url, opts = {}) => {
      const u = String(url);
      calls.push({ url: u, method: opts.method || "GET" });
      if (u.endsWith("/api/me")) return J({ authenticated: true });
      if (u.endsWith("/api/data")) return J(db);
      if (u.includes("raw.githubusercontent")) return new Response('{"whatsapp":[],"telegram":[]}', { status: 200 });
      if (opts.method === "DELETE") return J({ ok: true });
      if (opts.method === "POST") return J({ ok: true });
      return J({}, 404);
    };
    window.Response = Response;
    window.AbortSignal = AbortSignal;
    window.addEventListener("error", (e) => console.error("WINDOW ERROR:", e.error || e.message));
  },
});

const { window } = dom;
const doc = window.document;

// inject & jalankan app.js di DOM yang fetch-nya sudah di-stub
const script = doc.createElement("script");
script.textContent = appSrc;
doc.head.appendChild(script);

await new Promise((r) => setTimeout(r, 300));

const q = (sel) => doc.querySelector(sel);
const qa = (sel) => [...doc.querySelectorAll(sel)];

assert.ok(!/kilua/i.test(doc.body.innerHTML), "tidak boleh ada tulisan Kilua");
assert.ok(q("#loginForm"), "form login ada");
assert.ok(!/contact support/i.test(doc.body.innerHTML), "Contact Support harus dihapus");

const navs = qa("nav button").map((b) => b.dataset.view);
assert.deepEqual(navs, ["whatsapp", "telegram", "raw"]);

assert.ok(!q("#side").classList.contains("on"), "sidebar tertutup awal");
q("#burger").click();
assert.ok(q("#side").classList.contains("on"), "sidebar terbuka setelah klik burger");
q("#closeSide").click();
assert.ok(!q("#side").classList.contains("on"), "sidebar tertutup setelah klik X");

assert.ok(q("#login").classList.contains("hidden"), "login disembunyikan");

assert.ok(/6288985152635/.test(q("#waTable").innerHTML), "nomor tampil di tabel");
assert.ok(/6288393930202/.test(q("#waTable").innerHTML), "nomor kedua tampil");
assert.equal(qa("#waTable .pill").length, 2, "pill status ada 2");
assert.ok(/active/.test(q("#waTable").innerHTML), "status active");
assert.equal(qa('#waTable [data-act="del"]').length, 2, "2 tombol hapus");

qa('#waTable [data-act="del"]')[0].click();
assert.ok(q("#modal").classList.contains("on"), "modal konfirmasi tampil");
assert.ok(/6288985152635/.test(q("#mText").textContent), "modal menyebut nomor");

q("#mYes").click();
await new Promise((r) => setTimeout(r, 100));
assert.ok(calls.some((c) => c.method === "DELETE" && c.url.includes("/api/whatsapp?id=w1")), "DELETE dipanggil");

qa("nav button")[1].click();
assert.ok(q("#tgTable"), "tabel token ada");
assert.ok(!/AAsecret-token-value/.test(q("#tgTable .tok").textContent), "token ter-mask di tampilan");
assert.equal(q("#tgTable .tok").dataset.tok, "123456789:AAsecret-token-value", "token asli ada di data-tok");

qa("nav button")[0].click();
const s = q("#waSearch");
s.value = "2635";
s.oninput();
assert.equal(qa("#waTable tbody tr").length, 1, "search menyaring 1 baris");
assert.ok(/6288985152635/.test(q("#waTable").innerHTML), "yang cocok tampil");
assert.ok(!/6288393930202/.test(q("#waTable").innerHTML), "yang tidak cocok hilang");

qa("nav button")[2].click();
assert.equal(q("#rawUrl").value, db.rawUrl, "raw url tampil");

assert.ok(q("#logout"), "tombol logout ada");

/* 14. form add number memanggil API POST */
qa("nav button")[0].click();
q("#waNum").value = "628111222333";
q("#waForm").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
await new Promise((r) => setTimeout(r, 100));
assert.ok(calls.some((c) => c.method === "POST" && c.url.endsWith("/api/whatsapp")), "POST whatsapp dipanggil");

/* 15. token bisa di-reveal lalu di-mask lagi */
qa("nav button")[1].click();
const tokCell = q("#tgTable .tok");
tokCell.click();
assert.equal(tokCell.textContent, "123456789:AAsecret-token-value", "token reveal saat klik");
tokCell.click();
assert.notEqual(tokCell.textContent, "123456789:AAsecret-token-value", "token kembali di-mask");

console.log("OK: UI 20 assertions passed");
