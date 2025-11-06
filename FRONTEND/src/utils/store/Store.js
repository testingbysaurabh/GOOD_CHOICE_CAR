import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "../store/UserSlice"
const store = configureStore({

    reducer: {
        User: UserSlice
    }

})
export default store