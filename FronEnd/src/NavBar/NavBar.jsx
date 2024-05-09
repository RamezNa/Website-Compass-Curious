// import images
import logo_img from './Images/Logo.jpeg'
import user_offline from './Images/User_Offline.png'
import './navBar.css'


// make a Navbar Html
function NavBar(){
    return <>
    <nav className="nav_bar">
        
        <ul className='container_nav_bar'>
            <li>
                <img className='logo' src={logo_img} alt="Logo" />
            </li>
            <li>
                <a className="href_text" >Main</a>
            </li>
            <li>
                <a className="href_text" >Trend</a>
            </li>
            <li>
                <img src={user_offline} alt="Login" />
            </li>
        </ul>
        
    </nav>

    </>
}
    
export default NavBar