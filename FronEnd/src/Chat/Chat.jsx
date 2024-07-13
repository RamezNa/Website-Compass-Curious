import {useState, useEffect, useRef} from 'react'
import {generateText} from '../component/setting'
import {parseContent, generateTravelInfo} from './TextPretty'
import {defaultContainerChat} from '../component/setting'
import './chat.css'

const Chat = () => {

    
    const [container, setContainer] = useState( () => {
        const storedData = localStorage.getItem('containerChat')
        if(storedData == null) return defaultContainerChat
        
        return (JSON.parse(storedData))
        // return defaultContainerChat
    } )

    const [lastUserRequest, setLastUserRequest] = useState('')

    const [letter,setLetter] = useState('')

    const caretFocus = useRef(null);

    const handleKeyboardInterupt = async (event) => {
        if (event.key === 'Enter') {
            await handleRequest();
        }else if (event.key === 'ArrowUp'){
            setLetter(lastUserRequest)
            setTimeout( () =>{
                if (caretFocus.current) {
                    caretFocus.current.focus();
                    caretFocus.current.setSelectionRange(lastUserRequest.length, lastUserRequest.length);
                }
            },0 )
            
        }
    }

    const handleRequest = async () => {
        setLastUserRequest(letter)

        const responceUser = {'letter': letter, 'who': 'userRespone'}
        setContainer( prevCont =>  [...prevCont, responceUser ])
        
        setLetter('')

        const choiceThePrompt = 'You are a knowledgeable travel assistant. Answer the following question related to travel, countries, cities, or locations. Provide informative and engaging responses that include useful tips, cultural insights, and any relevant details to help the user plan their travel or learn about the destination.\n\nUser Query: ' + letter

        let response = ''
        try{
            response =  await generateText( choiceThePrompt , false) //'could you help me to respone on the request whithout asking for more information. ' +
        }catch(error){
            response = 'Oops! Something went off course. Try again and let Compass Curious steer you right!'
        }
        
        const responceChat = {'letter': response, 'who': 'chatRespone'}

        
        setContainer( prevCont =>  [...prevCont, responceChat])
    }

    // This function help me to display a clear response 
    const handleprettyText = (str) => {
        const ispretty = parseContent(str) 
        if( !ispretty ){
            return str
        }

        return generateTravelInfo(ispretty)
    }

    // To focuse on the last li
    const lastLiRef = useRef(null)

    useEffect( () => {
        const goTo = () => {
            // Focus on the last <li> element when the component mounts or updates
            if (lastLiRef.current) {  
                // lastLiRef.current.scrollTop = lastLiRef.current.scrollHeight;
                lastLiRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }

            localStorage.setItem('containerChat', JSON.stringify(container))
          
        }
        
        goTo()
    }, [container] )

    const handleRequestNewConversation = () => {
        setContainer(defaultContainerChat)
    }


    return(
        <div className='chat'>
            <ul className='containerChat' >
                {container.map( (letter, index)=>(
                    <li ref={index === container.length - 1 ? lastLiRef : null} className={letter.who} key={index} > { ( (letter.who == 'chatRespone') && (index != 0) ) ? handleprettyText(letter.letter) : letter.letter } </li>
                ) )}
            </ul>
            <div className='containerSend'>
                <input ref={caretFocus} className='ask' type="text" value={letter} onChange={ (event) => setLetter(event.target.value) } onKeyDown={handleKeyboardInterupt} placeholder='Got A Question? Enter It Here!' required/>
                <div className="containerIcons">
                    <span className='iconSend' onClick={handleRequest} >➤</span>
                    <span className='iconNew' onClick={handleRequestNewConversation} >+</span>
                </div>
                
            </div>
            
        </div>
    )



}

export default Chat