import { configureStore } from "@reduxjs/toolkit";
import workspaceReducer  from "./workspace/workspaceSlice";
import modalSetSliceReducer from "./workspace/modalSetSlice";
import modalFolderSliceReducer from "./workspace/modalFolderSlice";
import modalFolderDeletionSlice from "./workspace/modalFolderDeletionSlice";

export const store = configureStore({
    reducer: {
        workspace: workspaceReducer,
        modalSet: modalSetSliceReducer,
        modalFolder: modalFolderSliceReducer,
        modalFolderDeletion: modalFolderDeletionSlice,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch