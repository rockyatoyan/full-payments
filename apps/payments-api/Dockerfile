FROM node:lts-alpine

WORKDIR /app

COPY dist .

RUN npm install --production

CMD ["node", "main.js"]
