import { AccountInterface } from '../types'
import { computeAddress, genPrKey, getBase58CheckAddress } from './crypto'

/**
 * Generate a new account
 */
export const generateAccount = (): AccountInterface => {
  const { publicKey, privateKey } = genPrKey()
  const addressBytes = computeAddress(publicKey)
  const address = getBase58CheckAddress(addressBytes)

  return { address, privateKey }
}
