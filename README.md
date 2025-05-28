# Travel Booking API Server

This repository contains the source code for the **Travel Booking API Server**, built with **Express.js**. The API server is designed to handle core functionalities for a travel booking system, including user authentication, tour management, booking handling, and notifications.

API Endpoint: https://travelifeapis.site/

API documentation: https://documenter.getpostman.com/view/28049062/2sA2xb6b7E

## System Design

<p align="center">
  <img src="https://res.cloudinary.com/dzhl9oxog/image/upload/v1748152757/Blank_diagram_1_rhuhx1.png" alt="System-Design"/>
</p>

## Features

- **User Management**: Register, login, and manage user accounts
- **Tour Management**: CRUD operations for tours and destinations.
- **Booking System**: Handle bookings with real-time availability updates.
- **Notification Service**: Schedule to notifications using **asynq**, run cron job to send notifications
- **Message Queue**: Implements **RabbitMQ** for asynchronous task processing (e.g., sending notifications).
- **Data Caching**: Utilizes **Redis** for improving performance.
- **Distributed Locking**: Using Optimistic Locking in **Redis**.
- **Secure API**: Token-based authentication using **JWT**.
- **Python Export Service**: Process Images to 360 image using **opencv**. Export docx/pdf file

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
...
```

4. **Start the server**:
   ```bash
   npm start
   ```

## Contact

If you have any questions or issues, feel free to reach out to the project maintainer:

- **Email**: vmdt03@gmail.com
- **GitHub**: [vmdt](https://github.com/vmdt)
