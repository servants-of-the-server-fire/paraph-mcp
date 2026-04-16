#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  Configuration,
  AccountApi,
  TemplatesApi,
  RequestsApi,
} from "paraph";
import type { SignerInput, RequestStatus } from "paraph";

const apiKey = process.env.PARAPH_API_KEY;
if (!apiKey) {
  console.error("PARAPH_API_KEY environment variable is required");
  process.exit(1);
}

const config = new Configuration({
  accessToken: apiKey,
  basePath: process.env.PARAPH_BASE_URL || "https://paraph.dev/api/v1",
});

const accountApi = new AccountApi(config);
const templatesApi = new TemplatesApi(config);
const requestsApi = new RequestsApi(config);

const server = new McpServer({
  name: "paraph",
  version: "0.1.0",
});

server.tool("get_account", "Get account info including plan and usage", {}, async () => {
  const res = await accountApi.getAccount();
  return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
});

server.tool(
  "list_templates",
  "List all PDF templates available for filling and signing",
  {
    page: z.number().optional().describe("Page number (default 1)"),
    page_size: z.number().optional().describe("Results per page (default 20, max 100)"),
  },
  async ({ page, page_size }) => {
    const res = await templatesApi.listTemplates({ page, pageSize: page_size });
    return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
  },
);

server.tool(
  "get_template",
  "Get template details including form field names and signer labels",
  {
    id: z.string().uuid().describe("Template ID"),
  },
  async ({ id }) => {
    const res = await templatesApi.getTemplate({ id });
    return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
  },
);

server.tool(
  "create_request",
  "Fill a PDF template and optionally send it for e-signing. Omit signers for fill-only.",
  {
    template_id: z.string().uuid().describe("Template ID to fill"),
    fields: z
      .record(z.string(), z.string())
      .optional()
      .describe("Map of form field names to values"),
    signers: z
      .record(
        z.string(),
        z.object({
          email: z.string().email().describe("Signer email address"),
          override_signature_url: z
            .string()
            .url()
            .optional()
            .describe("Pre-provided signature image URL (skips email flow)"),
        }),
      )
      .optional()
      .describe("Map of signer label to signer config. Omit for fill-only."),
    title: z.string().optional().describe("Display title for the request"),
    message: z.string().optional().describe("Custom message in signing emails"),
    metadata: z
      .record(z.string(), z.string())
      .optional()
      .describe("Arbitrary key-value pairs (max 10)"),
  },
  async ({ template_id, fields, signers, title, message, metadata }) => {
    const signerMap = signers as Record<string, SignerInput> | undefined;
    const res = await requestsApi.createRequest({
      createRequestRequest: {
        template_id,
        fields,
        signers: signerMap,
        title,
        message,
        metadata,
      },
    });
    return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
  },
);

server.tool(
  "list_requests",
  "List signing requests with optional filters",
  {
    page: z.number().optional().describe("Page number (default 1)"),
    page_size: z.number().optional().describe("Results per page (default 20, max 100)"),
    status: z
      .enum(["success", "error", "pending", "cancelled"])
      .optional()
      .describe("Filter by status"),
  },
  async ({ page, page_size, status }) => {
    const res = await requestsApi.listRequests({
      page,
      pageSize: page_size,
      status: status as RequestStatus | undefined,
    });
    return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
  },
);

server.tool(
  "get_request",
  "Get request details including signer status and signing links",
  {
    id: z.string().uuid().describe("Request ID"),
  },
  async ({ id }) => {
    const res = await requestsApi.getRequest({ id });
    return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
  },
);

server.tool(
  "cancel_request",
  "Cancel a pending signing request",
  {
    id: z.string().uuid().describe("Request ID to cancel"),
  },
  async ({ id }) => {
    const res = await requestsApi.cancelRequest({ id });
    return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
