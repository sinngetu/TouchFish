/// <reference types="react-scripts" />
export interface SubMenuData {
  key: string
  title: string
  to: string
}

export interface MenuData {
  key: string
  icon: string
  title: string
  to?: string
  children?: SubMenuData[]
}

declare global {
  interface Window {
    setMenu: (data: MenuData[] | undefined, title?: string) => void
    setLoginStatus: (isLogin: Boolean) => void
    dynamicLink: {
      mount: (
        id: string,
        domain: string,
        env: 'production' | 'development' | 'test',
        filename?: string
      ) => () => Promise<void>
      unmount: (id: string) => () => Promise<void>
    }

    // 是否登录的 Promise，登录完成后变为 resolve 状态
    login: Promise<unknown>

    IAM: (
      tokenName: string, // 应用的token名称
      domain: string, // 后端接口域名
      validateHandle: (data: any) => string, // any => string，validate接口处理函数，输入值为接口调用的返回值，返回值为''代表已登录，否则应为将要跳转的url
      viewHandle: (data: any) => string, // any => string，token获取接口处理函数，输入值为接口调用的返回值，返回值为token字符
      validateUri?: string, // 登录校验接口uri
      viewUri?: string, // token获取接口uri
      tokenHeader?: string, // 携带token的请求头
      tokenHandle?: (token: string) => string // token处理函数
    ) => void
  }
}



