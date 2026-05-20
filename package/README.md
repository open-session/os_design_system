# @opensession/design-system

Open Session design system. Published publicly on npm under the `@opensession` scope for installation convenience; usage is governed by [LICENSE](./LICENSE).

- **v0.1.x** — brand tokens only: `brand.css` (Tailwind v4 `@theme` source of truth) and a Tailwind preset.
- **v0.2.x** — adds React components (`base/`, `custom/shared/`, `custom/pages/`) with build-time shims and mock fixtures so they render inside Figma Make.

Source lives at [github.com/open-session/os_design_system](https://github.com/open-session/os_design_system) under `package/`. Components are synced from BOS-3.0 into `tokens/components/`.

---

## Install

```bash
npm install @opensession/design-system
```

No auth required — public scope.

---

## v0.1 — Tokens

Two entry points:

```ts
// 1. Inject brand CSS variables (Tailwind v4 @theme)
import "@opensession/design-system/tokens/brand.css";

// 2. Use the Tailwind preset
// tailwind.config.ts
import preset from "@opensession/design-system/tokens/preset";

export default {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx}"],
};
```

Or merge the theme manually:

```ts
import { theme } from "@opensession/design-system/tokens/preset";

export default {
  theme: {
    extend: {
      ...theme.extend,
    },
  },
};
```

The CSS file ships verbatim — it contains Tailwind v4 `@theme` blocks that must reach the consumer unprocessed.

---

## Figma Make setup

In Figma Make, just `npm install @opensession/design-system` — no `.npmrc`, no token, no admin panel configuration needed.

---

## Versioning

Independent semver, decoupled from BOS-3.0 release tags.

| Range | Meaning |
|---|---|
| `0.1.x` | Tokens-only releases (CSS variable additions, preset additions) |
| `0.2.x`+ | Components shipping; patch on additive component changes, minor on new categories |
| `1.0.0` | Component API stability committed |

The BOS-3.0 sync workflow (`.github/workflows/sync.yml`, added in v0.2) updates `tokens/components/` and opens a PR. A human reviews and tags the release.

---

## Publish flow (maintainers)

Releases are fully automated via GitHub Actions + npm Trusted Publishers (OIDC). No tokens to rotate, no OTP to enter.

To release:

```bash
# from repo root, on main with the new version committed in package/package.json
git tag v0.1.1 && git push origin v0.1.1
```

The `publish.yml` workflow fires on tag push, builds the package, and publishes with provenance attestation.

If you need to publish manually (one-off, no CI), do it locally:

```bash
cd package
npm install && npm run build
npm publish --access public --provenance
# npm will prompt for an OTP from your authenticator or backup code
```

---

## Local development of this package

```bash
cd package
npm install
npm run build      # produces dist/tokens/{brand.css,tailwind.config.{js,d.ts}}
npm pack           # produces opensession-design-system-x.y.z.tgz
```

To test consumption end-to-end against the packed tarball:

```bash
cd /tmp && mkdir consumer && cd consumer
npm init -y
npm install ../path/to/os_design_system/package/opensession-design-system-*.tgz
node --input-type=module -e "import preset from '@opensession/design-system/tokens/preset'; console.log(preset.theme.extend.colors.brand)"
```

---

## License

See [LICENSE](./LICENSE). All rights reserved. Public availability on npm is for installation convenience and does not grant redistribution rights.
