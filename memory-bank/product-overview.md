# Product Overview

## Project Name
AI Engineering Financial Dashboard

## Purpose
This project provides a full-stack financial dashboard for engineering teams, enabling visualization and analysis of key financial metrics, KPIs, and trends. It is designed for rapid prototyping, educational use, and as a template for production-grade dashboards.

## Architecture
- **Frontend:** React (TypeScript, Vite, Tailwind CSS)
- **Backend:** FastAPI (Python)
- **Containerization:** Docker Compose for orchestration
- **Testing:** pytest (backend), Vitest (frontend)

## Key Features
- KPI cards and dashboard visualizations
- Income/outcome and profit percentage charts
- Mock data for development and testing
- REST API endpoints for financial data
- Environment-based configuration
- Strong typing and test coverage

## Main Folders & Entry Points
- `frontend/` — React SPA, entry: `src/main.tsx`, main UI: `src/App.tsx`
- `backend/` — FastAPI app, entry: `app/main.py`, API routes: `app/routes.py`
- `.agents/rules/` — Project-specific coding and process rules
- `memory-bank/` — Knowledge and documentation store (this file)

## Services
- **Frontend:** Runs on Vite dev server, proxies API requests to backend
- **Backend:** Runs Uvicorn server, exposes REST API
- **Docker Compose:** Orchestrates both services for local development

## Notable Practices
- Clear separation of frontend and backend
- Actionable rule files for standards enforcement
- Automated tests for endpoints and UI logic
- Use of mock data for safe prototyping

## Risks & Mitigations
- Debug features and mock data must be disabled in production
- Dependency versions should be pinned for reproducibility
- CORS and proxy settings should be environment-aware

## How to Run
- Use Docker Compose: `docker compose up --build`
- Or run frontend and backend separately with `npm run dev` and `uvicorn app.main:app`

## Evidence
- Source: `README.md`, `backend/app/main.py`, `frontend/src/App.tsx`, `docker-compose.yml`, `.agents/rules/`
- Verified by direct inspection of repository structure and code
