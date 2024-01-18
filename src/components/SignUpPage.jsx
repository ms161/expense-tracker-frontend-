import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
function SignUpPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('')

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
        }
        catch (err) {
            setError('User Already Exist')
            console.log(err)
        }

    }
    useEffect(() => {

    })

    return (
        <>
        <NavBar/>
            <h1 className="flex "></h1>
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
                <button className='bg-green-500 w-20 m-auto rounded-md p-3 text-white' type='submit'>Sign Up</button>
            </form>
        </>
    );
}

export default SignUpPage;
