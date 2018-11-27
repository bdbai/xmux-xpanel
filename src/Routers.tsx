import { BrowserRouter, Switch, Route } from "react-router-dom"
import * as React from 'react'
import AppBar from './Component/AppBar'
import Home from './Page/Home'
import Login from './Page/Login'
import Permission from './Page/Permission'
import Calendar from './Page/Calendar'
import PublicTalk from './Page/PublicTalk'
import Import from './Page/Import'
import AnnouncementContainer from './Container/AnnouncementContainer'
import AnnouncementItemContainer from './Container/AnnouncementItemContainer'
import NewsContainer from './Container/NewsContainer'
import NewsItemContainer from './Container/NewsItemContainer'
import ErrorDisplay from "./Component/ErrorDisplay"

class Routers extends React.PureComponent {
  public render () {
    return <BrowserRouter>
      <Switch>
        <Route exact={true} path="/login" component={Login} />
        <Route>
          <>
            <ErrorDisplay />
            <div className="frame-container">
              <Route exact={false} component={AppBar} />
              <Switch>
                <Route exact={true} path="/" component={Home} />
                <Route exact={true} path="/announcement" component={AnnouncementContainer} />
                <Route exact={true} path="/news" component={NewsContainer} />
                <Route exact={true} path="/announcement/:id" component={AnnouncementItemContainer} />
                <Route exact={true} path="/news/:id" component={NewsItemContainer} />
                <Route exact={true} path="/permission" component={Permission} />
                <Route exact={true} path="/calendar" component={Calendar} />
                <Route exact={true} path="/publictalk" component={PublicTalk} />
                <Route exact={true} path="/import" component={Import} />
              </Switch>
            </div>
          </>
        </Route>
      </Switch>
    </BrowserRouter >
  }
}

export default Routers
