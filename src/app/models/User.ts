export interface User {
  _id?: string;
  fullName: string;
  email: string;
  password: string;
  role: 'admin' | 'registered' | 'general';
}