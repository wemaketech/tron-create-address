import { expect } from 'chai'
import { generateAccount } from '../lib/account'
import { decode58 } from '../lib/base58'
import { computeAddress, getBase58CheckAddress, sha256 } from '../lib/crypto'

describe('Create address & private key', () => {
  let address: string
  beforeEach(() => ({ address } = generateAccount()))

  it('Should get an address from a public key correctry', () => {
    // const prKey = '46a3665750540cb4ff9b3ecb62b6aba3f30af7a136d383abd9428499e82fb8ef'
    const pubKey =
      '042f5329b55e25601a5ab7cefa6fd75437a013d8174559cb2cf45ee71e3f1fa3238b671b2e95343f38368f1f4eedc5d1474ccb61726a610b07584a149cf3725cc6'
    const expectedAddress = 'TD7J8GZpBCe5GdoA3QCVDhpfS2myvRvHD9'
    const address = getBase58CheckAddress(computeAddress(pubKey))

    expect(address).to.equal(expectedAddress)
  })

  it('The length of address is correct', () => {
    expect(address.length).to.equal(34)
  })

  it('Address starts with `T`', () => {
    expect(address.substring(0, 1)).to.equal('T')
  })

  it('Checksum check', () => {
    const decodedAddr = decode58(address).toString('hex')
    const checkSum = decodedAddr.substring(decodedAddr.length - 8)
    const pure = decodedAddr.substring(0, decodedAddr.length - 8)
    const hash = sha256(sha256(pure))

    expect(hash.substring(0, 8)).to.equal(checkSum)
  })
})
