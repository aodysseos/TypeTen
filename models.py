from google.appengine.ext import ndb


class Question(ndb.Model):
    question_key = ndb.Key('Question', 'id')
    _use_memcache = False
    content = ndb.StringProperty(required=True, indexed=False)


class AnswerRating(ndb.Model):

    _use_memcache = False
    description = ndb.StringProperty(required=True, indexed=False)
    points = ndb.IntegerProperty(required=True, indexed=False)


class Answer(ndb.Model):
    _use_memcache = False
    content = ndb.StringProperty(required=True, indexed=False)
    question_id = ndb.IntegerProperty(required=True)
    rating_id = ndb.IntegerProperty(required=True)


class GameUser(ndb.Model):
    username = ndb.StringProperty(required=True)


class Score(ndb.Model):
    score = ndb.IntegerProperty()
    time = ndb.IntegerProperty()
    user_id = ndb.IntegerProperty(required=True)
