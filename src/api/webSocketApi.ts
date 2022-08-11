class WebSocketApi {
  socketUrl: string

  constructor() {
    this.socketUrl = `wss://ws.twelvedata.com/v1/quotes/price?apikey=${process.env.REACT_APP_API_KEY}`
  }

  openConnection = (ticker: string, onMessage: (event: MessageEvent) => void) => {
    const socket = new WebSocket(this.socketUrl)

    socket.onopen = () => {
      socket.send(JSON.stringify({
        "action": "subscribe",
        "params": {
          "symbols": ticker,
        },
      }))
    }
    socket.onmessage = (event) => {
      onMessage(event)
    }
  }
}

const webSocketApi = new WebSocketApi()
export {
  webSocketApi
}
