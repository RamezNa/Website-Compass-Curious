import './suggestion.css'
import SuggestCard from './component/SuggestCard'
import { useState } from 'react'

function Suggestion({location='Tel Aviv', numdays=3}){
    const [isClickedSave, setIsClickedSave] = useState(false)

    const handleClickedSave = (event) => {
        // TODO Save the suggestion on the data base 
        setIsClickedSave(!isClickedSave)
    }

    return(
        <>
        <div className='suggestion'>
            <div className='header'>
                <h1>Unlocking Adventure</h1>
                <h2>Your Curated Guide To <span className='colorize'> {location} </span> In <span className='colorize'>{numdays}</span> { numdays > 0 ? 'Days' : 'Day'}</h2>
            </div>
            <SuggestCard which_day={1} url={'https://i.natgeofe.com/n/c864cd91-f26b-4db5-bd62-3e97dc7358c9/temple-mount-jerusalem-israel.jpg'} location_name={'Tel Aviv Museum of Art '} description={'The modern ‘envelope’ building by American architect Preston Scott Cohen is one of many reasons to visit this impressive gallery located on the eastern'} numDays={numdays}/>
            <SuggestCard which_day={2} url={'https://ik.imgkit.net/3vlqs5axxjf/TAW/ik-seo/uploadedImages/All_Destinations/AFME/Africa_-_Middle_East/Tel%20Aviv%20Guide%202023_HERO/Tel-Aviv-Travel-Guide-What%27s-New-in-Israel%27s-Capit.jpg?tr=w-1008%2Ch-567%2Cfo-auto'} location_name={'Tel Aviv Boardwalk '} description={'No visit to Tel Aviv is complete without a seaside stroll, and after recent renovations to the city’s boardwalk (tayelet in Hebrew), it is an absolute must…'} numDays={numdays}/>
            <SuggestCard which_day={3} url={'https://i.natgeofe.com/n/c864cd91-f26b-4db5-bd62-3e97dc7358c9/temple-mount-jerusalem-israel.jpg'} location_name={'Tel Aviv Museum of Art '} description={'The modern ‘envelope’ building by American architect Preston Scott Cohen is one of many reasons to visit this impressive gallery located on the eastern'} numDays={numdays}/>
            <div className='footer'>
                <div className='container_conclusion'>
                    <div className='line'></div>
                    <h3 className='title'>Conclusion Of The Proposal</h3>
                </div>
                <h4 className='subTitle'> You've reached the end of your suggested itinerary.<br />Would you like to:</h4>
                <div className="operation">
                    {/* TODO onclick function do something */}
                    <div className='container'>
                        <spin className='icon' onClick={null} >⟳</spin>
                        <h5 className='description'>Regenerate Suggestion</h5>
                    </div>
                    {/* ToDo if is login see the save icon */}
                    <div className='container'>
                        <spin className={isClickedSave ? 'icon save' : 'icon'} onClick={handleClickedSave} >♥</spin>
                        <h5 className='description'>Save this itinerary</h5>
                    </div>
                    <div className='container'>
                        <spin className='icon' onClick={null} >✦</spin>
                        <h5 className='description'>New suggestions</h5>
                    </div>
                </div>
            </div>
        </div>
        
        </>
    )
}
    
export default Suggestion