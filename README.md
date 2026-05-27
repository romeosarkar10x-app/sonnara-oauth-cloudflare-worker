# my-worker-api

A simple JSON API running on Cloudflare Workers, deployed automatically via GitHub Actions.

## Endpoints

| Method | Path     | Description                    |
|--------|----------|--------------------------------|
| GET    | `/`      | Hello message + version        |
| GET    | `/health`| Health check with timestamp    |
| POST   | `/echo`  | Echoes back the JSON body      |

## Local Development

```bash
npm install
npm run dev
```

This starts a local dev server at `http://localhost:8787`.

## Deployment Setup

Pushes to `main` auto-deploy via GitHub Actions. One-time setup:

### 1. Get your Cloudflare credentials

- **Account ID** — found on the Workers & Pages overview page in the [Cloudflare dashboard](https://dash.cloudflare.com).
- **API Token** — create one at [My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens). Use the **"Edit Cloudflare Workers"** template.

### 2. Add GitHub repository secrets

Go to your repo → **Settings → Secrets and variables → Actions** and add:

| Secret name              | Value                     |
|--------------------------|---------------------------|
| `CLOUDFLARE_API_TOKEN`   | Your API token            |
| `CLOUDFLARE_ACCOUNT_ID`  | Your account ID           |

### 3. Push to main

```bash
git push origin main
```

The workflow will deploy your Worker and it'll be live at `https://my-worker-api.<your-subdomain>.workers.dev`.
