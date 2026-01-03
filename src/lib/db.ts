import mongoose from 'mongoose'

export async function connect(uri: string) {
  if (mongoose.connection.readyState) {
    console.log('MongoDB already connected')
    return
  }
  
  await mongoose.connect(uri)
  console.log('MongoDB connected')
}

export { mongoose }

