import { createSlice } from "@reduxjs/toolkit";
import * as actions from './AsyncAction';

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
            console.log("Current payload:", state.current);
            console.log("CurrentCart payload:", state.currentCart);
            // Tạo bản sao của currentCart
            const updatedCart = state.currentCart.slice().map(el => {
                if (el.color === color && el.product === pid) {
                    return { ...el, quantity: quantity };
                }
                return el;
            });

            // Cập nhật lại state
            state.currentCart = updatedCart;
            console.log(state.currentCart)
        }

    },
    extraReducers: (builder) => {
        builder.addCase(actions.getCurrent.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
            state.isLoading = false;
            state.current = action.payload;
            console.log(action.payload?.cart)
            state.currentCart = action.payload?.cart;
            console.log(state.currentCart)
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
