#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = resolve(__dirname, "../package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

const tag = process.env.GITHUB_REF_NAME;
if (!tag) {
  console.error("GITHUB_REF_NAME is not set — this script must run inside a tag-push workflow.");
  process.exit(1);
}

const tagVersion = tag.replace(/^v/, "");
if (tagVersion !== pkg.version) {
  console.error(
    `Tag/version mismatch: GITHUB_REF_NAME=${tag} (→ ${tagVersion}) but package.json has version ${pkg.version}.\n` +
      `Bump package.json to ${tagVersion}, or re-tag to v${pkg.version}.`,
  );
  process.exit(1);
}

console.log(`Tag ${tag} matches package.json version ${pkg.version}.`);
