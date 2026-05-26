[![MseeP.ai Security Assessment Badge](https://mseep.net/mseep-audited.png)](https://mseep.ai/app/calebl-ynab-mcp-server)

# ynab-mcp-server
[![smithery badge](https://smithery.ai/badge/@calebl/ynab-mcp-server)](https://smithery.ai/server/@calebl/ynab-mcp-server)

A Model Context Protocol (MCP) server built with mcp-framework. This MCP provides tools
for interacting with your YNAB budgets setup at https://ynab.com

<a href="https://glama.ai/mcp/servers/@calebl/ynab-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@calebl/ynab-mcp-server/badge" alt="YNAB Server MCP server" />
</a>

In order to have an AI interact with this tool, you will need to get your Personal Access Token
from YNAB: https://api.ynab.com/#personal-access-tokens. When adding this MCP server to any
client, you will need to provide your personal access token as YNAB_API_TOKEN. **This token
is never directly sent to the LLM.** It is stored privately in an environment variable for
use with the YNAB api.

## Setup
Specify env variables:
* YNAB_API_TOKEN (required)
* YNAB_BUDGET_ID (optional)

## Goal
The goal of the project is to be able to interact with my YNAB budget via an AI conversation.
There are a few primary workflows I want to enable:

## Workflows:
### First time setup
* be prompted to select your budget from your available budgets. If you try to use another
tool first, this prompt should happen asking you to set your default budget.
  * Tools needed: ListBudgets
### Manage overspent categories
### Adding new transactions
### Approving transactions
### Check total monthly spending vs total income
### Auto-distribute ready to assign funds based on category targets

## Available MCP tools

The server exposes **40 tools** covering the YNAB SDK v2.9.0 API (`ynab@^2.9.0`):

| Tool | Description |
|------|-------------|
| `ynab_list_budgets` | List budgets (optional account summaries) |
| `ynab_get_user` | Authenticated user info |
| `ynab_get_budget` | Full budget export |
| `ynab_get_budget_settings` | Budget settings |
| `ynab_get_budget_month` | Single month (categories, RTA, age of money) |
| `ynab_budget_summary` | Overspent categories and open accounts for a month |
| `ynab_list_months` | List budget months |
| `ynab_list_accounts` / `ynab_get_account` / `ynab_create_account` | Accounts |
| `ynab_list_categories` / `ynab_get_category` / `ynab_get_month_category` | Categories |
| `ynab_update_category_budget` | Set category budgeted amount for a month |
| `ynab_update_category` | Update category metadata |
| `ynab_list_payees` / `ynab_get_payee` / `ynab_update_payee` | Payees |
| `ynab_list_payee_locations` / `ynab_get_payee_location` / `ynab_list_payee_locations_by_payee` | Payee locations |
| `ynab_get_transactions` | List transactions (filters: month, account, category, payee, type) |
| `ynab_get_transaction` / `ynab_create_transaction` / `ynab_create_transactions` | Single or bulk create |
| `ynab_update_transaction` / `ynab_update_transactions` / `ynab_delete_transaction` | Update or delete |
| `ynab_get_unapproved_transactions` / `ynab_approve_transaction` / `ynab_bulk_approve_transactions` | Approval workflow |
| `ynab_import_transactions` | Import from linked accounts |
| `ynab_list_scheduled_transactions` / `ynab_get_scheduled_transaction` | Scheduled transactions |
| `ynab_create_scheduled_transaction` / `ynab_update_scheduled_transaction` / `ynab_delete_scheduled_transaction` | Scheduled CRUD |

Amounts returned from the raw API are in **milliunits** (divide by 1000 for dollars). Write tools that accept dollar amounts convert automatically.

## Docker

A Docker image is built on every push to `main` and published to GitHub Container Registry:

```bash
docker pull ghcr.io/calebl/ynab-mcp-server:latest
```

Replace `calebl` with your GitHub username or organization if you fork this repository.

### Run locally

```bash
docker build -t ynab-mcp-server:local .
export YNAB_API_TOKEN="your-token"
export YNAB_BUDGET_ID="optional-budget-id"
docker run -i --rm -e YNAB_API_TOKEN -e YNAB_BUDGET_ID ynab-mcp-server:local
```

### MCP client configuration (stdio via Docker)

```json
{
  "mcpServers": {
    "ynab-mcp-server": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "YNAB_API_TOKEN",
        "-e", "YNAB_BUDGET_ID",
        "ghcr.io/calebl/ynab-mcp-server:latest"
      ],
      "env": {
        "YNAB_API_TOKEN": "<your-token>",
        "YNAB_BUDGET_ID": "<optional-budget-id>"
      }
    }
  }
}
```

For private GHCR packages, run `docker login ghcr.io` first.

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

```

## Project Structure

```
ynab-mcp-server/
├── src/
│   ├── tools/        # MCP Tools
│   └── index.ts      # Server entry point
├── .cursor/
│   └── rules/        # Cursor AI rules for code generation
├── package.json
└── tsconfig.json
```

## Adding Components

The YNAB sdk describes the available api endpoints: https://github.com/ynab/ynab-sdk-js.

YNAB open api specification is here: https://api.ynab.com/papi/open_api_spec.yaml. This can
be used to prompt an AI to generate a new tool. Example prompt for Cursor Agent:

```
create a new tool based on the readme and this openapi doc: https://api.ynab.com/papi/open_api_spec.yaml

The new tool should get the details for a single budget
```

You can add more tools using the CLI:

```bash
# Add a new tool
mcp add tool my-tool

# Example tools you might create:
mcp add tool data-processor
mcp add tool api-client
mcp add tool file-handler
```

## Tool Development

Example tool structure:

```typescript
import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface MyToolInput {
  message: string;
}

class MyTool extends MCPTool<MyToolInput> {
  name = "my_tool";
  description = "Describes what your tool does";

  schema = {
    message: {
      type: z.string(),
      description: "Description of this input parameter",
    },
  };

  async execute(input: MyToolInput) {
    // Your tool logic here
    return `Processed: ${input.message}`;
  }
}

export default MyTool;
```

## Publishing to npm

1. Update your package.json:
   - Ensure `name` is unique and follows npm naming conventions
   - Set appropriate `version`
   - Add `description`, `author`, `license`, etc.
   - Check `bin` points to the correct entry file

2. Build and test locally:
   ```bash
   npm run build
   npm link
   ynab-mcp-server  # Test your CLI locally
   ```

3. Login to npm (create account if necessary):
   ```bash
   npm login
   ```

4. Publish your package:
   ```bash
   npm publish
   ```

After publishing, users can add it to their claude desktop client (read below) or run it with npx


## Using with Claude Desktop

### Installing via Smithery

To install YNAB Budget Assistant for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@calebl/ynab-mcp-server):

```bash
npx -y @smithery/cli install @calebl/ynab-mcp-server --client claude
```

### Local Development

Add this configuration to your Claude Desktop config file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ynab-mcp-server": {
      "command": "node",
      "args":["/absolute/path/to/ynab-mcp-server/dist/index.js"]
    }
  }
}
```

### After Publishing

Add this configuration to your Claude Desktop config file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ynab-mcp-server": {
      "command": "npx",
      "args": ["ynab-mcp-server"]
    }
  }
}
```

### Other MCP Clients
Check https://modelcontextprotocol.io/clients for other available clients.

## Building and Testing

1. Make changes to your tools
2. Run `npm run build` to compile
3. The server will automatically load your tools on startup

## Learn More

- [MCP Framework Github](https://github.com/QuantGeekDev/mcp-framework)
- [MCP Framework Docs](https://mcp-framework.com)
