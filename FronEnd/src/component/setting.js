import API_KEY from './Code/giminiApi'
import { GoogleGenerativeAI } from "@google/generative-ai"

// ******************************************************************************
// TODO change the server
// the server Ip
const server = 'http://0.0.0.0:8000'

// ******************************************************************************

// function that wait to specific time like wait
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ******************************************************************************

// Gimini generate section
const genAI = new GoogleGenerativeAI(API_KEY);
// GImini function generate text
const generateText = async (prompt) => {
    // gimini code work to get the respone
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig:{"response_mime_type": "application/json"}})
    const result = await model.generateContent(prompt)
    const response = await result.response
    // convert the string to list json
    const res = JSON.parse(response.text())
    return res
}

// ******************************************************************************

// TODO add this file to all the componant 

export default {server, delay, generateText }