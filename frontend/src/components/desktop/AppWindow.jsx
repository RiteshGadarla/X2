import React, { useState, useRef, useEffect } from 'react';

const AppWindow = ({ children, title = "aegis.ai", testId, isMaximized, onClose, onMinimize, onMaximize, zIndex = 1, onFocus }) => {
    const windowRef = useRef(null);
    const [pos, setPos] = useState({ x: null, y: null });
    const dragging = useRef(false);
    const dragOrigin = useRef(null);

    const startDrag = (e) => {
        if (isMaximized) return;
        e.preventDefault();
        const rect = windowRef.current.getBoundingClientRect();
        if (pos.x === null) setPos({ x: rect.left, y: rect.top });
        dragOrigin.current = {
            mouseX: e.clientX, mouseY: e.clientY,
            winX: rect.left, winY: rect.top,
        };
        dragging.current = true;
    };

    useEffect(() => {
        const onMove = (e) => {
            if (!dragging.current || !dragOrigin.current) return;
            const { mouseX, mouseY, winX, winY } = dragOrigin.current;
            setPos({
                x: winX + (e.clientX - mouseX),
                y: Math.max(0, winY + (e.clientY - mouseY)),
            });
        };
        const onUp = () => { dragging.current = false; };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, []);

    const inlineStyle = isMaximized
        ? { zIndex }
        : pos.x !== null
            ? { left: pos.x, top: pos.y, transform: 'none', zIndex }
            : { zIndex };

    return (
        <div
            ref={windowRef}
            className={`app-window${isMaximized ? ' maximized' : ''}`}
            style={inlineStyle}
            onMouseDownCapture={onFocus}
            data-testid={testId || 'app-window'}
        >
            {/* Title bar with 3 buttons */}
            <div className="win-titlebar" onMouseDown={startDrag}>
                <span className="win-title">{title}</span>
                <div className="win-controls">
                    <button
                        className="win-btn wc-minimize"
                        onMouseDown={e => e.stopPropagation()}
                        onClick={onMinimize}
                        title="Minimize"
                        id={testId ? `${testId.replace(/-/g, '_')}_minimize_btn` : 'window_minimize_btn'}
                        data-testid={testId ? `${testId}-minimize-btn` : 'window-minimize-btn'}
                    >
                        <svg className="win-btn-icon" viewBox="0 0 10 10" fill="none">
                            <path d="M1 5h8" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
                        </svg>
                    </button>
                    <button
                        className="win-btn wc-maximize"
                        onMouseDown={e => e.stopPropagation()}
                        onClick={onMaximize}
                        title={isMaximized ? 'Restore' : 'Maximize'}
                        id={testId ? `${testId.replace(/-/g, '_')}_maximize_btn` : 'window_maximize_btn'}
                        data-testid={testId ? `${testId}-maximize-btn` : 'window-maximize-btn'}
                    >
                        <svg className="win-btn-icon" viewBox="0 0 10 10" fill="none">
                            {isMaximized
                                ? <path d="M3 3h4v4H3z M2 2h4 M2 6v-4" stroke="currentColor" strokeWidth="1" />
                                : <path d="M1.5 1.5h7v7h-7z" stroke="currentColor" strokeWidth="1" />
                            }
                        </svg>
                    </button>
                    <button
                        className="win-btn wc-close"
                        onMouseDown={e => e.stopPropagation()}
                        onClick={onClose}
                        title="Close"
                        id={testId ? `${testId.replace(/-/g, '_')}_close_btn` : 'window_close_btn'}
                        data-testid={testId ? `${testId}-close-btn` : 'window-close-btn'}
                    >
                        <svg className="win-btn-icon" viewBox="0 0 10 10" fill="none">
                            <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Window content */}
            <div className="win-body">
                {children}
            </div>
        </div>
    );
};

export default AppWindow;
