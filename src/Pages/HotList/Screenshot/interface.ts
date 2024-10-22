export interface Ref {
    onShow: (focus: string) => void
}

export interface RawItem {
    rank: number
    num: number
    word: string
    icon_desc?: string
}