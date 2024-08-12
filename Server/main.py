from flask import Flask
from .Firebase.firebase import *
from asgiref.wsgi import WsgiToAsgi
import asyncio
import uvicorn
import signal


# ***********************************************************************************

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')#TODO cahnge this to the name of the server
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return response

# ***********************************************************************************

# function that called to the function that get the image and save the all in the firebase
async def async_suggestion_img(location, codeGen):
    await get_the_image(location, codeGen)

# Route to get a img of location
@app.route('/suggestion_based_Love/<string:codeGen>/<location>', methods=['GET'])
async def get_img_to_the_location(codeGen, location):
    print('get_img_to_the_location(codeGen, location)')
    location_list = location.split(',')
    asyncio.create_task(async_suggestion_img(location_list, codeGen))
    return 'We are conducting the search.', 202

# ***********************************************************************************

task_trend = {}

# this function is worked to fetch data from the website google and pintrest or add to firestore trend 
async def async_trend(location, day):
    await is_in_firestore_trend(location, day, task_trend)
    # remove the task 
    task_trend.pop(location)

# route to update the firebase and get data and img from the google and pitrest :)
@app.route('/trend/<string:location>/<int:day>', methods=['GET'])
async def make_trend(location , day):
    print('make_trend(location , day)')
    # check if the location in the task_trend
    # if the location in the task_trend return that the server work on it else make anew search
    print(task_trend)
    
    if location in task_trend and task_trend[location]['status'] :
        print('location in task_trend and task_trend[location][\'status\'] :')
        if day not in task_trend[location]['day']:
            task_trend[location]['day'].append(day)
        task_trend[location]['numDays'] += 1
        return 'Please wait while we determine your location.',202
   
    task_trend[location] = {'status': True, 'numDays': 1, 'day': [day]} 
    print(task_trend)
    asyncio.create_task(async_trend(location, day))
    return 'Successful', 200

# ***********************************************************************************

# this variable is saved the task that i do in the search engine
tasks = {}

# this function is worked to fetch data from the website only depend on the location
async def async_work(location, days):
    # make the search start in here function
    await is_in_firestore(location, days)
    # remove the task 
    tasks.pop(location)
    
# Route to get a data of location
@app.route('/suggestion_by_day/<string:location>/<int:days>', methods=['GET'])
async def get_suggestion(location, days):
    # check if the location in the tasks
    # if the location in the task return that the server work on it else make anew search
    if location in tasks:
        return 'Please wait while we determine your location.',202
    tasks[location] = {'status': 'running'}  
    asyncio.create_task(async_work(location, days))
    return 'We are conducting the search.', 202

# ***********************************************************************************

asgi_app = WsgiToAsgi(app)

# Function to handle signals
def handle_signal(server):
    print('Graceful shutdown initiated...')
    server.should_exit = True

# Define a main coroutine to run the server
async def main():
    config = uvicorn.Config(asgi_app, host='0.0.0.0', port=8000)
    server = uvicorn.Server(config)

    # Register signal handlers
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, lambda sig=sig: handle_signal(server))

    try:
        await server.serve()
    except asyncio.CancelledError:
        print("Server stopped by user")

# Our main Server :)
if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Server stopped by user")    


