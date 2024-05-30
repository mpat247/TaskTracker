const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  dateDue: { type: Date, required: false },
  priority: { type: Number, required: false },
  list: { type: mongoose.Schema.Types.ObjectId, ref: 'List' }, // Ensure this is correct
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Task', TaskSchema);
