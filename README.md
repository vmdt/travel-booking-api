API documentation: https://documenter.getpostman.com/view/28049062/2sA2xb6b7E


## Installation

Install travel-booking-server with npm

```bash
  npm install 
  npm run dev
```

Create .env file in tour service

```bash
NODE_ENV=development
PORT=4001
CLIENT_URL=localhost:3000
MONGO_URL=mongodb+srv://travel:travel@cluster0.obnnzsj.mongodb.net/travel?retryWrites=true&w=majority
RABBITMQ_ENDPOINT=amqps://hxcogcza:cU1DuN2iHmYndFue4odwleYX4g9LRfz-@octopus.rmq3.cloudamqp.com/hxcogcza
JWT_TOKEN=travelbooking
JWT_EXPIRES_IN=2d
CLOUD_NAME=dzhl9oxog
CLOUD_API_KEY=726425631835731
CLOUD_API_SECRET=yMJoQkAC-da0zXO4f9FzFjFjK14
PROFILE_PICTURE_DEFAULT=
REDIS_URL=redis://default:2RWD94gELCbnVjJv9xDYOQYyVCIdtgiI@redis-18783.c1.ap-southeast-1-1.ec2.cloud.redislabs.com:18783
VNPAY_SECRET=CYMFPTGAKOCZEXMQRZFCROWKDNNATOIB
VNPAY_TMN_CODE=RUGRQ15G
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```
Create .env file in notification service

```bash
NODE_ENV=development
PORT=4002
CLIENT_URL=
RABBITMQ_ENDPOINT=amqps://hxcogcza:cU1DuN2iHmYndFue4odwleYX4g9LRfz-@octopus.rmq3.cloudamqp.com/hxcogcza
HOST_MAIL=sandbox.smtp.mailtrap.io
PORT_MAIL=2525
USER_MAIL=f2f0f936d591e5
USER_MAIL_PASS=e5ade45981b676
SENDER_MAIL=travel@gmail.com
```
