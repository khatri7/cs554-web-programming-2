import { combineReducers, configureStore } from "@reduxjs/toolkit";
import collectors from "./collectors";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
	key: "marvel-client",
	storage,
};

const rootReducer = combineReducers({ collectors });

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({ reducer: persistedReducer });

export const persistor = persistStore(store);
