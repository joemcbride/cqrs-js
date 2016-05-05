import AggregateRoot from '../core/aggregateRoot'
import questEvents from './questEvents'

export default class Quest extends AggregateRoot {
  constructor(id) {
    super()

    this.id = id
    this.day = 0
    this.location = ''
    this.members = []
    this.log = []

    super.handle(questEvents.questStarted, this.applyQuestStarted)
    super.handle(questEvents.membersJoined, this.applyMembersJoined)
    super.handle(questEvents.arrivedAtLocation, this.applyArrivedAtLocation)
  }

  canHandle(event) {
    return event.id === this.id
  }

  afterEach(event) {
    this.log.push(event.data.description)
  }

  applyQuestStarted(event) {
    this.name = event.data.name
  }

  applyMembersJoined(event) {
    this.day = event.data.day
    this.location = event.data.location
    this.members.push.apply(this.members, event.data.members)
  }

  applyArrivedAtLocation(event) {
    this.day = event.data.day
    this.location = event.data.location
  }
}
