import '../login.css'
import { useState } from 'react'

function Forget(){

    const[email,setEmail] = useState('')
    const handleEmail = (event) =>{
        setEmail(event.target.value)
    }
    // TODo add button to return to login
    return(
    <div className="forget">
        <div className="container_left">
            <h1 className="title">Forgot your way?</h1>
            <h2 className="subTitle">Reset your password and get back on track with Compass Curious. </h2>
        </div>
        <div className="container_right">
            <h3 className="title"> Reset Password</h3>
            {/* TODO Make someting when make Forget :) onSumbit */}
            <form className="forget_form" onSubmit="">
                <label className="label_for_box">Email</label>
                <input className="box_input" type="email" value={email} onChange={handleEmail} required/>
                <button type="submit"> Reset </button>
            </form>
        </div>
    </div>
    )
}

export default Forget