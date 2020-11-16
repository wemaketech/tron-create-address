import { expect } from 'chai'
import { generateAccount } from '../lib/account'
import { getAddressFromPrKey, getBase58CheckAddress } from '../lib/crypto'

describe('Create address & private key', () => {
  it('Should get an address from a private key correctry', () => {
    const prKey = 'E013356F33092E98A136B7C1F849B68534A0E0D5DC45745FFF57AF93BC76457A'
    const prKeyBytes = [...Buffer.from(prKey, 'hex')]
    const expectedAddress = 'TBcXhSqaeJGebiCbc1nbhPFF6A6teS36sU'
    const address = getBase58CheckAddress(getAddressFromPrKey(prKeyBytes))

    expect(address).to.equal(expectedAddress)
  })

  it('Should generate address & private key', () => {
    console.log(generateAccount())
  })
})
