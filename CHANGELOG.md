# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-05-26

### Added
- Full coverage of YNAB JavaScript SDK v2.9.0 endpoints as MCP tools (40 tools total)
- Read tools: user, budget export, budget settings, budget month, category, month category, account, payee, transaction, scheduled transaction, payee locations
- Write tools: create account, update payee, update category metadata, scheduled transaction CRUD, bulk create/update transactions
- `month` filter on `ynab_get_transactions`
- Optional `includeAccounts` on `ynab_list_budgets`
- Shared `budgetUtils` for budget ID resolution and dollar/milliunit conversion
- Docker image published via GitHub Actions to GHCR on push to `main` and version tags
- `.dockerignore` and multi-stage `Dockerfile`

### Changed
- Refactored tools to use shared `getBudgetId` helper
- GitHub Actions test workflow: coverage upload runs on Node 22.x matrix job

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