import React from 'react'
import { Component } from 'react'
import ReactDOM from 'react-dom'
import { WatchableStore } from 'watchable-stores'
import { IToastsStore } from './ToastsStore'

export enum ToastsContainerPosition {
  BOTTOM_CENTER = 'bottom_center',
  BOTTOM_LEFT = 'bottom_left',
  BOTTOM_RIGHT = 'bottom_right',
  TOP_CENTER = 'top_center',
  TOP_LEFT = 'top_left',
  TOP_RIGHT = 'top_right',
}

export interface IToastsContainerProps {
  position: ToastsContainerPosition
  store: WatchableStore<IToastsStore>
  lightBackground?: boolean
  className?: string | string[]
}

export interface IToastsContainerState {
  styles: any
  toasts: any[]
}

export class ToastsContainer extends Component<IToastsContainerProps, IToastsContainerState> {
  private storeSubscriptionId: number
  private timeoutArray: any[]

  constructor(props: IToastsContainerProps) {
    super(props)

    this.state = {
      styles: {},
      toasts: [],
    }

    this.storeSubscriptionId = -1
    this.timeoutArray = []
  }

  public componentDidMount() {
    this.storeSubscriptionId = this.props.store.watch((data) => {
      const toast = { ...data, id: Math.random() }
      this.setState({ toasts: [toast].concat(this.state.toasts) })
      const timeout = setTimeout(() => {
        this.setState({ toasts: this.state.toasts.filter((t) => t.id !== toast.id) })
      }, data.timer || 3000)
      this.timeoutArray.push(timeout)
    })

    const styles: any = {}
    switch (this.props.position) {
      case ToastsContainerPosition.TOP_LEFT:
        styles.top = 10
        styles.left = 10
        break
      case ToastsContainerPosition.TOP_RIGHT:
        styles.top = 10
        styles.right = 10
        break
      case ToastsContainerPosition.TOP_CENTER:
        styles.top = 10
        styles.left = '50%'
        styles.transform = 'translateX(-50%)'
        break
      case ToastsContainerPosition.BOTTOM_LEFT:
        styles.bottom = 10
        styles.left = 10
        break
      case ToastsContainerPosition.BOTTOM_RIGHT:
        styles.bottom = 10
        styles.right = 10
        break
      case ToastsContainerPosition.BOTTOM_CENTER:
        styles.bottom = 10
        styles.left = '50%'
        styles.transform = 'translateX(-50%)'
        break
      default:
        styles.bottom = 10
        styles.right = 10
        break
    }
    this.setState({ styles })
  }

  public componentWillUnmount() {
    this.props.store.unwatch(this.storeSubscriptionId)
    this.timeoutArray.forEach(clearTimeout)
  }

  public render() {
    return ReactDOM.createPortal(
      this._renderContainer(),
      document.body,
    )
  }

  private _renderContainer() {
    return (
      <div style={this.state.styles}
           className={'toasts-container ' + (this.props.className || '')}>
        {
          this.state.toasts.map((toast) => {
            return (
                <div className={`alert alert-${toast.status} notification`} role="alert">
                  {toast.message}
                </div>
            )
          })
        }
      </div>
    )
  }
}
