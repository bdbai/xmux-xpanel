import Announcement from "../Page/Announcement"
import DataListContainerCreator from "./DataListContainerCreator"

/* import * as React from 'react'
import { connect } from 'react-redux'
import Announcement from '../Page/Announcement'
import { announcement } from '../actions'
import IStoreState, { IFirebaseDataList } from '../store/IStoreState'
import IAnnouncement from '../Types/IAnnouncement'
import { RouteComponentProps } from 'react-router'

interface IMapStateToProps {
  dataList: IFirebaseDataList<IAnnouncement>
}
interface IMapDispatchToProps {
  load: () => any
  delete: (key: string) => any
  resetDraft: () => any
}
type IProps = IMapStateToProps & IMapDispatchToProps & RouteComponentProps<{}>

const AnnouncementContainer = class extends React.PureComponent<IProps> {
  public componentDidMount () {
    window.document.title = 'Announcement List - X Panel'
    this.props.load()
  }
  private showDraft = () => {
    if (this.props.dataList.draft.saved) {
      this.props.resetDraft()
    }
    this.props.history.push('/announcement/new')
  }
  public render () {
    return <Announcement
      dataList={this.props.dataList}
      delete={this.props.delete}
      showDraft={this.showDraft}
    />
  }
}

export default connect<IMapStateToProps, IMapDispatchToProps>((state: IStoreState) => ({
  dataList: state.firebaseNode.announcement
}), (dispatch: any) => ({
  load: () => dispatch(announcement.get()),
  delete: (key: string) => dispatch(announcement.delete(key)),
  resetDraft: () => dispatch(announcement.resetDraft())
}))(AnnouncementContainer)
 */

export default DataListContainerCreator('announcement', 'Announcement', Announcement)
