#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as ynab from "ynab";

import * as ListBudgetsTool from "./tools/ListBudgetsTool.js";
import * as GetUserTool from "./tools/GetUserTool.js";
import * as GetBudgetTool from "./tools/GetBudgetTool.js";
import * as GetBudgetSettingsTool from "./tools/GetBudgetSettingsTool.js";
import * as GetBudgetMonthTool from "./tools/GetBudgetMonthTool.js";
import * as GetUnapprovedTransactionsTool from "./tools/GetUnapprovedTransactionsTool.js";
import * as BudgetSummaryTool from "./tools/BudgetSummaryTool.js";
import * as CreateTransactionTool from "./tools/CreateTransactionTool.js";
import * as CreateTransactionsTool from "./tools/CreateTransactionsTool.js";
import * as ApproveTransactionTool from "./tools/ApproveTransactionTool.js";
import * as UpdateCategoryBudgetTool from "./tools/UpdateCategoryBudgetTool.js";
import * as UpdateCategoryTool from "./tools/UpdateCategoryTool.js";
import * as UpdateTransactionTool from "./tools/UpdateTransactionTool.js";
import * as UpdateTransactionsTool from "./tools/UpdateTransactionsTool.js";
import * as BulkApproveTransactionsTool from "./tools/BulkApproveTransactionsTool.js";
import * as ListPayeesTool from "./tools/ListPayeesTool.js";
import * as GetPayeeTool from "./tools/GetPayeeTool.js";
import * as UpdatePayeeTool from "./tools/UpdatePayeeTool.js";
import * as GetTransactionsTool from "./tools/GetTransactionsTool.js";
import * as GetTransactionTool from "./tools/GetTransactionTool.js";
import * as DeleteTransactionTool from "./tools/DeleteTransactionTool.js";
import * as ListCategoriesTool from "./tools/ListCategoriesTool.js";
import * as GetCategoryTool from "./tools/GetCategoryTool.js";
import * as GetMonthCategoryTool from "./tools/GetMonthCategoryTool.js";
import * as ListAccountsTool from "./tools/ListAccountsTool.js";
import * as GetAccountTool from "./tools/GetAccountTool.js";
import * as CreateAccountTool from "./tools/CreateAccountTool.js";
import * as ListScheduledTransactionsTool from "./tools/ListScheduledTransactionsTool.js";
import * as GetScheduledTransactionTool from "./tools/GetScheduledTransactionTool.js";
import * as CreateScheduledTransactionTool from "./tools/CreateScheduledTransactionTool.js";
import * as UpdateScheduledTransactionTool from "./tools/UpdateScheduledTransactionTool.js";
import * as DeleteScheduledTransactionTool from "./tools/DeleteScheduledTransactionTool.js";
import * as ImportTransactionsTool from "./tools/ImportTransactionsTool.js";
import * as ListMonthsTool from "./tools/ListMonthsTool.js";
import * as ListPayeeLocationsTool from "./tools/ListPayeeLocationsTool.js";
import * as GetPayeeLocationTool from "./tools/GetPayeeLocationTool.js";
import * as ListPayeeLocationsByPayeeTool from "./tools/ListPayeeLocationsByPayeeTool.js";

const server = new McpServer({
  name: "ynab-mcp-server",
  version: "0.2.0",
});

const api = new ynab.API(process.env.YNAB_API_TOKEN || "");

server.registerTool(ListBudgetsTool.name, {
  title: "List Budgets",
  description: ListBudgetsTool.description,
  inputSchema: ListBudgetsTool.inputSchema,
}, async (input) => ListBudgetsTool.execute(input, api));

server.registerTool(GetUserTool.name, {
  title: "Get User",
  description: GetUserTool.description,
  inputSchema: GetUserTool.inputSchema,
}, async (input) => GetUserTool.execute(input, api));

server.registerTool(GetBudgetTool.name, {
  title: "Get Budget",
  description: GetBudgetTool.description,
  inputSchema: GetBudgetTool.inputSchema,
}, async (input) => GetBudgetTool.execute(input, api));

server.registerTool(GetBudgetSettingsTool.name, {
  title: "Get Budget Settings",
  description: GetBudgetSettingsTool.description,
  inputSchema: GetBudgetSettingsTool.inputSchema,
}, async (input) => GetBudgetSettingsTool.execute(input, api));

