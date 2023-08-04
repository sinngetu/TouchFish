export function backTop(el: HTMLElement) {
    let start = 0, previousTimeStamp = -1
    let done = false
    const length = el.scrollTop
    const times = 200

    function step(timestamp: DOMHighResTimeStamp) {
        if (start === 0) start = timestamp

        const elapsed = timestamp - start

        if (previousTimeStamp !== timestamp) {
            el.scrollTop = length * (1 - (elapsed / times))

            if (el.scrollTop <= 0) done = true
        }

        if (elapsed < times) {
            previousTimeStamp = timestamp

            if (!done) window.requestAnimationFrame(step)
        }
    }

    if (el.scrollTop === 0) return
    window.requestAnimationFrame(step)
}
