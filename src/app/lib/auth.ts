export async function registerUser(name: string, email: string, password: string) {
  // Simulate API call
  return { success: true, message: "User registered" };
}

export async function loginUser(email: string, password: string) {
  // Simulate login
  return { success: true, token: "mock-token" };
}
