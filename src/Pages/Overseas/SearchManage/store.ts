import { computed, makeAutoObservable, runInAction } from 'mobx'
import { message } from 'antd'
import type { FormInstance } from 'antd'

import AppStore, { Keyword } from '@/store'
import api from '@/api/news'

export default class SearchManageStore {
    constructor(appStore: AppStore, addForm: FormInstance, editForm: FormInstance) {
        makeAutoObservable(this)

        this.addForm = addForm
        this.editForm = editForm
        appStore.getKeyword().then(keyword => runInAction(() => this.keywords = keyword[3] || []))
    }

    addForm: FormInstance
    editForm: FormInstance
    keywords: Keyword[] = []
    searchWord: string = ''

    show: boolean = false
    showAdd: boolean = false
    addLoading: boolean = false
    editId: number = -1
    editLoading: boolean = false

    onShow = () => this.show = true
    onCancel = () => this.show = false
    onSearch = (searchWord: string) => this.searchWord = searchWord

    @computed get dataSource() { return this.keywords.filter(({ word }) => word.includes(this.searchWord)) }

    // Add
    onAddReset = () => this.addForm.resetFields()
    onShowAdd = () => this.showAdd = true
    onCancleAdd = () => {
        this.showAdd = false
        this.onAddReset()
    }

    onAdd = () => {
        this.addForm.validateFields().then(data => runInAction(() => {
            this.addLoading = true
            api.addSearch(data.keyword, data.url).then(({ id }) => runInAction(() => {
                const newData: Keyword = { id, word: data.keyword, extend: data.url }
                const newDataSource = [...this.dataSource]

                newDataSource.push(newData)
                this.onCancleAdd()
                this.keywords = newDataSource
                message.success({ content: '添加成功！', duration: 2 })
            })).finally(() => runInAction(() => this.addLoading = false))
        })).catch(() => {})
    }

    // Edit
    @computed get hasEdit() { return this.editId !== -1 }
    onCancelEdit = () => this.editId = -1
    isEdit = (data: Keyword) => data.id === this.editId

    onShowEdit = (data: Keyword) => {
        this.editForm.setFieldsValue(data)
        this.editId = data.id
    }

    onEdit = async (data: Keyword) => {
        this.editForm.validateFields().then(fields => runInAction(() => {
            this.editLoading = true
            api.editSearch(data.id, fields.word, fields.extend).then(({ success }) => runInAction(() => {
                if (!success) return message.error('编辑失败!')

                const newData: Keyword = { ...fields, id: data.id }
                const newDataSource = [...this.dataSource]
                const index = newDataSource.findIndex(item => item.id === data.id)

                newDataSource.splice(index, 1, newData)
                this.keywords = newDataSource
                this.onCancelEdit()
                message.success({ content: '编辑成功！', duration: 2 })
            })).finally(() => runInAction(() => this.editLoading = false))
        })).catch(() => {})
    }

    // Delete
    onDel = (data: Keyword) => {
        const key = 'search-key-del'

        message.loading({ key, content: '删除中...', duration: 0 })
        api.delSearch(data.id).then(({ success }) => runInAction(() => {
            if (!success) return message.error({ key, content: '删除失败！', duration: 2 })

            const newDataSource = [...this.dataSource]
            const index = newDataSource.findIndex(item => item.id === data.id)

            newDataSource.splice(index, 1)
            this.keywords = newDataSource
            message.success({ key, content: '删除成功！', duration: 2, })
        })).catch(() => message.error({ key, content: '删除失败！', duration: 2 }))
    }
}
