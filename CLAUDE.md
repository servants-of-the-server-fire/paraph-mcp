# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project

MCP server for the Paraph e-signature API. Exposes Paraph API operations as MCP tools so AI assistants can fill and sign documents on behalf of users.

## Stack

- **Language**: TypeScript (Node.js, ESM)
- **MCP SDK**: `@modelcontextprotocol/sdk`
- **Paraph SDK**: `paraph` (symlinked to `../paraph-ts` in dev)

## Common Commands

```bash
# Build
npm run build

# Dev (no build step)
npm run dev

# Publish
npm publish
```

## Git Workflow

- Always create a feature branch for changes — never commit directly to main
- Use `git worktree add ../paraph-mcp-<branch> -b <branch>` to work in an isolated directory
- Push the feature branch and create a PR for review before merging
- Never use `git push` to main directly
