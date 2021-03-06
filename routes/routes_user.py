from urllib.parse import unquote_plus

from flask import (
    Blueprint,
    request,
    current_app,
    url_for,
    render_template,
    redirect,
)

from models.session import Session
from routes import (
    # GuaTemplate,
    current_user,
    # html_response,
    random_string,
    # redirect
)

from utils import log
from models.user import User


# 不要这么 import
# from xx import a, b, c, d, e, f
user = Blueprint('user', __name__)


@user.route('/user/login', methods=['POST'])
def login():
    """
    登录页面的路由函数
    """
    form = request.form

    u, result = User.login(form)
    # session 会话
    # token 令牌
    # 设置一个随机字符串来当令牌使用
    session_id = random_string()
    form = dict(
        session_id=session_id,
        user_id=u.id,
    )
    Session.new(form)
    redirect_to_index = redirect(
        url_for('user.login_view', result=result)
    )
    response = current_app.make_response(redirect_to_index)
    response.set_cookie('session_id', value=session_id)
    return response


@user.route('/user/login/view', methods=['GET'])
def login_view():
    u = current_user()
    result = request.args.get('result', '')
    result = unquote_plus(result)

    return render_template(
        'login.html',
        username=u.username,
        result=result,
    )


@user.route('/user/register', methods=['POST'])
def register():
    """
    注册页面的路由函数
    """
    form = request.form

    u, result = User.register(form.to_dict())
    log('register post', result)
    return redirect(
        url_for('user.register_view', result=result)
    )


@user.route('/user/register/view', methods=['GET'])
def register_view():
    result = request.args.get('result', '')
    result = unquote_plus(result)

    return render_template('register.html', result=result)

