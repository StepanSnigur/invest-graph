export const convertUnixDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`
}
export const getUnixDate = (date: string): number => {
  const parsedDate = date.replaceAll('-', '/')
  const timestamp = Date.parse(parsedDate) / 1000
  return timestamp
}

export interface IConvertedTimestampsDiff {
  '1min': boolean,
  '5min': boolean,
  '15min': boolean,
  '30min': boolean,
  '45min': boolean,
  '1h': boolean,
  '2h': boolean,
  '4h': boolean,
  '1day': boolean,
  '1week': boolean,
  '1month': boolean,
}
export const getTimestampsDiff = (secondsDiff: number): IConvertedTimestampsDiff => {
  return {
    '1min': secondsDiff > 60,
    '5min': secondsDiff > 60 * 5,
    '15min': secondsDiff > 60 * 15,
    '30min': secondsDiff > 60 * 30,
    '45min': secondsDiff > 60 * 45,
    '1h': secondsDiff > 60 * 60,
    '2h': secondsDiff > 60 * 60 * 2,
    '4h': secondsDiff > 60 * 60 * 4,
    '1day': secondsDiff > 60 * 60 * 24,
    '1week': secondsDiff > 60 * 60 * 24 * 7,
    '1month': secondsDiff > 60 * 60 * 24 * 30,
  }
}
