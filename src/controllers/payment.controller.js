const VNPayService = require("../services/vnpay.service");
const BookingModel = require("../models/booking.model");
const { SuccessResponse } = require("../utils/sucess.response");
const config = require("../config");
const server = require("../server");

class PaymentController {
	getVnpayResult = async (req, res, next) => {
		const result = await VNPayService.checkPaymentStatus(req.query);
		let message = "";

		res.set(
			"Content-Security-Policy",
			"default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'",
		);

		if (result.isSuccess) {
			const paidDate = new Date(
				Number.parseInt(result.data.payDate.substring(0, 4)),
				Number.parseInt(result.data.payDate.substring(4, 6)),
				Number.parseInt(result.data.payDate.substring(6, 8)),
				Number.parseInt(result.data.payDate.substring(8, 10)),
				Number.parseInt(result.data.payDate.substring(10, 12)),
				Number.parseInt(result.data.payDate.substring(12, 14)),
			);

			const booking = await BookingModel.findById(result.data.bookingId);
			if (booking.checkoutOrder.totalPrice >= result.data.amount / 100) {
				const paymentInfo = {
					method: "vnpay",
					transactionNo: result.data.transactionNo,
					bankCode: result.data.bankCode,
					bankTranNo: result.data.bankTranNo,
					amount: result.data.amount,
					cardType: result.data.cardType,
				};
				booking.status = "completed";
				booking.payment = paymentInfo;
				await booking.save();
				message = "success";
			} else {
				message = "failed";
			}

			if (!result.payOnMobile) {
				return res.set(
					"Content-Security-Policy",
					"default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'",
				).send(`
					<script>
						alert('${message}');
						window.open('${config.CLIENT_URL}/booking/${result.data.bookingId}', '_self', '')
					</script>
				`);
			} else {
				if (message === "success")
					return res.render("payment-result", { paymentStatus: "success" });
				return res.render("payment-result", { paymentStatus: "failed" });
			}
		} else {
			return res.render("payment-result", { paymentStatus: "failed" });
		}
	};
}

module.exports = new PaymentController();
