# 1 Import needed libraries
import cgi
import urllib
import random
import json
import jinja2
import os

from google.appengine.api import users
import webapp2
from decorators import admin_required
from google.appengine.ext import ndb
from random import randint

#set jinja2 environment to connect html with python
jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__),
                                                                                   'views')))


# Sets model for data we're going to store, properties and attributes.
class Question(ndb.Model):
    _use_memcache = False
    content = ndb.StringProperty(required=True, indexed=True)
    number = ndb.IntegerProperty(required=True, indexed=True)


class Answer_rating(ndb.Model):
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
#End


#Initialises the tables
class InitialiseDatabase(webapp2.RequestHandler):
    def get(self):
       question = Question()
       question.content = "What are the highlights of France?"
       question.number = 1
       question_key=question.put()

       answer_rating1 = Answer_rating()
       answer_rating1.description='low'
       answer_rating1.points=5
       answer_rating1_key=answer_rating1.put()

       answer_rating2 = Answer_rating()
       answer_rating2.description='medium'
       answer_rating2.points=8
       answer_rating2_key=answer_rating2.put()

       answer_rating3 = Answer_rating()
       answer_rating3.description='high'
       answer_rating3.points=10
       answer_rating3_key=answer_rating3.put()

       answer1 = Answer()
       answer1.content = 'Eiffel Tower'
       answer1.question_id = question.number
       answer1.rating_id = answer_rating1_key.id()
       answer1.put()

       answer2 = Answer()
       answer2.content='Disneyland Paris'
       answer2.question_id=question.number
       answer2.rating_id=answer_rating2_key.id()
       answer2.put()

       answer3 = Answer()
       answer3.content='Mont Blanc'
       answer3.question_id=question.number
       answer3.rating_id=answer_rating3_key.id()
       answer3.put()
       self.redirect('/MainPage')


#Creates MainPage content
class MainPage(webapp2.RequestHandler):
    def get(self):

        current_user = users.get_current_user()
        if current_user:

            url = users.create_logout_url(self.request.uri)
            url_text = 'Logout'
        else:

            url = users.create_login_url(self.request.uri)
            url_text = 'Login'

        template_values = {
            'url': url,
            'url_text': url_text,
            'is_admin': users.is_current_user_admin()
        }
        # deal with static files
        template = jinja_environment.get_template('draft.html')
        self.response.write(template.render(template_values))


class NewGame(webapp2.RequestHandler):

    def get(self):
        # Query to retrieve a particular question using random number generator
        rand = randint(1, 4)
        qry = Question.query(Question.number == rand).get()

        template_values = {
            'question': qry.content
        }

        template = jinja_environment.get_template('game.html')
        self.response.write(template.render(template_values))


class AdminPage(webapp2.RequestHandler):
    @admin_required
    def get(self):
        template = jinja_environment.get_template('admin_draft.html')
        self.response.write(template.render())


application = webapp2.WSGIApplication([
('/', InitialiseDatabase),
('/MainPage', MainPage),
('/game.html',NewGame),
('/admin_draft.html',AdminPage)
], debug=True)