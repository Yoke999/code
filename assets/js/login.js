$(function () {
    // 点击去注册的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 点击去登陆的链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })
    // 表单校验用户名
    //从layui中获取form对象
    var form = layui.form;
    form.verify({
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        , pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repass: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });
    var layer = layui.layer;
    // 监听注册表单的提交时间
    $('#form_reg').on('submit', function (e) {
        // 阻止默认的提交行为
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val(),
        }
        $.post('/api/reguser', data, function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message);
                // console.log(layermsg(res.message));
            }
            layer.msg('注册成功，请登录！');
            $('#link_login').click();
        })
    })
    // 监听登录表单的提交行为
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('登陆成功！');
                // 将登陆成功的字符串 token 存储到localstorage
                localStorage.setItem('token', res.token);
                // 跳转至后台页面
                location.href = '/index.html';
            }
        });
    })
})