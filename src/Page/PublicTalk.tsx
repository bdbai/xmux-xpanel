import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

class PublicTalk extends React.PureComponent {

    public render () {
        return (
         <div>
             <Typography className="title" variant="display3">
               PublicTalk
             </Typography>
             <Divider />
          </div>
        )


    }
}

export default PublicTalk 