import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


import './mainPage.css'

import Img_Hover from '../component/Img_Hover'
import Box_Img_Description from './component/Box_Img_Desciption';

import { db } from '../Firebase/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';


function MainPage(){
    const apiUrl = 'https://raw.githubusercontent.com/russ666/all-countries-and-cities-json/master/countries.json';

    const server = ''//http://0.0.0.0:8000

    const sumbit_answer_w = 'https://cdn-icons-png.freepik.com/512/5486/5486234.png?ga=GA1.1.940078363.1718183127'
    const sumbit_answer_g = 'https://cdn-icons-png.freepik.com/512/5486/5486216.png?ga=GA1.1.940078363.1718183127'

    const icon_search = 'https://cdn-icons-png.freepik.com/512/57/57477.png?ga=GA1.1.940078363.1718183127'

    const navigate = useNavigate()

    const maxDay = 30
    const minDay = 0
  
    const [location, setlocation ] =  useState('')
    const [suggestionsCity, setSuggestionsCity] = useState([]);
    const [suggestionsCountry, setSuggestionsCountry] = useState([]);
    const [data_contries_cities, setData_contries_cities] = useState({})

    const changeLocation = async (event) =>{
        let loc_val = event.target.value
        setlocation(loc_val)

        if (loc_val.length > 2) {
            
            const found = [];
            const foundCountry = []
            const query = location.toLowerCase();
            // move on all the json and check if there is one that containe what we search add it to the found
            for (const country in data_contries_cities) {
                // if it seem to search to country we but it in array
                if (country.toLowerCase().startsWith(query)) {
                    foundCountry.push({ country });
                }
                // search on the city and see if there is one seem to what i whant to find
                for (const city of data_contries_cities[country]) {
                    // if it seem to search to city we but it in array
                    if (city.toLowerCase().startsWith(query)) {
                        found.push({ country, city });
                    }
                }
            }
            setSuggestionsCity(found)
            setSuggestionsCountry(foundCountry)

        } else {
            setSuggestionsCity([])
            setSuggestionsCountry([])
        }
    }

    const handleSuggestionClick = (suggestion) => {
        setlocation(suggestion)
        setSuggestionsCity([])
        setSuggestionsCountry([])
      };        

    const [days, setdays ] =  useState(0)
    const changeDays = (event) =>{

        const the_value = event.target.value

        if(the_value > maxDay){
            setdays(maxDay)
        }else if(the_value < minDay){
            setdays(minDay)
        }else{
            setdays(the_value)
        }
        
    }

    const handleSubmit = async (event) => {
        // TODO check that the location is valid :)
        event.preventDefault()
         // sent to server to update trend
        try{
            await fetch(`${server}/trend/${location}/${days}`)
        }catch (error) {
            console.error("Error fetching from server: ", error)
        }
        navigate('/Suggestion', {state: {location: (location.trim().toLowerCase()),numdays: days }})
    }

    const [listOfTrends,getListOfTrends] = useState([])
    const [isLoading,setIsLoading] = useState(true)

    const [focused , setFocused] = useState(false)

    useEffect( () =>{
        const  getData = async () =>{
            try {
                // fetch the data of the countries and cities
                const response = await axios.get(apiUrl)
                setData_contries_cities(response.data)
                // get the rend from the firestore
                const q = query(collection(db, '_trend'), orderBy('numTrend', 'desc'), limit(5))
                const querySnapshot = await getDocs(q)
                const trends = querySnapshot.docs.map(doc => doc.data())
                getListOfTrends(trends)
                setIsLoading(false)
            } catch (error) {
                console.error(error)
            }
        }
        getData() 
    },[] )
    
    return (
        <>
        
        <div className='container_MP'>
            <div className='search' id='Main'>
                <div className="content">
                    <h1>Dreaming Of Adventure?</h1>
                    <h2>Let Compass Curious Guide You To Unforgettable Destinations </h2>
                </div>
                <div className="content">
                    <form onSubmit={handleSubmit}>
                        <div className="container_submit">
                            <img className='icon_search' src={icon_search} alt="search" />
                            <input className='location_input'  type="text" value={location} onChange={changeLocation} placeholder='Where Do You Want To Travel' onFocus={()=> setFocused(true)} onBlur={ ()=> setFocused(false) } required/>
                        </div>

                        { ( suggestionsCity.length > 0 || suggestionsCountry.length > 0) && (
                            <ul className={`container_list ${focused ? 'open' : 'close'}`} >
                                {suggestionsCountry.map(({country},index) => (
                                    <li key={index + 500} onClick={() => handleSuggestionClick(country)} className='suggest'>  -ˏˋ⋆ {country} ⋆ˊˎ- </li>
                                ))}
                                {suggestionsCity.map(({country, city},index) => (
                                    <li key={index + 50} onClick={() => handleSuggestionClick(city)} className='suggest'>  -ˏˋ⋆ {city}, {country} ⋆ˊˎ- </li>
                                ))}
                            </ul>
                        )}
                        
                        <div className="container_submit">
                            
                            <input className='day_input' type="number" value={days == 0 ? '' : days } max={maxDay} min={minDay} onChange={changeDays} placeholder='How Much Days' required/>
                            <button type='submit' className='btn_submit'>
                                <Img_Hover url_hovered={sumbit_answer_g} url_unHovered={sumbit_answer_w} class_name={'icon_go'} alt_name={"submit"} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="trend" id='Trend'>
                
                <h1 className='title'>Inspired By Travelers</h1>
                <h2 className='subTitle'>These Destinations Are Trending With Compass Curious Explorers!</h2>
                
                {isLoading && <img src='https://i.pinimg.com/originals/61/24/16/6124164e5582efe0c5d11fc85b263437.gif' alt='loading_gif' className='loading'/> }

                { listOfTrends.length == 0 && !isLoading ? <h3>-ˏˋ⋆ No one has searched yet. Be the first to discover trending destinations with Compass Curious Explorers! ⋆ˊˎ- </h3>:
                listOfTrends.map( (trend,index) => (
                    <Box_Img_Description class_={ (index % 2 == 0 ) ? 'left' : 'right'} number={index + 1} number_of_days={trend.days}  name_location={trend.location}  description={trend.description} url={trend.url} server={server}  key={index}/> 
                ) )}
            </div>   
        </div>
        </>
    )
}
    
export default MainPage