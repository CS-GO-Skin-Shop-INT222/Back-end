FROM node:15.12.0-stretch-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npx","prisma","db","push"]

CMD ["npx","prisma","generate"]

CMD ["npm","run","dev"]