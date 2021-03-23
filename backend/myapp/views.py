from django.shortcuts import render
import speech_recognition as sr
from django.http import JsonResponse

def index(request):
    return render(request, "myapp/index.html", context={})

def speech(request):
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