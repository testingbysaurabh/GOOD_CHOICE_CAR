import { createSlice } from "@reduxjs/toolkit";


const UserSlice = createSlice({
    name: "User",
    initialState: null,

    reducers: {
        addUserData: (state, actions) => {
            return actions.payload
        },
        clearData: (state, actions) => {
            return null
        }
    }

})

export default UserSlice.reducer

export const { addUserData, clearData } = UserSlice.actions