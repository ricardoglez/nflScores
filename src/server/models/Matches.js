const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchesSchema = new Schema({
    matches  : Object,
    weekId   : Number
});

module.exports = mongoose.model( 'Matches', MatchesSchema );