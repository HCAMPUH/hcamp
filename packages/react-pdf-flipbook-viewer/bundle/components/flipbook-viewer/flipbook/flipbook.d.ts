import { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { PDFDetails } from '../../../lib/definitions';
type FlipbookProps = {
    viewerStates: {
        currentPageIndex: number;
        zoomScale: number;
    };
    setViewerStates: Dispatch<SetStateAction<{
        currentPageIndex: number;
        zoomScale: number;
    }>>;
    screenfull: any;
    pdfDetails: PDFDetails;
};
declare const Flipbook: React.ForwardRefExoticComponent<FlipbookProps & React.RefAttributes<HTMLDivElement>>;
export default Flipbook;
