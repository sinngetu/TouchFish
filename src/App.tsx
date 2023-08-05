import React, { useState } from 'react'
import { Provider } from 'mobx-react'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN'
import en_US from 'antd/es/locale/en_US'
import { Locale } from 'antd/es/locale'

import Pages from './Pages'
import AppStore from './store'

const LANG: { [props: string]: Locale } = {
  zh_CN,
  en_US,
}

function App() {
  const [store] = useState(new AppStore())

  return (
    <React.StrictMode>
      <ConfigProvider locale={LANG[localStorage.getItem('language')!]}>
        <Provider appStore={store}>
          <Pages />
        </Provider>
      </ConfigProvider>
    </React.StrictMode>
  )
}

export default App
