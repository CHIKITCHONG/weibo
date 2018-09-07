// 获取所有 weibo
var apiWeiboAll = function(callback) {
    var path = '/api/weibo/all'
    ajax('GET', path, '', callback)
//    r = ajax('GET', path, '', callback)
//    callback(r)
}

var apiWeiboDelete = function(weibo_id, callback) {
    var path = `/api/weibo/delete?id=${weibo_id}`
    ajax('GET', path, '', callback)
}

var apiWeiboUpdate = function(form, callback) {
    var path = '/api/weibo/update'
    ajax('POST', path, form, callback)
}

var apiWeiboAdd = function(form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}

var apiCommentDelete = function(comment_id, callback) {
    var path = `/api/comment/delete?id=${comment_id}`
    ajax('GET', path, '', callback)
}

var apiCommentUpdate = function(form, callback) {
    var path = '/api/comment/update'
    ajax('POST', path, form, callback)
}

var apiCommentAdd = function(form, callback) {
    var path = '/api/comment/add'
    ajax('POST', path, form, callback)
}

// insert handle
var insertcommentUpdateForm = function(title, commentCell) {
    var commentupdateForm = commentUpdateTemplate(title)
    commentCell.insertAdjacentHTML('beforeend', commentupdateForm)
}

var insertUpdateForm = function(title, weiboCell) {
    var updateForm = weiboUpdateTemplate(title)
    weiboCell.insertAdjacentHTML('beforeend', updateForm)
}

var insertWeibo = function(weibo) {
    var weiboCell = weiboTemplate(weibo)
    // 插入 weibo-list
    var weiboList = e('#id-weibo-list')
    weiboList.insertAdjacentHTML('beforeend', weiboCell)
}

var insertComment = function(weibo, local) {
    var weiboCell = addCommentTemplate(weibo)
    // 插入 weibo-list
    var weiboList = e('.comments-lists', local)
    weiboList.insertAdjacentHTML('beforeend', weiboCell)
}

// Templates
var commentTemplate = function (comments) {
    var comm = ''
    for(var i = 0; i < comments.length; i++){
        var comment = comments[i]
        var t = `
                <div class="weibo-comments" data-id="${comment.id}">
                    --评论内容--
                    <span class="comment-title">${comment.content}</span>                                                             
                    <button class="comment-edit">编辑评论</button>   
                    <button class="comment-delete">删除评论</button>      
                </div>
        `
        comm = comm += t
    }
    return comm
}

var addCommentTemplate = function (comment) {
    var k = `
            <div class="weibo-comments" data-id="${comment.id}">
                --评论内容--
                <span class="comment-title">${comment.content}</span>                                                             
                <button class="comment-edit">编辑评论</button>   
                <button class="comment-delete">删除评论</button>      
            </div>
        `
    return k
}

var weiboTemplate = function(weibo) {
// TODO DOM
    var u = commentTemplate(weibo.comments)
    var t = `
        <div class="weibo-cell" data-id="${weibo.id}">
            【微博内容】：
            <span class="weibo-title">${weibo.title}</span>
            <span>创建时间：${weibo.created_time}</span>
            <span>更新时间：${weibo.updated_time}</span>
            <button class="weibo-delete">删除</button>
            <button class="weibo-edit">编辑</button>
            <br>
            <input id='id-input-comment'">
            <button class='id-button-add-comment'>添加评论</button>
            <div class="comments-lists">
                ${u}
            </div>
        </div>
    `
    return t
}
String.prototype.format = function() {
 if(arguments.length == 0) return this;
 var param = arguments[0];
 var s = this;
 if(typeof(param) == 'object') {
  for(var key in param)
   s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
  return s;
 } else {
  for(var i = 0; i < arguments.length; i++)
   s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
  return s;
 }}
var bindEventCommentAdd = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('id-button-add-comment')) {
        log('点到了添加评论按钮')
        weiboCell = self.closest('.weibo-cell')
        weiboId = weiboCell.dataset['id']
        // var value = 'value={0}'.format(weiboId)
        log('**********************weiboid 是', weiboId)
        input = e('#id-input-comment', weiboCell)
        log('********************input here', input)
        content = input.value
        // var weiboSpan = e('.weibo-title', weiboCell)
        // var title = weiboSpan.innerText
        // 插入编辑输入框
        // insertUpdateForm(title, weiboCell)
        var form = {
            weibo_id: weiboId,
            content: content
        }
        apiCommentAdd(form, function (weibo) {
            // 收到返回的数据, 插入到页面中
            log('收到comment add ajax返回的函数')
            insertComment(weibo, weiboCell)

        })
        input.value = ''
    } else {
        log('点到了 weibo cell')
    }
})}

