import axios from 'axios'
import { Message } from "element-ui"

axios.interceptors.response.use(
    response => {
        if(response.status && response.status == 200) {
            //Message.success({message: response.data.message})
            return response.data
        }
        else {
            Message.error({message: response.data.message})
            return
        }
    },
    error => {
        Message.error({message: error.response.data.message})
        return
    }
)

export const getRequest = url => {
    return axios({
        method: 'GET',
        url: url
    })
}

export const postRequest = (url, params) => {
    return axios({
        method: 'POST',
        url: url,
        data: params,
        transformRequest: [ transformRequest ],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

export const putRequest = (url, params) => {
    return axios({
        method: 'PUT',
        url: url,
        data: params,
        transformRequest: [ transformRequest ],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

export const deleteRequest = url => {
    return axios({
        method: 'DELETE',
        url: url,
    })
}

const transformRequest = data => {
    let ret = '';
    for (let item in data) {
        ret += encodeURIComponent(item) + '=' + encodeURIComponent(data[item]) + '&';
    }
    return ret;
}