import { createAsyncThunk } from "@reduxjs/toolkit"
import * as apis from '../../Apis/Index'


// export const getCurrent = createAsyncThunk("user/current", async (data, { rejectWithValue }) => {
//     const response = await apis.apiGetCurrent()

//     if (!response.success) return rejectWithValue(response)
//     return response.rs




// })
export const getCurrent = createAsyncThunk("user/current", async (data, { rejectWithValue }) => {
    const response = await apis.apiGetCurrent();
    console.log("API Response:", response); // Thêm log để kiểm tra phản hồi API

    if (!response.success) return rejectWithValue(response);
    return response.rs; // Đảm bảo rằng rs chứa dữ liệu mà bạn cần
});
