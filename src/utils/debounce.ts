export const debounce = (cb: (...args: any) => void, ms: number) => {
  let isCooldown = false;

  return (...args: any) => {
    if (isCooldown) return false
    cb(...args)

    isCooldown = true;
    setTimeout(() => isCooldown = false, ms)
  }
}