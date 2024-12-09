import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import commentListsSlice from "../slices/commentList/commentListsSlice";
import modalReducer from '../slices/modalSlice/modalSlice';
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // LocalStorage kullanımı için
import { combineReducers } from "redux";


// Reducer'ları birleştir
const rootReducer = combineReducers({
    commentList: commentListsSlice,
    modal: modalReducer,
});


// Persist Config oluştur
const persistConfig = {
    key: "root", // Anahtar
    storage, // Depolama tipi (localStorage)
    whitelist: ["modal"], // Sadece "modal" slice'ını sakla (isteğe bağlı)
};


// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);
// Store'u yapılandır
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Persist için gerekli
        }),
});


// Persistor oluştur
export const persistor = persistStore(store);


// Custom Hooks
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;