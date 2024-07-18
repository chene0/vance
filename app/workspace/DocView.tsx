'use server'

import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setSelectedFile, selectWorkspace } from '../../redux/workspace/workspaceSlice'
import { useState } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};


export default async function DocView() {

    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

    const selectedFile = useAppSelector(selectWorkspace).selectedFile
    const dispatch = useAppDispatch()

    return (
        <div>
            <Document file={await selectedFile}>
                <Page pageNumber={1} />
            </Document>
        </div>
    )
}