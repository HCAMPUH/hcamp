import React, { ReactNode } from 'react';
interface SimpleDropdownProps {
    trigger: ReactNode;
    children: (closeDropdown: () => void) => ReactNode;
    contentClassName?: string;
    contentStyle?: React.CSSProperties;
    align?: 'left' | 'right';
    openDirection?: 'up' | 'down' | 'auto';
}
export declare const Dropdown: ({ trigger, children, contentClassName, contentStyle, align, openDirection }: SimpleDropdownProps) => React.JSX.Element;
export {};
