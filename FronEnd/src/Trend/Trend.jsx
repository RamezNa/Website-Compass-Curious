import './trend.css'


import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


import Box_Img_Description from './component/Box_Img_Desciption'
import { server } from '../component/setting'


// Firebase import
import { db } from '../Firebase/firebase'
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';


const Trend = ({isFromFather=false}) => {

    const navigate = useNavigate()

    const [listOfTrends,setListOfTrends] = useState([])
    const [isLoading,setIsLoading] = useState(true)

    // start in the start of the componant
    useEffect( () => {

        const startPage = async () => {
            // check if is page or it's componant

            // get the trend from the firestore
            let q 
            if( !isFromFather ){
                q = query(collection(db, '_trend'), orderBy('numTrend', 'desc'))
            }else{
                q = query(collection(db, '_trend'), orderBy('numTrend', 'desc'), limit(5))
            }

            try {
                
                const querySnapshot = await getDocs(q)
                const trends = querySnapshot.docs.map(doc => doc.data())
                setListOfTrends(trends)
                setIsLoading(false)
            } catch (error) {
                console.error(error)
            }
        }

        startPage()

    }, [])


    const handleMoveToPage = () => {
        navigate('/Trend')
    }


    return(
        <div className="trend" id='Trend'>       
            <h1 className={isFromFather ? 'title titleHover' : 'title'} onClick={isFromFather ? handleMoveToPage : undefined} >Inspired By Travelers</h1>
            <h2 className='subTitle'>These Destinations Are Trending With Compass Curious Explorers!</h2>
                
            {isLoading && <img src='https://i.pinimg.com/originals/61/24/16/6124164e5582efe0c5d11fc85b263437.gif' alt='loading_gif' className='loading'/> }

            { listOfTrends.length == 0 && !isLoading ? <h3>-ˏˋ⋆ No one has searched yet. Be the first to discover trending destinations with Compass Curious Explorers! ⋆ˊˎ- </h3>:
            listOfTrends.map( (trend,index) => (
                <Box_Img_Description class_={ (index % 2 == 0 ) ? 'left' : 'right'} number={index + 1} number_of_days={trend.days}  name_location={trend.location}  description={trend.description} url={trend.url} server={server}  key={index}/> 
            ) )}
        </div> 
    )
}

export default Trend