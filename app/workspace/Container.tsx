'use client'

import { Button, Modal, TextInput, FileInput, Pagination } from "flowbite-react";
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
import { AddFolder, AdjustQuestionPriorityRating, CreateSet, DeleteFolder, DeleteSet, GetAutogeneratedQuestionData, GetQuestionData, GetQuestionDataById, ProcessFile } from "../lib/actions";
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
    const [modalSetProcessState, setModalSetProcessState] = useState(false);
    const modalSetDeletionState = useAppSelector(getModalSetDeletionState);
    const modalFolderState = useAppSelector(getModalFolderState);
    const modalFolderDeletionState = useAppSelector(getModalFolderDeletionState);
    const selectedFile = useAppSelector(selectWorkspace);
    const dispatch = useAppDispatch()

    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [currentFiles, setCurrentFiles] = useState(files);

    const [questionBoxRender, setQuestionBoxRender] = useState<any[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<any>();

    async function onDocumentLoadSuccess({ numPages }: { numPages: number }): Promise<void> {
        setNumPages(numPages);
        const currentQuestions = await GetQuestionData(selectedFile.raw, pageNumber - 1);
        setQuestionBoxRender(RenderQuestionBoxes(await currentQuestions));
    }

    const RenderQuestionBoxes = (questions: any[]) => {
        console.log("🚀 ~ RenderQuestionBoxes ~ questions:", questions)

        let res: any[] = [];
        for (let i = 0; i < questions.length - 1; i++) {
            const question = questions[i];
            const next = questions[i + 1];
            const width = 816 - question.leftBound;
            const height = next.topBound - question.topBound;
            res.push(
                <div
                    onClick={async () => {
                        const id = question.id;
                        const databaseRet = (await GetQuestionDataById(id))[0];
                        setSelectedQuestion(databaseRet);
                    }}
                    className={"absolute box-border opacity-20 z-40"}
                    style={
                        {
                            backgroundColor: question.color,
                            left: `${question.leftBound}px`,
                            top: `${question.topBound}px`,
                            width: `${width}px`,
                            height: `${height}px`
                        }
                    }
                    key={question.id}></div>
            )
        }
        const lastQuestion = questions[questions.length - 1];
        const lastWidth = 816 - lastQuestion.leftBound;
        const lastHeight = 1056 - lastQuestion.topBound;
        res.push(
            <div
                onClick={async () => {
                    const id = lastQuestion.id;
                    const databaseRet = (await GetQuestionDataById(id))[0];
                    setSelectedQuestion(databaseRet);
                }}
                className={"absolute box-border opacity-20 z-40"}
                style={
                    {
                        backgroundColor: lastQuestion.color,
                        left: `${lastQuestion.leftBound}px`,
                        top: `${lastQuestion.topBound}px`,
                        width: `${lastWidth}px`,
                        height: `${lastHeight}px`
                    }
                }
                key={lastQuestion.id}></div>
        )
        console.log("🚀 ~ RenderQuestionBoxes ~ res:", res)
        return res;
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="flex flex-row">
                {/* SIDEBAR */}
                <div className="basis-1/4 flex flex-col">
                    <Sidebar files={currentFiles} userId={user[0].id} />
                    <form
                        action={signOut}
                    >
                        <Button type="submit">
                            <div className="hidden md:block">Sign Out</div>
                        </Button>
                    </form>
                    <form action={async () => {
                        const isAutogeneratedPresent = (await GetAutogeneratedQuestionData(selectedFile.raw)).length > 0;
                        if (!isAutogeneratedPresent) {
                            ProcessFile(selectedFile.raw, numPages as number);
                        } else {
                            setModalSetProcessState(true);
                        }
                    }}>
                        <Button type="submit">Automatically detect questions</Button>
                    </form>
                </div>

                {/* DOCUMENT DISPLAY */}
                <div className="flex flex-col basis-1/2">
                    <div className="flex-grow flow-col flex relative justify-center items-center">
                        {questionBoxRender}
                        <Document file={selectedFile.entities[selectedFile.entities.length - 1]} onLoadSuccess={onDocumentLoadSuccess} className="w-full">
                            <Page pageNumber={pageNumber} width={816} renderAnnotationLayer={false} renderTextLayer={false} />
                        </Document>
                    </div>
                </div>

                {/* CONTROL PANEL */}
                <div className="basis-1/4">
                    <div className="sticky top-0">
                        {/* PAGINATION */}
                        {numPages > 0
                            ? <Pagination currentPage={pageNumber} totalPages={numPages!}
                                onPageChange={
                                    async (page: number) => {
                                        setPageNumber(page);
                                        console.log("🚀 ~ page:", page)
                                        const currentQuestions = await GetQuestionData(selectedFile.raw, page - 1);
                                        // console.log("🚀 ~ currentQuestions:", await currentQuestions)
                                        setQuestionBoxRender(RenderQuestionBoxes(await currentQuestions));
                                    }
                                } />
                            : <div></div>}


                        {/* QUESTION CONTROL */}
                        <div className="mt-4">
                            {!selectedQuestion
                                ? <p className="text-slate-900">Select a question to get started</p>
                                :
                                <div>
                                    <h1 className="text-slate-900">{`Question ${selectedQuestion.name}`}</h1>
                                    <Button.Group>
                                        <Button onClick={() => {
                                            AdjustQuestionPriorityRating(selectedQuestion, -2);
                                            setSelectedQuestion(undefined);
                                        }}>Clueless</Button>
                                        <Button onClick={() => {
                                            AdjustQuestionPriorityRating(selectedQuestion, -1);
                                            setSelectedQuestion(undefined);
                                        }}>Trivial Error</Button>
                                        <Button onClick={() => {
                                            AdjustQuestionPriorityRating(selectedQuestion, 1);
                                            setSelectedQuestion(undefined);
                                        }}>Manageable</Button>
                                        <Button onClick={() => {
                                            AdjustQuestionPriorityRating(selectedQuestion, 2);
                                            setSelectedQuestion(undefined);
                                        }}>Easy</Button>
                                    </Button.Group>
                                </div>}
                        </div>
                    </div>
                </div>
            </div>

            <div> {/* MODALS */}
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

                {/* MODAL FOR PROCESSING A SET {IF PREVIOUS AUTOGENERATIONS HAVE OCCURED} */}
                <Modal show={modalSetProcessState} onClose={() => setModalSetProcessState(false)}>
                    <Modal.Header>Attention: Proceeding will result in the deletion of your old <b>autogenerated</b> questions</Modal.Header>
                    <Modal.Body>
                        <form onSubmit={async (event) => {
                            event.preventDefault();
                            await ProcessFile(selectedFile.raw, numPages as number);
                            setModalSetProcessState(false)
                        }}>
                            <Button type="submit">Replace old autogenerated questions with new generations</Button>
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

        </div>
    )
}