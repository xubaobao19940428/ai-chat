import request from '../utils/request'

// Account Types
export interface AccountRecord {
  id: number
  type: number
  amount: number
  balance: number
  description: string
  created_at: number
}

// Account API
export const getAccountRecords = (params: { page?: number, page_size?: number, record_type?: number } = {}) => {
  return request.get('/v1/account/records', { params })
}
