import { createSlice, original } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  posts: [],     
};

const UserSlice = createSlice({
  name: "User",
  initialState,

  reducers: {
    addUserData: (state, action) => {
      return action.payload;
    },

    clearData: () => {
      return initialState;
    },

    removePost: (state, action) => {
      const id = action.payload;
      if (state && state.posts) {
        state.posts = state.posts.filter((post) => post._id !== id);
      }
    },

    updatePost: (state, action) => {
      const { id, data } = action.payload;
      if (!state || !state.posts) return state;

      state.posts = state.posts.map((post) =>
        post._id === id ? { ...post, ...data } : post
      );
    },

    addPost: (state, action) => {
      if (!state) return state;
      if (!state.posts) {
        state.posts = [action.payload];
      } else {
        state.posts.unshift(action.payload);
      }
    },

    

  },
});

export default UserSlice.reducer;
export const { addUserData, clearData, removePost, updatePost, addPost } = UserSlice.actions;
