import { settingsSaver } from '../../utils/settingsSaver'

describe('settingsSaver', () => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
  }
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })

  it('Correct check default settings', () => {
    const defaultSettings = {
      interval: '1min',
      maxCandlesOnScreenCount: 150,
      scaleY: 0.9,
    }

    const settings = settingsSaver.checkDefaultSettings()
    expect(settings).toEqual(defaultSettings)
    expect(localStorageMock.getItem).toBeCalledTimes(1)
    expect(localStorageMock.setItem).toBeCalledTimes(1)
  })
  it('Correct check changed settings', () => {
    settingsSaver.getData = () => ({})

    settingsSaver.setDefautSettings()
    settingsSaver.changeField('maxCandlesOnScreenCount', 210)
    settingsSaver.changeField('scaleY', 0.5)
    expect(localStorageMock.setItem).toBeCalledTimes(3)
  })
})
