import { configureStore } from '@reduxjs/toolkit';
import appSlice from './App/Appslice'
import storage from "redux-persist/lib/storage"
import productSlice from './Products/Productslice';
import {FLUSH, PAUSE, PERSIST, persistReducer,persistStore, PURGE, REGISTER, REHYDRATE} from "redux-persist"
import userSlice  from './User/Userslice';

const commonConfig = {

  storage
}
const userConfig = {
  key: "shop/user",
  ...commonConfig,
  whitelist: ['isLoggedIn',"token",'current']
}

const productConfig = {
  key: "shop/deal",
  ...commonConfig,
  whitelist: ['dealDally']
}

export const store = configureStore({
  reducer: {
   app:appSlice,
    products: persistReducer(productConfig,productSlice),
    user:persistReducer(userConfig,userSlice)
  },
  middleware:(getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck:{
        ignoreActions:[FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});
export const persistor = persistStore(store)
