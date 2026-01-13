export interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  role?: 'user' | 'admin'
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
