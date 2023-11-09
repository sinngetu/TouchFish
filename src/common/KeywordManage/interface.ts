import AppStore from "@/store"

export interface Ref {
    onShow: () => void
}

export interface Props {
    appStore?: AppStore
    keywordIndex: number
    addAPI: (content: string) => Promise<{ id: number }>
    delAPI: (id: number) => Promise<{ success: boolean }>
}