# syntax=docker.io/docker/dockerfile:1

FROM node:24-alpine AS base

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /opt/ui

RUN apk add --no-cache libc6-compat
WORKDIR /opt/ui

COPY . .
RUN npm install --omit=dev
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /opt/ui

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /opt/ui/public ./public
COPY --from=builder --chown=nextjs:nodejs /opt/ui/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /opt/ui/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]