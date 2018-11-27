import * as firebase from 'firebase'
import * as Redux from 'redux'
import { ThunkAction } from 'redux-thunk'
import IStoreState, { IFirebaseDataNameType, IFirebaseDataType } from '../store/IStoreState'
// import IAnnouncement from '../Types/IAnnouncement'
// import INews from '../Types/INews'
// import { Reference } from '@firebase/database'
type ThunkResult = ThunkAction<void, IStoreState, undefined, any>

export const ERROR_CLEAR = 'ERROR_CLEAR'
export const ERROR_PUSH = 'ERROR_PUSH'
export const ERROR_POP = 'ERROR_POP'
export const SUCCESS_PUSH = 'SUCCESS_PUSH'
export const FIREBASE_DATA_LIST_LOAD = 'FIREBASE_DATA_LIST_LOAD'
export const FIREBASE_DATA_LIST_LOADED = 'FIREBASE_DATA_LIST_LOADED'
export const FIREBASE_DATA_LIST_LOAD_SUCCESS = 'FIREBASE_DATA_LIST_LOAD_SUCCESS'
export const FIREBASE_DATA_LIST_LOAD_ERROR = 'FIREBASE_DATA_LIST_LOAD_ERROR'
export const FIREBASE_DATA_LIST_LISTEN = 'FIREBASE_DATA_LIST_LISTEN'
export const FIREBASE_DATA_DRAFT_LOADED = 'FIREBASE_DATA_DRAFT_LOADED'
export const FIREBASE_DATA_DRAFT_UPDATE = 'FIREBASE_DATA_DRAFT_UPDATE'
export const FIREBASE_DATA_DRAFT_SAVE = 'FIREBASE_DATA_DRAFT_SAVE'
export const FIREBASE_DATA_DRAFT_SAVE_ERROR = 'FIREBASE_DATA_DRAFT_SAVE_ERROR'
export const FIREBASE_DATA_DRAFT_SAVED = 'FIREBASE_DATA_DRAFT_SAVED'
export const FIREBASE_DATA_DRAFT_RESET = 'FIREBASE_DATA_DRAFT_RESET'
export const FIREBASE_DATA_CURRENT_CHANGE = 'FIREBASE_DATA_CURRENT_CHANGE'
export const FIREBASE_DATA_LOAD = 'FIREBASE_DATA_LOAD'
export const FIREBASE_DATA_LOADED = 'FIREBASE_DATA_LOADED'
export const FIREBASE_DATA_LOAD_ERROR = 'FIREBASE_DATA_LOAD_ERROR'
export const FIREBASE_DATA_DELETED = 'FIREBASE_DATA_DELETED'
export const FIREBASE_DATA_UPDATE = 'FIREBASE_DATA_UPDATE'
export const FIREBASE_DATA_SAVE_SUCCESS = 'FIREBASE_DATA_SAVE_SUCCESS'
export const FIREBASE_DATA_SAVE_ERROR = 'FIREBASE_DATA_SAVE_ERROR'

function startLoadFirebaseDataList (dataName: IFirebaseDataNameType) {
  return {
    type: FIREBASE_DATA_LIST_LOAD,
    dataName
  }
}

function loadedFirebaseDataList (dataName: IFirebaseDataNameType) {
  return {
    type: FIREBASE_DATA_LIST_LOADED,
    dataName
  }
}

function loadedFirebaseDataListSuccessfully (dataName: IFirebaseDataNameType, data: any) {
  const nodeData = {}
  Object.keys(data || {}).forEach(k => nodeData[k] = {
    loading: false,
    data: data[k],
    isDraft: false
  })
  return {
    type: FIREBASE_DATA_LIST_LOAD_SUCCESS,
    dataName,
    data: nodeData
  }
}

function loadedFirebaseDataListWithError (dataName: IFirebaseDataNameType, err: any) {
  return {
    type: FIREBASE_DATA_LIST_LOAD_ERROR,
    dataName,
    error: err
  }
}

