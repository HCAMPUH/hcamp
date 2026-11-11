import { RefObject, Dispatch, SetStateAction } from 'react';
import React from 'react';
import { PDFDetails } from '../../../lib/definitions';
type ToolbarProps = {
    flipbookRef: any;
    containerRef: RefObject<HTMLDivElement | null>;
    screenfull: any;
    pdfDetails: PDFDetails;
    viewerStates: {
        currentPageIndex: number;
        zoomScale: number;
    };
    shareUrl: string | undefined;
    disableShare: boolean;
    setViewerStates: Dispatch<SetStateAction<{
        currentPageIndex: number;
        zoomScale: number;
    }>>;
};
declare const Toolbar: ({ flipbookRef, containerRef, screenfull, pdfDetails, viewerStates, shareUrl, disableShare, setViewerStates }: ToolbarProps) => React.JSX.Element;
export default Toolbar;
