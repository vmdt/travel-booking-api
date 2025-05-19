FROM node:18

WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install --omit=dev
RUN npm install pm2 -g


COPY . .

EXPOSE 4001


CMD ["pm2-runtime", "ecosystem.config.js"]
