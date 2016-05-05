import questEvents from './questEvents'

export default function (day, location, members) {
  let memberText = members.length > 1 ? 'Members' : 'Member'
  return {
    eventName: questEvents.membersJoined,
    description: `${memberText} ${members.join(', ')} joined at ${location} on Day ${day}`,
    day: day,
    location: location,
    members: members
  }
}
