class SettingsSaver {
  private nameInStorage = 'settings'
  private defaultSettings = {
    maxCandlesOnScreenCount: 150,
    scaleY: 0.9,
    interval: '1min',
  }

  checkDefaultSettings = () => {
    const data = this.getData()
    if (data) {
      return data
    } else {
      this.setDefautSettings()
      return this.defaultSettings
    }
  }

  setDefautSettings = () => {
    return localStorage.setItem(this.nameInStorage, JSON.stringify(this.defaultSettings))
  }
  getData = () => {
    const data = localStorage.getItem(this.nameInStorage)

    if (data) {
      return JSON.parse(data)
    }
    return null
  }
  changeField = (fieldName: string, value: any) => {
    const data = this.getData()
    if (data) {
      data[fieldName] = value

      const newData = JSON.stringify(data)
      localStorage.setItem(this.nameInStorage, newData)
    }
  }
}

const settingsSaver = new SettingsSaver()
export {
  settingsSaver,
}
