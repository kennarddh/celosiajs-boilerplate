FROM node:lts-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build
RUN npx prisma generate

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./

RUN npm ci --omit=dev &&\
	npm cache clean --force &&\
	rm -rf /root/.npm

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma	

COPY --from=builder /app/build ./

HEALTHCHECK --interval=30s --timeout=10s --start-period=1s --start-interval=5s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${PORT}/health || exit 1

ENV NODE_ENV=production

ENTRYPOINT ["node", "./index.js"]
