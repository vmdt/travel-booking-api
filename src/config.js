const dotenv = require('dotenv');
const cloudinary = require('cloudinary');

dotenv.config({});

class Config {
    constructor() {
        this.PORT = process.env.PORT || '4001';
        this.NODE_ENV = process.env.NODE_ENV || 'development';
        this.CLIENT_URL = process.env.CLIENT_URL || '';
        this.JWT_TOKEN = process.env.JWT_TOKEN || '';
        this.MONGO_URL = process.env.MONGO_URL || '';
        this.CLOUD_NAME = process.env.CLOUD_NAME || '';
        this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';
        this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';
        this.PROFILE_PICTURE_DEFAULT = process.env.PROFILE_PICTURE_DEFAULT || '';
        this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '';
        this.REDIS_URL = process.env.REDIS_URL || '';
        this.VNPAY_SECRET = process.env.VNPAY_SECRET || '';
        this.VNPAY_TMN_CODE = process.env.VNPAY_TMN_CODE || '';
        this.VNPAY_URL = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        this.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
        this.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
        this.GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL || '';
        this.GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || '';
        this.HOST_MAIL = process.env.HOST_MAIL || '';
        this.PORT_MAIL = process.env.PORT_MAIL || '';
        this.USER_MAIL = process.env.USER_MAIL || '';
        this.USER_MAIL_PASS = process.env.USER_MAIL_PASS || '';
        this.SENDER_MAIL = process.env.SENDER_MAIL || '';
    }

    cloudinaryConfig() {
        cloudinary.v2.config({
            cloud_name: this.CLOUD_NAME,
            api_key: this.CLOUD_API_KEY,
            api_secret: this.CLOUD_API_SECRET
        });
    }
}

const config = new Config();
module.exports = config;