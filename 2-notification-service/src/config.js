const dotenv = require('dotenv');

dotenv.config({});

class Config {
    constructor() {
        this.PORT = process.env.PORT || '4001';
        this.NODE_ENV = process.env.NODE_ENV || 'development';
        this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
        this.CLIENT_URL = process.env.CLIENT_URL || '';
        this.HOST_MAIL = process.env.HOST_MAIL || '';
        this.PORT_MAIL = process.env.PORT_MAIL || '';
        this.USER_MAIL = process.env.USER_MAIL || '';
        this.USER_MAIL_PASS = process.env.USER_MAIL_PASS || '';
        this.SENDER_MAIL = process.env.SENDER_MAIL || '';
    }
}

const config = new Config();
module.exports = config;