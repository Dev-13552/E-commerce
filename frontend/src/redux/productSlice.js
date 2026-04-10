import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        cart: [],
        addresses: [],
        selectedAddress: null,
    },
    reducers: {
        // actions
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setCart: (state, action) => {
            state.cart = action.payload
        },

        // Address Management
        addAddress: (state, action) => {
            if(!state.addresses) state.addresses = [];
            state.addresses.push(action.payload)
        },

        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload
        },
        deleteAddresses: (state, action) => {
            state.addresses = state.addresses.filter((_, index) => index !== action.payload)

            // Reset selected Address if it was deleted
            if(state.selectedAddress === action.payload){
                state.selectedAddress = null
            }
        }
    }
})

export const {setProducts, setCart, addAddress, setSelectedAddress, deleteAddresses} = productSlice.actions
export default productSlice.reducer