// Authentication service for managing user auth via localStorage.
// On first load, seeds default users if the "users" key does not yet exist.

// Default users seeded into localStorage on first load.
const DEFAULT_USERS = [
  { id: 1, name: "Admin", username: "admin", password: "admin123", role: "admin" },
]

// Seed default users into localStorage if none exist yet.
function seedUsers() {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(DEFAULT_USERS))
  }
}

seedUsers()

// Read the users array from localStorage with a safe fallback.
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]")
}

// Persist the users array to localStorage.
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users))
}

// Return a copy of the user object without the password field.
function stripPassword(user) {
  const { password, ...safeUser } = user
  return safeUser
}

// Log a user in by matching username and password.
// Throws if no matching user is found.
export function login(credentials) {
  const users = getUsers()
  const user = users.find(
    (u) => u.username === credentials.username && u.password === credentials.password
  )
  if (!user) {
    throw new Error("Invalid username or password")
  }
  const safeUser = stripPassword(user)
  localStorage.setItem("currentUser", JSON.stringify(safeUser))
  return safeUser
}

// Register a new user. Throws if the username is already taken.
export function register(userData) {
  const users = getUsers()
  if (users.some((u) => u.username === userData.username)) {
    throw new Error("Username already exists")
  }
  const newUser = {
    id: Date.now(),
    name: userData.name,
    username: userData.username,
    password: userData.password,
    role: "customer",
  }
  users.push(newUser)
  saveUsers(users)
  const safeUser = stripPassword(newUser)
  localStorage.setItem("currentUser", JSON.stringify(safeUser))
  return safeUser
}

// Remove the currently logged-in user from localStorage.
export function logout() {
  localStorage.removeItem("currentUser")
}

// Return the current user object, or null if none is stored.
export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser") || "null")
}

// Return true when a current user is present.
export function isAuthenticated() {
  return getCurrentUser() !== null
}

// Return true when the current user has the "admin" role.
export function isAdmin() {
  const user = getCurrentUser()
  return user !== null && user.role === "admin"
}

// Return true when the current user has the "customer" role.
export function isCustomer() {
  const user = getCurrentUser()
  return user !== null && user.role === "customer"
}

// Find a user by username (used for "Forgot Password" flow).
// Returns the user object or null.
export function findUser(username) {
  const users = getUsers()
  return users.find((u) => u.username === username) || null
}

// Reset the password for a given username.
// Throws if the user is not found.
export function resetPassword(username, newPassword) {
  const users = getUsers()
  const user = users.find((u) => u.username === username)
  if (!user) {
    throw new Error("User not found")
  }
  user.password = newPassword
  saveUsers(users)
  return stripPassword(user)
}
