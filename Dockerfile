FROM node:lts-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:lts-alpine AS runtime

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 -G nodejs

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

USER nodejs

ENV YNAB_API_TOKEN=""
ENV YNAB_BUDGET_ID=""

CMD ["node", "dist/index.js"]
