import DataContainerCreator from "./DataContainerCreator"
import AnnouncementItem from "../Page/AnnouncementItem"

/* import * as React from 'react'
import { connect } from 'react-redux'
import { announcement } from '../actions'
import IStoreState, { IFirebaseDataList, IFirebaseData } from '../store/IStoreState'
import IAnnouncement from '../Types/IAnnouncement'
import { RouteComponentProps } from 'react-router'
import AnnouncementItem from '../Page/AnnouncementItem'
import Factory from '../reducers/factory'

interface IMapStateToProps {
  dataList: IFirebaseDataList<IAnnouncement>
}
interface IMapDispatchToProps {
  load: () => any
  reset: (key: string) => any
  save: (key: string) => any
  saveDraft: () => any
  update: (key: string, obj: Partial<IAnnouncement>) => any
  updateDraft: (obj: Partial<IAnnouncement>) => any
  changeCurrent: (key?: string) => any
}
type IProps = IMapStateToProps & IMapDispatchToProps & RouteComponentProps<{ id: string }>

const AnnouncementItemContainer = class extends React.PureComponent<IProps> {
  public componentDidMount () {
    window.document.title = 'Announcement Detail - X Panel'
    this.props.load()
  }

  public componentDidUpdate (prevProps: IProps) {
    const urlId = this.props.match.params.id
    if (this.isDraft() && this.props.dataList.draft.saved) {
      this.props.history.push('/announcement')
    }
    if (!this.isDraft() && this.getKey() !== urlId) {
      this.props.changeCurrent(this.isDraft() ? undefined : urlId)
    }
  }

  private isDraft = () => {
    return this.props.match.params.id === 'new'
  }

  private getKey = () => {
    return this.props.dataList.current!
  }

  public componentWillMount () {
    this.props.load()
    this.props.changeCurrent(this.isDraft() ? undefined : this.props.match.params.id)
  }

  private save = () => {
    if (this.isDraft()) {
      this.props.saveDraft()
    } else {
      this.props.save(this.getKey())
    }
  }

  private getCurrent = () => {
    if (this.isDraft()) {
      return this.props.dataList.draft
    } else {
      const stateData = this.props.dataList.data[this.getKey()]
      return stateData
        ? stateData
        : {
          loading: true,
          isDraft: false,
          data: Factory.GetInstance('announcement') as IAnnouncement
        } as IFirebaseData<IAnnouncement>
    }
  }

  private update = <T extends keyof IAnnouncement> (key: T, obj: IAnnouncement[T]) => {
    const newObj = {
      [key]: obj
    }
    if (this.isDraft()) {
      this.props.updateDraft(newObj)
    } else {
      this.props.update(this.getKey(), newObj)
    }
  }

  private reset = () => {
    if (!this.isDraft()) {
      this.props.reset(this.getKey())
    }
  }

  public render () {
    return <AnnouncementItem
      data={this.getCurrent()}
      reset={this.reset}
      save={this.save}
      update={this.update}
    />
  }
}

export default connect<IMapStateToProps, IMapDispatchToProps>((state: IStoreState) => ({
  dataList: state.firebaseNode.announcement
}), (dispatch: any) => ({
  load: () => dispatch(announcement.get()),
  reset: (key: string) => dispatch(announcement.reset(key)),
  save: (key: string) => dispatch(announcement.save(key)),
  saveDraft: () => dispatch(announcement.saveDraft()),
  update: (key: string, obj: Partial<IAnnouncement>) => dispatch(announcement.update(key, obj)),
  updateDraft: (obj: Partial<IAnnouncement>) => dispatch(announcement.updateDraft(obj)),
  changeCurrent: (key: string) => dispatch(announcement.changeCurrent(key))
}))(AnnouncementItemContainer)
 */

export default DataContainerCreator('announcement', 'Announcement', AnnouncementItem)
