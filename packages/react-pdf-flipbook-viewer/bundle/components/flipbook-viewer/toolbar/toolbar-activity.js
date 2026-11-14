const HIDE_DELAY = 3000;

export function setupToolbarActivity(container, toolbar) {
    let timer;
    let keyboardInteraction = false;
    const activePointers = new Set();

    const scheduleHide = () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
            if (activePointers.size > 0 || (keyboardInteraction && toolbar.contains(document.activeElement))) return;
            toolbar.style.visibility = 'hidden';
            toolbar.inert = true;
            toolbar.setAttribute('aria-hidden', 'true');
        }, HIDE_DELAY);
    };

    const show = () => {
        toolbar.style.visibility = '';
        toolbar.inert = false;
        toolbar.removeAttribute('aria-hidden');
        scheduleHide();
    };

    const onPointerDown = (event) => {
        keyboardInteraction = false;
        activePointers.add(event.pointerId);
        show();
    };
    const onPointerEnd = (event) => {
        if (activePointers.delete(event.pointerId)) scheduleHide();
    };
    const onKeyDown = () => {
        keyboardInteraction = true;
        show();
    };
    const onFocusIn = () => show();
    const onFocusOut = () => scheduleHide();

    container.addEventListener('pointermove', show, { passive: true });
    container.addEventListener('pointerdown', onPointerDown, { passive: true });
    container.addEventListener('touchstart', show, { passive: true });
    container.addEventListener('click', show);
    container.addEventListener('keydown', onKeyDown);
    container.addEventListener('focusin', onFocusIn);
    container.addEventListener('focusout', onFocusOut);
    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);
    show();

    return () => {
        window.clearTimeout(timer);
        container.removeEventListener('pointermove', show);
        container.removeEventListener('pointerdown', onPointerDown);
        container.removeEventListener('touchstart', show);
        container.removeEventListener('click', show);
        container.removeEventListener('keydown', onKeyDown);
        container.removeEventListener('focusin', onFocusIn);
        container.removeEventListener('focusout', onFocusOut);
        window.removeEventListener('pointerup', onPointerEnd);
        window.removeEventListener('pointercancel', onPointerEnd);
    };
}
