import OverseasStore from '../store'

export interface Ref {
    onShow: () => void
}

export interface Props {
    overseasStore?: OverseasStore
}