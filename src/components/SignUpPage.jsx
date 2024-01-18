import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
function SignUpPage() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('')
    const [accCreatedMessage, setAccCreatedMessage] = useState(false)
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    console.log(formData)

    const signUpHandle = async (e) => {
        try {

            e.preventDefault()
            const resp = await axios.post('http://localhost:5000/sign-up', formData)
            console.log(resp)
            if (resp.status === 201) {
                setAccCreatedMessage('Account Created')
                setError(false)
                setTimeout(() => {
                    setAccCreatedMessage(false)

                }, 5000);
                // navigate('/login')
            }
        }
        catch (err) {
            setError('User Already Exist')
            console.log(err)
        }

    }
    useEffect(() => {
        setTimeout(() => {

        }, 4000);
    })

    return (
        <>
            <NavBar />

            <form onSubmit={signUpHandle} className="flex flex-col m-auto justify-center gap-y-9 mt-10 " action="">
                <input
                    className="border-b border-black w-96 m-auto p-3"
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    className="border-b border-black w-96 p-3 m-auto"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    className="border-b border-black w-96 p-3 m-auto"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                {error && <p className='text-red-600 font-bold m-auto'>{error}</p>}
                {accCreatedMessage && <h1 className='text-green-600 font-bold m-auto'>{accCreatedMessage}</h1>}
                <button className='bg-green-500 w-20 m-auto rounded-md p-3 text-white' type='submit'>Sign Up</button>
            </form>
        </>
    );
}

export default SignUpPage;
