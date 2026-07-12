# builder stage

FROM node:22-alpine AS builder

WORKDIR /app

ADD package*.json .

RUN npm install

COPY . .


# final stage

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

EXPOSE 8000

CMD [ "node","server.js" ]