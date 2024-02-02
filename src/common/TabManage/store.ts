import { makeAutoObservable } from 'mobx'
import type { TransferProps } from 'antd'

import { Props } from './interface'

type DataSource = { key: string, title: string }[]

export default class TabManageStore {
    constructor(props: Props) {
        makeAutoObservable(this)
        this.dataSource = props.tabs.map(tab => ({ key: tab.key, title: tab.label }))
        this.targetKeys = [...props.initShow]
        this.onChange = next => this.targetKeys = next
        this.onOk = () => {
            props.onChange(this.targetKeys)
            this.onCancel()
        }
    }

    show: boolean = false
    dataSource: DataSource
    targetKeys: string[]

    onShow = () => this.show = true
    onCancel = () => this.show = false
    onChange: TransferProps<DataSource>['onChange']
    onOk: () => void
}
