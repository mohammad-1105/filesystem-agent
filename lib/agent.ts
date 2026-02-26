import fs from "node:fs/promises";
import path from "node:path";
import { openai } from "@ai-sdk/openai";
import { Sandbox } from "@vercel/sandbox";
import { ToolLoopAgent } from "ai";
import { createBashTool } from "./tools";

const INSTRUCTIONS = `
You are a helpful assistant that answers questions about customer calls. Use bashTool to explore the files and find relevant information pertaining to the user's query. Using the information you find, craft a response for the user and output it as text.
`;

const sandbox = await Sandbox.create();

const loadSandboxFiles = async (sandbox: Sandbox) => {
  const callsDir = path.join(process.cwd(), "lib", "calls");
  const callFiles = await fs.readdir(callsDir);

  for (const file of callFiles) {
    const filePath = path.join(callsDir, file);
    const buffer = await fs.readFile(filePath);

    await sandbox.writeFiles([{ path: `calls/${file}`, content: buffer }]);
  }
};

await loadSandboxFiles(sandbox);

export const agent = new ToolLoopAgent({
  model: openai("gpt-5.2"),
  instructions: INSTRUCTIONS,
  tools: {
    bashTool: createBashTool(sandbox),
  },
});
