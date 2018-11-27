import * as React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import IStoreState, { IFirebaseDataList, IFirebaseData, IFirebaseDataNameType, IFirebaseDataType } from '../store/IStoreState'
import { RouteComponentProps } from 'react-router'
import Factory from '../reducers/factory'

interface IMapStateToProps<T extends IFirebaseDataNameType> {
  dataList: IFirebaseDataList<T>
}
interface IMapDispatchToProps<T> {
  load: () => any
  reset: (key: string) => any
  save: (key: string) => any
  saveDraft: () => any
  update: <U extends keyof T>(key: string, obj: Pick<T, U>) => any
  updateDraft: <U extends keyof T>(obj: Pick<T, U>) => any
  changeCurrent: (key?: string) => any
}

type IProps<T extends IFirebaseDataNameType> =
  IMapStateToProps<T>
  & IMapDispatchToProps<IFirebaseDataType[T]>
  & RouteComponentProps<{ id: string }>

interface IItemProps<T extends IFirebaseDataNameType, U extends IFirebaseDataType[T]> {
  reset: () => void
  save: () => void
  update: <V extends keyof U>(field: V, value: U[V]) => void
  data: IFirebaseData<U>
}

export default function DataContainerCreator<T extends IFirebaseDataNameType> (
  dataName: T,
  titleName: string,
  ItemComponent: React.ComponentClass<IItemProps<T, IFirebaseDataType[T]>>
) {
  const ItemPage = class extends React.PureComponent<IProps<T>> {
    public componentDidMount () {
      window.document.title = titleName + ' Detail - X Panel'
      this.props.load()
    }

    public componentDidUpdate (prevProps: IProps<T>) {
      const urlId = this.props.match.params.id
      if (this.isDraft() && this.props.dataList.draft.saved) {
        this.props.history.push('/' + dataName)
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
            data: Factory.GetInstance(dataName)
          } as IFirebaseData<IFirebaseDataType[T]>
      }
    }

    private update = <X extends keyof IFirebaseDataType[T]> (key: X, obj: IFirebaseDataType[T][X]) => {
      const newObj = {
        [key]: obj
      } as unknown as Pick<IFirebaseDataType[T], X>
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
      return <ItemComponent
        data={this.getCurrent()}
        reset={this.reset}
        save={this.save}
        update={this.update}
      />
    }
  }

  const dataActions = actions[dataName]

  return connect<IMapStateToProps<T>, IMapDispatchToProps<IFirebaseDataType[T]>>((state: IStoreState) => ({
    dataList: state.firebaseNode[dataName] as unknown as IFirebaseDataList<T>
  }), (dispatch: any) => ({
    load: () => dispatch(dataActions.get()),
    reset: (key: string) => dispatch(dataActions.reset(key)),
    save: (key: string) => dispatch(dataActions.save(key)),
    saveDraft: () => dispatch(dataActions.saveDraft()),
    update: <V extends keyof IFirebaseDataType[T]> (key: string, obj: Pick<IFirebaseDataType[T], V>) => dispatch(dataActions.update(key, obj)),
    updateDraft: (obj: any) => dispatch(dataActions.updateDraft(obj)),
    changeCurrent: (key: string) => dispatch(dataActions.changeCurrent(key))
  }))(ItemPage)
}
