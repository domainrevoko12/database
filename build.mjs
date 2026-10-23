// Build: siapkan folder deploy (tanpa .env) + .dev.vars untuk dev lokal
import { cp, mkdir, rm, readFile, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("app.js", "dist/app.js");
await cp("database.json", "dist/database.json");
await cp("functions", "dist/functions", { recursive: true });

try {
  const env = await readFile(".env", "utf8");
  await writeFile(".dev.vars", env.replace(/^#.*$/gm, "").trim() + "\n");
  console.log("built -> dist/  (+ .dev.vars untuk dev lokal)");
} catch {
  console.log("built -> dist/  (.env tidak ditemukan, dev lokal pakai dashboard vars)");
}
