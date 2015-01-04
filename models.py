from google.appengine.ext import db

'''
Entity classes used to application data
'''


class Question(db.Model):
    content = db.StringProperty(required=True, indexed=False)


class Answer(db.Model):
    content = db.StringProperty(required=True, indexed=False)
    question = db.ReferenceProperty(Question, collection_name='answers')
    answer_rating = db.StringProperty(choices=('low', 'medium', 'high'))


class UserGame(db.Model):
    score = db.IntegerProperty()
    user_nickname = db.StringProperty()
    game_id = db.StringProperty()
