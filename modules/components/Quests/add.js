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
      value: 'The One Ring'
    }
  },

  add() {
    documents.commands.execute(questCommands.add, { name: this.state.value })
    this.context.router.goBack()
  },

  handleChange(event) {
    this.setState({ value: event.target.value })
  },

  render() {
    return (
      <div>
        <Title render={prev => `${prev} | Add Quest`}/>
        <h2>Add Quest</h2>
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}/>
        <button onClick={this.add}>Add</button>
      </div>
    )
  }
})
