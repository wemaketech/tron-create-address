# Tron Wallet

A utility to generate Tron address and private key based on the source code of [TronWeb](https://github.com/TRON-US/tronweb).

## Installation

`$ npm i tron-create-address`

## Usage
### JavaScript
```
const { generateAccount } = require('tron-create-address')

const { address, privateKey } = generateAccount()
console.log(`Tron address is ${address}`)
console.log(`Tron private key is ${privateKey}`)
```

### TypeScript
```
import { generateAccount } from 'tron-create-address'

const { address, privateKey } = generateAccount()
console.log(`Tron address is ${address}`)
console.log(`Tron private key is ${privateKey}`)
```
