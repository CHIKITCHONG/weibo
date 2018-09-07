from flask import (
    Blueprint,
    render_template,
)

from models.weibo import Weibo
from routes import (
    redirect,
    # GuaTemplate,
    current_user,
    # html_response,
    login_required,
)
from utils import log


weibo = Blueprint('weibo', __name__)


@weibo.route('/weibo/index')
@login_required
def index():
    """
    weibo 首页的路由函数
    """
    return render_template('weibo_new.html')
    # return html_response(body)


def same_user_required(route_function):
    """
    这个函数看起来非常绕，所以你不懂也没关系
    就直接拿来复制粘贴就好了
    """

    def f(request):
        log('same_user_required')
        u = current_user(request)
        if 'id' in request.query:
            weibo_id = request.query['id']
        else:
            weibo_id = request.form()['id']
        t = Weibo.find_by(id=int(weibo_id))

        if t.user_id == u.id:
            return route_function(request)
        else:
            return redirect('/weibo/index')

    return f


