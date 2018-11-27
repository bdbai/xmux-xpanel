import * as React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import DeleteIcon from '@material-ui/icons/Delete'

interface IProp {
  itemId: string,
  onDelete: (item: string) => void,
}

interface IState {
  open: boolean
  deleted: boolean
}

class DeleteButton extends React.PureComponent<IProp, IState> {
  public state = {
    open: false,
    deleted: false
  }

  private onDeletePanelClose = () => {
    this.setState({ open: false })
  }

  private onDeleteConfirm = () => {
    const { deleted } = this.state
    if (deleted) {
      return
    }
    const { itemId, onDelete } = this.props
    this.setState({ deleted: true })
    onDelete(itemId)
  }

  private onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      open: true
    })
    return false
  }
  private onDialogClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  public render () {
    const { itemId } = this.props
    const { open } = this.state
    return <>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClick={this.onDialogClick}
      >
        <DialogTitle id="alert-dialog-title">Delete this item? (id: {itemId})</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be reverted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onDeletePanelClose} color="default">
            No
          </Button>
          <Button onClick={this.onDeleteConfirm} color="primary" autoFocus={true}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="raised"
        size="small"
        color="secondary"
        aria-label="delete"
        onClick={this.onButtonClick}
      >
        Delete
        <DeleteIcon />
      </Button>
    </>
  }
}

export default DeleteButton
