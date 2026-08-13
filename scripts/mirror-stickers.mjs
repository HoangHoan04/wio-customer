
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = join(
  root,
  "src/templates/customer-design/utils/stock-stickers.ts",
);
const outRoot = join(root, "public/stickers");
const SIZE = 128;

const ITEM_RE =
  /item\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"(fluent-emoji|lucide)"\s*,\s*"([^"]+)"\s*\)/g;

function sourceUrl(set, icon) {
  if (set === "lucide") {
    return `https://api.iconify.design/lucide/${icon}.svg?height=${SIZE}&color=%232D231F`;
  }
  return `https://api.iconify.design/fluent-emoji/${icon}.svg?height=${SIZE}`;
}

function parseCatalog(source) {
  const items = [];
  for (const match of source.matchAll(ITEM_RE)) {
    items.push({
      id: match[1],
      category: match[3],
      set: match[5],
      icon: match[6],
    });
  }
  return items;
}

async function savePng(url, dest) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { Accept: "image/svg+xml,image/png,*/*" },
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  mkdirSync(dirname(dest), { recursive: true });
  await sharp(buf)
    .resize(SIZE, SIZE, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(dest);
}

async function main() {
  const source = readFileSync(catalogPath, "utf8");
  const items = parseCatalog(source);
  if (items.length === 0) {
    console.error("No catalog items found. Check stock-stickers.ts format.");
    process.exit(1);
  }

  console.log(`Mirroring ${items.length} stickers → ${outRoot}`);
  const failed = [];
  let skipped = 0;
  let saved = 0;

  for (const item of items) {
    const dest = join(outRoot, item.category, `${item.id}.png`);
    if (existsSync(dest)) {
      skipped += 1;
      continue;
    }
    const url = sourceUrl(item.set, item.icon);
    try {
      await savePng(url, dest);
      saved += 1;
      process.stdout.write(`  ok  ${item.category}/${item.id}.png\n`);
    } catch (error) {
      failed.push({ ...item, error: error.message, url });
      process.stdout.write(`  FAIL ${item.id} (${error.message})\n`);
    }
  }

  console.log(
    `\nDone. saved=${saved} skipped=${skipped} failed=${failed.length}`,
  );
  if (failed.length) {
    console.log("Broken Iconify names (remove or replace in stock-stickers.ts):");
    for (const row of failed) {
      console.log(`  - ${row.id}: ${row.set}/${row.icon} → ${row.url}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
