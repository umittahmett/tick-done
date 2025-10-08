import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: false },
    title: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password)
}

export default mongoose.model('User', userSchema)
