import './history.css'
import Location from './component/Location'
import { useEffect,useState } from 'react'
import { auth,db } from '../Firebase/firebase'
import { useNavigate } from 'react-router-dom'
import { collection, query, getDocs,where } from 'firebase/firestore';



function History(){
    const navigate = useNavigate()

    const [listOfHistory,setListOfHistory] = useState([])

    useEffect( ()=>{

        const unsubscribe = auth.onAuthStateChanged( async () => {
            try {
                const email_user = auth?.currentUser?.email

                if( email_user == undefined ){
                    navigate('/')
                }

                const q = query(collection(db, '_users'), where('email', '==', email_user));
                const querySnapshot = await getDocs(q);
                console.log(querySnapshot.docs[0].data().history)   
                setListOfHistory(querySnapshot.docs[0].data().history)
                 
            } catch (error) {
                console.error(error);
            }  
        });
       
         return () => unsubscribe();

      }, [])

return(
    <div className="history">
        <div className='header'>
            <div className='line'></div>
            <h1 className='title'>History</h1>
        </div>
        <h2 className='subTitle'>Continue planning your dream trip!<br/>Access your saved itineraries for inspiration.</h2>
        <div className='line'></div>
        <div className="container_data">
            {listOfHistory.map( (loc,index) =>(
                <Location url={loc.url} nameLocation={loc.location} numDays={loc.days} key={index} />
            ) )}
        </div>
    </div>
)
}

export default History