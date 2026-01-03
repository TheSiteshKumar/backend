import { Schema, model } from 'mongoose'

const AuthSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }
  },
  { timestamps: true }
)

export const Auth = model('Auth', AuthSchema)
