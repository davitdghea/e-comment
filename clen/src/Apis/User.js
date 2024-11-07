import axios from "../Axios";

export const apiRegister = (data) => axios({
    url: '/user/register',
    method:'post',
    data,
    
})
export const apiFinalRegister = (token) => axios({
    url: `/user/finalregister/${token}`,
    method: 'put',
})
export const apiLogin = (data) => axios({
    url: '/user/login',
    method:'post',
    data
})
export const apiForgotPassword = (data) => axios({
    url: '/user/forgotpassword',
    method: 'post',
    data
})
export const apiResetPassWord = (data) => axios({
    url: '/user/resetPassword',
    method: 'put',
    data
})
const token = JSON.parse(localStorage.getItem('persist:shop/user'));
export const apiGetCurrent = () => axios({
    url: '/user/current',
    method: 'get',
    headers: {
        Authorization: 'Bearer '+token.token.slice(1,-1)}
})
export const apiGetUsers = (params) => axios({
    url: '/user',
    method: 'get',
    params
})
export const apiUpdate = (data,uid) => axios({
    url: '/user/' + uid,
    method: 'put',
    data
})
export const apiDelete = (uid) => axios({
    url: '/user/' + uid,
    method: 'delete',
})
export const apiUpdateCurrent = (data) => axios({
    url: '/user/update',
    method: 'put',
    data,
    headers: {
        Authorization: 'Bearer ' + token.token.slice(1, -1)
    }
})
export const apiUpdateMoney = (data) => axios({
    url: '/user/update/money',
    method: 'put',
    data,
    headers: {
    Authorization: 'Bearer ' + token.token.slice(1, -1)
}
})
export const apiUpdateCart = (data) => axios({
    url: '/user/cart',
    method: 'put',
    data
})
export const apiRemoteCart = (pid,color) => axios({
    url: `/user/remote_cart/${pid}/${encodeURIComponent(color) }`,
    method: 'delete',
})
export const apiUpdateWithlist = (data) => axios({
    url: `/user/wishlist` ,
    method: 'put',
    data,
    headers: {
        Authorization: 'Bearer ' + token.token.slice(1, -1) 
    }

})
export const apiPayouts = (data) => axios({
    url:"/user/payouts",
    method:'post',
    data,
    headers: {
        Authorization: 'Bearer ' + token.token.slice(1, -1)
    }
})