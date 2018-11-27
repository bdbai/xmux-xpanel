import * as React from 'react'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import IAnnouncement from '../Types/IAnnouncement'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import ClearIcon from '@material-ui/icons/Clear'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { IFirebaseData } from '../store/IStoreState'
import MainPaper from '../Component/MainPaper'

interface IProps {
  reset: () => void
  save: () => void
  update: <T extends keyof IAnnouncement>(field: T, value: IAnnouncement[T]) => void
  data: IFirebaseData<IAnnouncement>
}

const decorate = withStyles(theme => ({
  button: {
    margin: theme.spacing.unit
  }
}))

const AnnouncementItem = decorate(
  class extends React.PureComponent<WithStyles<'button'> & IProps> {
    private onCommonFieldChange = (field: keyof IAnnouncement) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.update(field, e.target.value)
      }

    private onI18nFieldChange = (field: 'detail' | 'headline', lang: string) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const data = this.props.data.data
        this.props.update(field, {
          lang: {
            ...data[field].lang,
            [lang]: e.target.value
          }
        })
      }

    private enHeadlineChange = this.onI18nFieldChange('headline', 'en_US')
    private zhHeadlineChange = this.onI18nFieldChange('headline', 'zh_CN')
    private enDetailChange = this.onI18nFieldChange('detail', 'en_US')
    private zhDetailChange = this.onI18nFieldChange('detail', 'zh_CN')
    private urlChange = this.onCommonFieldChange('uri')
    private isWebPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.update('isWebPage', e.target.checked)
    }

    private onSaveClick = async () => {
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
        title="Announcement Detail"
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
          label="Title (English)"
          value={data ? data.headline.lang.en_US : ''}
          onChange={this.enHeadlineChange}
        />
        <TextField
          fullWidth={true}
          margin="normal"
          label="Title (Chinese)"
          value={data ? data.headline.lang.zh_CN : ''}
          onChange={this.zhHeadlineChange}
        />
        <TextField
          fullWidth={true}
          margin="normal"
          label="Content (English)"
          multiline={true}
          value={data ? data.detail.lang.en_US : ''}
          onChange={this.enDetailChange}
        />
        <TextField
          fullWidth={true}
          margin="normal"
          label="Content (Chinese)"
          multiline={true}
          value={data ? data.detail.lang.zh_CN : ''}
          onChange={this.zhDetailChange}
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

export default AnnouncementItem as React.ComponentClass<IProps>
