import { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { PDFDetails } from '../../../lib/definitions';
type FlipbookLoaderProps = {
    pdfDetails: PDFDetails;
    scale: number;
    viewerStates: {
        currentPageIndex: number;
        zoomScale: number;
    };
    setViewerStates: Dispatch<SetStateAction<{
        currentPageIndex: number;
        zoomScale: number;
    }>>;
    viewRange: number[];
    setViewRange: Dispatch<SetStateAction<number[]>>;
};
declare const FlipbookLoader: React.ForwardRefExoticComponent<FlipbookLoaderProps & React.RefAttributes<HTMLDivElement>>;
export default FlipbookLoader;
