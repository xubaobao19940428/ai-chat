import request from '../utils/request'

// Payment Types
export interface Product {
  id: number
  product_id: string
  title: string
  type: 'SUBS' | 'INAPP' | string
  price: string
  original_price: string
  discount: string
  currency: string
  local_price: number
  local_original_price: number
  local_currency: string
  coins: number
  reward_coins: number
  vip_days: number
  reward_vip_days: number
  is_selected: 0 | 1 | boolean
}

export interface ProductsResponse {
  subscriptions: Product[]
  coins: Product[]
}

export interface PayChannel {
  id: number
  name: string
  channel: string
  currency: string
  price: number
  currency_price: number
  reward_coins: number
  reward_vip_days: number
}

export interface CreateOrderParams {
  channel_id: number
  pid: number
  occ?: string
  coupon_code?: string
}

export interface CreateOrderResponse {
  pay_link: string
  trade_sn: string
  payment_transfer_domain: string
}

export interface OrderStatus {
  trade_sn: string
  channel: string
  status: number // 0: Pending, 1: Paid, -2: Error
  message: string
}

// Payment API
export const getProducts = () => {
  return request.get('/v1/pay/products')
}

export const getPayChannels = (params: { pid: number }) => {
  return request.get('/v1/pay/channels', { params })
}

export const createOrder = (data: CreateOrderParams) => {
  return request.post('/v1/pay/order/create', data)
}

export const queryOrder = (params: { trade_sn?: string }) => {
  return request.get('/v1/pay/order/status', { params })
}
