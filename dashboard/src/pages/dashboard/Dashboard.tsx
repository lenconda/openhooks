import React from 'react'
import { Route, Switch, NavLink, Redirect } from 'react-router-dom'
import './Dashboard.css'
import http from '../../util/http'
import { history } from '../../App'

import Hooks from './hooks/Hooks'
import Keys from './keys/Keys'
import Histories from './histories/Histories'
import { ToastsStore } from '../../components/notification'

interface Props {}
interface State {
  username: string
  userId: string
  editUsername: string
  oldPassword: string
  editPassword: string
  retypePassword: string
}

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      username: '',
      userId: '',
      editUsername: '',
      oldPassword: '',
      editPassword: '',
      retypePassword: ''
    }
  }

  componentDidMount(): void {
    this.getProfile()
  }

  getProfile = () => {
    http.get('/api/profile')
    .then(res => {
      if (res)
        this.setState({
          username: res.data.data.username,
          editUsername: res.data.data.username,
          userId: res.data.data.uuid
        })
    })
  }

  logout = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    history.push('/login')
  }

  updateUsername = () => {
    http.put('/api/profile', {
      updates: {
        username: this.state.editUsername
      }
    })
    .then(res => {
      if (res)
        this.getProfile()
    })
  }

  updatePassword = () => {
    if (this.state.retypePassword === this.state.editPassword)
      http.put('/api/profile', {
        updates: {
          password: this.state.oldPassword,
          newPassword: this.state.editPassword
        }
      })
    else
      ToastsStore.error('New password does not equals to retyped password')
  }

  render() {
    return (
        <div>
          <nav className="navbar navbar-dark bg-dark mb-4">
            <NavLink className="navbar-brand" to="/dashboard">
              <img src="/logo.png" height="30px" width="30px" alt=""/>
            </NavLink>
            <button className="navbar-toggler d-lg-none d-xl-none" type="button"
                    data-toggle="collapse" data-target="#user"
                    aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
              <i className="fa fa-user"></i>
            </button>
            <div className="collapse navbar-collapse" id="user">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <a className="nav-link" role="button" data-toggle="modal" data-target="#update_username">
                    <i className="fa fa-edit"></i> Change username
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" role="button" data-toggle="modal" data-target="#update_password">
                    <i className="fa fa-key"></i> Change password
                  </a>
                </li>
                <div className="dropdown-divider"></div>
                <li className="nav-item">
                  <a className="nav-link" role="button" onClick={this.logout}>
                    <i className="fa fa-sign-out-alt"></i> Logout
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <div className="d-xs-block d-sm-block d-md-block d-lg-none d-xl-none">
                  <ul className="nav nav-pills mb-3">
                    <li className="nav-item">
                      <NavLink to="/dashboard/hooks" className="nav-link">Hooks</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/dashboard/keys" className="nav-link">Keys</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/dashboard/histories" className="nav-link">Histories</NavLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col col-xl-2 col-lg-3">
                <div className="d-none d-xs-none d-sm-none d-md-none d-lg-block d-xl-block">
                  <ul className="nav nav-pills flex-column mb-3">
                    <li className="nav-item dropdown" style={{ width: '100%' }}>
                      <a className="nav-link dropdown-toggle text-ellipsis"
                         data-toggle="dropdown" href="#" role="button"
                         aria-haspopup="true" aria-expanded="false">
                        <i className="fa fa-user-circle"></i> {this.state.username}
                      </a>
                      <div className="dropdown-menu">
                        <a className="dropdown-item" role="button" data-toggle="modal" data-target="#update_username">
                          <i className="fa fa-edit"></i> Change username
                        </a>
                        <a className="dropdown-item" role="button" data-toggle="modal" data-target="#update_password">
                          <i className="fa fa-key"></i> Change password
                        </a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" role="button" onClick={this.logout}>
                          <i className="fa fa-sign-out-alt"></i> Logout
                        </a>
                      </div>
                    </li>
                    <hr/>
                    <li className="nav-item">
                      <NavLink to="/dashboard/hooks" className="nav-link">Hooks</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/dashboard/keys" className="nav-link">Keys</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/dashboard/histories" className="nav-link">Histories</NavLink>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-12 col-xl-10 col-lg-9">
                <Switch>
                  <Route path={'/dashboard/hooks/:page'} component={Hooks}/>
                  <Route path={'/dashboard/keys/:page'} component={Keys}/>
                  <Route path={'/dashboard/histories/:page'} component={Histories}/>
                  <Redirect from={'/dashboard/keys'} to={'/dashboard/keys/1/'}/>
                  <Redirect from={'/dashboard/histories'} to={'/dashboard/histories/1/'}/>
                  <Redirect from={'/dashboard/hooks'} to={'/dashboard/hooks/1/'}/>
                  <Redirect from={'/dashboard'} to={'/dashboard/hooks'}/>
                </Switch>
              </div>
            </div>
          </div>
          <div className="modal fade" id="update_username" role="dialog"
               aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-ellipsis">
                    <i className="fa fa-user-circle"></i> Rename for {this.state.username}({this.state.userId})
                  </h5>
                  <button type="button" className="close" data-dismiss="modal"
                          aria-label="Close">
                    <span aria-hidden="true" className="text-white">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group form-group-sm">
                    <label>New username</label>
                    <input className="form-control form-control-sm"
                              value={this.state.editUsername}
                              onChange={e => this.setState({ editUsername: e.target.value })}/>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-sm btn-primary" data-dismiss="modal">
                    <i className="fa fa-times"></i> Cancel
                  </button>
                  <button
                      className="btn btn-sm btn-success"
                      data-dismiss="modal"
                      onClick={this.updateUsername}
                      disabled={this.state.editUsername === ''}>
                    <i className="fa fa-save"></i> Update
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" id="update_password" role="dialog"
               aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-ellipsis">
                    <i className="fa fa-key"></i> Change password
                  </h5>
                  <button type="button" className="close" data-dismiss="modal"
                          aria-label="Close">
                    <span aria-hidden="true" className="text-white">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Old password</label>
                    <input className="form-control form-control-sm"
                           type="password"
                           value={this.state.oldPassword}
                           onChange={e => this.setState({ oldPassword: e.target.value })}/>
                  </div>
                  <div className="form-group">
                    <label>New password</label>
                    <input className="form-control form-control-sm"
                           type="password"
                           value={this.state.editPassword}
                           onChange={e => this.setState({ editPassword: e.target.value })}/>
                  </div>

                  <div className="form-group">
                    <label>Retype password</label>
                    <input className="form-control form-control-sm"
                           type="password"
                           value={this.state.retypePassword}
                           onChange={e => this.setState({ retypePassword: e.target.value })}/>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-sm btn-primary" data-dismiss="modal">
                    <i className="fa fa-times"></i> Cancel
                  </button>
                  <button
                      className="btn btn-sm btn-success"
                      data-dismiss="modal"
                      onClick={this.updatePassword}
                      disabled={this.state.oldPassword === '' || this.state.editPassword === ''}>
                    <i className="fa fa-save"></i> Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default Dashboard
