import * as React from 'react'
import { connect } from 'react-redux'
import IStoreState from '../store/IStoreState'
import Snackbar from '@material-ui/core/Snackbar'
import { popError } from '../actions'
import { withStyles, WithStyles } from '@material-ui/core'

interface IMapStateToProps {
  errors: any[]
}

interface IMapDispatchToProps {
  popError: () => any
}

const decorate = withStyles({
  container: {
    position: 'fixed',
    left: 0,
    top: 80,
    // backgroundColor: 'black',
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  snackbar: {
    marginTop: 80,
    marginLeft: 64
  }
})

type IProps = IMapStateToProps & IMapDispatchToProps & WithStyles<'snackbar' | 'container'>

const ErrorDisplay = decorate<{}>(class extends React.PureComponent<IProps> {
  private onSnackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    this.props.popError()
  }

  public componentDidUpdate () {
    if (this.props.errors.length > 0) {
      setTimeout(() => {
        this.props.popError()
      }, 5000)
    }
  }

  public render () {
    const error = this.props.errors[0]
    const { snackbar } = this.props.classes
    return <Snackbar
        className={snackbar}
        open={typeof error !== 'undefined' && error !== null}
        message={<span>{error ? error.message : ''}</span>}
        onClick={this.onSnackClick}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    />
  }
})

export default connect<IMapStateToProps, IMapDispatchToProps>((state: IStoreState) => ({
  errors: state.errors
}), (dispatch: any) => ({
  popError: () => dispatch(popError())
}))(ErrorDisplay)
