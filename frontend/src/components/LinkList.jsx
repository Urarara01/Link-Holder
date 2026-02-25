import React, { useState } from "react";
import ContextMenu from "./ContextMenu";

export default function LinkList({ links, onLinkClick, onLinkHover, onEditLink, onDeleteLink, onCopyLink, onReorderLinks }) {
    const [contextMenu, setContextMenu] = useState(null);
    const [hoveredLinkId, setHoveredLinkId] = useState(null);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const handleClick = (link) => {
        // Incrementar click_count y abrir el link
        if (onLinkClick) onLinkClick(link);
        window.open(link.url, '_blank');
    };

    const handleContextMenu = (e, link) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            link: link
        });
    };

    const handleOptionsClick = (e, link) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setContextMenu({
            x: rect.left,
            y: rect.bottom + 5,
            link: link
        });
    };

    const closeContextMenu = () => {
        setContextMenu(null);
    };

    // Drag handlers
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.classList.add('dragging');
    };

    const handleDragEnd = (e) => {
        e.currentTarget.classList.remove('dragging');
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== targetIndex) {
            const newLinks = [...links];
            const [removed] = newLinks.splice(draggedIndex, 1);
            newLinks.splice(targetIndex, 0, removed);
            onReorderLinks && onReorderLinks(newLinks.map(l => l.id));
        }
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const getContextMenuOptions = (link) => [
        {
            label: 'Abrir enlace',
            icon: '🔗',
            onClick: () => {
                window.open(link.url, '_blank');
                if (onLinkClick) onLinkClick(link);
            }
        },
        {
            label: 'Copiar URL',
            icon: '📋',
            onClick: () => {
                navigator.clipboard.writeText(link.url);
                if (onCopyLink) onCopyLink(link);
            }
        },
        { separator: true },
        {
            label: 'Editar',
            icon: '✏️',
            onClick: () => onEditLink && onEditLink(link)
        },
        { separator: true },
        {
            label: 'Eliminar',
            icon: '🗑️',
            danger: true,
            onClick: () => onDeleteLink && onDeleteLink(link)
        }
    ];

    return (
        <main className="link-list">
            {links.length === 0 ? (
                <div className="empty-state">
                    <p>No hay enlaces para mostrar</p>
                    <span>Usa la barra de búsqueda para agregar uno nuevo</span>
                </div>
            ) : (
                links.map((link, index) => (
                    <article 
                        key={link.id}
                        className={`link-card ${link.is_nsfw ? 'nsfw' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onClick={() => handleClick(link)}
                        onContextMenu={(e) => handleContextMenu(e, link)}
                        onMouseEnter={() => {
                            setHoveredLinkId(link.id);
                            onLinkHover && onLinkHover(link);
                        }}
                        onMouseLeave={() => setHoveredLinkId(null)}
                    >
                        <div className="link-drag-handle">
                            <span>⋮⋮</span>
                        </div>
                        <div className="link-favicon">
                            {link.favicon ? (
                                <img src={link.favicon} alt="" />
                            ) : link.snapshot ? (
                                <img src={link.snapshot} alt="" />
                            ) : (
                                <div className="favicon-placeholder">
                                    {link.domain?.charAt(0).toUpperCase() || '?'}
                                </div>
                            )}
                        </div>
                        <div className="link-content">
                            <h3 className="link-title">{link.title || link.name}</h3>
                            {link.description && (
                                <p className="link-description">{link.description}</p>
                            )}
                        </div>
                        <div className="link-meta">
                            {link.tags && link.tags.length > 0 && (
                                <div className="link-tags">
                                    {link.tags.slice(0, 3).map((tag, idx) => (
                                        <span key={idx} className="tag">{typeof tag === 'object' ? tag.name : tag}</span>
                                    ))}
                                    {link.tags.length > 3 && <span className="tag more">+{link.tags.length - 3}</span>}
                                </div>
                            )}
                            {link.is_nsfw && <span className="nsfw-indicator">NSFW</span>}
                        </div>
                        <button
                            className={`link-options-btn ${hoveredLinkId === link.id ? 'visible' : ''}`}
                            onClick={(e) => handleOptionsClick(e, link)}
                            title="Opciones"
                        >
                            <span className="dots">⋮</span>
                        </button>
                    </article>
                ))
            )}

            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    options={getContextMenuOptions(contextMenu.link)}
                    onClose={closeContextMenu}
                />
            )}
        </main>
    );
}
