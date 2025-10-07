import { createSlice } from '@reduxjs/toolkit';
import { inventoryData } from '../data';

const inventorySlice = createSlice({
    name: 'inventory',
    initialState: inventoryData,
    reducers: {
    }
});

export default inventorySlice.reducer;