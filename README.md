
# Chatbot
## The django template of this project is obtained from
https://github.com/MattSegal/django-react-guide

## The react chat widget template of this project is obatined from
https://github.com/Wolox/react-chat-widget

## Example code for a Django / React guide 

Example code for a Django / React [setup guide](https://mattsegal.dev/django-react.html)

This branch represents the project before any React stuff has been added.

## Setup instructions

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

## React js to javascript conversion instructions

```bash
# Enter Django project folder
cd frontend
# run webpack
npm run dev
# the javascript files are located at: backend/myapp/static/myapp/build
```

## Heroku

Currently working version: https://web-easychat.herokuapp.com/
