FROM node:14-alpine

COPY package*.json /frontend/
WORKDIR /frontend
RUN npm install

COPY . /frontend
WORKDIR /frontend

EXPOSE 8080
CMD [ "npm", "run", "serve" ]