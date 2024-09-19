import {createAsyncThunk} from "@reduxjs/toolkit"
import * as apis from '../../Apis/Index'


export const getNewProducts = createAsyncThunk("product/newproducts", async(data, {rejectWithValue})=>{
    const response = await apis.apiGetProducts({sort:"-createdAt"})
   
    if(!response.success) return rejectWithValue(response)
        return response.producData



    
})