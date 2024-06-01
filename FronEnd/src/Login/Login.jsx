import { Link } from "react-router-dom"
import { useState,useEffect } from "react"

import { useNavigate } from 'react-router-dom';

import {signInWithEmailAndPassword} from 'firebase/auth'
import {auth} from '../Firebase/firebase'


import './login.css'

function Login(){

    const navigate = useNavigate();

    const[email,setEmail] = useState('')

    const[password,setPassword] = useState('')

    const[error_message,setError_message] = useState('')

    const handleMoveSignInPage = (event) =>{
        event.preventDefault()
        navigate('/SignUp')
    }

    const handleMoveForgetPage = (event) =>{
        event.preventDefault()
        navigate('/Forget')
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        try{
            await signInWithEmailAndPassword(auth,email,password)
            navigate('/')
        }catch(error){
            setError_message(error.message)
            console.error(error)
        }
    }

    useEffect( ()=>{
        const unsubscribe = auth.onAuthStateChanged(() => {
            try {
                if( auth?.currentUser?.email != undefined ){
                    navigate('/')
                }
                 
            } catch (error) {
                console.error(error);
            }  
        });
       
        return () => unsubscribe();

      }, [])
    
    return(
    <>
    <div className="login">
        <div className="container_left">
            <h1 className="title">Compass Curious Awaits!</h1>
            <h2 className="subTitle">Login To Start Exploring The World</h2>
        </div>
        <div className="container_right">
            <h3 className="title">Login</h3>
            <p className="description"> New to Compass Curious?<br/><Link className="clickable" onClick={handleMoveSignInPage} >Sign up</Link> for free to unlock a world of travel inspiration. </p>
            <form className="login_form" onSubmit={handleLogin}>
                <label className="label_for_box">Email</label>
                <input className="box_input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder='example@gmail.com' required/>

                <label className="label_for_box">Password</label>
                <input className="box_input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder='*****' required/>
                <p className='error_Message'>{(error_message.length > 0) ? 'Error: Incorrect Email or Password. Please check and try again.' : ""}</p>
                <button type="submit"> Login </button>
            </form>
            <p className="description"> Forgot your password?<br/>No worries! <Link className="clickable" onClick={handleMoveForgetPage} >Click here</Link> to reset it </p>
        </div>

    </div>
    </>
    )
}
    
export default Login