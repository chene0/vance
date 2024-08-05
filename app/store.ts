import { configureStore } from "@reduxjs/toolkit";
import workspaceReducer  from "./workspace/workspaceSlice";
import modalSetSliceReducer from "./workspace/modalSetSlice";
import modalFolderSliceReducer from "./workspace/modalFolderSlice";
import modalFolderDeletionSlice from "./workspace/modalFolderDeletionSlice";
import modalSetDeletionSlice from "./workspace/modalSetDeletionSlice";
import modalQuestionDeletionSlice from "./workspace/modalQuestionDeletionSlice";

export const store = configureStore({
    reducer: {
        workspace: workspaceReducer,
        modalSet: modalSetSliceReducer,
        modalFolder: modalFolderSliceReducer,
        modalFolderDeletion: modalFolderDeletionSlice,
        modalSetDeletion: modalSetDeletionSlice,
        modalQuestionDeletion: modalQuestionDeletionSlice,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch