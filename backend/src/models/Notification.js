import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: [
      'projectInvite',
      'taskAssignment',
      'taskDue',
      'generic',
    ],
    required: true,
  },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  channel: {
    type: String,
    enum: ['app', 'email'],
    required: true
  },  
}, { timestamps: true })

export default mongoose.model('Notification', notificationSchema)