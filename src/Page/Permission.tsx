import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'



class Permission extends React.PureComponent {

 public render () {

    return (
        <div>

            <Typography className="title" variant="display3">
            Permission
            </Typography>
            <Divider />
        </div>
    )
 }   

}

export default Permission