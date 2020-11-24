import { expect } from 'chai'
import { generateAccount } from '../lib/account'
import { decode58 } from '../lib/base58'
import { computeAddress, getBase58CheckAddress, sha256 } from '../lib/crypto'

describe('Create address & private key', () => {
  let address: string
  beforeEach(() => ({ address } = generateAccount()))

  it('Should get an address from a public key correctry', () => {
    const pubKey =
      '04fd045ae283a2501e845fb043dd731a837f1ffdb8410405be50f48162a3ced69d591c2c399e1e3a8c89dbcb9c2a23197e5e3fbbb256a0a0faedbb3aa202d9e7ce'
    const expectedAddress = 'TUXQhnQqnmJFGummvrsB8jYa6EfL233qJo'
    const address = getBase58CheckAddress(computeAddress(pubKey))

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
