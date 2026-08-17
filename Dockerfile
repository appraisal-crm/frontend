FROM node:22-alpine AS base
RUN npm install -g pnpm@10.5.2

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/client/package.json ./apps/client/
COPY apps/office/package.json ./apps/office/
COPY packages/ui/package.json ./packages/ui/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/auth/package.json ./packages/auth/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/eslint-config/package.json ./packages/eslint-config/

RUN pnpm install

COPY . .

FROM base AS client
WORKDIR /app/apps/client
EXPOSE 5173
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5173"]

FROM base AS office
WORKDIR /app/apps/office
EXPOSE 5174
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5174"]
