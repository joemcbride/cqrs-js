import React from 'react'
import { IndexLink } from 'react-router'
import Title from 'react-title-component'

export default React.createClass({
  render() {
    return (
      <div>
        <Title render="Event Sourcing Quests"/>
        <h1>Welcome to your Quest</h1>
        <ul>
          <li><IndexLink to="/">Quests</IndexLink></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
})
