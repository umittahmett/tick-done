import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false, default: '' },
    status: { 
      type: String, 
      required: true,
      enum: ['todo', 'in-progress', 'review', 'done'],
      default: 'todo'
    },
    priority: { 
      type: String, 
      required: true,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    dueDate: { type: Date, required: true },
    assignments: { type: Array, ref: 'User', required: true },
    creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Types.ObjectId, ref: 'Project', required: true }
  },
  { timestamps: true }
)

export default mongoose.model('Task', taskSchema)
