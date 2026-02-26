import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { agent } from "@/lib/agent";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Extract the last user message as the prompt
  const lastMessage = messages[messages.length - 1];
  const prompt =
    lastMessage?.parts
      ?.filter(
        (part): part is { type: "text"; text: string } => part.type === "text",
      )
      .map((part) => part.text)
      .join("\n") || "";

  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      async execute({ writer }) {
        try {
          const stream = await agent.stream({ prompt });
          writer.merge(stream.toUIMessageStream());
        } catch (error) {
          console.log(`Agent Error: ${error}`);
          writer.write({
            type: "text-start",
            id: "error",
          });

          writer.write({
            type: "text-delta",
            id: "error",
            delta:
              "An error occurred while processing your request. Please try again later.",
          });

          writer.write({
            type: "text-end",
            id: "error",
          });
        }
      },
    }),
  });
}
