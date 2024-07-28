import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { GetFileFromBucket } from '@/app/lib/actions';
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

export const fetchFileByRawURL = createAsyncThunk(
    'file/fetchByRawURL',
    async (rawURL: string, thunkAPI) => {
        // GetFileFromBucket already returns the signed URL
        const response = await GetFileFromBucket(rawURL);
        return [await response, rawURL];
    }
)

export interface WorkspaceState {
    entities: string[],
    raw: string,
    loading: 'idle' | 'pending' | 'succeeded' | 'failed',
}

const initialState: WorkspaceState = {
    entities: [],
    raw: '',
    loading: 'idle',
}

export const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        setSelectedFile: (state, action: PayloadAction<any>) => {
            state.entities.push(action.payload)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFileByRawURL.fulfilled, (state, action) => {
            state.entities.push(action.payload[0] as string);
            state.raw = action.payload[1] as string;
        })
    }
})

export const { setSelectedFile } = workspaceSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectWorkspace = (state: RootState) => state.workspace

export default workspaceSlice.reducer