const { Worker } = require("bullmq");

const BookingItemsModel = require("../models/bookingItems.model");
const BookingModel = require("../models/booking.model");

class CronWorker {
	constructor(connection) {
		const reviewWorker = new Worker("email", this.handleReviewJob, {
			connection,
		});

		reviewWorker.on("completed", (job) => {
			job.remove();
		});

		reviewWorker.on("failed", (job, err) => {
			console.log(`Review job processing failed`, err);
		});
	}

	handleReviewJob = async (job) => {
		const currentDate = new Date().toISOString().split("T")[0];
		const bookingItems = await BookingItemsModel.find({
			$expr: {
				$eq: [
					{ $dateToString: { format: "%Y-%m-%d", date: "$endDate" } },
					currentDate,
				],
			},
		})
			.populate({
				path: "booking",
				model: BookingModel,
				populate: {
					path: "user",
				},
			})
			.lean();

		const channel = await require("../server").channel;

		bookingItems.forEach(async (item) => {
			const booking = item.booking;
			const user = booking.user;

			item.isShowReview = true;
			item.save();

			// Send email to user: todo
			const messageDetails = {
				reviewLink: "", // todo
				username: user.username,
				receiver: user.email,
				template: "review",
			}

			await publishDirectMessage(
				channel,
				EXCHANGE_EMAIL,
				ROUTING_EMAIL,
				JSON.stringify(messageDetails),
			);
		});
	};
}

module.exports = CronWorker;
