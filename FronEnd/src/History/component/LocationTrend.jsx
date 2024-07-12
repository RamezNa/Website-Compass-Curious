import { useNavigate } from 'react-router-dom'

import { useState } from 'react'
 
function Location( {url, nameLocation, dataLocation} ){

    const navigate = useNavigate()

    const [isLoading,setIsLoading] = useState(true)

    const handleMoveToSuggestion = () => {
        // TODO check what i need to do for the day when i send to suggestion
        navigate('/Suggestion', {state: {location: (nameLocation.trim().toLowerCase()), numdays: numDays, isHistory: false, data_: dataLocation }})
        window.scrollTo( { top: 0, behavior: 'smooth' } );
    }

    return(
        <div className="data" onClick={handleMoveToSuggestion}>
            {isLoading ? <img src='https://i.pinimg.com/originals/61/24/16/6124164e5582efe0c5d11fc85b263437.gif' alt='loading_gif' className='loading'/>: <></> }
            <div className="container_sug">
                <img className="img" src={url} alt={nameLocation} onLoad={()=> setIsLoading(false)}  />
                <h3 className="name_location">{nameLocation}</h3>
            </div>
            
            <p className="description">{dataLocation}</p>
        </div>
    )
}

export default Location