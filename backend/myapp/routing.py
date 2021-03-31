## game/routing.py
from django.conf.urls import re_path
from myapp.consumers import AudioConsumer, EmptyConsumer
from django.core.asgi import get_asgi_application

websocket_urlpatterns = [
    re_path(r'^ws/speechsocket/(?P<room_code>\w+)/', AudioConsumer.as_asgi()),
    re_path(r"",  EmptyConsumer.as_asgi()),
]