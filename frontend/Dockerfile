# ──────────────────────────────────────────────
# Stage 1: Install dependencies
# ──────────────────────────────────────────────
FROM node:18-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

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
# Stage 4: Serve with serve (pure Node, no Nginx)
# ──────────────────────────────────────────────
FROM node:18-alpine AS runner

# 'serve' is a zero-config static file server by Vercel
RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/build ./build

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000 || exit 1

# -s = single-page app mode (falls back to index.html for all routes)
# -l 3000 = listen on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]
