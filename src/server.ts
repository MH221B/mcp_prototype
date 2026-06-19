import { randomUUID } from "node:crypto";
import express, { type Request, type Response } from "express";
import cors from "cors";
import { auth } from "./auth.js";

export const app = express();
app.use(cors());
app.use(express.json());

app.post("/get-api-key", async (req: Request, res: Response) => {
  try {
    const userId = randomUUID();
    const name =
      typeof req.body?.name === "string" && req.body.name.length > 0
        ? req.body.name
        : "default";

    await auth.api.signUpEmail({
      body: {
        email: `${userId}@anon.local`,
        password: randomUUID(),
        name: "anonymous",
      },
      asResponse: false,
    });

    const result = (await auth.api.createApiKey({
      body: { userId, name },
      asResponse: false,
    })) as { key: string; id: string; name: string };

    res.json({
      userId,
      apiKey: result.key,
      keyId: result.id,
      name: result.name,
    });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

type Candidate = {
  candidateNo: string;
  name: string;
  role: string;
  status: "applied" | "screening" | "interview" | "offer" | "rejected";
};

const candidates: Candidate[] = [
  { candidateNo: "C-001", name: "Alice Tan", role: "Backend Engineer", status: "interview" },
  { candidateNo: "C-002", name: "Budi Santoso", role: "Frontend Engineer", status: "screening" },
  { candidateNo: "C-003", name: "Chitra Devi", role: "Data Analyst", status: "applied" },
  { candidateNo: "C-004", name: "Daniel Ong", role: "DevOps Engineer", status: "offer" },
  { candidateNo: "C-005", name: "Erika Lim", role: "Product Manager", status: "rejected" },
];

app.get("/candidates", (_req: Request, res: Response) => {
  res.json(candidates);
});

app.post("/candidates/delete", (req: Request, res: Response) => {
  const candidateNo = req.body?.candidateNo;
  if (typeof candidateNo !== "string" || candidateNo.length === 0) {
    res.status(400).json({ error: "candidateNo is required" });
    return;
  }
  const index = candidates.findIndex((c) => c.candidateNo === candidateNo);
  if (index === -1) {
    res.status(404).json({ error: `candidate ${candidateNo} not found` });
    return;
  }
  const [removed] = candidates.splice(index, 1);
  res.json({ ok: true, removed });
});
