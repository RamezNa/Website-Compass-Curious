import { Route, Routes } from "react-router-dom"
import NavBar from "./NavBar/NavBar"
import MainPage from "./MainPage/MainPage"
import Login from "./Login/Login"
import History from "./History/History"
import Suggestion from "./Suggestion/Suggestion"
import SignUp from "./Login/SignUp/SignUp"
import Forget from "./Login/Forget/Forget"
import Footer from "./Footer/Footer"

function App(){
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
            </Routes>
            <Footer />
        </>
    )
}

export default App