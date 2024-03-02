const http = require('http');
const app = require('./app');
const config = require("./config");
const { createConnection } = require('./queues/connection');
const { consumeAuthEmailMessage } = require('./queues/email.consumer');

const SERVER_PORT = config.PORT || 4002;

class NotificationServer {
    constructor(app) {
        this.app = app;
    }

    start() {
        this.startServer(this.app);
        this.startQueues();
    }

    async startQueues() {
        this.channel = await createConnection();
        await consumeAuthEmailMessage(this.channel);
    }

    startServer(app) {
        try {
            const httpServer = new http.Server(app);
            httpServer.listen(SERVER_PORT, () => {
                console.log(`Server is running on port ${SERVER_PORT}`);
            });
        } catch (error) {
            console.log(error);
        }
    }
}

const server = new NotificationServer(app);
server.start();