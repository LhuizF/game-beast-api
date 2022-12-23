FROM node:16.13.0-alpine as builder

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npm run build

FROM node:16.13.0-alpine as production

ENV NODE_ENV=production
ENV PORT=3333

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
COPY prisma ./prisma/

RUN npm install --only=production

COPY --from=builder /app/build ./build

EXPOSE 3333

CMD [ "npm", "start" ]
