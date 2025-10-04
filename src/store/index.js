import { configureStore } from '@reduxjs/toolkit'
import appReducer from './slices/appSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appReducer,
      // другие редюсеры...
    },
  })
}