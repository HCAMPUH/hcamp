declare const useRefSize: () => {
    refreshSize: () => void;
    width: number;
    height: number;
    ref: import("react").RefObject<HTMLDivElement | null>;
};
export default useRefSize;
