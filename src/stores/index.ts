// store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user'
import { persistStore } from 'redux-persist'

export const store = configureStore({
  reducer: {
    user: userReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false // 禁用序列化检查
    })
})

// 创建持久化存储对象
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
