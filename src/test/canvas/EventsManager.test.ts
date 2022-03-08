import { EventsManager, IEvent } from '../../canvas/EventsManager'

describe('EventsManager', () => {
  it('Correct initialize', () => {
    const element = document.createElement('div')
    const events: IEvent[] = []
    const eventsManager = new EventsManager(element, events)

    expect(eventsManager.events).toEqual(events)
  })

  it('Correct handle events', () => {
    const element = document.createElement('div')
    const eventHandler = jest.fn()
    const events: IEvent[] = [
      {
        buttons: ['x', 'y', 'z'],
        wheelSpinning: false,
        handler: eventHandler,
      },
    ]
    new EventsManager(element, events)

    document.body.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'x' }))
    expect(eventHandler).toBeCalledTimes(0)
    document.body.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'y' }))
    expect(eventHandler).toBeCalledTimes(0)
    document.body.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'z' }))
    expect(eventHandler).toBeCalledTimes(1)
  })
})
