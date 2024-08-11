import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

export interface ModalQuestionDeletionState {
    open: boolean,
    questions: [],
}

const initialState: ModalQuestionDeletionState = {
    open: false,
    questions: [],
}

export const modalQuestionDeletionSlice = createSlice({
    name: 'modalQuestionDeletion',
    initialState,
    reducers: {
        setModalQuestionDeletionState: (state, action: PayloadAction<any>) => {
            const prev = state.open;
            state.open = !prev;
            state.questions = action.payload;
        }
    }
})

export const { setModalQuestionDeletionState } = modalQuestionDeletionSlice.actions;

export const getModalQuestionDeletionState = (state : RootState) => state.modalQuestionDeletion;

export default modalQuestionDeletionSlice.reducer;