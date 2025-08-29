FROM node:20-slim

WORKDIR /app

COPY package.json /app/
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000 5002

CMD ["npm", "run", "start"]
