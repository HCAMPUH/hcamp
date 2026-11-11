import { forwardRef, memo, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import PdfPage from './pdf-page';
import useScreenSize from './../../../hooks/use-screensize';
import React from 'react';
const MemoizedPdfPage = memo(PdfPage);
const FlipbookLoader = forwardRef(({ pdfDetails, scale, viewerStates, setViewerStates, viewRange, setViewRange }, ref) => {
    const { width } = useScreenSize();
    const isRotatedLandscape = typeof window !== 'undefined' &&
        window.innerHeight > window.innerWidth &&
        (/iPhone|iPad|iPod/i.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    // Check if page is in View range or in view window >>>>>>>>
    const isPageInViewRange = (index) => { return index >= viewRange[0] && index <= viewRange[1]; };
    const isPageInView = (index) => { return viewerStates.currentPageIndex === index || viewerStates.currentPageIndex + 1 === index; };
    // Update pageViewRange on page flip >>>>>>>>
    const onFlip = useCallback((e) => {
        let newViewRange;
        if (e.data > viewerStates.currentPageIndex) {
            newViewRange = [viewRange[0], Math.max(Math.min(e.data + 4, pdfDetails.totalPages), viewRange[1])];
        }
        else if (e.data < viewerStates.currentPageIndex) {
            newViewRange = [Math.min(Math.max(e.data - 4, 0), viewRange[0]), viewRange[1]];
        }
        else {
            newViewRange = viewRange;
        }
        setViewRange(newViewRange);
        setViewerStates(prev => ({
            ...prev,
            currentPageIndex: e.data,
        }));
    }, [viewerStates, viewRange, setViewRange, setViewerStates, pdfDetails.totalPages]);
    return (React.createElement("div", { className: "relative" },
        React.createElement(HTMLFlipBook, { ref: ref, key: scale, startPage: viewerStates.currentPageIndex, width: pdfDetails.width * scale, height: pdfDetails.height * scale, size: "stretch", drawShadow: false, flippingTime: 700, usePortrait: width < 768 && !isRotatedLandscape, showCover: true, showPageCorners: false, onFlip: onFlip, disableFlipByClick: width < 768 && !isRotatedLandscape, mobileScrollSupport: true, className: viewerStates.zoomScale > 1 ? 'pointer-events-none md:pointer-events-none' : '' }, Array.from({ length: pdfDetails.totalPages }, (_, index) => (React.createElement(MemoizedPdfPage, { key: index, height: pdfDetails.height * scale, page: index + 1, isPageInViewRange: isPageInViewRange(index), isPageInView: isPageInView(index) }))))));
});
FlipbookLoader.displayName = 'FlipbookLoader';
export default FlipbookLoader;
