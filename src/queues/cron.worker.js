const { Worker } = require("bullmq");

const BookingItemsModel = require("../models/bookingItems.model");
const BookingModel = require("../models/booking.model");
const { publishDirectMessage } = require("../queues/auth.producer");
const config = require("../config");
const { sendMail } = require("../helpers/email");

const EXCHANGE_AUTH = "travel-auth";
const ROUTING_AUTH = "auth";

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
			});

		bookingItems.forEach(async (item) => {
			const booking = item.booking;
			const tour = item.tour;
			const user = booking.user;

			item.isShowReview = true;
			item.save();

			// Send email to user: todo
			const messageDetails = {
				appLink: `${config.CLIENT_URL}`,
				appIcon:
					"https://res.cloudinary.com/dxrygyw5d/image/upload/v1709968499/travelife-logo_uf55mo.png",
				reviewLink: `${config.CLIENT_URL}/booking/${booking._id}`, // todo
				username: user.username,
				receiver: user.email,
				template: "ratingOrder",
				tourName: tour.title || '',
				startDate: item.startDate,
				endDate: item.endDate,
			}

			await sendMail(
				"ratingOrder",
				user.email,
				messageDetails,
			)
		});
	};
}

module.exports = CronWorker;
