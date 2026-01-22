
import { useEffect, useState } from 'react';

export const useDrag = (
    ref: React.RefObject<HTMLImageElement | null>,
    parentRef: React.RefObject<HTMLElement | null>,
    enable: boolean,
    onDrop: (x: number, y: number) => void
) => {
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const el = ref.current;
        const parent = parentRef.current;
        if (!el || !parent || !enable) return;

        let startX = 0;
        let startY = 0;
        let initialLeft = 0;
        let initialTop = 0;

        const onMouseDown = (e: MouseEvent) => {
            e.preventDefault(); // Prevent image dragging ghost
            setIsDragging(true);
            startX = e.clientX;
            startY = e.clientY;

            const rect = el.getBoundingClientRect();
            const parentRect = parent.getBoundingClientRect();

            // Current relative position
            initialLeft = rect.left - parentRect.left;
            initialTop = rect.top - parentRect.top;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            el.style.left = `${initialLeft + dx}px`;
            el.style.top = `${initialTop + dy}px`;
        };

        const onMouseUp = (e: MouseEvent) => {
            setIsDragging(false);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            // Calculate percentage position
            const rect = el.getBoundingClientRect();
            const parentRect = parent.getBoundingClientRect();

            // Constrain within parent (optional but good)

            const x = (rect.left - parentRect.left) / parentRect.width;
            const y = (rect.top - parentRect.top) / parentRect.height;

            onDrop(x, y);
        };

        el.addEventListener('mousedown', onMouseDown);
        return () => {
            el.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [ref, parentRef, enable, onDrop]);

    return { isDragging };
};