server.registerTool(GetBudgetMonthTool.name, {
  title: "Get Budget Month",
  description: GetBudgetMonthTool.description,
  inputSchema: GetBudgetMonthTool.inputSchema,
}, async (input) => GetBudgetMonthTool.execute(input, api));

server.registerTool(GetUnapprovedTransactionsTool.name, {
  title: "Get Unapproved Transactions",
  description: GetUnapprovedTransactionsTool.description,
  inputSchema: GetUnapprovedTransactionsTool.inputSchema,
}, async (input) => GetUnapprovedTransactionsTool.execute(input, api));

server.registerTool(BudgetSummaryTool.name, {
  title: "Budget Summary",
  description: BudgetSummaryTool.description,
  inputSchema: BudgetSummaryTool.inputSchema,
}, async (input) => BudgetSummaryTool.execute(input, api));

server.registerTool(CreateTransactionTool.name, {
  title: "Create Transaction",
  description: CreateTransactionTool.description,
  inputSchema: CreateTransactionTool.inputSchema,
}, async (input) => CreateTransactionTool.execute(input, api));

server.registerTool(CreateTransactionsTool.name, {
  title: "Create Transactions",
  description: CreateTransactionsTool.description,
  inputSchema: CreateTransactionsTool.inputSchema,
}, async (input) => CreateTransactionsTool.execute(input, api));

server.registerTool(ApproveTransactionTool.name, {
  title: "Approve Transaction",
  description: ApproveTransactionTool.description,
  inputSchema: ApproveTransactionTool.inputSchema,
}, async (input) => ApproveTransactionTool.execute(input, api));

server.registerTool(UpdateCategoryBudgetTool.name, {
  title: "Update Category Budget",
  description: UpdateCategoryBudgetTool.description,
  inputSchema: UpdateCategoryBudgetTool.inputSchema,
}, async (input) => UpdateCategoryBudgetTool.execute(input, api));

server.registerTool(UpdateCategoryTool.name, {
  title: "Update Category",
  description: UpdateCategoryTool.description,
  inputSchema: UpdateCategoryTool.inputSchema,
}, async (input) => UpdateCategoryTool.execute(input, api));

server.registerTool(UpdateTransactionTool.name, {
  title: "Update Transaction",
  description: UpdateTransactionTool.description,
  inputSchema: UpdateTransactionTool.inputSchema,
}, async (input) => UpdateTransactionTool.execute(input, api));

server.registerTool(UpdateTransactionsTool.name, {
  title: "Update Transactions",
  description: UpdateTransactionsTool.description,
  inputSchema: UpdateTransactionsTool.inputSchema,
}, async (input) => UpdateTransactionsTool.execute(input, api));

server.registerTool(BulkApproveTransactionsTool.name, {
  title: "Bulk Approve Transactions",
  description: BulkApproveTransactionsTool.description,
  inputSchema: BulkApproveTransactionsTool.inputSchema,
}, async (input) => BulkApproveTransactionsTool.execute(input, api));

server.registerTool(ListPayeesTool.name, {
  title: "List Payees",
  description: ListPayeesTool.description,
  inputSchema: ListPayeesTool.inputSchema,
}, async (input) => ListPayeesTool.execute(input, api));

server.registerTool(GetPayeeTool.name, {
  title: "Get Payee",
  description: GetPayeeTool.description,
  inputSchema: GetPayeeTool.inputSchema,
}, async (input) => GetPayeeTool.execute(input, api));

server.registerTool(UpdatePayeeTool.name, {
  title: "Update Payee",
  description: UpdatePayeeTool.description,
  inputSchema: UpdatePayeeTool.inputSchema,
}, async (input) => UpdatePayeeTool.execute(input, api));

server.registerTool(GetTransactionsTool.name, {
  title: "Get Transactions",
  description: GetTransactionsTool.description,
  inputSchema: GetTransactionsTool.inputSchema,
}, async (input) => GetTransactionsTool.execute(input, api));

server.registerTool(GetTransactionTool.name, {
  title: "Get Transaction",
  description: GetTransactionTool.description,
  inputSchema: GetTransactionTool.inputSchema,
}, async (input) => GetTransactionTool.execute(input, api));

server.registerTool(DeleteTransactionTool.name, {
  title: "Delete Transaction",
  description: DeleteTransactionTool.description,
  inputSchema: DeleteTransactionTool.inputSchema,
}, async (input) => DeleteTransactionTool.execute(input, api));

