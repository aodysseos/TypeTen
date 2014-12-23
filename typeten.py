# 1 Import needed libraries
import cgi
import urllib
import random
import jinja2
import os


from models import *
from google.appengine.api import users
import webapp2
from decorators import admin_required

#set jinja2 environment to connect html with python
jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__),
                                                                                   'views')))


#3 Establishes initial parent key to group entities
DEFAULT_TYPETEN_NAME = 'default_typeten'


def typeten_key(typeten_name=DEFAULT_TYPETEN_NAME):
    return ndb.Key('Typeten', typeten_name)


#5 Creates MainPage content
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


#6 Stores data
class TypetenDataModel(webapp2.RequestHandler):
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


class AdminPage(webapp2.RequestHandler):
    @admin_required
    def get(self):
        template = jinja_environment.get_template('admin_draft.html')
        self.response.write(template.render())


application = webapp2.WSGIApplication([
('/', MainPage),
('/admin', AdminPage)
], debug=True)