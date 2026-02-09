import request from '../utils/request'

// Auth Types
export interface LoginParams {
  email: string
  code?: string
  password?: string
}

export interface RegisterParams {
  email: string
  code: string
  password: string
}

export interface UserProfile {
  id: string
  email: string
  nickname: string
  avatar: string
}

// Auth API
export const login = (data: LoginParams) => {
  return request.post('/v1/sso/login/email', data)
}

export const sendLoginCode = (email: string) => {
  return request.post('/v1/sso/send-email', { email, type: 'activation' })
}

export const sendRegisterCode = (email: string) => {
  return request.post('/v1/sso/send-email', { email, type: 'register' })
}

export const register = (data: RegisterParams) => {
  return request.post('/v1/sso/register', data)
}

export const getUserProfile = () => {
  return request.get('/v1/sso/profile')
}

export const logout = () => {
  return request.post('/v1/sso/logout')
}
