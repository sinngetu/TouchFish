import { makeAutoObservable, computed, runInAction } from 'mobx'
import { message } from 'antd'
import { Color } from 'antd/es/color-picker'

import OverseasStore from '../store'
import { RGB2HSL, HSL2RGB, cutDecimal } from '@/utils/function'
import api from '@/api/news'

export default class TagManageStore {
    constructor(overseasStore: OverseasStore) {
        makeAutoObservable(this)
        this.parentStore = overseasStore
    }

    parentStore: OverseasStore

    show: boolean = false
    newKeyword: string = ''
    addLoading: boolean = false
    content: string = ''
    checked: boolean = true
    color: number[] = [22, 119, 255]
    delID: number = -1

    @computed get tags() { return this.parentStore.tags.map(({ id, word, extend }) => ({
        id,
        content: word,
        color: JSON.parse(extend || '{}')
    })) }

    @computed get dominateColor() {
        const [r, g, b] = this.color.map(value => cutDecimal(value, 0))
        return `rgb(${r}, ${g}, ${b})`
    }

    @computed get lightColor() {
        const hsl = RGB2HSL(this.color)
        hsl[2] = 100 - hsl[1] / 100 * 5
        const [r, g, b] = HSL2RGB(hsl).map(value => cutDecimal(value, 0))
        return `rgb(${r}, ${g}, ${b})`
    }

    onShow = () => this.show = true
    onCancel = () => this.show = false
    onChangeContent = (content: string) => this.content = content
    onSwitch = (checked: boolean) => this.checked = checked
    onChangeColor = (color: Color) => {
        const {r, g, b} = color.toRgb()
        this.color = [r, g, b]
    }

    onAdd = () => {
        this.addLoading = true

        api.addTags(
            this.content,
            this.dominateColor,
            this.checked ? this.lightColor : undefined
        ).then(({ id }) => this.parentStore.addTags(({ id, word: this.content, extend: JSON.stringify({ dominate: this.dominateColor, light: this.checked ? this.lightColor : undefined }) })))
         .finally(() => runInAction(() => this.addLoading = false ))
    }

    onSetDelID = (id: number) => this.delID = id
    resetDelID = () => this.delID = -1

    onDel = (id: number) => () => api.delTags(id).then(({ success }) => runInAction(() => {
        if (!success) return message.error('删除失败!')

        this.parentStore.delTags(id)
        message.success('删除成功!')
    }))
}
