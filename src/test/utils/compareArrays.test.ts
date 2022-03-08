import { compareArrays } from '../../utils/compareArrays'

describe('compareArrays', () => {
  it('Returns correct value with equal arrays', () => {
    const arr1 = [1, 2, 3, 4]
    const arr2 = [1, 2, 3, 4]

    expect(compareArrays(arr1, arr2)).toEqual(true)
  })
  it('Returns correct value with different arrays', () => {
    const arr1 = [1, 2, 3, 4]
    const arr2 = [5, 6, 7, 8]

    expect(compareArrays(arr1, arr2)).toEqual(false)
  })
  it('Returns correct value with different array lenght', () => {
    const arr1 = [1, 2, 3, 4]
    const arr2 = [1, 2, 3, 4, 5]

    expect(compareArrays(arr1, arr2)).toEqual(false)
  })
  it('Returns correct value with different array order', () => {
    const arr1 = [1, 2, 3, 4]
    const arr2 = [4, 3, 2, 1]

    expect(compareArrays(arr1, arr2)).toEqual(false)
  })
})
