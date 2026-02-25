import React, { useState, useEffect } from "react";

export default function LinkEditForm({ link, categories, tags, onSave, onCancel, onDelete }) {
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        url: '',
        description: '',
        category: '',
        is_nsfw: false,
        selectedTags: []
    });

    useEffect(() => {
        if (link) {
            setFormData({
                name: link.name || '',
                title: link.title || '',
                url: link.url || '',
                description: link.description || '',
                category: link.category || '',
                is_nsfw: link.is_nsfw || false,
                selectedTags: link.tags || []
            });
        }
    }, [link]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleTag = (tagId) => {
        setFormData(prev => ({
            ...prev,
            selectedTags: prev.selectedTags.includes(tagId)
                ? prev.selectedTags.filter(t => t !== tagId)
                : [...prev.selectedTags, tagId]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...link,
            ...formData,
            tags: formData.selectedTags
        });
    };

    return (
        <form className="link-edit-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Nombre</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nombre del enlace"
                />
            </div>

            <div className="form-group">
                <label>Título</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Título de la página"
                />
            </div>

            <div className="form-group">
                <label>URL</label>
                <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://..."
                    required
                />
            </div>

            <div className="form-group">
                <label>Descripción</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descripción opcional"
                    rows={3}
                />
            </div>

            <div className="form-group">
                <label>Categoría</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value="">Sin categoría</option>
                    {categories?.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Etiquetas</label>
                <div className="tags-selector">
                    {tags?.map(tag => (
                        <span
                            key={tag.id}
                            className={`tag-option ${formData.selectedTags.includes(tag.id) ? 'selected' : ''}`}
                            onClick={() => toggleTag(tag.id)}
                        >
                            {tag.name}
                        </span>
                    ))}
                    {(!tags || tags.length === 0) && (
                        <span className="no-tags">No hay etiquetas disponibles</span>
                    )}
                </div>
            </div>

            <div className="form-group checkbox-group">
                <label>
                    <input
                        type="checkbox"
                        name="is_nsfw"
                        checked={formData.is_nsfw}
                        onChange={handleChange}
                    />
                    Contenido NSFW
                </label>
            </div>

            <div className="form-actions">
                {onDelete && (
                    <button type="button" className="btn-delete" onClick={() => onDelete(link)}>
                        Eliminar
                    </button>
                )}
                <div className="form-actions-right">
                    <button type="button" className="btn-cancel" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-save">
                        Guardar
                    </button>
                </div>
            </div>
        </form>
    );
}
