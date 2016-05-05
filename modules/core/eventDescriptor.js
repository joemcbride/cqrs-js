import moment from 'moment'

class EventDescriptor {
  constructor(id, data, version) {
    this.id = id
    this.data = data
    this.version = version
    this.timestamp = moment()
  }
}

export default EventDescriptor
