import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import debug from 'debug'
import routes from '../modules/routes'

if(process.env.NODE_ENV !== 'production') {
  debug.enable('commands*,events*')
}

render(
  <Router history={browserHistory} routes={routes}/>,
  document.getElementById('app')
)
