import { Mongoose as mongoose } from "mongoose";
const Schema = mongoose.Schema

const StageSchema = new Schema({
    name: { String, required: true, maxLength: 50 },
    descrip: { String, required: true, maxLength: 50 },
    sanity: { Number },
    pic: { String },
    addedBy: { type: Schema.Types.ObjectId, ref: 'Contributor' }
})


StageSchema
    .virtual('url')
    .get(function () {
        return '/mats/' + this._id;
    })

module.exports = mongoose.module('Stage', StageSchema)