from flask import Flask, jsonify, request
from Firebase.firebase import *
import random
import asyncio

app = Flask(__name__)

# Route to get a data of location
@app.route('/suggestion_by_day/<string:location>/<int:day>', methods=['GET'])
async def get_suggestion(location , day):
    # check if the location is exist
    await is_in_firestore(location)
    # get the data 
    data = await read_content_from_firestore ( location )
    # variable that help me to save the result
    result = []
    # variable that help me to save the indices that chossen before
    chosen_indices = []
    # make iteration untill make the suggestion
    for i in range(day):
        available_indices = [index for index in range(len(data)) if index not in chosen_indices]
        if available_indices:
            random_index = random.choice(available_indices)
            chosen_indices.append(random_index)
            result.append(data[random_index])
        else:
            print("No more available indices")
            break

    return jsonify(result)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
    # app.run(debug=True) 
