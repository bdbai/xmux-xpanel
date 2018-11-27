import * as React from 'react'
import Routers from './Routers'
import configureStore from './store/configureStore'
import './App.css'
import { Provider as StoreProvider } from 'react-redux'

class App extends React.PureComponent {
  private store = configureStore()
  public render () {
    return (
      <StoreProvider store={this.store}>
        <Routers />
      </StoreProvider>
    )
  }
}

export default App
