import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { db } from "../../Firebase/firebase"
import { where, query, getDocs, collection } from "firebase/firestore"
 
function Location( {nameLocation, numDays, dataLocation} ){

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [url, setUrl] = useState('')

    useEffect( () =>{
        // get the img from the data base
        const start = async() =>{
            const q = query( collection(db , '_trend'), where('location', '==', nameLocation ) )
            const querySnapshot = await getDocs(q)
            setUrl(querySnapshot.docs[0].data().url)
            setIsLoading(true)
        }

        start()
    }, [])

    const handleMoveToSuggestion = () => {
        navigate('/Suggestion', {state: {location: (nameLocation.trim().toLowerCase()), numdays: numDays, isHistory: true, data_: dataLocation }})
        window.scrollTo( { top: 0, behavior: 'smooth' } );
    }

    return(
        <div className="data" onClick={handleMoveToSuggestion}>
            {!isLoading ? <img src='https://i.pinimg.com/originals/61/24/16/6124164e5582efe0c5d11fc85b263437.gif' alt='loading_gif' className='loading'/>:
            <img className="img" src={url} alt={nameLocation} />
            }
            <div className="aligment">
                <h3 className="name_location">{nameLocation}</h3>
                <p className="num_day">{numDays} {numDays > 1 ? 'Days' : 'Day'} </p>
            </div>
        </div>
    )
}

export default Location