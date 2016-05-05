import React from 'react'
import Title from 'react-title-component'
import documents from '../../domain/documents'
import questCommands from '../../commands/questCommands'

export default React.createClass({

  contextTypes: {
    router: React.PropTypes.object
  },

  getInitialState() {
    return {
      day: '1',
      location: 'Hobbiton',
      members: 'Frodo, Sam'
    }
  },

  add() {
    let id = this.props.routeParams.id
    let day = parseInt(this.state.day)
    let location = this.state.location
    let members = this.state.members.split(/[\s,]+/)

    documents.commands.execute(
      questCommands.join,
      {
        questId: id,
        day: day,
        location: location,
        members: members
      })

    this.context.router.goBack()
  },

  handleDayChange(event) {
    this.setState({ day: event.target.value })
  },

  handleLocationChange(event) {
    this.setState({ location: event.target.value })
  },

  handleMembersChange(event) {
    this.setState({ members: event.target.value })
  },

  render() {
    return (
      <div>
        <Title render={prev => `${prev} | Add Members to Quest`}/>
        <h2>Add Members</h2>
        Day: <input
          type="text"
          value={this.state.day}
          onChange={this.handleDayChange}/>
        Location: <input
          type="text"
          value={this.state.location}
          onChange={this.handleLocationChange}/>
        Members: <input
          type="text"
          value={this.state.members}
          onChange={this.handleMembersChange}/>
        <button onClick={this.add}>Add Members</button>
      </div>
    )
  }
})
