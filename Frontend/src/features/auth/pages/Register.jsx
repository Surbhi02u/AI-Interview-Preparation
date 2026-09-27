import React, { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const { user, loading, error, handleRegister } = useAuth()

    if (user) {
        return <Navigate to='/' replace />
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await handleRegister({ username, fullName: username, email, password })
        if (res && res.success) {
            navigate("/")
        }
    }

    if (loading) {
        return (<main><h1>Loading....</h1></main>)
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>
                {error && <div className="error-banner" style={{ color: "#ff4d4d", background: "#3a1515", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.9rem" }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor='username'>Full Name</label>
                        <input 
                            onChange={(e) => { setUsername(e.target.value) }}
                            type='text' id='username' name='username' placeholder='Enter your full name' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor='email'>Email</label>
                        <input 
                            onChange={(e) => { setEmail(e.target.value) }}
                            type='email' id='email' name='email' placeholder='Enter email address' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor='password'>Password</label>
                        <input 
                            onChange={(e) => { setPassword(e.target.value) }}
                            type='password' id='password' name='password' placeholder='Enter password' required />
                    </div>
                    <button className='button primary-button'>Register</button>
                </form>
                <p>Already have an account? <Link to={'/login'}>Login</Link></p>
            </div>
        </main>
    )
}

export default Register
