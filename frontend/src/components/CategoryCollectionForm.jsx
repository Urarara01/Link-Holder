import React, { useState, useEffect } from "react";

// Genera un color aleatorio en formato hexadecimal
const generateRandomColor = () => {
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', 
        '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140',
        '#30cfd0', '#330867', '#a8edea', '#fed6e3', '#5ee7df',
        '#b490ca', '#5c258d', '#4389a2', '#7c3aed', '#10b981'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

export default function CategoryCollectionForm({ type, onSave, onCancel, existingLinks, editingItem }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: generateRandomColor(),
        icon: '',
        is_nsfw: false,
        selectedLinks: [] // Solo para colecciones
    });

    // Cargar datos cuando se está editando
    useEffect(() => {
        if (editingItem) {
            setFormData({
                name: editingItem.name || '',
                description: editingItem.description || '',
                color: editingItem.color || generateRandomColor(),
                icon: editingItem.icon || '',
                is_nsfw: editingItem.is_nsfw || false,
                selectedLinks: editingItem.links || []
            });
        }
    }, [editingItem]);

    const handleChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: inputType === 'checkbox' ? checked : value
        }));
    };

    const toggleLink = (linkId) => {
        setFormData(prev => ({
            ...prev,
            selectedLinks: prev.selectedLinks.includes(linkId)
                ? prev.selectedLinks.filter(l => l !== linkId)
                : [...prev.selectedLinks, linkId]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;
        
        const data = {
            name: formData.name,
            description: formData.description || null
        };

        // Incluir ID si estamos editando
        if (editingItem) {
            data.id = editingItem.id;
        }

        if (type === 'category') {
            data.color = formData.color;
            data.icon = formData.icon || null;
            data.is_nsfw = formData.is_nsfw;
        } else {
            data.links = formData.selectedLinks;
        }

        onSave(data);
    };

    const isEditing = !!editingItem;

    return (
        <form className="category-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Nombre *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={type === 'category' ? 'Nombre de la categoría' : 'Nombre de la colección'}
                    required
                    autoFocus
                />
            </div>

            <div className="form-group">
                <label>Descripción</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descripción opcional"
                    rows={2}
                />
            </div>

            {type === 'category' && (
                <>
                    <div className="form-group">
                        <label>Color</label>
                        <div className="color-picker">
                            <input
                                type="color"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                            />
                            <span className="color-value">{formData.color}</span>
                            <button 
                                type="button" 
                                className="btn-random-color"
                                onClick={() => setFormData(prev => ({ ...prev, color: generateRandomColor() }))}
                            >
                                🎲
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>URL del icono (opcional)</label>
                        <input
                            type="url"
                            name="icon"
                            value={formData.icon}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="is_nsfw"
                                checked={formData.is_nsfw}
                                onChange={handleChange}
                            />
                            Categoría NSFW
                        </label>
                    </div>
                </>
            )}

            {type === 'collection' && existingLinks && existingLinks.length > 0 && (
                <div className="form-group">
                    <label>Enlaces a incluir</label>
                    <div className="links-selector">
                        {existingLinks.map(link => (
                            <div
                                key={link.id}
                                className={`link-option ${formData.selectedLinks.includes(link.id) ? 'selected' : ''}`}
                                onClick={() => toggleLink(link.id)}
                            >
                                <span className="link-option-name">{link.name || link.title}</span>
                                <span className="link-option-domain">{link.domain}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className="btn-save">
                    {isEditing ? 'Guardar cambios' : `Crear ${type === 'category' ? 'Categoría' : 'Colección'}`}
                </button>
            </div>
        </form>
    );
}

export { generateRandomColor };
