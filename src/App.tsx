import React from 'react'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN'
import en_US from 'antd/es/locale/en_US'
import { Locale } from 'antd/es/locale'

import Pages from './Pages'

const LANG: { [props: string]: Locale } = {
  zh_CN,
  en_US,
}

function App() {
  return (
    <React.StrictMode>
      <ConfigProvider locale={LANG[localStorage.getItem('language')!]}>
        <Pages />
      </ConfigProvider>
    </React.StrictMode>
  )
}

export default App
