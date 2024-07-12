import './history.css'
import Location from './component/Location'
import LocationTrend from './component/LocationTrend'
import { useEffect,useState } from 'react'
import { auth,db } from '../Firebase/firebase'
import { useNavigate } from 'react-router-dom'
import { collection, query, getDocs, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';

import {generateText, delay, server} from '../component/setting'


function History(){

    const navigate = useNavigate()

    const [listOfHistory,setListOfHistory] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    
    const [suggestLocation, setSuggestLocation] = useState([])
    const [isLoadingSug, setIsLoadingSug] = useState(true)

    // generate a random code that containe number and digit
    const generateRandomCode = (length) => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    };
    // TODO check that the name that we resolve from the gimini dont containe ','
  

    const handleGenerateText = async (prompt, querySnapshotUser) => {
        // gimini code work to get the respone
        
        const res = generateText(prompt)

        
        // get the images to the location that i recived  
        const list_location = res[0]['name'] + ',' + res[1]['name'] + ',' + res[2]['name'] + ',' + res[3]['name'] + ',' + res[4]['name']
        const list_description = res[0]['description'] + '^' + res[1]['description'] + '^' + res[2]['description'] + '^' + res[3]['description'] + '^' + res[4]['description']
        const codeGen = generateRandomCode(10)
        try{

            fetch(`${server}/suggestion_based_Love/${codeGen}/${list_location}`)// '/${list_description}' TODO make the sever make all the operation

            // wait and after that fetch the data from the firebase 
            let time_wait = 28000
            const q = query(collection(db, '_suggestImg'), where('codeGen', '==', codeGen))
            
            // fetch the data from the firebase
            let querySnapshot = await getDocs(q)
            while( querySnapshot.empty){
                await delay(time_wait)
                time_wait = time_wait / 2
                querySnapshot = await getDocs(q)
                console.log('i am waiting')
            }
            
            let value_temp = querySnapshot.docs[0].data().res

            value_temp = value_temp.map( ( temp , index ) => {
                return{
                    ...temp,
                    description :res[index].description
                }
            } )

            setSuggestLocation(value_temp)

            //  remove it from the firebase 

            const documentId = querySnapshot.docs[0].id
            await deleteDoc(doc( db, '_suggestImg', documentId ))
            console.log(value_temp)
            // save it in the field of the user
            querySnapshotUser.forEach( async (doc) => {
                const docRef = doc.ref;
                // Update the document with the new value
                try {
                    await updateDoc(docRef, {
                        isChanged: false, // Update isChanged field  
                        basedLove: value_temp // Update basedLove field 
                    });
                    setIsLoadingSug(false)
                } catch (error) {
                    console.error("Error updating document:", doc.id, error);
                }

            });

        }catch(error){
            console.error(error)
        }

    };

    useEffect( ()=>{

        const unsubscribe = auth.onAuthStateChanged( async () => {
            
            try {
                const email_user = auth?.currentUser?.email

                if( email_user == undefined ){
                    navigate('/')
                    window.scrollTo( { top: 0, behavior: 'smooth' } );
                }

                const q = query(collection(db, '_users'), where('email', '==', email_user))
                const querySnapshot = await getDocs(q)
                const histor_data = querySnapshot.docs[0].data().history
                setListOfHistory(histor_data)
                setIsLoading(true)

                // check if changed true and if the history empty or not and after that run the generate text base on what he want 
                if( querySnapshot.docs[0].data().isChanged ){

                
                    if(histor_data.length > 0){

                        // Using a for loop to concatenate array elements into a string
                        let result = "";
                        for (let i = 0; i < histor_data.length; i++) {
                            result += histor_data[i]['location']
                            if (i !== histor_data.lengt - 1) {
                                result += ", " // Add a comma and space for separation 
                            }
                        }
                        console.log('here the result')
                        console.log(result)
                        handleGenerateText('Could you recommend five cities or countries for me based on my previous searches? My previous searches for ' + result + '.' + 'provide to me the name and some description about city or country. return to me list of json response', querySnapshot)
                        console.log('we are in the generatText with data')
                    }else{

                        handleGenerateText('Could you recommend five cities or countries for me based on populartie.' + 'provide to me the name and some description about city or country. return to me list of json response', querySnapshot)
                        console.log('we are in the generatText without data :(')
                    }
                }else{
                    // fetch from the use the data 
                    setSuggestLocation( querySnapshot.docs[0].data().basedLove)
                    console.log('we are fetch the data from the firebase')
                    setIsLoadingSug(false)
                }
                
                
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
            {/* when clicked moved to page suggestion and load the suggestion */}
            {   
                listOfHistory.length == 0 && isLoading ? <h3 className='no_history'> -ˏˋ⋆ No locations saved yet. Explore new destinations that speak to your interests! ⋆ˊˎ- </h3> : 
                listOfHistory.map( (loc,index) =>(
                    <Location nameLocation={loc.location} numDays={loc.days} dataLocation={loc.whatDoing} key={index} />
                ) )
            }
            
        </div>
        <div className='line'></div>
        <div className="container_based_search">
            <div className='header'>
                <div className='line'></div>
                <h1 className='title'>Based Search</h1>
            </div>
            <h2 className='subTitle'>Unsure where to start? We've got you covered. <br/>Discover your next favorite spot with Compass Curious.</h2>
            <div className='line'></div>
            <div className="container_data_sug">
            {isLoadingSug && <img src='https://i.pinimg.com/originals/61/24/16/6124164e5582efe0c5d11fc85b263437.gif' alt='loading_gif' className='loading'/>}   
            {   
                suggestLocation.length == 0 && isLoadingSug ? <h3 className='no_history'> -ˏˋ⋆ we are fetch the data from the server ⋆ˊˎ- </h3> : 
                suggestLocation.map( (loc,index) =>(
                    <LocationTrend url={loc.url} nameLocation={loc.location_name} dataLocation={loc.description} key={index + 100} />
                ) )
            }
            </div>
        </div>
    </div>
)
}

export default History