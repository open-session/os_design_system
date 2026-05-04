---
description: Clear cache and restart dev server
allowed-tools: Bash
---

Clear all caches and restart the development server for a fresh start.

## Steps

1. **Kill any running Next.js processes:**

   ```bash
   pkill -f 'next-server' 2>/dev/null
   pkill -f 'next dev' 2>/dev/null
   ```

2. **Check cache sizes before clearing** (for reporting):

   ```bash
   du -sh .next 2>/dev/null
   du -sh node_modules/.cache 2>/dev/null
   ```

3. **Remove cache directories:**

   ```bash
   rm -rf .next node_modules/.cache
   ```

4. **Report what was cleared** — inform the user how much space was freed.

5. **Env pre-flight — ensure `.env.development` exists:**

   The `bun dev` script runs `op run --env-file=.env.development`. If that file is missing, dev fails instantly with `open .env.development: no such file or directory`. The file only holds `op://` references (no raw secrets), so regenerating it is safe.

   ```bash
   if [ ! -f .env.development ]; then
     echo "[restart] .env.development missing — regenerating via secrets:pull"
     bun run secrets:pull
   fi
   ```

   Notes:
   - `secrets:pull` is an alias for `secrets:apply --target=local --yes`. It writes `.env.development` + `.env.production` with `op://` references resolved by `op run` at startup.
   - If `secrets:pull` fails (usually because `op` isn't signed in), STOP and surface the error. Tell the user to run `op signin` and retry — do NOT fabricate an env file by hand.
   - Never write raw secret values to disk as a workaround.

6. **Start the dev server:**

   ```bash
   bun dev
   ```

7. **Confirm startup** — wait for `Ready in …` / `Local: http://127.0.0.1:3000`, then tell the user the server is running and on which port. If startup errors appear (e.g. `op run` resolution failures), surface them immediately.

## Notes

- Run from the BOS-3.0 directory; use `/bos` first if you're elsewhere.
- `.next/` can grow to 600+ MB over time; clearing it resolves most "stale build" issues.
- `.env.development` is gitignored but trivially regeneratable via `secrets:pull` — losing it is not a real problem as long as 1Password CLI auth is valid.
- Never skip the env pre-flight; a silent dev-server crash on a missing env file is the exact failure this step exists to prevent.
