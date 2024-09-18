const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');
const passport = require('passport');
const { StatusCodes } = require('http-status-codes');

const config = require('./config');
const appRoutes = require('./routes');


class Application {
    constructor() {
        config.cloudinaryConfig();
        this.app = express();
        this.securityMiddleware();
        this.standardMiddleware();
        this.routesMiddleware();
        this.errorHandler();
    }

    securityMiddleware() {
        this.app.set('trust proxy', 1);
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(cors({
            origin: '*',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }));
    }

    standardMiddleware() {
        this.app.use(compression());
        this.app.use(express.urlencoded({ extended: true, limit: '500mb' }));
        this.app.use(express.json({ limit: '500mb' }));
        this.app.use(passport.initialize());
    }

    routesMiddleware() {
        appRoutes(this.app);
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