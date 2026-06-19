import { app, shutdown } from "./server.js";

const PORT = Number(process.env.PORT ?? 3000);

const httpServer = app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("shutting down");
  httpServer.close();
  await shutdown();
  process.exit(0);
});
