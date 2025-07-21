export async function registerUser(name: string, email: string, password: string) {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, message: 'Registration failed' };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, message: 'Login failed' };
  }
}
