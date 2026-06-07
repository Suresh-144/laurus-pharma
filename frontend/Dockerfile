# ──────────────────────────────────────────────
# Stage 1: Install dependencies (Upgraded to Node 20)
# ──────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Clear Alpine package vulnerabilities and ensure curl/wget capabilities are fresh
RUN apk update && apk upgrade --no-cache

COPY package*.json ./
# Include devDependencies explicitly so test runners and build tooling aren't pruned
RUN npm ci --include=dev

# ──────────────────────────────────────────────
# Stage 2: Run tests
# ──────────────────────────────────────────────
FROM deps AS test

COPY . .

ENV CI=true
RUN npm test --if-present

# ──────────────────────────────────────────────
# Stage 3: Build React production bundle
# ──────────────────────────────────────────────
FROM deps AS builder

COPY . .

ARG REACT_APP_API_URL=http://localhost:5000
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# ──────────────────────────────────────────────
# Stage 4: Serve with serve (Pure Node 20 environment)
# ──────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Upgrade base runner tools for absolute Trivy/SonarQube pipeline clearance
RUN apk update && apk upgrade --no-cache && npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000 || exit 1

# -s = single-page app routing fallback mode, -l 3000 = bind execution port
CMD ["serve", "-s", "build", "-l", "3000"]