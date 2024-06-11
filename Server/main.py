from flask import Flask
from .Firebase.firebase import *
from asgiref.wsgi import WsgiToAsgi
import asyncio
import uvicorn
import signal
import multiprocessing

app = Flask(__name__)

# this function is worked to fetch data from the website google and pintrest or add to firestore trend 
async def async_trend(location, day):
    await is_in_firestore_trend(location, day)

# this function is help me to make the function work in thread
def start_trend(location, day):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(async_trend(location, day))


# route to update the firebase and get data and img from the google and pitrest :)
@app.route('/trend/<string:location>/<int:day>', methods=['POST'])
async def make_trend(location , day):
    proces = multiprocessing.Process(target=start_trend, args=(location, day))
    proces.start()
    return 'Successful', 200

# this variable is saved the task that i do in the search engine
tasks = {}

# this function is worked to fetch data from the website only depend on the location
async def async_work(location):
    # make the search start in here function
    await is_in_firestore(location)
    # remove the task 
    tasks.pop(location)

# this function is help me to make the function work in thread
def start_me(location):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(async_work(location))

    
# Route to get a data of location
@app.route('/suggestion_by_day/<string:location>', methods=['GET'])
async def get_suggestion(location):
    # check if the location in the tasks
    # if the location in the task return that the server work on it else make anew search
    if location in tasks:
        return 'Please wait while we determine your location.',202
    tasks[location] = {'status': 'running'}
    proces = multiprocessing.Process(target=start_me, args=(location,))
    proces.start()  
    return 'We are conducting the search.', 202


asgi_app = WsgiToAsgi(app)

# Function to handle signals
def handle_signal(server):
    print('Graceful shutdown initiated...')
    server.should_exit = True

# Our main Server :)
if __name__ == '__main__':

    config = uvicorn.Config(asgi_app, host='0.0.0.0', port=8000)
    server = uvicorn.Server(config)

    # Register signal handlers
    signal.signal(signal.SIGINT, lambda sig, frame: handle_signal(server))
    signal.signal(signal.SIGTERM, lambda sig, frame: handle_signal(server))
    
    try:
        server.run()
    except KeyboardInterrupt:
        print("Server stopped by user")

