 import axios from "../Axios";

const getToken = () => {
    const authData = JSON.parse(localStorage.getItem('persist:shop/user'));
    const token = authData?.token;
    return token ? token.replace(/^"(.*)"$/, '$1') : null;
};
export const apiGetMessage = (params) => {
    const token = getToken();
    return axios({
        url: '/message/',
        method: "get",
        params,
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined
        }
    })
}
export const apiGetMessageOne = (params) => {
    const token = getToken();
    return axios({
        url: '/message/messageOne',
        method: "get",
        params,
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined
        }
    })
}
export const apiUpdateMessage = (params) => {
    const token = getToken();
    return axios({
        url: '/message/',
        method: "put",
        params,
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined
        }
    })
}