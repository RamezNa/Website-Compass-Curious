import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './mainPage.css'

import Img_Hover from '../componant/Img_Hover'

import sumbit_answer_w from './Images/lets-go_w.png'
import sumbit_answer_g from './Images/lets-go_g.png'

import icon_search from './Images/search.png'


function MainPage(){

    const navigate = useNavigate();

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
        console.log(the_value)

        if(the_value > maxDay){
            setdays(maxDay)
        }else if(the_value < minDay){
            setdays(minDay)
        }else{
            setdays(the_value)
        }
        
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        navigate('/Suggestion')
    }
    
    
    return (
        <>
        <div className='container_MP'>
            <div className='search'>
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
                            {/*TODO move to bage suggestion and make loading to the page  */}
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
                {/* TODO Make map to recived the data */}
                {/* TODO make componant */}
                <div className='container_trend left'>
                    <div className='container_img_and_number'>
                        <div className="container_number">
                            <p className='number'>1</p>
                        </div>
                        <div className="container_img">
                            <img className='img_location' src="https://cdn.britannica.com/92/177992-050-AED0DC28/Dome-of-the-Rock-Temple-Mount-Jerusalem.jpg" alt="" />
                            <h1 className='name_location'>Jerusalem</h1>
                            <h2 className='number_days'>5 Days</h2>
                        </div>

                    </div>
                    <p className="description">
                        is the most populous city in the Gush Dan metropolitan area of Israel.
                    </p>
                </div>
                <div className='container_trend right'>
                    <div className='container_img_and_number'>
                        <div className="container_number">
                            <p className='number'>2</p>
                        </div>
                        <div className="container_img">
                            <img className='img_location' src="https://cdn.britannica.com/92/177992-050-AED0DC28/Dome-of-the-Rock-Temple-Mount-Jerusalem.jpg" alt="" />
                            <h1 className='name_location'>Tel Aviv</h1>
                            <h2 className='number_days'>5 Days</h2>
                        </div>

                    </div>
                    <p className="description">
                        is the most populous city in the Gush Dan metropolitan area of Israel.
                    </p>
                </div>
            </div>   
            
        </div>
        </>
    )
}
    
export default MainPage