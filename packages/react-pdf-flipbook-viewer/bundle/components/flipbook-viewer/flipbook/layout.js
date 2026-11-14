export function calculateFlipbookLayout(width, height, pageWidth, pageHeight, isAppleTouchDevice, isPortraitViewport) {
    const isSinglePage = isAppleTouchDevice
        ? width < 600 || isPortraitViewport
        : width < 768;
    const scale = Math.min(width / (isSinglePage ? pageWidth : 2 * pageWidth), height / pageHeight);
    return {
        isSinglePage,
        scale,
        width: pageWidth * scale * (isSinglePage ? 1 : 2),
        height: pageHeight * scale,
    };
}
