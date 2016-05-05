import '../modules/styles.css'
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { ServerRoute } from 'react-project'
import hello from './api/hello'
import App from './components/App'
import NoMatch from './components/NoMatch'
import Quests from './components/Quests'
import QuestDetails from './components/Quests/details'
import AddQuest from './components/Quests/add'
import AddMembers from './components/Quests/addMembers'

export default (
  <Route>
    <Route path="/" component={App}>
      <IndexRoute component={Quests}/>
      <Route path="quests" component={Quests}/>
      <Route path="quest/add" component={AddQuest}/>
      <Route path="quest/add-members/:id" component={AddMembers}/>
      <Route path="quest/:id" component={QuestDetails}/>
    </Route>
    <ServerRoute path="/api">
      <ServerRoute path=":hello" get={hello}/>
    </ServerRoute>
    <Route path="*" status={404} component={NoMatch}/>
  </Route>
)
