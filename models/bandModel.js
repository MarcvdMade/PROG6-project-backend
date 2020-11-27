let mongoose = require('mongoose')

let Schema = mongoose.Schema

//schema for a post
let bandModel = new Schema(
    {
        name: { type: String},
        rating: { type: String},
        mainGenre: { type: String}
    }
)

module.exports = mongoose.model('Band', bandModel)