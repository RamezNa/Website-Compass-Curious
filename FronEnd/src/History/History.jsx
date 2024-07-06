import './history.css'
import Location from './component/Location'
import { useEffect,useState } from 'react'
import { auth,db } from '../Firebase/firebase'
import { useNavigate } from 'react-router-dom'
import { collection, query, getDocs,where } from 'firebase/firestore';



function History(){
    const navigate = useNavigate()

    const [listOfHistory,setListOfHistory] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect( ()=>{

        const unsubscribe = auth.onAuthStateChanged( async () => {
            try {
                const email_user = auth?.currentUser?.email

                if( email_user == undefined ){
                    navigate('/')
                    window.scrollTo(0, 0);
                }

                const q = query(collection(db, '_users'), where('email', '==', email_user))
                const querySnapshot = await getDocs(q)
                setListOfHistory(querySnapshot.docs[0].data().history)
                setIsLoading(true)

            } catch (error) {
                console.error(error)
            }  
        })
        return () => unsubscribe()
      }, [])

return(
    // TODO when we add two that has the same loation but difrent day we need to make arrow to do that
    <div className="history">
        <div className='header'>
            <div className='line'></div>
            <h1 className='title'>History</h1>
        </div>
        <h2 className='subTitle'>Continue planning your dream trip!<br/>Access your saved itineraries for inspiration.</h2>
        <div className='line'></div>
        {!isLoading && <img src='https://i.pinimg.com/originals/61/24/16/6124164e5582efe0c5d11fc85b263437.gif' alt='loading_gif' className='loading'/>}
        <div className="container_data">
            {/* TODO make when clicked moved to page suggestion and load the suggestion */}
            {   
                listOfHistory.length == 0 && isLoading ? <h3 className='no_history'> -ˏˋ⋆ No locations saved yet. Explore new destinations that speak to your interests! ⋆ˊˎ- </h3> : 
                listOfHistory.map( (loc,index) =>(
                    <Location url={loc.url} nameLocation={loc.location} numDays={loc.days} dataLocation={loc.whatDoing} key={index} />
                ) )
            }
            
        </div>
    </div>
)
}

export default History