FROM node:18


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install --production


COPY . .

ENV NODE_ENV=production


EXPOSE 4001


CMD ["npm", "start"]
