import * as React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import IStoreState, { IFirebaseDataList, IFirebaseDataNameType } from '../store/IStoreState'
import { RouteComponentProps } from 'react-router'

interface IMapStateToProps<T extends IFirebaseDataNameType> {
  dataList: IFirebaseDataList<T>
}
interface IMapDispatchToProps {
  load: () => any
  delete: (key: string) => any
  resetDraft: () => any
}

interface IItemProps<T extends IFirebaseDataNameType> {
  delete: (id: string) => void
  dataList: IFirebaseDataList<T>
  showDraft: () => void
}

type IProps<T extends IFirebaseDataNameType> =
  IMapStateToProps<T>
  & IMapDispatchToProps
  & RouteComponentProps<{}>

export default function DataListContainerCreator<T extends IFirebaseDataNameType> (
  dataName: T,
  titleName: string,
  Component: React.ComponentClass<IItemProps<T>>
) {
  const page = class extends React.PureComponent<IProps<T>> {
    public componentDidMount () {
      window.document.title = titleName + ' List - X Panel'
      this.props.load()
    }
    private showDraft = () => {
      if (this.props.dataList.draft.saved) {
        this.props.resetDraft()
      }
      this.props.history.push(`/${dataName}/new`)
    }
    public render () {
      return <Component
        dataList={this.props.dataList}
        delete={this.props.delete}
        showDraft={this.showDraft}
      />
    }
  }

  const dataActions = actions[dataName]

  return connect<IMapStateToProps<T>, IMapDispatchToProps>((state: IStoreState) => ({
    dataList: state.firebaseNode[dataName]
  }), (dispatch: any) => ({
    load: () => dispatch(dataActions.get()),
    delete: (key: string) => dispatch(dataActions.delete(key)),
    resetDraft: () => dispatch(dataActions.resetDraft())
  }))(page)
}
