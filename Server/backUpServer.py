from flask import Flask, request
from .Scrapping.search import Scraper
from asgiref.wsgi import WsgiToAsgi
import asyncio
import uvicorn
import signal

# *********************************************************************************** 

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:8000')#TODO cahnge this to the name of the server
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return response

# ***********************************************************************************

# this variable is saved the task that i do in the search engine
tasks = {}

# this function is worked to fetch data from the website only depend on the location
async def async_work(location, url_server, days):
    scraper_engin = Scraper(days)
    # make the search start in here function
    await scraper_engin.search(location, ['attractions','entertainment'],url_server )
    # remove the task 
    tasks.pop(location)
    
# Route to get a data of location
@app.route('/backUpServer', methods=['POST'])
async def search_work():
    print('i am in the second server')
    data_server = request.get_json()
    # check if the location in the tasks
    # if the location in the task return that the server work on it else make anew search
    if data_server:
        print('i am doing well')
        if data_server['location'] in tasks:
            print('Oops i am working on')
            return 'Please wait while we determine your location.',202
        print('i will start working as soon as i can')
        tasks[data_server['location']] = {'status': 'running'}  
        asyncio.create_task(async_work(data_server['location'], data_server['url'], data_server['days']))
        return 'We are conducting the search.', 202
    
    return 'We can\'t resolve the data.', 400

# ***********************************************************************************

asgi_app = WsgiToAsgi(app)

# Function to handle signals
def handle_signal(server):
    print('Graceful shutdown initiated...')
    server.should_exit = True

# Define a main coroutine to run the server
async def main():
    config = uvicorn.Config(asgi_app, host='0.0.0.0', port=8001)
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


