$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 设置一个查询的参数对象请求数据时像服务器发送
    var q = {
        pagenum: '1', //默认在第一页
        pagesize: '2', //一页存在两条数据
        cate_id: '', //文章分类的id
        state: '', //文章的状态信息
    }
    // 定义渲染分页的方法
    function renderPage (total) {
        console.log(total);
        // 调用laypage.render()方法渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //从服务器获取的数据数目
            limit: q.pagesize, //每页的数据条数
            curr: q.pagenum, //设置起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //设置展示出来的样式
            limits: [2, 3, 5, 10], //设置每页展示多少条数据
            jump: function (obj, first) {
                // 将最新的页码数赋值给q
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
                // initTable();
            }
        })
    }
    // 请求文章列表数据
    initTable();
    function initTable () {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);

                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res);

                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        });
    }
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    // 封装去0函数
    function padZero (n) {
        return n > 9 ? n : '0' + n;
    }
    // 请求获得文章分类选项 初始化文章分类的方法
    initCate();
    function initCate () {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                var htmlStr = template('tpl-cate', res);
                $('[name="cate_id"]').html(htmlStr);
                // 通过layui重新渲染表单结构
                form.render('select');
            }
        });
    }
    // 为表单注册提交事件实现筛选功能
    $('#form-search').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })
    // 利用时间委托为删除按钮添加事件
    var index = null;
    $('tbody').on('click', '.btn-delete', function () {
        // 获取到文章的id
        var id = $(this).attr('data-id');
        // 获取删除文章按钮个数
        var len = $('.btn-delete').length;
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg('删除文章失败！');
                    layer.msg('删除文章成功！');
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        })
    })
})