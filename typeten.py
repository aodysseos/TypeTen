# 1 Import needed libraries
import cgi
import urllib
import random
import jinja2
import os


from google.appengine.ext import ndb
from google.appengine.api import users
import webapp2

#set jinja2 environment to connect html with python
jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__))))

#1 End

#2 Creates form for starting the game
MAIN_PAGE_FOOTER_TEMPLATE = """\
    <form action="/sign?%s" method="post">
      <div><h1>Type Ten game Launched!</h1></div>
      <div><input type="submit" value="Start the game"></div>
    </form>
  </body>
</html>
"""
#2 End

#3 Establishes initial parent key to group entities
DEFAULT_TYPETEN_NAME = 'default_typeten'

def typeten_key(typeten_name=DEFAULT_TYPETEN_NAME):
    return ndb.Key('Typeten', typeten_name)
#3 End

#4 - Sets model for data we're going to store, properties and attributes.
class Question(ndb.Model):
    question_key = ndb.Key('Question', 'id')
    _use_memcache = False
    content = ndb.StringProperty(required=True, indexed=False)

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
#4 End

#5 Creates MainPage content
class MainPage(webapp2.RequestHandler):
    def get(self):
        # to connect HTML with python variables
        template_values = {
        }
        # deal with static files
        template = jinja_environment.get_template('views/main.html')
        self.response.write(template.render(template_values))

        self.response.write('<html><body>')
        # Set variable for ancestor query, using name as the key
        typeten_name = self.request.get('typeten_name',DEFAULT_TYPETEN_NAME)


# Query to display all of the questions
        question_query = Question.query(
            ancestor=typeten_key(typeten_name))
        questions = question_query.fetch(10)

# Output data content
        for question in questions:
            self.response.write('<blockquote>%s</blockquote>' %
                                cgi.escape(question.content))


        # Output footer with typeten name and parameters
        sign_query_params = urllib.urlencode({'typeten_name': typeten_name})
        self.response.write(MAIN_PAGE_FOOTER_TEMPLATE % (sign_query_params))
#5 End

#6 Stores data
class Typeten_DataModel(webapp2.RequestHandler):
    # Uses same ancestor key
    def post(self):
        typeten_name = self.request.get('typeten_name',
                                        DEFAULT_TYPETEN_NAME)


        #User and Score table will be created and initialised when we create a login feature using gmail id.
        currentuser = users.get_current_user()
        if currentuser:
            user = GameUser(parent=typeten_key(typeten_name))
            user.username = currentuser.nickname()
            user_key = user.put()
            score = Score(parent=typeten_key(typeten_name))
            score.score = 0
            score.time = 0
            score.user_id = user_key.id()

        # Redirects to app root, with parameters
        query_params = {'typeten_name': typeten_name}
        self.redirect('/?' + urllib.urlencode(query_params))
#6 End

application = webapp2.WSGIApplication([
('/', MainPage),
('/sign', Typeten_DataModel),
], debug=True)