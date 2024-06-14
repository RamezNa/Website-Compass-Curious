import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './mainPage.css'

import Img_Hover from '../component/Img_Hover'
import Box_Img_Description from './component/Box_Img_Desciption';

import { db } from '../Firebase/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';


function MainPage(){

    const sumbit_answer_w = 'https://cdn-icons-png.freepik.com/512/5486/5486234.png?ga=GA1.1.940078363.1718183127'
    const sumbit_answer_g = 'https://cdn-icons-png.freepik.com/512/5486/5486216.png?ga=GA1.1.940078363.1718183127'

    const icon_search = 'https://cdn-icons-png.freepik.com/512/57/57477.png?ga=GA1.1.940078363.1718183127'

    const navigate = useNavigate()

    const maxDay = 30
    const minDay = 0

    const [location, setlocation ] =  useState('')
    const changeLocation = (event) =>{
        {/* TODO check the location that fit the website that we need to search for */}
        setlocation(event.target.value)
    }

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
            await fetch(`${server}/trend/${location}/${numdays}`)
        }catch (error) {
            console.error("Error fetching from server: ", error)
        }
        navigate('/Suggestion', {state: {location: (location.trim().toLowerCase()),numdays: days }})
    }

    const [listOfTrends,getListOfTrends] = useState([])
    const [isLoading,setIsLoading] = useState(true)

    useEffect( () =>{
        const  getData = async () =>{
            try {
                const q = query(collection(db, '_trend'), orderBy('numTrend', 'desc'), limit(5));
                const querySnapshot = await getDocs(q);
                const trends = querySnapshot.docs.map(doc => doc.data());
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
                            <input className='location_input'  type="text" value={location} onChange={changeLocation} placeholder='Where Do You Want To Travel' required/>
                        </div>
                        
                        <div className="container_submit">
                            
                            <input className='day_input' type="number" value={days == 0 ? '' : days } max={maxDay} min={minDay} onChange={changeDays} placeholder='How Much Days' required/>
                            {/* TODO move to page suggestion and make loading to the page  */}
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
                {/* TODO Check witch one to choice for loading */}
                {isLoading && <img src='https://i.pinimg.com/originals/61/24/16/6124164e5582efe0c5d11fc85b263437.gif' alt='loading_gif' className='loading'/> }
                {/* TODO make when click on the day it make a suggestion for me by the day that choice and the location */}

                { listOfTrends.length == 0 ? <h3>-ˏˋ⋆ No one has searched yet. Be the first to discover trending destinations with Compass Curious Explorers! ⋆ˊˎ- </h3>:
                listOfTrends.map( (trend,index) => (
                    <Box_Img_Description class_={ (index % 2 == 0 ) ? 'left' : 'right'} number={index + 1} number_of_days={trend.days}  name_location={trend.location}  description={trend.description} url={trend.url} key={index}/> 
                ) )}
            </div>   
        </div>
        </>
    )
}
    
export default MainPage