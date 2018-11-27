import * as React from 'react'
import TableRow from '@material-ui/core/TableRow'
import { withRouter, RouteComponentProps } from 'react-router'

class NavTableRow extends React.PureComponent<
  {navTo: string} & RouteComponentProps<{}>
> {
  public onClick = () => {
    const {history, navTo} = this.props
    history.push(navTo)
  }
  public render () {
    const {children} = this.props
    return <TableRow className="pointer" onClick={this.onClick} hover={true}>
      {children}
    </TableRow>
  }
}

export default withRouter(NavTableRow)
