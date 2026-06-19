import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export type Candidate = {
  candidateNo: string;
  name: string;
  role: string;
  status: "applied" | "screening" | "interview" | "offer" | "rejected";
};

export const createMcpServer = (candidates: Candidate[]): McpServer => {
  const server = new McpServer({
    name: "jobblyAI-Candidates",
    version: "1.0.0",
  });

  server.registerTool(
    "list_candidates",
    {
      description: "Get a list of all current job applicants and their statuses",
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () => ({
      content: [{ type: "text", text: JSON.stringify(candidates, null, 2) }],
    })
  );

  server.registerTool(
    "delete_candidate",
    {
      description: "Remove a candidate from the system",
      inputSchema: {
        candidateNo: z.string().describe("The exact ID of the candidate, e.g. 'C-001'"),
      },
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ candidateNo }) => {
      const index = candidates.findIndex((c) => c.candidateNo === candidateNo);
      if (index === -1) {
        return {
          isError: true,
          content: [{ type: "text", text: `Error: Could not find candidate ${candidateNo}` }],
        };
      }
      const [removed] = candidates.splice(index, 1);
      const name = removed?.name ?? candidateNo;
      return {
        content: [{ type: "text", text: `Success: Removed ${name} from the database.` }],
      };
    }
  );

  return server;
};
