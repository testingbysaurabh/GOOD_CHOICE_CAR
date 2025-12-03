import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "../store/UserSlice"
import publicSlice from "../store/PublicSlice"

const store = configureStore({

    reducer: {
        User: UserSlice,
        publicSlice: publicSlice
    }

})
export default store