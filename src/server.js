const http = require("http");
const app = require("./app");
const config = require("./config");
const DataBase = require("./db/init.mongo");
const { createConnection } = require("./queues/connection");
const {
	redisConnect,
	createIORedisConnection,
} = require("./redis/redis.connection");
const OrderWorker = require("./queues/order.worker");
const CronWorker = require("./queues/cron.worker");
const { consumeAuthEmailMessage } = require("./queues/email.consumer");
const Queues = require("./queues/queues");
const { createReviewCronJob } = require("./queues/order.producer");
const { consumeGoWorker } = require("./queues/microservice.consumer");

const SERVER_PORT = config.PORT || 4001;

class TravelServer {
	constructor(app) {
		this.app = app;
	}

	start() {
		this.startMongodb();
		this.startServer(this.app);
		this.startRedis();
		this.startQueues();
	}

	async startQueues() {
		this.ioredis = await createIORedisConnection();
		this.queues = new Queues(this.ioredis); // run job queue instance
		this.channel = await createConnection();
		await consumeAuthEmailMessage(this.channel);
		await consumeGoWorker(this.channel);

		this.runCronJob();

		new OrderWorker(this.ioredis); // run job worker instance
		new CronWorker(this.ioredis); // run cron worker instance
	}

	async startRedis() {
		this.client = await redisConnect();
	}

	runCronJob() {
		createReviewCronJob();
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
		} catch (error) {}
	}
}

const server = new TravelServer(app);
server.start();

module.exports = server;
