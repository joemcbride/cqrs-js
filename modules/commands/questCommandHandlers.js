import uuid from 'uuid'
import documents from '../domain/documents'
import questStartedEvent from '../domain/questStarted'
import membersJoinedEvent from '../domain/membersJoined'
import questCommands from './questCommands'

export default class QuestCommandHandlers {

  constructor() {
    this.handlers = []

    this.mapHandler(questCommands.add, this.addQuest)
    this.mapHandler(questCommands.join, this.membersJoined)
  }

  mapHandler(name, handler) {
    this.handlers.push({ name, handler })
  }

  addQuest(command) {
    documents.events.appendEvents(
      uuid.v4(),
      questStartedEvent(command.name)
    )
  }

  membersJoined(command) {

    // load aggregate
    // let model = documents.fetchEntity(input.id)
    // call method on aggregate
    // model.membersJoined(input.day, input.location, input.members)
    // persist aggregate
    // documents.save(model)

    documents.events.appendEvents(
      command.questId,
      membersJoinedEvent(command.day, command.location, command.members)
    )
  }
}
