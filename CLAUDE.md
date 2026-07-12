# Appraisal CRM — frontend

Commercial project built for a real client. Code goes to production — treat it accordingly.

**This repo is `appraisal-frontend`** — the single frontend monorepo (pnpm
workspaces + Turborepo, [ADR-008](../request-service/docs/adr/ADR-008-frontend-repo-structure.md)).
The backend is polyrepo (`request-service` is the reference for project-wide
conventions); each Go service has its own repo and CLAUDE.md.

## What it does

CRM for a property appraisal company. Full cycle: client submits request →
inspector visits the property → appraiser evaluates → client receives report.

## Layout

```
apps/
  client/     EXTERNAL public portal (:5173) — clients: submit / track a request
  office/     INTERNAL staff app    (:5174) — appraiser/inspector/admin, role-gated in-app
packages/
  ui/            design system (Button, Card, Badge, Field, StageRail, …; CSS-module tokens, dark/light)
  api-client/    hand-written typed clients for request/inspect/review services
  auth/          Keycloak OIDC (Auth Code + PKCE, popup login), role guards
  tsconfig/      shared TS configs
  eslint-config/ shared ESLint flat config
```

Internal `packages/*` are consumed as **source** via the workspace — no build
step; apps transpile them through Vite.

## Backend services the UI talks to

| Service         | Port | Env var                | Used by             |
|-----------------|------|------------------------|---------------------|
| request-service | 8080 | `VITE_REQUEST_API_URL` | client + office     |
| inspect-service | 8082 | `VITE_INSPECT_API_URL` | office              |
| review-service  | 8084 | `VITE_REVIEW_API_URL`  | office only         |
| Keycloak        | 8180 | `VITE_KEYCLOAK_*`      | both (realm `appraisal`) |

`reviewApiUrl` is optional in `createApiClient` — the client portal never talks
to review-service. All bearer tokens come from `useApi()` (never hand-roll fetch
with auth headers in features).

## Feature conventions (office is the reference)

- Feature folder per aggregate: `features/<name>/queries.ts` (react-query hooks)
  + table/row/detail components + CSS modules. Pages in `pages/` are thin wrappers.
- Query keys: `['office', '<plural>']` for lists, `['office', '<singular>', id]`
  for details; mutations `setQueryData` the detail and invalidate the list.
- Errors: `ApiError` from api-client; map statuses in the component
  (409 → "changed by someone else", 422 → domain rule message, 404 → not found).
- Role gating: route-level `RequireRole` + `useAuth().hasRole` for in-component
  affordances. Current user id: `user.profile.sub`.
- i18n: ru + en in `lib/i18n.ts`, ru is the source of truth; every user-facing
  string goes through `t()`. Dates/money via `lib/format.ts` (`formatDate`,
  `formatMoney` — money is NUMERIC-as-string from the backend, never float).
- S3 is a stub backend-side: file uploads register a key + PUT to a presigned
  URL that fails — show the honest "registered, file not stored" state, don't
  hide it.

## Branding — do not break

The client company is ООО «Авангард» (en: Avangard LLC). Brand name in UI is
**АВАНГАРД / AVANGARD** — never "Appraisal CRM" / "ОЦЕНКА". No tech-stack
mentions (Keycloak etc.) and no marketing filler in user-facing copy; sign-in
screens keep just a title + one practical line.

## Commands

```bash
pnpm dev         # both apps (client :5173, office :5174)
pnpm build       # turbo build
pnpm typecheck   # turbo typecheck — run before committing
pnpm lint
```

Backend must be up first (`../infra`, then each service's compose) — see the
README for the one-time Keycloak SPA client tweak.

## Workflow

- Tasks tracked in Jira, project **ACRM** (mdrslv.atlassian.net)
- Branch from `dev`: `feature/<scope>` / `fix/<scope>`; PR into `dev`
- `main` is the release branch — updated by merging `dev` → `main`; never PR features directly into `main`
- Conventional commits with the Jira key: `feat(office): ... (ACRM-XX)`
