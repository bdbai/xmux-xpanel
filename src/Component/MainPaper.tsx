import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import Divider from '@material-ui/core/Divider'

interface IProps {
  loading: boolean,
  title: string,
  children?: React.ReactNode,
  onAdd?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const decorate = withStyles(theme => ({
  addBtn: {
    position: 'fixed' as 'fixed',
    bottom: 4 * theme.spacing.unit,
    right: 4 * theme.spacing.unit
  }
}))

class MainPaper extends React.PureComponent<
  IProps & WithStyles<'addBtn'>
> {
  public render () {
    const { loading, title, children, onAdd, classes: {
      addBtn
    } } = this.props
    return <div>
      <Typography className="title" variant="display3">
        {title}
      </Typography>
      <Divider />
      <Paper className="main-paper">
        {children}
        {loading &&
          <div className="progress-container">
            <CircularProgress />
          </div>
        }
        {onAdd &&
          <Button onClick={onAdd} variant="fab" className={addBtn} color="secondary">
            <AddIcon aria-label="add" />
          </Button>
        }
      </Paper>
    </div>
  }
}

export default decorate(MainPaper) as React.ComponentClass<IProps>
