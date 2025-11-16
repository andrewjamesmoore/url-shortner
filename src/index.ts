import express, { type Request, type Response } from "express";
import cors from "cors";
import redisClient from "./redisClient";
import { codeGen } from "./utils/codeGen";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/shorten", async (req: Request, res: Response) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ error: "URL is required" });
  const shortCode = codeGen();
  // TTL for testing
  const TTL_24_HOURS = 24 * 60 * 60;
  await redisClient.set(shortCode, originalUrl, { EX: TTL_24_HOURS });
  res.json({ shortUrl: `http://localhost:3000/${shortCode}` });
});

app.get("/:shortCode", async (req: Request, res: Response) => {
  const { shortCode } = req.params;

  if (!shortCode) return res.status(400).send("Short code is required");

  const originalUrl = await redisClient.get(shortCode);

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send("Short URL not found");
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
