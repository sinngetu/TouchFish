import { Suspense } from 'react'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import createHashHistory from 'history/createHashHistory'
import { FloatButton, Layout } from 'antd'

import routes from './routes'
import Loading from './Loading'
import { backTop } from '@/utils/function'
import './index.less'

const history = createHashHistory()
const { Header, Content } = Layout
const { BackTop } = FloatButton

export default () => (
  <Layout>
    <Header style={{ display: 'flex', alignItems: 'center' }}>
      <h1 style={{ color: '#fff' }}>摸鱼平台</h1>
    </Header>

    <Content id="content">
      <Router history={history}>
        {/* @ts-expect-error Server Component */}
        <Suspense fallback={<Loading />}>
          <Switch>
            {routes.map((item) => (
              <Route
                exact
                key={item.key}
                path={item.path}
                component={item.component}
              />
            ))}

            <Route
              path="/"
              render={() => <Redirect to="/home" />}
            />

            {/* <Route
              key={'404'}
              path={'*'}
              component={PageNotFound}
            /> */}
          </Switch>
        </Suspense>
      </Router>

      <BackTop
        visibilityHeight={0}
        type='primary'
        onClick={() => backTop(document.getElementById('content') as HTMLElement)}
      />
    </Content>
  </Layout>
)
