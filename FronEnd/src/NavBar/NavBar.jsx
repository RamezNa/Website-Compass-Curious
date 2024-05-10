// import images
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

import logo_img from './Images/Logo.jpeg'
import user_offline from './Images/User_Offline.png'
import './navBar.css'

// make a Navbar Html
function NavBar(){
    const navigate = useNavigate();

    // function to handle if the trend in the same page or not
    const scrollToSection = (event) => {

        const targetId = event.target.getAttribute('href').substring(1) 
        const targetElement = document.getElementById(targetId)
    
        if (targetElement) {
        console.log("we are in the Wring side")
          event.preventDefault(); 
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth' 
          })
        }else{
            console.log("we are in the right side")
            
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
    <nav className="nav_bar">    
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
                    <img className='login_img' src={user_offline} alt="Login" />
                </Link>
            </li>
        </ul>    
    </nav>
    </>
}
    
export default NavBar