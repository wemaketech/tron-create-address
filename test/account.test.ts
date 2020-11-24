import { expect } from 'chai'
import { generateAccount } from '../lib/account'
import { decode58 } from '../lib/base58'
import { getAddressFromPrKey, getBase58CheckAddress, sha256 } from '../lib/crypto'

describe('Create address & private key', () => {
  let address: string
  beforeEach(() => ({ address } = generateAccount()))

  it('Should get an address from a private key correctry', () => {
    const prKey = 'E013356F33092E98A136B7C1F849B68534A0E0D5DC45745FFF57AF93BC76457A'
    const expectedAddress = 'TBcXhSqaeJGebiCbc1nbhPFF6A6teS36sU'
    const address = getBase58CheckAddress(getAddressFromPrKey(prKey))

    expect(address).to.equal(expectedAddress)
  })

  it('The length of address is correct', () => {
    expect(address.length).to.equal(34)
  })

  it('Address starts with `T`', () => {
    expect(address.substr(0, 1)).to.equal('T')
  })

  it('Checksum check', () => {
    const decodedAddr = decode58(address).toString('hex')
    const checkSum = decodedAddr.substr(-8)
    const pure = decodedAddr.substr(0, decodedAddr.length - 8)
    const hash = sha256(sha256(pure))

    expect(hash.substr(0, 8)).to.equal(checkSum)
  })
})
