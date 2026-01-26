export interface AuthUser {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  role?: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}

export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload extends LoginPayload {
  name: string
}
