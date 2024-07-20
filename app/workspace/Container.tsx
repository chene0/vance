'use client'

import { Button, Modal } from "flowbite-react";
import { redirect } from 'next/navigation'
import Sidebar from './Sidebar'
import { signOut } from './workspaceActions'
// import React from 'react'
import { use, useEffect, useRef, useState } from 'react'

import { useAppSelector, useAppDispatch } from '../hooks'
import { setSelectedFile, selectWorkspace } from './workspaceSlice'
import { Provider } from 'react-redux'
import { store } from '../store'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf';
import { getModalSetState, setModalSetState } from "./modalSetSlice";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
//     import.meta.url,
// ).toString();

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};

export default function Wrapper({ user }: { user: any }) {
    return (
        <Provider store={store}>
            <Container user={user} />
        </Provider>
    )
}

export function Container({ user }: { user: any }) {

    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;
    // pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    const files = user[0]?.content;

    const modalSetState = useAppSelector(getModalSetState).open;
    const selectedFile = useAppSelector(selectWorkspace).entities;
    const dispatch = useAppDispatch()

    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

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
            <div>
                <Document file={selectedFile[selectedFile.length - 1]} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber} />
                </Document>
                <p>
                    Page {pageNumber} of {numPages}
                </p>
            </div>
            <Modal show={modalSetState} onClose={() => dispatch(setModalSetState())}>
                <Modal.Header>Terms of Service</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
                            companies around the world are updating their terms of service agreements to comply.
                        </p>
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant
                            to ensure a common set of data rights in the European Union. It requires organizations to notify users as
                            soon as possible of high-risk data breaches that could personally affect them.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </div>
    )
}