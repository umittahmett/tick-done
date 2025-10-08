import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    members: { type: Array, required: false }
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)
