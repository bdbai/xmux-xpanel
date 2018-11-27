import * as React from 'react'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import INews from '../Types/INews'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import ClearIcon from '@material-ui/icons/Clear'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import MainPaper from '../Component/MainPaper'
import { IFirebaseData } from '../store/IStoreState'

interface IProps {
  reset: () => void
  save: () => void
  update: <T extends keyof INews>(field: T, value: INews[T]) => void
  data: IFirebaseData<INews>
}

const decorate = withStyles(theme => ({
  button: {
    margin: theme.spacing.unit
  }
}))

const NewsItem = decorate(
  class extends React.PureComponent<WithStyles<'button'> & IProps> {
    private onCommonFieldChange = (field: keyof INews) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.update(field, e.target.value)
      }
    private onI18nFieldChange = (field: 'imageURL' | 'name', lang: string) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const data = this.props.data.data
        this.props.update(field, {
          lang: {
            ...data[field].lang,
            [lang]: e.target.value
          }
        })
      }
    private enImageUrlChange = this.onI18nFieldChange('imageURL', 'en_US')
    private zhImageUrlChange = this.onI18nFieldChange('imageURL', 'zh_CN')
    private enNameChange = this.onI18nFieldChange('name', 'en_US')
    private zhNameChange = this.onI18nFieldChange('name', 'zh_CN')
    private urlChange = this.onCommonFieldChange('uri')
    private isWebPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.update('isWebPage', e.target.checked)
    }

    private onSaveClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      this.props.save()
    }

    private onResetClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      this.props.reset()
    }

    public render () {
      const {
        data: {
          data, loading, isDraft
        },
        classes: {
          button
        }
      } = this.props
      return <MainPaper
        loading={loading}
        title={"News Detail"}
      >
        <Button onClick={this.onSaveClick} disabled={loading} className={button} variant="raised" color="primary">
          <SaveIcon aria-label="save" /> Save
        </Button>
        <Button disabled={isDraft} onClick={this.onResetClick} className={button} variant="raised" color="default">
          <ClearIcon aria-label="Reset" /> Reset
        </Button>
        <TextField
          fullWidth={true}
          margin="normal"
          label="Name (English)"
          value={data ? data.name.lang.en_US : ''}
          onChange={this.enNameChange}
        />
        <TextField
          fullWidth={true}
          margin="normal"
          label="Name (Chinese)"
          value={data ? data.name.lang.zh_CN : ''}
          onChange={this.zhNameChange}
        />
        <TextField
          fullWidth={true}
          margin="normal"
          label="Image URL (English)"
          value={data ? data.imageURL.lang.en_US : ''}
          onChange={this.enImageUrlChange}
        />
        <TextField
          fullWidth={true}
          margin="normal"
          label="Image URL (Chinese)"
          value={data ? data.imageURL.lang.zh_CN : ''}
          onChange={this.zhImageUrlChange}
        />
        <TextField
          fullWidth={true}
          margin="normal"
          label="Uri"
          value={data ? data.uri : ''}
          onChange={this.urlChange}
          type="url"
        />
        <FormControlLabel
          control={<Checkbox
            checked={data.isWebPage}
            onChange={this.isWebPageChange}
            value={data.isWebPage ? "isWebPage" : undefined}
            color="primary"
          />}
          label="Internet web page"
        />
      </MainPaper>
    }
  }
)

export default NewsItem as React.ComponentClass<IProps>
