# 1 Import needed libraries
import cgi
import urllib
import random
import jinja2
import os
import json
import logging
logging.getLogger().setLevel(logging.DEBUG)
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

#Render new Game
class NewGame(webapp2.RequestHandler):
    @login_required
    def get(self):

        template = jinja_environment.get_template('main.html')
        self.response.write(template.render())


class AdminPage(webapp2.RequestHandler):
    #get all questions
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




#Handles answers retreival, inserts and updates
class ManageAnswer(webapp2.RequestHandler):
    #get answers for specific question
    def get(self):
        question_id = self.request.get('question_id')
        question = Question.get_by_id(int(question_id), parent=None)

        ans_json = [{'answer_id': str(a.key().id()),
                    'answer_content': a.content, 'answer_difficulty': a.answer_rating} for a in question.answers]

        self.response.out.write(json.dumps(ans_json))

    # insert new answer for question specified by id
    # or update an answer if an answer id is passed
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


class GetRandomQuestion(webapp2.RequestHandler):
    def get(self):
        ques_count = Question.all().count()
        offset = random.randrange(0, ques_count)
        question = Question.all().fetch(1, offset)[0]
        self.response.out.write(json.dumps([{'question_id': question.key().id(),
                                             'question_content': question.content}]))


class NewCompleteQuestion(webapp2.RequestHandler):
    def post(self):

        logging.info('post')
        logging.info(self.request.POST)
        logging.info(self.request.POST['question'])
        # Value for the question
        question_content = self.request.POST['question']
        question = Question(content=question_content)
        question.put()
        #Answers are the length - 1 and then divided by 2
        if len(self.request.POST) > 3:
            n_answers = (len(self.request.POST) - 1) / 2
            x = 1
            # Get answer value and answer rating
            while x <= n_answers:

                logging.info('X: ' + str(x) + 'Answer: ' + self.request.POST['answer_' + str(x)])
                logging.info('x: ' + str(x) + 'Rating: ' + self.request.POST['new_difficulty_answer_' + str(x)])
                # TODO: insert answer with rating
                answer_content = self.request.POST['answer_' + str(x)]
                answer_rating = self.request.POST['new_difficulty_answer_' + str(x)]

                answer = Answer(question=question,
                                content=answer_content,
                                answer_rating=answer_rating)
                answer.put()
                x += 1
        else:
            logging.info('Answer: ' + self.request.POST['answer_' + str(1)])
            logging.info('Rating: ' +self.request.POST['new_difficulty_answer_' + str(1)])

            answer_content = self.request.POST['answer_' + str(1)]
            answer_rating = self.request.POST['new_difficulty_answer_' + str(1)]

            answer = Answer(question=question,
                            content=answer_content,
                            answer_rating=answer_rating)
            answer.put()

        self.response.out.write(json.dumps([{'success': True,
                                             'message': 'The question with its answers has been saved.'}]))


application = webapp2.WSGIApplication([
('/', MainPage),
('/play',NewGame),
('/admin', AdminPage),
('/questions',ManageQuestion),
('/completeQuestion', NewCompleteQuestion),
('/answers',ManageAnswer),
('/check_ans',CheckAnswer),
('/random_ques',GetRandomQuestion)
], debug=True)