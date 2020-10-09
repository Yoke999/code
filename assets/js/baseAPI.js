$.ajaxPrefilter(function (options) {
    // 在发起真正的Ajax请求之前，统一拼接请求根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;

    // 统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || "",
        }
    }
    options.complete = function (res) {
        if (res.responseJSON.status === 1) {
            // 清空本地token
            localStorage.removeItem('token');
            // 跳转值登录页面
            location.href = '/login.html';
        }
    }
})