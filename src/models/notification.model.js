const mongoose = require("mongoose");

const Notification = new mongoose.Schema({
	title: { type: String, required: true },
	image: { type: String },
	message: { type: mongoose.Schema.Types.Mixed, required: true },
	type: { type: String },
	read: { type: Boolean, default: false },
	sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	receivers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Notification", Notification);
