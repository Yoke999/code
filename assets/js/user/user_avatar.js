$(function () {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    // 给上传按钮注册点击事件
    $('#btnChoseImg').on('click', function () {
        $('#file').click();
    })
    // 为文件选择框注册change事件
    $('#file').on('change', function (e) {
        // 获取用户要上传的图片
        var filelsit = e.target.files;
        if (filelsit.length == 0) {
            return layer.msg('请选择要上传的文件！');
        }
        // 拿到图片
        var file = e.target.files[0];
        // 将文件转化为路径
        var imgURL = URL.createObjectURL(file);
        // 将图片路径进行替换
        $image.cropper('destroy').attr('src', imgURL).cropper(options);
    })
    // 将新头像上传到服务器
    $('#btnUpload').on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL,
            },
            success: function (res) {
                if (res.status !== 0) return layer.msg('上传头像失败！');
                layer.msg('上传头像成功！');
                window.parent.getUserInfo();
            }
        });
    })
})