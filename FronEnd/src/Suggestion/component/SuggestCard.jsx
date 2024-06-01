import { Link, Element } from 'react-scroll';
import { useState } from 'react';

function SuggestCard({which_day, url, location_name, description, numDays  }){
    const [isLoading, setIsLoading] = useState(false)

    return(
        <Element className="container_data" name={String(which_day)} >
            <div className='container_day'>
                { which_day-1 < 1 ? '' : <Link to={ String(which_day-1) } smooth={true} duration={500} className='left'>⇠</Link>}
                <div className='line'></div>
                <h3 className='day'>{which_day} Day</h3>
                { which_day+1 > numDays ? '' : <Link to={ String(which_day+1) } smooth={true} duration={500} className='right'>⇢</Link>}
            </div>
            <div className='container_img_data'>
                {!isLoading && <img src='https://i.gifer.com/ZKZg.gif' alt='loading_gif' className='loading'/>}
                <img src={url} alt={location_name} className='img' onLoad={() => setIsLoading(true)} />
                <div className='data'>
                    <h3 className='title'>{location_name} </h3>
                    <p className='description'>{description} <a href="" className='clickable'>Read More...</a></p>
                </div>
            </div>
        </Element>
    )
}

export default SuggestCard