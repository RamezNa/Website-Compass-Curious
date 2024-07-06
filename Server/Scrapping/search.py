from bs4 import BeautifulSoup
import nest_asyncio
from pyppeteer import launch
# used to help me change the width and the height of the picture 
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

nest_asyncio.apply()
class Scraper:
    
    def __init__(self):
        self.data = []
        self.MAX_ATTR = 10 #TODO make it 30

    async def get_html_file_fast(self,url):
        browser = await launch(headless=True)
        page = await browser.newPage()
        await page.goto(url, {'waitUntil': 'networkidle2'})  # Wait until the network is idle
        html_content = await page.content()  # Get the HTML content of the page
        await browser.close()
        return BeautifulSoup(html_content , 'lxml')
  
    # fuction that help me to change the width and the height of the url 
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

    # function to get all the realevent data from the website and save it in the data varible
    async def search(self, location, days, attractions = None):
        count_atr = 0 
        print('hello i happy to meet you')
        # variable to help me to count the location that i have 

        URL = "https://www.lonelyplanet.com/search?places%5Bquery%5D=" + location + "&places%5BsortBy%5D=pois"        
        # variable to help me to increase the time to wait in the website in fail get the file html

        # start making the Scraping from the file html
        while True:
            # get the file html of the page website
            try:
                text_BS = await self.get_html_file_fast(URL)
                list_of_locations = (text_BS.find('section' , class_ = 'relative my-12 md:mt-20 container lg:flex lg:justify-between')).div.ul  
            except Exception as e:
                print('Error to get the page: ', e)
                # TODO make the google search here
                continue   
            print(1)
            try:
            # for the list of the child search on the realvent data and save it
                for child in  list_of_locations.contents:

                    # try to fetch the data if there is any problem skip this child
                    try:
                        # get the attractions from the website to make filter to answer 
                        type_of_location = (((child.find('div' , class_ = 'text-sm uppercase font-semibold tracking-wide relative z-10 mb-2 w-90 text-black-400 block')).text).split())
                        where_Is = type_of_location[2].lower()
                        type_of_location = type_of_location[0]
                        print('a')


                        if attractions:
                            if type_of_location not in attractions :
                                continue
    
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
                            new_location_dictionary['img'] = await self.resize_image_url(url_img, 1920, 1920)

                        
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

                        self.data.append(new_location_dictionary)
                        
                        count_atr += 1
                        if (count_atr == days) or (count_atr >= self.MAX_ATTR) :
                            print('i')
                            # save the data in the firestore :)
                            try:
                                from ..Firebase.firebase import add_content_to_firestore
                                await add_content_to_firestore(location , self.data)
                                self.data = []
                            except Exception as e:
                                print('erroe in save firebase_2: ' , e)

                            if (count_atr >= self.MAX_ATTR):
                                print('stop')
                                return   

                    except AttributeError as e:
                        print('Error on fetch data: ' , e)
                        print(2)
                        continue
            except Exception as e:
                print('Error on the data: ' , e)
                # TODO go and search in google check if this first time and if it make the serach using google
                # return 
                continue

            print(3)

            # save the data in the firestore :)
            try:
                from ..Firebase.firebase import add_content_to_firestore
                await add_content_to_firestore(location , self.data)
                self.data = []
            except Exception as e:
                print('erroe in save firebase: ' , e)

            print(4)
            # get the new Page to search in
            try:
                URL = ((text_BS.find('div' , class_ = 'relative pl-2')).a).get('href') 

                if URL == None:
                    print(5)
                    return

            except AttributeError as e:
                    print(6)
                    return 

    # function that get the full data about location
    async def get_full_data(self, URL, name_location, location_):
        data_location_html_file = (await (((self.get_html_file_fast(URL))))) 
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
    #TODO some time return null text check why :(
    # function that get from the google description about the location 
    async def search_google(self, location):
        URL = 'https://www.google.com/search?q=what+is+the+basic+information+about+' + location
        try:
            description = None
            while description == None:
                text_BS = await self.get_html_file_fast(URL)
                description = (text_BS.find('span' , class_ = 'BxUVEf ILfuVd'))

            return description.text
        except AttributeError as e:
            print("we have EROR :(", e)

    # function that get from the pintrest img that descripe the location
    async def get_img_pintrest(self, location, descripe, where):
        URL = 'https://www.pinterest.com/search/pins/?rs=typo_auto_original&q=' + location + descripe
        count = 0
        while True:
            try:
                text_BS = await self.get_html_file_fast(URL)
                url_img = ((text_BS.find('div' , class_ = 'Pj7 sLG XiG ho- m1e')).div.img).get('src')
                # get img with resolustion good
                if '236x' in url_img:
                    new_url = url_img.replace('236x', '736x')
                    return new_url
                else:
                    return url_img
            except AttributeError as e:
                print("we have EROR :(", e)
                count+=1
                
                if count >= 1:
                    URL = 'https://www.pinterest.com/search/pins/?q=' + location + where
                if count >= 3:
                    URL = 'https://images.unsplash.com/photo-1579724984996-c2d12999e8f6?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    break

