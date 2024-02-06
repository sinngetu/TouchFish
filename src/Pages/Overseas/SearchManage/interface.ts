import AppStore from "@/store"

export interface Ref {
    onShow: () => void
}

export interface Props {
    appStore?: AppStore
}

export interface Field {
    keyword: string
    url: string
}

export interface EditCellProps extends React.HTMLAttributes<HTMLElement> {
    edit: boolean
    dataIndex: string
    title: any
    children: React.ReactNode
}