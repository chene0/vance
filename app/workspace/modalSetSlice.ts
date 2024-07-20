import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

export interface ModalSetState {
    open: boolean
}

const initialState: ModalSetState = {
    open: false
}

export const modalSetSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setModalSetState: (state) => {
            const prev = state.open;
            state.open = !prev;
        }
    }
})

export const { setModalSetState } = modalSetSlice.actions;

export const getModalSetState = (state : RootState) => state.modalSet;

export default modalSetSlice.reducer;