# appraisal-frontend

Frontend monorepo for the Appraisal CRM (pnpm workspaces + Turborepo). See
[ADR-008](../request-service/docs/adr/ADR-008-frontend-repo-structure.md) for the
rationale.

## Layout

```
apps/
  client/     EXTERNAL public portal  — request-service (submit / track a request)
  office/     INTERNAL staff app      — request-service + inspect-service, role-gated in-app
packages/
  ui/          shared design system / components
  api-client/  typed clients for request-service + inspect-service
  auth/        Keycloak OIDC (Auth Code + PKCE), token store, role guards
  tsconfig/    shared TypeScript configs
  eslint-config/ shared ESLint flat config
```

Internal `packages/*` are consumed as **source** (no build step) via the workspace;
apps transpile them through Vite.

## Prerequisites

- Node ≥ 20, pnpm 11
- Backend running (see repo root): `../infra`, `../request-service`, `../inspect-service`
- Keycloak realm `appraisal` bootstrapped (see `../request-service/docs/onboarding.md`)

## Keycloak client — one-time tweak for the SPA

The shared `appraisal-frontend` client was created for the password grant. Browser
apps use **Authorization Code + PKCE**, so the client also needs the standard flow
and redirect/web-origin entries:

```bash
KC="docker exec appraisal-keycloak /opt/keycloak/bin/kcadm.sh"
$KC config credentials --server http://localhost:8080 --realm master --user admin --password admin
CID=$($KC get clients -r appraisal -q clientId=appraisal-frontend --fields id --format csv --noquotes | tail -1)
$KC update clients/$CID -r appraisal \
  -s standardFlowEnabled=true \
  -s 'redirectUris=["http://localhost:5173/*","http://localhost:5174/*"]' \
  -s 'webOrigins=["http://localhost:5173","http://localhost:5174"]'
```

## Commands

```bash
pnpm install            # install workspace deps
pnpm dev                # run all apps (client :5173, office :5174)
pnpm --filter client dev
pnpm --filter office dev
pnpm build              # build all apps
pnpm typecheck
pnpm lint
```

Copy `.env.example` to `.env` in each app under `apps/` before running.
