import * as React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import AcStudentDataImport from '../Api/AcDataImport/AcStudentDataImport'
import AcDataImport from '../Api/AcDataImport/AcDataImport'

type ICreateTask = (name: string, params: any) => void

interface IState {
  dialogOpen: boolean,
  snackbarOpen: boolean,
  status: 'pending' | 'running' | 'error' | 'success',
  error: string,
  successCount: number,
  errorCount: number,
  progress: number,
  errorItems: Array<{ data: string, error: string }>
}

export let createTask:ICreateTask = () => undefined

const initialState: IState = {
  dialogOpen: false,
  snackbarOpen: true,
  status: 'pending',
  error: '',
  successCount: 0,
  errorCount: 0,
  progress: 0,
  errorItems: []
}

export class TaskManagerUI extends React.PureComponent<{}, IState> {
  constructor (props: any, context: any) {
    super(props, context)

    createTask = this.createTask
  }
  private worker?: AcDataImport = undefined
  private createTask = (name: string, params: any) => {
    if (this.worker !== undefined) {
      return
    }
    switch (name) {
      case 'student':
        const { file } = params
        this.worker = new AcStudentDataImport(
          file,
          {
            onData: o => o,
            onComplete: () => {
              this.setState({ status: 'success' })
              this.worker = undefined
            },
            onError: error => {
              this.setState({ status: 'error', error })
              this.worker = undefined
            },
            onItemError: (e, o) => this.setState(p => ({
              errorCount: p.errorCount + 1,
              errorItems: p.errorCount < 50 ? [...p.errorItems, {
                error: e,
                data: JSON.stringify(o)}] : p.errorItems
            })),
            onItemOk: () => this.setState(p => ({ successCount: p.successCount + 1 })),
            onFileError: error => {
              this.setState({ status: 'error', error: error.message })
              this.worker = undefined
            },
            onProgress: p => this.setState({ progress: p })
          }
        ).start()
        break
    }
    this.setState({
      ...initialState,
      status: 'running',
      dialogOpen: true
    })
  }
  public state = {
    ...initialState
  }
  private snackbarClick = (e: React.MouseEvent) => {
    e.preventDefault()
    this.setState(prev => ({
      dialogOpen: !prev.dialogOpen
    }))
  }
  private dialogClose = () => {
    this.setState({
      dialogOpen: false
    })
  }
  public render () {
    const {
      dialogOpen,
      snackbarOpen,
      status,
      error,
      successCount,
      errorCount,
      progress,
      errorItems
    } = this.state
    return <span>
      <Dialog
        fullScreen={true}
        open={dialogOpen}
        onClose={this.dialogClose}
      >
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" onClick={this.dialogClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="title" color="inherit">
              Task Progress
            </Typography>
          </Toolbar>
        </AppBar>
        <LinearProgress
          value={progress}
          color="secondary"
          variant="determinate"
        />
        <Paper className="main-paper">
          <Typography variant="display3" className="title">
            Status
          </Typography>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>{status}</TableCell>
              </TableRow>
              {status === 'error' && <TableRow>
                <TableCell>Error message</TableCell>
                <TableCell>{error}</TableCell>
              </TableRow>}
              <TableRow>
                <TableCell>Succeeded items</TableCell>
                <TableCell>{successCount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Error items</TableCell>
                <TableCell>{errorCount}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Typography variant="display3" className="title">
            Errors
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Error</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {errorItems.map((o, i) => <TableRow key={i}>
                <TableCell>{o.data}</TableCell>
                <TableCell>{o.error}</TableCell>
              </TableRow>)}
            </TableBody>
          </Table>
        </Paper>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={
          <span>
          {status === 'pending' && 'No task is running.'}
          {status === 'running' && 'A task is running.'}
          {status === 'success' && 'Task done.'}
          {status === 'error' && 'Fatal error.'}</span>
        }
        onClick={this.snackbarClick}
      />
    </span>
  }
}
