FROM node:lts-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 5173
EXPOSE 24678
CMD [ "pnpm", "run", "dev", "--host" ]
