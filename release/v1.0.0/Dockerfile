# Multi-stage Dockerfile for VaultDrive production

# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Install dependencies (builder needs all for build)
RUN npm ci --ignore-scripts

# Copy prisma schema first to allow generation
COPY prisma ./prisma/

# Generate Prisma Client (does not require DATABASE_URL for generate)
RUN npx prisma generate --schema=prisma/schema.prisma

# Copy rest of application
COPY . .

# Build Next.js application
RUN npm run build

# Migration stage for production deployments (uses builder stage)
FROM builder AS migrate
WORKDIR /app
CMD ["npx", "prisma", "migrate", "deploy", "--schema=prisma/schema.prisma"]

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create uploads directory and set permissions
RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Set user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start application
CMD ["node", "server.js"]
