/* Convert a byte to string */
export const byte2hexStr = (byte: number): string => {
  const hexByteMap = '0123456789ABCDEF'
  let str = ''
  str += hexByteMap.charAt(byte >> 4)
  str += hexByteMap.charAt(byte & 0x0f)
  return str
}

export const byteArray2hexStr = (byteArray: number[]): string => {
  let str = ''
  for (let i = 0; i < byteArray.length; i++) {
    str += byte2hexStr(byteArray[i])
  }
  return str
}
