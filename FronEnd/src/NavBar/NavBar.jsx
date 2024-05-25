// import images
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import logo_img from './Images/Logo.jpeg'

import user_white_offline from './Images/User_White_Offline.png'
import user_green_offline from './Images/User_Green_Offline.png'

import login_boy from './Images/User_Login_boy.png'
import login_girl from './Images/User_Login_girl.png'

import Img_Hover from '../component/Img_Hover'

import './navBar.css'
// TODO make the img of the login to change between the girl or boy or changed between login or not IMPORTANT
// make a Navbar Html
function NavBar(){

    const navigate = useNavigate();

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
    <div className={!isNavBarClicked ? 'show_unshow_navbar' : 'show_unshow_navbar clicked_btn'} onClick={handleNavBarIconClicked}>
        <div className={!isNavBarClicked ? 'line' : 'line clicked'} ></div>
        <div className={!isNavBarClicked ? 'line' : 'line clicked'}></div>
        <div className={!isNavBarClicked ? 'line' : 'notLine'}></div>
    </div>  
    <nav className={!isNavBarClicked ? 'nav_bar hiden_nav_bar' : 'nav_bar'}> 
        {/* TODO on click on the small bage to the some of the "<li>" close the navbar */}
        {/* TODO make the main clicked moved to the main search  */}
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
                    <Img_Hover url_hovered={user_green_offline} url_unHovered={user_white_offline} class_name={'login_img'} alt_name={"Login"} />
                </Link>
            </li>
        </ul>    
    </nav>
    </>
}
    
export default NavBar