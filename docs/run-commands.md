# Run Commands (Web, Worker, Plugin)

Repo root:

```bash
cd "/Users/MAC/Desktop/Desktop - Poe's MacBook Pro/Engineering/Builds/code-relay"
```

## 1) Install (once)

```bash
npm install
```

## 2) Web dashboard (Next.js)

```bash
npm run dev:web
```

URL: `http://localhost:3000`

If port 3000 is busy:

```bash
kill -9 $(lsof -t -iTCP:3000 -sTCP:LISTEN)
```

## 3) Worker

In another terminal:

```bash
npm run dev:worker
```

## 4) Framer plugin (Vite dev server)

In another terminal:

```bash
cd apps/plugin
npm install
npm run dev
```

## Optional: wipe local jobs/artifacts (clean slate)

From repo root:

```bash
rm -rf .coderelay/jobs .coderelay/artifacts
```
