import { AccountInterface } from '../types'
import { genPrKey, getAddressFromPrKey, getBase58CheckAddress } from './crypto'

/**
 * Generate a new account
 */
export const generateAccount = (): AccountInterface => {
  const privateKey = genPrKey()
  const addressBytes = getAddressFromPrKey(privateKey)
  const address = getBase58CheckAddress(addressBytes)

  return { address, privateKey }
}
