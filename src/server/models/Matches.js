const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Team = require('./Team');

const MatchesSchema = new Schema({
    matches:Object,
    weekId: Number
});

module.exports = MatchesSchema;