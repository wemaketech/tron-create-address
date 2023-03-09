const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const ALPHABET_MAP = ALPHABET.split('').reduce((acc: { [k: string]: number }, x, i) => {
  acc[x] = i
  return acc
}, {})

const BASE = 58

export const encode58 = (buffer: Buffer): string => {
  if (buffer.length === 0) return ''

  const digits = [0]

  for (let i = 0; i < buffer.length; i++) {
    for (let j = 0; j < digits.length; j++) digits[j] <<= 8

    digits[0] += buffer[i]
    let carry = 0

    for (let j = 0; j < digits.length; ++j) {
      digits[j] += carry
      carry = (digits[j] / BASE) | 0
      digits[j] %= BASE
    }

    while (carry) {
      digits.push(carry % BASE)
      carry = (carry / BASE) | 0
    }
  }

  for (let i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) digits.push(0)

  return [...digits]
    .reverse()
    .map((digit) => ALPHABET[digit])
    .join('')
}

export const decode58 = (data: string): Buffer => {
  if (data.length === 0) return Buffer.from([])

  const bytes = [0]

  for (let i = 0; i < data.length; i++) {
    const c = data[i]

    if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character')

    for (let j = 0; j < bytes.length; j++) bytes[j] *= BASE

    bytes[0] += ALPHABET_MAP[c]
    let carry = 0

    for (let j = 0; j < bytes.length; ++j) {
      bytes[j] += carry
      carry = bytes[j] >> 8
      bytes[j] &= 0xff
    }

    while (carry) {
      bytes.push(carry & 0xff)
      carry >>= 8
    }
  }

  for (let i = 0; data[i] === '1' && i < data.length - 1; i++) bytes.push(0)

  return Buffer.from([...bytes].reverse())
}
