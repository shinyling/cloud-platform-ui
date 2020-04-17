import axios from '../utils/request'

const MENU_LOAD_PAGED_DATA='api/platform/menu/loadPage'
const MENU_LOAD_PARENT='api/platform/menu/loadParent'
const MENU_SAVE='api/platform/menu/add'
const MENU_EDIT='api/platform/menu/update'
const MENU_DELETE='api/platform/menu/delete'
const MENU_TREE='api/platform/menu/menuTree'

export function loadTree(){
    return axios({
        headers: {
            'Content-Type': 'application/json'
        },
        url: MENU_TREE,
        method: 'get'
    })
}

export function loadPageData(data){
    return axios({
        headers: {
            'Content-Type': 'application/json'
        },
        url: MENU_LOAD_PAGED_DATA,
        method: 'post',
        data: data
    })
}
export function loadParent() {
    return axios({
        headers: {
            'Content-Type': 'application/json'
        },
        url: MENU_LOAD_PARENT,
        method: 'get',
    })
}
export function addMenu(data){
    return axios({
        headers: {
            'Content-Type': 'application/json'
        },
        url: MENU_SAVE,
        method: 'post',
        data: data
    })
}
export function editMenu(data){
    return axios({
        headers: {
            'Content-Type': 'application/json'
        },
        url: MENU_EDIT,
        method: 'post',
        data: data
    })
}

export function deleteMenu(id){
    return axios({
        headers: {
            'Content-Type': 'application/json'
        },
        url: MENU_DELETE+'/'+id,
        method: 'delete',
    })
}
