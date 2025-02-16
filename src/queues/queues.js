const { Queue } = require("bullmq");

class Queues {
	constructor(connection) {
		this._orderQueue = new Queue("orderDelay", { connection });
	}

	get orderQueue() {
		return this._orderQueue;
	}
}

module.exports = Queues;
