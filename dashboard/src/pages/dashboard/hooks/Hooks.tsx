import React from 'react'
import _ from 'lodash'
import http from '../../../util/http'
import Pagination from '../../../components/pagination/Pagination'
import { getFormattedTime } from '../../../util/time'
import {
  HookInfo } from '../../../../../src/server/app/services/dashboard'

interface Props {
  match: any
}

interface State {
  next: boolean
  data: HookInfo[]
  currentPage: number
  pages: number
  createCommand: string
  createDescription: string
  createAuthentication: string
  editUuid: string
  editCommand: string
  editDescription: string
  editAuthentication: string
  keys: string[]
  currentKeys: string[]
  manageKeysFor: string
  manageUsedKeys: string[]
  manageUnusedKeys: string[]
}

class Hooks extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      currentPage: 1,
      pages: 1,
      next: false,
      data: [],
      createCommand: '',
      createDescription: '',
      createAuthentication: '1',
      editUuid: '',
      editCommand: '',
      editDescription: '',
      editAuthentication: '',
      keys: [],
      currentKeys: [],
      manageKeysFor: '',
      manageUnusedKeys: [],
      manageUsedKeys: []
    }
  }

  componentDidMount(): void {
    this.getKeys()
    this.getHooks(this.props.match.params.page)
  }

  componentWillReceiveProps(
      nextProps: Readonly<Props>, nextContext: any): void {
    this.setState({
      currentPage: parseInt(nextProps.match.params.page)
    })
    this.getHooks(nextProps.match.params.page)
  }

  getKeys = () => {
    http.get('/api/all_keys')
    .then(res => {
      if (res) {
        const keys = res.data.data.items.map(
            (value: any, index: number) => value.value)
        this.setState({ keys })
      }
    })
  }

  getHooks = (page: number) => {
    http.get(`/api/hooks?page=${page}`)
    .then(res => {
      if (res)
        this.setState({
          next: res.data.data.next,
          data: res.data.data.items,
          pages: res.data.data.pages
        })
    })
  }

  handleManageKeys = (item: any) => {
    this.setState({
      manageKeysFor: item.uuid,
      manageUsedKeys: item.keys,
      currentKeys: item.keys,
      manageUnusedKeys: _.difference(this.state.keys, item.keys)
    })
  }

  addKeyToUsedKeys = (key: string) => {
    this.setState({
      manageUsedKeys: [...this.state.manageUsedKeys, key],
      manageUnusedKeys: _.difference(this.state.keys, [...this.state.manageUsedKeys, key])
    })
  }

  deleteKeyFromUsedKeys = (key: string) => {
    this.setState({
      manageUnusedKeys: [...this.state.manageUnusedKeys, key],
      manageUsedKeys: _.difference(this.state.keys, [...this.state.manageUnusedKeys, key])
    })
  }

  updateKeys = () => {
    http.delete(`/api/auth/${this.state.manageKeysFor}`,
        { data: { keys: _.difference(this.state.currentKeys, this.state.manageUsedKeys) } }).then(deleteRes => {
          if (deleteRes)
            http.post(`/api/auth/${this.state.manageKeysFor}`,
                { keys: _.difference(this.state.manageUsedKeys, this.state.currentKeys) }).then(addRes => {
                  if (addRes) {
                    this.getKeys()
                    this.getHooks(this.props.match.params.page)
                    this.setState({
                      currentKeys: [],
                      manageKeysFor: '',
                      manageUnusedKeys: [],
                      manageUsedKeys: []
                    })
                  }
            })
    })
  }

  handleEditHook = (item: any) => {
    this.setState({
      editUuid: item.uuid,
      editCommand: item.command,
      editDescription: item.description,
      editAuthentication: item.auth ? '0' : '1'
    })
  }

  clearEditHook = () => {
    this.setState({
      editUuid: '',
      editCommand: '',
      editDescription: '',
      editAuthentication: ''
    })
  }

  updateHook = () => {
    http.put(`/api/hook/${this.state.editUuid}`, {
      updates: {
        command: this.state.editCommand,
        description: this.state.editDescription,
        auth: this.state.editAuthentication === '0'
      }
    })
    .then(res => {
      if (res)
        this.getHooks(this.state.currentPage)
        this.clearEditHook()
    })
  }

  createHook = () => {
    http.post('/api/hooks', {
      command: this.state.createCommand,
      description: this.state.createDescription,
      auth: this.state.createAuthentication === '0'
    }).then(res => {
      if (res) {
        this.getHooks(this.props.match.params.page)
        this.setState({
          createCommand: '',
          createDescription: '',
          createAuthentication: '0'
        })
      }
    })
  }

  deleteHook = (uuid: string) => {
    if (window.confirm(`Sure to delete hook /hooks/${uuid}?`))
      http.delete(`/api/hook/${uuid}`)
        .then(res => {
          if (res)
            this.getHooks(this.state.currentPage)
        })
  }

  clearHooks = () => {
    if (window.confirm(`Sure to CLEAR ALL hooks?`))
      http.delete('/api/hooks')
      .then(res => {
        if (res)
          this.getHooks(this.state.currentPage)
      })
  }

  renderTable = () => {
    return this.state.data.length === 0 ? <span>There are no hooks yet...</span> :
        <div className="overflow-x-auto">
          <table className="table table-bordered table-striped table-hover text-nowrap">
            <thead>
            <tr>
              <th>Path</th>
              <th>Command</th>
              <th>Description</th>
              <th>Authentication</th>
              <th>Update Time</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {
              this.state.data.map((item, index) =>
                  <tr key={index}>
                    <td><code>/hooks/{item.uuid}</code></td>
                    <td><code>{item.command}</code></td>
                    <td>{item.description}</td>
                    <td className="text-center">
                      {item.auth ? <i className="fa fa-check"></i> : <i className="fa fa-times"></i>}
                    </td>
                    <td>{getFormattedTime(item.updateTime)}</td>
                    <td>
                      {
                        !item.auth ? null :
                            <button className="btn btn-sm btn-warning mx-1"
                                    data-toggle="modal"
                                    data-target="#manage_keys"
                                    onClick={() => this.handleManageKeys(item)}>
                              <i className="fa fa-key"></i> Manage Keys
                            </button>
                      }
                      <button type="button"
                              className="btn btn-sm btn-warning mx-1"
                              data-toggle="modal"
                              data-target="#edit_hook"
                              onClick={() => this.handleEditHook(item)}>
                        <i className="fa fa-edit"></i> Edit
                      </button>
                      <button className="btn btn-sm btn-danger mx-1"
                              onClick={() => {this.deleteHook(item.uuid)}}>
                        <i className="fa fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
              )
            }
            </tbody>
          </table>
        </div>
  }

  render() {
    return (
        <div>
          <div className="mb-3">
            <button type="button" className="btn btn-success btn-sm"
                    data-toggle="modal" data-target="#add_hook">
              <i className="fa fa-lightbulb"></i>&nbsp;Add a Hook
            </button>
            <button type="button"
                    className="btn btn-danger btn-sm"
                    style={{marginLeft: 10}}
                    onClick={this.clearHooks}>
              <i className="fa fa-trash"></i>&nbsp;Clear All
            </button>
          </div>
          {this.renderTable()}
          <div className="my-3">
            {
              this.state.data.length === 0 ? null :
                  <div className="panel-footer">
                    <Pagination current={this.state.currentPage} total={this.state.pages} route="/dashboard/hooks" />
                  </div>
            }
          </div>
          <div className="modal fade" id="add_hook" role="dialog"
               aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-ellipsis"><i className="fa fa-lightbulb"></i> Add a Hook</h5>
                  <button type="button" className="close" data-dismiss="modal"
                          aria-label="Close">
                    <span aria-hidden="true" className="text-white">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Shell command</label>
                    <code>
                      <textarea className="form-control form-control-sm"
                                value={this.state.createCommand}
                                onChange={e => this.setState({ createCommand: e.target.value })}/>
                    </code>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-control form-control-sm"
                              value={this.state.createDescription}
                              onChange={e => this.setState({ createDescription: e.target.value })}/>
                  </div>
                  <div className="form-group">
                    <label>Authentication</label>
                    <select className="form-control form-control-sm"
                            onChange={e => this.setState({ createAuthentication: e.target.value })}>
                      <option value="0" selected={this.state.createAuthentication === '0'}>Use access key</option>
                      <option value="1" selected={this.state.createAuthentication === '1'}>Do not use any key</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-sm btn-primary" data-dismiss="modal"><i className="fa fa-times"></i> Cancel</button>
                  <button
                      className="btn btn-sm btn-success"
                      data-dismiss="modal"
                      onClick={this.createHook}
                      disabled={this.state.createAuthentication === ''
                      || this.state.createDescription === ''
                      || this.state.createCommand === ''}>
                    <i className="fa fa-save"></i> Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" id="edit_hook" role="dialog"
               aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-ellipsis">
                    <i className="fa fa-edit"></i> Edit Hook {this.state.editUuid}
                  </h5>
                  <button type="button" className="close" data-dismiss="modal"
                          aria-label="Close">
                    <span aria-hidden="true" className="text-white">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Shell command</label>
                    <code>
                      <textarea className="form-control form-control-sm"
                                value={this.state.editCommand}
                                onChange={e => this.setState({ editCommand: e.target.value })}/>
                    </code>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-control form-control-sm"
                              value={this.state.editDescription}
                              onChange={e => this.setState({ editDescription: e.target.value })}/>
                  </div>
                  <div className="form-group">
                    <label>Authentication</label>
                    <select className="form-control form-control-sm"
                            onChange={e => this.setState({ editAuthentication: e.target.value })}>
                      <option value="0" selected={this.state.editAuthentication === '0'}>Use access key</option>
                      <option value="1" selected={this.state.editAuthentication === '1'}>Do not use any key</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-sm btn-primary" data-dismiss="modal" onClick={this.clearEditHook}>
                    <i className="fa fa-times"></i> Cancel
                  </button>
                  <button
                      className="btn btn-sm btn-success"
                      data-dismiss="modal"
                      onClick={this.updateHook}
                      disabled={this.state.editAuthentication === ''
                      || this.state.editAuthentication === ''
                      || this.state.editAuthentication === ''}>
                    <i className="fa fa-save"></i> Update
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" id="manage_keys" role="dialog"
               aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-ellipsis">
                    <i className="fa fa-key"></i> Manage Keys
                  </h5>
                  <button type="button" className="close" data-dismiss="modal"
                          aria-label="Close">
                    <span aria-hidden="true" className="text-white">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col">
                        <ul className="nav nav-tabs">
                          <li className="nav-item">
                            <a className="nav-link active" href="#not_set" data-toggle="tab">Unused Keys</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link" href="#set" data-toggle="tab">Used Keys</a>
                          </li>
                        </ul>
                        <div id="myTabContent" className="tab-content">
                          <div className="tab-pane active" id="not_set">
                            <ul className="list-group">
                              {
                                this.state.manageUnusedKeys.map(
                                    (value, index) =>
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                          {value}
                                          <button className="btn btn-sm btn-success"
                                                  onClick={() => this.addKeyToUsedKeys(value)}>
                                            <span className="fa fa-plus"></span>
                                          </button>
                                        </li>
                                )
                              }
                            </ul>
                          </div>
                          <div className="tab-pane" id="set">
                            <ul className="list-group">
                              {
                                this.state.manageUsedKeys.map(
                                    (value, index) =>
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                          {value}
                                          <button className="btn btn-sm btn-danger"
                                                  onClick={() => this.deleteKeyFromUsedKeys(value)}>
                                            <span className="fa fa-times"></span>
                                          </button>
                                        </li>
                                )
                              }
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-sm btn-primary" data-dismiss="modal" onClick={this.clearEditHook}>
                    <i className="fa fa-times"></i> Cancel
                  </button>
                  <button
                      className="btn btn-sm btn-success"
                      data-dismiss="modal"
                      onClick={this.updateKeys}>
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

export default Hooks
