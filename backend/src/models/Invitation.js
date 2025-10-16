import mongoose from 'mongoose'

const invitationSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  inviter: { type: String, required: true },
  invitee: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  token: { type: String, required: true },
  tokenExpiry: { type: Date, required: true },
}, { timestamps: true })

export default mongoose.model('Invitation', invitationSchema)
