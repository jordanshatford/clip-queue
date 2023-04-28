FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173
EXPOSE 24678
CMD [ "npm", "run", "dev", "--host" ]
