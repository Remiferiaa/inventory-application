const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MatSchema = new Schema({
    name: { type: String, required: true, maxLength: 50 },
    usage: {type: String, required: true},
    descrip: { type: String, required: true},
    pic: { type: String },
    dropFrom: [{ type: Schema.Types.ObjectId, ref: 'Stage' }],
    addedBy: { type: Schema.Types.ObjectId, ref: 'Contributor'}
})


MatSchema
    .virtual('url')
    .get(function () {
        return '/material/' + this._id;
    })

module.exports = mongoose.model('Material', MatSchema)