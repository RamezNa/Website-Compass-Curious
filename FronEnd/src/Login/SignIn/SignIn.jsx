import '../login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignIn(){
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

    return(
    <div className="signIn">
        <div className="container_left">
            <h1 className="title">Ready for New Horizons?</h1>
            <h2 className="subTitle">Sign in and let Compass Curious lead the way.</h2>
        </div>
        {/* Add icon to return to previous Login page */}
        <div className="container_right">
            <div className="container_back">
                <span className='icon_circule' onClick={handleNav}>⬅</span>
                <h3 className="title">Sign In</h3>
            </div>
            {/* TODO Make someting when make Sign In :) onSumbit */}
            <form className="signIn_form" onSubmit="">
                <label className="label_for_box">Email</label>
                <input className="box_input" type="email" value={email} onChange={handleEmail} required/>

                <label className="label_for_box">Password</label>
                <input className="box_input" type="password" value={password} onChange={handlePassword} required/>
                
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
                <button type="submit"> Sign In </button>
            </form>
        </div>
    </div>
    )
}

export default SignIn