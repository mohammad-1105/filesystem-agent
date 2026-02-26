import { openai } from "@ai-sdk/openai";
import { Sandbox } from "@vercel/sandbox";
import { ToolLoopAgent } from "ai";
import { createBashTool } from "./tools";

const sandbox = await Sandbox.create();
export const agent = new ToolLoopAgent({
  model: openai("gpt-5.2"),
  instructions: "",
  tools: {
    bashTool: createBashTool(sandbox),
  },
});
