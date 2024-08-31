class APIFeatures {
    constructor(query, queryObj) {
        this.query = query;
        this.queryObj = queryObj;
    }

    filter() {
        const queryObj = {...this.queryObj};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query.find(JSON.parse(queryStr));
        this.totalQuery = this.query.clone();
        return this;
    }

    sort() {
        if (this.queryObj.sort) {
            const sortBy = this.queryObj.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryObj.fields) {
            const fields = this.queryObj.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        const page = this.queryObj.page * 1 || 1;
        const limit = this.queryObj.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

    async getTotalDocs() {
        return await this.totalQuery.countDocuments();
    }
}

module.exports = APIFeatures;