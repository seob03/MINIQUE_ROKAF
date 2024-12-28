import { configureStore, createSlice } from '@reduxjs/toolkit'

let isLoggedIn = createSlice({
    name: 'isLoggedIn',
    initialState: false,
    reducers : {
        changeLogIn(state,action){
            return action.payload;
        }
    }
})

export let {changeLogIn} = isLoggedIn.actions

export default configureStore({
  reducer: { 
    isLoggedIn: isLoggedIn.reducer
  }
}) 