# 1 Import needed libraries
import cgi
import urllib
import random
import jinja2
import os
import json
#from webapp2_extras import json


from models import *
from google.appengine.api import users
import webapp2
from decorators import admin_required
from google.appengine.ext.webapp.util import login_required

#set jinja2 environment to connect html with python
jinja_environment = jinja2.Environment(autoescape=True,
                                       loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__),
                                                                                   'templates')))



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


class AdminPage(webapp2.RequestHandler):
    #get the all questions
    @admin_required
    def get(self):
        questions = Question.all()
        template_values = {'questions': questions}
        template = jinja_environment.get_template('admin_draft.html')
        self.response.write(template.render(template_values))

#handles questions inserts and updates
class ManageQuestion(webapp2.RequestHandler):
    #get question based on id and return a json object
    def get(self):
        question_id = self.request.get('question_id')
        question = Question.get_by_id(int(question_id), parent=None)
        que_json = [{'question_id': str(question.key().id()),
                    'question_content': question.content}]

        self.response.out.write(json.dumps(que_json))

    #Insert or Update Question
    #If question_id is passed, it updated, otherwise its an update
    def post(self):
        question_id = self.request.get('question_id')
        question_content = self.request.get('question_content')

        #if question id exists then update
        if question_id:
            question = Question.get_by_id(int(question_id), parent=None)
            question.content = question_content
        #Otherwsie create new instance of question
        else:
            question = Question(content=question_content)

        question.put()
        que_id = question.key().id()
        self.response.out.write(json.dumps([{'qustion_id': que_id}]))



    '''
    def delete(self):
        question_id = self.request.get('question_id')
        question = Question.get_by_id(int(question_id), parent=None)
        question.delete()
    '''


#Render new Game
class NewGame(webapp2.RequestHandler):
    @login_required
    def get(self):

        template = jinja_environment.get_template('main.html')
        self.response.write(template.render())


#Handles answers retreival, inserts and updates
class ManageAnswer(webapp2.RequestHandler):
    #get answers for specific question
    def get(self):
        question_id = self.request.get('question_id')
        question = Question.get_by_id(int(question_id), parent=None)

        ans_json = [{'answer_id': str(a.key().id()),
                    'answer_content': a.content} for a in question.answers]

        self.response.out.write(json.dumps(ans_json))

    # insert new answer for question specified by id
    def post(self):

        question_id = self.request.get('question_id')
        question = Question.get_by_id(int(question_id), parent=None)

        answer_id = self.request.get('answer_id')
        answer_content = self.request.get('answer_content')
        answer_rating = self.request.get('answer_rating')

        if answer_id:
            answer_obj = Answer.get_by_id(int(answer_id), parent=None)
            answer_obj.content = answer_content
        else:
            answer = Answer(question=question,
                            content=answer_content,
                            answer_rating=answer_rating)
        answer.put()
        ans_id = answer.key().id()
        self.response.out.write(json.dumps([{'answer_id': ans_id}]))

    '''
    def delete(self):
        answer_id = self.request.get('answer_id')
        answer = Answer.get_by_id(int(answer_id), parent=None)
        answer.delete()
    '''


class CheckAnswer(webapp2.RequestHandler):
    def post(self):

        question_id = self.request.get('question_id')
        user_answer = self.request.get('user_answer').lower()

        question = Question.get_by_id(int(question_id), parent=None)

        if not question:
            webapp2.abort(404)

        for a in question.answers:
            if a.content.lower().find(user_answer, 0, len(a.content)) != -1:
                self.response.out.write(json.dumps([{'found': 'yes'}]))
                return
            else:
                continue
        self.response.out.write(json.dumps([{'found': 'no'}]))




application = webapp2.WSGIApplication([
('/', MainPage),
('/play',NewGame),
('/admin', AdminPage),
('/questions',ManageQuestion),
('/answers',ManageAnswer),
('/check_ans',CheckAnswer)
], debug=True)