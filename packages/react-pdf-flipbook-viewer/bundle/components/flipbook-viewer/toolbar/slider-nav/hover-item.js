import React from 'react';
import { memo } from 'react';
import { Page } from 'react-pdf';
const HoverItem = memo(({ slide, totalPages, totalSlides }) => {
    return (React.createElement("div", null,
        React.createElement("p", { className: "text-xs text-background pb-1" },
            "Page ",
            slide === 1 || (slide === totalSlides && totalPages % 2 === 0) ? slide * 2 - 2 || 1 : `${slide * 2 - 2}-${slide * 2 - 1}`),
        React.createElement("div", { className: "flex rounded-md overflow-hidden" }, Array.from({ length: totalPages }, (_, index) => {
            if (index % 2 !== 0) {
                return React.createElement(Page, { key: index, pageNumber: index + 1, width: 110, renderAnnotationLayer: false, renderForms: false, renderTextLayer: false, _className: index + 1 === slide * 2 - 2 ? 'block' : 'hidden' });
            }
            else {
                return React.createElement(Page, { key: index, pageNumber: index + 1, width: 110, renderAnnotationLayer: false, renderForms: false, renderTextLayer: false, _className: index + 1 === slide * 2 - 1 ? 'block' : 'hidden' });
            }
        }))));
});
HoverItem.displayName = 'HoverItem';
export default HoverItem;
