import React from 'react'
import Title from 'react-title-component'
import { Link } from 'react-router'
import documents from '../../domain/documents'
import Quest from '../../domain/quest'

export default React.createClass({

  contextTypes: {
    router: React.PropTypes.object
  },

  getInitialState() {
    return {
      q: {}
    }
  },

  componentDidMount() {
    let id = this.props.routeParams.id
    let quest = new Quest(id)

    try {
      documents.events.aggregateStream(id, quest)
    } catch(e) {
      this.context.router.push('/quests')
    }

    this.setState({ q: quest })
  },

  render() {
    let { q } = this.state
    let members = q.members ? q.members.join(', ') : null
    let log = q.log ? q.log : []

    let status = log.length > 1
      ? `Quest Status: ${q.name} is at ${q.location} on day ${q.day} with members ${members}`
      : `Quest Status: ${log[0]}`

    let logList = log
      ? log.map((l, index) => <li key={index}>{l}</li>)
      : null

    return (
      <div>
        <Title render={prev => `${prev} | Quest ${q.name}`}/>
        <p>{status}</p>
        <p>Quest Log:</p>
        <ul>{logList}</ul>
        <Link to={`/quest/add-members/${q.id}`}>Add Members</Link>
      </div>
    )
  }
})
