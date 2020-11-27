let mongoose = require('mongoose')

let Schema = mongoose.Schema

//schema for a post
let bandModel = new Schema(
    {
        name: { type: String, required: true},
        rating: { type: String, required: true},
        mainGenre: { type: String, required: true}
    }
)

module.exports = mongoose.model('Band', bandModel)