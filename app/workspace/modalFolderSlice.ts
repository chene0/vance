import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

export interface ModalFolderState{
    open: boolean,
    folder: string,
}

const initialState: ModalFolderState = {
    open: false,
    folder: '',
}

export const modalFolderSlice = createSlice({
    name: 'modalFolder',
    initialState,
    reducers: {
        setModalFolderState: (state, action: PayloadAction<any>) => {
            const prev = state.open;
            state.open = !prev;
            state.folder = action.payload;
        }
    }
})

export const { setModalFolderState } = modalFolderSlice.actions;

export const getModalFolderState = (state : RootState) => state.modalFolder;

export default modalFolderSlice.reducer;