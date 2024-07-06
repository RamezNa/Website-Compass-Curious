import { Link, Element } from 'react-scroll';
import { useState } from 'react';

function SuggestCard({which_day, url, location_name, description, numDays, full_data, map, whereIs  }){
    const [isLoading, setIsLoading] = useState(false)
    const [isClicked, setIsClicked] = useState(false)

    const move_to_url = () =>{
        window.open(map, '_blank', 'noopener,noreferrer');
    }
    // TODO add the  the where to the suggestion 
    return(
        // TODO add to the title icon to save it
        <Element className="container_data" name={String(which_day)} >

            <div className='container_day'>
                {whereIs == null ? <></> : <h3 className='where'>{whereIs}</h3>}

                { which_day-1 < 1 ? '' : <Link to={ String(which_day-1) } smooth={true} duration={500} className='left'>↜</Link>}
                <div className='line'></div>
                <h3 className='day'>{which_day} Day</h3>
                { which_day+1 > numDays ? '' : <Link to={ String(which_day+1) } smooth={true} duration={500} className='right'>↝</Link>}
            </div>
            
            <div className='container_img_data'>
                {!isLoading && <img src='https://i.pinimg.com/originals/61/24/16/6124164e5582efe0c5d11fc85b263437.gif' alt='loading_gif' className='loading'/>}
                <img src={url} alt={location_name} className='img' onLoad={() => setIsLoading(true)} />
                <div className='data'>
                    <h3 className='title' onClick={move_to_url}>{location_name} </h3>
                    {isClicked ? <p className='description'>{full_data} </p> : 
                        <p className='description'>{description} {description.length == full_data.length ? <></> : <a className='clickable' onClick={ () => setIsClicked(true) }>Read More...</a>}</p>
                    }
                </div>
            </div>
            
        </Element>
    )
}

export default SuggestCard