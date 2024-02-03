import { makeAutoObservable } from 'mobx'

import AppStore, { Keyword } from '@/store'

export default class SearchManageStore {
    constructor(appStore: AppStore) {
        makeAutoObservable(this)

        appStore.getKeyword().then(keyword => this.dataSource = this.keywords = keyword[3] || [])
    }

    show: boolean = false
    keywords: Keyword[] = []
    dataSource: Keyword[] = []

    onShow = () => this.show = true
    onCancel = () => this.show = false
    onSearch = (searchWord: string) => this.dataSource = this.keywords.filter(({ word }) => word.includes(searchWord))
}
