import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false, default: 'No description' },
    creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Types.ObjectId, ref: 'User', default: [] }]
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)
