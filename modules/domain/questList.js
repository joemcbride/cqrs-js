import Subscriber from '../core/subscriber'
import questEvents from './questEvents'
import find from 'lodash/find'

export default class QuestList extends Subscriber {
  constructor() {
    super()

    this.quests = []

    super.handle(questEvents.questStarted, this.applyQuestStarted)
    super.handle(questEvents.membersJoined, this.applyMembersJoined)
  }

  applyQuestStarted(event) {
    this.quests.push({
      id: event.id,
      version: event.version,
      name: event.data.name
    })
  }

  applyMembersJoined(event) {
    let quest = find(this.quests, { 'id': event.id })
    quest.version = event.version
  }
}
