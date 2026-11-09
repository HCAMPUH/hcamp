import React from 'react';
import { useControls } from 'react-zoom-pan-pinch';
import { Button } from '../../button';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
const Zoom = ({ zoomScale, screenWidth }) => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (React.createElement(React.Fragment, null, screenWidth > 768 &&
        React.createElement(React.Fragment, null,
            React.createElement(Button, { onClick: () => zoomOut(0.25), disabled: zoomScale == 1, variant: 'secondary', size: 'icon', className: 'size-8 min-w-8' },
                React.createElement(ZoomOut, { className: "size-4 min-w-4" })),
            React.createElement(Button, { onClick: () => zoomIn(0.25), disabled: zoomScale >= 5, variant: 'secondary', size: 'icon', className: 'size-8 min-w-8' },
                React.createElement(ZoomIn, { className: "size-4 min-w-4" })),
            React.createElement(Button, { onClick: () => resetTransform(), variant: 'secondary', size: 'icon', className: 'size-8 min-w-8' },
                React.createElement(RotateCcw, { className: "size-4 min-w-4" })))));
};
export default Zoom;
