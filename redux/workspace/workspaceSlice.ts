import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { GetObjectCommandOutput } from "@aws-sdk/client-s3";

export interface WorkspaceState {
    selectedFile: string
}

const initialState: WorkspaceState = {
    selectedFile: ''
}

export const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        setSelectedFile: (state, action: PayloadAction<any>) => {
            state.selectedFile = action.payload
        }
    }
})

export const { setSelectedFile } = workspaceSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectWorkspace = (state: RootState) => state.workspace

export default workspaceSlice.reducer