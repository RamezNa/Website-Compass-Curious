import { useState } from "react"

function Location( {url, nameLocation,numDays} ){

    const [isLoading, setIsLoading] = useState(false)

    return(
        <div className="data">
            {!isLoading && <img src='https://i.pinimg.com/originals/61/24/16/6124164e5582efe0c5d11fc85b263437.gif' alt='loading_gif' className='loading'/>}
            <img className="img" src={url} alt={nameLocation} onLoad={() => setIsLoading(true)}  />
            <div className="aligment">
                <h3 className="name_location">{nameLocation}</h3>
                <p className="num_day">{numDays} {numDays > 1 ? 'Days' : 'Day'} </p>
            </div>
        </div>
    )
}

export default Location