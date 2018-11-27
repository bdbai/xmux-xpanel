import Paper from '@material-ui/core/Paper'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import { authAsync, app } from '../Api/Auth'
import { Redirect, RouteComponentProps } from 'react-router-dom'

const decorate = withStyles({
  root: {
    display: 'flex',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  panel: {
    flex: 1,
    maxWidth: '15em',
    padding: '2em'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  }
})

interface ILoginState {
  id: string,
  pass: string,
  url: string,
  logginginState: 'normal' | 'loggingin' | 'success' | 'error',
  error?: string
}
const defaultUrl =
  process.env.NODE_ENV === 'production'
    ? 'SERVER_URL'
    : 'http://localhost:8000'
const Login = decorate<{}>(
  class extends React.PureComponent<
    WithStyles<'root' | 'panel' | 'form'>
    & RouteComponentProps<{}>
  > {
    public state: ILoginState = {
      id: '',
      pass: '',
      url: defaultUrl,
      logginginState: app.auth().currentUser === null ? 'normal' : 'success'
    }
    private unmounted = false
    private onFieldChange = (name: keyof ILoginState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        [name]: e.target.value
      })
    }
    private onIdChange = this.onFieldChange('id')
    private onPassChange = this.onFieldChange('pass')
    private onUrlChange = this.onFieldChange('url')
    private onButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const { id, pass, url } = this.state
      this.setState({ logginginState: 'loggingin' })
      try {
        await authAsync(id.toLowerCase(), pass, url)
      } catch (ex) {
        this.setState({
          logginginState: 'error',
          error: ex.message
        })
      }
    }
    public componentWillUnmount () {
      this.unmounted = true
    }
    public componentDidMount () {
      window.document.title = 'Login - X Panel'
      // tslint:disable-next-line:no-console
      console.debug(app.auth())
      app.auth().onAuthStateChanged(e => {
        if (!this.unmounted && e !== null) {
          this.setState({ logginginState: 'success' })
        }
      })
    }
    public render () {
      const { root, panel, form } = this.props.classes
      const { logginginState, error } = this.state
      const { oldLocation } = this.props.location.state || {oldLocation: '/'}
      if (logginginState === 'success' || app.auth().currentUser !== null) {
        return <Redirect to={oldLocation || '/'} />
      }
      return <div className={root}>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={logginginState === 'error'}
          ContentProps={{
            'aria-describedby': 'login-error-id',
          }}
          message={<span id="login-error-id">{error}</span>}
        />
        <Paper className={panel}>
          <Typography variant="headline" component="h2">
            Log in to X Panel
          </Typography>
          <Divider />
          <form className={form}>
            <TextField
              fullWidth={true}
              label="Campus ID"
              onChange={this.onIdChange}
              margin="normal"
              disabled={logginginState === 'loggingin'}
            />
            <TextField
              fullWidth={true}
              label="Password"
              onChange={this.onPassChange}
              type="password"
              margin="normal"
              disabled={logginginState === 'loggingin'}
            />
            <TextField
              fullWidth={true}
              label="Auth server url"
              onChange={this.onUrlChange}
              defaultValue={defaultUrl}
              margin="normal"
              disabled={logginginState === 'loggingin'}
            />
            <Button
              variant="raised"
              color="primary"
              onClick={this.onButtonClick}
              disabled={logginginState === 'loggingin'}
            >
              Log in
            </Button>
          </form>
        </Paper>
      </div>
    }
  })

export default Login
