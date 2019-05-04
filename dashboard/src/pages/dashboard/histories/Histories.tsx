import React from 'react'
import http from '../../../util/http'
import Pagination from '../../../components/pagination/Pagination'
import { getFormattedTime } from '../../../util/time'

interface HistoryItem {
  uuid: string
  routerId: string
  triggerTime: string
  result: string
  succeeded: boolean
}

interface Props {
  match: any
}
interface State {
  next: boolean
  data: HistoryItem[]
  currentPage: number
  pages: number
  currentHistory: HistoryItem
}

class Histories extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      currentPage: 1,
      pages: 1,
      next: false,
      data: [],
      currentHistory: {
        uuid: '',
        result: '',
        routerId: '',
        triggerTime: '',
        succeeded: false
      }
    }
  }

  componentDidMount(): void {
    this.getHistories(this.props.match.params.page)
  }

  componentWillReceiveProps(
      nextProps: Readonly<Props>, nextContext: any): void {
    this.setState({
      currentPage: parseInt(nextProps.match.params.page)
    })
    this.getHistories(nextProps.match.params.page)
  }

  getHistories = (page: number) => {
    http.get(`/api/histories?page=${page}`)
    .then(res => {
      if (res)
        this.setState({
          next: res.data.data.next,
          data: res.data.data.items,
          pages: res.data.data.pages
        })
    })
  }

  handleViewHistory = (history: HistoryItem) => {
    this.setState({
      currentHistory: history
    })
  }

  renderTable = () => {
    return this.state.data.length === 0 ? <span>There are no histories yet...</span> :
        <div className="overflow-x-auto">
          <table className="table table-bordered table-striped table-hover text-nowrap">
            <thead>
            <tr>
              <th>Hook</th>
              <th>Trigger Time</th>
              <th>Result</th>
              <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {
              this.state.data.map((item, index) =>
                  <tr key={index}>
                    <td><code>/hooks/{item.routerId}</code></td>
                    <td>{getFormattedTime(item.triggerTime)}</td>
                    <td>
                      <button className="btn btn-primary btn-sm"
                              data-toggle="modal"
                              data-target="#view_result"
                              onClick={() => {this.handleViewHistory(item)}}>
                        <i className="fa fa-eye"></i> View
                      </button>
                    </td>
                    <td>
                      {
                        item.succeeded ?
                            <span className="badge badge-pill badge-success">
                            <i className="fa fa-smile"></i> Succeded
                          </span> :
                            <span className="badge badge-pill badge-danger">
                            <i className="fa fa-frown"></i> Failed
                          </span>
                      }
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
          {this.renderTable()}
          <div className="my-3">
            {
              this.state.data.length === 0 ? null :
                  <div className="panel-footer">
                    <Pagination current={this.state.currentPage} total={this.state.pages} route="/dashboard/histories" />
                  </div>
            }
          </div>
          <div className="modal fade" id="view_result" role="dialog"
               aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-ellipsis">
                    <i className="fa fa-eye"></i> View Result of {this.state.currentHistory.uuid}
                  </h5>
                  <button type="button" className="close" data-dismiss="modal"
                          aria-label="Close">
                    <span aria-hidden="true" className="text-white">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <pre>
                    <code>
                      {this.state.currentHistory.result}
                    </code>
                  </pre>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-sm btn-primary" data-dismiss="modal">
                    <i className="fa fa-check"></i> OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default Histories
