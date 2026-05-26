# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-05-26

### Added
- **45 MCP tools** with full coverage of the current [YNAB OpenAPI](https://api.ynab.com) (43 REST operations) plus composite helpers
- Built on **`ynab@^4.1.0`** (`api.plans`, `getPlanMonth`, money movements, category/payee create)
- New tools: `ynab_create_category`, `ynab_create_category_group`, `ynab_update_category_group`, `ynab_create_payee`
- New tools: `ynab_list_money_movements`, `ynab_list_money_movements_by_month`, `ynab_list_money_movement_groups`, `ynab_list_money_movement_groups_by_month`
- Read/write tools for plans (budgets), accounts, categories, payees, transactions, scheduled transactions, payee locations
- `month` filter on `ynab_get_transactions`
- Optional `includeAccounts` on `ynab_list_budgets`
- Shared `budgetUtils` and `ynabClient` (wraps `MoneyMovementsApi`)
- Docker image published via GitHub Actions to GHCR on push to `main` and version tags
- `.dockerignore` and multi-stage `Dockerfile`

### Fixed
- Pin `@modelcontextprotocol/sdk` to 1.18.0; 1.29.x causes `tsc` to run out of memory in CI and Docker builds
- Remove deprecated `@types/axios` (axios ships its own types)
- Override transitive `glob` to 13.x (via `test-exclude` / Vitest coverage) to clear install deprecation warnings

### Changed
- Upgraded from `ynab@2.9` to `ynab@4.1` (plans API naming; same UUIDs via `YNAB_BUDGET_ID`)
- Refactored tools to use shared `getBudgetId` helper
- GitHub Actions: Node 24–compatible action versions (`checkout@v5`, `setup-node@v5`, Docker actions v4–v7) and `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`
- GitHub Actions test workflow: install with `--ignore-scripts`, explicit build step, coverage upload on Node 22.x
- `ynab_create_account` limited to account types supported by the create-account API

## [0.1.2] - 2024-03-26

### Added
- New `ApproveTransaction` tool for approving existing transactions in YNAB
  - Can approve/unapprove transactions by ID
  - Works in conjunction with GetUnapprovedTransactions tool
  - Preserves existing transaction data when updating approval status
- Added Cursor rules for YNAB API development
  - New `.cursor/rules/ynabapi.mdc` file
  - Provides guidance for working with YNAB types and API endpoints
  - Helps maintain consistency in tool development

### Changed
- Updated project structure documentation to include `.cursor/rules` directory
- Enhanced README with documentation for the new ApproveTransaction tool 