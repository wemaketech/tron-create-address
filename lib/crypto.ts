import crypto from 'crypto'
import { ec as EC } from 'elliptic'
import { keccak_256 } from 'js-sha3'
import { BasePointXY } from '../types'
import { encode58 } from './base58'

const ADDRESS_PREFIX = '41'

const isHexChar = (c: string): 0 | 1 => {
  if ((c >= 'A' && c <= 'F') || (c >= 'a' && c <= 'f') || (c >= '0' && c <= '9')) return 1
  return 0
}

const hexChar2byte = (c: string): number => {
  let d = 0
  if (c >= 'A' && c <= 'F') {
    d = c.charCodeAt(0) - 'A'.charCodeAt(0) + 10
  } else if (c >= 'a' && c <= 'f') {
    d = c.charCodeAt(0) - 'a'.charCodeAt(0) + 10
  } else if (c >= '0' && c <= '9') {
    d = c.charCodeAt(0) - '0'.charCodeAt(0)
  }
  return d
}

const hexStr2byteArray = (str: string): number[] => {
  const byteArray = []
  let d = 0
  let j = 0
  let k = 0

  for (let i = 0; i < str.length; i++) {
    const c = str.charAt(i)
    if (isHexChar(c)) {
      d <<= 4
      d += hexChar2byte(c)
      j++
      if (0 === j % 2) {
        byteArray[k++] = d
        d = 0
      }
    }
  }
  return byteArray
}

//gen Ecc prKey for bytes
export const genPrKey = (): string => {
  const ec = new EC('secp256k1')
  const key = ec.genKeyPair()
  const prKey = key.getPrivate()
  let prKeyHex = prKey.toString('hex')
  while (prKeyHex.length < 64) {
    prKeyHex = '0' + prKeyHex
  }

  return prKeyHex
}

//return address by bytes, pubBytes is byte[]
const computeAddress = (pubBytes: number[]): string => {
  if (pubBytes.length === 65) pubBytes = pubBytes.slice(1)

  const hash = keccak_256(pubBytes).toString()
  let addressHex = hash.substring(24)
  addressHex = ADDRESS_PREFIX + addressHex

  return addressHex
}

//return address by bytes, prKeyBytes is byte[]
export const getAddressFromPrKey = (privateKey: string): string => {
  const prKeyBytes = [...Buffer.from(privateKey, 'hex')]
  const pubBytes = getPubKeyFromPrKey(prKeyBytes)
  return computeAddress(pubBytes)
}

export const getBase58CheckAddress = (address: string): string => {
  const hash = sha256(sha256(address))
  const checkSum = hash.substr(0, 8)
  const fullAddress = Buffer.from(address + checkSum, 'hex')

  return encode58(fullAddress)
}

//return pubkey by 65 bytes, prKeyBytes is byte[]
const getPubKeyFromPrKey = (prKeyBytes: number[]) => {
  const ec = new EC('secp256k1')
  const key = ec.keyFromPrivate(prKeyBytes, 'bytes')
  const pubkey = key.getPublic() as BasePointXY
  const { x, y } = pubkey

  let xHex = x.toString('hex')
  while (xHex.length < 64) {
    xHex = '0' + xHex
  }

  let yHex = y.toString('hex')
  while (yHex.length < 64) {
    yHex = '0' + yHex
  }

  const pubkeyHex = '04' + xHex + yHex
  const pubkeyBytes = hexStr2byteArray(pubkeyHex)

  return pubkeyBytes
}

export const sha256 = (msg: string): string => crypto.createHash('sha256').update(Buffer.from(msg, 'hex')).digest('hex')
