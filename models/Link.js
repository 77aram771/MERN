const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    from: {type: String, required: true}
})

module.exports = model('Link', schema)
