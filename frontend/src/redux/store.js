import {configureStore} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist';
import { createApiSlice } from './api/api';
import authReducer from './features/authSlice';
import profileReducer from './features/profileModeSlice';

const persistsConfig = {
    key : "profileMode",
    storage
}

const persistProfileModeReducer = persistReducer(persistsConfig, profileReducer);

export const store = configureStore({
    reducer:{
        [createApiSlice.reducerPath] : createApiSlice.reducer,
        auth : authReducer,
        profileMode : persistProfileModeReducer
    },

    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(createApiSlice.middleware),
    
    devTools : true, 
})

export const persistor = persistStore(store);
