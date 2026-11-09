import { useState, useEffect, useCallback, forwardRef } from 'react';
import useRefSize from './../../../hooks/use-ref-size';
import FlipbookLoader from './flipbook-loader';
import { cn } from './../../../lib/utils';
import { TransformComponent } from 'react-zoom-pan-pinch';
import React from 'react';
const Flipbook = forwardRef(({ viewerStates, setViewerStates, screenfull, pdfDetails }, refOld) => {
    const { ref, width, height, refreshSize } = useRefSize();
    const [scale, setScale] = useState(1); // Max scale for flipbook
    const [wrapperCss, setWrapperCss] = useState({});
    const [viewRange, setViewRange] = useState([0, 4]);
    const [isReady, setIsReady] = useState(false);
    const isMobile = width < 768;
    // Calculate scale when pageSize or dimensions change >>>>>>>>
    useEffect(() => {
        if (pdfDetails && width && height) {
            const calculatedScale = Math.min(width / (isMobile ? pdfDetails.width : 2 * pdfDetails.width), height / pdfDetails.height);
            setScale(calculatedScale);
            setWrapperCss({
                width: `${pdfDetails.width * calculatedScale * (isMobile ? 1 : 2)}px`,
                height: `${pdfDetails.height * calculatedScale}px`,
            });
        }
    }, [pdfDetails, width, height, isMobile]);
    // Refresh flipbook size & page range on window resize >>>>>>>>
    const shrinkPageLoadingRange = useCallback(() => {
        setViewRange([Math.max(viewerStates.currentPageIndex - 2, 0), Math.min(viewerStates.currentPageIndex + 2, pdfDetails.totalPages)]);
    }, [viewerStates.currentPageIndex, pdfDetails.totalPages, setViewRange]);
    const handleFullscreenChange = useCallback(() => {
        shrinkPageLoadingRange();
        refreshSize();
    }, [shrinkPageLoadingRange, refreshSize]);
    useEffect(() => {
        if (screenfull) {
            screenfull.on('change', handleFullscreenChange);
        }
        // Clean up the event listener
        return () => {
            if (screenfull) {
                screenfull.off('change', handleFullscreenChange);
            }
        };
    }, [handleFullscreenChange]);
    useEffect(() => {
        if (screenfull)
            return;
        const refresh = () => window.requestAnimationFrame(() => refreshSize());
        window.addEventListener('resize', refresh, { passive: true });
        window.visualViewport?.addEventListener('resize', refresh, { passive: true });
        refresh();
        return () => {
            window.removeEventListener('resize', refresh);
            window.visualViewport?.removeEventListener('resize', refresh);
        };
    }, [refreshSize, screenfull]);
    useEffect(() => {
        setIsReady(false);
        const timer = window.setTimeout(() => setIsReady(true), 100);
        return () => window.clearTimeout(timer);
    }, [pdfDetails]);
    return (React.createElement("div", { ref: ref, className: cn("relative h-[30.244rem] xs:h-[37.744rem] lg:h-[49.744rem] xl:h-[51.99rem] w-full bg-transparent flex justify-center items-center overflow-hidden", screenfull?.isFullscreen && 'h-[calc(100vh-5.163rem)] xs:h-[calc(100vh-5.163rem)] lg:h-[calc(100vh-5.163rem)] xl:h-[calc(100vh-4.66rem)]') },
        React.createElement(TransformComponent, { wrapperStyle: { width: "100%", height: "100%" }, contentStyle: { width: "100%", height: "100%" } },
            React.createElement("div", { className: 'overflow-hidden flex justify-center items-center h-full w-full' }, isReady && pdfDetails && width > 0 && height > 0 && scale && wrapperCss.width && (React.createElement("div", { style: wrapperCss },
                React.createElement(FlipbookLoader, { ref: refOld, pdfDetails: pdfDetails, scale: scale, viewRange: viewRange, setViewRange: setViewRange, viewerStates: viewerStates, setViewerStates: setViewerStates })))))));
});
Flipbook.displayName = 'Flipbook';
export default Flipbook;
