from google.appengine.ext import db


class Question(db.Model):
    content = db.StringProperty(required=True, indexed=False)


class Answer(db.Model):
    content = db.StringProperty(required=True, indexed=False)
    question = db.ReferenceProperty(Question, collection_name='answers')
    answer_rating = db.StringProperty(choices=('low', 'medium', 'high'))


class GameUser(db.Model):
    nickname = db.StringProperty(required=True, indexed=False)


class UserScore(db.Model):
    score = db.IntegerProperty()
    user_nickname = db.StringProperty()
    game_id = db.StringProperty()
