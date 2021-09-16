import request from '../utils/request'
// import store from "@/store";

export const login = data => {
    console.log(data)
    return request({
        method: 'POST',
        url: '/v1_0/authorizations',
        data
    })
}
export const sendSms = mobile => {
    return request({
        method: 'get',
        url: `/v1_0/sms/codes/${mobile}`
    })
}
// 获取用户自己的个人信息
export const getUserInfo = () => {
    return request({
        method: 'get',
        url: '/v1_0/user'
        // headers: {
        //     // 该接口需要授权才能访问
        //     Authorization: `Bearer ${store.state.user.token}`
        // }
    })
}
// 获取用户个人频道
export const getUserChannels = () => {
    return request({
        method: 'get',
        url: '/v1_0/user/channels'
    })
}