import React from 'react'

import { history } from '../../App'

interface State {}
interface Props {
  route: string
  current: number
  total: number
}

class Pagination extends React.Component<Props, State> {
  componentWillReceiveProps(
      nextProps: Readonly<Props>, nextContext: any): void {
  }

  handleHrefChange = (page: number) => {
    history.push(`${this.props.route}/${page}/`)
  }

  getPages = (): number[] => {
    let pages = []
    const current = this.props.current
    const left = current - 1
    const right = this.props.total - current
    if (left >= 2 && right >= 2)
      for (let i = current - 2; i <= current + 2; i++)
        pages.push(i)
    else if (left < 2 && right >= 2) {
      const last = this.props.total > 5 ? 5 : this.props.total
      for (let i = 1; i <= last; i++)
        pages.push(i)
    }
    else if (right < 2 && left >= 2) {
      const first = this.props.total > 5 ? this.props.total - 4 : 1
      for (let i = first; i <= this.props.total; i++)
        pages.push(i)
    } else
      for (let i = 1; i <= this.props.total; i++)
        pages.push(i)
    return pages
  }

  render() {
    return (
        <nav>
          <ul className="pagination">
            <li className={`page-item ${this.props.current === 1 ? 'disabled' : ''}`}>
              <a className="page-link"
                 onClick={() => {if (!(this.props.current === 1))
                   this.handleHrefChange(1)}}>&laquo;
              </a>
            </li>
            <li className={`page-item ${this.props.current === 1 ? 'disabled' : ''}`}>
              <a className="page-link"
                 onClick={() => {if (!(this.props.current === 1))
                   this.handleHrefChange(this.props.current - 1)}}>&lsaquo;
              </a>
            </li>
            {
              this.props.total <= 10 || this.getPages()[0] === 1 ? null :
                  <li className="page-item disabled"><a className="page-link">...</a></li>
            }
            {
              this.getPages().map((value, index) =>
                  <li className={`page-item ${this.props.current === value ? 'active' : ''}`} key={index}>
                    <a className="page-link" onClick={() => this.handleHrefChange(value)}>{value}</a>
                  </li>
              )
            }
            {
              this.props.total <= 10 || this.getPages().pop() === this.props.total
                  ? null : <li><button disabled>...</button></li>
            }
            <li className={`page-item ${this.props.current === this.props.total ? 'disabled' : ''}`}>
              <a className="page-link"
                 onClick={() => {if (!(this.props.current === this.props.total))
                   this.handleHrefChange(this.props.current + 1)}}>&rsaquo;
              </a>
            </li>
            <li className={`page-item ${this.props.current === this.props.total ? 'disabled' : ''}`}>
              <a className="page-link"
                 onClick={() => {if (!(this.props.current === this.props.total))
                   this.handleHrefChange(this.props.total)}}>&raquo;
              </a>
            </li>
          </ul>
        </nav>
    )
  }
}

export default Pagination
