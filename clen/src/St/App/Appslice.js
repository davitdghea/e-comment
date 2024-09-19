
import { createSlice } from "@reduxjs/toolkit";
import * as actions from './AsyncAction';

export const appSlice = createSlice({
    name: "app",
    initialState: {
        categories: null,
        isLoading: false,
        errorMessage: null,
        isShowModal: false,
        moDalChildren: null,
        isShowCart: false
    },
    reducers: {
        ShowModal: (state,action)=>{
            state.isShowModal = action.payload.isShowModal
            state.moDalChildren = action.payload.moDalChildren
        },
        ShowCart: (state) =>{
            state.isShowCart = state.isShowCart === false ? true : false
        }
    },
    extraReducers: (builder) => {
      builder.addCase(actions.GetCategory.pending, (state) => {
          state.isLoading = true;
         });
        builder.addCase(actions.GetCategory.fulfilled, (state, action) => {
            state.isLoading = false;
            state.categories = action.payload;
        });
        builder.addCase(actions.GetCategory.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action?.payload?.message;
        });
    },
});

export const { ShowModal, ShowCart } = appSlice.actions;
export default appSlice.reducer;
