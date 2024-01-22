import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function AddExpense() {

    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        category: 'food',
    });
    let token=localStorage.getItem('token')
    let isPremium1=parseJwt(token).ispremiumuser
    const [expenses, setExpenses] = useState([])
   
    const [isPremium,setIsPremium]=useState(isPremium1)
   const [leaderBoardData,setLeaderboardData]=useState([])
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
            const token = localStorage.getItem('token')
            const resp = await axios.post('http://localhost:5000/expense/postExpense', formData, { headers: { 'auth': token } })
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
            const token = localStorage.getItem('token')
            const resp = await axios.get('http://localhost:5000/expense/getExpenses', { headers: { 'auth': token } })
            console.log(resp.data)
            setExpenses((p) => {
                return [...resp.data]
            })
        }
        catch (err) {
            console.log(err)
        }


    }

    const deleteExpense = async (e, id) => {
        try {
            e.target.parentNode.remove()
            const token = localStorage.getItem('token')

            const resp = await axios.delete(`http://localhost:5000/expense/deleteExpense/${id}`, { headers: { 'auth': token } })
            console.log(resp.data)
          

        }
        catch (err) {
            console.log(err)
        }

    }

    const handlePayment = async (e) => {
        const token = localStorage.getItem('token')
        const resp = await axios.get(`http://localhost:5000/purchase/premiummembership/`, { headers: { 'auth': token } })
        let options = {
            'key': resp.data.key_id,
            'order_id': resp.data.order.id,
            'handler': async function (response) {
            const resp=    await axios.post(`http://localhost:5000/purchase/updateTransactionStatus/`, {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                }, { headers: { 'auth': token } })
         
              localStorage.setItem('token',resp.data.token) 
              let isP=parseJwt(resp.data.token).ispremiumuser
              setIsPremium(isP) 
             
            }
        }
        const rzp1 = new window.Razorpay(options)
        rzp1.open()
e.preventDefault()


    }
    useEffect(() => {
        getAllExpenses()

    }, [])

    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    }
  
    console.log('>>>>>>>>>',isPremium1)
async function handleLeaderBoard(){
    const response=await axios.get(`http://localhost:5000/premium/showLeaderboard`)
    setLeaderboardData(response.data)
    
}
console.log(leaderBoardData)


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
            <div className='dtext-center mt-5'>

               {!isPremium&& <button onClick={handlePayment} className='border border-white bg-green-500 w-32 font-bold m-auto rounded-md p-3 text-white' type='submit'>Buy Premium</button>}
            </div>
            {isPremium && 
            <div>
                 <p className='text-white m-auto text-center'>You are a Premium user</p>
                 <button className='bg-white' onClick={handleLeaderBoard}>Show leader board</button>
                 {leaderBoardData.map((e)=>{
                    return <div className='text-white'>
               Name:  {e.name} Total Expense :  {e.total_cost}
                    </div>
                 })}
            </div>
            }
              
            {expenses.map(e => {
                return <div className='flex gap-x-52 justify-center p-3 bg-green-500 mt-4'>
                    <p className='text-white'>{e.amount}</p>
                    <p className='text-white'>{e.description}</p>
                    <p className='text-white'>{e.category}</p>
                    <button onClick={(el) => { deleteExpense(el, e.id) }} className='bg-red-500 p-2 rounded-md text-white'>Delete</button>
                </div>
            })}
        </>
    );
}

export default AddExpense;
