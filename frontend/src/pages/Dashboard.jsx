import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../auth/HookAuth';
import NavDashboard from '../components/NavDashboard';
import Sidebar from '../components/Sidebar';
import LinkList from '../components/LinkList';
import DomainFilter from '../components/DomainFilter';
import Modal from '../components/Modal';
import LinkEditForm from '../components/LinkEditForm';
import CategoryCollectionForm, { generateRandomColor } from '../components/CategoryCollectionForm';
import api from '../api/axios';
import './Dashboard.css';

export default function Dashboard() {
    const { user, logout } = useAuth();
    
    // Estados para datos
    const [links, setLinks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);
    const [tags, setTags] = useState([]);
    
    // Estados para filtros
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [selectedDomains, setSelectedDomains] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    
    // Estado de carga
    const [loading, setLoading] = useState(true);

    // Estados para paneles móviles
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Estados para modales
    const [editingLink, setEditingLink] = useState(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingCollection, setEditingCollection] = useState(null);

    // Cargar datos al montar
    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [linksRes, categoriesRes, collectionsRes, tagsRes] = await Promise.all([
                api.get('/api/links/'),
                api.get('/api/categories/'),
                api.get('/api/collections/'),
                api.get('/api/tags/')
            ]);
            setLinks(linksRes.data);
            setCategories(categoriesRes.data);
            setCollections(collectionsRes.data);
            setTags(tagsRes.data);
        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper para detectar URLs
    const isUrl = (text) => {
        try {
            new URL(text);
            return true;
        } catch {
            return /^(https?:\/\/|www\.)/i.test(text) || /\.[a-z]{2,}(\/|$)/i.test(text);
        }
    };

    // Filtrar links según selección
    const filteredLinks = useMemo(() => {
        let result = [...links];
        
        // Filtrar por categoría
        if (selectedCategory) {
            result = result.filter(link => link.category === selectedCategory);
        }
        
        // Filtrar por colección
        if (selectedCollection) {
            const collection = collections.find(c => c.id === selectedCollection);
            if (collection) {
                const collectionLinkIds = collection.links || [];
                result = result.filter(link => collectionLinkIds.includes(link.id));
            }
        }
        
        // Filtrar por dominios seleccionados
        if (selectedDomains.length > 0) {
            result = result.filter(link => selectedDomains.includes(link.domain));
        }

        // Filtrar por tags seleccionados
        if (selectedTags.length > 0) {
            result = result.filter(link => {
                if (!link.tags || link.tags.length === 0) return false;
                // Verificar si el link tiene al menos uno de los tags seleccionados
                return link.tags.some(tag => {
                    const tagId = typeof tag === 'object' ? tag.id : tag;
                    return selectedTags.includes(tagId);
                });
            });
        }
        
        // Filtrar por búsqueda
        if (searchQuery && !isUrl(searchQuery)) {
            const query = searchQuery.toLowerCase();
            result = result.filter(link => 
                link.name?.toLowerCase().includes(query) ||
                link.title?.toLowerCase().includes(query) ||
                link.description?.toLowerCase().includes(query) ||
                link.url?.toLowerCase().includes(query) ||
                link.domain?.toLowerCase().includes(query)
            );
        }
        
        return result;
    }, [links, selectedCategory, selectedCollection, selectedDomains, selectedTags, searchQuery, collections]);

    // Extraer dominios únicos de los links filtrados
    const domains = useMemo(() => {
        const domainCounts = {};
        filteredLinks.forEach(link => {
            if (link.domain) {
                domainCounts[link.domain] = (domainCounts[link.domain] || 0) + 1;
            }
        });
        return Object.entries(domainCounts)
            .map(([domain, count]) => ({ domain, count }))
            .sort((a, b) => b.count - a.count);
    }, [filteredLinks]);

    // Handlers
    const handleSelectCategory = (catId) => {
        setSelectedCategory(selectedCategory === catId ? null : catId);
        setSelectedCollection(null); // Deseleccionar colección al seleccionar categoría
    };

    const handleSelectCollection = (colId) => {
        setSelectedCollection(selectedCollection === colId ? null : colId);
        setSelectedCategory(null); // Deseleccionar categoría al seleccionar colección
    };

    const handleToggleDomain = (domain) => {
        setSelectedDomains(prev => 
            prev.includes(domain) 
                ? prev.filter(d => d !== domain)
                : [...prev, domain]
        );
    };

    const handleToggleTag = (tagId) => {
        setSelectedTags(prev => 
            prev.includes(tagId) 
                ? prev.filter(t => t !== tagId)
                : [...prev, tagId]
        );
    };

    const handleClearFilters = () => {
        setSelectedDomains([]);
        setSelectedTags([]);
    };

    // Handlers de reordenamiento
    const handleReorderCategories = async (newOrder) => {
        // Actualizar estado local inmediatamente para UI fluida
        const reorderedCategories = newOrder.map(id => categories.find(c => c.id === id)).filter(Boolean);
        setCategories(reorderedCategories);
        // Persistir en backend
        try {
            await api.post('/api/categories/reorder/', { order: newOrder });
        } catch (error) {
            console.error('Error reordenando categorías:', error);
            loadData(); // Recargar datos si falla
        }
    };

    const handleReorderCollections = async (newOrder) => {
        const reorderedCollections = newOrder.map(id => collections.find(c => c.id === id)).filter(Boolean);
        setCollections(reorderedCollections);
        try {
            await api.post('/api/collections/reorder/', { order: newOrder });
        } catch (error) {
            console.error('Error reordenando colecciones:', error);
            loadData();
        }
    };

    const handleReorderLinks = async (newOrder) => {
        const reorderedLinks = newOrder.map(id => links.find(l => l.id === id)).filter(Boolean);
        setLinks(reorderedLinks);
        try {
            await api.post('/api/links/reorder/', { order: newOrder });
        } catch (error) {
            console.error('Error reordenando links:', error);
            loadData();
        }
    };

    const handleAddCategory = () => {
        setShowCategoryModal(true);
    };

    const handleAddCollection = () => {
        setShowCollectionModal(true);
    };

    // Función para obtener el título de una página automáticamente
    const fetchPageTitle = async (url) => {
        try {
            // Usamos nuestro backend de Django para obtener el título
            const response = await api.post('/api/fetch-title/', { url });
            return response.data.title || null;
        } catch (error) {
            console.log('No se pudo obtener el título automáticamente');
            return null;
        }
    };

    const handleAddLink = async (linkData) => {
        try {
            // Extraer dominio de la URL
            let url = linkData.url;
            if (!url.startsWith('http')) {
                url = 'https://' + url;
            }
            const urlObj = new URL(url);
            const domain = urlObj.hostname;

            // Si no hay nombre, intentar obtener el título automáticamente
            let name = linkData.name;
            let title = linkData.name;
            
            if (!name || name.trim() === '') {
                const fetchedTitle = await fetchPageTitle(url);
                name = fetchedTitle || domain;
                title = fetchedTitle || domain;
            }

            const newLink = {
                url: url,
                name: name,
                title: title,
                domain: domain,
                category: linkData.category || null,
                tags: linkData.selectedTags || []
            };

            const response = await api.post('/api/links/', newLink);
            setLinks(prev => [response.data, ...prev]);
        } catch (error) {
            console.error('Error agregando link:', error);
        }
    };

    // Handlers para edición de links
    const handleEditLink = (link) => {
        setEditingLink(link);
    };

    const handleSaveLink = async (updatedLink) => {
        try {
            const response = await api.patch(`/api/links/${updatedLink.id}/`, updatedLink);
            setLinks(prev => prev.map(l => l.id === updatedLink.id ? response.data : l));
            setEditingLink(null);
        } catch (error) {
            console.error('Error actualizando link:', error);
        }
    };

    const handleDeleteLink = async (link) => {
        if (!confirm(`¿Eliminar "${link.name || link.title}"?`)) return;
        try {
            await api.delete(`/api/links/${link.id}/`);
            setLinks(prev => prev.filter(l => l.id !== link.id));
            setEditingLink(null);
        } catch (error) {
            console.error('Error eliminando link:', error);
        }
    };

    const handleCopyLink = (link) => {
        // El copiado ya se hace en LinkList, esto es para feedback opcional
        console.log('URL copiada:', link.url);
    };

    // Handlers para categorías y colecciones
    const handleSaveCategory = async (categoryData) => {
        try {
            if (categoryData.id) {
                // Editar categoría existente
                const response = await api.patch(`/api/categories/${categoryData.id}/`, categoryData);
                setCategories(prev => prev.map(c => c.id === categoryData.id ? response.data : c));
            } else {
                // Crear nueva categoría
                const response = await api.post('/api/categories/', categoryData);
                setCategories(prev => [...prev, response.data]);
            }
            setShowCategoryModal(false);
            setEditingCategory(null);
        } catch (error) {
            console.error('Error guardando categoría:', error);
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setShowCategoryModal(true);
    };

    const handleDeleteCategory = async (category) => {
        if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) return;
        try {
            await api.delete(`/api/categories/${category.id}/`);
            setCategories(prev => prev.filter(c => c.id !== category.id));
            if (selectedCategory === category.id) {
                setSelectedCategory(null);
            }
        } catch (error) {
            console.error('Error eliminando categoría:', error);
        }
    };

    const handleSaveCollection = async (collectionData) => {
        try {
            if (collectionData.id) {
                // Editar colección existente
                const response = await api.patch(`/api/collections/${collectionData.id}/`, collectionData);
                setCollections(prev => prev.map(c => c.id === collectionData.id ? response.data : c));
            } else {
                // Crear nueva colección
                const response = await api.post('/api/collections/', collectionData);
                setCollections(prev => [...prev, response.data]);
            }
            setShowCollectionModal(false);
            setEditingCollection(null);
        } catch (error) {
            console.error('Error guardando colección:', error);
        }
    };

    const handleEditCollection = (collection) => {
        setEditingCollection(collection);
        setShowCollectionModal(true);
    };

    const handleDeleteCollection = async (collection) => {
        if (!confirm(`¿Eliminar la colección "${collection.name}"?`)) return;
        try {
            await api.delete(`/api/collections/${collection.id}/`);
            setCollections(prev => prev.filter(c => c.id !== collection.id));
            if (selectedCollection === collection.id) {
                setSelectedCollection(null);
            }
        } catch (error) {
            console.error('Error eliminando colección:', error);
        }
    };

    const handleLinkClick = async (link) => {
        try {
            // Incrementar click_count
            await api.patch(`/api/links/${link.id}/`, {
                click_count: (link.click_count || 0) + 1,
                last_opened: new Date().toISOString()
            });
            // Actualizar estado local
            setLinks(prev => prev.map(l => 
                l.id === link.id 
                    ? { ...l, click_count: (l.click_count || 0) + 1, last_opened: new Date().toISOString() }
                    : l
            ));
        } catch (error) {
            console.error('Error actualizando link:', error);
        }
    };

    return (
        <div className="dashboard">
            <NavDashboard 
                user={user} 
                logout={logout}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onAddLink={handleAddLink}
                categories={categories}
                tags={tags}
                existingLinks={links}
            />

            {/* Botones de toggle para móvil */}
            <div className="mobile-toggle-buttons">
                <button 
                    className={`mobile-toggle-btn ${showMobileSidebar ? 'active' : ''}`}
                    onClick={() => { setShowMobileSidebar(!showMobileSidebar); setShowMobileFilters(false); }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                    <span>Categorías</span>
                </button>
                <button 
                    className={`mobile-toggle-btn ${showMobileFilters ? 'active' : ''}`}
                    onClick={() => { setShowMobileFilters(!showMobileFilters); setShowMobileSidebar(false); }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    <span>Filtros</span>
                </button>
            </div>
            
            <div className="dashboard-content">
                {/* Panel de Sidebar con backdrop para móvil */}
                {showMobileSidebar && (
                    <div 
                        className="mobile-panel-backdrop"
                        onClick={() => setShowMobileSidebar(false)}
                    />
                )}
                <div className={`sidebar-wrapper ${showMobileSidebar ? 'mobile-visible' : ''}`}>
                    <Sidebar 
                        categories={categories}
                        collections={collections}
                        selectedCategory={selectedCategory}
                        selectedCollection={selectedCollection}
                        onSelectCategory={handleSelectCategory}
                        onSelectCollection={handleSelectCollection}
                        onAddCategory={handleAddCategory}
                        onAddCollection={handleAddCollection}
                        onEditCategory={handleEditCategory}
                        onDeleteCategory={handleDeleteCategory}
                        onEditCollection={handleEditCollection}
                        onDeleteCollection={handleDeleteCollection}
                        onReorderCategories={handleReorderCategories}
                        onReorderCollections={handleReorderCollections}
                        onCloseMobile={() => setShowMobileSidebar(false)}
                    />
                </div>
                
                {loading ? (
                    <main className="link-list loading">
                        <div className="loader">Cargando...</div>
                    </main>
                ) : (
                    <LinkList 
                        links={filteredLinks}
                        onLinkClick={handleLinkClick}
                        onEditLink={handleEditLink}
                        onDeleteLink={handleDeleteLink}
                        onCopyLink={handleCopyLink}
                        onReorderLinks={handleReorderLinks}
                    />
                )}
                
                {/* Panel de Filtros con backdrop para móvil */}
                {showMobileFilters && (
                    <div 
                        className="mobile-panel-backdrop"
                        onClick={() => setShowMobileFilters(false)}
                    />
                )}
                <div className={`filters-wrapper ${showMobileFilters ? 'mobile-visible' : ''}`}>
                    <DomainFilter 
                        domains={domains}
                        selectedDomains={selectedDomains}
                        onToggleDomain={handleToggleDomain}
                        tags={tags}
                        selectedTags={selectedTags}
                        onToggleTag={handleToggleTag}
                        onClearFilters={handleClearFilters}
                        onCloseMobile={() => setShowMobileFilters(false)}
                    />
                </div>
            </div>

            {/* Modal para editar link */}
            <Modal
                isOpen={!!editingLink}
                onClose={() => setEditingLink(null)}
                title="Editar enlace"
            >
                {editingLink && (
                    <LinkEditForm
                        link={editingLink}
                        categories={categories}
                        tags={tags}
                        onSave={handleSaveLink}
                        onCancel={() => setEditingLink(null)}
                        onDelete={handleDeleteLink}
                    />
                )}
            </Modal>

            {/* Modal para crear/editar categoría */}
            <Modal
                isOpen={showCategoryModal}
                onClose={() => { setShowCategoryModal(false); setEditingCategory(null); }}
                title={editingCategory ? "Editar categoría" : "Nueva categoría"}
            >
                <CategoryCollectionForm
                    type="category"
                    editingItem={editingCategory}
                    onSave={handleSaveCategory}
                    onCancel={() => { setShowCategoryModal(false); setEditingCategory(null); }}
                />
            </Modal>

            {/* Modal para crear/editar colección */}
            <Modal
                isOpen={showCollectionModal}
                onClose={() => { setShowCollectionModal(false); setEditingCollection(null); }}
                title={editingCollection ? "Editar colección" : "Nueva colección"}
            >
                <CategoryCollectionForm
                    type="collection"
                    existingLinks={links}
                    editingItem={editingCollection}
                    onSave={handleSaveCollection}
                    onCancel={() => { setShowCollectionModal(false); setEditingCollection(null); }}
                />
            </Modal>
        </div>
    );
}