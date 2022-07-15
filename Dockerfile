FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 5173
EXPOSE 24678
CMD [ "pnpm", "dev", "--host" ]
