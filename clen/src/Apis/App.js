import axios from '../Axios'
export const apiGetCategory = () =>axios({
    url: '/productcategoryrouter/',
    method:"get"
})