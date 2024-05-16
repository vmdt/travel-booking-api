const { Types } = require("mongoose");
const APIFeatures = require("../helpers/api.features");

const getOne = async ( Model, filter, lean = true , popOptions ) => {
    let query = Model.findOne(filter)
    if (popOptions)
        query = query.populate(popOptions);
    return lean ? await query.lean() : query;
}

const updateOne = async (Model, filter, body) => {
    const doc = await Model.findOneAndUpdate(
        filter,
        body, {
            new: true,
            upsert: true
        }
    );
    return doc;
}

const createOne = async (Model, payload) => {
    const doc = await Model.create(payload);
    return doc;
}

const getAll = async (Model, queryObj, lean = true, popOptions = []) => {
    const features = new APIFeatures(Model.find().populate(popOptions), queryObj)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const totalDocs = await features.getTotalDocs();
    const docs = lean ? await features.query.lean() : await features.query;
    return {
        total: totalDocs,
        docs
    };
}

const getMany = async (Model, filter, queryObj, lean = true, popOptions = []) => {
    const features = new APIFeatures(Model.find(filter).populate(popOptions), queryObj)
        .filter()
        .sort()
        .limitFields()
        .paginate()

    const totalDocs = await features.getTotalDocs();
    const docs = lean ? await features.query.lean() : await features.query;
    return {
        total: totalDocs,
        docs
    };
}

const deleteOne = async (Model, id) => {
    return await Model.findByIdAndDelete(new Types.ObjectId(id));
}  

module.exports = {
    getOne,
    updateOne,
    createOne,
    getAll,
    getMany,
    deleteOne
}