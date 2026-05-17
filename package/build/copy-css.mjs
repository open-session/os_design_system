#!/usr/bin/env node
import { mkdirSync, copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..");
const src = resolve(pkgRoot, "../tokens/ds/brand.css");
const dest = resolve(pkgRoot, "dist/tokens/brand.css");

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log(`Copied ${src} → ${dest}`);
