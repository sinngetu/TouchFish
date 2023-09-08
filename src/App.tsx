import React, { useEffect, useState } from 'react'
import { Provider, observer } from 'mobx-react'
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

  useEffect(() => {
    Promise.all([
      store.getMedia(),
      store.getPlatform(),
    ]).finally(store.onReady)
  }, [])

  return store.ready ? (
    // <React.StrictMode>
      <ConfigProvider locale={LANG[localStorage.getItem('language')!]}>
        <Provider appStore={store}>
          <Pages />
        </Provider>
      </ConfigProvider>
    // </React.StrictMode>
  ) : null
}

export default observer(App)
