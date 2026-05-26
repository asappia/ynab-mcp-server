## Learned User Preferences

- Use [conventional commits](https://www.conventionalcommits.org/) for all git messages on this fork.
- Tag **v0.2.0+** only after **ynab SDK v4** and **full OpenAPI coverage** are on `main`—not after an interim v2.9-based merge.
- Keep `CHANGELOG.md` and GitHub release notes in sync when cutting semver tags.
- When helping with Claude Desktop or Docker setup, give copy-paste config snippets and call out version/source mismatches (`npx` vs GHCR vs local build).

## Learned Workspace Facts

- Active fork: **`asappia/ynab-mcp-server`** (upstream `calebl/ynab-mcp-server`). GHCR image: `ghcr.io/asappia/ynab-mcp-server` (`:latest`, `:0.2.0`, semver tags on push).
- **v0.2.0** is tagged on `main` (merge via PR #14, May 2026). **npm `ynab-mcp-server` is still 0.1.2**—`npx ynab-mcp-server` does not ship 0.2.0; use GHCR Docker, local `npm run build`, or publish npm.
- **45 MCP tools** with `ynab_` prefix; full YNAB Public API on **`ynab@^4.1.0`**. Tool names and `YNAB_BUDGET_ID` unchanged; SDK uses `api.plans` / `getPlanMonth` (not `api.budgets`).
- Pin **`@modelcontextprotocol/sdk` to exact `1.18.0`**. `1.29.x` makes `tsc` OOM in CI, Docker, and locally even with raised heap.
- CI (`.github/workflows/test.yml`, `docker.yml`): `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`, Node **22.x/24.x** matrix, `npm ci --ignore-scripts` + explicit build, Vitest **`npm test -- --run`**, Codecov on Node 22.x only.
- **Vitest 4.1.x**: coverage needs explicit `include`/`exclude` in `vitest.config.ts` (Vitest 4 defaults differ).
- **Docker**: multi-stage `Dockerfile`; runtime stage `npm ci --omit=dev --ignore-scripts` (no `prepare` in prod image). Private GHCR needs `docker login ghcr.io`.
- **Money movement tools** use `src/tools/ynabClient.ts` (`MoneyMovementsApi` is not on the main `ynab.API` class). Budget-scoped tools use `budgetUtils.getBudgetId`; errors use `errorUtils.getErrorMessage`.
- **Claude Desktop** (`claude_desktop_config.json`): macOS `~/Library/Application Support/Claude/`, Windows `%APPDATA%/Claude/`. Pass `YNAB_API_TOKEN` and optional `YNAB_BUDGET_ID` in the `env` block; Docker config needs `docker` on PATH and `-e` flags in `args`. Local dev: absolute path to `dist/index.js` after `npm run build`.
- See `CLAUDE.md` for tool module pattern, env vars, and adding new tools; see `README.md` for the full tool table and client config examples.
