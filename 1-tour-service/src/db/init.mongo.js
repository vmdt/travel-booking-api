const mongoose = require('mongoose');
const config = require('../config');

const MONGO_URL = `${config.MONGO_URL}`;

class DataBase {
    connect() {
        mongoose.connect(MONGO_URL, {
            family: 4
        })
        .then ( _ => console.log(`Connected Mongodb Successfully`))
        .catch( err => console.log('Error Connection', err));
    }

    static getInstance() {
        if (!DataBase.instance) {
            DataBase.instance = new DataBase();
        }
        return DataBase.instance;
    }
}

module.exports = DataBase;
