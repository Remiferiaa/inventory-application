const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StageSchema = new Schema({
    name: { type: String, required: true, maxLength: 50 },
    descrip: { type: String, required: true},
    sanity: { type: Number, required: true },
    pic: { type: String, default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png' },
    addedBy: { type: Schema.Types.ObjectId, ref: 'Contributor' }
})


StageSchema
    .virtual('url')
    .get(function () {
        return '/stage/' + this._id;
    })

module.exports = mongoose.model('Stage', StageSchema)