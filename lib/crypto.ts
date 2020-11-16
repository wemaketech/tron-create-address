import { encode } from 'bs58';
import { ec as EC } from 'elliptic';
import { keccak_256 } from 'js-sha3';
import { Base64 } from './base64';
import hash from 'hash.js';

const ADDRESS_PREFIX = '41';

function base64DecodeFromString(string64: string) {
  var b = new Base64();
  var decodeBytes = b.decodeToByteArray(string64);
  return decodeBytes;
}

const isHexChar = (c: string) => {
  if ((c >= 'A' && c <= 'F') || (c >= 'a' && c <= 'f') || (c >= '0' && c <= '9')) return 1;
  return 0;
};

const hexChar2byte = (c: string) => {
  let d = 0;
  if (c >= 'A' && c <= 'F') {
    d = c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
  } else if (c >= 'a' && c <= 'f') {
    d = c.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
  } else if (c >= '0' && c <= '9') {
    d = c.charCodeAt(0) - '0'.charCodeAt(0);
  }
  return d;
};

const hexStr2byteArray = (str: string) => {
  const byteArray = Array();
  let d = 0;
  let j = 0;
  let k = 0;

  for (let i = 0; i < str.length; i++) {
    const c = str.charAt(i);
    if (isHexChar(c)) {
      d <<= 4;
      d += hexChar2byte(c);
      j++;
      if (0 === j % 2) {
        byteArray[k++] = d;
        d = 0;
      }
    }
  }
  return byteArray;
};

//gen Ecc prKey for bytes
export const genPrKey = () => {
  let ec = new EC('secp256k1');
  let key = ec.genKeyPair();
  let prKey = key.getPrivate();
  let prKeyHex = prKey.toString('hex');
  while (prKeyHex.length < 64) {
    prKeyHex = '0' + prKeyHex;
  }

  return hexStr2byteArray(prKeyHex);
};

//return address by bytes, pubBytes is byte[]
function computeAddress(pubBytes: number[]) {
  if (pubBytes.length === 65) {
    pubBytes = pubBytes.slice(1);
  }

  var hash = keccak_256(pubBytes).toString();
  var addressHex = hash.substring(24);
  addressHex = ADDRESS_PREFIX + addressHex;
  return hexStr2byteArray(addressHex);
}

//return address by bytes, prKeyBytes is byte[]
export const getAddressFromPrKey = (prKeyBytes: number[]) => {
  let pubBytes = getPubKeyFromPrKey(prKeyBytes);
  return computeAddress(pubBytes);
};

//return address by Base58Check String,
export const getBase58CheckAddress = (addressBytes: number[]) => {
  var hash0 = SHA256(addressBytes);
  var hash1 = SHA256(hash0);
  let checkSum = hash1.slice(0, 4);
  // @ts-ignore
  checkSum = addressBytes.concat(checkSum);
  return encode(checkSum);
};

//return address by Base58Check String, prKeyBytes is base64String
export const getBase58CheckAddressFromPrKeyBase64String = (prKeyBase64String: string) => {
  var prKeyBytes = base64DecodeFromString(prKeyBase64String);
  var pubBytes = getPubKeyFromPrKey(prKeyBytes);
  var addressBytes = computeAddress(pubBytes);
  // @ts-ignore
  return getBase58CheckAddress(addressBytes);
};

//return pubkey by 65 bytes, prKeyBytes is byte[]
const getPubKeyFromPrKey = (prKeyBytes: number[]) => {
  var ec = new EC('secp256k1');
  var key = ec.keyFromPrivate(prKeyBytes, 'bytes');
  var pubkey = key.getPublic();
  // @ts-ignore
  var { x } = pubkey;
  // @ts-ignore
  var { y } = pubkey;
  var xHex = x.toString('hex');
  while (xHex.length < 64) {
    xHex = '0' + xHex;
  }
  var yHex = y.toString('hex');
  while (yHex.length < 64) {
    yHex = '0' + yHex;
  }
  var pubkeyHex = '04' + xHex + yHex;
  var pubkeyBytes = hexStr2byteArray(pubkeyHex);
  return pubkeyBytes;
};

//return 32 bytes
const SHA256 = (msgBytes: number[]) => {
  const msgHash = hash.sha256().update(msgBytes).digest('hex');
  // @ts-ignore
  return hexStr2byteArray(msgHash);
};
