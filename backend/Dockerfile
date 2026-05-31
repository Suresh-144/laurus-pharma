# Stage 1: Build & Install Dependencies

FROM node:18-alpine3.20 AS builder

RUN apk update && apk upgrade && apk cache clean && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

# Copy package configuration files
COPY package*.json ./

# Install all dependencies (needed for any compilation/build tools if present)
RUN npm ci

# Copy the rest of your application code
COPY . .

# Prune development dependencies to keep the image lightweight
RUN npm prune --production


# Stage 2: Final Production Image

FROM node:18-alpine3.20 AS runner

WORKDIR /usr/src/app

# Set production environment flags
ENV NODE_ENV=production
ENV PORT=5000

# Copy node_modules and source code from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/server.js ./server.js
COPY --from=builder /usr/src/app/routes ./routes
COPY --from=builder /usr/src/app/models ./models
COPY --from=builder /usr/src/app/middleware ./middleware

# Security Best Practice: Run container as a non-root user
USER node

# Expose the application port
EXPOSE 5000

# Define entrypoint execution
CMD ["node", "server.js"]
