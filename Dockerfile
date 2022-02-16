FROM node:16-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 3000
EXPOSE 24678
CMD [ "pnpm", "dev", "--", "--host" ]
