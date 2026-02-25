import React, { useState } from "react";

export default function DomainFilter({ 
    domains, 
    selectedDomains, 
    onToggleDomain,
    tags,
    selectedTags,
    onToggleTag,
    onClearFilters,
    onCloseMobile
}) {
    const [activeSection, setActiveSection] = useState('domains'); // 'domains' | 'tags'
    
    const hasActiveFilters = selectedDomains.length > 0 || selectedTags.length > 0;

    return (
        <aside className="sidebar-right">
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

            {/* Header con botón limpiar */}
            <div className="filter-header">
                <span className="filter-title">Filtros</span>
                {hasActiveFilters && (
                    <button 
                        className="clear-filters-btn"
                        onClick={onClearFilters}
                        title="Limpiar filtros"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Pestañas */}
            <div className="filter-tabs">
                <button 
                    className={`filter-tab ${activeSection === 'domains' ? 'active' : ''}`}
                    onClick={() => setActiveSection('domains')}
                >
                    Dominios
                    {selectedDomains.length > 0 && (
                        <span className="filter-badge">{selectedDomains.length}</span>
                    )}
                </button>
                <button 
                    className={`filter-tab ${activeSection === 'tags' ? 'active' : ''}`}
                    onClick={() => setActiveSection('tags')}
                >
                    Tags
                    {selectedTags.length > 0 && (
                        <span className="filter-badge">{selectedTags.length}</span>
                    )}
                </button>
            </div>

            {/* Lista de filtros */}
            <div className="filter-list">
                {activeSection === 'domains' ? (
                    domains.length === 0 ? (
                        <div className="empty-filters">
                            <span>Sin dominios</span>
                        </div>
                    ) : (
                        domains.map((item, idx) => (
                            <div 
                                key={idx}
                                className={`filter-item ${selectedDomains.includes(item.domain) ? 'active' : ''}`}
                                onClick={() => onToggleDomain(item.domain)}
                            >
                                <span className="filter-name">{item.domain}</span>
                                {item.count > 1 && (
                                    <span className="filter-count">{item.count}</span>
                                )}
                            </div>
                        ))
                    )
                ) : (
                    tags.length === 0 ? (
                        <div className="empty-filters">
                            <span>Sin tags</span>
                        </div>
                    ) : (
                        tags.map((tag) => (
                            <div 
                                key={tag.id}
                                className={`filter-item tag-item ${selectedTags.includes(tag.id) ? 'active' : ''}`}
                                onClick={() => onToggleTag(tag.id)}
                            >
                                <span className="filter-name">{tag.name}</span>
                            </div>
                        ))
                    )
                )}
            </div>

            {/* Filtros activos */}
            {hasActiveFilters && (
                <div className="active-filters">
                    <span className="active-filters-label">Activos:</span>
                    <div className="active-filters-list">
                        {selectedDomains.map((domain, idx) => (
                            <span 
                                key={`d-${idx}`} 
                                className="active-filter-chip domain-chip"
                                onClick={() => onToggleDomain(domain)}
                            >
                                {domain} ✕
                            </span>
                        ))}
                        {selectedTags.map((tagId) => {
                            const tag = tags.find(t => t.id === tagId);
                            return tag ? (
                                <span 
                                    key={`t-${tagId}`} 
                                    className="active-filter-chip tag-chip"
                                    onClick={() => onToggleTag(tagId)}
                                >
                                    {tag.name} ✕
                                </span>
                            ) : null;
                        })}
                    </div>
                </div>
            )}
        </aside>
    );
}
