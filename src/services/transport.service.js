const { Types } = require('mongoose');
const TransportModel = require('../models/transportation.model');
const { createOne, getOne, getAll, updateOne, deleteOne, getMany } = require("../repositories/factory.repo");
const { BadRequestError, NotFoundError } = require('../utils/error.response');
const { filterOut } = require('../utils');
const { query } = require('express');

class TransportService {
    static createTransport = async ({ name, capacity, brand, image, isActive = true }) => {
        const transport = await createOne(TransportModel, {
            name,
            capacity,
            brand,
            image,
            isActive
        });
        return { transportation : transport }
    }

    static getTransportById = async (transId) => {
        const transport = await getOne(TransportModel, 
            { _id: new Types.ObjectId(transId) });
        if (!transport)
            throw new NotFoundError('Not found transportation');
        if (!transport.isActive)
            throw new BadRequestError('Transport has been deactivated');
        return { transportation: transport }
    }

    static getAllTransports = async (query) => {
        const {total, docs: transports} = await getAll(TransportModel, query);
        return {
            total,
            result: transports.length,
            transportations: transports
        }
    }

    static updateTransport = async (transId, payload) => {
        const transportExisting = await TransportModel.findById(
            new Types.ObjectId(transId)
        ).lean();
        if (!transportExisting)
            throw new NotFoundError('Not found transportation');
        if (!transportExisting.isActive)
            throw new BadRequestError('Transport has been deactivated');
            
        const filteredPayload = filterOut(payload, 'isActive');
        const transport = await updateOne(TransportModel, 
            { _id: new Types.ObjectId(transId) }, filteredPayload);
        if (!transport)
            throw new BadRequestError('Not found transportation');
        return { transportation: transport }
    }

    static deleteTransport = async (transId) => {
        const transport = await deleteOne(TransportModel, transId);
        if (!transport)
            throw new BadRequestError('Not found transportation');
        return null;
    }

    static searchTransport = async ({ keyword, query }) => {
        const {total, docs: foundTransports} = await getMany(TransportModel, {
            name: { $regex: keyword, $options: 'i' },
            isActive: true
        }, query);

        return {
            total,
            result: foundTransports.length,
            transportations: foundTransports
        }
    }
}

module.exports = TransportService;