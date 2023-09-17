import { makeAutoObservable, runInAction } from 'mobx'
import { message } from 'antd'

import AppStore, { Keyword } from '@/store'

import api from '@/api/hotlist'

export default class KeywordManageStore {
    constructor(appStore: AppStore) {
        makeAutoObservable(this)

        appStore.getKeyword().then(keyword => this.keywords = keyword[0])
    }

    keywords: Keyword[] = []
    show: boolean = false
    initLoading: boolean = false
    newKeyword: string = ''
    showAdd: boolean = false
    addLoading: boolean = false
    filter: string = ''

    onShow = () => this.show = true
    onCancel = () => this.show = false
    onShowAdd = () => this.showAdd = true
    onChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => this.filter = e.target.value
    onChangeNewKeyword = (e: React.ChangeEvent<HTMLInputElement>) => this.newKeyword = e.target.value
    onAdd = () => {
        const word = this.newKeyword.trim()

        if (!word) {
            this.showAdd = false
            this.newKeyword = ''
            return
        }

        this.addLoading = true
        api.addKeyword(word).then(({ id }) => runInAction(() => {
            const newKeywords = [...this.keywords, { id, word }]

            message.success('添加成功~页面刷新后生效')
            this.showAdd = false
            this.newKeyword = ''
            this.keywords = newKeywords
        })).finally(() => runInAction(() => this.addLoading = false))
    }

    onDel = (id: number) => () => api.delKeyword(id).then(({ success }) => runInAction(() => {
        if (!success) return message.error('删除失败!')
        const newKeywords = [...this.keywords]

        newKeywords.splice(newKeywords.findIndex(item => item.id === id), 1)
        message.success('删除成功!')
        this.keywords = newKeywords
    }))
}
