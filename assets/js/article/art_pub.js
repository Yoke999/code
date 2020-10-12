$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 获取文章分类列表
    initCate();
    function initCate () {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) return layer.msg('初始化文章分类列表失败！');

                // 调用模板引擎渲染分类列表
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        });
    }
    // 初始化富文本编辑器
    initEditor();
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 为选择封面按钮添加点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    // 监听coverFile的change事件，获取用户提交的文件列表
    $('#coverFile').on('change', function (e) {
        var files = e.target.files;
        // 判断用户是否上传文件
        if (files.length === 0) {
            return
        }
        var file = e.target.files[0];
        // 根据文件创建对应的url
        var newImgUrl = URL.createObjectURL(file);
        // 为裁剪区域重新设置照片
        $image.cropper('destroy').attr('src', newImgUrl).cropper(options);
    })
    var art_state = '已发布';
    $('btnSave2').on('click', function () {
        art_state = '草稿';
    })
    // 定义发表文章的方法
    function publishArticle (fd) {
        $.ajax({
            type: "Post",
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) return layer.msg('发表文章失败！');
                layer.msg('发表文章成功！');
                // 发表完文章之后跳转至文章列表页面
                location.href = '/article/art_list.html';
                // console.log(window.parent);
                
            }
        });
    }
    // 为表单注册提交事件
    $('#form-pub').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 基于form表单建立一个formData对象
        var fd = new FormData($(this)[0]);
        // 将文章状态信息添加到fd中
        fd.append('state', art_state);
        // 将才见过的封面输出为一个文件对象
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(function (blob) {
            fd.append('cover_img', blob);
            publishArticle(fd);
        })

    })

})