# Repository Guidelines

## Project Structure & Module Organization

`pingcode-mcp` is a TypeScript MCP server that exposes PingCode project-management operations to AI clients.

- `src/index.ts` - MCP entry point; declares every tool in `ListToolsRequestSchema` and dispatches it in `CallToolRequestSchema`.
- `src/tools/login.ts` - Playwright-based browser login (`login`, `logout`, `check_auth`).
- `src/tools/work-items.ts` - Work item, release, search, and bug-field tools.
- `src/api/pingcode-client.ts` - axios client using cookie auth; holds `PRIORITY_MAP`.
- `src/types/pingcode.ts` - Shared types (`WorkItem`, `Credentials`, `CookieData`).
- `src/utils/credentials.ts` - Reads/writes `~/.pingcode-mcp/credentials.json`.
- `dist/` - `tsc` output, git-ignored and never edited by hand.

Keep `src/` TypeScript-only. `src/types/pingcode.js` and `src/utils/credentials.js` are stale compiled leftovers, not sources.

## Build, Test, and Development Commands

```bash
npm install                        # install dependencies
npx playwright install chromium    # required once for browser login
npm run dev                        # run src/index.ts directly via tsx
npm run build                      # type-check and emit to dist/
npm start                          # run the built server (node dist/index.js)
```

## Coding Style & Naming Conventions

- 2-space indentation, single quotes, semicolons, trailing commas in multi-line literals.
- ESM only: relative imports must carry the `.js` extension (`./tools/login.js`); use `import type` for type-only imports.
- `strict` mode is on; avoid `any` and non-null assertions.
- Naming: `camelCase` functions/variables, `PascalCase` types, `SCREAMING_SNAKE_CASE` constants (`PRIORITY_MAP`, `STATE_TYPE_MAP`), `snake_case` MCP tool names.
- Write JSDoc/inline comments in Chinese to match the existing codebase.
- Adding a tool means three edits: the tool schema list, the handler switch in `src/index.ts`, and the implementation in `src/tools/`.

## Testing Guidelines

No test framework or linter is configured yet. Verify changes with `npm run build`, then `npm start` and exercise the tool from a real MCP client. For local iteration, point the client at `npx tsx /absolute/path/to/src/index.ts`. Document which tools you exercised and against which PingCode domain, since login needs an interactive browser and cannot run in CI.

## Commit & Pull Request Guidelines

History uses Conventional Commit prefixes with Chinese descriptions, e.g. `feat: 添加修复后询问是否更新字段的功能`, `chore: 更新描述`, `version: 1.0.0 -> 1.0.1`. Keep one logical change per commit.

PRs should state the motivation, list affected tools, include manual verification steps, and link related issues. Never commit `dist/`, credentials, or `chrome-profile/`.

## Security & Configuration Tips

- `PINGCODE_DOMAIN` selects the tenant; default is `neuralgalaxy.pingcode.com`.
- Credentials and the Chrome profile live in `~/.pingcode-mcp/`; redact cookies and tokens from logs, issues, and screenshots.
