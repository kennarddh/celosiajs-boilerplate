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

ENV NODE_ENV=production

ENTRYPOINT ["node", "./index.js"]
