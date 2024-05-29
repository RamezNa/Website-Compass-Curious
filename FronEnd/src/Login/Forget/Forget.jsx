import '../login.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../Firebase/firebase'
import {sendPasswordResetEmail} from 'firebase/auth'

function Forget(){
    const navigate = useNavigate()
    const handleNav = (event) => {
        event.preventDefault()
        navigate('/Login')
    }

    const[email,setEmail] = useState('')
    const[error_message,setError_message] = useState('')

    const handleReset = async(event) => {
        event.preventDefault()
        try {
           await sendPasswordResetEmail(auth,email) 
           navigate('/Login')//navigate('/') TODO check if we need to move to login page or the main  
        } catch (error) {
            setError_message(error.message)
            console.error(error)
        }
    }

    //TODO make something that check if is login cant go to LOGIN page or SignUp Or Rest PassWord
    useEffect(() =>{
        if( auth?.currentUser?.email != undefined ){
            navigate('/')
        }
    },[])

    return(
    <div className="forget">
        <div className="container_left">
            <h1 className="title">Forgot your way?</h1>
            <h2 className="subTitle">Reset your password and get back on track with Compass Curious. </h2>
        </div>
        <div className="container_right">
            <div className="container_back">
                <span className='icon_circule' onClick={handleNav}>⬅</span>
                <h3 className="title"> Reset Password</h3>
            </div>
            
            {/* TODO Make someting when make Forget :) onSumbit */}
            <form className="forget_form" onSubmit={handleReset}>
                <label className="label_for_box">Email</label>
                <input className="box_input" type="email" value={email} onChange={(event) =>setEmail(event.target.value)} placeholder='example@gmail.com' required/>
                <p className='error_Message'>{(error_message.length > 0) ? 'Error: Incorrect Email. Please check and try again.' : ""}</p>
                <button type="submit"> Reset </button>
            </form>
        </div>
    </div>
    )
}

export default Forget