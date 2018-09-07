# from models import Model
# from models.comment import Comment
#
#
# class Weibo(Model):
#     """
#     微博类
#     """
#     def __init__(self, form):
#         super().__init__(form)
#         self.content = form.get('content', '')
#         # 和别的数据关联的方式, 用 user_id 表明拥有它的 user 实例
#         self.user_id = form.get('user_id', None)
#
#     @classmethod
#     def add(cls, form, user_id):
#         w = Weibo(form)
#         w.user_id = user_id
#         w.save()
#
#     @classmethod
#     def update(cls, form):
#         weibo_id = int(form['id'])
#         w = Weibo.find_by(id=weibo_id)
#         w.content = form['content']
#         w.save()
#
#     def comments(self):
#         cs = Comment.find_all(weibo_id=self.id)
#         return cs

import time

from models import Model
from models.comment import Comment

class Weibo(Model):
    """
    针对我们的数据 TODO
    我们要做 4 件事情
    C create 创建数据
    R read 读取数据
    U update 更新数据
    D delete 删除数据

    Weibo.new() 来创建一个 weibo
    """

    def __init__(self, form):
        super().__init__(form)
        self.title = form.get('title', '')
        # 和别的数据关联的方式, 用 user_id 表明拥有它的 user 实例
        self.user_id = form.get('user_id', None)
        self.created_time = form.get('created_time', -1)
        self.updated_time = form.get('updated_time', -1)

    @classmethod
    def add(cls, form, user_id):
        t = Weibo(form)
        t.user_id = user_id
        t.created_time = int(time.time())
        t.updated_time = t.created_time
        t.save()

        return t

    @classmethod
    def update(cls, form):
        weibo_id = int(form['id'])
        t = Weibo.find_by(id=weibo_id)
        t.title = form['title']
        t.updated_time = int(time.time())
        t.save()
        return t

    def json(self):
        d = self.__dict__.copy()
        # 拿到对应weiboid的所有评论,拿到所有weibo的comment
        comments = [c.json() for c in self.comments()]   # 字典再挂靠['comments']
        d['comments'] = comments
        return d

    def comments(self):
        return Comment.find_all(weibo_id=self.id)
