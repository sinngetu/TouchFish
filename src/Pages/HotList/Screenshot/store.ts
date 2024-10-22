import { makeAutoObservable, runInAction } from 'mobx'
import dayjs from 'dayjs'
import { message } from 'antd'

import api from '@/api/hotlist'

import { head, icon, letterWidth } from './resources'
import type { RawItem } from './interface'

export default class ScreenshotStore {
    constructor() { makeAutoObservable(this) }
    
    loading: boolean = false
    show: boolean = false
    focus: string = ''
    canvas!: HTMLCanvasElement // if the 'canvas' is null, cache the 'focus', and recall 'onDraw' when the 'canvas' has been correct setup

    setCanvas = (canvas: HTMLCanvasElement) => {
        this.canvas = canvas
        this.onShow(this.focus)
    }

    onShow = (focus: string) => {
        this.show = true
        this.loading = true
        this.focus = focus

        if(!this.canvas) return

        api.getWeiboRawList()
            .then((data: RawItem[]) => this.onDraw(focus, data))
            .finally(() => runInAction(() => this.loading = false))
    }

    onCancel = () => this.show = false
    onDraw = (focus: string, data: RawItem[]) => {
        const time = dayjs().format('HH:mm')
        const ctx = this.canvas.getContext('2d')

        if (!ctx) return message.error('获取画布失败!')

        const { width, height } = this.canvas
        const focusIndex = data.findIndex(item => item.word === focus)

        // clear canvas
        ctx.fillStyle = '#FFF'
        ctx.fillRect(0, 0, width, height)

        if (focusIndex === -1)
            return message.error('该热搜已不在热榜中，请仔细检查！')

        const headHeight = 212
        const drawOffset = 56
        const spacingY = 94

        const baseIndex = 2 + Math.floor(Math.random() * 8)
        let start = focusIndex - baseIndex
        let end = (13 - baseIndex) + focusIndex
        let offsetY = Math.random() * spacingY        

        // boundary handle
        if (start < 0) {
            start = 0
            end = 12
            offsetY = 0
        }

        if (end >= data.length) {
            start = data.length - 12
            end = data.length
            offsetY = 0
        }

        const list = data.slice(start, end)
        const baseY = headHeight + drawOffset - offsetY

        // draw hotlist
        list.forEach(({ rank, word, num, icon_desc }, index) => {
            const prev = data[index - 1]
            const isNotRank = index === 0 ? false : (prev.rank === rank)
            const Y = baseY + spacingY * index
            
            // draw rank number
            if (isNotRank) {
                ctx.arc(50, Y - 10, 5, 0, 2 * Math.PI, false)
                ctx.fillStyle = '#FF8200'
                ctx.fill()
            } else {
                const isTop = rank < 3

                ctx.font = `oblique ${(isTop ? 'bold ' : '')}30px -apple-system`
                ctx.fillStyle = isTop ? '#F16D5F' : '#FF8200'
                ctx.fillText((rank + 1).toString(), 39, Y)
            }

            // draw word
            const letterSpacing = 1
            const wordWidth = this.getWordWidth(word, letterSpacing)
            let wordStr = word

            // cut the word when it too long
            if (icon_desc && icon[icon_desc])
                wordStr = this.cutExcessWord(wordStr, letterSpacing, 465)
            else
                wordStr = this.cutExcessWord(wordStr, letterSpacing, 495)

            ctx.font = '30px -apple-system'
            ctx.fillStyle = '#111'
            ;(ctx as any).letterSpacing = `${letterSpacing}px`
            ctx.fillText(word, 100, Y)

            // draw num
            if (!isNotRank) {
                // (num of char) * (fontSize + letterSpacing) + leftPadding + spacing
                const left = wordWidth + 100 + 10
                let numStr = num.toString()

                // cut the number when it too long
                if (icon_desc && icon[icon_desc]) {
                    if (wordWidth > 525) numStr = '...'
                    else if (wordWidth > 495) numStr = numStr.substring(0, 3) + '...'
                } else {
                    if (wordWidth > 585) numStr = '...'
                    else if (wordWidth > 555) numStr = numStr.substring(0, 3) + '...'
                }

                ctx.font = '24px -apple-system'
                ctx.fillStyle = '#999'
                ;(ctx as any).letterSpacing = '0px'
                ctx.fillText(numStr, left, Y)
            }

            // draw icon
            if (icon_desc && icon[icon_desc]) {
                const iconX = icon_desc.length === 1 ? 692 : 682
                const iconY = Y - 27
                const i = icon[icon_desc](() => ctx.drawImage(i, iconX, iconY))
            }

            // draw divider
            ctx.fillStyle = '#F2F2F2'
            ctx.fillRect(0, Y + 37, width, 1)

            // draw read line
            if (focus === word) {
                const red = ['#F00', '#F00', '#F54137', '#CD554B', '#FFE6E6']
                const lineX = 80 + Math.random() * 35
                const lineY = Y + 10 + Math.random() * 27
                const len = word.length * 32 + Math.random() * 60

                for(let i = 0; i <= red.length; i++) {
                    ctx.fillStyle = red[i]
                    ctx.fillRect(lineX, lineY - i, len, 1)
                    ctx.fillRect(lineX, lineY + i + 1, len, 1)

                    for(let extra = 0; extra < red.length - 2 - i; extra++) {
                        ctx.fillStyle = red[i + extra]
                        ctx.fillRect(lineX - extra - 1, lineY - i, 1, 1)
                        ctx.fillRect(lineX - extra - 1, lineY + i + 1, 1, 1)
                        ctx.fillRect(lineX + len + extra, lineY - i, 1, 1)
                        ctx.fillRect(lineX + len + extra, lineY + i + 1, 1, 1)
                    }
                }
            }
        })

        // draw head
        ctx.drawImage(head, 0, 0)

        // draw time
        ctx.font = 'bold 24px -apple-system'
        ctx.fillStyle = '#111'
        ctx.fillText(time, 342, 30)
    }

    getWordWidth = (word: string, spacing: number) => {
        let width = 0

        for(let i = 0; i < word.length; i++) {
            width += letterWidth[word[i]] + spacing
        }

        return width
    }

    cutExcessWord = (word: string, spacing: number, threshold: number) => {
        let width = 0
        let result = ''

        for(let i = 0; i < word.length; i++) {
            width += letterWidth[word[i]] + spacing

            if (width < threshold)
                result += word[i]
            else {
                result += '…'
                break
            }
        }

        return result
    }
}
