const delayOrderJob = async (bookingId, avaiItems, delay) => {
	const queues = require("../server").queues;
	await queues.orderQueue.add("order", { bookingId, avaiItems }, { delay });
};

const createReviewCronJob = async () => {
	const queues = require("../server").queues;
	await queues.cronJob(
		queues.emailQueue,
		"sendReviewEmail",
		{},
		"0 7 * * *",
		{
			timezone: "Asia/Ho_Chi_Minh",
		},
	);
};

module.exports = {
	delayOrderJob,
	createReviewCronJob,
};
