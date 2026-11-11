import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { cn } from "./../lib/utils"; // Assuming this path is correct
export const Dropdown = ({ trigger, children, contentClassName, contentStyle, align = 'left', openDirection = 'auto' // Default to auto-detection
 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const contentRef = useRef(null); // Ref for the dropdown content
    // State to hold the calculated position style (top/bottom)
    const [calculatedPositionStyle, setCalculatedPositionStyle] = useState({
        top: '100%', // Default to opening downwards
        marginTop: '4px',
    });
    const toggleDropdown = () => setIsOpen(prev => !prev);
    const closeDropdown = () => setIsOpen(false);
    // Effect for click outside and Esc key
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current &&
                !wrapperRef.current.contains(event.target)) {
                closeDropdown();
            }
        };
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                closeDropdown();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener('keydown', handleEsc);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
                document.removeEventListener('keydown', handleEsc);
            };
        }
        // No explicit cleanup needed here if isOpen is false, as the return function handles it.
    }, [isOpen]);
    // Effect to calculate dropdown position (up or down)
    // useLayoutEffect ensures this runs after DOM mutations but before paint
    useLayoutEffect(() => {
        if (isOpen && wrapperRef.current && contentRef.current) {
            const triggerRect = wrapperRef.current.getBoundingClientRect();
            const contentHeight = contentRef.current.offsetHeight;
            const viewportHeight = window.innerHeight;
            const spaceAbove = triggerRect.top;
            const spaceBelow = viewportHeight - triggerRect.bottom;
            const offset = 4; // The 4px margin
            let newPositionStyle = {};
            if (openDirection === 'up') {
                newPositionStyle = { bottom: '100%', top: 'auto', marginBottom: `${offset}px` };
            }
            else if (openDirection === 'down') {
                newPositionStyle = { top: '100%', bottom: 'auto', marginTop: `${offset}px` };
            }
            else { // 'auto'
                // Prefer opening downwards if enough space, or if more space below than above
                // Open upwards if not enough space below AND (enough space above OR more space above than below)
                if (spaceBelow < (contentHeight + offset) && spaceAbove > spaceBelow && spaceAbove > (contentHeight + offset)) {
                    // Open upwards
                    newPositionStyle = { bottom: '100%', top: 'auto', marginBottom: `${offset}px` };
                }
                else {
                    // Default to opening downwards
                    newPositionStyle = { top: '100%', bottom: 'auto', marginTop: `${offset}px` };
                }
            }
            setCalculatedPositionStyle(newPositionStyle);
        }
        else if (!isOpen) {
            // Reset to default when closed, so it's ready for next open if direction is auto
            // If fixed direction, it will be recalculated anyway
            if (openDirection === 'auto') {
                setCalculatedPositionStyle({
                    top: '100%',
                    marginTop: '4px',
                });
            }
        }
    }, [isOpen, openDirection, align]); // Rerun if isOpen or openDirection changes
    const finalContentStyle = {
        position: 'absolute',
        left: align === 'left' ? 0 : undefined,
        right: align === 'right' ? 0 : undefined,
        zIndex: 50,
        ...contentStyle, // User-provided base styles
        ...calculatedPositionStyle, // Dynamically calculated position (top/bottom and margin)
    };
    return (React.createElement("div", { className: "relative inline-block", ref: wrapperRef },
        React.createElement("div", { onClick: toggleDropdown, className: "cursor-pointer", role: "button", "aria-haspopup": "menu", "aria-expanded": isOpen, tabIndex: 0, onKeyDown: (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDropdown();
                }
                // Optional: Close on Tab away from trigger if dropdown is open
                // if (e.key === 'Tab' && isOpen) {
                //     closeDropdown();
                // }
            } }, trigger),
        isOpen && (React.createElement("div", { ref: contentRef, className: cn("min-w-[10rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", contentClassName ?? ''), style: finalContentStyle, role: "menu" }, children(closeDropdown)))));
};
