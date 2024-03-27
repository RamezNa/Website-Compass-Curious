# Import library that is necessary for the project
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter,Or
import os

# Get the absolute path to the 'key.json' file
key_path = os.path.abspath("key.json")

# get the private key
cred = credentials.Certificate(key_path)

# initialize firestore
firebase_admin.initialize_app(cred)

# make the brain that make the transform between the server and the firestore
db = firestore.client()

# function that help me to add content to firestore
def add_content_to_firestore(collection_name , data):
    doc_ref = db.collection(collection_name).document()
    doc_ref.set(data)

# function that help me to read content from firestore
def read_content_from_firestore(collection_name):
    
    # get the collection by using the name of the collection
    docs = (
        db.collection(collection_name)
        .stream()
    )

    # check if the docs is empty if is we make the search using the scrapper :) DO IT

    if not any(docs):
        # make scrapping to get the data 

        # return the steps and get the data from the firestore
        return read_content_from_firestore(collection_name)

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


# function that help me to update content in the firebase if i need 
# function that help me to delete content in the firebase if i need 

# some function to check the code test the code 
# add_content_to_firestore( 'User',{'name':'rame' , 'age' : 26} )
# print(read_content_from_firestore('User'))

# print(get_spesific_content_filtered_by_type_from_firestore('User' , 24))

