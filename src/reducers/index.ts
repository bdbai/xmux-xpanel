import {
  ERROR_CLEAR,
  ERROR_PUSH,
  ERROR_POP,
  SUCCESS_PUSH,
  FIREBASE_DATA_LIST_LOAD,
  FIREBASE_DATA_LIST_LOADED,
  FIREBASE_DATA_LIST_LOAD_SUCCESS,
  FIREBASE_DATA_LIST_LOAD_ERROR,
  FIREBASE_DATA_LIST_LISTEN,
  FIREBASE_DATA_DRAFT_LOADED,
  FIREBASE_DATA_DRAFT_UPDATE,
  FIREBASE_DATA_DRAFT_SAVE,
  FIREBASE_DATA_DRAFT_SAVED,
  FIREBASE_DATA_DRAFT_SAVE_ERROR,
  FIREBASE_DATA_DRAFT_RESET,
  FIREBASE_DATA_CURRENT_CHANGE,
  FIREBASE_DATA_LOAD,
  FIREBASE_DATA_LOADED,
  FIREBASE_DATA_DELETED,
  FIREBASE_DATA_UPDATE,
  FIREBASE_DATA_SAVE_SUCCESS,
  FIREBASE_DATA_SAVE_ERROR,
  FIREBASE_DATA_LOAD_ERROR,
} from '../actions'
import IStoreState, { IFirebaseDataList, IFirebaseData, IFirebaseDataNameType, IFirebaseDataType } from '../store/IStoreState'
import Factory from './factory'

const getNewFirebaseDataList = <T extends IFirebaseDataNameType> (defaultValue: IFirebaseDataType[T]): IFirebaseDataList<T> => ({
  loading: false,
  error: null,
  data: {},
  listening: false,
  draft: {
    loading: false,
    data: defaultValue,
    isDraft: true,
    deleted: false,
    saved: false
  },
})

const firebaseDataListReducer = (state: IFirebaseDataList<any>, action: any): IFirebaseDataList<any> => {
  switch (action.type) {
    case FIREBASE_DATA_LIST_LOAD:
      return {
        ...state,
        loading: true
      }
    case FIREBASE_DATA_LIST_LOADED:
      return {
        ...state,
        loading: false
      }
    case FIREBASE_DATA_LIST_LOAD_SUCCESS:
      return {
        ...state,
        data: action.data
      }
    case FIREBASE_DATA_LIST_LOAD_ERROR:
      return {
        ...state,
        error: action.error
      }
    case FIREBASE_DATA_CURRENT_CHANGE:
      return {
        ...state,
        current: action.key
      }
    case FIREBASE_DATA_LIST_LISTEN:
      return {
        ...state,
        listening: true
      }
    default:
      return state
  }
}

const firebaseDraftReducer = (state: IFirebaseData<any>, action: any): IFirebaseData<any> => {
  switch (action.type) {
    case FIREBASE_DATA_DRAFT_LOADED:
      return {
        ...state,
        loading: false
      }
    case FIREBASE_DATA_DRAFT_SAVE:
      return {
        ...state,
        loading: true,
      }
    case FIREBASE_DATA_DRAFT_SAVED:
      return {
        ...state,
        data: Factory.GetInstance(action.dataName),
        saved: true
      }
    case FIREBASE_DATA_DRAFT_SAVE_ERROR:
      return {
        ...state,
        error: action.error
      }
    case FIREBASE_DATA_DRAFT_UPDATE:
      return {
        ...state,
        saved: false,
        data: {
          ...state.data,
          ...action.data
        }
      }
    case FIREBASE_DATA_DRAFT_RESET:
      return {
        ...state,
        saved: false,
        loading: false,
        data: Factory.GetInstance(action.dataName)
      }
    default:
      return state
  }
}

const firebaseDataReducer = (state: IFirebaseData<any>, action: any) => {
  switch (action.type) {
    case FIREBASE_DATA_LOAD:
      return {
        ...state,
        loading: true
      }
    case FIREBASE_DATA_LOADED:
      return {
        ...state,
        loading: false
      }
    case FIREBASE_DATA_DELETED:
      return {
        ...state,
        deleted: true
      }
    case FIREBASE_DATA_UPDATE:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.data
        }
      }
    case FIREBASE_DATA_SAVE_SUCCESS:
      return {
        ...state,
        saved: true
      }
    case FIREBASE_DATA_SAVE_ERROR:
      return {
        ...state,
        error: action.error
      }
    case FIREBASE_DATA_LOAD_ERROR:
      return {
        ...state,
        error: action.error
      }
    default:
      return state
  }
}

const errorReducer = (state: any[], action: any) => {
  switch (action.type) {
    case ERROR_CLEAR:
      return []
    case ERROR_PUSH:
      return [
        action.error,
        ...state
      ]
    case ERROR_POP:
      const [ , ...newState ] = state
      return newState
    case SUCCESS_PUSH:
      return [{
          message: action.message
        },
        ...state
      ]
    default:
      return state
  }
}

export default (state: IStoreState = {
  firebaseNode: {
    announcement: getNewFirebaseDataList(Factory.GetInstance('announcement')),
    news: getNewFirebaseDataList(Factory.GetInstance('news'))
  },
  errors: []
}, action: any): IStoreState => {
  switch (action.type) {
    case ERROR_CLEAR:
    case ERROR_PUSH:
    case ERROR_POP:
    case SUCCESS_PUSH:
      return {
        ...state,
        errors: errorReducer(state.errors, action)
      }
    case FIREBASE_DATA_LIST_LOAD:
    case FIREBASE_DATA_LIST_LOADED:
    case FIREBASE_DATA_LIST_LOAD_SUCCESS:
    case FIREBASE_DATA_LIST_LOAD_ERROR:
    case FIREBASE_DATA_LIST_LISTEN:
    case FIREBASE_DATA_CURRENT_CHANGE:
      return {
        ...state,
        firebaseNode: {
          ...state.firebaseNode,
          [action.dataName]: firebaseDataListReducer(state.firebaseNode[action.dataName], action)
        }
      }
    case FIREBASE_DATA_DRAFT_LOADED:
    case FIREBASE_DATA_DRAFT_UPDATE:
    case FIREBASE_DATA_DRAFT_SAVE:
    case FIREBASE_DATA_DRAFT_SAVED:
    case FIREBASE_DATA_DRAFT_SAVE_ERROR:
    case FIREBASE_DATA_DRAFT_RESET:
      return {
        ...state,
        firebaseNode: {
          ...state.firebaseNode,
          [action.dataName]: {
            ...state.firebaseNode[action.dataName],
            draft: firebaseDraftReducer(state.firebaseNode[action.dataName].draft, action)
          }
        }
      }
    case FIREBASE_DATA_LOAD:
    case FIREBASE_DATA_LOADED:
    case FIREBASE_DATA_DELETED:
    case FIREBASE_DATA_UPDATE:
    case FIREBASE_DATA_SAVE_SUCCESS:
    case FIREBASE_DATA_SAVE_ERROR:
      return {
        ...state,
        firebaseNode: {
          ...state.firebaseNode,
          [action.dataName]: {
            ...state.firebaseNode[action.dataName],
            data: {
              ...state.firebaseNode[action.dataName].data,
              [action.key]: firebaseDataReducer(state.firebaseNode[action.dataName].data[action.key], action)
            }
          }
        }
      }
    default:
      return state
  }
}
