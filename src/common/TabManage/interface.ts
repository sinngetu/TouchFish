export interface Ref {
    onShow: () => void
}

export interface Props {
    tabs: { label: string, key: string }[]
    initShow: string[]
    onChange: (keys: string[]) => void
}