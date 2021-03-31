from django.shortcuts import render
import speech_recognition as sr
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from speech_recognition import AudioData

@ensure_csrf_cookie
def index(request):
    return render(request, "myapp/index.html", context={})

def speech(request):
    # This function handle the audio file and convert speech to text, then send it back to the browser
    transcript = {}
    if request.method == "POST":
        file = request.FILES['audio_data']
        if file:
            recognizer=sr.Recognizer()
            audioFile = sr.AudioFile(file)
            with audioFile as source:
                data = recognizer.record(source)
            transcript = recognizer.recognize_google(data, language='en-IN', show_all=True)
    return JsonResponse(transcript, safe=False)

def speechsocket(file):
    transcript = {}
    if file:
        recognizer=sr.Recognizer()
        # audioFile = sr.AudioFile(file)
        data = AudioData(file, 48000, 2)
        # with audioFile as source:
        #     data = recognizer.record(source)
        transcript = recognizer.recognize_google(data, language='en-IN', show_all=True)
    return transcript