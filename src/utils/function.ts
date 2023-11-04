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

export function HSL2RGB(hsl: number[]) {
    const h = hsl[0] / 360
    const s = hsl[1] / 100
    const l = hsl[2] / 100

    let t2, t3, val
    if (s === 0) {
        val = l * 255
        return [val, val, val]
    }

    if (l < 0.5) t2 = l * (1 + s)
    else t2 = l + s - l * s

    const t1 = 2 * l - t2
    const rgb = [0, 0, 0]

    for (let i = 0; i < 3; i++) {
        t3 = h + (1 / 3) * -(i - 1)
        if (t3 < 0) t3++
        if (t3 > 1) t3--
        if (6 * t3 < 1) val = t1 + (t2 - t1) * 6 * t3
        else if (2 * t3 < 1) val = t2
        else if (3 * t3 < 2) val = t1 + (t2 - t1) * (2 / 3 - t3) * 6
        else val = t1

        rgb[i] = val * 255
    }

    return rgb
}

export function RGB2HSL(rgb: number[]) {
    const r = rgb[0] / 255
    const g = rgb[1] / 255
    const b = rgb[2] / 255

    const min = Math.min(r, g, b)
    const max = Math.max(r, g, b)
    const delta = max - min

    let h, s
    if (max === min) h = 0
    else if (r === max) h = (g - b) / delta
    else if (g === max) h = 2 + (b - r) / delta
    else if (b === max) h = 4 + (r - g) / delta
    else h = 0

    h = Math.min(h * 60, 360)
    if (h < 0) h += 360

    const l = (min + max) / 2

    if (max === min) s = 0
    else if (l <= 0.5) s = delta / (max + min)
    else s = delta / (2 - max - min)

    return [h, s * 100, l * 100]
}

export function cutDecimal(value: number, len: number) { return Number(value.toFixed(len)) }