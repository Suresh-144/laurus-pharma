# ==========================================
# Stage 1: Build & Compile the React App
# ==========================================
FROM node:18-alpine3.20 AS builder

WORKDIR /usr/src/app

# Apply latest security patches to Alpine OS packages
RUN apk update && apk upgrade --no-cache

# Copy package configurations
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy application source files
COPY . .

# Build the production optimization static bundle
RUN npm run build

# ==========================================
# Stage 2: Serve Production Assets via Nginx
# ==========================================
FROM nginx:1.25-alpine3.18 AS runner

# Apply security patches to Nginx baseline Alpine layers
RUN apk update && apk upgrade --no-cache

# Copy static production assets from compilation builder stage
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Expose HTTP web server port
EXPOSE 80

# Run Nginx daemon in foreground execution mode
CMD ["nginx", "-g", "daemon off;"]