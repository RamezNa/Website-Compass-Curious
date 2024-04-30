# Import library that is necessary for the project
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter,Or
import os
import sys

# adding Scraper folder to the system path
sys.path.insert(0, '/home/ramezna/Downloads/college/2023-2024/10051 פרויקט גמר בהנדסת תוכנה/Website-Compass-Curious/Server/Scrapping')
# import the file Scraper 
from search import Scraper

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
    for data in list_of_data:
        doc_ref = db.collection(collection_name).document()
        doc_ref.set(data)

#function that check if the collection is in the firestore
async def is_in_firestore(collection_name):
    # get the collection by using the name of the collection
    docs = (
        db.collection(collection_name)
        .stream()
    )

    # check if the docs is empty if is we make the search using the scrapper :) 
    if not any(docs):
        # make scrapping to get the data 
        search_for_new_data = Scraper()
        
        await search_for_new_data.search(collection_name)
        # save the data on the firestore and then called the function read_content_from_firestore 
        await add_content_to_firestore(collection_name , search_for_new_data.data)


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


# function that help me to read a spesific content from firestore
def get_spesific_content_filtered_by_type_from_firestore(collection_name , type):

    # init varaible that we saved in the data that we recived
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

# test get the id and update something in 
# try_id = get_document_id('tel aviv' , [("name", "==", "Poli House")] )
# print(try_id)
# print(update_data('tel aviv' , try_id[0] ,{'is_data_full': False} ))

# some function to check the code test the code 
# add_content_to_firestore( 'User',{'name':'rame' , 'age' : 26} )
# print(read_content_from_firestore('User'))
# print(await read_content_from_firestore('tel aviv'))

# print(get_spesific_content_filtered_by_type_from_firestore('User' , 24))
# import asyncio

# async def main():
#     print(await read_content_from_firestore('tel aviv'))

# if __name__ == "__main__":
#     asyncio.run(main())
