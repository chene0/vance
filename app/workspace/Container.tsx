'use client'

import { Button, Modal, TextInput, FileInput } from "flowbite-react";
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
import { getModalFolderState, setModalFolderState } from "./modalFolderSlice"
import { AddFolder, CreateSet, DeleteFolder, DeleteSet, ProcessFile } from "../lib/actions";
import { getModalFolderDeletionState, setModalFolderDeletionState } from "./modalFolderDeletionSlice";
import { getModalSetDeletionState, setModalSetDeletionState } from "./modalSetDeletionSlice";

import { fromBase64, fromBuffer } from "pdf2pic";
import { PDFDocument } from "pdf-lib"
import Tesseract, { createWorker } from 'tesseract.js';

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

    const modalSetState = useAppSelector(getModalSetState);
    const modalSetDeletionState = useAppSelector(getModalSetDeletionState);
    const modalFolderState = useAppSelector(getModalFolderState);
    const modalFolderDeletionState = useAppSelector(getModalFolderDeletionState);
    const selectedFile = useAppSelector(selectWorkspace);
    const dispatch = useAppDispatch()

    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [currentFiles, setCurrentFiles] = useState(files);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <div>
            <Sidebar files={currentFiles} userId={user[0].id} />
            <form
                action={signOut}
            >
                <Button type="submit">
                    <div className="hidden md:block">Sign Out</div>
                </Button>
            </form>
            <form action={() => {
                ProcessFile(selectedFile.raw, numPages as number);
            }}>
                <Button type="submit">Automatically detect questions</Button>
            </form>

            <div>
                <Document file={selectedFile.entities[selectedFile.entities.length - 1]} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber} />
                </Document>
                <p>
                    Page {pageNumber} of {numPages}
                </p>
            </div>

            {/* MODAL FOR CREATING A SET */}
            <Modal show={modalSetState.open} onClose={() => dispatch(setModalSetState(''))}>
                <Modal.Header></Modal.Header>
                <Modal.Body>
                    <form onSubmit={async (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.target as HTMLFormElement);
                        const file = formData.get("file") as File;
                        const setName = formData.get("set-name") as string;
                        const buffer = await file.arrayBuffer();
                        const uintarr = new Uint8Array(await buffer);

                        const pdfDoc = await PDFDocument.load(await uintarr);
                        const numberOfPages = pdfDoc.getPageCount();

                        const parentFolder = modalSetState.folder;

                        const updatedFiles = await CreateSet(user[0], setName, parentFolder, uintarr, numberOfPages);
                        setCurrentFiles(await updatedFiles);
                        dispatch(setModalSetState(''));
                    }}>
                        <TextInput type="text" name="set-name" />
                        <FileInput name="file" />
                        <Button type="submit">Create Set</Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            {/* MODAL FOR DELETING A SET */}
            <Modal show={modalSetDeletionState.open} onClose={() => dispatch(setModalSetDeletionState(''))}>
                <Modal.Header>Attention: Proceed with deleting this set?</Modal.Header>
                <Modal.Body>
                    <form onSubmit={async (event) => {
                        event.preventDefault();
                        const targetSetID = modalSetDeletionState.set;
                        console.log("🚀 ~ <formonSubmit={ ~ targetSetID:", targetSetID)
                        const updatedFiles = DeleteSet(user[0], currentFiles, targetSetID);
                        setCurrentFiles(await updatedFiles);
                        dispatch(setModalSetDeletionState(''))
                    }}>
                        <Button type="submit">Delete set</Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            {/* MODAL FOR CREATING A FOLDER */}
            <Modal show={modalFolderState.open} onClose={() => dispatch(setModalFolderState(''))}>
                <Modal.Header></Modal.Header>
                <Modal.Body>
                    <form action={async (formData) => {
                        const parentFolder = modalFolderState.folder;
                        const prospectiveFolder = formData.get("folder-name");
                        const updatedFiles = await AddFolder(parentFolder, prospectiveFolder as string, currentFiles, user[0]);
                        setCurrentFiles(await updatedFiles)
                        dispatch(setModalFolderState(''))
                    }}>
                        <TextInput type="text" name="folder-name" />
                        <Button type="submit">Add Subfolder</Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>


            {/* MODAL FOR DELETING A FOLDER */}
            <Modal show={modalFolderDeletionState.open} onClose={() => dispatch(setModalFolderDeletionState(''))}>
                <Modal.Header>Attention: Proceed with deleting this folder and its contents?</Modal.Header>
                <Modal.Body>
                    <form action={async () => {
                        const targetFolder = modalFolderDeletionState.folder;
                        console.log("🚀 ~ <formaction={ ~ targetFolder:", targetFolder)
                        const updatedFiles = await DeleteFolder(targetFolder, currentFiles, user[0]);
                        setCurrentFiles(await updatedFiles);
                        dispatch(setModalFolderDeletionState(''))
                    }}>
                        <Button type="submit">Delete folder</Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </div>
    )
}