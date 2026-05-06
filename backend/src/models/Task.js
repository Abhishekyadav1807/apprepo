const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  inputText: { type: String, required: true },
  operation: {
    type: String,
    enum: ['uppercase', 'lowercase', 'reverse', 'word_count'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'success', 'failed'],
    default: 'pending',
    index: true
  },
  result: { type: String, default: '' },
  logs: { type: [String], default: [] },
  error: { type: String, default: '' }
}, { timestamps: true });

taskSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);
