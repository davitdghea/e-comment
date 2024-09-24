import axios from '../Axios'
const getToken = () => {
    const authData = JSON.parse(localStorage.getItem('persist:shop/user'));
    const token = authData?.token;
    return token ? token.replace(/^"(.*)"$/, '$1') : null;
};
export const apiGetProducts = (params) => axios({
    url: '/product',
    method: "get",
    params
})
export const GetProducts = (pid) => axios({
    url: '/product/' + pid,
    method: "get",
})
export const apiRatings = (data) => {
    const token = getToken();
    return axios({
        url: 'product/ratings/',
        method: "put",
        data,
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined
        }
    })
}
export const apiCreateProduct = (data) => {
    const token = getToken();
    console.log(data)
    return axios({
        url: '/product/',
        method: "post",
        data,
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined
        }
    })
}
export const apiUpdateProduct = (data, pid) => {
    const token = getToken();
    console.log(data)
    return axios({
        url: '/product/' + pid,
        method: "put",
        data,
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined
        }
    })
}
export const apiDeleteProduct = (pid) => {
    const token = getToken();
    return axios({
        url: '/product/' + pid,
        method: "delete",
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined
        }
    })
}
export const apiAddVarriant = (data, pid) => {
    const token = getToken();
    return axios({
        url: '/product/variant/' + pid,
        method: "put",
        data,
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined
        }
    })
}
export const apiCreateOrder = (data) => {
    const token = getToken();
    return axios({
        url: '/order',
        method: "post",
        data,
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined
        }
    })
}
export const apiGetOrder = (params) => {
    const token = getToken();
    return axios({
        url: '/order',
        method: "get",
        params,
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined
        }
    })
}
export const apiGetUserOrder = (params) => {
    const token = getToken();
    return axios({
        url: '/order/',
        method: "get",
        params,
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined
        }
    })
}