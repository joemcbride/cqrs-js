import React from 'react'
import Title from 'react-title-component'
import { Link } from 'react-router'
import documents from '../../domain/documents'
import QuestList from '../../domain/questList'

export default React.createClass({
  getInitialState() {
    return {
    }
  },

  componentDidMount() {
    let questList = new QuestList()

    documents.events.aggregateAllStreams(questList)

    this.setState({ q: questList })
  },

  render() {
    let quests = this.state.q != null
      ? this.state.q.quests.map(q =>
        <li key={`${q.id}-${q.version}`}>
          <Link to={`/quest/${q.id}`}>{q.name} ({q.version})</Link>
        </li>
      )
      : null
    return (
      <div>
        <Title render={prev => `${prev} | Quest`}/>
        <h2>Quests</h2>
        <Link to="/quest/add">Add Quest</Link>
        <ul>
          {quests}
        </ul>
      </div>
    )
  }
})
