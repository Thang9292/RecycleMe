# RecycleMeApp

Link to the DevPost: https://devpost.com/software/recycleme-sm6nuv#updates

To make this run correctly:

Change the ip-address in the App.js and server.py to your ipv4 address (open your terminal and do ipconfig for windows users). 

You also need your own OpenAI api key. My key has already expired and does not work.

You need to cd into backend on your terminal and create a virtual environment with python -m venv. Then you have to activate your virtual environment <venv>\Scripts\activate. Once you activated your virtual environment, you have to pip install the requirements. Then you can run python server.py in the terminal. This will load up the flask sever.

While the flask server is running on one terminal, on another terminal, when your in the RecycleMe folder, do npm install to install all the react-native imports. Finally, run npx expo start to load it. Then if you have the app ExpoGo, you can use this application.
