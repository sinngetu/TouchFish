import AppStore from "@/store"

export interface Ref {
    onShow: () => void
}

export interface Props {
    appStore?: AppStore
}