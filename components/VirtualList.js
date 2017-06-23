import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import getVisibleItemBounds from './utils/getVisibleItemBounds'
import throttleWithRAF from './utils/throttleWithRAF'
import mapVirtualToProps from './utils/mapVirtualToProps'

const VirtualList = (options) => (InnerComponent) => {
  return class VList extends PureComponent {
    static propTypes = {
      items: PropTypes.array.isRequired,
      itemHeight: PropTypes.number.isRequired,
    };

    constructor(props) {
      super(props)

      this.options = {
        container: typeof window !== 'undefined' ? window : undefined,
        ...options,
      }

      this.state = {
        firstItemIndex: 0,
        lastItemIndex: -1,
      }

      this.refreshState = this.refreshState.bind(this)

      // if requestAnimationFrame is available, use it to throttle refreshState
      if (typeof window !== 'undefined' && window && 'requestAnimationFrame' in window) {
        this.refreshState = throttleWithRAF(this.refreshState)
      }
    };

    setStateIfNeeded(list, container, items, itemHeight) {
      // get first and lastItemIndex
      const state = getVisibleItemBounds(list, container, items, itemHeight)

      if (state !== undefined && (state.firstItemIndex !== this.state.firstItemIndex || state.lastItemIndex !== this.state.lastItemIndex)) {
        this.setState(state)
      }
    }

    refreshState() {
      const { itemHeight, items } = this.props

      this.setStateIfNeeded(this.domNode, this.options.container, items, itemHeight)
    };

    componentDidMount() {
      // cache the DOM node
      this.domNode = ReactDOM.findDOMNode(this)

      this.refreshState()
      this.options.container.addEventListener('scroll', this.refreshState)
      this.options.container.addEventListener('resize', this.refreshState)
    };

    componentWillUnmount() {
      this.options.container.removeEventListener('scroll', this.refreshState)
      this.options.container.removeEventListener('resize', this.refreshState)
    };

    // if props changed, just assume we have to recalculate
    componentWillReceiveProps(nextProps) {
      const { itemHeight, items } = nextProps

      this.setStateIfNeeded(this.domNode, this.options.container, items, itemHeight)
    };

    render() {
      return (<InnerComponent {...this.props} {...mapVirtualToProps(this.props, this.state)} />)
    };
  };
};

export default VirtualList
