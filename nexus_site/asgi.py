"""
ASGI config for nexus_site project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack
from django.urls import re_path
from test_site import consumers

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nexus_site.settings")

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter(
   {
      "http": django_asgi_app,
      "websocket": AllowedHostsOriginValidator(
         AuthMiddlewareStack(URLRouter([
            re_path(r"ws/chat/(?P<room_name>\w+)/$", consumers.ChatConsumer.as_asgi()),
            re_path(r"ws/status/$", consumers.StatusConsumer.as_asgi())
         ]))
      ), 
   }
)
