# Filesystem Agent

A Next.js app that runs a tool-using AI agent over call transcript files.

## What It Does

- Renders a chat UI (`app/form.tsx`) using `@ai-sdk/react`.
- Sends user prompts to `POST /api` (`app/api/route.ts`).
- Streams model responses and tool activity back to the client.
- Uses a sandboxed bash tool to inspect transcript files loaded from `lib/calls/`.

## Architecture

1. The client sends chat messages to `/api`.
2. The API route extracts only the last user text message and passes it to the agent.
3. `lib/agent.ts` creates a `ToolLoopAgent` with:
   - model: `openai("gpt-5.2")`
   - instructions focused on answering questions about customer calls
   - tool: `bashTool`
4. On startup, the app creates a Vercel sandbox and copies `lib/calls/*.md` into `calls/` inside the sandbox.
5. `lib/tools.ts` defines `bashTool`, which executes shell commands in that sandbox and returns `stdout`, `stderr`, and `exitCode`.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create environment variables:

```bash
cp .env.example .env.local
```

3. Set `OPENAI_API_KEY` in `.env.local`.

4. Run the app:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

- `pnpm dev` - start dev server
- `pnpm build` - production build
- `pnpm start` - run production server
- `pnpm lint` - run Biome checks
- `pnpm format` - format with Biome

## Project Layout

- `app/page.tsx` - entry page
- `app/form.tsx` - chat UI and streamed tool output rendering
- `app/api/route.ts` - API endpoint that invokes the agent
- `lib/agent.ts` - sandbox setup + `ToolLoopAgent` configuration
- `lib/tools.ts` - bash tool definition
- `lib/calls/*.md` - source transcript files analyzed by the agent

## Current Behavior Notes

- The API currently passes only the last user message as prompt context.
- The input form is only shown before the first message (`messages.length === 0`).
- The input value is not cleared after submit (`setInput(input)` keeps the same text).

## Example Prompts

- `Summarize pricing concerns across all calls.`
- `What changed between the first and second calls?`
- `List all participants and their roles from call 3.`
