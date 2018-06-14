FROM node:8-alpine

WORKDIR web

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]