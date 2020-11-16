import { AccountInterface } from '../types'
import { genPrKey, getAddressFromPrKey, getBase58CheckAddress } from './crypto'

/**
 * Generate a new account
 */
export const generateAccount = (): AccountInterface => {
  const prKeyBytes = genPrKey()
  const addressBytes = getAddressFromPrKey(prKeyBytes)
  const address = getBase58CheckAddress(addressBytes)
  const privateKey = Buffer.from(prKeyBytes).toString('hex')

  return { address, privateKey }
}
