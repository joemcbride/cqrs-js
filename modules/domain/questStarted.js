import questEvents from './questEvents'

export default function (name) {
  return {
    eventName: questEvents.questStarted,
    description: `Quest ${name} started`,
    name: name
  }
}
