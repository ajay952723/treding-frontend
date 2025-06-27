
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {  useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import authSlice from './Auth/AuthSlice'
import coinSlice from './coin/coinSlice'
import walletSlice from './wallet/walletSlice'
import paymentSlice from './payment/paymentSlice'
import  withdrawalSlice from './withdrawal/withdrawalSlice'
import transactionSlice from './transaction/transactionSlice'
import paymentDetailsSlice from './payment/paymentDetailsSlice'
import orderSlice from './order/orderSlice'
import assetSlice from './Asset/assetSlice'
import watchListSlice from './watchlist/watchListSlice'

const rootReducer = combineReducers({
  auth:authSlice,
  coin:coinSlice,
  wallet:walletSlice,
  payment:paymentSlice,
  withdrawal: withdrawalSlice,
  transaction:transactionSlice,
  paymentDetails: paymentDetailsSlice,
  orders:orderSlice,
  assets:assetSlice,
  watchlist: watchListSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
