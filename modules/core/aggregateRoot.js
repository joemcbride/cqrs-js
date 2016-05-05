import Subscriber from './subscriber'

class AggregateRoot extends Subscriber {
  constructor() {
    super()
    this.id = null
    this.version = 0
  }
}

export default AggregateRoot
