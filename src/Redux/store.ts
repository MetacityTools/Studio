import { configureStore } from '@reduxjs/toolkit';

import modelSlice from './models';

const store = configureStore({
    reducer: {
        models: modelSlice,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
