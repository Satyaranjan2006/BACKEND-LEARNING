import React from 'react'
import '../style/form.scss'
import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import axios from 'axios'


import { useAuth } from '../hook/useAuth'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    //----DBT--------------HOW WE GET HANDLE LOGIN FROM  useAuth()------------------
    const { handleLogin, loading } = useAuth()

    const navigate = useNavigate()

    if (loading) {
        return (
            <h1>Loading...</h1>
        )
    }

    async function handleSubmit(e) {
        e.preventDefault()

        //     axios.post('http://localhost:3000/api/auth/login',{
        //   username,password
        // },{withCredentials:true})
        // .then(res=>{
        //   console.log(res.data);

        // })

        //---------------------------------DBT---------------------------------

        //-----------HOW THIS CODE REPLACE THE COMMENTED CODE PURE OPERATION-------------

        handleLogin(username, password)
            .then(res => {
                console.log(res);
                navigate('/')

            })



    }
    return (
        <main>
            <div className='form-container'>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        onInput={(e) => { setUsername(e.target.value) }}
                        type="text"
                        name="username"
                        placeholder='Enter Username' />

                    <input
                        onInput={(e) => { setPassword(e.target.value) }}
                        type="text"
                        name="Password"
                        placeholder='Enter Password' />

                    <button type='submit'>Login</button>
                </form>
                <p>Don't have an account ? <Link className='toggleAuthForm' to='/register'>Register</Link></p>
            </div>
        </main>
    )
}

export default Login
