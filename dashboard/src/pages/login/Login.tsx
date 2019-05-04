import React from 'react'
import './Login.css'
import http from '../../util/http'
import { history } from '../../App'

interface Props {}
interface State {
  rememberUser: boolean
  username: string
  password: string
}

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      rememberUser: false
    }
  }

  state: State

  login = () => {
    const { username, password } = this.state
    http.post('/api/login', { username, password })
        .then(res => {
          if (res)
            if (this.state.rememberUser)
              localStorage.setItem('token', res.data.data.token)
            else
              sessionStorage.setItem('token', res.data.data.token)
            history.push('/dashboard/hooks')
        })
  }

  render() {
    return (
        <div className="container">
          <div className="row login">
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <h1 className="h3 mb-3 font-weight-normal">Sign in</h1>
              <label htmlFor="inputEmail" className="sr-only">Username</label>
              <input type="email" className="form-control mb-3" placeholder="Username"
                     value={this.state.username}
                     onChange={e => this.setState({ username: e.target.value })}/>
              <label htmlFor="inputPassword" className="sr-only">Password</label>
              <input type="password" className="form-control mb-3" placeholder="Password"
                     value={this.state.password}
                     onChange={e => this.setState({ password: e.target.value })}/>
              <div className="checkbox mb-3">
                <label>
                  <input type="checkbox"
                         checked={this.state.rememberUser}
                         onChange={e => this.setState({ rememberUser: !this.state.rememberUser })}/> Remember me
                </label>
              </div>
              <button className="btn btn-lg btn-primary btn-block"
                      type="submit"
                      onClick={this.login}>
                Sign in
              </button>
              <p className="mt-5 mb-3 text-mute text-center">© 2019 Lenconda.</p>
            </div>
          </div>
        </div>
    )
  }
}

export default Login
