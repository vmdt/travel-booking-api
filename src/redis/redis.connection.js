const { createClient } = require("redis");
const IORedis = require("ioredis");
const config = require("../config");

const client = createClient({ url: `${config.REDIS_URL}` });

const redisConnect = async () => {
	try {
		client
			.on("error", (err) => console.log("Redis Client Error", err))
			.connect();
		console.log(`Connect to Redis: ${await client.ping()}`);
		return client;
	} catch (error) {
		console.log(error);
		return undefined;
	}
};

const createIORedisConnection = () => {
	try {
		const connection = new IORedis(`${config.REDIS_URL}`, {
			maxRetriesPerRequest: null,
		});
		console.log("Server connected to redis successfully");
		process.once("SIGINT", async () => {
			await connection.quit();
		});

		return connection;
	} catch (error) {
		console.log(error);
		return undefined;
	}
};

module.exports = {
	redisConnect,
	createIORedisConnection,
	client,
};
