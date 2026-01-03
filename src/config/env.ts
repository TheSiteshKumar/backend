export const PORT = Number(process.env.PORT ?? 3000)
export const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/elysia-app'
export const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key-change-this'
export const NODE_ENV = process.env.NODE_ENV ?? 'development'
