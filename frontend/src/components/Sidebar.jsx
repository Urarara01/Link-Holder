import React, { useState } from "react";
import ContextMenu from "./ContextMenu";

export default function Sidebar({ 
    categories, 
    collections, 
    selectedCategory, 
    selectedCollection, 
    onSelectCategory, 
    onSelectCollection, 
    onAddCategory, 
    onAddCollection,
    onEditCategory,
    onDeleteCategory,
    onEditCollection,
    onDeleteCollection,
    onReorderCategories,
    onReorderCollections,
    onCloseMobile
}) {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverItem, setDragOverItem] = useState(null);

    const handleContextMenu = (e, type, item) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            type,
            item
        });
    };

    const closeContextMenu = () => {
        setContextMenu(null);
    };

    // Drag handlers para categorías
    const handleDragStartCategory = (e, cat, index) => {
        setDraggedItem({ type: 'category', item: cat, index });
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.classList.add('dragging');
    };

    const handleDragEndCategory = (e) => {
        e.currentTarget.classList.remove('dragging');
        setDraggedItem(null);
        setDragOverItem(null);
    };

    const handleDragOverCategory = (e, index) => {
        e.preventDefault();
        if (draggedItem?.type === 'category' && draggedItem.index !== index) {
            setDragOverItem({ type: 'category', index });
        }
    };

    const handleDropCategory = (e, targetIndex) => {
        e.preventDefault();
        if (draggedItem?.type === 'category' && draggedItem.index !== targetIndex) {
            const newCategories = [...categories];
            const [removed] = newCategories.splice(draggedItem.index, 1);
            newCategories.splice(targetIndex, 0, removed);
            onReorderCategories && onReorderCategories(newCategories.map(c => c.id));
        }
        setDraggedItem(null);
        setDragOverItem(null);
    };

    // Drag handlers para colecciones
    const handleDragStartCollection = (e, col, index) => {
        setDraggedItem({ type: 'collection', item: col, index });
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.classList.add('dragging');
    };

    const handleDragEndCollection = (e) => {
        e.currentTarget.classList.remove('dragging');
        setDraggedItem(null);
        setDragOverItem(null);
    };

    const handleDragOverCollection = (e, index) => {
        e.preventDefault();
        if (draggedItem?.type === 'collection' && draggedItem.index !== index) {
            setDragOverItem({ type: 'collection', index });
        }
    };

    const handleDropCollection = (e, targetIndex) => {
        e.preventDefault();
        if (draggedItem?.type === 'collection' && draggedItem.index !== targetIndex) {
            const newCollections = [...collections];
            const [removed] = newCollections.splice(draggedItem.index, 1);
            newCollections.splice(targetIndex, 0, removed);
            onReorderCollections && onReorderCollections(newCollections.map(c => c.id));
        }
        setDraggedItem(null);
        setDragOverItem(null);
    };

    const getCategoryMenuOptions = (category) => [
        {
            label: 'Editar categoría',
            icon: '✏️',
            onClick: () => onEditCategory && onEditCategory(category)
        },
        { separator: true },
        {
            label: 'Eliminar',
            icon: '🗑️',
            danger: true,
            onClick: () => onDeleteCategory && onDeleteCategory(category)
        }
    ];

    const getCollectionMenuOptions = (collection) => [
        {
            label: 'Editar colección',
            icon: '✏️',
            onClick: () => onEditCollection && onEditCollection(collection)
        },
        { separator: true },
        {
            label: 'Eliminar',
            icon: '🗑️',
            danger: true,
            onClick: () => onDeleteCollection && onDeleteCollection(collection)
        }
    ];

    return (
        <aside className="sidebar-left">
            {/* Botón cerrar para móvil */}
            {onCloseMobile && (
                <button className="mobile-close-btn" onClick={onCloseMobile}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span>Cerrar</span>
                </button>
            )}

            {/* Botón agregar categoría */}
            <div 
                className="sidebar-item add-item"
                onMouseEnter={() => setHoveredItem('add-cat')}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={onAddCategory}
            >
                <div className="sidebar-circle">
                    <span>+</span>
                </div>
                {hoveredItem === 'add-cat' && (
                    <div className="sidebar-tooltip">
                        <span>Nueva categoría</span>
                    </div>
                )}
            </div>

            {/* Categorías */}
            {categories.map((cat, index) => (
                <div 
                    key={`cat-${cat.id}`}
                    className={`sidebar-item ${selectedCategory === cat.id ? 'active' : ''} ${dragOverItem?.type === 'category' && dragOverItem.index === index ? 'drag-over' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStartCategory(e, cat, index)}
                    onDragEnd={handleDragEndCategory}
                    onDragOver={(e) => handleDragOverCategory(e, index)}
                    onDrop={(e) => handleDropCategory(e, index)}
                    onMouseEnter={() => setHoveredItem(`cat-${cat.id}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => onSelectCategory(cat.id)}
                    onContextMenu={(e) => handleContextMenu(e, 'category', cat)}
                >
                    <div 
                        className="sidebar-circle"
                        style={{ backgroundColor: cat.color || '#667eea' }}
                    >
                        {cat.icon ? (
                            <img src={cat.icon} alt={cat.name} />
                        ) : (
                            <span>{cat.name.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    {hoveredItem === `cat-${cat.id}` && !draggedItem && (
                        <div className="sidebar-tooltip">
                            <strong>{cat.name}</strong>
                            {cat.description && <p>{cat.description}</p>}
                            {cat.is_nsfw && <span className="nsfw-badge">NSFW</span>}
                        </div>
                    )}
                </div>
            ))}

            {/* Separador */}
            <div className="sidebar-separator" />

            {/* Botón agregar colección */}
            <div 
                className="sidebar-item add-item"
                onMouseEnter={() => setHoveredItem('add-col')}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={onAddCollection}
            >
                <div className="sidebar-circle collection-circle">
                    <span>+</span>
                </div>
                {hoveredItem === 'add-col' && (
                    <div className="sidebar-tooltip">
                        <span>Nueva colección</span>
                    </div>
                )}
            </div>

            {/* Colecciones */}
            {collections.map((col, index) => (
                <div 
                    key={`col-${col.id}`}
                    className={`sidebar-item collection ${selectedCollection === col.id ? 'active' : ''} ${dragOverItem?.type === 'collection' && dragOverItem.index === index ? 'drag-over' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStartCollection(e, col, index)}
                    onDragEnd={handleDragEndCollection}
                    onDragOver={(e) => handleDragOverCollection(e, index)}
                    onDrop={(e) => handleDropCollection(e, index)}
                    onMouseEnter={() => setHoveredItem(`col-${col.id}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => onSelectCollection(col.id)}
                    onContextMenu={(e) => handleContextMenu(e, 'collection', col)}
                >
                    <div className="sidebar-circle collection-circle">
                        <span>{col.name.charAt(0).toUpperCase()}</span>
                    </div>
                    {hoveredItem === `col-${col.id}` && !draggedItem && (
                        <div className="sidebar-tooltip">
                            <strong>{col.name}</strong>
                            {col.description && <p>{col.description}</p>}
                            <span className="link-count">{col.links?.length || 0} enlaces</span>
                        </div>
                    )}
                </div>
            ))}

            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    options={
                        contextMenu.type === 'category' 
                            ? getCategoryMenuOptions(contextMenu.item)
                            : getCollectionMenuOptions(contextMenu.item)
                    }
                    onClose={closeContextMenu}
                />
            )}
        </aside>
    );
}
