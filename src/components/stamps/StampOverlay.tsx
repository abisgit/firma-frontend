
import { useRef, useState } from 'react';
import { useDrag } from '../../hooks/useDrag';

interface StampOverlayProps {
    imageUrl: string;
    initialX?: number; // 0-1 percentage
    initialY?: number; // 0-1 percentage
    editable: boolean;
    onPositionChange?: (x: number, y: number) => void;
    parentRef: React.RefObject<HTMLElement | null>;
}

export default function StampOverlay({
    imageUrl,
    initialX = 0.8, // Default bottom rightish
    initialY = 0.8,
    editable,
    onPositionChange,
    parentRef
}: StampOverlayProps) {
    const imgRef = useRef<HTMLImageElement>(null);

    // Convert percentage to initial CSS styles if needed, but easier to use useEffect to set once mount?
    // Actually, we can use style={{ left: `${initialX * 100}%`, top: ... }}
    // But drag logic uses pixels.
    // My useDrag sets style.left/top in pixels.
    // So distinct render logic:

    const { isDragging } = useDrag(imgRef, parentRef, editable, (x, y) => {
        if (onPositionChange) onPositionChange(x, y);
    });

    return (
        <img
            ref={imgRef}
            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${imageUrl}`}
            alt="Signature Stamp"
            className={`absolute max-w-[150px] max-h-[100px] object-contain z-10 transition-shadow ${editable ? 'cursor-move hover:drop-shadow-lg' : ''} ${isDragging ? 'opacity-80' : ''}`}
            style={{
                left: `${(initialX || 0.8) * 100}%`,
                top: `${(initialY || 0.8) * 100}%`,
                // We might need to adjust for element size if we want X/Y to be center? 
                // Currently X/Y is Top-Left corner percentage.
            }}
            draggable={false} // Disable native drag
        />
    );
}
