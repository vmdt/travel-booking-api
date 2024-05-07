const crypto = require('crypto');
const dateFormat = require('dateformat');
const queryString = require('query-string');
const config = require("../config");
const { sortObject } = require("../utils");
const { configDotenv } = require('dotenv');

class VNPayService {
    static createPaymentURL = async ({ 
        ipAddress, apiURL, clientURL, bookingId, 
        bookingAmount, language = 'vn', bankCode = '' 
    }) => {
        const returnURL = `${apiURL}/api/v1/payment/vnpay/callback`;
        const date = new Date();
        const createDate = dateFormat(date, 'yyyymmddHHMMss');
        const txnRef = dateFormat(date, 'HHMMss');

        let locale = 'vn';
        if (language && ['vn', 'en'].indexOf(language) >= 0) {
          locale = language;
        }   
        
        const currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = config.VNPAY_TMN_CODE;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = txnRef;
        vnp_Params['vnp_OrderInfo'] = JSON.stringify({ bookingId, clientURL });
        vnp_Params['vnp_OrderType'] = 'topup';
        vnp_Params['vnp_Amount'] = bookingAmount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnURL;
        vnp_Params['vnp_IpAddr'] = ipAddress;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
          vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        const signData = queryString.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", config.VNPAY_SECRET);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
      
        const paymentUrl = `${config.VNPAY_URL}` + '?' + queryString.stringify(vnp_Params, { encode: false });
        return paymentUrl;
    }

    static checkPaymentStatus = async (vnpayResponse) => {
        let vnp_Params = vnpayResponse;
        const secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        const signData = queryString.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac('sha512', config.VNPAY_SECRET);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        if (secureHash === signed) {
            const amount = vnp_Params['vnp_Amount'];
            const txnRef = vnp_Params['vnp_TxnRef'];
            const { bookingId, clientURL } = JSON.parse(
              Object.keys(queryString.parse(vnp_Params['vnp_OrderInfo']))[0]
            );
            const payDate = vnp_Params['vnp_PayDate']; // yyyyMMddHHmmss
            const bankCode = vnp_Params['vnp_BankCode'];
            const bankTranNo = vnp_Params['vnp_BankTranNo'];
            const cartType = vnp_Params['vnp_CardType'];
            const transactionNo = vnp_Params['vnp_TransactionNo'];
        
            let isSuccess = false, message = 'Payment failed';
        
            if (vnp_Params['vnp_TransactionStatus'] === '00') {
                isSuccess = true;
                message = 'Payment success';
            }

            return {
                isSuccess,
                data: {
                    amount, txnRef, bookingId, clientURL,
                    payDate, bankCode, bankTranNo,
                    cartType, transactionNo
                },
                message
            } 
        } else {
            return {
                isSuccess: false,
                message: 'Invalid secure hash'
            }
        }
    }
}   

module.exports = VNPayService;