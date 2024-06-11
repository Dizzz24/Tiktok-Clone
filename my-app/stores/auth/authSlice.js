import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLogin: false,
    },
    reducers: {
        setIsLogin: (state, action) => {
            state.isLogin = action.payload
        }
    },
})

export const { setIsLogin } = authSlice.actions

export default authSlice.reducer