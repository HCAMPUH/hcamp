import { useRef, useEffect, useState, useCallback } from 'react';
const useRefSize = () => {
    const ref = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const handleResize = useCallback(() => {
        if (ref.current) {
            const width = ref.current.offsetWidth;
            const height = ref.current.offsetHeight;
            setSize(previous => previous.width === width && previous.height === height ? previous : { width, height });
        }
    }, []);
    useEffect(() => {
        handleResize(); // Initial width calculation
        const observer = new ResizeObserver(handleResize);
        if (ref.current) observer.observe(ref.current);
        const handleOrientationChange = () => {
            handleResize();
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleOrientationChange);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleOrientationChange);
            observer.disconnect();
        };
    }, [handleResize]);
    return { ref, ...size, refreshSize: handleResize };
};
export default useRefSize;
