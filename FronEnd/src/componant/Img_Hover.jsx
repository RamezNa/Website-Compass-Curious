import { useState } from 'react';

const Img_Hover= ( {url_hovered , url_unHovered, class_name, alt_name } ) => {

    const [isHovered, setIsHovered] = useState(false);

    // Function to handle mouse enter event
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    // Function to handle mouse leave event
    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return <img className={class_name} src={ !isHovered ? url_unHovered : url_hovered } alt={alt_name} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
}

  

export default Img_Hover