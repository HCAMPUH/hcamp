import { useCallback, useRef, useState } from "react";
import Toolbar from "./toolbar/toolbar";
import { cn } from "./../../lib/utils";
import Flipbook from "./flipbook/flipbook";
import screenfull from 'screenfull';
import { TransformWrapper } from "react-zoom-pan-pinch";
import { Document } from "react-pdf";
import PdfLoading from "./pdf-loading/pdf-loading";
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import React from "react";
const FlipbookViewer = ({ pdfUrl, shareUrl, className, disableShare = false, onExit }) => {
    const containerRef = useRef(null);
    const flipbookRef = useRef(null);
    const [pdfLoading, setPdfLoading] = useState(true);
    const [pdfDetails, setPdfDetails] = useState(null);
    const [viewerStates, setViewerStates] = useState({
        currentPageIndex: 0,
        zoomScale: 1,
    });
    const isAppleTouchDevice = () => typeof navigator !== "undefined" &&
        (/iPhone|iPad|iPod/i.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    const safeScreenfull = isAppleTouchDevice() ? undefined : screenfull;
    const onDocumentLoadSuccess = useCallback(async (pdfProxy) => {
        try {
            const page = await pdfProxy.getPage(1);
            setPdfDetails({
                totalPages: pdfProxy.numPages,
                width: page.view[2],
                height: page.view[3],
            });
            setPdfLoading(false);
        }
        catch (error) {
            console.error('Error loading document page details:', error);
            setPdfLoading(false); // Ensure loading stops even on error
        }
    }, []);
    return (React.createElement("div", { ref: containerRef, className: cn("relative h-[30.244rem] xs:h-[37.744rem] lg:h-[49.744rem] xl:h-[51.99rem] bg-gray-800 w-full overflow-hidden", className ?? '') },
        " ",
        pdfLoading && React.createElement(PdfLoading, null),
        React.createElement(Document, { file: pdfUrl, onLoadSuccess: onDocumentLoadSuccess, onLoadError: (error) => {
                console.error('Failed to load PDF:', error.message);
                setPdfLoading(false); // Stop loading on error
            }, loading: React.createElement(React.Fragment, null) }, (pdfDetails && !pdfLoading) &&
            React.createElement(TransformWrapper, { doubleClick: { disabled: true }, pinch: { step: 2 }, panning: { disabled: isAppleTouchDevice() }, disablePadding: viewerStates?.zoomScale <= 1, initialScale: 1, minScale: 1, maxScale: 5, onTransformed: ({ state }) => setViewerStates(prev => ({ ...prev, zoomScale: state.scale })) },
                React.createElement("div", { className: "w-full h-full relative bg-gray-700 flex flex-col" },
                    React.createElement(Flipbook, { viewerStates: viewerStates, setViewerStates: setViewerStates, ref: flipbookRef, screenfull: safeScreenfull, pdfDetails: pdfDetails }),
                    React.createElement(Toolbar, { viewerStates: viewerStates, setViewerStates: setViewerStates, containerRef: containerRef, flipbookRef: flipbookRef, screenfull: safeScreenfull, pdfDetails: pdfDetails, shareUrl: shareUrl, disableShare: disableShare, onExit: onExit, mobileOnly: isAppleTouchDevice() }))))));
};
export default FlipbookViewer;
