import { useState } from "react"
// TODO when click on the component make to me the suggestion with the number_of_days and name_location :)
function Box_Img_Description({class_, number ,number_of_days, name_location, description, url }){
    const [select, setSelect] = useState(0)
    
    return(
        <>
        {/*TODO onClick move to page suggestion*/}
        <div className={'container_trend ' + class_} >
            <div className='container_img_and_number'>
                <div className="container_number">
                    <p className='number'>{number}</p>
                </div>
                <div className="container_img">
                    <img className='img_location' src={url} alt={name_location} />
                    <div className="aligment">
                        <h1 className='name_location'>{name_location}</h1>
                        <div className="container_days">
                            {select == 0 ? <></> : <span className="icon" onClick={() => setSelect(select-1)}>↜</span>}
                            <h2 className='number_days'>{number_of_days[select]} Days</h2>
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