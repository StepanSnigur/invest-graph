const SYMBOLS_AFTER_COMMA_COUNT = 5

export const roundPrice = (price: number) => {
  return price.toFixed(SYMBOLS_AFTER_COMMA_COUNT)
}
