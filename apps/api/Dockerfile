FROM node:18 as dev

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

RUN npm run build

RUN ["npm", "run", "test"]

EXPOSE 3000

CMD ["npm", "run", "start"]

