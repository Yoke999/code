$(function () {
    //调用getUserInfo函数获取用户基本信息
    getUserInfo();
})

/**封装getUserInfo函数*/
function getUserInfo () {
    $.ajax({
        type: "get",
        url: "/my/userinfo",
        success: function (res) {
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败！');
            renderAvatar(res.data);
        }
    });
}

/** 渲染用户头像*/
function renderAvatar (user) {
    // console.log(user);

    // 获取用户名称
    var name = user.nickname || user.username;
    // 设置欢迎的文本
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 按需渲染用户图片头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 按需渲染用户文字头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}

// 实现退出功能
var layer = layui.layer;
$('#btnLogout').on('click', function (e) {
    e.preventDefault();
    // 提示用户是否确认退出
    layer.confirm("确认退出登录？", { icon: 3, title: '提示' }, function () {
        // 清除本地存储中的token
        localStorage.removeItem('token');
        // 回退到登陆界面
        location.href = '/login.html';
        // 关闭询问框
        layer.close(index);
    })
})