var weiboUpdateTemplate = function(title) {
// TODO DOM
    var t = `
        <div class="weibo-update-form">
            <input class="weibo-update-input" value="${title}">
            <button class="weibo-update">更新</button>
        </div>
    `
    return t
}

var commentUpdateTemplate = function(title) {
// TODO DOM
    var t = `
        <div class="comment-update-form">
            <input class="comment-update-input" value="${title}">
            <button class="comment-update">更新</button>
        </div>
    `
    return t
}

// 绑定事件
var bindEventCommentUpdate = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('comment-update')) {
        log('点到了更新按钮')
        commentCell = self.closest('.weibo-comments')
        commentId = commentCell.dataset['id']
        log('update comment id', commentId)
        input = e('.comment-update-input', commentCell)
        title = input.value
        var form = {
            id: commentId,
            title: title,
        }
        log('**************************here look!', form)
        apiCommentUpdate(form, function(comm) {
            // 收到返回的数据, 插入到页面中
            log('apiCommentUpdate', comm)
            if (comm.message != "不是匹配用户" ) {
                var commentSpan = e('.comment-title', commentCell)
                commentSpan.innerText = comm.content

                var updateForm = e('.comment-update-form', commentCell)
                updateForm.remove()
            } else {
                alert(comm.message)
                var updateForm = e('.comment-update-form', commentCell)
                updateForm.remove()
            }
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventCommentDelete = function() {
    var CommentList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    CommentList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('comment-delete')) {
        log('点到了评论删除按钮')
        commentId = self.parentElement.dataset['id']
        apiCommentDelete(commentId, function(r) {
            log('apiWeiboDelete', r.message)
            // 删除 self 的父节点
            if (r.message != "不是匹配用户") {
                commentCell = self.closest('.weibo-comments')
                commentCell.remove()
                // self.parentElement.remove()
                alert(r.message)
            } else {
                // self.parentElement.remove()
                alert(r.message)
            }
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventCommentEdit = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('comment-edit')) {
        log('点到了更新按钮')
        commentCell = self.closest('.weibo-comments')
        commentId = commentCell.dataset['id']
        var commentSpan = e('.comment-title', commentCell)
        var title = commentSpan.innerText
        // 插入编辑输入框
        insertcommentUpdateForm(title, commentCell)
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventWeiboAdd = function() {
    var b = e('#id-button-add')
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-weibo')
        var title = input.value
        log('click add', title)
        var form = {
            title: title,
        }
        apiWeiboAdd(form, function(weibo) {
            // 收到返回的数据, 插入到页面中
            insertWeibo(weibo)
        })
    })
}

var bindEventWeiboDelete = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-delete')) {
        log('点到了删除按钮')
        weiboId = self.parentElement.dataset['id']
        apiWeiboDelete(weiboId, function(r) {
            if (r.message != "不是匹配用户") {
                log('apiWeiboDelete', r.message)
                // 删除 self 的父节点
                self.parentElement.remove()
                alert(r.message)
                } else {
                alert(r.message)
            }
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventWeiboEdit = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-edit')) {
        log('点到了编辑按钮')
        weiboCell = self.closest('.weibo-cell')
        weiboId = weiboCell.dataset['id']
        var weiboSpan = e('.weibo-title', weiboCell)
        var title = weiboSpan.innerText
        // 插入编辑输入框
        insertUpdateForm(title, weiboCell)
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventWeiboUpdate = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-update')) {
        log('点到了更新按钮')
        weiboCell = self.closest('.weibo-cell')
        weiboId = weiboCell.dataset['id']
        log('update weibo id', weiboId)
        input = e('.weibo-update-input', weiboCell)
        title = input.value
        var form = {
            id: weiboId,
            title: title,
        }

        apiWeiboUpdate(form, function(weibo) {
            // 收到返回的数据, 插入到页面中
            if (weibo.message != "不是匹配用户") {
                log('apiWeiboUpdate', weibo)

                var weiboSpan = e('.weibo-title', weiboCell)
                weiboSpan.innerText = weibo.title

                var updateForm = e('.weibo-update-form', weiboCell)
                updateForm.remove()
            } else {
                alert(weibo.message)
                var updateForm = e('.weibo-update-form', weiboCell)
                updateForm.remove()
            }
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var loadWeibos = function() {
    // 调用 ajax api 来载入数据
    // weibos = api_weibo_all()
    // process_weibos(weibos)
    apiWeiboAll(function(weibos) {
        log('load all weibos', weibos)
        // 循环添加到页面中
        for(var i = 0; i < weibos.length; i++) {
            var weibo = weibos[i]
            insertWeibo(weibo)
        }
    })
}

var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
    bindEventCommentDelete()
    bindEventCommentEdit()
    bindEventCommentUpdate()
    bindEventCommentAdd()
}

var __main = function() {

    loadWeibos()
    bindEvents()
}

__main()