function listenFirebaseDataList (dataName: IFirebaseDataNameType) {
  return {
    type: FIREBASE_DATA_LIST_LISTEN,
    dataName
  }
}

const getFirebaseDataList = (dataName: IFirebaseDataNameType, node: string) => (): ThunkResult =>
  async (dispatch, getState) => {
    const dataList = getState().firebaseNode[dataName]
    if (dataList.listening || dataList.loading) {
      return
    }
    dispatch(startLoadFirebaseDataList(dataName))
    try {
      await firebase.database().ref(node).on('value', ds => {
        dispatch(loadedFirebaseDataList(dataName))
        if (ds === null) {
          return dispatch(loadedFirebaseDataListSuccessfully(dataName, {}))
        }
        return dispatch(loadedFirebaseDataListSuccessfully(dataName, ds.toJSON()))
      })
      return dispatch(listenFirebaseDataList(dataName))
    } catch (ex) {
      dispatch(loadedFirebaseDataList(dataName))
      dispatch(pushError(ex))
      return await dispatch(loadedFirebaseDataListWithError(dataName, ex))
    }
  }

function startSaveFirebaseDataDraft (dataName: IFirebaseDataNameType) {
  return {
    type: FIREBASE_DATA_DRAFT_SAVE,
    dataName
  }
}

function savedFirebaseDataDraftSuccessfully (dataName: IFirebaseDataNameType, key: string, data: any) {
  return {
    type: FIREBASE_DATA_DRAFT_SAVED,
    key,
    dataName
  }
}

const firebaseDataCurrentChange = (dataName: IFirebaseDataNameType) => (newKey?: string) => ({
  type: FIREBASE_DATA_CURRENT_CHANGE,
  key: newKey,
  dataName
})

function savedFirebaseDataDraftWithError (dataName: IFirebaseDataNameType, err: any) {
  return {
    type: FIREBASE_DATA_DRAFT_SAVE_ERROR,
    dataName,
    error: err
  }
}

const updateFirebaseDraft = <T extends IFirebaseDataNameType> (dataName: T) => <U extends IFirebaseDataType[T], W extends keyof U>(data: Pick<U, W>) => {
  return {
    type: FIREBASE_DATA_DRAFT_UPDATE,
    dataName,
    data
  }
}

function loadedFirebaseDataDraft (dataName: IFirebaseDataNameType) {
  return {
    type: FIREBASE_DATA_DRAFT_LOADED,
    dataName
  }
}

const saveFirebaseDraft = (dataName: IFirebaseDataNameType, node: string) => (): ThunkResult =>
  async (dispatch, getState) => {
    dispatch(startSaveFirebaseDataDraft(dataName))
    const draft = {
      ...getState().firebaseNode[dataName].draft.data,
      timestamp: +new Date()
    }
    try {
      const res = await firebase.database().ref(node).push(draft)
      dispatch(savedFirebaseDataDraftSuccessfully(dataName, res.key, draft))
      dispatch(firebaseDataCurrentChange(dataName)((res.toString() as string).split('/').pop()))
      dispatch(pushSuccess("Created!"))
    } catch (ex) {
      dispatch(pushError(ex))
      dispatch(savedFirebaseDataDraftWithError(dataName, ex))
    } finally {
      dispatch(loadedFirebaseDataDraft(dataName))
    }
  }

function loadFirebaseData (dataName: IFirebaseDataNameType, key: string) {
  return {
    type: FIREBASE_DATA_LOAD,
    dataName,
    key
  }
}

function deletedFirebaseData (dataName: IFirebaseDataNameType, key: string) {
  return {
    type: FIREBASE_DATA_DELETED,
    dataName,
    key
  }
}

function loadedFirebaseData (dataName: IFirebaseDataNameType, key: string) {
  return {
    type: FIREBASE_DATA_LOADED,
    dataName,
    key
  }
}

const deleteFirebaseData = (dataName: IFirebaseDataNameType, node: string) => (key: string) =>
  async (dispatch: Redux.Dispatch) => {
    try {
      dispatch(loadFirebaseData(dataName, key))
      await firebase.database().ref(`${node}/${key}`).remove()
      dispatch(pushSuccess("Deleted!"))
    } catch (ex) {
      dispatch(deletedFirebaseData(dataName, key))
      dispatch(loadedFirebaseData(dataName, key))
    }
  }

