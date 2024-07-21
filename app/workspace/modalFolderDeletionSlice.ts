import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

export interface ModalFolderDeletionState {
    open: boolean,
    folder: string,
}

const initialState: ModalFolderDeletionState = {
    open: false,
    folder: '',
}

export const modalFolderDeletionSlice = createSlice({
    name: 'modalFolderDeletion',
    initialState,
    reducers: {
        setModalFolderDeletionState: (state, action: PayloadAction<any>) => {
            const prev = state.open;
            state.open = !prev;
            state.folder = action.payload;
        }
    }
})

export const { setModalFolderDeletionState } = modalFolderDeletionSlice.actions;

export const getModalFolderDeletionState = (state : RootState) => state.modalFolderDeletion;

export default modalFolderDeletionSlice.reducer;