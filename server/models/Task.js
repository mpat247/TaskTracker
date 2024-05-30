const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  dateDue: { type: Date, required: false },
  category: { type: String, required: false },
  priority: { type: Number, required: false },
  list: { type: mongoose.Schema.Types.ObjectId, ref: 'List' }
});

module.exports = mongoose.model('Task', TaskSchema);
