import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import React from "react";
declare const FlipbookViewer: ({ pdfUrl, shareUrl, className, disableShare, onExit }: {
    pdfUrl: string;
    shareUrl?: string;
    className?: string;
    disableShare?: boolean;
    onExit?: () => void;
}) => React.JSX.Element;
export default FlipbookViewer;
