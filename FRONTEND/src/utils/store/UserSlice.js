import { createSlice } from "@reduxjs/toolkit";


const UserSlice = createSlice({
    name: "UserSlice",
    initialState: [],

    reducers: {
        addUserData: (state, actions) => {
            return actions.payload
        }
    }

})

export default UserSlice.reducer

export const { addUserData } = UserSlice.actions