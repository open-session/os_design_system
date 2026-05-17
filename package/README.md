# @opensession/design-system

Open Session design system, distributed as a private npm package on the `@opensession` scope.

- **v0.1.x** — brand tokens only: `brand.css` (Tailwind v4 `@theme` source of truth) and a Tailwind preset.
- **v0.2.x** — adds React components (`base/`, `custom/shared/`, `custom/pages/`) with build-time shims and mock fixtures so they render inside Figma Make.

This package is private. It is published to npmjs.com under a restricted scope and is not redistributable outside Open Session.

---

## Install

```bash
npm install @opensession/design-system
```

Authentication required — see [Consumer setup](#consumer-setup).

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

## Consumer setup

### Local development

```bash
npm login --scope=@opensession --registry=https://registry.npmjs.org
```

### CI / hosted environments

Add to your project's `.npmrc`:

```
@opensession:registry=https://registry.npmjs.org
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

Where `NPM_TOKEN` is a read-only npm automation token with access to `@opensession/*` packages.

### Figma Make

In Figma Make's workspace admin panel, paste the same `.npmrc` snippet above with a dedicated read-only token. Use a separate token from the one used by internal CI.

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

## Local development of this package

```bash
cd package
npm install
npm run build      # produces dist/tokens/{brand.css,tailwind.config.{js,d.ts}}
npm pack           # produces @opensession-design-system-x.y.z.tgz
```

To test consumption end-to-end against the packed tarball:

```bash
cd /tmp && mkdir consumer && cd consumer
npm init -y
npm install ../path/to/os_design_system/package/opensession-design-system-*.tgz
node -e "import('@opensession/design-system/tokens/preset').then(m => console.log(Object.keys(m)))"
```

---

## Hand-off checklist (v0.1.0 first publish)

Items requiring action outside this repo:

- [ ] Verify ownership of `@opensession` org on npmjs.com (already exists per setup)
- [ ] Generate **publish** automation token: `Settings → Access Tokens → Generate New Token → Granular Token`, with `Write` access to `@opensession/*`. Lifetime caps at 90 days.
- [ ] Generate **read-only** automation token for Figma Make and internal CI consumers (separate from publish token)
- [ ] Add publish token to this repo's secrets as `NPM_TOKEN` (`Settings → Secrets and variables → Actions`)
- [ ] Tag the release: `git tag v0.1.0 && git push origin v0.1.0` — fires the publish workflow
- [ ] Confirm publish succeeded on npmjs.com with provenance attestation visible
- [ ] In a throwaway Vite project, `npm install @opensession/design-system` and verify both subpath imports resolve
- [ ] In Figma Make workspace, paste the `.npmrc` snippet into the admin panel and confirm tokens render in the canvas

---

## License

UNLICENSED — proprietary to Open Session. See [LICENSE](./LICENSE).
