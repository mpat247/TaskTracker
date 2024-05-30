const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model('List', ListSchema);
