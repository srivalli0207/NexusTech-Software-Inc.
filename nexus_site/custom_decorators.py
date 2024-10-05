from django.shortcuts import redirect
from django.http import HttpRequest


def custom_login_required(func):
   """Redirect to login page if user is not logged in with the next param set to the page to redirect back to after login success"""
   def inner(request: HttpRequest):
         if (request.user.is_authenticated):
            return func(request)
         else:
            return redirect("/login/?next=%s" % request.GET['next'])
    
   return inner