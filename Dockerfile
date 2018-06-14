FROM node:8

WORKDIR web

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]