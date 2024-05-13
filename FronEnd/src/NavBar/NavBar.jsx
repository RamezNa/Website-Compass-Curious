// import images
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import logo_img from './Images/Logo.jpeg'

import user_white_offline from './Images/User_White_Offline.png'
import user_green_offline from './Images/User_Green_Offline.png'

import login_boy from './Images/User_Login_boy.png'
import login_girl from './Images/User_Login_girl.png'

import './navBar.css'

// make a Navbar Html
function NavBar(){

    const [isHovered, setIsHovered] = useState(false);
    

    const navigate = useNavigate();

    // Function to handle mouse enter event
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    // Function to handle mouse leave event
    const handleMouseLeave = () => {
        setIsHovered(false);
    };


    const [isNavBarClicked, setIsNavBarClicked] = useState(false);

    const handleNavBarIconClicked = () => {
        setIsNavBarClicked(!isNavBarClicked)
    }


    // function to handle if the trend in the same page or not
    const scrollToSection = (event) => {

        const targetId = event.target.getAttribute('href').substring(1) 
        const targetElement = document.getElementById(targetId)
    
        if (targetElement) {
          event.preventDefault(); 
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth' 
          })
        }else{
            setTimeout(() => {
                navigate('/'); 
                setTimeout(() => {
                    const targetElement1 = document.getElementById(targetId)
                    window.scrollTo({
                        top: targetElement1.offsetTop,
                        behavior: 'smooth'
                    })
                }, 100)
            }, 100)
        }
      };

    return <>
    <div className='show_unshow_navbar' onClick={handleNavBarIconClicked}>
        <div className={!isNavBarClicked ? 'line' : 'line clicked'} ></div>
        <div className={!isNavBarClicked ? 'line' : 'line clicked'}></div>
        <div className={!isNavBarClicked ? 'line' : 'notLine'}></div>
    </div>  
    <nav className={!isNavBarClicked ? 'nav_bar hiden_nav_bar' : 'nav_bar'}>  
        <ul className='container_nav_bar'>
            <li>
                <Link to="/" >
                    <img className='logo_img' src={logo_img} alt="Logo" />
                </Link>    
            </li>
            <li>
                <Link to="/" className="href_text" >Main</Link>
            </li>
            <li>
                <a className="href_text" href="#Trend" onClick={scrollToSection} >Trend</a>
            </li>
            <li >
                <Link to="/Login" >
                    <img className='login_img' src={ !isHovered ? user_white_offline : user_green_offline } alt="Login" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                </Link>
            </li>
        </ul>    
    </nav>
    </>
}
    
export default NavBar