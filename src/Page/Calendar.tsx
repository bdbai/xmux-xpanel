import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

class Calendar extends React.PureComponent {
  public render () {
    return (
      <div>
        <Typography className="title" variant="display3">
          Calendar
        </Typography>
        <Divider />

      </div>

    ) 
  }

}

export default Calendar