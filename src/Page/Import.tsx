import * as React from "react"
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { createTask } from '../Component/TaskManager'

const idTask = [
  "student"
]

const decorate = withStyles(theme => ({
  mainPaper: {
    width: '50%',
    margin: '0 auto'
  },
  uploadBtn: {
    width: '100%'
  }
}))

interface IState {
  datatype: number
}

const Import = decorate(class extends React.PureComponent<
  WithStyles<'mainPaper' | 'uploadBtn'>, IState
> {
  public state: IState = {
    datatype: 0
  }
  public componentDidMount () {
    window.document.title = 'Data Import - X Panel'
  }
  private onTabChange = (e: React.MouseEvent<HTMLButtonElement>, value:number) => {
    e.preventDefault()
    this.setState({ datatype: value })
  }
  private onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length > 1 || !files[0].type.includes('csv')) {
      return
    }
    const file = files[0]
    createTask(idTask[this.state.datatype], { file })
  }
  public render () {
    const {
      props: {
        classes: {
          mainPaper,
          uploadBtn
        }
      },
      state: {
        datatype
      }
    } = this
    return <div>
      <Typography className="title" variant="display3">
        Data Import
      </Typography>
      <Divider />
      <Tabs
        value={datatype}
        indicatorColor="primary"
        textColor="primary"
        onChange={this.onTabChange}
      >
        <Tab label="Student" />
        <Tab label="Lecturer" />
      </Tabs>
      <Card className={mainPaper}>
        <CardContent>
          <Typography variant="caption" component="h4">
            {datatype === 0 && "Import student data. Valid fields are 'campusId' 'name' 'grade' 'statusChange' and 'programme'."}
            {datatype === 1 && 'Not implemented yet.'}
            <br />Use <strong>UTF-8</strong> encoding.
          </Typography>
        </CardContent>
        <CardActions>
          <input
            accept=".csv" 
            id="raised-button-file" 
            type="file"
            className="hidden"
            onChange={this.onFileChange}
          /> 
          <label htmlFor="raised-button-file">
            <Button className={uploadBtn} variant="raised" color="primary" component="span">
              Upload CSV
              <CloudUploadIcon />
            </Button>
          </label>
        </CardActions>
      </Card>
    </div>
  }
})

export default Import
