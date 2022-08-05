const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ContSchema = new Schema(
    {
        name: { type: String, required: true, maxLength: 50 },
    }
)


ContSchema
    .virtual('url')
    .get(function () {
        return '/contributor/' + this._id;
    })

module.exports = mongoose.model('Contributor', ContSchema)