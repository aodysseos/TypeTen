"""from google.appengine.ext import db


class Question(db.Model):
    content = db.StringProperty(required=True, indexed=False)


class AnswerRating(db.Model):
    description = db.StringProperty(required=True, indexed=False)
    points = db.IntegerProperty(required=True, indexed=False)


class Answer(db.Model):
    content = db.StringProperty(required=True, indexed=False)
    question_id = db.IntegerProperty(required=True)
    rating_id = db.IntegerProperty(required=True)


class GameUser(ndb.Model):
    username = ndb.StringProperty(required=True)


class Score(ndb.Model):
    score = ndb.IntegerProperty()
    time = ndb.IntegerProperty()
    user_id = ndb.IntegerProperty(required=True)
"""
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
    time = db.IntegerProperty()
    game_user = db.ReferenceProperty(GameUser, collection_name='scores')