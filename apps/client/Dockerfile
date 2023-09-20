# Use the official Node.js image as the base image
FROM node:14

# Set the working directory
WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]