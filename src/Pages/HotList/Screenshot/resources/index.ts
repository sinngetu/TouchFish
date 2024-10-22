import headSrc from './head.png'

import 商 from './商.png'
import 新 from './新.png'
import 暖 from './暖.png'
import 沸 from './沸.png'
import 热 from './热.png'
import 大促 from './大促.png'
import 大卖 from './大卖.png'
import 好物 from './好物.png'
import 官宣 from './官宣.png'
import 辟谣 from './辟谣.png'
import 首发 from './首发.png'

export { default as letterWidth } from './letterWidth'

const srcs = { 商, 新, 暖, 沸, 热, 大促, 大卖, 好物, 官宣, 辟谣, 首发 } as { [key: string]: string }
const getImage = (src: string) => (onload?: () => void) => {
    const img = new Image()

    img.src = src
    img.onload = onload || null
    return img
}

export const icon = Object
    .keys(srcs)
    .reduce((result, key) => {
        const src = srcs[key]
        result[key] = getImage(src)
        return result
    }, {} as {[key: string]: (onload?: () => void) => HTMLImageElement})

export const head = new Image()
head.src = headSrc