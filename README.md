# Deliwer — AI-Powered Delivery & Safety

An end-to-end demo platform that fuses an Express + MongoDB backend with a Vite + React frontend to orchestrate delivery fleets, monitor safety incidents, and stream realtime telemetry via Socket.IO.

![Deliwer dashboard placeholder](./frontend/public/logo.svg)

## Tech Stack

- **Frontend**: React 18, Vite 7, TailwindCSS, Zustand, Socket.IO Client, MapLibre GL, Zod, Axios.
- **Backend**: Express.js, MongoDB/Mongoose, Socket.IO, JWT (HTTP-only cookie), Helmet, CORS, rate limiting, Pino logging, Zod validation.
- **Testing**: Vitest + React Testing Library (frontend), Jest + Supertest + MongoDB Memory Server (backend).
- **Deployment Targets**: Vercel (frontend), Render (backend).

## Repository Structure

```
root/
├─ backend/        # Express API, Socket.IO, MongoDB models, Jest tests
├─ frontend/       # Vite React app with TailwindCSS and Vitest tests
└─ README.md       # This guide
```

## Getting Started

### Prerequisites

- Node.js 20+ (Render deploys with Node 22)
- npm 9+
- MongoDB Atlas cluster (or local MongoDB for development/testing)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI, JWT secret, admin bootstrap credentials, etc.
npm run seed   # optional: populate demo data
npm run dev    # start Express + Socket.IO server
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_BASE_URL and VITE_SOCKET_URL to the backend URL
npm run dev    # launch Vite dev server
```

Access the dashboard at http://localhost:5173.

## Environment Variables

| Location  | Variable | Description |
|-----------|----------|-------------|
| backend   | `PORT` | HTTP port (default 8080) |
| backend   | `NODE_ENV` | `development`, `test`, or `production` |
| backend   | `CORS_ALLOWLIST` | Comma-separated origins allowed to hit the API |
| backend   | `JWT_SECRET` | Secret used to sign JWT auth cookies |
| backend   | `JWT_EXPIRES_IN` | JWT lifetime (e.g. `7d`) |
| backend   | `COOKIE_SECURE` | `true` in production to enforce secure cookies |
| backend   | `MONGODB_URI` | MongoDB Atlas connection string |
| backend   | `MONGODB_URI_TEST` | (Optional) URI for automated tests |
| backend   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed admin credentials |
| backend   | `SEED_MODE` | `demo` to enable movement + random TTL decay |
| frontend  | `VITE_API_BASE_URL` | Base URL for REST requests |
| frontend  | `VITE_SOCKET_URL` | Base URL for Socket.IO namespace |
| frontend  | `VITE_MAPTILES_URL` | Tile source for MapLibre (OSM by default) |

## Scripts

### Backend

- `npm run dev` – Start Express server with Nodemon + Socket.IO
- `npm run start` – Start server in production mode
- `npm run seed` – Seed MongoDB with demo drivers, zones, incidents, admin user
- `npm run test` – Run Jest + Supertest suite (uses in-memory MongoDB when URI not provided)
- `npm run lint` / `npm run format` – ESLint and Prettier helpers

### Frontend

- `npm run dev` – Start Vite dev server
- `npm run build` – Build production assets
- `npm run start` – Preview built assets
- `npm run test` – Run Vitest unit tests
- `npm run lint` / `npm run format` – ESLint and Prettier helpers

## Testing

Run tests from each workspace:

```bash
cd backend && npm run test
cd frontend && npm run test
```

## Deployment

### Backend on Render

1. Connect the repository to Render and select the `backend` directory.
2. Use the provided `render.yaml` (Node 22, build `npm install && npm run build`, start `node src/server.js`).
3. Configure environment variables in the Render dashboard (matching `.env.example`).
4. Verify the `/health` endpoint returns `{ "status": "ok" }`.

### Frontend on Vercel

1. Deploy the `frontend` directory with the default Vite build (`npm run build`).
2. Configure Vercel environment variables (`VITE_API_BASE_URL`, `VITE_SOCKET_URL`, `VITE_MAPTILES_URL`) pointing to the Render backend URL.
3. Set the output directory to `dist` (see `vercel.json`).

### Deployment Order

1. **Deploy backend to Render first** to obtain the public API base URL.
2. **Update Vercel environment variables** with the Render URL, then deploy the frontend.

## Security Notes

- JWT tokens are issued server-side and stored in HTTP-only cookies to mitigate XSS.
- Helmet, CORS origin allow-list, and express-rate-limit provide layered protection.
- Validation is enforced with Zod on every request body.
- Socket connections reuse the same origin controls as REST requests.

## Roadmap

- Mobile companion app via React Native / Expo that reuses the same Socket.IO streams and REST APIs.
- AI "signal" ingestion from social media, RSS, and traffic APIs for proactive zone creation.
- Fine-grained RBAC and SSO integration for enterprise fleets.

## Config Notes / Open Questions

- Should the dashboard auto-connect to the live socket on page load or wait for a manual connect?
- For customer tracking, should the view hide unrelated drivers/incidents beyond a certain radius?
- When creating incidents, should we keep the quick modal or support map-based selection with severity sliders?

## Final Steps Checklist

1. Populate `.env` files (see examples above) with real secrets:
   - `MONGODB_URI`, `JWT_SECRET`, `CORS_ALLOWLIST`
   - Frontend `VITE_API_BASE_URL`, `VITE_SOCKET_URL`
2. Deploy backend (Render) → confirm `/health`.
3. Configure frontend envs (Vercel) with the Render URL and deploy dashboard.

Enjoy orchestrating deliveries with Deliwer! 🚚
