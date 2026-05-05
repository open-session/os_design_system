# Component Synchronization

> These components are automatically synced from BOS-3.0 via GitHub Actions.

## Source of Truth

**BOS-3.0** (`open-session/BOS-3.0`) is the canonical source for all production components.

| Directory | Source | Description |
|-----------|--------|-------------|
| `base/` | `BOS-3.0/components/base` | Untitled UI base components |
| `custom/` | `BOS-3.0/components/custom` | Open Session custom components |
| `ds/` | `BOS-3.0/components/ds` | Design system transforms |

## How Sync Works

1. Developer pushes changes to `components/` in BOS-3.0
2. GitHub Actions workflow triggers automatically
3. Workflow copies files to `os_design_system/tokens/components/`
4. Commit is created with reference to source commit

```
BOS-3.0 push → GitHub Actions → os_design_system commit
```

## Why Real Files (Not Symlinks)

- **Claude Design**: Can scan actual component code for design system extraction
- **AI Agents**: Full file access without following symlinks
- **Remote Access**: Works when cloned without BOS-3.0 present
- **GitHub UI**: Files viewable directly on GitHub

## Manual Sync

If you need to sync manually (e.g., workflow is disabled):

```bash
# From os_design_system root
./scripts/sync-components.sh
```

Or manually:

```bash
# Remove existing
rm -rf tokens/components/{base,custom,ds}

# Copy from BOS-3.0 (adjust path as needed)
cp -R ../BOS-3.0/components/base tokens/components/
cp -R ../BOS-3.0/components/custom tokens/components/
cp -R ../BOS-3.0/components/ds tokens/components/
cp ../BOS-3.0/components/README.md tokens/components/
```

## Do Not Edit Directly

Components in this directory are **read-only mirrors**. Any direct edits will be overwritten on next sync.

To make changes:
1. Edit components in **BOS-3.0**
2. Push to BOS-3.0 main branch
3. Sync will propagate changes automatically

## Workflow Location

The sync workflow is defined in:
```
BOS-3.0/.github/workflows/sync-design-system.yml
```

## Required Secret

The workflow requires a `DESIGN_SYSTEM_PAT` secret in BOS-3.0 with:
- Repository access to `os_design_system`
- Contents: Read and write
- Metadata: Read

---

*Last synced: See git history for `chore(sync):` commits*
