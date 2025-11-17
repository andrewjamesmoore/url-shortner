# URL Shortener – Node.js + Express

A simple URL shortener built to experiment with **Express** and **Node.js**.

This project is meant to be a low-key way to practice backend concepts like:

* Handling HTTP requests with Express
* Storing data temporarily in Redis
* Generating random, secure short codes with Node’s `crypto`
* Testing backend APIs directly with `curl` or browser DevTools

---

## Features

* Shorten any URL to a random 6-character code
* Redirect short URLs to the original URL
* Uses Redis for fast key-value storage (just for testing)
* Supports testing via API calls — no front-end (intentionally trying to not focus on front-end!)

---

## Example Code Snippets

### Generating short codes

```ts
import crypto from "crypto";

export function codeGen(length: number = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(length)]
    .map(() => chars[crypto.randomInt(chars.length)])
    .join("");
}
```

### Shorten a URL

```ts
app.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ error: "URL is required" });

  const shortCode = codeGen();
  await redisClient.set(shortCode, originalUrl, { EX: 60 * 60 * 24 });

  res.json({ shortUrl: `http://localhost:3000/${shortCode}` });
});
```

### Redirect a short URL

```ts
app.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;
  const originalUrl = await redisClient.get(shortCode);

  if (originalUrl) res.redirect(originalUrl);
  else res.status(404).send("Short URL not found");
});
```

---

## Testing with `curl`

* **Shorten a URL:**

```bash
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com"}'
```

* **Follow a short URL** (replace `abc123` with the generated code):

```bash
curl -v http://localhost:3000/abc123
```
---

## Notes

* Short codes are generated securely with `crypto.randomInt()`
* TTL can be adjusted or removed for permanent URLs (or use a DB)
* No front-end — the focus is on backend learning and API experimentation

---

This is a **minimal, experimental project** — just for learning and testing Express, Redis..
