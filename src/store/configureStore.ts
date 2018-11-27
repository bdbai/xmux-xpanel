import { createStore, applyMiddleware, Middleware } from 'redux'
import reducers from '../reducers'
import Thunk from 'redux-thunk'
import { logger } from 'redux-logger'

const middlewares: Middleware[] = []
middlewares.push(Thunk)
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger)
}

export default () =>
  createStore(reducers, applyMiddleware(...middlewares))
