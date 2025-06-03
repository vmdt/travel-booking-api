const discountModel = require("../models/discount.model");
const { createConnection } = require("./connection");

const EXCHANGE_NAME = "node_service";
const ROUTING_KEY = "node_key";
const QUEUE_NAME = "node_queue";

const consumeGoWorker = async (channel) => {
	try {
		if (!channel) channel = await createConnection();
		await channel.assertExchange(EXCHANGE_NAME, "direct");
		const authQueue = await channel.assertQueue(QUEUE_NAME, { durable: true });
		await channel.bindQueue(authQueue.queue, EXCHANGE_NAME, ROUTING_KEY);

		channel.consume(authQueue.queue, async (msg) => {
			const payload = JSON.parse(msg.content.toString());
            const { discount_id, task_queue_id } = payload;

            await discountModel.updateOne(
                { _id: discount_id },
                { taskQueueId: task_queue_id }
            );

			channel.ack(msg);
		});
	} catch (error) {
		console.log("Consume Auth Email Error", error);
	}
};

module.exports = {
	consumeGoWorker,
};
