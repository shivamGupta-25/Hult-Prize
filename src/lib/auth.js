import { SignJWT, jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET
)

/**
 * Verify admin credentials against environment variables
 */
export function verifyCredentials(username, password) {
  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  return username === adminUsername && password === adminPassword
}

/**
 * Create a session token (JWT)
 */
export async function createSession() {
  const token = await new SignJWT({ authenticated: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY)

  return token
}

/**
 * Verify a session token
 */
export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload.authenticated === true
  } catch (error) {
    return false
  }
}
