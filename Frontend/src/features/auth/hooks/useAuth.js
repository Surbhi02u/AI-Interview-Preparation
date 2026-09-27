import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api"

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    const { user, setUser, loading, setLoading } = context
    const [ error, setError ] = useState(null)

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        setError(null)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return { success: true, user: data.user }
        } catch (err) {
            const errMsg = err.response?.data?.message || err.response?.data?.msg || "Login failed. Please check credentials."
            setError(errMsg)
            console.error("Login error:", err)
            return { success: false, error: errMsg }
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, fullName, email, password }) => {
        setLoading(true)
        setError(null)
        try {
            const data = await register({ username, fullName, email, password })
            setUser(data.user)
            return { success: true, user: data.user }
        } catch (err) {
            const errMsg = err.response?.data?.message || err.response?.data?.msg || "Registration failed."
            setError(errMsg)
            console.error("Register error:", err)
            return { success: false, error: errMsg }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        setError(null)
        try {
            await logout()
            setUser(null)
            return { success: true }
        } catch (err) {
            console.error("Logout error:", err)
            return { success: false }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        getAndSetUser()
    }, [])

    return { user, loading, error, setError, handleRegister, handleLogin, handleLogout }
}