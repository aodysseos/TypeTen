
from google.appengine.api import users
import webapp2


#Decorator function to enable login access
def user_required(func):
    def decorate(*args, **kwargs):
        if not users.get_current_user():
            webapp2.abort(403)
        else:
            func(*args, **kwargs)
    return decorate


#Decorater function used to enable admin access to certain application functions
def admin_required(func):
    def decorate(*args, **kwargs):
        if not users.is_current_user_admin():
            webapp2.abort(403)
        else:
            func(*args, **kwargs)
    return decorate