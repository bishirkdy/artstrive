import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user : localStorage.getItem('user')?
    JSON.parse(localStorage.getItem('user')) : null,
}

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
       setUser : (state , action) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload))
       }, 
       logOut : (state, action) => {
        state.user = null ;
        localStorage.clear();
       },
       updateUser : (state , action ) => {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user))
       }
    }
})

export const { setUser, logOut ,updateUser} = authSlice.actions;
export default authSlice.reducer;