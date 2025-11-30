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
        },
        removePost: (state, action) => {
            const id = action.payload;
            state.posts = state.posts.filter(post => post._id !== id);
        },


        updatePost: (state, action) => {
            const { id, data } = action.payload;
            if (!state || !state.posts) return state;
            return {
                ...state, posts: state.posts.map(post => post._id === id ? { ...post, ...data } : post)
            };
        }



    }

})

export default UserSlice.reducer

export const { addUserData, clearData, removePost ,updatePost} = UserSlice.actions