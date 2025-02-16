const { Worker } = require("bullmq");
const TourAvailabilitiesModel = require("../models/tourAvailabilities.model");
const BookingModel = require("../models/booking.model");
const BookingItemsModel = require("../models/bookingItems.model");
const { rollbackCartItems } = require("../repositories/cart.repo");

class OrderWorker {
	constructor(connection) {
		const orderWorker = new Worker("orderDelay", this.handleOrderJob, {
			connection,
		});

		orderWorker.on("completed", (job) => {
			job.remove();
		});

		orderWorker.on("failed", (job, err) => {
			console.log(`Order ${job.data.bookingId} processing failed`, err);
		});
	}

	handleOrderJob = async (job) => {
		const { bookingId, avaiItems } = job.data;
		const booking = await BookingModel.findById(bookingId);
		if (booking?.status === "pending") {
			// rollback avai_tour items
			avaiItems.forEach(async (item) => {
				await TourAvailabilitiesModel.findByIdAndUpdate(item.avaiId, {
					$inc: { vacancies: item.quantity },
				});
			});
			// delete booking
			await BookingItemsModel.deleteMany({ booking: booking._id });
			await BookingModel.findByIdAndDelete(booking._id);
		}
	};
}

module.exports = OrderWorker;
