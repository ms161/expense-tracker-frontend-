import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function AddExpense() {

    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        category: 'food',
    });
    const [expenses, setExpenses] = useState([])

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

    const postExpense = async (e) => {
        try {

            e.preventDefault()
            const resp = await axios.post('http://localhost:5000/expense/postExpense', formData)
            console.log(resp)
            if (resp.status === 201) {
                setExpenses((p) => {
                    return [...p, resp.data]
                })
            }
        }
        catch (err) {
            console.log(err)
        }

    }
    console.log(expenses)

    const getAllExpenses = async () => {
        try {

            const resp = await axios.get('http://localhost:5000/expense/getExpenses')
            console.log(resp.data)
            setExpenses((p) => {
                return [...resp.data]
            })
        }
        catch (err) {
            console.log(err)
        }


    }

    const deleteExpense=async (e,id)=>{
        try {
            e.target.parentNode.remove()
            const resp = await axios.post(`http://localhost:5000/expense/deleteExpense/${id}`)
            console.log(resp.data)
            
        }
        catch (err) {
            console.log(err)
        }

    }
    useEffect(() => {
        getAllExpenses()

    }, [])

    return (
        <>


            <form onSubmit={postExpense} className="flex flex-col m-auto justify-center gap-y-9 " action="">
                <input
                    className="border-b border-black w-96 m-auto p-3 mt-10"
                    type="Number"
                    placeholder="Enter Amount"
                    name="amount"
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    className="border-b border-black w-96 p-3 m-auto"
                    type="text"
                    placeholder="Description"
                    name="description"
                    value={formData.email}
                    onChange={handleChange}
                />
                <select className='w-96 m-auto p-3' onChange={handleChange} name="category" id="">
                    <option value="food">Food</option>
                    <option value="petrol">Petrol</option>
                    <option value="salary">Salary</option>
                </select>

                <button className='bg-green-500 w-32 font-bold m-auto rounded-md p-3 text-white' type='submit'>Add Expense</button>
            </form>
            {expenses.map(e => {
                return <div className='flex gap-x-52 justify-center p-3 bg-green-500 mt-4'>
                    <p className='text-white'>{e.amount}</p>
                    <p className='text-white'>{e.description}</p>
                    <p className='text-white'>{e.category}</p>
                    <button onClick={(el)=>{deleteExpense(el,e.id)}}  className='bg-red-500 p-2 rounded-md text-white'>Delete</button>
                </div>
            })}
        </>
    );
}

export default AddExpense;
