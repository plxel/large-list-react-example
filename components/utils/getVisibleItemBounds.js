const getElementTop = (element) => {
  if (element.pageYOffset) return element.pageYOffset

  if (element.document) {
    if (element.document.documentElement && element.document.documentElement.scrollTop) return element.document.documentElement.scrollTop
    if (element.document.body && element.document.body.scrollTop) return element.document.body.scrollTop

    return 0
  }

  return element.scrollY ||  element.scrollTop || 0
};

const topFromWindow = (element) => {
  if (typeof element === 'undefined' || !element) return 0

  return (element.offsetTop || 0) + topFromWindow(element.offsetParent)
};


const getVisibleItemBounds = (list, container, items, itemHeight) => {
  if (!container || !itemHeight || !items || items.length === 0) return undefined

  // what the user can see
  const { innerHeight, clientHeight } = container

  const viewHeight = innerHeight || clientHeight // how many pixels are visible

  if (!viewHeight) return undefined

  const viewTop = getElementTop(container) // top y-coordinate of viewport inside container
  const viewBottom = viewTop + viewHeight

  const listTop = topFromWindow(list) - topFromWindow(container) // top y-coordinate of container inside window
  const listHeight = itemHeight * items.length

  // visible list inside view
  const listViewTop =  Math.max(0, viewTop - listTop) // top y-coordinate of list that is visible inside view
  const listViewBottom = Math.max(0, Math.min(listHeight, viewBottom - listTop)) // bottom y-coordinate of list that is visible inside view

  const itemBuffer = 5
  // visible item indexes
  const firstItemIndex = Math.max(0,  Math.floor(listViewTop / itemHeight) - itemBuffer)
  const lastItemIndex = Math.min(items.length, Math.ceil(listViewBottom / itemHeight) + itemBuffer)

  return {
    firstItemIndex,
    lastItemIndex,
  };
};

export default getVisibleItemBounds
