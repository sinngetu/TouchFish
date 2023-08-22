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

export function debounce(func: Function, delay: number) {
    let trigger: NodeJS.Timeout

    return (...args: any[]) => {
        clearTimeout(trigger)
        trigger = setTimeout(() => func(...args), delay)
    }
}

export function copy(text: string) {
    const textarea = document.createElement('textarea')
    textarea.readOnly = true
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    textarea.value = text

    document.body.appendChild(textarea)
    textarea.select()

    const result =  (document.execCommand('Copy'))
    document.body.removeChild(textarea)

    return result
}
