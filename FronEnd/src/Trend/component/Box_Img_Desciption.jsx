import { useState } from "react"

import { useNavigate } from 'react-router-dom';

// when click on the component make to me the suggestion with the number_of_days and name_location :)
function Box_Img_Description({class_, number ,number_of_days, name_location, description, url, server  }){

    const [select, setSelect] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate()

    const handle_new_suggestion = async () =>{

        try{
            fetch(`${server}/trend/${name_location}/${number_of_days[select]}`)
            .then(data => {
                console.log(data);
            })
        }catch (error) {
            console.error("Error fetching from server: ", error)
        }
        navigate('/Suggestion', {state: {location: (name_location), numdays: number_of_days[select], isHistory: false , data_: [] }})
        window.scrollTo( { top: 0, behavior: 'smooth' } );
    }
    
    return(
        <>
        {/*onClick we move to page suggestion*/}
        <div className={'container_trend ' + class_} >
            <div className='container_img_and_number'>
                <div className="container_number">
                    <p className='number'>{number}</p>
                </div>
                <div className="container_img">
                    {isLoading && <img src='https://i.pinimg.com/originals/61/24/16/6124164e5582efe0c5d11fc85b263437.gif' alt='loading_gif' className='loading'/>}
                    <img className='img_location' src={url} alt={name_location} onLoad={() => setIsLoading(false)} />
                    <div className="aligment">
                        <h1 className='name_location' onClick={handle_new_suggestion} >{name_location}</h1>
                        <div className="container_days">
                            {select == 0 ? <></> : <span className="icon" onClick={() => setSelect(select-1)}>↜</span>}
                            <h2 className='number_days' onClick={handle_new_suggestion} >{number_of_days[select]} Days</h2>
                            {select < number_of_days.length-1  ? <span className="icon" onClick={() => setSelect(select+1)}>↝</span> : <></> }
                        </div> 
                    </div>
                </div>

            </div>
            <p className="description">
                {description}
            </p>
        </div>
        </>
    )
}

export default Box_Img_Description