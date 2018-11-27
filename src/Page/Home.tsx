import * as React from 'react'
import logo from '../logo.svg'

export default class Home extends React.PureComponent {
  public componentDidMount () {
    window.document.title = 'Home - X Panel'
  }
  public shouldComponentUpdate () {
    return false
  }
  public render () {
    return <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to X Panel</h1>
      </header>
      {/*<p className="App-intro">
        To get started, edit <code>src/App.tsx</code> and save to reload.
      </p>*/}
    </div>
  }
}
