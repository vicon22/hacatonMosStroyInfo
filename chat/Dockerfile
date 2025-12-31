FROM node:24-alpine

WORKDIR /opt/chat

COPY package*.json ./
COPY . .

RUN npm install --omit=dev

EXPOSE 3001
CMD ["npm", "start"]