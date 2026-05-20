#!/usr/bin/env node
/**
 * Generates dist/tokens/utilities.css — a pre-compiled set of Tailwind-style
 * utility classes that resolve to the design-system's CSS variables.
 *
 * Why this exists: some consumer environments (notably Figma Make) load our
 * brand.css but do NOT run a Tailwind build over our preset. In those
 * environments, `bg-brand-500` etc. would resolve to no rule and render as
 * empty. This file ships the rules pre-resolved so utilities work without
 * any Tailwind processing downstream.
 *
 * Each rule points at the corresponding CSS variable, so dark-mode overrides
 * defined in brand.css automatically apply.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..");
const brandCssPath = resolve(pkgRoot, "../tokens/ds/brand.css");
const outputPath = resolve(pkgRoot, "dist/tokens/utilities.css");

const brandCss = readFileSync(brandCssPath, "utf8");

// Capture every `--var-name: value;` declaration. Prefer the first occurrence
// (which is the light-mode default in @theme); dark-mode overrides reuse the
// same names inside .dark { ... } and are picked up at render time via var().
const varRegex = /--([a-zA-Z][a-zA-Z0-9_-]*)\s*:\s*[^;]+;/g;
const seen = new Set();
const vars = [];
for (const m of brandCss.matchAll(varRegex)) {
  const name = m[1];
  if (!seen.has(name)) {
    seen.add(name);
    vars.push(name);
  }
}

// Tailwind expects class-name segments to be hyphenated, but some brand.css
// variables use underscores (e.g. --bg-primary_alt). Translate for class names.
const cn = (s) => s.replace(/_/g, "-");

const rules = [];

for (const name of vars) {
  // Color primitives — generate the full set of property utilities.
  // Examples: --color-brand-500, --color-gray-25, --color-vanilla, --color-white.
  if (name.startsWith("color-")) {
    const k = cn(name.slice("color-".length));
    rules.push(`.bg-${k} { background-color: var(--${name}); }`);
    rules.push(`.text-${k} { color: var(--${name}); }`);
    rules.push(`.border-${k} { border-color: var(--${name}); }`);
    rules.push(`.fill-${k} { fill: var(--${name}); }`);
    rules.push(`.stroke-${k} { stroke: var(--${name}); }`);
    rules.push(`.ring-${k} { --tw-ring-color: var(--${name}); box-shadow: 0 0 0 var(--tw-ring-width, 2px) var(--${name}); }`);
    continue;
  }
  // Semantic background tokens: --bg-primary → .bg-bg-primary
  if (/^bg(-|$)/.test(name)) {
    rules.push(`.bg-${cn(name)} { background-color: var(--${name}); }`);
    continue;
  }
  // Semantic foreground/text tokens: --fg-primary → .text-fg-primary
  if (/^fg(-|$)/.test(name)) {
    rules.push(`.text-${cn(name)} { color: var(--${name}); }`);
    continue;
  }
  // Semantic border tokens: --border-primary → .border-border-primary
  if (/^border(-|$)/.test(name)) {
    rules.push(`.border-${cn(name)} { border-color: var(--${name}); }`);
    continue;
  }
  // Shadow tokens: --shadow-xs → .shadow-xs
  if (name.startsWith("shadow-")) {
    const k = cn(name.slice("shadow-".length));
    rules.push(`.shadow-${k} { box-shadow: var(--${name}); }`);
    continue;
  }
  // Focus-ring tokens: --focus-ring → .focus-ring (custom utility)
  if (name === "focus-ring" || name.startsWith("focus-ring-")) {
    const k = cn(name);
    rules.push(`.${k} { outline: 2px solid var(--${name}); outline-offset: 2px; }`);
    continue;
  }
  // Skip motion, button, and other namespaces — consumers can use inline styles.
}

const header = `/*
 * @opensession/design-system — pre-compiled utility classes
 *
 * Generated from tokens/ds/brand.css at build time. Provides Tailwind-style
 * utility classes that resolve to CSS variables without requiring a Tailwind
 * build step in the consumer environment.
 *
 * Usage:
 *   import "@opensession/design-system/tokens/brand.css";
 *   import "@opensession/design-system/tokens/utilities.css";
 *
 * Then use classes like bg-brand-500, text-fg-primary, border-border-secondary,
 * shadow-md directly. Dark-mode overrides defined in brand.css apply
 * automatically via the .dark class selector.
 *
 * Tailwind-using consumers can skip this file — their Tailwind build will
 * generate equivalent utilities from the preset.
 */
`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, header + "\n" + rules.join("\n") + "\n");
console.log(`Wrote ${rules.length} utility rules → ${outputPath}`);
