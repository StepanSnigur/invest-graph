class ApiConfig {
  apiUrl: string

  constructor() {
    this.apiUrl = 'https://api.twelvedata.com'
  }

  makeRequest = async (url: string, params: object = {}) => {
    const data = await fetch(`${this.apiUrl}/${url}&apikey=${process.env.REACT_APP_API_KEY}`, params)
    return await data.json()
  }
}

export {
  ApiConfig
}
