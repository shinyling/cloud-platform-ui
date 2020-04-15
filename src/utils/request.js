import axios from 'axios';
import {Loading,Message} from "element-ui";

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    timeout: 5000
});

let loading

function startLoading(){
    loading=Loading.service({
        lock:true,
        text:'加载中……',
        background: 'rgba(0,0,0,0.7)'
    })
}

function endLoading(){
    loading.close();
}

service.interceptors.request.use(
    config => {
        startLoading()
        if(localStorage.token) {
            config.headers.Authorization = 'Bearer'+localStorage.token
        }
        return config;
    },
    error => {
        console.log(error);
        endLoading()
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        endLoading()
        //网络返回200
        if (response.status === 200) {
            //判断自定义两百
            let selfDefinition = response.data;
            //未进入自定义返回也许是oauth2登录
            if(!selfDefinition.code){
                return selfDefinition;
            }
            if(selfDefinition.code==200){
                return selfDefinition.data;
            }
            Message.error(selfDefinition.message);
        } else {
            Promise.reject();
        }
    },
    error => {
        endLoading()
        if(!error.response){
            console.log(error);
            return Promise.reject();
        }
        if(!error.response.status){
            console.log(error);
            return Promise.reject();
        }
        if(error.response.status === 401) {
            localStorage.removeItem("user_info")
            Message.warning("登陆失败或登录已失效!");
            this.$router.push('/login');
        }
        return Promise.reject();
    }
);

export default service;
