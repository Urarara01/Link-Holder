import React, { useState, useRef, useEffect } from "react";

export default function SearchBar({ 
    searchQuery, 
    onSearchChange, 
    onAddLink, 
    categories, 
    tags,
    existingLinks 
}) {
    const [showAddLink, setShowAddLink] = useState(false);
    const [newLinkData, setNewLinkData] = useState({
        url: '',
        name: '',
        category: '',
        selectedTags: []
    });
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);

    // Detectar si el input parece una URL
    const isUrl = (text) => {
        if (!text) return false;
        try {
            new URL(text);
            return true;
        } catch {
            return /^(https?:\/\/|www\.)/i.test(text) || /\.[a-z]{2,}(\/|$)/i.test(text);
        }
    };

    // Verificar si el enlace ya existe
    const linkExists = (url) => {
        if (!url || !existingLinks) return false;
        const normalizedUrl = url.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
        return existingLinks.some(link => {
            const existingUrl = link.url?.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
            return existingUrl === normalizedUrl;
        });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        onSearchChange(value);
        
        // Si parece URL y no existe, mostrar opción de agregar
        if (isUrl(value) && !linkExists(value)) {
            setShowAddLink(true);
            setNewLinkData(prev => ({ ...prev, url: value }));
        } else {
            setShowAddLink(false);
        }
    };

    const handleAddLink = () => {
        if (onAddLink && newLinkData.url) {
            onAddLink(newLinkData);
            setShowAddLink(false);
            setNewLinkData({ url: '', name: '', category: '', selectedTags: [] });
            onSearchChange('');
        }
    };

    const toggleTag = (tagId) => {
        setNewLinkData(prev => ({
            ...prev,
            selectedTags: prev.selectedTags.includes(tagId)
                ? prev.selectedTags.filter(t => t !== tagId)
                : [...prev.selectedTags, tagId]
        }));
    };

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                searchRef.current && !searchRef.current.contains(event.target)) {
                setShowAddLink(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="search-container">
            <input 
                ref={searchRef}
                type="text" 
                placeholder="🔍 Buscar..." 
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            {showAddLink && (
                <div className="add-link-dropdown" ref={dropdownRef}>
                    <p className="add-link-prompt">Este enlace no existe. ¿Deseas agregarlo?</p>
                    <input 
                        type="text"
                        placeholder="Nombre del enlace"
                        className="add-link-input"
                        value={newLinkData.name}
                        onChange={(e) => setNewLinkData(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <select 
                        className="add-link-select"
                        value={newLinkData.category}
                        onChange={(e) => setNewLinkData(prev => ({ ...prev, category: e.target.value }))}
                    >
                        <option value="">Seleccionar categoría...</option>
                        {categories?.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {tags && tags.length > 0 && (
                        <div className="add-link-tags">
                            <span className="tags-label">Etiquetas:</span>
                            <div className="tags-list">
                                {tags.map(tag => (
                                    <span 
                                        key={tag.id}
                                        className={`tag-option ${newLinkData.selectedTags.includes(tag.id) ? 'selected' : ''}`}
                                        onClick={() => toggleTag(tag.id)}
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <button className="add-link-btn" onClick={handleAddLink}>
                        Agregar enlace
                    </button>
                </div>
            )}
        </div>
    );
}
