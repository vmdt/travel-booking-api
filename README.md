# Travel Booking API Server

This repository contains the source code for the **Travel Booking API Server**, built with **Express.js**. The API server is designed to handle core functionalities for a travel booking system, including user authentication, tour management, booking handling, and notifications.

API Endpoint: https://travelifeapis.site/

API documentation: https://documenter.getpostman.com/view/28049062/2sA2xb6b7E

## Features

- **User Management**: Register, login, and manage user accounts.
- **Tour Management**: CRUD operations for tours and destinations.
- **Booking System**: Handle bookings with real-time availability updates.
- **Notification Service**: Send notifications to users for booking updates.
- **Message Queue**: Implements **RabbitMQ** for asynchronous task processing (e.g., sending notifications).
- **Data Caching**: Utilizes **Redis** for improving performance.'
- **Distributed Locking**: Using Optimistic Locking in **Redis**
- **Secure API**: Token-based authentication using **JWT**.

---

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/vmdt/travel-booking-api.git
   cd travel-booking-api
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:
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

4. **Start the server**:
   ```bash
   npm start
   ```

## Contact

If you have any questions or issues, feel free to reach out to the project maintainer:

- **Email**: vmdt03@gmail.com
- **GitHub**: [vmdt](https://github.com/vmdt)
