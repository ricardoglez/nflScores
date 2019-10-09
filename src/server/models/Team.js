const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name: String,
    score: Number,
    record: String,
    isWinner: Boolean,
})

module.exports = TeamSchema;