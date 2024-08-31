const { transportSchema, updateTransportSchema } = require("../schemes/transport");
const TransportService = require("../services/transport.service");
const { BadRequestError } = require("../utils/error.response");
const { SuccessResponse } = require("../utils/sucess.response");

class TransportController {
    createTransport = async (req, res, next) => {
        const { error } = await Promise.resolve(transportSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);
        new SuccessResponse({
            message: 'Create transportation successfully',
            metadata: await TransportService.createTransport(req.body)
        }).send(res);
    }

    getTransportById = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get transportation successfully',
            metadata: await TransportService.getTransportById(req.params.transId)
        }).send(res);
    }

    getAllTransports = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get transportations successfully',
            metadata: await TransportService.getAllTransports(req.query)
        }).send(res);
    }

    updateTransport = async (req, res, next) => {
        const { error } = await Promise.resolve(updateTransportSchema.validate(req.body));
        if (error?.details)
            throw new BadRequestError(error.details[0].message);

        new SuccessResponse({
            message: 'Update transportation successfully',
            metadata: await TransportService.updateTransport(req.params.transId, req.body)
        }).send(res);
    }

    deleteTransport = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete transportation successfully',
            metadata: await TransportService.deleteTransport(req.params.transId)
        }).send(res);
    }

    searchTransport = async (req, res, next) => {
        new SuccessResponse({
            message: 'Search transportation succcessfully',
            metadata: await TransportService.searchTransport({
                keyword: req.params.keyword,
                query: req.query
            })
        }).send(res);
    }
}

module.exports = new TransportController();