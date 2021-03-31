## game/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .views import speechsocket

class AudioConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = 'room_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        print("Disconnected")
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        """
        Receive message from WebSocket.
        Get the event and send the appropriate event
        """

        if bytes_data != None:
            message = speechsocket(bytes_data)
            flag = True
        else:
            response = json.loads(text_data)
            message = response.get("message", None)
            flag = False

        # Send message to room group
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_message',
            'message': message,
            'event': "START",
            'transcript': flag,
        })

    async def send_message(self, res):
        """ Receive message from room group """
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "payload": res,
        }))

class EmptyConsumer(AsyncWebsocketConsumer):
    # handling websocket root url error message
    async def connect(self):
        pass

    async def disconnect(self, close_code):
        # print("Disconnected")
        pass

    async def receive(self, text_data, bytes_data):
        pass

    async def send_message(self, res):
        pass