export async function hash(password: string) {
  // Placeholder - swap with a proper hash (bcrypt / argon2)
  return `hashed:${password}`
}

export async function verify(password: string, hashed: string) {
  return `hashed:${password}` === hashed
}
