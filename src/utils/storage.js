// 封装本地存储操作模块
// 存储
export const setItem = (key, value) => {
    // 将数组, 对象类型的数据转换为JSON格式字符串
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    window.localStorage.setItem(key, value)
}
// 获取
export const getItem = key => {
    const data = window.localStorage.getItem(key)
    try {
        return JSON.parse(data)
    } catch (err) {
        return data
    }
}
// 删除
export const removeItem = key => {
    window.localStorage.removeItem(key)
}