import { Suspense } from 'react'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import createHashHistory from 'history/createHashHistory'
import { Layout } from 'antd'

import routes from './routes'
import Loading from './Loading'
import './index.less'

const history = createHashHistory()
const { Header, Content } = Layout

export default () => (
  <Layout>
    <Header style={{ display: 'flex', alignItems: 'center' }}>

    </Header>

    <Content className="content">
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
    </Content>
  </Layout>
)
