class WebSocketApi {
  socketUrl: string
  socket: WebSocket | null

  constructor() {
    this.socketUrl = `wss://ws.twelvedata.com/v1/quotes/price?apikey=${process.env.REACT_APP_API_KEY}`
    this.socket = null
  }

  openConnection = (ticker: string, onMessage: (event: MessageEvent) => void) => {
    if (this.socket) {
      throw new Error('WebSocket is already open')
    }
    const socket = new WebSocket(this.socketUrl)
    this.socket = socket

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
  closeConnection = () => {
    if (this.socket) {
      this.socket.readyState !== 0 && this.socket.send(JSON.stringify({
        "action": "unsubscribe",
      }))
      this.socket.close()
      this.socket = null
    }
  }
}

const webSocketApi = new WebSocketApi()
export {
  webSocketApi
}
