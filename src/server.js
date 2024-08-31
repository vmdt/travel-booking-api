const http = require('http');
const app = require('./app');
const config = require('./config');
const DataBase = require('./db/init.mongo');
const { createConnection } = require('./queues/connection');
const { redisConnect } = require('./redis/redis.connection');
const OrderWorker = require('./queues/order.worker');
const { consumeAuthEmailMessage } = require('./queues/email.consumer');

const SERVER_PORT = config.PORT || 4001;

class TravelServer {
    constructor(app) {
        this.app = app;
    }

    start() {
        this.startMongodb();
        this.startServer(this.app);
        this.startQueues();
        this.startRedis();
    }

    async startQueues() {
        new OrderWorker(); // run job worker instance
        this.channel = await createConnection();
        await consumeAuthEmailMessage(this.channel);
    }

    async startRedis() {
        this.client = await redisConnect();
    }

    startMongodb() {
        const instanceMongo = DataBase.getInstance();
        instanceMongo.connect();
    }

    startServer(app) {
        try {
            const httpServer = new http.Server(app);
            httpServer.listen(SERVER_PORT, () => {
                console.log(`Server is running on port ${SERVER_PORT}`);
            });
        } catch (error) {
            
        }
    }
}

const server = new TravelServer(app);
server.start();

module.exports = server;
