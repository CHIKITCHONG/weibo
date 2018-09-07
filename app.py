from flask import Flask

from routes.routes_public import public
from routes.routes_user import user
from routes.api_weibo import weibo_api
from routes.routes_newweibo import weibo
# 运行服务器


def configured_app():
    app = Flask(__name__)
    app.register_blueprint(public)
    app.register_blueprint(user)
    app.register_blueprint(weibo_api)
    app.register_blueprint(weibo)
    print('url_map', app.url_map)
    return app


if __name__ == '__main__':
    # 先要初始化一个 Flask 实例
    # debug 模式可以自动加载你对代码的变动, 所以不用重启程序
    # host 参数指定为 '0.0.0.0' 可以让别的机器访问你的代码
    # app = Flask(__name__)
    app = configured_app()
    config = dict(
        debug=True,
        host='localhost',
        port=3000,
    )
    app.run(**config)
