import axios from "axios"
import { useState } from "react"
function ForgetPassword(){
const [email,setEmail]=useState('')
   
    const sendEmail=async (e)=>{
        e.preventDefault()
    const resp=await axios.post('http://localhost:5000/password/forget-password',{email:email})
    console.log(resp)


}

    return(
        <>
        <form onSubmit={sendEmail} className="m-auto text-center flex flex-col w-96 " action="">
            <label className="text-white mt-4 m-auto" htmlFor="email">Email</label>
            <input onChange={(e)=>{setEmail(e.target.value)}} className="p-2" id="email" placeholder="Enter your email " type="email" />
            <button className="text-white w-1/3 m-auto mt-5 bg-green-500 p-2 rounded-md">Send</button>
        </form>
        
        </>
    )
}
export default ForgetPassword
