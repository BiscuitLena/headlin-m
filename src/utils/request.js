import axios from "axios"
import store from "@/store"

const request = axios.create({
    // baseURL: "http://ttapi.research.itcast.cn/"
    baseURL: "http://toutiao-app.itheima.net"
})
// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
    // Do something before request is sent
    // config ：本次请求的配置对象
    // config 里面有一个属性：headers
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    // console.log(config)
    // 注意:这里务必要返回config配置对象,否则请求就停在这里出不去了
    return config
}, function (error) {
    // Do something with request error
    return Promise.reject(error)
})
// 响应拦截器
export default request