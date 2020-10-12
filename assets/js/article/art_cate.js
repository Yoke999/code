$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 获取文章数据
    initArtCateList();
    function initArtCateList () {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        });
    }
    // 为添加按钮添加点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        })
    })
    // 实现文章添加分类
    // 通过事件委托的方式为表单添加提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('添加文章类别失败！');
                initArtCateList();
                layer.msg('添加文章类别成功！');
                // 关闭弹出层
                layer.close(indexAdd);
            }
        });
    })
    // 通过事件委托给编辑按钮添加事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })
    // 通过事件委托的方式为表单添加提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('更新分类数据失败！');
                layer.msg('更新分类数据成功！');
                // 关闭弹出层
                layer.close(indexEdit);
                initArtCateList();
            }
        });
    })
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initArtCateList();
                }
            })
        })
    })
})