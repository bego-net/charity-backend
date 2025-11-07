 
// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    goalAmount: {
      type: Number,
      required: true,
    },
    raisedAmount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String, // optional project image URL
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
