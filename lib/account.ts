import { byteArray2hexStr } from './bytes'
import { genPrKey, getAddressFromPrKey, getBase58CheckAddress } from './crypto'

interface AccountInterface {
  address: string
  privateKey: string
}

/**
 * Generate a new account
 */
export const generateAccount = (): AccountInterface => {
  const prKeyBytes = genPrKey()
  const addressBytes = getAddressFromPrKey(prKeyBytes)
  const address = getBase58CheckAddress(addressBytes)
  const privateKey = byteArray2hexStr(prKeyBytes)

  return { address, privateKey }
}
