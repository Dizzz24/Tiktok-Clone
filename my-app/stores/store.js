import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth/authSlice'
import postsSlice from './posts/postSlice'

export default configureStore({
    reducer: {
        auth: authSlice,
        data: postsSlice
    },
})