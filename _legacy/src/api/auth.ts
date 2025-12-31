import request from '@/api/request'

export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  email: string
  password: string
  nickname?: string
}

export interface UserProfile {
  id: string
  email: string
  nickname: string
  avatar: string
  // Add other fields as per response
}

export const login = (data: LoginParams) => {
  return request.post('/v1/sso/login/email', data)
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
