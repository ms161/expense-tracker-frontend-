import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate()
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    console.log(formData)

    const loginHandle = async (e) => {
        try {
            e.preventDefault()
            const resp = await axios.post('http://localhost:5000/login', formData)
            console.log('this is token', resp.data.token)
            localStorage.setItem('token', resp.data.token)
            if (resp.status === 200) {
                navigate('/add-expense')
            }
        }
        catch (err) {
            setError(err.response.data.message)
            console.log(err)
        }

    }
    useEffect(() => {

    })

    return (
        <>
            <NavBar />
            <h1 className="flex "></h1>
            <form onSubmit={loginHandle} className="flex flex-col m-auto justify-center gap-y-9 mt-10 " action="">
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
                <button className='bg-green-500 w-20 m-auto rounded-md p-3 text-white' type='submit'>Log In</button>
                <button className='bg-red-400  m-auto rounded-md p-3 text-white font-bold ' type='submit'>
                    <Link to='/forget-password'>
                        Forget Password?
                    </Link>
                </button>

            </form>
        </>
    );
}

export default LoginPage;
