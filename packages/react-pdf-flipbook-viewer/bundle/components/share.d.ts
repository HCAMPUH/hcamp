import { ReactNode } from 'react';
import React from "react";
export default function Share({ asChild, shareUrl, children: triggerSlotChildren }: {
    asChild?: boolean;
    shareUrl?: string;
    children?: ReactNode;
}): React.JSX.Element;
