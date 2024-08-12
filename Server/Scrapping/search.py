import asyncio
from bs4 import BeautifulSoup
import nest_asyncio
from pyppeteer import launch
# used to help me change the width and the height of the picture 
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
import requests
import json
import re

nest_asyncio.apply()

class Scraper:

    def __init__(self, max_number_to_do):
        self.data = []
        self.MAX_ATTR = max_number_to_do
        self.count_atr = 0 

    async def get_html_file_fast(self,url, waitUntil):
        browser = await launch(headless=True)
        page = await browser.newPage()
        await page.goto(url, {'waitUntil': waitUntil})  # Wait until the network is idle
        html_content = await page.content()  # Get the HTML content of the page
        await browser.close()
        return BeautifulSoup(html_content , 'lxml')
  
    # function that help me to change the width and the height of the url 
    async def resize_image_url(self, url, width, height):
        # Parse the URL
        parsed_url = urlparse(url)
        query_params = parse_qs(parsed_url.query)

        # Update width and height parameters
        query_params['w'] = [str(width)]
        query_params['h'] = [str(height)]

        # Reconstruct the URL with updated parameters
        updated_query = urlencode(query_params, doseq=True)
        updated_url = urlunparse((
            parsed_url.scheme,
            parsed_url.netloc,
            parsed_url.path,
            parsed_url.params,
            updated_query,
            parsed_url.fragment
        ))

        return updated_url
    
    # function to make thread work on and make the response faster
    async def get_information_from_google(self, child, location):
        print('don\'t worry i am working :)')
        try:
            print('i am in the try')
            # make new dictionary
            new_location_dictionary = {}
            print('the child: ')
            print(child)
            # get the url image of the attraction
            new_location_dictionary['img'] = child.find('img').get('src')
            print('i get the img')
            # change the width and the height of the image to get a better resolution 
            new_location_dictionary['img'] = re.sub(r'=w\d+', f'=w{1020}', new_location_dictionary['img'])
            new_location_dictionary['img'] = re.sub(r'-h\d+', f'-h{1020}', new_location_dictionary['img'])              
            print('i change the resolution of the picture ')
            # get the name of the attraction
            new_location_dictionary['name'] = child.find( 'span', class_= 'Yt787').text
            # get description about the location
            print('i get the name of the attraction')
            new_location_dictionary['data'] = await self.search_google(new_location_dictionary['name'])
            new_location_dictionary['full_data'] = new_location_dictionary['data']
            print('i get the data of the attraction')
                    
            new_location_dictionary['type'] = 'attraction'
                    
            new_location_dictionary['map'] = 'https://www.google.com/maps/search/' + new_location_dictionary['name'] + '+' + location

            new_location_dictionary['Where'] = None
                    
            self.data.append(new_location_dictionary) 
            print('i saving the data in the dictionary')

        except Exception as error:
            print('we have error:\n' + error)
            return    
    
    # function that make search on google and get attraction to the location
    async def google_search(self, location):

        # create the url of the pages    
        URL = 'https://www.google.com/search?q='+ location +'+attraction&sca_esv=7da8ca964234249c&sxsrf=ADLYWIK8fpP5YHTn6opdbbsLqsyFa7N7LQ:1723290734599&udm=15&sa=X&ved=2ahUKEwiXjNKgruqHAxXhh_0HHd2nJ3cQxN8JegQIGxAb&biw=1358&bih=690&dpr=1'
        # get the html file and the relevant data from the page
        try:
            text_BS = await self.get_html_file_fast(URL, 'networkidle2')
            # find the container of the attractions 
            list_of_locations = (text_BS.find('div' , class_ = 'jhtnKe'))
        except Exception as error:
            print('error in the google search function')
            return 
        print('here the list of the location ')

        # move on the container data and get the relevant data and saved it in the data file
        try:
            print('here we are start')
            tasks = []
            for child in list_of_locations.contents:
                task = asyncio.create_task(self.get_information_from_google(child, location))
                tasks.append(task)
                   
            print('i am waiting :)')
            await asyncio.gather(*tasks)  
             
        except Exception as error:
            print('we are sorry the problem in google search in getting relevant data\n', error)
            return 
        # upload the result to the firestore 
        try:
            from ..Firebase.firebase import add_content_to_firestore
            await add_content_to_firestore(location , self.data)
            self.data = []
        except Exception as e:
            print('error with saving in firebase: ' , e) 
            return  
        print('end the game :(')  
    
    # function that help me to make the task for the function search
    async def get_information_from_lonlyplanet(self, child, location, attractions):
         # try to fetch the data if there is any problem skip this child
        try:
            # get the attractions from the website to make filter to answer 
            type_of_location = (((child.find('div' , class_ = 'text-sm uppercase font-semibold tracking-wide relative z-10 mb-2 w-90 text-black-400 block')).text).split())
            where_Is = type_of_location[2].lower()
            type_of_location = type_of_location[0]
            print('a')
                        
            if attractions:
                if type_of_location not in attractions :
                    return
            
            # make new dictionary
            new_location_dictionary = {}

            # define the name of the location
            new_location_dictionary['name'] = (child.find('a')).text
            print('b')
            # define the type of the location
            new_location_dictionary['type'] = type_of_location

            # define the img of the location
            url_img = (child.find('img')).get('src')
            print('c')
            # if the image from lonelyplanetstatic find new image
            if 'lonelyplanetstatic' in url_img:
                print('d')
                new_location_dictionary['img'] = await self.get_img_pintrest(new_location_dictionary['name'], (' ' + type_of_location ), (' ' + where_Is))
            else:
                print('e')
                new_location_dictionary['img'] = await self.resize_image_url(url_img, 1020, 1020)

            # define the data of the location
            new_location_dictionary['data'] = child.find('p' , class_ = 'line-clamp-2' ).text
            print('f')
            # get the url of the full data
            description_of_the_location_URL = 'https://www.lonelyplanet.com' + (child.find('a')).get('href')
            print('g')
            res = await self.get_full_data(description_of_the_location_URL , new_location_dictionary['name'], where_Is)
            print('h')
            new_location_dictionary['full_data'] = res[0]

            new_location_dictionary['map'] = res[1]

            new_location_dictionary['Where'] = where_Is 

            if where_Is == location:
                new_location_dictionary['Where'] = None
            print(' i am increase the counter_atr')    
            self.count_atr += 1
            self.data.append(new_location_dictionary)
                       
        except AttributeError as e:
            print('Error on fetch data: ' , e)
            print(2)
        
        return                

    # function to get all the relevant data from the website and save it in the data variable
    async def search(self, location, attractions = None, url_server=None):
        # variable to help me to count the location that i have
        self.count_atr = 0 
        print('hello i happy to meet you')
         
        URL = ""
        if url_server != None:
            URL = url_server
        else:
            URL = "https://www.lonelyplanet.com/search?places%5Bquery%5D=" + location + "&places%5BsortBy%5D=pois"            
        # variable to help me to increase the time to wait in the website in fail get the file html
        count_error = 0
        # start making the Scraping from the file html
        while True:
            # get the file html of the page website
            try:
                text_BS = await self.get_html_file_fast(URL, 'networkidle2')
                list_of_locations = (text_BS.find('section' , class_ = 'relative my-12 md:mt-20 container lg:flex lg:justify-between')).div.ul  
            except Exception as e:
                print('the url is ', URL)
                print('Error to get the page: ', e)
                # make the google search here
                if self.count_atr == 0 and url_server == None :
                    await self.google_search(location)
                    return
                await asyncio.sleep(150)
                if(count_error >= 4):
                    return
                count_error += 1
                continue
            
            count_error = 0   
            
            print(1)
            try:
                tasks = []
                # for the list of the child search on the relevant data
                for child in  list_of_locations.contents:
                    task = asyncio.create_task(self.get_information_from_lonlyplanet(child, location, attractions))
                    tasks.append(task)

            except Exception as e:
                print('Error on the data: ' , e)
                continue
            
            print(3)
            try:
            
                print('i am waiting :)')
                await asyncio.gather(*tasks)  
                print('count_atr= ' , self.count_atr) 
            
            except Exception as error:
                print('there is an error in waiting for tasks ', error)    

            # save the data in the firestore :)
            try:
                print('i am saving the data on the firebase')
                from ..Firebase.firebase import add_content_to_firestore
                await add_content_to_firestore(location , self.data)
                self.data = []
            except Exception as e:
                print('error in save firebase: ' , e)

            print(4)
            # get the new Page to search in
            try:
                URL = ((text_BS.find('div' , class_ = 'relative pl-2')).a).get('href') 

                if URL == None:
                    print(5)
                    return
                
                if (self.count_atr >= self.MAX_ATTR) :
                    print('i')
                    
                    if (self.MAX_ATTR - 30) != 0 and url_server == None :
                        print('stop')
                        data_send = {
                            'location':location,
                            'url':URL,
                            'days': ( 35 - self.MAX_ATTR ) 
                        }
                        url_server = 'http://127.0.0.1:8001/backUpServer' # TODO change the server when upload 
                        requests.post(url_server, json=data_send)
                    return  
                
            except AttributeError as e:
                    print(6)
                    return 

    # function that get the full data about location
    async def get_full_data(self, URL, name_location, location_):
        data_location_html_file = (await (((self.get_html_file_fast(URL, 'networkidle2'))))) 
        # get the full data data 
        full_data = data_location_html_file.find('div' , class_ = 'readMore_content__bv7mp').text
        # get url to the location of the 
        
        loc = location_
        if ' ' in location_:
            loc = location_.replace(' ' , '+')

        to = name_location
        if ' ' in name_location:
            to = name_location.replace(' ' , '+')

        location  = 'https://www.google.com/maps/search/' + to + '+' + loc
        return [full_data, location]
    
    # function that get from the google description about the location 
    async def search_google(self, location):
        print('i am in search_google')
        URL = 'https://www.google.com/search?q=what+is+the+basic+information+about+' + location
        try:
            text_BS = await self.get_html_file_fast(URL, 'networkidle2')

            description = (text_BS.find('span' , class_ = 'BxUVEf ILfuVd')).text

            if description == None:
                if ' ' in location:
                    location = location.replace(' ', '_')
                print('we are in wikivoyage')
                URL = 'https://en.wikivoyage.org/wiki/' + location
                text_BS = await self.get_html_file_fast(URL, 'networkidle2')
                # search on wikivoyage
                description = ''  
                
                section_tag = text_BS.find('section')
                p_tags = section_tag.find_all('p')
                
                for p in p_tags:
                    description += p.text + '\n'

            return description
        
        except AttributeError as e:
            print("we have ERROR :(", e)

    # function that get from the pintrest img that describe the location
    async def get_img_pintrest(self, location, describe, where):

        URL = 'https://www.pinterest.com/search/pins/?q=' + location + describe
        count = 0
        while True:
            try:
                text_BS = await self.get_html_file_fast(URL, 'networkidle2')
                url_img = ((text_BS.find('div' , class_ = 'Pj7 sLG XiG ho- m1e')).div.img).get('src')
                # get img with resolution good
                if '236x' in url_img:
                    new_url = url_img.replace('236x', '736x')
                    return new_url
                else:
                    return url_img
            except AttributeError as e:
                print("we have ERROR :(", e)
                count+=1
                
                if count >= 1:
                    URL = 'https://www.pinterest.com/search/pins/?q=' + location + where
                if count >= 3:
                    return 'https://images.unsplash.com/photo-1579724984996-c2d12999e8f6?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    
