import '../login.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {auth , db} from '../../Firebase/firebase'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {doc, setDoc, getDoc} from 'firebase/firestore'


function SignUp(){
    
    const navigate = useNavigate()
    
    const handleNav = (event) => {
        event.preventDefault()
        // move to the Login page
        navigate('/Login')
    }

    const[email,setEmail] = useState('')


    const[password,setPassword] = useState('')    

    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
    };

    const[error_message,setError_message] = useState('')

    const signUp = async (event) =>{
        event.preventDefault()
        try {
            // make the email and the password for the user
            const userCond = await createUserWithEmailAndPassword(auth, email, password)
            // save in the firestore the data :)
            const user = userCond.user
            await setDoc(doc(db, '_users',user.uid),{email: user.email, gender: selectedOption,history: []})
            // move to the Main page
            navigate('/') 
        } catch (error) {
            setError_message(error.message)
            console.error('Error during sign-in:', error);
        }
    }

    //TODO make something that check if is login cant go to LOGIN page or SignUp Or Rest PassWord
    useEffect(() =>{
        if( auth?.currentUser?.email != undefined ){
            navigate('/')
        }
    },[])

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
                <input className="box_input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder='example@gmail.com' required/>

                <label className="label_for_box">Password</label>
                <input className="box_input" type="password" value={password} minLength='6' onChange={(event) => setPassword(event.target.value)} placeholder='*****' required/>
                
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
                <p className='error_Message'>{(error_message.length > 0) ? 'Error: Looks Like This Email Address Is Already Signed Up!' : ""}</p>
                <button type="submit"> Sign Up </button>
            </form>
        </div>
    </div>
    )
}

export default SignUp