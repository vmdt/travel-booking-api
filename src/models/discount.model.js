const mongoose = require("mongoose");

const Discount = new mongoose.Schema({
	name: String,
	code: { type: String, required: true },
	value: { type: Number, required: true },
	type: {
		type: String,
		default: "fixed_amount",
		enum: ["fixed_amount", "percentage"],
	},
	startDate: Date,
	endDate: Date,
	maxUses: { type: Number, default: 50 },
	usedCount: { type: Number, default: 0 },
	minOrder: { type: Number, default: 0 },
	isActive: { type: Boolean, default: true },
	appliesTo: {
		type: String,
		enum: ["total_order", "specific"],
		required: true,
	},
	scheduleAt: { type: Date, default: null },
	taskQueueId: { type: String, default: null },
	tours: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tour" }],
	applyUsers: [
		{type: mongoose.Schema.Types.ObjectId, ref: "User", default: []},
	],
	usedUsers: [
		{type: mongoose.Schema.Types.ObjectId, ref: "User", default: []},
	]
}, { timestamps: true });

Discount.index({ code: "text" });

module.exports = mongoose.model("Discount", Discount);
