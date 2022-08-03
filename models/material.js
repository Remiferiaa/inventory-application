const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MatSchema = new Schema({
    name: { type: String, required: true, maxLength: 50 },
    descrip: { type: String, required: true, maxLength: 50 },
    pic: { String },
    dropFrom: [{ type: Schema.Types.ObjectId, ref: 'Stage' }],
    addedBy: { type: Schema.Types.ObjectId, ref: 'Contributor' }
})


MatSchema
    .virtual('url')
    .get(function () {
        return '/mats/' + this._id;
    })

module.exports = mongoose.model('Material', MatSchema)