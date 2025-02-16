const delayOrderJob = async (bookingId, avaiItems, delay) => {
	const queues = require("../server").queues;
	await queues.orderQueue.add("order", { bookingId, avaiItems }, { delay });
};

module.exports = {
	delayOrderJob,
};