server.registerTool(ListCategoriesTool.name, {
  title: "List Categories",
  description: ListCategoriesTool.description,
  inputSchema: ListCategoriesTool.inputSchema,
}, async (input) => ListCategoriesTool.execute(input, api));

server.registerTool(GetCategoryTool.name, {
  title: "Get Category",
  description: GetCategoryTool.description,
  inputSchema: GetCategoryTool.inputSchema,
}, async (input) => GetCategoryTool.execute(input, api));

server.registerTool(GetMonthCategoryTool.name, {
  title: "Get Month Category",
  description: GetMonthCategoryTool.description,
  inputSchema: GetMonthCategoryTool.inputSchema,
}, async (input) => GetMonthCategoryTool.execute(input, api));

server.registerTool(ListAccountsTool.name, {
  title: "List Accounts",
  description: ListAccountsTool.description,
  inputSchema: ListAccountsTool.inputSchema,
}, async (input) => ListAccountsTool.execute(input, api));

server.registerTool(GetAccountTool.name, {
  title: "Get Account",
  description: GetAccountTool.description,
  inputSchema: GetAccountTool.inputSchema,
}, async (input) => GetAccountTool.execute(input, api));

server.registerTool(CreateAccountTool.name, {
  title: "Create Account",
  description: CreateAccountTool.description,
  inputSchema: CreateAccountTool.inputSchema,
}, async (input) => CreateAccountTool.execute(input, api));

server.registerTool(ListScheduledTransactionsTool.name, {
  title: "List Scheduled Transactions",
  description: ListScheduledTransactionsTool.description,
  inputSchema: ListScheduledTransactionsTool.inputSchema,
}, async (input) => ListScheduledTransactionsTool.execute(input, api));

server.registerTool(GetScheduledTransactionTool.name, {
  title: "Get Scheduled Transaction",
  description: GetScheduledTransactionTool.description,
  inputSchema: GetScheduledTransactionTool.inputSchema,
}, async (input) => GetScheduledTransactionTool.execute(input, api));

server.registerTool(CreateScheduledTransactionTool.name, {
  title: "Create Scheduled Transaction",
  description: CreateScheduledTransactionTool.description,
  inputSchema: CreateScheduledTransactionTool.inputSchema,
}, async (input) => CreateScheduledTransactionTool.execute(input, api));

server.registerTool(UpdateScheduledTransactionTool.name, {
  title: "Update Scheduled Transaction",
  description: UpdateScheduledTransactionTool.description,
  inputSchema: UpdateScheduledTransactionTool.inputSchema,
}, async (input) => UpdateScheduledTransactionTool.execute(input, api));

server.registerTool(DeleteScheduledTransactionTool.name, {
  title: "Delete Scheduled Transaction",
  description: DeleteScheduledTransactionTool.description,
  inputSchema: DeleteScheduledTransactionTool.inputSchema,
}, async (input) => DeleteScheduledTransactionTool.execute(input, api));

server.registerTool(ImportTransactionsTool.name, {
  title: "Import Transactions",
  description: ImportTransactionsTool.description,
  inputSchema: ImportTransactionsTool.inputSchema,
}, async (input) => ImportTransactionsTool.execute(input, api));

server.registerTool(ListMonthsTool.name, {
  title: "List Months",
  description: ListMonthsTool.description,
  inputSchema: ListMonthsTool.inputSchema,
}, async (input) => ListMonthsTool.execute(input, api));

server.registerTool(ListPayeeLocationsTool.name, {
  title: "List Payee Locations",
  description: ListPayeeLocationsTool.description,
  inputSchema: ListPayeeLocationsTool.inputSchema,
}, async (input) => ListPayeeLocationsTool.execute(input, api));

server.registerTool(GetPayeeLocationTool.name, {
  title: "Get Payee Location",
  description: GetPayeeLocationTool.description,
  inputSchema: GetPayeeLocationTool.inputSchema,
}, async (input) => GetPayeeLocationTool.execute(input, api));

server.registerTool(ListPayeeLocationsByPayeeTool.name, {
  title: "List Payee Locations By Payee",
  description: ListPayeeLocationsByPayeeTool.description,
  inputSchema: ListPayeeLocationsByPayeeTool.inputSchema,
}, async (input) => ListPayeeLocationsByPayeeTool.execute(input, api));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("YNAB MCP server running on stdio");
}

main().catch(console.error);
