import { Mongoose as mongoose } from "mongoose";
const Schema = mongoose.Schema

const MatSchema = new Schema({
    name: { String, required: true, maxLength: 50 },
    descrip: { String, required: true, maxLength: 50 },
    pic: { String },
    dropFrom: [{ type: Schema.Types.ObjectId, ref: 'Stage' }],
    addedBy: { type: Schema.Types.ObjectId, ref: 'Contributor' }
})


MatSchema
    .virtual('url')
    .get(function () {
        return '/mats/' + this._id;
    })

module.exports = mongoose.module('Material', MatSchema)