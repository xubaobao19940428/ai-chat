import Sqids from 'sqids'

const sqids = new Sqids({ minLength: 10 })

/** Encode a numeric ID to a short URL-safe string */
export function encodeId(id: number | string): string {
  const num = Number(id)
  if (!Number.isFinite(num) || num < 0) return String(id)
  return sqids.encode([num])
}

/** Decode a sqids string back to numeric ID */
export function decodeId(encoded: string): number {
  const numbers = sqids.decode(encoded)
  return numbers[0] ?? 0
}
