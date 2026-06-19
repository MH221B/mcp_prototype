import { app } from "./server.js";

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
