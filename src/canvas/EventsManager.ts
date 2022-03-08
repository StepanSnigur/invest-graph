import { compareArrays } from "../utils/compareArrays"

export interface IEvent {
  buttons: string[],
  wheelSpinning: boolean,
  handler: (value: any) => void,
}
class EventsManager {
  private rootElement: HTMLElement = document.body

  // [listener name; listener; listener root element]
  private listeners: [string, (event: any) => void, HTMLElement][] = []
  public events: IEvent[] = []

  public holdedButtons: string[] = []

  constructor(element: HTMLElement, events: IEvent[]) {
    this.setRootElement(element)
    this.events = events

    this.addEventHandler('keydown', this.listenKeydown, true)
    this.addEventHandler('keyup', this.listenKeyup, true)
    this.addEventHandler('wheel', this.listenWheel)
  }

  private setRootElement = (element: HTMLElement) => {
    this.rootElement = element
  }
  public addEventHandler = (name: string, callback: (e: any) => void, isOnDocument = false) => {
    const eventRoot = isOnDocument ? document.body : this.rootElement
    eventRoot.addEventListener(name, callback)
    this.listeners.push([name, callback, eventRoot])
  }
  public checkEventActive = (wheelDiff?: number | null) => {
    this.events.forEach(event => {
      const allButtonsPressed = compareArrays(event.buttons, this.holdedButtons)
      if (allButtonsPressed && event.wheelSpinning === !!wheelDiff) {
        event.handler(wheelDiff)
      }
    })
  }

  private listenKeydown = (event: KeyboardEvent) => {
    if (!this.holdedButtons.includes(event.key)) {
      this.holdedButtons.push(event.key)
      this.checkEventActive()
    }
  }
  private listenKeyup = (event: KeyboardEvent) => {
    if (this.holdedButtons.includes(event.key)) {
      this.holdedButtons = this.holdedButtons.filter(key => key !== event.key)
    }
  }

  private listenWheel = (event: WheelEvent) => {
    this.checkEventActive(event.deltaY)
  }

  public removeListeners = () => {
    this.listeners.forEach(listener => listener[2].removeEventListener(listener[0], listener[1]))
  }
}

export {
  EventsManager,
}
