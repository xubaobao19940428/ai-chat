import { md5 } from 'js-md5'

/**
 * Generate a random string of given length
 */
export const randomString = (len: number): string => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789'
  const maxLen = chars.length
  let result = ''
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxLen))
  }
  return result
}

interface SignParams {
  [key: string]: string | number
}

/**
 * Generate signature for API requests
 * @param fullPath - The full URL path (e.g., 'https://ai-test.iappdaily.com/v1/chat/completions')
 * @param params - The request parameters (objects/arrays excluded automatically)
 * @param secretKey - The secret key for signing
 * @returns The MD5 signature
 */
export const generateSign = (fullPath: string, params: Record<string, any>, secretKey: string): string => {
  // Sort params and EXCLUDE objects/arrays from signature
  const sortedParams = Object.keys(params).sort().reduce((acc: SignParams, key: string) => {
    const val = params[key]
    if (val !== undefined && val !== null && typeof val !== 'object') {
      acc[key] = val
    }
    return acc
  }, {} as SignParams)

  // Generate query string
  const queryString = Object.entries(sortedParams)
    .map(([key, value]) => {
      const encodedKey = encodeURIComponent(key).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())
      const encodedValue = encodeURIComponent(String(value)).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())
      return `${encodedKey}=${encodedValue}`
    })
    .join('&')

  const encodedFullPath = fullPath.replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())
  return md5(encodedFullPath + queryString + secretKey)
}

/**
 * Prepare common signing fields (timestamp, nonce, sign)
 */
export const prepareSignedParams = (
  path: string,
  params: Record<string, any>,
  domain: string,
  secretKey: string
) => {
  const timestamp = Math.floor(Date.now() / 1000)
  const nonce = randomString(16)

  const allParams: Record<string, any> = {
    ...params,
    timestamp,
    nonce
  }

  const fullPath = domain.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
  const sign = generateSign(fullPath, allParams, secretKey)

  return { timestamp, nonce, sign }
}
