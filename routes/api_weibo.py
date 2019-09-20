from flask import (
    jsonify,
    request,
    Blueprint,
)
import functools

from utils import log
from routes import (
    json_response,
    current_user,
    login_required,
    weibo_owner_required,
    comment_owner_reqiured,
)
from models.weibo import Weibo
from models.comment import Comment


weibo_api = Blueprint('weibo_api', __name__)


# 本文件只返回 json 格式的数据
# 而不是 html 格式的数据
@weibo_api.route('/api/weibo/all')
@login_required
def all():
    # weibos = Weibo.all_json()
    # return json_response(weibos)
    ms = Weibo.all()
    # 要转换为 dict 格式才行
    data = [m.json() for m in ms]
    return jsonify(data)


@weibo_api.route('/api/comment/add', methods=['POST'])
@login_required
def comment_add():
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里我们用新增加的 json 函数来获取格式化后的 json 数据
    form = request.get_json()
    # 创建一个 weibo
    u = current_user()
    t = Comment.add(form, u.id)
    # 把创建好的 weibo 返回给浏览器
    return jsonify(t.json())


@weibo_api.route('/api/weibo/add', methods=['POST'])
@login_required
def add():
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里我们用新增加的 json 函数来获取格式化后的 json 数据
    form = request.get_json()
    # 创建一个 weibo
    u = current_user()
    t = Weibo.add(form, u.id)
    # 把创建好的 weibo 返回给浏览器
    return jsonify(t.json())


@weibo_api.route('/api/comment/delete', methods=['GET'])
@login_required
@comment_owner_reqiured
def comment_delete():
    comment_id = int(request.args['id'])
    Comment.delete(comment_id)
    d = dict(
        message="成功删除 comment"
    )
    return jsonify(d)


@weibo_api.route('/api/weibo/delete', methods=['GET'])
@login_required
@weibo_owner_required
def delete():
    weibo_id = int(request.args['id'])
    Weibo.delete(weibo_id)
    Comment.all_delete(weibo_id)
    d = dict(
        message="成功删除 weibo"
    )
    return jsonify(d)


@weibo_api.route('/api/comment/update', methods=['POST'])
@login_required
@comment_owner_reqiured
def comment_update():
    form = request.get_json()
    log('api comment update form', form)
    t = Comment.update(form)
    return jsonify(t.json())


@weibo_api.route('/api/weibo/update', methods=['POST'])
@login_required
@weibo_owner_required
def update():
    """
    用于增加新 weibo 的路由函数
    """
    form = request.get_json()
    log('****************************************api weibo update form', form)
    t = Weibo.update(form)
    return jsonify(t.json())


# def route_dict():
#     d = {
#         '/api/weibo/all': all,
#         '/api/weibo/add': add,
#         '/api/weibo/delete': delete,
#         '/api/weibo/update': update,
#         # comment
#         '/api/comment/add': comment_add,
#         '/api/comment/delete': comment_delete,
#         '/api/comment/update': comment_update,
#     }
#     return d


# def comment_owner_reqiured(route_function):
#     def f(request):
#
#         log('same_user_required')
#         u = current_user(request)
#
#         if 'id' in request.query:
#             weibo_id = request.query['id']
#         else:
#             # request = request.json()
#             weibo_id = request.json()['id']
#         t = Comment.find_by(id=int(weibo_id))
#         weibo_id = t.weibo_id
#         s = Weibo.find_by(id=int(weibo_id))
#         if t.user_id == u.id or s.user_id == u.id:
#             return route_function(request)
#         else:
#             d = dict(
#                 message="不是匹配用户"
#             )
#             return json_response(d)
#     return f


# def weibo_owner_required(route_function):
#
#     # @functools.wraps(route_function)
#     def f():
#         log('same_user_required')
#         u = current_user()
#         if 'id' in request.args:
#             weibo_id = request.args['id']
#         else:
#             weibo_id = request.get_json()['id']
#             # id = request.json()
#         weibo = Weibo.find_by(id=int(weibo_id))
#         # 存在这个用户的微博
#         if weibo.user_id == u.id:
#             return route_function()
#         else:
#             d = dict(
#                 message="不是匹配用户"
#             )
#             return jsonify(d)
#     return f

# api_weibo下的route_dict


# def route_dict():
#     d = {
#         # weibo
#         '/api/weibo/all': login_required(all),
#         '/api/weibo/add': login_required(add),
#         '/api/weibo/delete': login_required(weibo_owner_required(delete)),
#         '/api/weibo/update': login_required(weibo_owner_required(update)),
#         # comment
#         '/api/comment/update': login_required(comment_owner_reqiured(comment_update)),
#         '/api/comment/add': login_required(comment_add),
#         '/api/comment/delete': login_required(comment_owner_reqiured(comment_delete)),
#     }
#     return d

