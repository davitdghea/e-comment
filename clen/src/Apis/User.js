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
    url: '/user/current',
    method: 'put',
    data
})
export const apiUpdateCart = (data) => axios({
    url: '/user/cart',
    method: 'put',
    data
})
export const apiRemoteCart = (pid,color) => axios({
    url: `/user/remote_cart/${pid}/${color}`,
    method: 'delete',
})
export const apiUpdateWithlist = (pid) => axios({
    url: `/user/wishlist/` + pid,
    method: 'put',
    Authorization: 'Bearer ' + token.token.slice(1, -1)

})