import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function AddExpense() {
    let token = localStorage.getItem('token')
    let isPremium1 = parseJwt(token).ispremiumuser
    const [expenses, setExpenses] = useState([])
    const [isPremium, setIsPremium] = useState(isPremium1)
    const [leaderBoardData, setLeaderboardData] = useState([])
    const [page, setPage] = useState(1)
    const [lastPage, setLastpage] = useState()
    const rows=localStorage.getItem('rowsPerPage')
    // const rows2=rows?1:2
    const [rowsPerPage, setRowsPerPage] = useState(rows?rows:2)

    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        category: 'food',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

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
            const resp = await axios.get(`http://localhost:5000/expense/getExpenses?page=${page}&pageSize=${rowsPerPage}`, { headers: { 'auth': token } })
            console.log(resp.data)
            setExpenses((p) => {
                return resp.data.allExpenses
            })
            setLastpage(resp.data.lastPage)
        }
        catch (err) {
            console.log(err)
        }
    }
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', lastPage)
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
                const resp = await axios.post(`http://localhost:5000/purchase/updateTransactionStatus/`, {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                }, { headers: { 'auth': token } })

                localStorage.setItem('token', resp.data.token)
                let isP = parseJwt(resp.data.token).ispremiumuser
                setIsPremium(isP)

            }
        }
        const rzp1 = new window.Razorpay(options)
        rzp1.open()
        e.preventDefault()


    }
    useEffect(() => {
        getAllExpenses()

    }, [page, rowsPerPage])

    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    console.log('>>>>>>>>>', isPremium1)
    async function handleLeaderBoard() {
        const response = await axios.get(`http://localhost:5000/premium/showLeaderboard`)
        setLeaderboardData(response.data)

    }

    async function downLoadFileHandler() {
        const token = localStorage.getItem('token')
        const response = await axios.get(`http://localhost:5000/premium/download`, { headers: { 'auth': token } })
        const url = response.data.fileURL
        console.log(response)
        window.location.href = url;

    }

    function handleNextPage() {
        page < lastPage ? setPage(page + 1) : setPage(1)

    }
    function handlePrevPage() {
        page > 1 ? setPage(page - 1) : setPage(lastPage)
    }

    function handleRowsPerPage(e) {
      setRowsPerPage(e.target.value)

    }
    localStorage.setItem('rowsPerPage',rowsPerPage)
    console.log(rowsPerPage)
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
            <div className='dtext-center mt-5 text-center'>
                <div className='text-center'>

                    {!isPremium && <button onClick={handlePayment} className=' bg-green-500 w-32 font-bold m-auto rounded-md p-3 text-white' type='submit'>Buy Premium</button>}
                </div>
                <button onClick={downLoadFileHandler} disabled={!isPremium} className={`bg-green-500 mt-4 font-bold m-auto rounded-md p-3 text-white ${!isPremium ? 'cursor-not-allowed' : 'cursor-pointer'}`}>Download Expenses</button>
            </div>
            {isPremium &&
                <>
                    <div>
                        <p className='text-white m-auto text-center'>You are a Premium user</p>
                        <button className='bg-blue-500  font-bold m-auto rounded-md p-3 text-white' onClick={handleLeaderBoard}>Show leader board</button>

                    </div>
                    {leaderBoardData.length > 0 && <table class="w-ful text-sm text-left w-1/2 text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">Name</th>
                                <th scope="col" class="px-6 py-3">Total Expense</th>


                            </tr>
                        </thead>
                        {leaderBoardData.map(e => {

                            return <>
                                <tbody>
                                    <tr class="hover:bg-gray-100 bg-white border-b dark:bg-gray-800 dark:border-gray-700">

                                        <td class="px-6 py-4">{e.name}</td>
                                        <td class="px-6 py-4">{e.total_cost > 0 ? e.total_cost : '0'}</td>

                                    </tr>
                                </tbody>
                            </>
                        })}
                    </table>}
                </>
            }

            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-5">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">Date</th>
                        <th scope="col" class="px-6 py-3">Description</th>
                        <th scope="col" class="px-6 py-3">Category</th>
                        <th scope="col" class="px-6 py-3">Expense</th>
                    </tr>
                </thead>
                {expenses.map(e => {

                    return <>
                        <tbody>
                            <tr class="hover:bg-gray-100 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" class="px-6 py-4 font-medium ">
                                    {e.createdAt}
                                </th>
                                <td class="px-6 py-4">{e.description}</td>
                                <td class="px-6 py-4">{e.category}</td>
                                <td class="px-6 py-4">{e.amount}</td>
                            </tr>
                        </tbody>
                    </>
                })}
            </table>
            <div className='bg-white flex flex-row gap-x-6 justify-center mt-4 items-center'>

                <p>Rows per page</p>
                <select onChange={handleRowsPerPage} value={rowsPerPage} name="" id="">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <button onClick={handlePrevPage} className='bg-green-400 p-2 px-5 rounded-md'>
                    Prev
                </button>
                <p>{page}</p>
                <button onClick={handleNextPage} className='bg-green-400 p-2 px-5 rounded-md'>
                    Next
                </button>
            </div>
        </>
    );
}
export default AddExpense;