const updateFirebaseData = <T extends IFirebaseDataNameType>(dataName: T) => <U extends IFirebaseDataType[T], V extends keyof U>(key: string, object: Pick<U, V> | null) => ({
  type: FIREBASE_DATA_UPDATE,
  dataName,
  key,
  data: object || {}
})

function savedFirebaseDataSuccessfully (dataName: IFirebaseDataNameType, key: string) {
  return {
    type: FIREBASE_DATA_SAVE_SUCCESS,
    key,
    dataName
  }
}

function savedFirebaseDataWithError (dataName: IFirebaseDataNameType, key: string, error: any) {
  return {
    type: FIREBASE_DATA_SAVE_ERROR,
    dataName,
    key,
    error
  }
}

const saveFirebaseData = (dataName: IFirebaseDataNameType, node: string) =>
  (key: string): ThunkResult => async (dispatch, getState) => {
    dispatch(loadFirebaseData(dataName, key))
    const data = getState().firebaseNode[dataName].data[key]
    data.data = {
      ...data.data,
      timestamp: +new Date()
    }
    try {
      await firebase.database().ref(`${node}/${key}`).update(data.data)
      dispatch(savedFirebaseDataSuccessfully(dataName, key))
      dispatch(pushSuccess("Saved!"))
    } catch (ex) {
      dispatch(savedFirebaseDataWithError(dataName, key, ex))
      dispatch(pushError(ex))
    } finally {
      dispatch(loadedFirebaseData(dataName, key))
    }
  }

function loadedFirebaseDataWithError (dataName: IFirebaseDataNameType, key: string, err: any) {
  return {
      type: FIREBASE_DATA_LOAD_ERROR,
      dataName,
      key,
      error: err
  }
}

const resetFirebaseData = (dataName: IFirebaseDataNameType, node: string) => (key: string): ThunkResult => {
  const update = updateFirebaseData(dataName)
  return async (dispatch, getState) => {
    dispatch(loadFirebaseData(dataName, key))
    try {
      const res = await firebase.database().ref(`${node}/${key}`).once('value')
      dispatch(update(key, res.toJSON() as any))
    } catch (ex) {
      dispatch(pushError(ex))
      dispatch(loadedFirebaseDataWithError(dataName, key, ex))
    } finally {
      dispatch(loadedFirebaseData(dataName, key))
    }
  }
}

const resetFirebaseDraft = (dataName: IFirebaseDataNameType) => () => ({
  type: FIREBASE_DATA_DRAFT_RESET,
  dataName
})

function generateFirebaseNodeActions (dataName: IFirebaseDataNameType, node: string) {
  return {
    get: getFirebaseDataList(dataName, node),
    updateDraft: updateFirebaseDraft(dataName),
    saveDraft: saveFirebaseDraft(dataName, node),
    delete: deleteFirebaseData(dataName, node),
    update: updateFirebaseData(dataName),
    save: saveFirebaseData(dataName, node),
    reset: resetFirebaseData(dataName, node),
    resetDraft: resetFirebaseDraft(dataName),
    changeCurrent: firebaseDataCurrentChange(dataName)
  }
}

const announcementActions = generateFirebaseNodeActions('announcement', '/homepage/homepage/announcements')
const newsActions = generateFirebaseNodeActions('news', '/homepage/homepage/news')

export const announcement = announcementActions
export const news = newsActions

export const clearError = () => ({
  type: ERROR_CLEAR
})

export const pushError = (error: any) => ({
  type: ERROR_PUSH,
  error
})

export const popError = () => ({
  type: ERROR_POP
})

export const replaceError = (error: any): ThunkResult => {
  return dispatch => {
    dispatch(clearError())
    dispatch(pushError(error))
  }
}

export const pushSuccess = (message: string) => ({
  type: SUCCESS_PUSH,
  message
})
