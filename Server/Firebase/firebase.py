# Import library that is necessary for the project
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter,Or
import os
import asyncio
from ..Scrapping.search import Scraper


# Get the Relative path to the 'key.json' file
key_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'key.json'))

# get the private key
cred = credentials.Certificate(key_path)

# initialize firestore
firebase_admin.initialize_app(cred)

# make the brain that make the transform between the server and the firestore
db = firestore.client()

# function that help me to add content to firestore
async def add_content_to_firestore(collection_name , list_of_data):
    try:
        for data in list_of_data:
            doc_ref = db.collection(collection_name).document()
            doc_ref.set(data)
    except Exception as e:
        print('there is error' , e)


#function that check if the collection is in the firestore
async def is_in_firestore(collection_name, days):
    
    # get the collection by using the name of the collection
    docs = (
        db.collection(collection_name)
        .stream()
    )

    # check if the docs is empty if is we make the search using the scrapper :) 
    if not any(docs):
        # make scrapping to get the data 
        search_for_new_data = Scraper(days)
        await search_for_new_data.search(collection_name, ['attractions','entertainment'])
        return True
    
    return False


# function that help me to read content from firestore
async def read_content_from_firestore(collection_name):
    # get the collection by using the name of the collection
    docs = (
        db.collection(collection_name)
        .stream()
    )

    # init varaible that we saved in the data that we recived
    location_list = []

    # get the data from the fireStore and add it to the location_list
    for doc in docs:
        location_list.append( doc.to_dict() )

    return location_list    


# function that help me to read a specific content from firestore
def get_spesific_content_filtered_by_type_from_firestore(collection_name , type):

    # init variable that we saved in the data that we received
    location_list = []

    doc_ref = db.collection(collection_name)

    query = doc_ref.where(filter=FieldFilter('type' , '==' , type))

    docs = query.stream()

    # get the data from the fireStore and add it to the location_list
    for doc in docs:
        location_list.append( doc.to_dict() )

    return location_list    

# function that help me to update content in the firebase 
def update_data(collection_name, document_id, update_data):
    try:
        doc_ref = db.collection(collection_name).document(document_id)
        doc_ref.update(update_data)
        return True
    
    except Exception as e:
        print("Error updating document:", e)
        return False

# function that help me to get the id of the document from the firebase 
def get_document_id(collection_name, query_constraints):
    try:
        collection_ref = db.collection(collection_name)
        
        query = collection_ref
        for field, op, value in query_constraints:
            query = query.where(filter=FieldFilter(field, op, value))
        docs = query.stream()
            
        document_ids = [doc.id for doc in docs]
        return document_ids
    except Exception as e:
        print("Error getting document IDs:", e)
        return []
    
async def is_in_firestore_trend(location,days, task_trend):
    # fetch the data from the firestore
    query = db.collection('_trend').where(filter=FieldFilter('location' , '==' , location))
    data = list(query.stream())
    print('is_in_firestore_trend')
    # make the data in the 
    if not data:  
        print('not data')
        await get_information_and_img(location, days, task_trend)
        return 
    # convert to dictionary
    trend = data[0].to_dict()

    # check if the day in the list of days in firestore 
    if days not in trend['days']:
        print('days not in trend[\'days\']')
        trend['days'].append(days)
        update_data('_trend', data[0].id, {'days': trend['days']} )

    # update the field numTrend 
    update = trend['numTrend'] + 1  
    update_data('_trend', data[0].id, {'numTrend': update})
    print('update data')

    
async def get_information_and_img(location,days, task_trend):
    print('get_information_and_img')
    try:
        scraper_engin = Scraper(days)

        data = await scraper_engin.search_google(location)

        url = None
        while url is None:
            print('while url is None')
            url = await scraper_engin.get_img_pintrest(location, '+photography', '+travel+wallpaper')
            if url is None:
                await asyncio.sleep(1)        

        data_to_save = [{'location':location, 'days':task_trend[location]['day'], 'description': data, 'url': url,'numTrend': task_trend[location]['numDays'] }]
        await add_content_to_firestore('_trend', data_to_save)
        task_trend[location]['status'] = False
        print('saved the picture ')

    except Exception as e:
        print("Error getting document IDs:", e) 

# Create an asyncio lock
lock = asyncio.Lock()
# define variable to save the result
res = []
# function the help me to make more than task to make the response faster
async def task_get_the_image(scraper_engin, location):
    # get the img from the pintrest
    url = await scraper_engin.get_img_pintrest(location,'+photography', '+travel+wallpaper')  
    # save the list the name and the url
    print('url: ', url)  
    res.append({'location_name': location, 'url': url})

async def get_the_image(location, codeGen):
    try:
        # TODO make the change and the save in the server
        tasks = []
        scraper_engin = Scraper(30)
        for loc in location:
            task = asyncio.create_task(task_get_the_image(scraper_engin, loc))
            tasks.append(task)
            
        print('i am waiting :)')    
        await asyncio.gather(*tasks)  
        
        # save in the firestore
        await add_content_to_firestore('_suggestImg', [{ 'codeGen':codeGen , 'res':res}])
        print('i has been finish')
    except Exception as e:  
        print("Error getting the images:", e)   
