import questEvents from './questEvents'

export default function (day, location) {
  return {
    eventName: questEvents.arrivedAtLocation,
    description: `Arrived at ${location} on Day ${day}`,
    day: day,
    location: location
  }
}
