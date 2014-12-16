__author__ = 'alkaabi'


from google.appengine.ext import db
from google.appengine.api import users

import webapp2
import os
import jinja2

jinja_env = jinja2.Environment(autoescape=True,
                               loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))


class Question(db.Model):
    content = db.StringProperty(required=True)


class AnswerRating(db.Model):
    description = db.StringProperty(required=True)
    points = db.IntegerProperty(required=True)


class Answer(db.Model):
    content = db.StringProperty(required=True)
    question = db.ReferenceProperty(Question, collection_name='answers')
    rating = db.ReferenceProperty(AnswerRating, collection_name='ratings')


class User(db.Model):
    email = db.StringProperty(required=True)
    role = db.StringProperty(required=True,
                             choices=set(['player', 'admin']))


class Score(db.Model):
    score = db.IntegerProperty()
    time = db.IntegerProperty()
    user = db.ReferenceProperty(User, collection_name='scroes')


class MainPage(webapp2.RequestHandler):
    def get(self):

        template = jinja_env.get_template('index.html')
        self.response.write(template.render())

        question1 = Question(content='What are the highlights of France?')
        question1.put()

        answer_rating1 = AnswerRating(description='low', points=5)
        answer_rating1.put()
        answer_rating2 = AnswerRating(description='medium', points=6)
        answer_rating2.put()
        answer_rating3 = AnswerRating(description='high', points=8)
        answer_rating3.put()

        answer1 = Answer(content='Eiffel Tower', question=question1, rating=answer_rating1)
        answer1.put()

        answer2 = Answer(content='Disneyland Paris', question=question1, rating=answer_rating2)
        answer2.put()

        answer3 = Answer(content='Mont Blanc', question=question1, rating=answer_rating3)
        answer3.put()

class AdminPage(webapp2.RequestHandler):
    def get(self):
        template = jinja_env.get_template('admin.html')
        self.response.write(template.render())



app = webapp2.WSGIApplication([
                            ('/',MainPage),
                            ('/admin',AdminPage)
                            ], debug=True)