import crypto from 'crypto'
import { keccak_256 } from 'js-sha3'
import { encode58 } from './base58'

const ADDRESS_PREFIX = '41'

export const genPrKey = (): { publicKey: string; privateKey: string } => {
  const ecdh = crypto.createECDH('secp256k1')
  ecdh.generateKeys()
  return { publicKey: ecdh.getPublicKey('hex'), privateKey: ecdh.getPrivateKey('hex') }
}

export const computeAddress = (publicKey: string): string => {
  let pubBytes = [...Buffer.from(publicKey, 'hex')]
  if (pubBytes.length === 65) pubBytes = pubBytes.slice(1)

  const hash = keccak_256(pubBytes)
  let addressHex = hash.substring(24)
  addressHex = ADDRESS_PREFIX + addressHex

  return addressHex
}

export const getBase58CheckAddress = (address: string): string => {
  const hash = sha256(sha256(address))
  const checkSum = hash.substring(0, 8)
  const fullAddress = Buffer.from(address + checkSum, 'hex')

  return encode58(fullAddress)
}

export const sha256 = (msg: string): string => crypto.createHash('sha256').update(Buffer.from(msg, 'hex')).digest('hex')
