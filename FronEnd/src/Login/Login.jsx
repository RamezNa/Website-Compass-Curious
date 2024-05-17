import { Link } from "react-router-dom"
import { useState } from "react"
// TODO use the useState for the password and the email :) 

import './login.css'

function Login(){
    return(
    <>
    <div className="login">
        <div className="container_left">
            <h1 className="title">Compass Curious Awaits!</h1>
            <h2 className="subTitle">Login To Start Exploring The World</h2>
        </div>
        <div className="container_right">
            <h3 className="title">Login</h3>
            <p className="description"> New to Compass Curious?<br/><Link className="clickable" onClick={/*TODO */ 1} to="/TODO">Sign up</Link> for free to unlock a world of travel inspiration. </p>
            <form className="login_form" onSubmit="">
                <label className="label_for_box">Email</label>
                <input className="box_input" type="email" required/>

                <label className="label_for_box">Password</label>
                <input className="box_input" type="password" required/>

                <button type="submit"> Login </button>
            </form>
            <p className="description last"> Forgot your password?<br/>No worries! <Link className="clickable" onClick={/*TODO */ 1} to="/TODO">Click here</Link> to reset it </p>
        </div>

    </div>
    </>
    )
}
    
export default Login