import { configureStore } from "@reduxjs/toolkit";
import inventoryProducts from "./inventorySlice";

const store = configureStore({
    reducer: {
        inventory: inventoryProducts
    }   
})
export default store;