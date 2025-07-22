export async function registerUser() {
  return { success: true, message: "User registered" };
}

export async function loginUser() {
  return { success: true, token: "mock-token" };
}
