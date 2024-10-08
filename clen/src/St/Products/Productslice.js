
import { createSlice } from "@reduxjs/toolkit";
import {getNewProducts} from './AsyncAction';

export const productSlice = createSlice({
    name: "product",
    initialState: {
        newproduct: null,
        isLoading: false,
        errorMessage: '',
        dealDaily: null,
    },
    reducers: {
        getDealDaily: (state,action) =>{
            console.log("Updating dealDaily with:", action.payload);
            state.dealDaily = action.payload
        }
    },
    extraReducers: (builder) => {
      builder.addCase(getNewProducts.pending, (state) => {
          state.isLoading = true;
         });
        builder.addCase(getNewProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newproduct = action.payload;
        });
        builder.addCase(getNewProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload?.message || 'An error occurred';
        });
    },
});

export const { getDealDaily } = productSlice.actions;
export default productSlice.reducer;
