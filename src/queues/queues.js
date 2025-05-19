const { Queue } = require("bullmq");

class Queues {
	constructor(connection) {
		this._orderQueue = new Queue("orderDelay", { connection });
		this._emailQueue = new Queue("email", { connection });
	}

	get orderQueue() {
		return this._orderQueue;
	}

	get emailQueue() {
		return this._emailQueue;
	}

	cronJob = async (queue, name, data, cron) => {
		await queue.add(name, data, { repeat: { cron } });
	};
}

module.exports = Queues;
