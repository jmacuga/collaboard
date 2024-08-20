FROM node:18-alpine AS base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
EXPOSE 3000
EXPOSE 4000

FROM base AS builder
WORKDIR /app
COPY . .
RUN npm run build
# RUN npx prisma generate

FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
RUN npm ci

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs


COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/websocket-server ./websocket-server
COPY --from=builder /app/prisma ./prisma

CMD npm start

FROM base AS dev
ENV NODE_ENV=development
RUN npm install

COPY . .
RUN npx prisma generate
CMD npm run dev & node ./websocket-server/index.js
