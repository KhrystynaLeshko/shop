import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./cartRedux";
import userReducer from "./userRedux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  // custom merge function to handle state reset for the user and cart reducers
  stateReconciler: (inboundState, originalState) => {
    const mergedState = { ...inboundState };

    // Handle state reset for the user reducer
    if (originalState.user && originalState.user.currentUser === null) {
      mergedState.user = { ...originalState.user, ...inboundState.user };
    }

    // Handle state reset for the cart reducer
    if (originalState.cart && originalState.cart.quantity === 0) {
      mergedState.cart = { ...originalState.cart, ...inboundState.cart };
    }

    return mergedState;
  },

  // custom merge function to handle state reset for the user reducer
  // stateReconciler: (inboundState, originalState) => {
  //   if (originalState.user && originalState.user.currentUser === null) {
  //     return { ...originalState, user: { ...inboundState.user } };
  //   }
  //   return { ...inboundState };
  // },
};

const rootReducer = combineReducers({ user: userReducer, cart: cartReducer });

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);