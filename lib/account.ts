import { byteArray2hexStr } from './bytes'
import { genPrKey, getAddressFromPrKey, getBase58CheckAddress } from './crypto'

/**
 * Generate a new account
 */
export const generateAccount = () => {
  const prKeyBytes = genPrKey()
  const addressBytes = getAddressFromPrKey(prKeyBytes)
  // @ts-ignore
  const address = getBase58CheckAddress(addressBytes)
  const privateKey = byteArray2hexStr(prKeyBytes)

  return { address, privateKey }
}
