# Tech Stack Overview

## Frontend
- **Framework:** React
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Testing:** Vitest
- **Key Dependencies:**
  - react
  - react-dom
  - vite
  - tailwindcss
  - @testing-library/react

## Backend
- **Framework:** FastAPI
- **Language:** Python 3.11+
- **Server:** Uvicorn
- **Testing:** pytest
- **Key Dependencies:**
  - fastapi
  - uvicorn
  - pydantic
  - pytest
  - debugpy (for debugging)

## Infrastructure
- **Containerization:** Docker, Docker Compose
- **Orchestration:** docker-compose.yml (coordinates frontend and backend)
- **Networking:**
  - Frontend proxies API requests to backend
  - CORS enabled in backend

## Tooling
- **Linting:** ESLint (frontend)
- **Type Checking:** TypeScript (frontend)
- **Dev Tools:** debugpy (backend), Vite Dev Server (frontend)
- **Automation:** npm scripts, Docker Compose

## Key Files
- `frontend/package.json` — Frontend dependencies and scripts
- `frontend/vite.config.ts` — Vite and proxy config
- `frontend/tsconfig.json` — TypeScript config
- `backend/requirements.txt` — Backend dependencies
- `backend/Dockerfile` — Backend container setup
- `docker-compose.yml` — Service orchestration

## Evidence
- All information is based on direct inspection of repository files and configuration.
