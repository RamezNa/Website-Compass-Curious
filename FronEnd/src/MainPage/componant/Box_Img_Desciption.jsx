
// TODO when click on the componant make to me the suggestion with the number_of_days and name_location :)
function Box_Img_Description({class_, number ,number_of_days, name_location, description }){

    return(
        <>
        <div className={'container_trend ' + class_}>
            <div className='container_img_and_number'>
                <div className="container_number">
                    <p className='number'>{number}</p>
                </div>
                <div className="container_img">
                    <img className='img_location' src="https://cdn.britannica.com/92/177992-050-AED0DC28/Dome-of-the-Rock-Temple-Mount-Jerusalem.jpg" alt="" />
                    <h1 className='name_location'>{name_location}</h1>
                    <h2 className='number_days'>{number_of_days} Days</h2>
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