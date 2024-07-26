import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

export interface ModalSetState {
    open: boolean,
    folder: string,
}

const initialState: ModalSetState = {
    open: false,
    folder: '',
}

export const modalSetSlice = createSlice({
    name: 'modalSet',
    initialState,
    reducers: {
        setModalSetState: (state, action: PayloadAction<any>) => {
            const prev = state.open;
            state.open = !prev;
            state.folder = action.payload;
        }
    }
})

export const { setModalSetState } = modalSetSlice.actions;

export const getModalSetState = (state : RootState) => state.modalSet;

export default modalSetSlice.reducer;