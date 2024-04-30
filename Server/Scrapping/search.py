from bs4 import BeautifulSoup
import requests
from requests.adapters import HTTPAdapter
from requests.exceptions import RetryError
from requests_html import HTMLSession
from pyppeteer import launch
# used to help me change the width and the height of the picture 
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse


class Scraper:
    
    def __init__(self):
        self.data = []
        self.time_to_wait = 1000
        self.is_finished = False
        self.URL = ''


    # def get_html_file_fast(self, URL):

    #     session = HTMLSession()

    #     respone = session.get(URL)

    #     # Wait for JavaScript to render 
    #     respone.html.render(timeout=80)

    #     # Retrieve the HTML content with dynamically loaded content
    #     html_content = respone.html.html

    #     session.close()

    #     return BeautifulSoup(html_content , 'lxml')

    # function to get request to the url and get the page html
    async def get_html_file(self, URL):

        browser = await launch()
        page = await browser.newPage()
        await page.goto(URL)
        # You can wait for a specific element or event if needed
        # await page.waitForSelector(selector_to_wait, timeout = self.time_to_wait)
        await page.waitFor(self.time_to_wait)  # Adjust the timeout as needed
        html_content = await page.content()
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
    async def search(self, location, num_days = -1, attractions = None):
        # variable to help me to count the location that i have 
        counter_location = 0

        # make the URL
        URL = "https://www.lonelyplanet.com/search?places%5Bquery%5D=" + location + "&places%5BsortBy%5D=pois"        
        
        # variable to help me to increase the time to wait in the website in fail get the file html
        faild_connect_to_fetch_html = 0

        # start making the Scraping from the file html
        while True:
 
            # try to get the file html of the page website
            try:
                text_BS = await self.get_html_file(URL)

                list_of_locations = (text_BS.find('section' , class_ = 'relative my-12 md:mt-20 container lg:flex lg:justify-between')).div.ul

            # if there any problem with the file html try another time with time load big from than previuas
            except AttributeError as e:
                faild_connect_to_fetch_html += 1

                self.time_to_wait += (faild_connect_to_fetch_html * 1000)
                # if we try to fetch the file more than 3 time stop the search function
                if faild_connect_to_fetch_html == 3:

                    self.time_to_wait -= (faild_connect_to_fetch_html * 1000)
                    faild_connect_to_fetch_html = 0

                    self.URL = URL

                    return counter_location

                continue

            # return the value to the default
            if faild_connect_to_fetch_html != 0:
                self.time_to_wait -= (faild_connect_to_fetch_html * 1000)
                faild_connect_to_fetch_html = 0

            # for the list of the child search on the realvent data and saveit
            for child in  list_of_locations.contents:
                
                # try to fetch the data if there is any problem skip this child
                try:
                    # get the attractions from the website to make filter to answer 
                    type_of_location = (((child.find('div' , class_ = 'text-sm uppercase font-semibold tracking-wide relative z-10 mb-2 w-90 text-black-400 block')).text).split())[0]
                    
                    if attractions:
                        if type_of_location != attractions:
                            continue
                        
                    # make new dictionary
                    new_location_dictionary = {}

                    # define the name of the location
                    new_location_dictionary['name'] = (child.find('a')).text

                    # define the type of the location
                    new_location_dictionary['type'] = type_of_location

                    # define the img of the location
                    url_img = (child.find('img')).get('src')
                    new_location_dictionary['img'] = await self.resize_image_url(url_img, 1920, 1920)
                                        
                    # define the data of the location
                    new_location_dictionary['data'] = child.find('p' , class_ = 'line-clamp-2' ).text

                    # get the url of the full data
                    description_of_the_location_URL = 'https://www.lonelyplanet.com' + (child.find('a')).get('href')

                    # define the full data URL of the location
                    new_location_dictionary['full_data_URL'] = description_of_the_location_URL

                    new_location_dictionary['full_data'] = ''

                    # field that help me to know if the data that i have is the full or not
                    new_location_dictionary['is_data_full'] = False


                    self.data.append(new_location_dictionary)
                    counter_location += 1
                    
                    if counter_location == num_days:
                        return num_days

                except AttributeError as e:
                    return counter_location
                      
            # get the new Page to search in
            try:

                URL = ((text_BS.find('div' , class_ = 'relative pl-2')).a).get('href') 

                if URL == None:

                    self.is_finished = True
                    self.URL = ''
                    return counter_location

            except AttributeError as e:
                    return counter_location  

    # function that get the full data about location
    async def get_full_data(self, URL):
        data_location_html_file = (await (((self.get_html_file(URL))))) 
                    
        return data_location_html_file.find('div' , class_ = 'readMore_content__bv7mp').text
                    

# async def main():
#     s = Scraper()
#     await s.search('tel aviv')
#     print('all work very good')
#     print(s.data)

# # Run the event loop
# import asyncio
# asyncio.get_event_loop().run_until_complete(main())
