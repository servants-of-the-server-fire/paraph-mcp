# paraph-mcp

MCP server for the [Paraph](https://paraph.dev) e-signature API. Lets Claude, Cursor, and other MCP-compatible AI tools fill PDFs and send them for signing.

## Install

```bash
npx paraph-mcp
```

Requires a Paraph API key. Get one free at [paraph.dev](https://paraph.dev).

## Configure

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "paraph": {
      "command": "npx",
      "args": ["-y", "paraph-mcp"],
      "env": {
        "PARAPH_API_KEY": "dg_your_key_here"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add paraph -- npx -y paraph-mcp
```

Then set `PARAPH_API_KEY` in your environment.

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "paraph": {
      "command": "npx",
      "args": ["-y", "paraph-mcp"],
      "env": {
        "PARAPH_API_KEY": "dg_your_key_here"
      }
    }
  }
}
```

## Tools

| Tool | Description |
|---|---|
| `get_account` | Get account info including plan and usage |
| `list_templates` | List available PDF templates |
| `get_template` | Get template details and field names |
| `create_request` | Fill a PDF and optionally send for signing |
| `list_requests` | List requests with optional status filter |
| `get_request` | Get request details and signer progress |
| `cancel_request` | Cancel a pending signing request |

## Example prompts

- "List my templates"
- "Fill the NDA template with employee_name=Jane Doe and send to jane@example.com for signing"
- "Show me all pending signing requests"
- "Cancel request abc-123"

## License

MIT
