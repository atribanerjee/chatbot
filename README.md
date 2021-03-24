
# Chatbot

This is a web application that implements a chatbot to help the users perform some searching with a more friendly user interface and interaction. It provides a simple answer straight away without having to scroll through all the google search results. In the meantime, provides the option of the top 10 google search results so that the user can go through the websites as well. The user can also click on the "show image" quick button to view some of the images from google search.

## Heroku

A demo is deployed on Heroku.
Currently working version: https://web-easychat.herokuapp.com/

## The django template of this project is obtained from
https://github.com/MattSegal/django-react-guide

## The react chat widget template of this project is obatined from
https://github.com/Wolox/react-chat-widget

## Example code for a Django / React guide 

Example code for a Django / React [setup guide](https://mattsegal.dev/django-react.html)

This branch represents the project before any React stuff has been added.

## Setup instructions for backend

```bash
# Enter Django project folder
cd backend
# Setup and activate virtualenv
virtualenv env
. env/bin/activate
# Install requirements
pip install -r requirements.txt
# Setup Django
./manage.py migrate
./manage.py runserver
# Then visit http://localhost:8000
```

## Setup instructions for frontend

```
# Enter Django project folder
cd frontend
# Install requirements
pip install -r requirements.txt
```

## React js to javascript conversion instructions

```bash
# Enter Django project folder
cd frontend
# run webpack
npm run dev
# the javascript files are located at: backend/myapp/static/myapp/build
```


## Future improvement

- Work on GPT3 files to improve conversational interaction, for example:
    * remember things said 1 day ago
    * understand what "it" represents in a sentence
    * idea: work on the pretext file
- Audio button
    * has to click on the button again to stop recording
    * not as smooth, might be better to use websocket (the program is currently using polling to get real time transcript)
    * Mixed content issue: recorder.js used requires https but GPT3 is currently using http. The user has to enable mixed content (can be done on Chrome and Firefox)
- Backend:
    * add more feature using the audio data
