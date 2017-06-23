export default (fn) => {
  let running = false

  return () => {
    if (running) return

    running = true

    window.requestAnimationFrame(() => {
      fn.apply(null)
      running = false
    })
  }
}
