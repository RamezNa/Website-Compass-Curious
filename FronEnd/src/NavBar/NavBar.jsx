// import images
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth, db } from '../Firebase/firebase';
import {signOut} from 'firebase/auth'
import { collection, query, where, getDocs} from 'firebase/firestore'

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

        if(isNavBarClicked){
            handleNavBarIconClicked()
        }
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

      const [gend,setGend] = useState('')

      const Logout = async () => {
        try {
            await signOut(auth)
            setGend('')
            navigate('/')
        } catch (error) {
            console.error(error)
        }
      }

      useEffect( ()=>{
        const handleGetGender =  () => {
            setTimeout( async() =>{
                try {
                    const em = auth?.currentUser?.email
                    if(em == undefined){
                        return
                    }
                    const q = query(collection(db, '_users'), where('email', '==', em));
                    const querySnapshot = await getDocs(q);
                    setGend(querySnapshot.docs[0].data().gender)
                  
                } catch (error) {
                    console.error(error.message);
                }
            }, 1000)
          };

          handleGetGender()
      }, [])

    return <>
    <div className={!isNavBarClicked ? 'show_unshow_navbar' : 'show_unshow_navbar clicked_btn'} onClick={handleNavBarIconClicked}>
        <div className={!isNavBarClicked ? 'line' : 'line clicked'} ></div>
        <div className={!isNavBarClicked ? 'line' : 'line clicked'}></div>
        <div className={!isNavBarClicked ? 'line' : 'notLine'}></div>
    </div>  
    <nav className={!isNavBarClicked ? 'nav_bar hiden_nav_bar' : 'nav_bar'}> 
        <ul className='container_nav_bar'>
            <li>
                <Link to="/" >
                    <img className='logo_img' src={logo_img} alt="Logo" onClick={handleNavBarIconClicked} />
                </Link>    
            </li>
            <li>
                {/* <Link to="/" className="href_text" >Main</Link> */}
                <a className="href_text" href="#Main" onClick={scrollToSection} >Main</a>
            </li>
            <li>
                <a className="href_text" href="#Trend" onClick={scrollToSection} >Trend</a>
            </li>
            <li >
                <Link to={ (auth?.currentUser?.email == undefined) ? "/Login" : "/History" } >
                    <Img_Hover url_hovered={ (auth?.currentUser?.email == undefined) ? user_green_offline : null } url_unHovered={ (auth?.currentUser?.email == undefined) ? user_white_offline : ( (gend == 'male') ? login_boy :login_girl )  } class_name={'login_img'} alt_name={"Login"} onClick={handleNavBarIconClicked} />
                </Link>
               
            </li>
        </ul> 
        {(auth?.currentUser?.email != undefined) && <p className='LogOut' onClick={Logout}>✧ LogOut ✧</p>   }
        
    </nav>

    </>
}
    
export default NavBar