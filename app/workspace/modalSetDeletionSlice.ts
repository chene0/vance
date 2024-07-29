import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

export interface ModalSetDeletionState {
    open: boolean,
    set: string,
}

const initialState: ModalSetDeletionState = {
    open: false,
    set: '',
}

export const modalSetDeletionSlice = createSlice({
    name: 'modalSetDeletion',
    initialState,
    reducers: {
        setModalSetDeletionState: (state, action: PayloadAction<any>) => {
            const prev = state.open;
            state.open = !prev;
            state.set = action.payload;
        }
    }
})

export const { setModalSetDeletionState } = modalSetDeletionSlice.actions;

export const getModalSetDeletionState = (state : RootState) => state.modalSetDeletion;

export default modalSetDeletionSlice.reducer;