import IAnnouncement from "../Types/IAnnouncement"
import INews from "../Types/INews"

export interface IFirebaseData<T> {
  loading: boolean
  data: T
  error?: any
  isDraft: boolean
  deleted: boolean
  saved: boolean
}

export type IFirebaseDataType = {
  announcement: IAnnouncement,
  news: INews
}

export interface IFirebaseDataList<T extends IFirebaseDataNameType> {
  loading: boolean
  data: Record<string, IFirebaseData<IFirebaseDataType[T]>>
  error?: any
  draft: IFirebaseData<IFirebaseDataType[T]>
  current?: string
  listening: boolean
}

export type IFirebaseDataNameType = keyof IFirebaseDataType

export type IFirebaseNode = {
  [T in IFirebaseDataNameType]: IFirebaseDataList<T>
}

export default interface IStoreState {
  firebaseNode: IFirebaseNode
  errors: any[]
}
