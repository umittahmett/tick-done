import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    dueDate: { type: Date, required: true },
    assignments: { type: Array, required: false },
    creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
)

export default mongoose.model('Task', taskSchema)
