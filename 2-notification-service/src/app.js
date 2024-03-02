const express = require('express');

class Application {
    constructor() {
        this.app = express();
        this.errorHandler();
    }

    errorHandler() {
        this.app.use('*', (req, res, next) => {
            res.status(StatusCodes.NOT_FOUND).json({ 
                message: 'The endpoint called does not exist.'
            });
            next();
        });

        this.app.use((err, req, res, next) => {
            const error = {
                status: 'error',
                code: err.status || 500,
                message: err.message || 'Internal Server Error',
                ...(config.NODE_ENV === 'development' && {
                    stack: err.stack
                })
            }
            res.status(error.code).json(error);
            next();
        });
    }
}

const app = new Application().app;

module.exports = app;
