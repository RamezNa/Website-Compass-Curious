import '../login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {auth} from '../../Firebase/firebase'
import {createUserWithEmailAndPassword} from 'firebase/auth'

function SignUp(){
    const navigate = useNavigate()
    const handleNav = (event) => {
        event.preventDefault()
        navigate('/Login')
    }

    const[email,setEmail] = useState('')
    const handleEmail = (event) =>{
        setEmail(event.target.value)
    }

    const[password,setPassword] = useState('')
    const handlePassword = (event) =>{
        setPassword(event.target.value)
    }

    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
    };

    const[error_message,setError_message] = useState('')

    const signUp = async (event) =>{
        event.preventDefault()
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            // TODO save in the firestore the data :)
            // TODO move to the main page 
            // TODO navigate Login
            console.log('User created successfully');
        } catch (error) {
            setError_message(error.message)
            console.error('Error during sign-in:', error);
        }
    }

    return(
    <div className="signUp">
        <div className="container_left">
            <h1 className="title">Ready for New Horizons?</h1>
            <h2 className="subTitle">Sign Up and let Compass Curious lead the way.</h2>
        </div>
        <div className="container_right">
            <div className="container_back">
                <span className='icon_circule' onClick={handleNav}>⬅</span>
                <h3 className="title">Sign Up</h3>
            </div>
            <form className="signIn_form" onSubmit={signUp}>
                <label className="label_for_box">Email</label>
                <input className="box_input" type="email" value={email} onChange={handleEmail} placeholder='example@gmail.com' required/>

                <label className="label_for_box">Password</label>
                <input className="box_input" type="password" value={password} minLength='6' onChange={handlePassword} placeholder='*****' required/>
                
                <label className="title_gender">Gender</label>
                <div className='container_gender'>
                    <label className={selectedOption === 'male' ? 'male' : ''}>
                        <input type="radio" name="gender" value="male" onChange={handleOptionChange} checked={selectedOption === 'male'} required />
                        ♂ Male
                    </label>
                    <label className={selectedOption === 'female' ? 'female' : ''}>
                        <input type="radio" name="gender" value="female" onChange={handleOptionChange} checked={selectedOption === 'female'} required/>
                        ♀ Female
                    </label>
                </div>
                <p className='error_Message'>{(error_message.length > 0) ? 'The Email Is Already Sign Up' : ""}</p>
                <button type="submit"> Sign Up </button>
            </form>
        </div>
    </div>
    )
}

export default SignUp