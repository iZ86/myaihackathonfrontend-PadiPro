FROM node:24.14.1-alpine as base

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

ENV PORT 5173

RUN npm install -g serve

RUN npm install

RUN npm run build

CMD ["serve", "-s", "-l", "5173", "./dist"]
