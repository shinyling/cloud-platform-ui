import axios from '../utils/request'

const LOAD_IS_LOCK='api/platform/select/isLock'
const LOAD_IS_PARENT='api/platform/select/isParent'

export function loadIsLock() {
    return axios({
        headers: {
            'Content-Type': 'application/json'
        },
        url: LOAD_IS_LOCK,
        method: 'get',
    })
}

export function loadIsParent() {
    return axios({
        headers: {
            'Content-Type': 'application/json'
        },
        url: LOAD_IS_PARENT,
        method: 'get',
    })
}
