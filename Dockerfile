FROM node:18

ARG NODE_ENV=production
ARG PORT=4001
ARG CLIENT_URL=http://localhost:3000
ARG MONGO_URI=mongodb+srv://travel:travel@cluster0.obnnzsj.mongodb.net/travel?retryWrites=true&w=majority
ARG RABBITMQ_ENDPOINT=amqps://mnvczwsy:bijdXySzgcZ19kd-EthlzcCCLpYgU1a-@armadillo.rmq.cloudamqp.com/mnvczwsy
ARG JWT_TOKEN=travelbooking
ARG JWT_EXPIRES_IN=2d
ARG CLOUD_NAME=dxrygyw5d
ARG CLOUD_API_KEY=525819185272127
ARG CLOUD_API_SECRET=5G9dA2ykzP2K16TLvhEzsouqjj0
ARG REDIS_URL=redis://default:mysecretpassword@redis:6379
ARG VNPAY_SECRET=2SQFC5DVRKBTQ3FKPHBNDG57HVVDRZL2
ARG VNPAY_TMN_CODE=88WQN5G7
ARG VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
ARG GOOGLE_CLIENT_ID=964208709392-q4pg60059issro9us04a9qp3bv9prepa.apps.googleusercontent.com
ARG GOOGLE_CLIENT_SECRET=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
ARG GOOGLE_REDIRECT_URL=https://developers.google.com/oauthplayground/
ARG HOST_MAIL=smtp.gmail.com
ARG PORT_MAIL=465
ARG USER_MAIL=travelife.booking@gmail.com
ARG USER_MAIL_PASS=bfpi aouu zoda vjng
ARG SENDER_MAIL=travelife.booking@gmail.com

WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install
RUN npm install pm2 -g


COPY . .

RUN echo "NODE_ENV=\nPORT=\nCLIENT_URL=\nMONGO_URI=\nRABBITMQ_ENDPOINT=\nJWT_TOKEN=\nJWT_EXPIRES_IN=\nCLOUD_NAME=\nCLOUD_API_KEY=\nCLOUD_API_SECRET=\nREDIS_URL=\nVNPAY_SECRET=\nVNPAY_TMN_CODE=\nVNPAY_URL=\nGOOGLE_CLIENT_ID=\nGOOGLE_CLIENT_SECRET=\nGOOGLE_REDIRECT_URL=\nHOST_MAIL=\nPORT_MAIL=\nUSER_MAIL=\nUSER_MAIL_PASS=\nSENDER_MAIL=" > .env

RUN sed -i 's#NODE_ENV=.*#NODE_ENV=${NODE_ENV}#g' .env && \
    sed -i 's#PORT=.*#PORT=${PORT}#g' .env && \
    sed -i 's#CLIENT_URL=.*#CLIENT_URL=${CLIENT_URL}#g' .env && \
    sed -i 's#MONGO_URI=.*#MONGO_URI=${MONGO_URI}#g' .env && \
    sed -i 's#RABBITMQ_ENDPOINT=.*#RABBITMQ_ENDPOINT=${RABBITMQ_ENDPOINT}#g' .env && \
    sed -i 's#JWT_TOKEN=.*#JWT_TOKEN=${JWT_TOKEN}#g' .env && \
    sed -i 's#JWT_EXPIRES_IN=.*#JWT_EXPIRES_IN=${JWT_EXPIRES_IN}#g' .env && \
    sed -i 's#CLOUD_NAME=.*#CLOUD_NAME=${CLOUD_NAME}#g' .env && \
    sed -i 's#CLOUD_API_KEY=.*#CLOUD_API_KEY=${CLOUD_API_KEY}#g' .env && \
    sed -i 's#CLOUD_API_SECRET=.*#CLOUD_API_SECRET=${CLOUD_API_SECRET}#g' .env && \
    sed -i 's#REDIS_URL=.*#REDIS_URL=${REDIS_URL}#g' .env && \
    sed -i 's#VNPAY_SECRET=.*#VNPAY_SECRET=${VNPAY_SECRET}#g' .env && \
    sed -i 's#VNPAY_TMN_CODE=.*#VNPAY_TMN_CODE=${VNPAY_TMN_CODE}#g' .env && \
    sed -i 's#VNPAY_URL=.*#VNPAY_URL=${VNPAY_URL}#g' .env && \
    sed -i 's#GOOGLE_CLIENT_ID=.*#GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}#g' .env && \
    sed -i 's#GOOGLE_CLIENT_SECRET=.*#GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}#g' .env && \
    sed -i 's#GOOGLE_REDIRECT_URL=.*#GOOGLE_REDIRECT_URL=${GOOGLE_REDIRECT_URL}#g' .env && \
    sed -i 's#HOST_MAIL=.*#HOST_MAIL=${HOST_MAIL}#g' .env && \
    sed -i 's#PORT_MAIL=.*#PORT_MAIL=${PORT_MAIL}#g' .env && \
    sed -i 's#USER_MAIL=.*#USER_MAIL=${USER_MAIL}#g' .env && \
    sed -i 's#USER_MAIL_PASS=.*#USER_MAIL_PASS=${USER_MAIL_PASS}#g' .env && \
    sed -i 's#SENDER_MAIL=.*#SENDER_MAIL=${SENDER_MAIL}#g' .env
    
EXPOSE 4001


CMD ["pm2-runtime", "ecosystem.config.js"]
