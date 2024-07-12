// import images
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth, db } from '../Firebase/firebase';
import {signOut} from 'firebase/auth'
import { collection, query, where, getDocs} from 'firebase/firestore'

import Img_Hover from '../component/Img_Hover'

import './navBar.css'

import logo_img from './Images/Logo.jpeg'

// make a Navbar Html
function NavBar(){
    const user_white_offline = 'https://cdn-icons-png.freepik.com/512/152/152533.png?ga=GA1.1.940078363.1718183127'
    const user_green_offline = 'https://cdn-icons-png.freepik.com/512/248/248928.png?ga=GA1.1.940078363.1718183127'

    const login_boy = 'https://cdn-icons-png.freepik.com/512/2822/2822323.png'
    const login_girl = 'https://cdn-icons-png.freepik.com/512/2822/2822329.png'

    const navigate = useNavigate();

    const [isNavBarClicked, setIsNavBarClicked] = useState(false);

    const handleNavBarIconClicked = () => {
        setIsNavBarClicked(!isNavBarClicked)
        window.scrollTo( { top: 0, behavior: 'smooth' } )
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
      const [displaySureLogout, setDisplaySureLogout] = useState(false)


      const Logout = async () => {
        
        try {
            await signOut(auth)
            setGend('')
            navigate('/')
            setDisplaySureLogout(false)
            window.scrollTo( { top: 0, behavior: 'smooth' } );
        } catch (error) {
            console.error(error)
        }
      }

      const [isLoading,setIsLoading] = useState(true)
      

      useEffect( ()=>{

        const unsubscribe = auth.onAuthStateChanged(async () => {
            try {
                const em = auth?.currentUser?.email
                if(em == undefined){
                    setIsLoading(false)
                    return 
                }
                const q = query(collection(db, '_users'), where('email', '==', em));
                const querySnapshot = await getDocs(q);
                setGend(querySnapshot.docs[0].data().gender)
                setIsLoading(false)
            } catch (error) {
                console.error(error);
            }  
        });
       
        return () => unsubscribe();

      }, [])
    
    return <>
        {/* The alert code */}
        {displaySureLogout ? 
            <div className="containerAlert">
                <div className="letterAllert"> 
                    <h4 class='paragraph'>Are you sure you want to logout?</h4>
                    <div className='containerYesOrNo'>
                        <span className='yesIcon' onClick={ Logout }>✔</span>
                        <span className='noIcon' onClick={ () => setDisplaySureLogout(false)  }>✘</span>    
                    </div> 
                </div>
            </div>
        :
            <></>
        }
    
        {/* The Main Code */}
        <div className={!isNavBarClicked ? 'show_unshow_navbar' : 'show_unshow_navbar clicked_btn'} onClick={handleNavBarIconClicked}>
            <div className={!isNavBarClicked ? 'line' : 'line clicked'} ></div>
            <div className={!isNavBarClicked ? 'line' : 'line clicked'}></div>
            <div className={!isNavBarClicked ? 'line' : 'notLine'}></div>
        </div>  
        <nav className={!isNavBarClicked ? 'nav_bar hiden_nav_bar' : 'nav_bar'}> 
            <ul className='container_nav_bar'>
                <li>
                    <Link to="/Chat" >
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
                    <Link to={ (auth?.currentUser?.email == undefined) ? "/Login" : "/History" } onClick={handleNavBarIconClicked} >
                        {isLoading ? <img src='https://i.pinimg.com/originals/61/24/16/6124164e5582efe0c5d11fc85b263437.gif' alt='loading_gif' className='loading'/> :
                        <Img_Hover url_hovered={ (auth?.currentUser?.email == undefined) ? user_green_offline : null } url_unHovered={ (auth?.currentUser?.email == undefined) ? user_white_offline : ( (gend == 'male') ? login_boy :login_girl )  } class_name={'login_img'} alt_name={"Login"} onClick={handleNavBarIconClicked} />
                        }
                    </Link>
                    {(auth?.currentUser?.email != undefined) && <p className='LogOut' onClick={() => setDisplaySureLogout(true) }>✧ LogOut ✧</p>   }
                </li>
            </ul> 
            
            
        </nav>

    </>
}
    
export default NavBar