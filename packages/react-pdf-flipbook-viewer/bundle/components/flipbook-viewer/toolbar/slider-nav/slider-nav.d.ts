import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { PDFDetails } from '../../../../lib/definitions';
declare const SliderNav: ({ flipbookRef, pdfDetails, viewerStates, setViewerStates }: {
    flipbookRef: any;
    pdfDetails: PDFDetails;
    viewerStates: any;
    setViewerStates: Dispatch<SetStateAction<{
        currentPageIndex: number;
        zoomScale: number;
    }>>;
}) => React.JSX.Element;
export default SliderNav;
