# AGENTS.md

## Cursor Cloud specific instructions

Standard scripts are in `package.json`. Non-obvious VM gotchas:

- **Run the JS toolchain under Node 24.** The VM's default `node` is a wrapper
  (`/exec-daemon/node`, v22.14) that shadows nvm. Use Node 24 (installed via nvm by
  the environment update script): `export PATH="$HOME/.nvm/versions/node/v24"*"/bin:$PATH"`.
- **Install deps with the default Node 22 `npm` (v10), not Node 24's `npm` (v11).**
  npm 11 blocks the `esbuild`/`workerd` postinstall behind an interactive
  allow-scripts prompt. Run `npm ci` on the default PATH, then run tooling under Node 24.
- There is no `test` npm script even though `index.test.ts` + `vitest.config.ts`
  exist; run the suite directly with `npx vitest run`.
- `npm run dev` starts `wrangler dev`; deploy needs Cloudflare creds not present here.

Verified in this environment (Node 24): `npm ci`, `npm run typecheck`,
`npx vitest run` (3 passed) all pass.
