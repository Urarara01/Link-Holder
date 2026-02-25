import React, { useEffect, useRef } from "react";

export default function ContextMenu({ x, y, onClose, options }) {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    // Ajustar posición si el menú se sale de la pantalla
    const adjustedX = Math.min(x, window.innerWidth - 180);
    const adjustedY = Math.min(y, window.innerHeight - (options.length * 40 + 20));

    return (
        <div 
            ref={menuRef}
            className="context-menu"
            style={{ 
                position: 'fixed',
                top: adjustedY,
                left: adjustedX,
                zIndex: 1000
            }}
        >
            {options.map((option, index) => (
                option.separator ? (
                    <div key={index} className="context-menu-separator" />
                ) : (
                    <button
                        key={index}
                        className={`context-menu-item ${option.danger ? 'danger' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            option.onClick();
                            onClose();
                        }}
                    >
                        {option.icon && <span className="context-menu-icon">{option.icon}</span>}
                        {option.label}
                    </button>
                )
            ))}
        </div>
    );
}
