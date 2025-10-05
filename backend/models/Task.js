import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    default: null
  },
}, {
  timestamps: true
});

const Task = mongoose.model("Task", taskSchema);
export default Task;