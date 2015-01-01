# 1 Import needed libraries
import cgi
import urllib
import random
import jinja2
import os
import json
from google.appengine.ext import db
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
    @admin_required
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

        if question_id:
            self.response.out.write(json.dumps({'success': True,
                                                'message': 'The question has been updated.', 'question_id': que_id}))
        else:
            self.response.out.write(json.dumps({'success': True,
                                                'message': 'A question has been created.', 'question_id': que_id}))


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
    @admin_required
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
            answer_obj = Answer(question=question,
                                content=answer_content,
                                answer_rating=answer_rating)
        answer_obj.put()
        ans_id = answer_obj.key().id()

        if answer_id:
            self.response.out.write(json.dumps({'success': True,
                                                'message': 'The answer has been updated.', 'answer_id': ans_id}))
        else:
            self.response.out.write(json.dumps({'success': True,
                                                'message': 'A new answer has been created.', 'answer_id': ans_id}))


class CheckAnswer(webapp2.RequestHandler):
    def post(self):

        question_id = self.request.get('question_id')
        user_answer = self.request.get('user_answer').lower()

        question = Question.get_by_id(int(question_id), parent=None)

        if not question:
            webapp2.abort(404)

        for a in question.answers:
            if a.content.lower().find(user_answer, 0, len(a.content)) != -1:
                self.response.out.write(json.dumps({'found': 'yes', 'actual_answer': a.content,
                                                     'rating': a.answer_rating}))
                return
            else:
                continue
        self.response.out.write(json.dumps({'found': 'no'}))


class GetRandomQuestion(webapp2.RequestHandler):
    def get(self):
        ques_count = Question.all().count()
        offset = random.randrange(0, ques_count)
        question = Question.all().fetch(1, offset)[0]
        self.response.out.write(json.dumps([{'question_id': question.key().id(),
                                             'question_content': question.content}]))


# to delete question and its answers
class DeleteQuestion(webapp2.RequestHandler):
    @admin_required
    def post(self):
        question_id = self.request.get('question_id')
        question = Question.get_by_id(int(question_id), parent=None)

        #check if question exists
        if not question:
            webapp2.abort(404)
            self.response.out.write(json.dumps({'success': False,
                                                'message': 'The question was not deleted.'}))
        #delete answers first
        for answer in question.answers:
            answer.delete()

        question.delete()
        self.response.out.write(json.dumps({'success': True,
                                            'message': 'The question has been deleted.'}))


# to delete an answer
class DeleteAnswer(webapp2.RequestHandler):
    @admin_required
    def post(self):
        answer_id = self.request.get('answer_id')
        answer = Answer.get_by_id(int(answer_id), parent=None)

        #check if answer exists
        if not answer:
            webapp2.abort(404)
            self.response.out.write(json.dumps({'success': False,
                                                'message': 'The answer was not deleted.'}))
        else:
            answer.delete()
            self.response.out.write(json.dumps({'success': True,
                                                'message': 'The answer has been deleted.'}))


class NewCompleteQuestion(webapp2.RequestHandler):
    @admin_required
    def post(self):

        question_content = self.request.POST['question']
        question = Question(content=question_content)
        question.put()
        #Answers are the length - 1 and then divided by 2
        if len(self.request.POST) > 3:
            n_answers = (len(self.request.POST) - 1) / 2
            x = 1
            # Get answer value and answer rating
            while x <= n_answers:

                # TODO: insert answer with rating
                answer_content = self.request.POST['answer_' + str(x)]
                answer_rating = self.request.POST['new_difficulty_answer_' + str(x)]

                answer = Answer(question=question,
                                content=answer_content,
                                answer_rating=answer_rating)
                answer.put()
                x += 1
        else:

            answer_content = self.request.POST['answer_' + str(1)]
            answer_rating = self.request.POST['new_difficulty_answer_' + str(1)]

            answer = Answer(question=question,
                            content=answer_content,
                            answer_rating=answer_rating)
            answer.put()

        self.response.out.write(json.dumps([{'success': True,
                                             'message': 'The question with its answers has been saved.'}]))


class SaveScore(webapp2.RequestHandler):
    def post(self):

        game_id = self.request.get('game_id')
        score_number = self.request.get('score_number')
        current_user = users.get_current_user().nickname()

        user_score = UserScore(score=score_number,
                               user_nickname=current_user,
                               game_id=game_id)

        user_score.put()
        self.response.out.write(json.dumps([{'success': True,
                                             'message': 'Score has been saved'}]))


class GetQuestions(webapp2.RequestHandler):
    def get(self):
        ques_count = Question.all().count()
        logging.info(ques_count)
        if ques_count <= 10:
            x = 1
            for question in Question.all():
                logging.info(question.key().id())

            logging.info("offset 1")
            q = db.GqlQuery("SELECT * FROM Question OFFSET 1")
            question = q.get()
            logging.info(question.key().id())
            logging.info("offset 2")
            q = db.GqlQuery("SELECT * FROM Question OFFSET 2")
            question = q.get()
            logging.info(question.key().id())
        else:
            offset = random.randrange(0, ques_count)
            question = Question.all().fetch(1, offset)[0]
            self.response.out.write(json.dumps([{'question_id': question.key().id(),
                                             'question_content': question.content}]))

class GetQuestion(webapp2.RequestHandler):
    def get(self):
        offset =  int(self.request.get('offset'))
        logging.info(offset);
        if offset > -1:
            q = db.GqlQuery("SELECT * FROM Question OFFSET " +  str(offset))
            logging.info(q);
            question = q.get()
            logging.info(question.key().id())
            self.response.out.write(json.dumps({'success': True, 'question_id': question.key().id(),
                                             'question_content': question.content}))
        else:
            self.response.out.write(json.dumps({'success': False}))

class GetOffset(webapp2.RequestHandler):
    def get(self):
        ques_count = Question.all().count()
        logging.info(ques_count)
        if ques_count <= 10:
            self.response.out.write(json.dumps({'offset': 0}))
        else:
            limit = ques_count - 10
            offset = random.randrange(0, limit)
            self.response.out.write(json.dumps({'offset': offset}))

class GetTotalQuestions(webapp2.RequestHandler):
    def get(self):
        ques_count = Question.all().count()
        logging.info(ques_count)
        if ques_count <= 10:
            self.response.out.write(json.dumps({'ques_count': ques_count}))
        else:
            self.response.out.write(json.dumps({'ques_count': 10}))

application = webapp2.WSGIApplication([
('/', MainPage),
('/play',NewGame),
('/admin', AdminPage),
('/questions',ManageQuestion),
('/completeQuestion', NewCompleteQuestion),
('/answers',ManageAnswer),
('/check_ans',CheckAnswer),
('/random_ques',GetRandomQuestion),
('/removeAnswer', DeleteAnswer),
('/removeQuestion', DeleteQuestion),
('/SaveScore', SaveScore),
('/getQuestion', GetQuestion),
('/getTotalQuestions', GetTotalQuestions),
('/offset', GetOffset)
], debug=True)