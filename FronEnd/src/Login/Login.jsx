import { Link } from "react-router-dom"
import { useState } from "react"

import { useNavigate } from 'react-router-dom';


import './login.css'

function Login(){

    const navigate = useNavigate();

    const[email,setEmail] = useState('')
    const handleEmail = (event) =>{
        setEmail(event.target.value)
    }

    const[password,setPassword] = useState('')
    const handlePassword = (event) =>{
        setPassword(event.target.value)
    }

    const handleMoveSignInPage = (event) =>{
        event.preventDefault()
        navigate('/SignIn')
    }

    const handleMoveForgetPage = (event) =>{
        event.preventDefault()
        navigate('/Forget')
    }

    return(
    <>
    <div className="login">
        <div className="container_left">
            <h1 className="title">Compass Curious Awaits!</h1>
            <h2 className="subTitle">Login To Start Exploring The World</h2>
        </div>
        <div className="container_right">
            <h3 className="title">Login</h3>
            <p className="description"> New to Compass Curious?<br/><Link className="clickable" onClick={handleMoveSignInPage} to="/TODO">Sign up</Link> for free to unlock a world of travel inspiration. </p>
            {/* TODO Make someting when make login :) onSumbit */}
            <form className="login_form" onSubmit="">
                <label className="label_for_box">Email</label>
                <input className="box_input" type="email" value={email} onChange={handleEmail} required/>

                <label className="label_for_box">Password</label>
                <input className="box_input" type="password" value={password} onChange={handlePassword} required/>
                <button type="submit"> Login </button>
            </form>
            <p className="description"> Forgot your password?<br/>No worries! <Link className="clickable" onClick={handleMoveForgetPage} to="/TODO">Click here</Link> to reset it </p>
        </div>

    </div>
    </>
    )
}
    
export default Login