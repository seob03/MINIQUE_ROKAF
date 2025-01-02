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

let isOpen = createSlice({
  name: 'isOpen',
  initialState: false,
  reducers : {
    changeIsOpen(state,action){
      return action.payload;
    }
  }
})

export let {changeIsOpen} = isOpen.actions

let isSignUpOpen = createSlice({
  name: 'isSignUpOpen',
  initialState: false,
  reducers : {
    changeIsSignUpOpen(state,action){
      return action.payload;
    }
  }
})

export let {changeIsSignUpOpen} = isSignUpOpen.actions

export default configureStore({
  reducer: { 
    isLoggedIn: isLoggedIn.reducer,
    isOpen: isOpen.reducer,
    isSignUpOpen: isSignUpOpen.reducer
  }
}) 