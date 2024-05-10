import { Route, Routes } from "react-router-dom"
import NavBar from "./NavBar/NavBar"
import MainPage from "./MainPage/MainPage"
import Login from "./Login/Login"
import History from "./History/History"
import Suggestion from "./Suggestion/Suggestion"


function App(){
    return(
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/History" element={<History />} />
                <Route path="/Suggestion" element={<Suggestion />} />
            </Routes>
        </>
    )
}

export default App