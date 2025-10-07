import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "../store/UserSlice"
const store = configureStore({

    reducer: {
        user: UserSlice
    }

})
export default store