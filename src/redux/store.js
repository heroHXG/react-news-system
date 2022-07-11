


// 官方提示 createStore 建议改为 configureStore, 解决createStore 有删除线的问题
import {legacy_createStore as createStore, combineReducers, compose} from 'redux'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import {CollapsedReducer} from '@/redux/reducers/CollapsedReducer'
import {LoadingReducer} from '@/redux/reducers/LoadingReducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({trace: true}) || compose;

const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
}) 

const persistConfig = {
    key: 'news',
    storage,
    blacklist: ['LoadingReducer'] // navigation will not be persisted
  }
  
  const persistedReducer = persistReducer(persistConfig, reducer)
  let store = createStore(persistedReducer, composeEnhancers())
  let persistor = persistStore(store)

  export { store, persistor }
