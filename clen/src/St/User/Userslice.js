import { createSlice } from "@reduxjs/toolkit";
import * as actions from './AsyncAction';
import { stringify } from "postcss";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
        isLoading: false,
        mes: '',
        currentCart: []
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.token = action.payload.token;

        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.current = null;
            state.token = null;
            state.isLoading = false;
            state.mes = '';
        },
        clearMessage: (state) => {
            state.mes = '';
        },
        updateCart: (state, action) => {
            const { pid, color, quantity } = action.payload;
            const updatedCart = state.currentCart.map(el => {
                if (el.color === color && el.product === pid) {
                    return { ...el, quantity: quantity };
                }
                return el;
            });
            state.currentCart = updatedCart; 
        }
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getCurrent.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
            state.isLoading = false;
            state.current = action.payload;
            state.currentCart = action.payload?.cart;
            state.current = action.payload;
            state.isLoggedIn = true;
           
        });
        builder.addCase(actions.getCurrent.rejected, (state) => {
            state.isLoading = false;
            state.current = null;
            state.isLoggedIn = false;
            state.token = null;
            state.mes = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!';
        });
    },
});

export const { login, logout, clearMessage, updateCart } = userSlice.actions;
export default userSlice.reducer;
