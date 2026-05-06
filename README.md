# AI Task Processing Platform (Application Repo)

## Stack
- Frontend: React (Vite)
- Backend: Node.js + Express + MongoDB + Redis
- Worker: Python

## Features Implemented
- User registration/login with JWT
- Task create + run flow
- Async Redis queue processing
- Task statuses: `pending`, `running`, `success`, `failed`
- Task logs + result display
- Helmet + rate limiting + bcrypt

## Local Run (Docker Compose)
1. Copy env files:
   - `backend/.env.example` -> `backend/.env`
   - `worker/.env.example` -> `worker/.env`
2. Start:
   - `docker compose up --build`
3. Open UI:
   - `http://localhost:3000`

## API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/tasks/:id/run`

## CI/CD
- Lint + build checks
- Docker image build and push
- Auto-update infra repo image tags
- Workflow file: `.github/workflows/ci-cd.yml`

## Notes
- Replace placeholder Docker Hub and infra repo URLs before use.
- Keep JWT secret in Kubernetes Secret / GitHub Secrets only.
