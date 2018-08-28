const mongoose = require('mongoose');

var listSchema = new mongoose.Schema({
    position: String,
    list: Array
});

var List = mongoose.model('players', listSchema);

module.exports = List;