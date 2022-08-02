import { Mongoose as mongoose } from "mongoose";
const Schema = mongoose.Schema

const ContSchema = new Schema({
    name: { String, required: true, maxLength: 50 },
})


ContSchema
    .virtual('url')
    .get(function () {
        return '/mats/' + this._id;
    })

module.exports = mongoose.module('Contributor', ContSchema)