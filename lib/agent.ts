import { openai } from "@ai-sdk/openai";
import { ToolLoopAgent } from "ai";

export const agent = new ToolLoopAgent({
  model: openai("gpt-5.2"),
  instructions: "",
  tools: {},
});
