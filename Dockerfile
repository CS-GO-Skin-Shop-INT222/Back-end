FROM node:15.12.0

WORKDIR /usr/src/app

COPY package*.json ./

COPY [".env","./"]              

RUN npm install

COPY . .

EXPOSE 5000

RUN npx prisma db push

RUN npx prisma generate

CMD ["npm","run","dev"]