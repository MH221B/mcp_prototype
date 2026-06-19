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
