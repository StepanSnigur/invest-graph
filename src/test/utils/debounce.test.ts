import { debounce } from '../../utils/debounce'

describe('debounce', () => {
  it('Correct calls count', () => {
    const fn = jest.fn()
    const debouncedFn = debounce(fn, 1000)

    for (let i = 0; i < 10; i++) {
      debouncedFn()
    }

    expect(fn).toBeCalled()
    expect(fn).toBeCalledTimes(1)
  })
  it('Correct calls count after delay', async () => {
    const fn = jest.fn()
    const debouncedFn = debounce(fn, 1000)

    for (let i = 0; i < 10; i++) {
      debouncedFn()
    }

    await new Promise((resolve) => setTimeout(resolve, 2000))
    for (let i = 0; i < 10; i++) {
      debouncedFn()
    }

    expect(fn).toBeCalled()
    expect(fn).toBeCalledTimes(2)
  })
})
