'use client'

import { redirect } from 'next/navigation'
import Sidebar from './Sidebar'
import { signOut } from './workspaceActions'
// import React from 'react'

import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setSelectedFile, selectWorkspace } from '../../redux/workspace/workspaceSlice'
import { Provider } from 'react-redux'
import { store } from '../../redux/store'

export default function Wrapper({ user }: { user: any }) {
    return (
        <Provider store={store}>
            <Container user={user} />
        </Provider>
    )
}

export function Container({ user }: { user: any }) {

    const files = user[0]?.content;

    const selectedFile = useAppSelector(selectWorkspace)
    const dispatch = useAppDispatch()

    return (
        <div>
            <Sidebar files={files} />
            <form
                action={signOut}
            >
                <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                    <div className="hidden md:block">Sign Out</div>
                </button>
            </form>
            {selectedFile.selectedFile}
        </div>
    )
}