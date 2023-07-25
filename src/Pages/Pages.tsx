import { Suspense } from 'react'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import createHashHistory from 'history/createHashHistory'

import routes from './routes'
import Loading from './Loading'
import './index.less'

const history = createHashHistory()

export default () => (
  <div className="pages">
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
  </div>
)
