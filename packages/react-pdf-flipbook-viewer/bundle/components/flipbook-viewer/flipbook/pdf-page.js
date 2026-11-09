import React from "react";
import { cn } from "./../../../lib/utils";
import { forwardRef, memo } from "react";
import { Page } from "react-pdf";
const PdfPage = forwardRef(({ page, height, zoomScale, isPageInView, isPageInViewRange }, ref) => {
    return (React.createElement("div", { ref: ref, className: cn(page % 2 === 0 ? 'bg-background' : 'bg-muted') }, isPageInViewRange && (React.createElement(Page, { devicePixelRatio: (isPageInView && zoomScale > 1.7) ? Math.min(zoomScale * window.devicePixelRatio, 5) : window.devicePixelRatio, height: height, pageNumber: page, loading: React.createElement(React.Fragment, null), renderAnnotationLayer: false, renderTextLayer: false }))));
});
PdfPage.displayName = "PdfPage";
export default memo(PdfPage);
