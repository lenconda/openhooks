import React from 'react'
import './App.css'
import { createHashHistory } from 'history'
import { Route, Router, Redirect, Switch } from 'react-router-dom'
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore } from './components/notification'
import Login from './pages/login/Login'
import Dashboard from './pages/dashboard/Dashboard'

export const history = createHashHistory()

class App extends React.Component {
  render() {
    return (
        <div>
          <Router history={history}>
            <Switch>
              <Route path={'/login'} component={Login}/>
              <Route path={'/dashboard'} component={Dashboard}/>
              <Redirect to={'/dashboard'}/>
            </Switch>
          </Router>
          <ToastsContainer position={ToastsContainerPosition.TOP_CENTER} store={ToastsStore}/>
        </div>
    )
  }
}

export default App
