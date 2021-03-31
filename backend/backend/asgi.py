# """
# ASGI config for backend project.

# It exposes the ASGI callable as a module-level variable named ``application``.

# For more information on this file, see
# https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
# """

# # import os

# # from django.core.asgi import get_asgi_application
# # import channels.asgi
# # from channels.layers import get_channel_layer




# # os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
# # # channel_layer = get_channel_layer()
# # channel_layer = channels.asgi.get_channel_layer()
# # application = get_asgi_application()











# import os

# from django.conf.urls import url
# from django.core.asgi import get_asgi_application

# # Fetch Django ASGI application early to ensure AppRegistry is populated
# # before importing consumers and AuthMiddlewareStack that may import ORM
# # models.
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
# django_asgi_app = get_asgi_application()

# from channels.auth import AuthMiddlewareStack
# from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter

# from myapp.consumers import MyConsumer

# application = ProtocolTypeRouter({
#     # Django's ASGI application to handle traditional HTTP requests
#     "http": django_asgi_app,

#     # WebSocket chat handler
#     "websocket": AuthMiddlewareStack(
#         URLRouter([
#             url(r"^/$", MyConsumer.as_asgi()),
#         ])
#     ),
# })

import os

import django
from django.core.asgi import get_asgi_application
from channels.http import AsgiHandler
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import myapp.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  ## IMPORTANT::Just HTTP for now. (We can add other protocols later.)
  "websocket": AuthMiddlewareStack(
        URLRouter(
            myapp.routing.websocket_urlpatterns
        )
    ),
})