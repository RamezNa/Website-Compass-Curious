import { Route, Routes, useLocation } from "react-router-dom"
import NavBar from "./NavBar/NavBar"
import MainPage from "./MainPage/MainPage"
import Login from "./Login/Login"
import History from "./History/History"
import Suggestion from "./Suggestion/Suggestion"
import SignUp from "./Login/SignUp/SignUp"
import Forget from "./Login/Forget/Forget"
import Footer from "./Footer/Footer"
import Chat from "./Chat/Chat"
import Trend from "./Trend/Trend"

function App(){
    const location = useLocation()

    return(
        <>
            <NavBar />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/History" element={<History />} />
                    <Route path="/Suggestion" element={<Suggestion />} />
                    <Route path="/SignUp" element={<SignUp />} />
                    <Route path="/Forget" element={<Forget />} />
                    <Route path="/Chat" element={<Chat />} />
                    <Route path="/Trend" element={<Trend />} />
                </Routes>
            {location.pathname == '/Chat' ? <></> : <Footer />}    
            
        </>
    )
}

export default App