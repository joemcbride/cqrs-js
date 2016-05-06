slidenumbers: true
build-lists: true

# [fit] Event Sourcing and CQRS

---

# CQRS

---

# CQRS
* Command Query Responsibility Segregation
* A pattern for separating read and write operations
* Key motivation is separation of concerns

---

# Command / Query
* Query (read) returns data and does not alter the state of the object
* Command (write) changes the state of an object but does not return any data

---

```csharp
// LocationService - typical CRUD
void MarkLocationPreferred(LocationId)
Location GetLocation(LocationId)

// apply CQRS

// LocationWriteService
void MarkLocationPreferred(LocationId)

// LocationReadService
Location GetLocation(LocationId)
```
---

![inline](http://i.imgur.com/1IQ5Gzf.png)

^ Put like this it isn't terribly interesting, though it allows some powerful options which we'll talk about

---

# Where do you put CQRS?
* Greg Young says ...
* CQRS is not a top-level architecture
* Top-level will look more like SOA and EDA [service-oriented or event-driven (messaging) architecture]

---

# Enables Task Based UI
* Different than CRUD
* Domain Driven Design requires tasks
* CQRS is not required

^ * Enables task centered UI actions
 - submit application, reserve seats, join quest
* Tasks are more user centered
* CRUD tends to shape the solution vs. focus on business need

---

# Event Sourcing

---

# DDD Definitions

---

# Domain Model
* Captures domain knowledge from the domain experts
* Enables the team to determine scope and verify the consistency of that knowledge
* Expressed in code by the developers

---

# Ubiquitous Language
* Defined when talking with domain experts
* Identify nouns / verbs when talking about the business process
* "Quest" is a noun
* "start" is a verb
* start, join, leave - these are your tasks

---

# Entities, value objects, services
* Entity - defined by an identity which is constant
* Value objects - defined by their values
* Services - an example would be a 3rd party service, which is typically stateless

---

# Aggregates
* A cluster of related entities and value objects that form a consistency boundary within the system
* That consistency boundary is usually based on transactional consistency

---

# Aggregate Root
* Gatekeeper object for the aggregate
* All access to the objects within the aggregate must occur through the aggregate root
* External entities are only permitted to hold a reference to the aggregate root

---

# Aggregate in Action

```javascript
// working with an aggregate
membersJoined(cmd) {
  // load aggregate
  let agg = documents.fetchEntity(cmd.entityId)
  // call method on aggregate
  agg.membersJoined(cmd.day, cmd.location, cmd.members)
  // persist aggregate
  documents.save(agg)
}
```

---

# Bounded Contexts
* A grouping of domain models, ubiquitous language, entities, etc. within the overall system
* Larger systems may have multiple bounded contexts

^ Conference management application - Conference Reservations, Program Management (speakers, sessions), Badge Printing

---

# Context map
* Documentation that describes the relationships between bounded contexts

---

# Back to the less abstract...

---

# Events
* Notifications of something that has already happened
* Immutable one-way messages
* Published by a single source, may have multiple subscribers

```javascript
documents.appendEvents(id, bookSeat({name: 'Quinn', seat: 'E23'}))
```

---

# Events Cont.
* Typically include additional information about the event
* Should describe business intent

```
Seat E23 was booked by Quinn
- vs. -
In the bookings table the row with key E23 had the
name field updated with the value Quinn
```

---

![inline](http://i.imgur.com/OZT3PUp.png)

^ Can possibly use separate data stores for read/write, each store optimized for its use case.

---

# Events and Aggregates
* Aggregates define consistency boundaries
* Use an event raised by an aggregate to notify interested parties that a transaction has taken place
* Use the ID of an aggregate to determine the source of the event

---

# Event Sourcing
* Persisting your application's state by storing the history that determines the current state of your application
* Replay the event stream to get the current state

---

![inline](http://i.imgur.com/2KukK7v.png)

^ Example: a bank balance

---
# membersJoined command
```javascript
{
  entityId: '345',
  day: 1,
  location: 'Hobbiton',
  members: [ 'Frodo', 'Sam' ]
}
```

---

# Command Handler
```javascript
// working with aggregate
membersJoined(cmd) {
  let agg = documents.fetchEntity(cmd.entityId)
  agg.membersJoined(cmd.day, cmd.location, cmd.members)
  documents.save(agg)
}
```

---

# Repository Pattern
```javascript
class Documents {
  save(aggregate) {
    documents.appendEvents(
      aggregate.id,
      aggregate.uncommitedChanges() // list of events
    )
  }
}
```

---
# Event Sourcing
```javascript
membersJoined(cmd) {
  documents.appendEvents(
    cmd.entityId,
    membersJoinedEvent(cmd.day, cmd.location, cmd.members)
  )
}
```
---
# An Aggregate

```javascript
class Quest extends AggregateRoot {
  constructor(id) {
    super()
    this.id = id
    this.name = null

    super.handle('event:quest:started', this.applyQuestStarted)
  }

  applyQuestStarted(event) {
    this.name = event.data.name
  }
}
```

---

# Replay Events

```javascript
handle(name, handler) {
  this.handlers.push({
    name: name,
    handler: handler
  })
}

loadFromHistory(events) {
  each(events, event => this.applyChange(event))
}
```

---

# ApplyChange

```javascript
applyChange(event) {
  this.version = event.version

  const handle = find(
    this.handlers,
    { 'name': event.data.eventName }
  )
  handle.handler(event)
}
```

---

# Demo

---

# Snapshots
* Create a "snapshot" of an aggregate at a current state
* Load the snapshot and any future events vs. the whole event stream

---

# Sagas
* Coordinate and route messages between bounded contexts and aggregates
* Manage a long-lived business transaction or process
* An alternative to using a distributed transaction - avoid locks
* Duration doesn't have to be days/weeks, can be seconds

---

# Sagas cont.
* Manage process, not business logic
* State machines

---

# Aggregates without a Saga

![inline](http://i.imgur.com/TkRmrH1.png)

---

# Aggregates with a Saga

![inline](http://i.imgur.com/dpWLy1M.png)

---

# Why use CQRS?

* Scalability
* Reduced complexity
* Flexability
* Focus on the business
* Facilitates task-based UIs

^ Scalability - the number of reads typically exceed number of writes
Reduced complexity - read logic is typically much simpler and can be decoupled, separation of concerns, multiple users, performance, transactions, consistency
Flexability - Add more read views (reports) without dealing with mutation logic
Focus on business - CRUD tends to shape the solution, CQRS helps you focus on tasks
Tasked based UI - tasks tend to focus on the domain operations and the ubiquitous language
CAP Theorem - Consistency, Availability, Partition Tolerance - choose two
 - can choose different decisions on the write vs. read

---

# Why use Event Sourcing

* Audit trail
* Performance - events are immutable
* Simplification - simple objects that describe what happened, not a complex object
* Additional business value from event history
* Testing

---

# Potential Barriers
* Learning curve is steep
* Stale data - "eventually consistent"

---

# When to Avoid Event Sourcing and CQRS (according to Udi)
* Simple domains
* Non-collaborative environments

---

# Resources
* Exploring CQRS and Event Sourcing - free book by Microsoft Patterns & Practices
  * https://msdn.microsoft.com/en-us/library/jj554200.aspx
  * Most images are taken from this book
* Greg Young
  * http://github.com/gregoryyoung/m-r
  * http://www.youtube.com/watch?v=8JKjvY4etTY

---

# Resources
* Jonathan Oliver - Sagas
  * http://blog.jonathanoliver.com/cqrs-sagas-with-event-sourcing-part-i-of-ii/
* Marten - http://jasperfx.github.io/marten


---

# http://github.com/joemcbride/cqrs-js
