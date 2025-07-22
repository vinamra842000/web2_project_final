import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'humber-recipe-auth';

export function signToken(payload: object): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

export function verifyToken(token: string): object | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (typeof decoded === 'string') {
      return null;
    }
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}