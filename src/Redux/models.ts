import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const modelSlice = createSlice({
    name: 'models',
    initialState: {
        raw: [] as any[],
    },
    reducers: {
        addModel: (state, model: PayloadAction<any>) => {
            state.raw.push(model.payload);
        },

        addModels: (state, models: PayloadAction<any[]>) => {
            state.raw.push(...models.payload);
        },
    },
});

// Action creators are generated for each case reducer function
export const { addModel, addModels } = modelSlice.actions;

export default modelSlice.reducer;
