import BN from 'bn.js'
import { curve } from 'elliptic'

export interface AccountInterface {
  address: string
  privateKey: string
}

export interface BasePointXY extends curve.base.BasePoint {
  x: BN
  y: BN
}
