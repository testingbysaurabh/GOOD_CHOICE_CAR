import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalPosts: 0,
        hasNextPage: false,
        hasPrevPage: false
    },
    filters: {
        minPrice: '',
        maxPrice: '',
        minYear: '',
        maxYear: '',
        fuelType: '',
        transmission: '',
        color: ''
    },
    searchQuery: '',
    loading: false
};

const publicSlice = createSlice({
    name: 'publicSlice',
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        addPosts: (state, action) => {
            state.posts = [...state.posts, ...action.payload];
        },
        setPagination: (state, action) => {
            state.pagination = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        resetPosts: (state) => {
            state.posts = [];
            state.pagination = initialState.pagination;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        clearSearchQuery: (state) => {
            state.searchQuery = '';
        }
    }
});

export default publicSlice.reducer;
export const { setPosts, addPosts, setPagination, setFilters, resetFilters, setLoading, resetPosts, setSearchQuery, clearSearchQuery } = publicSlice.actions;
