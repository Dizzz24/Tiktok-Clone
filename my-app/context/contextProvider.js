import { createContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext(null)

export default function ContextProvider({ children }) {
    const [isLogin, setIsLogin] = useState(false)

    const checkToken = async () => {
        const token = await SecureStore.getItemAsync("access_token")

        if (token) { setIsLogin(true) }
    }

    useEffect(() => {
        checkToken()
    }, [])

    return (
        <AuthContext.Provider value={{ isLogin, setIsLogin }} >{children}</AuthContext.Provider>
    )
}