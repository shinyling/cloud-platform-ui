import axios from '../utils/request'
import QS from 'qs'

const OAUTH_TOKEN='api/auth/uaa/oauth/token'
const LOAD_PAGED_DATA='api/platform/user/loadPageData'
const UPDATE_USER='api/platform/user/update'
const DELETE_USER='api/platform/user/delete'
const REGISTER_USER='api/platform/user/register'

export function login(data) {
    return axios({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: OAUTH_TOKEN,
        method: 'post',
        data: QS.stringify(data)
    })
}

export function loadPageData(data) {
    return axios({
        headers: {
            'Content-Type': 'application/json'
        },
        url: LOAD_PAGED_DATA,
        method: 'post',
        data: JSON.stringify(data)
    })
}

export function updateUser(user) {
    return axios({
        headers: {
            'Content-Type': 'application/json'
        },
        url: UPDATE_USER,
        method: 'post',
        data: user
    })
}

export function deleteUser(mobile) {
    return axios({
        headers: {
            'Content-Type': 'application/json'
        },
        url: DELETE_USER+'/'+mobile,
        method: 'delete',
    })
}

export function registerUser(user) {
    return axios({
        headers: {
            'Content-Type': 'application/json'
        },
        url: REGISTER_USER,
        method: 'post',
        data: user
    })
}
